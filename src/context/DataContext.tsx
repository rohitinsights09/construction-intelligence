import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { ConstructionProject, FilterState, PortfolioKPIs, DataQualityReport, NavigationTab } from '../types';
import { parseConstructionCSV } from '../utils/dataProcessing';
import { calculatePortfolioKPIs, generateDeterministicExecutiveInsights, ExecutiveInsight } from '../utils/analytics';

interface DataContextType {
  projects: ConstructionProject[];
  filteredProjects: ConstructionProject[];
  kpis: PortfolioKPIs;
  qualityReport: DataQualityReport;
  executiveInsights: ExecutiveInsight[];
  isLoading: boolean;
  error: string | null;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedProject: ConstructionProject | null;
  setSelectedProject: (project: ConstructionProject | null) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  importCSV: (csvString: string, filename?: string) => boolean;
  resetToDefaultDataset: () => void;
  exportFilteredCSV: () => void;
  datasetSource: string;
  lastUpdated: Date;
}

const initialFilters: FilterState = {
  search: '',
  projectType: 'All',
  location: 'All',
  riskLevel: 'All',
  weather: 'All',
  anomalyOnly: false,
  attentionOnly: false,
  costOverrunOnly: false,
  delayedOnly: false,
  completionRange: [0, 100],
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rawCSV, setRawCSV] = useState<string>('');
  const [datasetSource, setDatasetSource] = useState<string>('BIM-AI Integrated Construction Dataset');
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [selectedProject, setSelectedProject] = useState<ConstructionProject | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Load default dataset on mount
  useEffect(() => {
    async function loadDataset() {
      setIsLoading(true);
      try {
        const response = await fetch('/data/bim_construction_dataset.csv');
        if (!response.ok) {
          throw new Error('Failed to load dataset file');
        }
        const text = await response.text();
        setRawCSV(text);
        setLastUpdated(new Date());
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error fetching CSV:', err);
        setError('Error loading the construction dataset.');
        setIsLoading(false);
      }
    }

    loadDataset();
  }, []);

  // Parse raw CSV
  const { projects, qualityReport } = useMemo(() => {
    if (!rawCSV) {
      return {
        projects: [],
        qualityReport: {
          totalRecords: 0,
          uniqueProjects: 0,
          totalColumns: 0,
          duplicateRecords: 0,
          missingValuesTotal: 0,
          dataCompletenessPercentage: 100,
          columns: [],
          detectedTypes: {},
        },
      };
    }
    const result = parseConstructionCSV(rawCSV);
    if (result.errors && result.errors.length > 0 && result.projects.length === 0) {
      setError(result.errors[0]);
    } else {
      setError(null);
    }
    return {
      projects: result.projects,
      qualityReport: result.qualityReport,
    };
  }, [rawCSV]);

  // Apply multi-dimensional filters
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // 1. Text Search across ID, Type, Location, Risk
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matches =
          p.Project_ID.toLowerCase().includes(q) ||
          p.Project_Type.toLowerCase().includes(q) ||
          p.Location.toLowerCase().includes(q) ||
          p.Risk_Level.toLowerCase().includes(q) ||
          p.Weather_Condition.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // 2. Project Type
      if (filters.projectType && filters.projectType !== 'All' && p.Project_Type !== filters.projectType) {
        return false;
      }

      // 3. Location
      if (filters.location && filters.location !== 'All' && p.Location !== filters.location) {
        return false;
      }

      // 4. Risk Level
      if (filters.riskLevel && filters.riskLevel !== 'All' && p.Risk_Level !== filters.riskLevel) {
        return false;
      }

      // 5. Weather Condition
      if (filters.weather && filters.weather !== 'All' && p.Weather_Condition !== filters.weather) {
        return false;
      }

      // 6. Anomaly Only
      if (filters.anomalyOnly && !p.Anomaly_Detected) {
        return false;
      }

      // 7. Management Attention Only
      if (filters.attentionOnly && p.Attention_Score < 40) {
        return false;
      }

      // 8. Cost Overrun Only
      if (filters.costOverrunOnly && p.Cost_Overrun <= 0) {
        return false;
      }

      // 9. Delayed Only
      if (filters.delayedOnly && p.Schedule_Deviation <= 0) {
        return false;
      }

      // 10. Completion Range
      if (
        p.Completion_Percentage < filters.completionRange[0] ||
        p.Completion_Percentage > filters.completionRange[1]
      ) {
        return false;
      }

      return true;
    });
  }, [projects, filters]);

  // Executive KPIs on filtered dataset
  const kpis = useMemo(() => {
    return calculatePortfolioKPIs(filteredProjects);
  }, [filteredProjects]);

  // Executive Insights
  const executiveInsights = useMemo(() => {
    return generateDeterministicExecutiveInsights(filteredProjects);
  }, [filteredProjects]);

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const importCSV = (csvString: string, filename?: string): boolean => {
    try {
      setIsLoading(true);
      const parsed = parseConstructionCSV(csvString);
      if (parsed.projects.length === 0) {
        setError('The uploaded CSV does not contain valid project records.');
        setIsLoading(false);
        return false;
      }
      setRawCSV(csvString);
      setDatasetSource(filename || 'Custom Uploaded CSV Dataset');
      setLastUpdated(new Date());
      setFilters(initialFilters);
      setIsLoading(false);
      return true;
    } catch (e: any) {
      setError(`Failed to parse CSV: ${e.message}`);
      setIsLoading(false);
      return false;
    }
  };

  const resetToDefaultDataset = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/data/bim_construction_dataset.csv');
      const text = await response.text();
      setRawCSV(text);
      setDatasetSource('BIM-AI Integrated Construction Dataset');
      setLastUpdated(new Date());
      setFilters(initialFilters);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const exportFilteredCSV = () => {
    if (filteredProjects.length === 0) return;

    const headers = [
      'Project_ID',
      'Project_Type',
      'Location',
      'Start_Date',
      'End_Date',
      'Planned_Cost',
      'Actual_Cost',
      'Cost_Overrun',
      'Cost_Overrun_Percentage',
      'Planned_Duration',
      'Actual_Duration',
      'Schedule_Deviation',
      'Vibration_Level',
      'Crack_Width',
      'Load_Bearing_Capacity',
      'Temperature',
      'Humidity',
      'Weather_Condition',
      'Air_Quality_Index',
      'Energy_Consumption',
      'Material_Usage',
      'Labor_Hours',
      'Equipment_Utilization',
      'Accident_Count',
      'Safety_Risk_Score',
      'Image_Analysis_Score',
      'Anomaly_Detected',
      'Completion_Percentage',
      'Risk_Level',
      'Cost_Performance_Index',
      'Schedule_Performance_Index',
      'Health_Status',
      'Attention_Score',
    ];

    const csvRows = [headers.join(',')];

    filteredProjects.forEach((p) => {
      const row = [
        p.Project_ID,
        p.Project_Type,
        p.Location,
        p.Start_Date,
        p.End_Date,
        p.Planned_Cost,
        p.Actual_Cost,
        p.Cost_Overrun,
        p.Cost_Overrun_Percentage.toFixed(2),
        p.Planned_Duration,
        p.Actual_Duration,
        p.Schedule_Deviation,
        p.Vibration_Level,
        p.Crack_Width,
        p.Load_Bearing_Capacity,
        p.Temperature,
        p.Humidity,
        p.Weather_Condition,
        p.Air_Quality_Index,
        p.Energy_Consumption,
        p.Material_Usage,
        p.Labor_Hours,
        p.Equipment_Utilization,
        p.Accident_Count,
        p.Safety_Risk_Score,
        p.Image_Analysis_Score,
        p.Anomaly_Detected ? '1' : '0',
        p.Completion_Percentage,
        p.Risk_Level,
        p.Cost_Performance_Index.toFixed(2),
        p.Schedule_Performance_Index.toFixed(2),
        p.Health_Status,
        p.Attention_Score,
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Construction_Intelligence_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        filteredProjects,
        kpis,
        qualityReport,
        executiveInsights,
        isLoading,
        error,
        activeTab,
        setActiveTab,
        selectedProject,
        setSelectedProject,
        filters,
        setFilters,
        resetFilters,
        importCSV,
        resetToDefaultDataset,
        exportFilteredCSV,
        datasetSource,
        lastUpdated,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
