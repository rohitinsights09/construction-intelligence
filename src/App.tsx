import React from 'react';
import { DataProvider, useData } from './context/DataContext';
import { AppLayout } from './layouts/AppLayout';
import { OverviewPage } from './pages/OverviewPage';
import { ProjectPerformancePage } from './pages/ProjectPerformancePage';
import { CostIntelligencePage } from './pages/CostIntelligencePage';
import { ScheduleDelaysPage } from './pages/ScheduleDelaysPage';
import { RiskCommandPage } from './pages/RiskCommandPage';
import { ResourceAnalyticsPage } from './pages/ResourceAnalyticsPage';
import { SafetyAnalyticsPage } from './pages/SafetyAnalyticsPage';
import { ProjectExplorerPage } from './pages/ProjectExplorerPage';
import { DataQualityPage } from './pages/DataQualityPage';
import { AboutPage } from './pages/AboutPage';
import { LoadingSkeleton } from './components/common/EmptyState';

const MainContentRouter: React.FC = () => {
  const { activeTab, isLoading } = useData();

  if (isLoading) {
    return (
      <div className="space-y-6 py-6">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-amber-400">
          Loading BIM-AI Construction Dataset & Initializing Analytics Engine...
        </div>
        <LoadingSkeleton count={4} height="h-32" />
        <LoadingSkeleton count={2} height="h-80" />
      </div>
    );
  }

  switch (activeTab) {
    case 'overview':
      return <OverviewPage />;
    case 'performance':
      return <ProjectPerformancePage />;
    case 'cost':
      return <CostIntelligencePage />;
    case 'schedule':
      return <ScheduleDelaysPage />;
    case 'risk':
      return <RiskCommandPage />;
    case 'resources':
      return <ResourceAnalyticsPage />;
    case 'safety':
      return <SafetyAnalyticsPage />;
    case 'explorer':
      return <ProjectExplorerPage />;
    case 'quality':
      return <DataQualityPage />;
    case 'about':
      return <AboutPage />;
    default:
      return <OverviewPage />;
  }
};

export default function App() {
  return (
    <DataProvider>
      <AppLayout>
        <MainContentRouter />
      </AppLayout>
    </DataProvider>
  );
}
