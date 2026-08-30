import React from 'react';
import { useData } from '../context/DataContext';
import { FilterBar } from '../components/common/FilterBar';
import { DataTable } from '../components/common/DataTable';
import { KPICard } from '../components/common/KPICard';
import { Building2, AlertTriangle, Activity, DollarSign } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatters';

export const ProjectExplorerPage: React.FC = () => {
  const { filteredProjects, projects, kpis, setSelectedProject } = useData();

  return (
    <div className="space-y-6">
      <FilterBar />

      {/* Mini KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Active Filtered</span>
            <span className="text-xl font-bold font-sans text-white">{filteredProjects.length}</span>
          </div>
          <Building2 className="w-5 h-5 text-blue-400 opacity-60" />
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Filtered Cost Sum</span>
            <span className="text-xl font-bold font-sans text-white">{formatCurrency(kpis.totalActualCost, true)}</span>
          </div>
          <DollarSign className="w-5 h-5 text-emerald-400 opacity-60" />
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">High Risk in View</span>
            <span className="text-xl font-bold font-sans text-rose-400">{kpis.highRiskCount}</span>
          </div>
          <AlertTriangle className="w-5 h-5 text-rose-400 opacity-60" />
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Anomalies Flagged</span>
            <span className="text-xl font-bold font-sans text-amber-400">{kpis.anomaliesDetectedCount}</span>
          </div>
          <Activity className="w-5 h-5 text-amber-400 opacity-60" />
        </div>
      </div>

      {/* Full Data Table */}
      <DataTable
        projects={filteredProjects}
        title="Master Project Records"
        subtitle="Comprehensive database records with full telemetry, duration, financial and sensor columns"
      />
    </div>
  );
};
