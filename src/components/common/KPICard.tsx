import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BlueprintGrid } from './BlueprintGrid';

interface KPICardProps {
  label: string;
  value: string | number;
  supportingText?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
    label?: string;
  };
  variant?: 'default' | 'alert' | 'warning' | 'success' | 'indigo';
  onClick?: () => void;
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  supportingText,
  icon: Icon,
  trend,
  variant = 'default',
  onClick,
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'alert':
        return 'border-rose-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900 to-rose-950/20 text-rose-400';
      case 'warning':
        return 'border-amber-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900 to-amber-950/20 text-amber-400';
      case 'success':
        return 'border-emerald-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900 to-emerald-950/20 text-emerald-400';
      case 'indigo':
        return 'border-indigo-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900 to-indigo-950/20 text-indigo-400';
      case 'default':
      default:
        return 'border-slate-800/80 bg-gradient-to-br from-[#121824] to-[#0c1017] text-slate-100';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative group overflow-hidden rounded-xl border p-5 shadow-lg transition-all duration-200 hover:border-slate-700 hover:shadow-xl ${getVariantStyles()} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <BlueprintGrid opacity={0.03} />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase font-mono">
            {label}
          </span>
          <div className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-sans">
            {value}
          </div>
        </div>

        {Icon && (
          <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 group-hover:text-amber-400 group-hover:border-amber-500/30 transition-colors">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(supportingText || trend) && (
        <div className="relative z-10 mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2 text-xs">
          {supportingText && (
            <span className="text-slate-400 line-clamp-1">{supportingText}</span>
          )}

          {trend && (
            <div
              className={`flex items-center gap-1 font-medium px-2 py-0.5 rounded text-[11px] shrink-0 ${
                trend.isNeutral
                  ? 'bg-slate-800 text-slate-300'
                  : trend.isPositive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {trend.isNeutral ? (
                <Minus className="w-3 h-3" />
              ) : trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{trend.value}</span>
              {trend.label && <span className="text-slate-400 ml-0.5">{trend.label}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
