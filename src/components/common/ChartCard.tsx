import React, { ReactNode } from 'react';
import { BlueprintGrid } from './BlueprintGrid';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  minHeight?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  badge,
  action,
  children,
  className = '',
  minHeight = 'min-h-[320px]',
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-800/90 bg-[#111722] p-5 shadow-lg flex flex-col justify-between ${className}`}
    >
      <BlueprintGrid opacity={0.02} />

      <div className="relative z-10 flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm lg:text-base font-bold tracking-tight text-slate-100">
              {title}
            </h3>
            {badge && (
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className={`relative z-10 w-full flex-1 ${minHeight}`}>
        {children}
      </div>
    </div>
  );
};
