import React from 'react';
import { useData } from '../context/DataContext';
import { KPICard } from '../components/common/KPICard';
import { ChartCard } from '../components/common/ChartCard';
import { FilterBar } from '../components/common/FilterBar';
import { DataTable } from '../components/common/DataTable';
import { formatDays, formatPercent, formatNumber } from '../utils/formatters';
import { Clock, Calendar, AlertTriangle, CloudRain, Sun, Zap, CheckCircle2 } from 'lucide-react';
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
} from 'recharts';

export const ScheduleDelaysPage: React.FC = () => {
  const { filteredProjects, kpis } = useData();

  // Schedule deviation by Asset Type
  const scheduleByType = Object.keys(kpis.projectTypeBreakdown).map((type) => {
    const stats = kpis.projectTypeBreakdown[type];
    return {
      type,
      avgPlanned: stats.avgPlannedDuration,
      avgActual: stats.avgActualDuration,
      avgDeviation: stats.avgScheduleDeviation,
    };
  });

  // Schedule deviation by Weather Condition
  const weatherMap: Record<string, { totalDev: number; count: number }> = {};
  filteredProjects.forEach((p) => {
    const w = p.Weather_Condition || 'Unknown';
    if (!weatherMap[w]) weatherMap[w] = { totalDev: 0, count: 0 };
    weatherMap[w].totalDev += p.Schedule_Deviation;
    weatherMap[w].count += 1;
  });

  const weatherScheduleData = Object.entries(weatherMap).map(([weather, data]) => ({
    weather,
    avgDeviation: data.count > 0 ? data.totalDev / data.count : 0,
    count: data.count,
  }));

  // Top 10 Delayed Projects
  const topDelayedProjects = [...filteredProjects]
    .sort((a, b) => b.Schedule_Deviation - a.Schedule_Deviation)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <FilterBar />

      {/* Schedule KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Avg Schedule Slippage"
          value={formatDays(kpis.averageScheduleDeviation, true)}
          supportingText={`Max delay: ${formatDays(kpis.maxScheduleDeviation, true)}`}
          icon={Clock}
          variant={kpis.averageScheduleDeviation > 30 ? 'alert' : 'warning'}
        />

        <KPICard
          label="Projects with Delays"
          value={`${kpis.delayedProjectsCount} / ${kpis.totalProjects}`}
          supportingText={`${(((kpis.delayedProjectsCount) / (kpis.totalProjects || 1)) * 100).toFixed(0)}% of portfolio experiencing timeline extension`}
          icon={Calendar}
          variant={kpis.delayedProjectsCount > kpis.totalProjects / 2 ? 'warning' : 'default'}
        />

        <KPICard
          label="Average Planned Duration"
          value={formatDays(kpis.averagePlannedDuration)}
          supportingText={`Actual Duration: ${formatDays(kpis.averageActualDuration)}`}
          icon={Calendar}
        />

        <KPICard
          label="Schedule Perf. Index (SPI)"
          value={kpis.averageSchedulePerformanceIndex.toFixed(2)}
          supportingText={kpis.averageSchedulePerformanceIndex >= 1.0 ? 'Ahead of baseline velocity' : 'Behind planned velocity'}
          icon={CheckCircle2}
          variant={kpis.averageSchedulePerformanceIndex >= 1.0 ? 'success' : 'alert'}
        />
      </div>

      {/* Schedule Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Planned vs Actual Duration by Asset Type */}
        <ChartCard
          title="Average Duration Comparison by Asset Type (Days)"
          subtitle="Planned project timeframe vs actual completion timeline"
          badge="DURATION BENCHMARK"
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={scheduleByType} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="type" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" d" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: any) => [`${Number(val).toFixed(0)} days`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="avgPlanned" name="Avg Planned (Days)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="avgActual" name="Avg Actual (Days)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Schedule Slippage Impact by Weather Condition */}
        <ChartCard
          title="Average Schedule Deviation by Weather Condition"
          subtitle="Environmental impact on critical path execution across site locations"
          badge="WEATHER IMPACT"
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={weatherScheduleData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="weather" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" d" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: any) => [`${Number(val).toFixed(1)} days avg delay`, 'Deviation']}
              />
              <Bar dataKey="avgDeviation" name="Avg Delay (Days)" fill="#f43f5e" radius={[6, 6, 0, 0]}>
                {weatherScheduleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.avgDeviation > 50 ? '#f43f5e' : '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top 10 Delayed Projects */}
      <DataTable
        projects={topDelayedProjects}
        title="Top 10 Most Delayed Projects"
        subtitle="Ranked by total calendar schedule slippage exceeding planned duration"
      />
    </div>
  );
};
