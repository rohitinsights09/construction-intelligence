import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { NavigationTab } from '../types';
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  CalendarClock,
  ShieldAlert,
  Wrench,
  HardHat,
  Compass,
  FileCheck2,
  Info,
  Github,
  Menu,
  X,
  Upload,
  RefreshCw,
  Building2,
  Database,
  ExternalLink,
} from 'lucide-react';
import { BlueprintGrid } from '../components/common/BlueprintGrid';
import { UploadCSVModal } from '../components/modals/UploadCSVModal';
import { ProjectDetailsModal } from '../components/modals/ProjectDetailsModal';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const {
    activeTab,
    setActiveTab,
    projects,
    filteredProjects,
    datasetSource,
    lastUpdated,
    selectedProject,
    setSelectedProject,
    resetToDefaultDataset,
  } = useData();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const navItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'performance', label: 'Project Performance', icon: TrendingUp },
    { id: 'cost', label: 'Cost Intelligence', icon: DollarSign },
    { id: 'schedule', label: 'Schedule & Delays', icon: CalendarClock },
    { id: 'risk', label: 'Risk Command', icon: ShieldAlert },
    { id: 'resources', label: 'Resource Analytics', icon: Wrench },
    { id: 'safety', label: 'Safety Analytics', icon: HardHat },
    { id: 'explorer', label: 'Project Explorer', icon: Compass },
    { id: 'quality', label: 'Data Quality', icon: FileCheck2 },
    { id: 'about', label: 'About', icon: Info },
  ];

  const getPageHeaderInfo = () => {
    switch (activeTab) {
      case 'overview':
        return {
          title: 'Executive Portfolio Overview',
          subtitle: 'Portfolio Command Center — Cost, Schedule, Risk and Resource Performance',
        };
      case 'performance':
        return {
          title: 'Project Performance Intelligence',
          subtitle: 'Earned value analytics, health matrices and management attention prioritization',
        };
      case 'cost':
        return {
          title: 'Cost Intelligence & Financial Analytics',
          subtitle: 'Planned vs Actual cost variances, budget overruns and capital allocation by location',
        };
      case 'schedule':
        return {
          title: 'Schedule Intelligence & Critical Delays',
          subtitle: 'Duration benchmarks, schedule slippage analysis and timeline milestones',
        };
      case 'risk':
        return {
          title: 'Risk Command & Telemetry Matrix',
          subtitle: 'Multi-parameter risk matrix, structural sensor alerts and high-risk projects',
        };
      case 'resources':
        return {
          title: 'Resource Utilization Analytics',
          subtitle: 'Labor allocation, equipment utilization rates and material & energy efficiency',
        };
      case 'safety':
        return {
          title: 'Safety & Environmental Intelligence',
          subtitle: 'Incident tracking, HSE risk scores, computer vision inspection and weather impacts',
        };
      case 'explorer':
        return {
          title: 'Master Project Explorer',
          subtitle: 'Search, sort, filter and inspect granular telemetry for all portfolio projects',
        };
      case 'quality':
        return {
          title: 'Data Quality & Schema Audit',
          subtitle: 'Completeness statistics, column type validation and missing value metrics',
        };
      case 'about':
        return {
          title: 'About Construction Intelligence',
          subtitle: 'Platform architecture, methodology and engineering background',
        };
      default:
        return { title: 'Construction Intelligence', subtitle: 'Project Analytics Platform' };
    }
  };

  const headerInfo = getPageHeaderInfo();

  return (
    <div className="min-h-screen bg-[#090d14] text-slate-100 flex flex-col lg:flex-row antialiased font-sans">
      {/* Mobile Top Nav Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0c1018] border-b border-slate-800 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-xs tracking-wider uppercase text-white block">
              CONSTRUCTION INTELLIGENCE
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Project Analytics</span>
          </div>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Primary Sidebar (Dark Navy / Charcoal) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0c111c] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:w-64 shrink-0`}
      >
        <BlueprintGrid opacity={0.025} />

        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-800/80 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-wider uppercase text-white font-sans">
                CONSTRUCTION
                <span className="block text-amber-400 font-mono font-bold tracking-widest text-[11px]">
                  INTELLIGENCE
                </span>
              </h1>
              <p className="text-[10px] font-mono text-slate-400 tracking-wide mt-0.5">
                Project Analytics Platform
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1 overflow-y-auto flex-1 relative z-10">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            ANALYTICS MODULES
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer — Attribution */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 relative z-10">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/90">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              CREATED BY
            </div>
            <div className="font-bold text-xs text-white mt-0.5">Rohit Shinde</div>
            <a
              href="https://github.com/rohitinsights09"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-400/90 hover:text-amber-300 mt-2 hover:underline transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>rohitinsights09</span>
              <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-60" />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-20 px-6 py-4 bg-[#0c111c]/90 backdrop-blur-md border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base lg:text-lg font-bold text-white tracking-tight flex items-center gap-2 font-sans">
              {headerInfo.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{headerInfo.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Live Dataset Indicator Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold">Live Dataset</span>
              <span className="text-slate-400">({projects.length} Records)</span>
            </div>

            {/* Upload CSV Trigger */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-sm cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Dataset Source</span>
            </button>

            {/* Reset to Default Dataset */}
            <button
              onClick={resetToDefaultDataset}
              title="Reload default BIM-AI construction dataset"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Profile Avatar Area */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs font-mono">
                RS
              </div>
              <div className="hidden xl:block text-left">
                <span className="text-xs font-bold text-slate-200 block leading-tight">Rohit Shinde</span>
                <span className="text-[10px] text-slate-400 font-mono">Data Analyst | Analytics Portfolio</span>
              </div>
            </div>
          </div>
        </header>

        {/* Workspace Canvas */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-[#090d14]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Global Modals */}
      <UploadCSVModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};
