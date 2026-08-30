import React from 'react';
import { useData } from '../context/DataContext';
import { KPICard } from '../components/common/KPICard';
import { ChartCard } from '../components/common/ChartCard';
import { FilterBar } from '../components/common/FilterBar';
import { DataTable } from '../components/common/DataTable';
import { formatPercent, formatNumber } from '../utils/formatters';
import { ShieldAlert, AlertTriangle, Activity, Cpu, AlertOctagon } from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

export const RiskCommandPage: React.FC = () => {
  const { filteredProjects, kpis, setSelectedProject } = useData();

  // Structural Telemetry: Crack Width vs Vibration Level
  const sensorScatterData = filteredProjects.map((p) => ({
    id: p.Project_ID,
    crackWidth: Number(p.Crack_Width.toFixed(2)),
    vibration: Number(p.Vibration_Level.toFixed(3)),
    loadBearing: p.Load_Bearing_Capacity,
    anomaly: p.Anomaly_Detected,
    risk: p.Risk_Level,
    type: p.Project_Type,
    rawProject: p,
  }));

  // Risk Level by Project Type Breakdown
  const riskByType: Record<string, { high: number; medium: number; low: number }> = {};
  filteredProjects.forEach((p) => {
    if (!riskByType[p.Project_Type]) {
      riskByType[p.Project_Type] = { high: 0, medium: 0, low: 0 };
    }
    if (p.Risk_Level === 'High') riskByType[p.Project_Type].high += 1;
    else if (p.Risk_Level === 'Medium') riskByType[p.Project_Type].medium += 1;
    else riskByType[p.Project_Type].low += 1;
  });

  const riskByTypeData = Object.entries(riskByType).map(([type, stats]) => ({
    type,
    high: stats.high,
    medium: stats.medium,
    low: stats.low,
  }));

  // High Risk & Anomalous Projects
  const highRiskProjects = filteredProjects
    .filter((p) => p.Risk_Level === 'High' || p.Anomaly_Detected)
    .sort((a, b) => b.Attention_Score - a.Attention_Score);

  return (
    <div className="space-y-6">
      <FilterBar />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="High Risk Projects"
          value={`${kpis.highRiskCount} Records`}
          supportingText={`${(((kpis.highRiskCount) / (kpis.totalProjects || 1)) * 100).toFixed(1)}% of active portfolio records`}
          icon={AlertOctagon}
          variant="alert"
        />

        <KPICard
          label="Sensor Anomalies Detected"
          value={`${kpis.anomaliesDetectedCount} Flags`}
          supportingText="IoT vibration, crack or safety threshold breaches"
          icon={Activity}
          variant={kpis.anomaliesDetectedCount > 0 ? 'warning' : 'default'}
        />

        <KPICard
          label="Avg Safety Risk Score"
          value={`${kpis.averageSafetyRiskScore.toFixed(1)} / 10`}
          supportingText="Evaluated via multi-factor HSE formula"
          icon={ShieldAlert}
          variant={kpis.averageSafetyRiskScore > 6 ? 'alert' : 'default'}
        />

        <KPICard
          label="Computer Vision Health"
          value={`${kpis.averageImageAnalysisScore.toFixed(1)}%`}
          supportingText="Automated drone/camera image analysis"
          icon={Cpu}
          variant="indigo"
        />
      </div>

      {/* Sensor Scatter & Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crack Width vs Vibration Level */}
        <ChartCard
          title="Structural Sensor Telemetry (Crack Width vs Vibration)"
          subtitle="Real-time IoT sensor telemetry. Red markers indicate flagged anomalies or high risk conditions."
          badge="SENSOR TELEMETRY"
        >
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                type="number"
                dataKey="crackWidth"
                name="Crack Width (mm)"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                unit=" mm"
              />
              <YAxis
                type="number"
                dataKey="vibration"
                name="Vibration (mm/s)"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                unit=" mm/s"
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Scatter
                name="Sensors"
                data={sensorScatterData}
                fill="#f43f5e"
                onClick={(e: any) => {
                  if (e && e.rawProject) setSelectedProject(e.rawProject);
                }}
              >
                {sensorScatterData.map((entry, index) => {
                  let color = '#10b981';
                  if (entry.anomaly || entry.risk === 'High') color = '#f43f5e';
                  else if (entry.risk === 'Medium') color = '#f59e0b';
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Risk Distribution by Project Type */}
        <ChartCard
          title="Risk Level Profile by Asset Category"
          subtitle="Comparative risk tier volume across Buildings, Bridges, Tunnels, Dams & Roads"
          badge="RISK BREAKDOWN"
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={riskByTypeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="type" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="high" name="High Risk" fill="#f43f5e" stackId="a" />
              <Bar dataKey="medium" name="Medium Risk" fill="#f59e0b" stackId="a" />
              <Bar dataKey="low" name="Low Risk" fill="#10b981" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Critical Risk Register */}
      <DataTable
        projects={highRiskProjects}
        title="Active Risk & Telemetry Escalation Register"
        subtitle="All projects currently marked High Risk or exhibiting sensor anomaly triggers"
      />
    </div>
  );
};
