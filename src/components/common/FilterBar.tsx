import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Search, Filter, RotateCcw, Download, Upload, SlidersHorizontal, AlertOctagon, Clock, DollarSign, Activity, Check, ChevronDown } from 'lucide-react';
import { ProjectType, LocationCity, RiskLevel } from '../../types';

interface FilterBarProps {
  onOpenUploadModal?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onOpenUploadModal }) => {
  const {
    projects,
    filteredProjects,
    filters,
    setFilters,
    resetFilters,
    exportFilteredCSV,
  } = useData();

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const projectTypes: ProjectType[] = ['Building', 'Bridge', 'Tunnel', 'Dam', 'Road'];
  const locations: LocationCity[] = ['Houston', 'Seattle', 'Los Angeles', 'New York', 'Chicago'];
  const riskLevels: RiskLevel[] = ['High', 'Medium', 'Low'];

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    (filters.projectType !== 'All' ? 1 : 0) +
    (filters.location !== 'All' ? 1 : 0) +
    (filters.riskLevel !== 'All' ? 1 : 0) +
    (filters.weather !== 'All' ? 1 : 0) +
    (filters.anomalyOnly ? 1 : 0) +
    (filters.attentionOnly ? 1 : 0) +
    (filters.costOverrunOnly ? 1 : 0) +
    (filters.delayedOnly ? 1 : 0) +
    (filters.completionRange[0] > 0 || filters.completionRange[1] < 100 ? 1 : 0);

  return (
    <div className="sticky top-0 z-30 mb-6 rounded-xl border border-slate-800 bg-[#0d131d]/95 backdrop-blur-md p-4 shadow-xl">
      {/* Primary Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Project ID, Type, City, Risk..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-sans"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
            >
              ×
            </button>
          )}
        </div>

        {/* Quick Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Project Type */}
          <div className="relative">
            <select
              value={filters.projectType}
              onChange={(e) => setFilters((prev) => ({ ...prev, projectType: e.target.value }))}
              aria-label="Filter by project type"
              className="appearance-none pl-3 pr-8 py-2 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="All">All Asset Types</option>
              {projectTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Location */}
          <div className="relative">
            <select
              value={filters.location}
              onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
              aria-label="Filter by city location"
              className="appearance-none pl-3 pr-8 py-2 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="All">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Risk Level */}
          <div className="relative">
            <select
              value={filters.riskLevel}
              onChange={(e) => setFilters((prev) => ({ ...prev, riskLevel: e.target.value }))}
              aria-label="Filter by risk category"
              className="appearance-none pl-3 pr-8 py-2 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="All">All Risk Levels</option>
              {riskLevels.map((r) => (
                <option key={r} value={r}>
                  {r} Risk
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Advanced toggle */}
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
              isAdvancedOpen || activeFilterCount > 0
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Right action group: Count, Reset, Upload, Export */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
            Showing <span className="font-bold text-amber-400">{filteredProjects.length}</span> of{' '}
            <span className="text-slate-400">{projects.length}</span>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              title="Reset all filters"
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {onOpenUploadModal && (
            <button
              onClick={onOpenUploadModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer shadow-sm"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Import CSV</span>
            </button>
          )}

          <button
            onClick={exportFilteredCSV}
            title="Export filtered dataset to CSV"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter Expansion Panel */}
      {isAdvancedOpen && (
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Quick Filter Chips */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
              Management Flags
            </span>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.attentionOnly}
                  onChange={(e) => setFilters((p) => ({ ...p, attentionOnly: e.target.checked }))}
                  className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900"
                />
                <span className="flex items-center gap-1 text-amber-400">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  Management Attention (Score ≥ 40)
                </span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.anomalyOnly}
                  onChange={(e) => setFilters((p) => ({ ...p, anomalyOnly: e.target.checked }))}
                  className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900"
                />
                <span className="flex items-center gap-1 text-rose-400">
                  <Activity className="w-3.5 h-3.5" />
                  Sensor Anomaly Detected
                </span>
              </label>
            </div>
          </div>

          {/* Cost & Schedule Flags */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
              Variance Conditions
            </span>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.costOverrunOnly}
                  onChange={(e) => setFilters((p) => ({ ...p, costOverrunOnly: e.target.checked }))}
                  className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900"
                />
                <span className="flex items-center gap-1 text-rose-300">
                  <DollarSign className="w-3.5 h-3.5 text-rose-400" />
                  Over Budget Only (Overrun &gt; $0)
                </span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.delayedOnly}
                  onChange={(e) => setFilters((p) => ({ ...p, delayedOnly: e.target.checked }))}
                  className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900"
                />
                <span className="flex items-center gap-1 text-amber-300">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Schedule Delayed Only (&gt; 0 days)
                </span>
              </label>
            </div>
          </div>

          {/* Completion Range Slider */}
          <div className="space-y-2 sm:col-span-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono uppercase text-slate-400 font-semibold">
                Completion Range
              </span>
              <span className="font-mono text-amber-400 font-bold">
                {filters.completionRange[0]}% - {filters.completionRange[1]}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400">Min: {filters.completionRange[0]}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.completionRange[0]}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFilters((p) => ({
                      ...p,
                      completionRange: [Math.min(val, p.completionRange[1]), p.completionRange[1]],
                    }));
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Max: {filters.completionRange[1]}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.completionRange[1]}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFilters((p) => ({
                      ...p,
                      completionRange: [p.completionRange[0], Math.max(val, p.completionRange[0])],
                    }));
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
