import React from 'react';
import { useData } from '../context/DataContext';
import { KPICard } from '../components/common/KPICard';
import { ChartCard } from '../components/common/ChartCard';
import { FilterBar } from '../components/common/FilterBar';
import { DataTable } from '../components/common/DataTable';
import { formatPercent, formatCurrency, formatDays } from '../utils/formatters';
import { TrendingUp, Activity, CheckCircle2, AlertTriangle, AlertOctagon, Target, Zap } from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

export const ProjectPerformancePage: React.FC = () => {
  const { filteredProjects, kpis, setSelectedProject } = useData();

  // Health Status distribution counts
  const healthCounts = {
    Optimized: filteredProjects.filter((p) => p.Health_Status === 'Optimized').length,
    'On Track': filteredProjects.filter((p) => p.Health_Status === 'On Track').length,
    Warning: filteredProjects.filter((p) => p.Health_Status === 'Warning').length,
    Critical: filteredProjects.filter((p) => p.Health_Status === 'Critical').length,
  };

  const healthBarData = [
    { name: 'Optimized', count: healthCounts.Optimized, color: '#06b6d4' },
    { name: 'On Track', count: healthCounts['On Track'], color: '#10b981' },
    { name: 'Warning', count: healthCounts.Warning, color: '#f59e0b' },
    { name: 'Critical', count: healthCounts.Critical, color: '#f43f5e' },
  ];

  // CPI vs SPI Scatter distribution
  const scatterData = filteredProjects.map((p) => ({
    id: p.Project_ID,
    cpi: Number(p.Cost_Performance_Index.toFixed(2)),
    spi: Number(p.Schedule_Performance_Index.toFixed(2)),
    completion: p.Completion_Percentage,
    health: p.Health_Status,
    type: p.Project_Type,
    rawProject: p,
  }));

  // Top critical performance projects
  const criticalProjects = filteredProjects
    .filter((p) => p.Health_Status === 'Critical')
    .sort((a, b) => b.Attention_Score - a.Attention_Score)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <FilterBar />

      {/* KPI Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Avg Cost Performance (CPI)"
          value={kpis.averageCostPerformanceIndex.toFixed(2)}
          supportingText={kpis.averageCostPerformanceIndex >= 1.0 ? 'Favorable (> 1.0)' : 'Unfavorable (< 1.0)'}
          icon={TrendingUp}
          variant={kpis.averageCostPerformanceIndex >= 1.0 ? 'success' : 'alert'}
          trend={{
            value: `${((kpis.averageCostPerformanceIndex - 1) * 100).toFixed(1)}%`,
            isPositive: kpis.averageCostPerformanceIndex >= 1.0,
            label: 'vs baseline',
          }}
        />

        <KPICard
          label="Avg Schedule Index (SPI)"
          value={kpis.averageSchedulePerformanceIndex.toFixed(2)}
          supportingText={kpis.averageSchedulePerformanceIndex >= 1.0 ? 'Ahead of Schedule' : 'Behind Schedule'}
          icon={Activity}
          variant={kpis.averageSchedulePerformanceIndex >= 1.0 ? 'success' : 'warning'}
          trend={{
            value: `${((kpis.averageSchedulePerformanceIndex - 1) * 100).toFixed(1)}%`,
            isPositive: kpis.averageSchedulePerformanceIndex >= 1.0,
            label: 'velocity',
          }}
        />

        <KPICard
          label="On-Track / Optimized"
          value={`${healthCounts.Optimized + healthCounts['On Track']} Projects`}
          supportingText={`${(((healthCounts.Optimized + healthCounts['On Track']) / (filteredProjects.length || 1)) * 100).toFixed(0)}% of active portfolio`}
          icon={CheckCircle2}
          variant="success"
        />

        <KPICard
          label="Critical Action Projects"
          value={`${healthCounts.Critical} Projects`}
          supportingText={`${healthCounts.Warning} projects in warning state`}
          icon={AlertOctagon}
          variant={healthCounts.Critical > 0 ? 'alert' : 'default'}
        />
      </div>

      {/* Earned Value Matrix (CPI vs SPI Scatter) & Health Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPI vs SPI Earned Value Matrix */}
        <ChartCard
          title="Earned Value Matrix (CPI vs SPI)"
          subtitle="Upper-right quadrant represents optimal cost and schedule velocity (CPI ≥ 1.0, SPI ≥ 1.0)"
          badge="EVMS MATRIX"
        >
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                type="number"
                dataKey="spi"
                name="SPI (Schedule Index)"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                domain={['auto', 'auto']}
              />
              <YAxis
                type="number"
                dataKey="cpi"
                name="CPI (Cost Index)"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                domain={['auto', 'auto']}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: any, name: any) => [val, name]}
              />
              <Scatter
                name="Projects"
                data={scatterData}
                fill="#f59e0b"
                onClick={(e: any) => {
                  if (e && e.rawProject) setSelectedProject(e.rawProject);
                }}
              >
                {scatterData.map((entry, index) => {
                  let color = '#10b981';
                  if (entry.health === 'Critical') color = '#f43f5e';
                  else if (entry.health === 'Warning') color = '#f59e0b';
                  else if (entry.health === 'Optimized') color = '#06b6d4';
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Health Classification Distribution */}
        <ChartCard
          title="Project Health Classification Breakdown"
          subtitle="Algorithmic categorization based on combined cost overrun %, schedule deviation and safety metrics"
          badge="HEALTH METRICS"
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={healthBarData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="count" name="Project Count" radius={[6, 6, 0, 0]}>
                {healthBarData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Critical Escalation Projects */}
      <DataTable
        projects={criticalProjects.length > 0 ? criticalProjects : filteredProjects}
        title={criticalProjects.length > 0 ? 'Critical Escalation Register' : 'Portfolio Performance Register'}
        subtitle="Projects requiring immediate engineering or commercial intervention"
      />
    </div>
  );
};
