import React from 'react';
import { useData } from '../context/DataContext';
import { KPICard } from '../components/common/KPICard';
import { ChartCard } from '../components/common/ChartCard';
import { FilterBar } from '../components/common/FilterBar';
import { DataTable } from '../components/common/DataTable';
import { formatNumber, formatPercent } from '../utils/formatters';
import { Wrench, Users, Zap, Layers, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ScatterChart,
  Scatter,
  Cell,
} from 'recharts';

export const ResourceAnalyticsPage: React.FC = () => {
  const { filteredProjects, kpis } = useData();

  // Resource aggregation by Project Type
  const resourceByType = Object.keys(kpis.projectTypeBreakdown).map((type) => {
    const stats = kpis.projectTypeBreakdown[type];
    return {
      type,
      avgLabor: Math.round(stats.avgLaborHours),
      avgEquip: Number(stats.avgEquipmentUtilization.toFixed(1)),
      count: stats.count,
    };
  });

  // Equipment Utilization vs Schedule Deviation Scatter
  const equipScatterData = filteredProjects.map((p) => ({
    id: p.Project_ID,
    equip: Number(p.Equipment_Utilization.toFixed(1)),
    deviation: p.Schedule_Deviation,
    labor: p.Labor_Hours,
    type: p.Project_Type,
  }));

  return (
    <div className="space-y-6">
      <FilterBar />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Labor Deployed"
          value={`${formatNumber(kpis.totalLaborHours)} hrs`}
          supportingText={`Avg ${formatNumber(Math.round(kpis.averageLaborHours))} hrs per project`}
          icon={Users}
        />

        <KPICard
          label="Avg Equipment Utilization"
          value={formatPercent(kpis.averageEquipmentUtilization)}
          supportingText={kpis.averageEquipmentUtilization > 75 ? 'Optimal fleet efficiency' : 'Fleet underutilization'}
          icon={Wrench}
          variant={kpis.averageEquipmentUtilization > 70 ? 'success' : 'default'}
        />

        <KPICard
          label="Total Material Deployed"
          value={`${formatNumber(Math.round(kpis.totalMaterialUsage))} tons`}
          supportingText="Raw concrete, steel & aggregate"
          icon={Layers}
        />

        <KPICard
          label="Total Energy Consumption"
          value={`${formatNumber(Math.round(kpis.totalEnergyConsumption))} kWh`}
          supportingText="Grid & diesel generator energy"
          icon={Zap}
        />
      </div>

      {/* Resource Utilization Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Labor Hours by Asset Type */}
        <ChartCard
          title="Average Labor Hours by Asset Classification"
          subtitle="Workforce allocation and operational intensity across asset categories"
          badge="WORKFORCE"
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={resourceByType} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="type" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" h" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: any) => [`${formatNumber(Number(val))} hours`, 'Avg Labor']}
              />
              <Bar dataKey="avgLabor" name="Avg Labor (Hours)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Equipment Utilization vs Delay */}
        <ChartCard
          title="Equipment Utilization vs Schedule Deviation"
          subtitle="Correlation between heavy machinery utilization rates and project slippage"
          badge="MACHINERY FLEET"
        >
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                type="number"
                dataKey="equip"
                name="Equipment Util. (%)"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                unit="%"
              />
              <YAxis
                type="number"
                dataKey="deviation"
                name="Delay (Days)"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                unit=" d"
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Scatter name="Projects" data={equipScatterData} fill="#f59e0b">
                {equipScatterData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.deviation > 100 ? '#f43f5e' : entry.equip > 75 ? '#10b981' : '#f59e0b'}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Resource Data Table */}
      <DataTable
        projects={filteredProjects}
        title="Resource & Operational Fleet Register"
        subtitle="Detailed breakdown of labor, equipment, materials and power consumption"
      />
    </div>
  );
};
