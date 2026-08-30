export type ProjectType = 'Building' | 'Bridge' | 'Tunnel' | 'Dam' | 'Road';
export type LocationCity = 'Houston' | 'Seattle' | 'Los Angeles' | 'New York' | 'Chicago';
export type RiskLevel = 'High' | 'Medium' | 'Low';
export type WeatherCondition = 'Snowy' | 'Cloudy' | 'Sunny' | 'Rainy' | 'Stormy';

export interface ConstructionProject {
  Project_ID: string;
  Project_Type: ProjectType;
  Location: LocationCity;
  Start_Date: string; // ISO 8601 YYYY-MM-DD
  End_Date: string; // ISO 8601 YYYY-MM-DD
  Planned_Cost: number;
  Actual_Cost: number;
  Cost_Overrun: number;
  Cost_Overrun_Percentage: number; // Derived: (Cost_Overrun / Planned_Cost) * 100
  Planned_Duration: number; // in days
  Actual_Duration: number; // in days
  Schedule_Deviation: number; // in days (positive = delayed, negative = ahead)
  Schedule_Deviation_Percentage: number; // (Schedule_Deviation / Planned_Duration) * 100
  Vibration_Level: number; // mm/s
  Crack_Width: number; // mm
  Load_Bearing_Capacity: number; // kN
  Temperature: number; // Celsius
  Humidity: number; // %
  Weather_Condition: WeatherCondition;
  Air_Quality_Index: number; // AQI
  Energy_Consumption: number; // kWh
  Material_Usage: number; // metric tons
  Labor_Hours: number; // hours
  Equipment_Utilization: number; // %
  Accident_Count: number;
  Safety_Risk_Score: number; // 0 - 10
  Image_Analysis_Score: number; // 0 - 100
  Anomaly_Detected: boolean; // boolean
  Completion_Percentage: number; // 0 - 100%
  Risk_Level: RiskLevel;

  // Real-time Calculated Intelligence Fields
  Cost_Performance_Index: number; // Planned Cost / Actual Cost
  Schedule_Performance_Index: number; // Planned Duration / Actual Duration
  Health_Status: 'Critical' | 'Warning' | 'On Track' | 'Optimized';
  Attention_Score: number; // 0 - 100 urgency score for management
  Attention_Reasons: string[];
}

export interface FilterState {
  search: string;
  projectType: string;
  location: string;
  riskLevel: string;
  weather: string;
  anomalyOnly: boolean;
  attentionOnly: boolean;
  costOverrunOnly: boolean;
  delayedOnly: boolean;
  completionRange: [number, number];
}

export interface TypeBreakdownStats {
  count: number;
  plannedCost: number;
  actualCost: number;
  costOverrun: number;
  costOverrunPercentage: number;
  avgPlannedDuration: number;
  avgActualDuration: number;
  avgScheduleDeviation: number;
  avgLaborHours: number;
  avgEquipmentUtilization: number;
}

export interface LocationBreakdownStats {
  count: number;
  plannedCost: number;
  actualCost: number;
  costOverrun: number;
  costOverrunPercentage: number;
  avgScheduleDeviation: number;
}

export interface PortfolioKPIs {
  totalProjects: number;
  totalPlannedCost: number;
  totalActualCost: number;
  totalCostOverrun: number;
  portfolioCostOverrunPercentage: number;
  averagePlannedCost: number;
  averageActualCost: number;
  averageCostOverrun: number;
  averageCostPerformanceIndex: number;
  averageSchedulePerformanceIndex: number;
  averagePlannedDuration: number;
  averageActualDuration: number;
  averageScheduleDeviation: number;
  maxScheduleDeviation: number;
  delayedProjectsCount: number;
  delayedProjectsPercentage: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  anomaliesDetectedCount: number;
  totalLaborHours: number;
  averageLaborHours: number;
  averageEquipmentUtilization: number;
  totalMaterialUsage: number;
  averageMaterialUsage: number;
  totalEnergyConsumption: number;
  averageEnergyConsumption: number;
  totalAccidentCount: number;
  averageAccidentsPerProject: number;
  averageSafetyRiskScore: number;
  averageImageAnalysisScore: number;
  averageAirQualityIndex: number;
  projectsWithCostOverrun: number;
  projectTypeBreakdown: Record<string, TypeBreakdownStats>;
  locationBreakdown: Record<string, LocationBreakdownStats>;
}

export interface ColumnQualityInfo {
  name: string;
  type: string;
  totalRecords: number;
  missingCount: number;
  missingPercentage: number;
  uniqueValuesCount: number;
  sampleValues: string[];
  min?: number | string;
  max?: number | string;
  mean?: number;
}

export interface DataQualityReport {
  totalRecords: number;
  uniqueProjects: number;
  totalColumns: number;
  duplicateRecords: number;
  missingValuesTotal: number;
  dataCompletenessPercentage: number;
  columns: ColumnQualityInfo[];
  detectedTypes: Record<string, string>;
}

export type NavigationTab =
  | 'overview'
  | 'performance'
  | 'cost'
  | 'schedule'
  | 'risk'
  | 'resources'
  | 'safety'
  | 'explorer'
  | 'quality'
  | 'about';
