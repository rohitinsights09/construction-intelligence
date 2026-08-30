import React from 'react';
import { Github, ExternalLink, Building2, Code2, Database, ShieldCheck, Cpu, Award } from 'lucide-react';
import { BlueprintGrid } from '../components/common/BlueprintGrid';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0f1420] p-8 shadow-2xl">
        <BlueprintGrid opacity={0.04} />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
            <Building2 className="w-3.5 h-3.5" />
            <span>ENTERPRISE CONSTRUCTION ANALYTICS PLATFORM</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            CONSTRUCTION INTELLIGENCE
            <span className="block text-slate-400 text-lg lg:text-xl font-normal mt-1 font-sans">
              Project Analytics & Command Center
            </span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            A specialized decision-support system built for infrastructure executives, project directors,
            and commercial controllers. It integrates BIM-AI telemetry, IoT structural health sensors,
            earned value management (EVMS), and predictive machine intelligence to provide granular project
            oversight.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold font-mono text-sm">
                RS
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                  CREATED BY
                </span>
                <span className="text-sm font-bold text-white block">Rohit Shinde</span>
                <span className="text-xs text-amber-400/90 font-mono">Data Analyst | Analytics Portfolio</span>
              </div>
            </div>

            <a
              href="https://github.com/rohitinsights09"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors shadow-sm"
            >
              <Github className="w-4 h-4 text-amber-400" />
              <span>GitHub: @rohitinsights09</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Methodology & Mathematical Foundations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-slate-800 bg-[#0f1420] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
            <Code2 className="w-4 h-4 text-amber-400" />
            Analytical Methodology & EVMS
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The platform computes deterministic project health indicators based on standard ISO 21500 and
            Project Management Institute (PMI) standards:
          </p>
          <ul className="text-xs text-slate-300 space-y-2 font-mono">
            <li className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-amber-400 font-bold">CPI (Cost Performance Index):</span>
              <span className="text-slate-400 block text-[11px] mt-0.5">Planned Cost / Actual Cost (Values &lt; 1.0 indicate overrun)</span>
            </li>
            <li className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-amber-400 font-bold">SPI (Schedule Performance Index):</span>
              <span className="text-slate-400 block text-[11px] mt-0.5">Planned Duration / Actual Duration (Values &lt; 1.0 indicate delay)</span>
            </li>
            <li className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-amber-400 font-bold">Attention Score (0 - 100):</span>
              <span className="text-slate-400 block text-[11px] mt-0.5">Weighted composite of Cost Overrun %, Schedule Deviation, Safety Score and Sensor Anomalies</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-xl border border-slate-800 bg-[#0f1420] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
            <Database className="w-4 h-4 text-cyan-400" />
            Dataset & Telemetry Dimensions
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The application operates on 28 multidimensional parameters across 1,000 infrastructure records:
          </p>
          <ul className="text-xs text-slate-300 space-y-2 font-mono">
            <li className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-cyan-400 font-bold">Project Classifications:</span>
              <span className="text-slate-400 block text-[11px] mt-0.5">Buildings, Bridges, Tunnels, Dams, and Roads across 5 Metropolitan Hubs</span>
            </li>
            <li className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-cyan-400 font-bold">Structural Telemetry:</span>
              <span className="text-slate-400 block text-[11px] mt-0.5">Vibration levels (mm/s), Crack width (mm), Load bearing capacity (kN)</span>
            </li>
            <li className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-cyan-400 font-bold">AI Computer Vision:</span>
              <span className="text-slate-400 block text-[11px] mt-0.5">Automated image analysis scores & automated sensor anomaly flag detection</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
