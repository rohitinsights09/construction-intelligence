import React from 'react';
import { useData } from '../context/DataContext';
import { KPICard } from '../components/common/KPICard';
import { ChartCard } from '../components/common/ChartCard';
import { FilterBar } from '../components/common/FilterBar';
import { DataTable } from '../components/common/DataTable';
import { formatNumber, formatPercent } from '../utils/formatters';
import { HardHat, ShieldAlert, Cpu, Wind, AlertOctagon, Sun, CloudRain } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

export const SafetyAnalyticsPage: React.FC = () => {
  const { filteredProjects, kpis } = useData();

  // Accident Distribution by Weather Condition
  const weatherSafety: Record<string, { accidents: number; safetySum: number; count: number }> = {};
  filteredProjects.forEach((p) => {
    const w = p.Weather_Condition || 'Unknown';
    if (!weatherSafety[w]) weatherSafety[w] = { accidents: 0, safetySum: 0, count: 0 };
    weatherSafety[w].accidents += p.Accident_Count;
    weatherSafety[w].safetySum += p.Safety_Risk_Score;
    weatherSafety[w].count += 1;
  });

  const weatherSafetyData = Object.entries(weatherSafety).map(([weather, stats]) => ({
    weather,
    totalAccidents: stats.accidents,
    avgSafetyScore: stats.count > 0 ? Number((stats.safetySum / stats.count).toFixed(2)) : 0,
    count: stats.count,
  }));

  // Accident count buckets
  const accidentBuckets = [
    { label: '0 Incidents', count: filteredProjects.filter((p) => p.Accident_Count === 0).length, color: '#10b981' },
    { label: '1 - 2 Incidents', count: filteredProjects.filter((p) => p.Accident_Count >= 1 && p.Accident_Count <= 2).length, color: '#06b6d4' },
    { label: '3 - 5 Incidents', count: filteredProjects.filter((p) => p.Accident_Count >= 3 && p.Accident_Count <= 5).length, color: '#f59e0b' },
    { label: '6+ Incidents', count: filteredProjects.filter((p) => p.Accident_Count >= 6).length, color: '#f43f5e' },
  ].filter((d) => d.count > 0);

  // High Incident Projects (Accidents >= 5 or Safety Score > 7)
  const highIncidentProjects = filteredProjects
    .filter((p) => p.Accident_Count >= 5 || p.Safety_Risk_Score > 7.0)
    .sort((a, b) => b.Accident_Count - a.Accident_Count);

  return (
    <div className="space-y-6">
      <FilterBar />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Recorded Incidents"
          value={`${kpis.totalAccidentCount} Incidents`}
          supportingText={`Avg ${kpis.averageAccidentsPerProject.toFixed(1)} per project`}
          icon={HardHat}
          variant={kpis.totalAccidentCount > 500 ? 'alert' : 'warning'}
        />

        <KPICard
          label="Avg HSE Risk Score"
          value={`${kpis.averageSafetyRiskScore.toFixed(1)} / 10`}
          supportingText={kpis.averageSafetyRiskScore > 5 ? 'High HSE Attention' : 'Acceptable Compliance'}
          icon={ShieldAlert}
          variant={kpis.averageSafetyRiskScore > 6 ? 'alert' : 'default'}
        />

        <KPICard
          label="Computer Vision Inspection"
          value={`${kpis.averageImageAnalysisScore.toFixed(1)}%`}
          supportingText="Automated site compliance score"
          icon={Cpu}
          variant="indigo"
        />

        <KPICard
          label="Avg Air Quality (AQI)"
          value={`${Math.round(kpis.averageAirQualityIndex)} AQI`}
          supportingText={kpis.averageAirQualityIndex > 150 ? 'Unhealthy Air Quality' : 'Moderate / Healthy'}
          icon={Wind}
          variant={kpis.averageAirQualityIndex > 150 ? 'warning' : 'default'}
        />
      </div>

      {/* Safety Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Distribution by Weather Condition */}
        <ChartCard
          title="Accident Volume by Environmental Weather Condition"
          subtitle="Correlation between site environmental severity and worker incident frequency"
          badge="HSE & WEATHER"
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={weatherSafetyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="weather" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="totalAccidents" name="Total Accidents" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Incident Frequency Distribution */}
        <ChartCard
          title="Portfolio Incident Frequency Distribution"
          subtitle="Project distribution across safety incident severity brackets"
          badge="INCIDENT BRACKETS"
        >
          <div className="flex flex-col sm:flex-row items-center justify-around h-full">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={accidentBuckets}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="label"
                  label={({ label, percent }) => `${label} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {accidentBuckets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-2 shrink-0 sm:pr-4">
              {accidentBuckets.map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: b.color }} />
                  <span className="text-slate-300">{b.label}:</span>
                  <span className="font-mono font-bold text-white">{b.count}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* High Incident Projects Table */}
      <DataTable
        projects={highIncidentProjects}
        title="High HSE Incident & Risk Escalation Table"
        subtitle="Projects exhibiting 5+ accidents or safety risk score > 7.0"
      />
    </div>
  );
};
