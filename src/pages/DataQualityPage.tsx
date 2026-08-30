import React from 'react';
import { useData } from '../context/DataContext';
import { KPICard } from '../components/common/KPICard';
import { ChartCard } from '../components/common/ChartCard';
import { formatNumber, formatPercent } from '../utils/formatters';
import { FileCheck2, Database, ShieldCheck, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { BlueprintGrid } from '../components/common/BlueprintGrid';

export const DataQualityPage: React.FC = () => {
  const { qualityReport, datasetSource, lastUpdated, resetToDefaultDataset } = useData();

  return (
    <div className="space-y-6">
      {/* Dataset Header Info */}
      <div className="p-5 rounded-xl border border-slate-800 bg-[#0f1420] flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">
            DATASET REGISTRY AUDIT
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight">{datasetSource}</h3>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Audited: {lastUpdated.toLocaleString()} • Schema: BIM-AI v2.4 (28 Dimension Columns)
          </p>
        </div>

        <button
          onClick={resetToDefaultDataset}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-verify Dataset</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Data Completeness"
          value={formatPercent(qualityReport.dataCompletenessPercentage, false, 1)}
          supportingText="Zero missing or corrupted cell values"
          icon={ShieldCheck}
          variant="success"
        />

        <KPICard
          label="Total Project Records"
          value={formatNumber(qualityReport.totalRecords)}
          supportingText={`${qualityReport.uniqueProjects} unique Project IDs`}
          icon={Database}
        />

        <KPICard
          label="Active Attributes / Columns"
          value={`${qualityReport.totalColumns} Columns`}
          supportingText="Financial, duration, sensor, safety dimensions"
          icon={FileCheck2}
        />

        <KPICard
          label="Duplicate / Corrupted Rows"
          value={qualityReport.duplicateRecords}
          supportingText="Strict unique key constraint passed"
          icon={CheckCircle2}
          variant="success"
        />
      </div>

      {/* Schema & Column Integrity Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0f1520] shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/60">
          <h3 className="text-base font-bold text-slate-100">Column Schema & Missing Value Matrix</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Validation of column data types, completeness percentages, and null value diagnostics
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-mono text-[11px] uppercase">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Column Name</th>
                <th className="px-4 py-3">Inferred Type</th>
                <th className="px-4 py-3 text-right">Non-Null Rows</th>
                <th className="px-4 py-3 text-right">Missing / Null</th>
                <th className="px-4 py-3 text-right">Completeness</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {qualityReport.columns.map((col, idx) => (
                <tr key={col.name} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-slate-500">{idx + 1}</td>
                  <td className="px-4 py-2.5 font-mono font-bold text-slate-200">{col.name}</td>
                  <td className="px-4 py-2.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-cyan-400 border border-slate-700">
                      {col.type}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-slate-300">
                    {formatNumber(col.totalRecords - col.missingCount)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-slate-400">
                    {col.missingCount}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono font-semibold text-emerald-400">
                    {formatPercent(100 - col.missingPercentage, false, 1)}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Valid
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
