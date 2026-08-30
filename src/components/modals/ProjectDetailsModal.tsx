import React from 'react';
import { ConstructionProject } from '../../types';
import { formatCurrency, formatPercent, formatDays, formatDate, formatNumber } from '../../utils/formatters';
import { RiskBadge, ProjectTypeBadge, HealthBadge, WeatherBadge } from '../common/StatusBadge';
import { X, Calendar, DollarSign, Clock, ShieldAlert, Activity, HardHat, Gauge, AlertTriangle, CheckCircle2, Cpu, Wrench, Thermometer, Wind } from 'lucide-react';
import { BlueprintGrid } from '../common/BlueprintGrid';

interface ProjectDetailsModalProps {
  project: ConstructionProject | null;
  onClose: () => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700/80 bg-[#0f141f] text-slate-100 shadow-2xl p-6 lg:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <BlueprintGrid opacity={0.03} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header section */}
        <div className="relative z-10 border-b border-slate-800 pb-5 mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400">
              {project.Project_ID}
            </span>
            <ProjectTypeBadge type={project.Project_Type} />
            <RiskBadge level={project.Risk_Level} size="md" />
            <HealthBadge status={project.Health_Status} size="md" />
            {project.Anomaly_Detected && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                <Activity className="w-3.5 h-3.5" />
                Sensor Anomaly Flagged
              </span>
            )}
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {project.Project_Type} Infrastructure — {project.Location}
          </h2>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Timeline: {formatDate(project.Start_Date)} &rarr; {formatDate(project.End_Date)}</span>
          </p>
        </div>

        {/* Modal Body Content Grid */}
        <div className="space-y-6 relative z-10 text-xs">
          {/* Section 1: Progress & Attention Diagnostic */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-mono text-slate-300 font-bold uppercase">
                Construction Completion Progress
              </span>
              <span className="font-mono text-amber-400 font-bold text-sm">
                {formatPercent(project.Completion_Percentage, false, 1)}
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  project.Completion_Percentage >= 80
                    ? 'bg-emerald-500'
                    : project.Completion_Percentage >= 40
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, project.Completion_Percentage)}%` }}
              />
            </div>

            {project.Attention_Reasons.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-mono text-amber-400 uppercase font-semibold block mb-1.5">
                  Management Attention Triggers (Score: {project.Attention_Score}/100)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.Attention_Reasons.map((reason, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-rose-950/40 border border-rose-700/40 text-rose-300 text-[11px]">
                      &bull; {reason}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Financial & Schedule Intelligence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Financial Card */}
            <div className="p-4 rounded-xl border border-slate-800 bg-[#121722] space-y-3">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-sm border-b border-slate-800 pb-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Financial Performance (EV / CPI)
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Planned Cost</span>
                  <span className="text-sm font-bold text-slate-200">{formatCurrency(project.Planned_Cost)}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Actual Cost</span>
                  <span className="text-sm font-bold text-white">{formatCurrency(project.Actual_Cost)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800/60 font-mono">
                <span className="text-slate-400">Cost Variance:</span>
                <span className={`font-bold ${project.Cost_Overrun > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {project.Cost_Overrun > 0 ? '+' : ''}
                  {formatCurrency(project.Cost_Overrun)} ({formatPercent(project.Cost_Overrun_Percentage, true)})
                </span>
              </div>

              <div className="flex justify-between items-center font-mono">
                <span className="text-slate-400">Cost Perf. Index (CPI):</span>
                <span className={`font-bold ${project.Cost_Performance_Index < 0.9 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {project.Cost_Performance_Index.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Schedule Card */}
            <div className="p-4 rounded-xl border border-slate-800 bg-[#121722] space-y-3">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-sm border-b border-slate-800 pb-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Schedule Performance (SPI / CPM)
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Planned Duration</span>
                  <span className="text-sm font-bold text-slate-200">{formatDays(project.Planned_Duration)}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Actual Duration</span>
                  <span className="text-sm font-bold text-white">{formatDays(project.Actual_Duration)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800/60 font-mono">
                <span className="text-slate-400">Schedule Deviation:</span>
                <span className={`font-bold ${project.Schedule_Deviation > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {formatDays(project.Schedule_Deviation, true)} ({formatPercent(project.Schedule_Deviation_Percentage, true)})
                </span>
              </div>

              <div className="flex justify-between items-center font-mono">
                <span className="text-slate-400">Schedule Perf. Index (SPI):</span>
                <span className={`font-bold ${project.Schedule_Performance_Index < 0.9 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {project.Schedule_Performance_Index.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Structural & Sensor Telemetry */}
          <div className="p-4 rounded-xl border border-slate-800 bg-[#121722] space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-sm border-b border-slate-800 pb-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Structural Health & Computer Vision Inspection
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Crack Width</span>
                <span className={`text-base font-bold ${project.Crack_Width > 3.5 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {project.Crack_Width.toFixed(2)} mm
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Vibration Level</span>
                <span className="text-base font-bold text-slate-200">
                  {project.Vibration_Level.toFixed(3)} mm/s
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Load Bearing Cap.</span>
                <span className="text-base font-bold text-slate-200">
                  {project.Load_Bearing_Capacity.toFixed(1)} kN
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">CV Image Score</span>
                <span className="text-base font-bold text-cyan-400">
                  {project.Image_Analysis_Score.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Operational Resources & Environmental Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Resources */}
            <div className="p-4 rounded-xl border border-slate-800 bg-[#121722] space-y-3">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-sm border-b border-slate-800 pb-2">
                <Wrench className="w-4 h-4 text-purple-400" />
                Resource Utilization
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Labor Hours</span>
                  <span className="text-sm font-bold text-slate-200">{formatNumber(project.Labor_Hours)} hrs</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Equipment Util.</span>
                  <span className="text-sm font-bold text-amber-400">{formatPercent(project.Equipment_Utilization)}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Material Usage</span>
                  <span className="text-sm font-bold text-slate-200">{project.Material_Usage.toFixed(1)} tons</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Energy Consump.</span>
                  <span className="text-sm font-bold text-slate-200">{formatNumber(project.Energy_Consumption)} kWh</span>
                </div>
              </div>
            </div>

            {/* Safety & Environment */}
            <div className="p-4 rounded-xl border border-slate-800 bg-[#121722] space-y-3">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-sm border-b border-slate-800 pb-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Safety & Environment Audit
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Accidents</span>
                  <span className={`text-sm font-bold ${project.Accident_Count > 4 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {project.Accident_Count} incidents
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Safety Risk Score</span>
                  <span className={`text-sm font-bold ${project.Safety_Risk_Score > 7 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {project.Safety_Risk_Score.toFixed(1)} / 10
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Weather & Temp</span>
                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 mt-0.5">
                    <WeatherBadge condition={project.Weather_Condition} />
                    <span>{project.Temperature.toFixed(1)}°C</span>
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Air Quality & Humidity</span>
                  <span className="text-xs font-bold text-slate-200 block mt-0.5">
                    AQI {project.Air_Quality_Index} | {project.Humidity.toFixed(1)}% Hum.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Source: BIM-AI Telemetry & Predictive Analytics Registry
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
