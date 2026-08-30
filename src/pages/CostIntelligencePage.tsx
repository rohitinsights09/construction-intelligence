import React from 'react';
import { useData } from '../context/DataContext';
import { KPICard } from '../components/common/KPICard';
import { ChartCard } from '../components/common/ChartCard';
import { FilterBar } from '../components/common/FilterBar';
import { DataTable } from '../components/common/DataTable';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatters';
import { DollarSign, TrendingUp, TrendingDown, Landmark, PieChart as PieIcon, MapPin } from 'lucide-react';
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

export const CostIntelligencePage: React.FC = () => {
  const { filteredProjects, kpis } = useData();

  // Location Cost Breakdown
  const costByLocationData = Object.keys(kpis.locationBreakdown).map((loc) => {
    const stats = kpis.locationBreakdown[loc];
    return {
      location: loc,
      planned: stats.plannedCost / 1_000_000,
      actual: stats.actualCost / 1_000_000,
      overrun: stats.costOverrun / 1_000_000,
      overrunPct: stats.costOverrunPercentage,
    };
  });

  // Type Cost Breakdown
  const costByTypeData = Object.keys(kpis.projectTypeBreakdown).map((type) => {
    const stats = kpis.projectTypeBreakdown[type];
    return {
      type: type,
      planned: stats.plannedCost / 1_000_000,
      actual: stats.actualCost / 1_000_000,
      overrun: stats.costOverrun / 1_000_000,
      overrunPct: stats.costOverrunPercentage,
    };
  });

  // Top 10 Projects with highest Cost Overrun
  const topCostOverrunProjects = [...filteredProjects]
    .sort((a, b) => b.Cost_Overrun - a.Cost_Overrun)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <FilterBar />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Actual Incurred"
          value={formatCurrency(kpis.totalActualCost, true)}
          supportingText={`Total Planned: ${formatCurrency(kpis.totalPlannedCost, true)}`}
          icon={Landmark}
        />

        <KPICard
          label="Net Cost Overrun"
          value={formatCurrency(kpis.totalCostOverrun, true)}
          supportingText={`${formatPercent(kpis.portfolioCostOverrunPercentage, true)} variance across portfolio`}
          icon={DollarSign}
          variant={kpis.totalCostOverrun > 0 ? 'alert' : 'success'}
          trend={{
            value: `${kpis.portfolioCostOverrunPercentage.toFixed(1)}%`,
            isPositive: kpis.portfolioCostOverrunPercentage <= 0,
            label: 'overrun rate',
          }}
        />

        <KPICard
          label="Average Project Cost"
          value={formatCurrency(kpis.averageActualCost, true)}
          supportingText={`Avg Planned: ${formatCurrency(kpis.averagePlannedCost, true)}`}
          icon={TrendingUp}
        />

        <KPICard
          label="Projects Over Budget"
          value={`${kpis.projectsWithCostOverrun} / ${kpis.totalProjects}`}
          supportingText={`${(((kpis.projectsWithCostOverrun) / (kpis.totalProjects || 1)) * 100).toFixed(0)}% of portfolio experiencing cost slippage`}
          icon={TrendingDown}
          variant={kpis.projectsWithCostOverrun > kpis.totalProjects / 2 ? 'warning' : 'default'}
        />
      </div>

      {/* Financial Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Variance by Location */}
        <ChartCard
          title="Capital Deployment & Variance by City ($ Millions)"
          subtitle="Regional distribution of planned vs actual expenditure across major project hubs"
          badge="REGIONAL COST"
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={costByLocationData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="location" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit="M" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(value: any) => [`$${Number(value).toFixed(2)}M`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="planned" name="Planned ($M)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Actual ($M)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Cost Variance by Asset Type */}
        <ChartCard
          title="Cost Overrun Distribution by Asset Classification ($ Millions)"
          subtitle="Total net cost overrun incurred by infrastructure asset category"
          badge="ASSET TYPE"
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={costByTypeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="type" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit="M" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(value: any) => [`$${Number(value).toFixed(2)}M`, 'Net Overrun']}
              />
              <Bar dataKey="overrun" name="Net Cost Overrun ($M)" fill="#f43f5e" radius={[6, 6, 0, 0]}>
                {costByTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.overrun > 0 ? '#f43f5e' : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top Cost Overruns Table */}
      <DataTable
        projects={topCostOverrunProjects}
        title="Top 10 Budget Overrun Projects"
        subtitle="Ranked by absolute cost variance exceeding planned expenditure"
      />
    </div>
  );
};
