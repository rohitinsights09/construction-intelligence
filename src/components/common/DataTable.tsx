import React, { useState, useMemo } from 'react';
import { ConstructionProject } from '../../types';
import { formatCurrency, formatPercent, formatDays, formatDate, formatNumber } from '../../utils/formatters';
import { RiskBadge, ProjectTypeBadge, HealthBadge } from './StatusBadge';
import { ChevronUp, ChevronDown, ChevronsUpDown, Eye, ArrowUpDown, ChevronLeft, ChevronRight, Activity, Download } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface ColumnDef {
  key: keyof ConstructionProject | 'actions';
  label: string;
  render?: (project: ConstructionProject) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  defaultVisible?: boolean;
}

interface DataTableProps {
  projects: ConstructionProject[];
  onSelectProject?: (project: ConstructionProject) => void;
  title?: string;
  subtitle?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  projects,
  onSelectProject,
  title,
  subtitle,
}) => {
  const { setSelectedProject } = useData();
  const [sortField, setSortField] = useState<keyof ConstructionProject>('Project_ID');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const [columnVisibilityMenuOpen, setColumnVisibilityMenuOpen] = useState(false);

  const columns: ColumnDef[] = useMemo(
    () => [
      {
        key: 'Project_ID',
        label: 'Project ID',
        sortable: true,
        defaultVisible: true,
        render: (p) => (
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-amber-400 text-xs hover:underline cursor-pointer">
              {p.Project_ID}
            </span>
            {p.Anomaly_Detected && (
              <span title="Sensor Anomaly Detected" className="p-1 rounded bg-rose-500/20 text-rose-400">
                <Activity className="w-3 h-3 animate-pulse" />
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'Project_Type',
        label: 'Type',
        sortable: true,
        defaultVisible: true,
        render: (p) => <ProjectTypeBadge type={p.Project_Type} />,
      },
      {
        key: 'Location',
        label: 'City',
        sortable: true,
        defaultVisible: true,
        render: (p) => <span className="text-slate-300 font-medium">{p.Location}</span>,
      },
      {
        key: 'Risk_Level',
        label: 'Risk Level',
        sortable: true,
        defaultVisible: true,
        render: (p) => <RiskBadge level={p.Risk_Level} />,
      },
      {
        key: 'Health_Status',
        label: 'Health Status',
        sortable: true,
        defaultVisible: true,
        render: (p) => <HealthBadge status={p.Health_Status} />,
      },
      {
        key: 'Planned_Cost',
        label: 'Planned Cost',
        sortable: true,
        align: 'right',
        defaultVisible: true,
        render: (p) => <span className="font-mono text-slate-300">{formatCurrency(p.Planned_Cost, true)}</span>,
      },
      {
        key: 'Actual_Cost',
        label: 'Actual Cost',
        sortable: true,
        align: 'right',
        defaultVisible: true,
        render: (p) => <span className="font-mono font-semibold text-slate-100">{formatCurrency(p.Actual_Cost, true)}</span>,
      },
      {
        key: 'Cost_Overrun',
        label: 'Cost Variance',
        sortable: true,
        align: 'right',
        defaultVisible: true,
        render: (p) => {
          const isOver = p.Cost_Overrun > 0;
          return (
            <span
              className={`font-mono text-xs font-semibold ${
                isOver ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {isOver ? '+' : ''}
              {formatCurrency(p.Cost_Overrun, true)} ({formatPercent(p.Cost_Overrun_Percentage, true)})
            </span>
          );
        },
      },
      {
        key: 'Planned_Duration',
        label: 'Plan Dur.',
        sortable: true,
        align: 'right',
        defaultVisible: false,
        render: (p) => <span className="font-mono text-slate-400">{formatDays(p.Planned_Duration)}</span>,
      },
      {
        key: 'Actual_Duration',
        label: 'Actual Dur.',
        sortable: true,
        align: 'right',
        defaultVisible: false,
        render: (p) => <span className="font-mono text-slate-300">{formatDays(p.Actual_Duration)}</span>,
      },
      {
        key: 'Schedule_Deviation',
        label: 'Schedule Dev.',
        sortable: true,
        align: 'right',
        defaultVisible: true,
        render: (p) => {
          const isDelayed = p.Schedule_Deviation > 0;
          return (
            <span
              className={`font-mono text-xs font-semibold ${
                isDelayed ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {formatDays(p.Schedule_Deviation, true)}
            </span>
          );
        },
      },
      {
        key: 'Completion_Percentage',
        label: 'Completion',
        sortable: true,
        align: 'right',
        defaultVisible: true,
        render: (p) => (
          <div className="flex items-center justify-end gap-2">
            <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden hidden sm:block">
              <div
                className={`h-full rounded-full ${
                  p.Completion_Percentage >= 80
                    ? 'bg-emerald-500'
                    : p.Completion_Percentage >= 40
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, p.Completion_Percentage)}%` }}
              />
            </div>
            <span className="font-mono text-xs font-semibold text-slate-200">
              {formatPercent(p.Completion_Percentage, false, 0)}
            </span>
          </div>
        ),
      },
      {
        key: 'Safety_Risk_Score',
        label: 'Safety Score',
        sortable: true,
        align: 'right',
        defaultVisible: false,
        render: (p) => (
          <span
            className={`font-mono text-xs font-semibold ${
              p.Safety_Risk_Score > 7 ? 'text-rose-400' : p.Safety_Risk_Score > 4 ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {p.Safety_Risk_Score.toFixed(1)}/10
          </span>
        ),
      },
      {
        key: 'Accident_Count',
        label: 'Incidents',
        sortable: true,
        align: 'right',
        defaultVisible: false,
        render: (p) => (
          <span className={`font-mono text-xs ${p.Accident_Count > 4 ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
            {p.Accident_Count}
          </span>
        ),
      },
      {
        key: 'Labor_Hours',
        label: 'Labor Hrs',
        sortable: true,
        align: 'right',
        defaultVisible: false,
        render: (p) => <span className="font-mono text-slate-300">{formatNumber(p.Labor_Hours)}h</span>,
      },
      {
        key: 'Start_Date',
        label: 'Start Date',
        sortable: true,
        defaultVisible: false,
        render: (p) => <span className="font-mono text-xs text-slate-400">{formatDate(p.Start_Date)}</span>,
      },
      {
        key: 'actions',
        label: 'Action',
        align: 'center',
        defaultVisible: true,
        render: (p) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onSelectProject) onSelectProject(p);
              else setSelectedProject(p);
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
            title="Inspect project details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        ),
      },
    ],
    [onSelectProject, setSelectedProject]
  );

  // Initialize visible columns
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    columns.forEach((col) => {
      initial[col.key] = col.defaultVisible ?? true;
    });
    return initial;
  });

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSort = (field: keyof ConstructionProject) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'boolean') {
        return sortDirection === 'asc' ? (aVal === bVal ? 0 : aVal ? 1 : -1) : aVal === bVal ? 0 : aVal ? -1 : 1;
      }
      return 0;
    });
  }, [projects, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedProjects.length / pageSize) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedProjects.slice(start, start + pageSize);
  }, [sortedProjects, currentPage, pageSize]);

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0f1520] shadow-xl overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-slate-900/60">
        <div>
          {title && <h3 className="text-base font-bold text-slate-100">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Column Visibility Toggler */}
          <div className="relative">
            <button
              onClick={() => setColumnVisibilityMenuOpen(!columnVisibilityMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Columns</span>
            </button>

            {columnVisibilityMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-40 space-y-1.5 max-h-80 overflow-y-auto">
                <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold pb-1.5 border-b border-slate-800">
                  Toggle Columns
                </div>
                {columns
                  .filter((c) => c.key !== 'actions')
                  .map((col) => (
                    <label
                      key={col.key}
                      className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none py-1 px-1 rounded hover:bg-slate-800"
                    >
                      <input
                        type="checkbox"
                        checked={!!visibleColumns[col.key]}
                        onChange={() => toggleColumn(col.key)}
                        className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500"
                      />
                      <span>{col.label}</span>
                    </label>
                  ))}
              </div>
            )}
          </div>

          {/* Page size selector */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            aria-label="Records per page"
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer"
          >
            <option value={10}>10 / page</option>
            <option value={15}>15 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-mono text-[11px] tracking-wider uppercase">
              {columns
                .filter((c) => visibleColumns[c.key])
                .map((col) => (
                  <th
                    key={col.key}
                    onClick={() => {
                      if (col.sortable && col.key !== 'actions') {
                        handleSort(col.key as keyof ConstructionProject);
                      }
                    }}
                    className={`px-4 py-3 select-none ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${
                      col.sortable ? 'cursor-pointer hover:text-amber-400 transition-colors' : ''
                    }`}
                  >
                    <div className={`inline-flex items-center gap-1.5 ${col.align === 'right' ? 'justify-end' : ''}`}>
                      <span>{col.label}</span>
                      {col.sortable && (
                        <span>
                          {sortField === col.key ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3 h-3 text-slate-600 opacity-60" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {paginatedProjects.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-slate-500 font-mono">
                  No project records available for active filters.
                </td>
              </tr>
            ) : (
              paginatedProjects.map((project) => (
                <tr
                  key={project.Project_ID}
                  onClick={() => {
                    if (onSelectProject) onSelectProject(project);
                    else setSelectedProject(project);
                  }}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  {columns
                    .filter((c) => visibleColumns[c.key])
                    .map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 whitespace-nowrap ${
                          col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                        }`}
                      >
                        {col.render ? col.render(project) : String(project[col.key as keyof ConstructionProject] ?? '-')}
                      </td>
                    ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
        <div>
          Showing <span className="text-amber-400 font-bold">{(currentPage - 1) * pageSize + 1}</span> to{' '}
          <span className="text-amber-400 font-bold">
            {Math.min(currentPage * pageSize, sortedProjects.length)}
          </span>{' '}
          of <span className="text-slate-200">{sortedProjects.length}</span> entries
        </div>

        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 rounded bg-slate-800 text-slate-200 text-xs">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
