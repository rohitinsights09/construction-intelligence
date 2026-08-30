import React from 'react';
import { SearchX, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  resetLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Matching Projects Found',
  description = 'Try broadening your search query or resetting your active filters to view portfolio records.',
  onReset,
  resetLabel = 'Reset Filters',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-slate-800 bg-slate-900/60 my-6">
      <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <SearchX className="w-7 h-7 text-amber-400" />
      </div>
      <h4 className="text-base font-semibold text-slate-200">{title}</h4>
      <p className="text-sm text-slate-400 max-w-md mt-1.5 leading-relaxed">{description}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-md cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {resetLabel}
        </button>
      )}
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ count?: number; height?: string }> = ({
  count = 4,
  height = 'h-28',
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`rounded-xl border border-slate-800 bg-slate-900/50 p-5 ${height} flex flex-col justify-between`}
        >
          <div className="w-1/2 h-3.5 bg-slate-800 rounded" />
          <div className="w-3/4 h-7 bg-slate-800 rounded mt-2" />
          <div className="w-1/3 h-3 bg-slate-800/80 rounded mt-3" />
        </div>
      ))}
    </div>
  );
};
