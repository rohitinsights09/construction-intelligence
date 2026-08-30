import React from 'react';
import { useData } from '../context/DataContext';
import { KPICard } from '../components/common/KPICard';
import { ChartCard } from '../components/common/ChartCard';
import { FilterBar } from '../components/common/FilterBar';
import { DataTable } from '../components/common/DataTable';
import { formatCurrency, formatPercent, formatDays, formatNumber } from '../utils/formatters';
import {
  DollarSign,
  Clock,
  ShieldAlert,
  HardHat,
  AlertOctagon,
  Building2,
  TrendingUp,
  Activity,
  Lightbulb,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  CartesianGrid,
} from 'recharts';

export const OverviewPage: React.FC = () => {
  const { filteredProjects, kpis, executiveInsights, setActiveTab, setSelectedProject } = useData();

  // Color palette for charts
  const RISK_COLORS = {
    High: '#f43f5e',
    Medium: '#f59e0b',
    Low: '#10b981',
  };

  const TYPE_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

  // Cost by Project Type aggregated data
  const costByTypeData = Object.keys(kpis.projectTypeBreakdown).map((type) => {
    const stats = kpis.projectTypeBreakdown[type];
    return {
      name: type,
      planned: stats.plannedCost / 1_000_000,
      actual: stats.actualCost / 1_000_000,
      overrun: stats.costOverrun / 1_000_000,
      count: stats.count,
    };
  });

  // Risk Distribution Data for Pie Chart
  const riskPieData = [
    { name: 'High Risk', value: kpis.highRiskCount, color: RISK_COLORS.High },
    { name: 'Medium Risk', value: kpis.mediumRiskCount, color: RISK_COLORS.Medium },
    { name: 'Low Risk', value: kpis.lowRiskCount, color: RISK_COLORS.Low },
  ].filter((d) => d.value > 0);

  // Duration variance scatter data
  const scatterData = filteredProjects.slice(0, 100).map((p) => ({
    id: p.Project_ID,
    plannedDuration: p.Planned_Duration,
    actualDuration: p.Actual_Duration,
    deviation: p.Schedule_Deviation,
    costOverrun: p.Cost_Overrun / 1_000_000,
    type: p.Project_Type,
  }));

  // Projects Needing Immediate Attention
  const attentionProjects = filteredProjects
    .filter((p) => p.Attention_Score > 40)
    .sort((a, b) => b.Attention_Score - a.Attention_Score)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Global Interactive Filter Bar */}
      <FilterBar />

      {/* Top Executive KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Portfolio Value"
          value={formatCurrency(kpis.totalActualCost, true)}
          supportingText={`Planned: ${formatCurrency(kpis.totalPlannedCost, true)}`}
          icon={Building2}
          trend={{
            value: `${formatPercent(kpis.portfolioCostOverrunPercentage, true)}`,
            isPositive: kpis.portfolioCostOverrunPercentage <= 0,
            label: 'variance',
          }}
        />

        <KPICard
          label="Net Cost Overrun"
          value={formatCurrency(kpis.totalCostOverrun, true)}
          supportingText={`${kpis.projectsWithCostOverrun} of ${kpis.totalProjects} projects over budget`}
          icon={DollarSign}
          variant={kpis.totalCostOverrun > 0 ? 'alert' : 'success'}
          trend={{
            value: `CPI ${kpis.averageCostPerformanceIndex.toFixed(2)}`,
            isNeutral: true,
          }}
        />

        <KPICard
          label="Avg Schedule Deviation"
          value={formatDays(kpis.averageScheduleDeviation, true)}
          supportingText={`${kpis.delayedProjectsCount} projects behind schedule`}
          icon={Clock}
          variant={kpis.averageScheduleDeviation > 15 ? 'warning' : 'default'}
          trend={{
            value: `SPI ${kpis.averageSchedulePerformanceIndex.toFixed(2)}`,
            isNeutral: true,
          }}
        />

        <KPICard
          label="Risk & Sensor Anomalies"
          value={`${kpis.highRiskCount} High Risk`}
          supportingText={`${kpis.anomaliesDetectedCount} sensor anomaly alerts`}
          icon={ShieldAlert}
          variant={kpis.highRiskCount > 0 ? 'alert' : 'default'}
          trend={{
            value: `${((kpis.highRiskCount / (kpis.totalProjects || 1)) * 100).toFixed(0)}%`,
            isPositive: false,
            label: 'portfolio',
          }}
        />
      </div>

      {/* Executive Insights & Management Attention Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Executive Insights (Deterministic Engine) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#0f1420] p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-slate-100 uppercase font-mono tracking-wider">
                Deterministic Executive Insights
              </h3>
            </div>
            <div className="space-y-3">
              {executiveInsights.slice(0, 3).map((insight, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-lg border text-xs flex items-start gap-3 transition-all ${
                    insight.type === 'critical'
                      ? 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                      : insight.type === 'warning'
                      ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                      : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                  }`}
                >
                  <div className="p-1 rounded bg-slate-900 shrink-0 mt-0.5">
                    {insight.type === 'critical' ? (
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                    ) : insight.type === 'warning' ? (
                      <Activity className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold block text-slate-100 text-xs mb-0.5">{insight.title}</span>
                    <p className="text-slate-300 leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-mono">Calculated on active filtered scope</span>
            <button
              onClick={() => setActiveTab('performance')}
              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              <span>Explore Performance Model</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Priority Attention Projects */}
        <div className="rounded-xl border border-slate-800 bg-[#0f1420] p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-slate-100 uppercase font-mono tracking-wider">
                  Critical Attention
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Top Urgency
              </span>
            </div>

            <div className="space-y-2.5">
              {attentionProjects.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs font-mono">
                  No projects currently require critical escalation.
                </div>
              ) : (
                attentionProjects.map((p) => (
                  <div
                    key={p.Project_ID}
                    onClick={() => setSelectedProject(p)}
                    className="p-3 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800/90 hover:border-amber-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-amber-400 text-xs group-hover:underline">
                        {p.Project_ID}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                        Score: {p.Attention_Score}
                      </span>
                    </div>
                    <div className="text-slate-300 text-xs mt-1 flex items-center justify-between">
                      <span>{p.Project_Type} • {p.Location}</span>
                      <span className="text-rose-400 font-mono">+{formatCurrency(p.Cost_Overrun, true)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('explorer')}
            className="mt-4 pt-3 border-t border-slate-800 w-full text-center text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            View all {filteredProjects.length} projects &rarr;
          </button>
        </div>
      </div>

      {/* Primary Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Planned vs Actual Cost by Asset Type */}
        <ChartCard
          title="Planned vs Actual Cost by Asset Type"
          subtitle="Capital allocation and variance distribution across asset classifications ($ Millions)"
          badge="FINANCIAL"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costByTypeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit="M" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(value: any) => [`$${Number(value).toFixed(2)}M`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="planned" name="Planned Budget ($M)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Actual Cost ($M)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Portfolio Risk Distribution */}
        <ChartCard
          title="Portfolio Risk Classification"
          subtitle="Multi-parameter risk breakdown across active project pipeline"
          badge="RISK"
        >
          <div className="flex flex-col sm:flex-row items-center justify-around h-full">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-2 shrink-0 sm:pr-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-sm bg-rose-500" />
                <span className="text-slate-300">High Risk:</span>
                <span className="font-mono font-bold text-white">{kpis.highRiskCount}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-sm bg-amber-500" />
                <span className="text-slate-300">Medium Risk:</span>
                <span className="font-mono font-bold text-white">{kpis.mediumRiskCount}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span className="text-slate-300">Low Risk:</span>
                <span className="font-mono font-bold text-white">{kpis.lowRiskCount}</span>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Primary Project Master Table */}
      <DataTable
        projects={filteredProjects}
        title="Active Portfolio Projects"
        subtitle="Detailed register of all construction projects with real-time health indicators"
      />
    </div>
  );
};
