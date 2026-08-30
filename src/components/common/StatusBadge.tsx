import React from 'react';
import { RiskLevel, ProjectType, WeatherCondition } from '../../types';
import { AlertTriangle, CheckCircle2, AlertOctagon, CloudRain, Sun, CloudSnow, Cloud, Zap, Building2, HardHat, Compass, GitMerge, Milestone } from 'lucide-react';

export const RiskBadge: React.FC<{ level: RiskLevel | string; size?: 'sm' | 'md' }> = ({ level, size = 'sm' }) => {
  const norm = level?.toLowerCase() || 'medium';
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  if (norm === 'high') {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded border border-rose-500/30 bg-rose-500/10 text-rose-400 ${sizeClasses}`}>
        <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
        High Risk
      </span>
    );
  }
  if (norm === 'medium') {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded border border-amber-500/30 bg-amber-500/10 text-amber-400 ${sizeClasses}`}>
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        Medium Risk
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 ${sizeClasses}`}>
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
      Low Risk
    </span>
  );
};

export const HealthBadge: React.FC<{ status: 'Critical' | 'Warning' | 'On Track' | 'Optimized'; size?: 'sm' | 'md' }> = ({ status, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  switch (status) {
    case 'Critical':
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded border border-rose-500/30 bg-rose-500/15 text-rose-400 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          Critical Action
        </span>
      );
    case 'Warning':
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded border border-amber-500/30 bg-amber-500/15 text-amber-400 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          At Risk
        </span>
      );
    case 'Optimized':
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded border border-cyan-500/30 bg-cyan-500/15 text-cyan-300 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          Ahead / Under Budget
        </span>
      );
    case 'On Track':
    default:
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          On Track
        </span>
      );
  }
};

export const ProjectTypeBadge: React.FC<{ type: ProjectType | string }> = ({ type }) => {
  const getIcon = () => {
    switch (type) {
      case 'Building':
        return <Building2 className="w-3.5 h-3.5 text-blue-400" />;
      case 'Bridge':
        return <GitMerge className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Tunnel':
        return <Compass className="w-3.5 h-3.5 text-purple-400" />;
      case 'Dam':
        return <HardHat className="w-3.5 h-3.5 text-teal-400" />;
      case 'Road':
      default:
        return <Milestone className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
      {getIcon()}
      {type}
    </span>
  );
};

export const WeatherBadge: React.FC<{ condition: WeatherCondition | string }> = ({ condition }) => {
  const getIcon = () => {
    switch (condition) {
      case 'Sunny':
        return <Sun className="w-3 h-3 text-amber-400" />;
      case 'Cloudy':
        return <Cloud className="w-3 h-3 text-slate-400" />;
      case 'Rainy':
        return <CloudRain className="w-3 h-3 text-blue-400" />;
      case 'Snowy':
        return <CloudSnow className="w-3 h-3 text-cyan-300" />;
      case 'Stormy':
      default:
        return <Zap className="w-3 h-3 text-yellow-400" />;
    }
  };

  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/60">
      {getIcon()}
      {condition}
    </span>
  );
};
