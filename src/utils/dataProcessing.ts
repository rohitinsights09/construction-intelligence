import Papa from 'papaparse';
import { ConstructionProject, ProjectType, LocationCity, RiskLevel, WeatherCondition, DataQualityReport, ColumnQualityInfo } from '../types';

export function parseConstructionCSV(csvContent: string): {
  projects: ConstructionProject[];
  qualityReport: DataQualityReport;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!csvContent || typeof csvContent !== 'string' || csvContent.trim().length === 0) {
    return {
      projects: [],
      qualityReport: createEmptyQualityReport(),
      errors: ['The provided CSV data is empty.'],
    };
  }

  const parsed = Papa.parse<Record<string, string>>(csvContent.trim(), {
    header: true,
    skipEmptyLines: 'greedy',
    dynamicTyping: false,
  });

  if (parsed.errors && parsed.errors.length > 0) {
    parsed.errors.slice(0, 5).forEach((err) => {
      errors.push(`Row ${err.row}: ${err.message}`);
    });
  }

  const rows = parsed.data;
  if (!rows || rows.length === 0) {
    return {
      projects: [],
      qualityReport: createEmptyQualityReport(),
      errors: ['No valid rows detected in the CSV file.'],
    };
  }

  const projects: ConstructionProject[] = [];
  const projectIds = new Set<string>();
  let duplicateRecords = 0;
  let missingValuesTotal = 0;

  const rawColumns = Object.keys(rows[0] || {});
  const columnStats: Record<string, {
    missing: number;
    unique: Set<string>;
    values: any[];
  }> = {};

  rawColumns.forEach((col) => {
    columnStats[col] = { missing: 0, unique: new Set(), values: [] };
  });

  rows.forEach((row, index) => {
    if (!row || Object.keys(row).length === 0) return;

    // Check for duplicate Project ID
    const rawId = (row.Project_ID || `PJT_${index + 1}`).trim();
    if (projectIds.has(rawId)) {
      duplicateRecords++;
    } else {
      projectIds.add(rawId);
    }

    // Column stats tracking
    rawColumns.forEach((col) => {
      const val = row[col];
      if (val === undefined || val === null || val === '' || val === 'null' || val === 'NaN') {
        columnStats[col].missing++;
        missingValuesTotal++;
      } else {
        columnStats[col].unique.add(String(val));
        columnStats[col].values.push(val);
      }
    });

    // Safely cast & convert fields
    const plannedCost = parseFloat(row.Planned_Cost) || 0;
    const actualCost = parseFloat(row.Actual_Cost) || plannedCost;
    const costOverrun = parseFloat(row.Cost_Overrun) !== undefined && !isNaN(parseFloat(row.Cost_Overrun))
      ? parseFloat(row.Cost_Overrun)
      : (actualCost - plannedCost);

    const costOverrunPct = plannedCost > 0 ? ((actualCost - plannedCost) / plannedCost) * 100 : 0;

    const plannedDuration = parseFloat(row.Planned_Duration) || 1;
    const actualDuration = parseFloat(row.Actual_Duration) || plannedDuration;
    const scheduleDeviation = parseFloat(row.Schedule_Deviation) !== undefined && !isNaN(parseFloat(row.Schedule_Deviation))
      ? parseFloat(row.Schedule_Deviation)
      : (actualDuration - plannedDuration);

    const scheduleDeviationPct = plannedDuration > 0 ? (scheduleDeviation / plannedDuration) * 100 : 0;

    const vibrationLevel = parseFloat(row.Vibration_Level) || 0;
    const crackWidth = parseFloat(row.Crack_Width) || 0;
    const loadBearingCapacity = parseFloat(row.Load_Bearing_Capacity) || 0;
    const temperature = parseFloat(row.Temperature) || 0;
    const humidity = parseFloat(row.Humidity) || 0;
    const aqi = parseFloat(row.Air_Quality_Index) || 0;
    const energyConsumption = parseFloat(row.Energy_Consumption) || 0;
    const materialUsage = parseFloat(row.Material_Usage) || 0;
    const laborHours = parseFloat(row.Labor_Hours) || 0;
    const equipmentUtilization = parseFloat(row.Equipment_Utilization) || 0;
    const accidentCount = parseInt(row.Accident_Count, 10) || 0;
    const safetyRiskScore = parseFloat(row.Safety_Risk_Score) || 0;
    const imageAnalysisScore = parseFloat(row.Image_Analysis_Score) || 0;
    const anomalyDetected = String(row.Anomaly_Detected).trim() === '1' || String(row.Anomaly_Detected).toLowerCase() === 'true';
    const completionPercentage = parseFloat(row.Completion_Percentage) || 0;

    // Normalizing categorical values
    const rawType = (row.Project_Type || 'Building').trim();
    const projectType: ProjectType = ['Building', 'Bridge', 'Tunnel', 'Dam', 'Road'].includes(rawType)
      ? (rawType as ProjectType)
      : 'Building';

    const rawLoc = (row.Location || 'Houston').trim();
    const location: LocationCity = ['Houston', 'Seattle', 'Los Angeles', 'New York', 'Chicago'].includes(rawLoc)
      ? (rawLoc as LocationCity)
      : 'Houston';

    const rawRisk = (row.Risk_Level || 'Medium').trim();
    const riskLevel: RiskLevel = ['High', 'Medium', 'Low'].includes(rawRisk)
      ? (rawRisk as RiskLevel)
      : 'Medium';

    const rawWeather = (row.Weather_Condition || 'Sunny').trim();
    const weatherCondition: WeatherCondition = ['Snowy', 'Cloudy', 'Sunny', 'Rainy', 'Stormy'].includes(rawWeather)
      ? (rawWeather as WeatherCondition)
      : 'Sunny';

    // Earned Value Analytics Index
    const cpi = actualCost > 0 ? plannedCost / actualCost : 1;
    const spi = actualDuration > 0 ? plannedDuration / actualDuration : 1;

    // Management Attention Score Calculation
    let attentionScore = 0;
    const attentionReasons: string[] = [];

    if (costOverrunPct > 20) {
      attentionScore += 30;
      attentionReasons.push(`Severe Cost Overrun (+${costOverrunPct.toFixed(1)}%)`);
    } else if (costOverrunPct > 5) {
      attentionScore += 15;
      attentionReasons.push(`Moderate Budget Overrun (+${costOverrunPct.toFixed(1)}%)`);
    }

    if (scheduleDeviation > 60) {
      attentionScore += 30;
      attentionReasons.push(`Major Schedule Delay (+${scheduleDeviation.toFixed(0)} days)`);
    } else if (scheduleDeviation > 15) {
      attentionScore += 15;
      attentionReasons.push(`Schedule Deviation (+${scheduleDeviation.toFixed(0)} days)`);
    }

    if (riskLevel === 'High') {
      attentionScore += 25;
      attentionReasons.push('High Risk Level Classification');
    }

    if (accidentCount >= 5) {
      attentionScore += 20;
      attentionReasons.push(`Elevated Accident Count (${accidentCount} incidents)`);
    }

    if (anomalyDetected) {
      attentionScore += 15;
      attentionReasons.push('Structural/Sensor Anomaly Detected');
    }

    if (crackWidth > 3.5) {
      attentionScore += 15;
      attentionReasons.push(`High Crack Width (${crackWidth.toFixed(2)} mm)`);
    }

    if (safetyRiskScore > 7.5) {
      attentionScore += 15;
      attentionReasons.push(`High Safety Risk Score (${safetyRiskScore.toFixed(1)}/10)`);
    }

    attentionScore = Math.min(100, attentionScore);

    let healthStatus: 'Critical' | 'Warning' | 'On Track' | 'Optimized' = 'On Track';
    if (attentionScore >= 60 || (costOverrunPct > 25 && scheduleDeviation > 60)) {
      healthStatus = 'Critical';
    } else if (attentionScore >= 35 || costOverrunPct > 10 || scheduleDeviation > 30) {
      healthStatus = 'Warning';
    } else if (costOverrunPct <= 0 && scheduleDeviation <= 0 && completionPercentage > 50) {
      healthStatus = 'Optimized';
    }

    projects.push({
      Project_ID: rawId,
      Project_Type: projectType,
      Location: location,
      Start_Date: row.Start_Date || '2020-01-01',
      End_Date: row.End_Date || '2022-01-01',
      Planned_Cost: plannedCost,
      Actual_Cost: actualCost,
      Cost_Overrun: costOverrun,
      Cost_Overrun_Percentage: costOverrunPct,
      Planned_Duration: plannedDuration,
      Actual_Duration: actualDuration,
      Schedule_Deviation: scheduleDeviation,
      Schedule_Deviation_Percentage: scheduleDeviationPct,
      Vibration_Level: vibrationLevel,
      Crack_Width: crackWidth,
      Load_Bearing_Capacity: loadBearingCapacity,
      Temperature: temperature,
      Humidity: humidity,
      Weather_Condition: weatherCondition,
      Air_Quality_Index: aqi,
      Energy_Consumption: energyConsumption,
      Material_Usage: materialUsage,
      Labor_Hours: laborHours,
      Equipment_Utilization: equipmentUtilization,
      Accident_Count: accidentCount,
      Safety_Risk_Score: safetyRiskScore,
      Image_Analysis_Score: imageAnalysisScore,
      Anomaly_Detected: anomalyDetected,
      Completion_Percentage: completionPercentage,
      Risk_Level: riskLevel,
      Cost_Performance_Index: cpi,
      Schedule_Performance_Index: spi,
      Health_Status: healthStatus,
      Attention_Score: attentionScore,
      Attention_Reasons: attentionReasons,
    });
  });

  const totalCells = rows.length * rawColumns.length;
  const dataCompletenessPercentage = totalCells > 0 ? ((totalCells - missingValuesTotal) / totalCells) * 100 : 100;

  const columnQualityList: ColumnQualityInfo[] = rawColumns.map((col) => {
    const stats = columnStats[col];
    const numericVals = stats.values.map((v) => parseFloat(v)).filter((v) => !isNaN(v));
    const isNumeric = numericVals.length > stats.values.length * 0.7;

    return {
      name: col,
      type: isNumeric ? 'Numeric' : col.toLowerCase().includes('date') ? 'Date' : 'Categorical',
      totalRecords: rows.length,
      missingCount: stats.missing,
      missingPercentage: rows.length > 0 ? (stats.missing / rows.length) * 100 : 0,
      uniqueValuesCount: stats.unique.size,
      sampleValues: Array.from(stats.unique).slice(0, 4),
      min: isNumeric && numericVals.length > 0 ? Math.min(...numericVals) : undefined,
      max: isNumeric && numericVals.length > 0 ? Math.max(...numericVals) : undefined,
      mean: isNumeric && numericVals.length > 0 ? numericVals.reduce((a, b) => a + b, 0) / numericVals.length : undefined,
    };
  });

  const qualityReport: DataQualityReport = {
    totalRecords: rows.length,
    uniqueProjects: projectIds.size,
    totalColumns: rawColumns.length,
    duplicateRecords,
    missingValuesTotal,
    dataCompletenessPercentage,
    columns: columnQualityList,
    detectedTypes: rawColumns.reduce((acc, col) => {
      const match = columnQualityList.find((c) => c.name === col);
      acc[col] = match?.type || 'Text';
      return acc;
    }, {} as Record<string, string>),
  };

  return {
    projects,
    qualityReport,
    errors,
  };
}

function createEmptyQualityReport(): DataQualityReport {
  return {
    totalRecords: 0,
    uniqueProjects: 0,
    totalColumns: 0,
    duplicateRecords: 0,
    missingValuesTotal: 0,
    dataCompletenessPercentage: 0,
    columns: [],
    detectedTypes: {},
  };
}
