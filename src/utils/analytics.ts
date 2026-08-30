import { ConstructionProject, PortfolioKPIs, TypeBreakdownStats, LocationBreakdownStats } from '../types';
import { formatCurrency } from './formatters';

export interface ExecutiveInsight {
  title: string;
  description: string;
  type: 'critical' | 'warning' | 'positive';
  category: 'cost' | 'schedule' | 'safety' | 'structural';
}

export function calculatePortfolioKPIs(projects: ConstructionProject[]): PortfolioKPIs {
  const n = projects.length;

  const defaultBreakdown: Record<string, TypeBreakdownStats> = {};
  const defaultLocBreakdown: Record<string, LocationBreakdownStats> = {};

  if (n === 0) {
    return {
      totalProjects: 0,
      totalPlannedCost: 0,
      totalActualCost: 0,
      totalCostOverrun: 0,
      portfolioCostOverrunPercentage: 0,
      averagePlannedCost: 0,
      averageActualCost: 0,
      averageCostOverrun: 0,
      averageCostPerformanceIndex: 1.0,
      averageSchedulePerformanceIndex: 1.0,
      averagePlannedDuration: 0,
      averageActualDuration: 0,
      averageScheduleDeviation: 0,
      maxScheduleDeviation: 0,
      delayedProjectsCount: 0,
      delayedProjectsPercentage: 0,
      highRiskCount: 0,
      mediumRiskCount: 0,
      lowRiskCount: 0,
      anomaliesDetectedCount: 0,
      totalLaborHours: 0,
      averageLaborHours: 0,
      averageEquipmentUtilization: 0,
      totalMaterialUsage: 0,
      averageMaterialUsage: 0,
      totalEnergyConsumption: 0,
      averageEnergyConsumption: 0,
      totalAccidentCount: 0,
      averageAccidentsPerProject: 0,
      averageSafetyRiskScore: 0,
      averageImageAnalysisScore: 0,
      averageAirQualityIndex: 0,
      projectsWithCostOverrun: 0,
      projectTypeBreakdown: defaultBreakdown,
      locationBreakdown: defaultLocBreakdown,
    };
  }

  let totalPlannedCost = 0;
  let totalActualCost = 0;
  let totalCostOverrun = 0;
  let totalPlannedDuration = 0;
  let totalActualDuration = 0;
  let totalScheduleDeviation = 0;
  let maxScheduleDeviation = 0;
  let delayedCount = 0;
  let highRiskCount = 0;
  let mediumRiskCount = 0;
  let lowRiskCount = 0;
  let anomaliesCount = 0;
  let totalLaborHours = 0;
  let totalEquipmentUtilization = 0;
  let totalMaterialUsage = 0;
  let totalEnergyConsumption = 0;
  let totalAccidents = 0;
  let totalSafetyScore = 0;
  let totalImageScore = 0;
  let totalAQI = 0;
  let overrunCount = 0;

  const typeMap: Record<
    string,
    {
      count: number;
      planned: number;
      actual: number;
      overrun: number;
      plannedDur: number;
      actualDur: number;
      dev: number;
      labor: number;
      equip: number;
    }
  > = {};

  const locMap: Record<
    string,
    {
      count: number;
      planned: number;
      actual: number;
      overrun: number;
      dev: number;
    }
  > = {};

  projects.forEach((p) => {
    totalPlannedCost += p.Planned_Cost;
    totalActualCost += p.Actual_Cost;
    totalCostOverrun += p.Cost_Overrun;
    totalPlannedDuration += p.Planned_Duration;
    totalActualDuration += p.Actual_Duration;
    totalScheduleDeviation += p.Schedule_Deviation;
    if (p.Schedule_Deviation > maxScheduleDeviation) {
      maxScheduleDeviation = p.Schedule_Deviation;
    }
    if (p.Schedule_Deviation > 0) delayedCount++;
    if (p.Cost_Overrun > 0) overrunCount++;

    if (p.Risk_Level === 'High') highRiskCount++;
    else if (p.Risk_Level === 'Medium') mediumRiskCount++;
    else lowRiskCount++;

    if (p.Anomaly_Detected) anomaliesCount++;

    totalLaborHours += p.Labor_Hours;
    totalEquipmentUtilization += p.Equipment_Utilization;
    totalMaterialUsage += p.Material_Usage;
    totalEnergyConsumption += p.Energy_Consumption;
    totalAccidents += p.Accident_Count;
    totalSafetyScore += p.Safety_Risk_Score;
    totalImageScore += p.Image_Analysis_Score;
    totalAQI += p.Air_Quality_Index;

    // Type Breakdown
    const t = p.Project_Type;
    if (!typeMap[t]) {
      typeMap[t] = {
        count: 0,
        planned: 0,
        actual: 0,
        overrun: 0,
        plannedDur: 0,
        actualDur: 0,
        dev: 0,
        labor: 0,
        equip: 0,
      };
    }
    typeMap[t].count++;
    typeMap[t].planned += p.Planned_Cost;
    typeMap[t].actual += p.Actual_Cost;
    typeMap[t].overrun += p.Cost_Overrun;
    typeMap[t].plannedDur += p.Planned_Duration;
    typeMap[t].actualDur += p.Actual_Duration;
    typeMap[t].dev += p.Schedule_Deviation;
    typeMap[t].labor += p.Labor_Hours;
    typeMap[t].equip += p.Equipment_Utilization;

    // Location Breakdown
    const l = p.Location;
    if (!locMap[l]) {
      locMap[l] = {
        count: 0,
        planned: 0,
        actual: 0,
        overrun: 0,
        dev: 0,
      };
    }
    locMap[l].count++;
    locMap[l].planned += p.Planned_Cost;
    locMap[l].actual += p.Actual_Cost;
    locMap[l].overrun += p.Cost_Overrun;
    locMap[l].dev += p.Schedule_Deviation;
  });

  const projectTypeBreakdown: Record<string, TypeBreakdownStats> = {};
  Object.entries(typeMap).forEach(([type, val]) => {
    projectTypeBreakdown[type] = {
      count: val.count,
      plannedCost: val.planned,
      actualCost: val.actual,
      costOverrun: val.overrun,
      costOverrunPercentage: val.planned > 0 ? (val.overrun / val.planned) * 100 : 0,
      avgPlannedDuration: val.count > 0 ? val.plannedDur / val.count : 0,
      avgActualDuration: val.count > 0 ? val.actualDur / val.count : 0,
      avgScheduleDeviation: val.count > 0 ? val.dev / val.count : 0,
      avgLaborHours: val.count > 0 ? val.labor / val.count : 0,
      avgEquipmentUtilization: val.count > 0 ? val.equip / val.count : 0,
    };
  });

  const locationBreakdown: Record<string, LocationBreakdownStats> = {};
  Object.entries(locMap).forEach(([loc, val]) => {
    locationBreakdown[loc] = {
      count: val.count,
      plannedCost: val.planned,
      actualCost: val.actual,
      costOverrun: val.overrun,
      costOverrunPercentage: val.planned > 0 ? (val.overrun / val.planned) * 100 : 0,
      avgScheduleDeviation: val.count > 0 ? val.dev / val.count : 0,
    };
  });

  const portfolioCostOverrunPercentage =
    totalPlannedCost > 0 ? (totalCostOverrun / totalPlannedCost) * 100 : 0;

  const averageCostPerformanceIndex =
    totalActualCost > 0 ? totalPlannedCost / totalActualCost : 1.0;

  const averageSchedulePerformanceIndex =
    totalActualDuration > 0 ? totalPlannedDuration / totalActualDuration : 1.0;

  return {
    totalProjects: n,
    totalPlannedCost,
    totalActualCost,
    totalCostOverrun,
    portfolioCostOverrunPercentage,
    averagePlannedCost: totalPlannedCost / n,
    averageActualCost: totalActualCost / n,
    averageCostOverrun: totalCostOverrun / n,
    averageCostPerformanceIndex,
    averageSchedulePerformanceIndex,
    averagePlannedDuration: totalPlannedDuration / n,
    averageActualDuration: totalActualDuration / n,
    averageScheduleDeviation: totalScheduleDeviation / n,
    maxScheduleDeviation,
    delayedProjectsCount: delayedCount,
    delayedProjectsPercentage: (delayedCount / n) * 100,
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    anomaliesDetectedCount: anomaliesCount,
    totalLaborHours,
    averageLaborHours: totalLaborHours / n,
    averageEquipmentUtilization: totalEquipmentUtilization / n,
    totalMaterialUsage,
    averageMaterialUsage: totalMaterialUsage / n,
    totalEnergyConsumption,
    averageEnergyConsumption: totalEnergyConsumption / n,
    totalAccidentCount: totalAccidents,
    averageAccidentsPerProject: totalAccidents / n,
    averageSafetyRiskScore: totalSafetyScore / n,
    averageImageAnalysisScore: totalImageScore / n,
    averageAirQualityIndex: totalAQI / n,
    projectsWithCostOverrun: overrunCount,
    projectTypeBreakdown,
    locationBreakdown,
  };
}

export function generateDeterministicExecutiveInsights(
  projects: ConstructionProject[]
): ExecutiveInsight[] {
  const insights: ExecutiveInsight[] = [];
  if (projects.length === 0) return insights;

  const kpis = calculatePortfolioKPIs(projects);

  // 1. Cost Overrun Insight
  if (kpis.totalCostOverrun > 0) {
    insights.push({
      title: `Portfolio Cost Slippage: ${formatCurrency(kpis.totalCostOverrun, true)} Net Overrun`,
      description: `${kpis.projectsWithCostOverrun} of ${kpis.totalProjects} active projects are exceeding budgeted thresholds (+${kpis.portfolioCostOverrunPercentage.toFixed(1)}% variance). Portfolio Cost Performance Index (CPI) stands at ${kpis.averageCostPerformanceIndex.toFixed(2)}.`,
      type: kpis.portfolioCostOverrunPercentage > 15 ? 'critical' : 'warning',
      category: 'cost',
    });
  } else {
    insights.push({
      title: `Favorable Budget Performance: Cost Savings Achieved`,
      description: `Active portfolio is operating under budget with an aggregate CPI of ${kpis.averageCostPerformanceIndex.toFixed(2)}.`,
      type: 'positive',
      category: 'cost',
    });
  }

  // 2. Schedule Delay Insight
  if (kpis.averageScheduleDeviation > 0) {
    insights.push({
      title: `Schedule Variance: +${kpis.averageScheduleDeviation.toFixed(1)} Days Avg Slippage`,
      description: `${kpis.delayedProjectsCount} projects (${kpis.delayedProjectsPercentage.toFixed(0)}%) are experiencing critical path timeline delays. Schedule Performance Index (SPI) is ${kpis.averageSchedulePerformanceIndex.toFixed(2)}.`,
      type: kpis.averageScheduleDeviation > 30 ? 'critical' : 'warning',
      category: 'schedule',
    });
  }

  // 3. Structural & Sensor Anomaly Insight
  if (kpis.anomaliesDetectedCount > 0) {
    insights.push({
      title: `${kpis.anomaliesDetectedCount} Sensor Anomalies Detected Across Telemetry`,
      description: `Active IoT vibration sensors, crack monitors, or computer vision scans have flagged structural anomalies requiring immediate field inspection.`,
      type: 'critical',
      category: 'structural',
    });
  }

  // 4. HSE Safety Insight
  if (kpis.averageSafetyRiskScore > 5.0 || kpis.totalAccidentCount > 0) {
    insights.push({
      title: `HSE Audit: ${kpis.totalAccidentCount} Incidents Logged Across Pipeline`,
      description: `Average site safety risk score is ${kpis.averageSafetyRiskScore.toFixed(1)}/10. Incidents are correlated with severe weather and high labor intensity.`,
      type: kpis.averageSafetyRiskScore > 7.0 ? 'critical' : 'warning',
      category: 'safety',
    });
  }

  return insights;
}
