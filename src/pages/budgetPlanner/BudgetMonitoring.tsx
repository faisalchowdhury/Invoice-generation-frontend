/**
 * File: src/pages/budget/BudgetMonitoring.tsx
 * Complete Budget Monitoring page with list view, filters, search, and pagination
 * Based on provided screenshots design
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import { useResourceData } from "@/hooks/useResourceData";
import {
  budgetMonitoringHooks,
  type BudgetMonitoringRow,
} from "@/services/budgetPlanner";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BudgetMonitoring {
  id: string;
  budget: string;
  date: string;
  allocated: number;
  spent: number;
  remaining: number;
  variancePercent: number;
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleBudgetMonitoring: BudgetMonitoring[] = [
  {
    id: "1",
    budget: "Marketing Budget",
    date: "2024-05-31",
    allocated: 50000.0,
    spent: 50000.0,
    remaining: 0.0,
    variancePercent: 0.0,
    createdAt: "2024-05-31",
  },
  {
    id: "2",
    budget: "Marketing Budget",
    date: "2024-04-30",
    allocated: 50000.0,
    spent: 48500.0,
    remaining: 1500.0,
    variancePercent: 3.0,
    createdAt: "2024-04-30",
  },
  {
    id: "3",
    budget: "Marketing Budget",
    date: "2024-03-31",
    allocated: 50000.0,
    spent: 42000.0,
    remaining: 8000.0,
    variancePercent: 10.0,
    createdAt: "2024-03-31",
  },
  {
    id: "4",
    budget: "Marketing Budget",
    date: "2024-02-29",
    allocated: 50000.0,
    spent: 25000.0,
    remaining: 25000.0,
    variancePercent: 0.0,
    createdAt: "2024-02-29",
  },
  {
    id: "5",
    budget: "Marketing Budget",
    date: "2024-01-31",
    allocated: 50000.0,
    spent: 12000.0,
    remaining: 38000.0,
    variancePercent: -4.0,
    createdAt: "2024-01-31",
  },
  {
    id: "6",
    budget: "IT Infrastructure",
    date: "2024-05-31",
    allocated: 75000.0,
    spent: 75000.0,
    remaining: 0.0,
    variancePercent: 0.0,
    createdAt: "2024-05-31",
  },
  {
    id: "7",
    budget: "IT Infrastructure",
    date: "2024-04-30",
    allocated: 75000.0,
    spent: 72000.0,
    remaining: 3000.0,
    variancePercent: 4.0,
    createdAt: "2024-04-30",
  },
  {
    id: "8",
    budget: "HR Operations",
    date: "2024-05-31",
    allocated: 30000.0,
    spent: 28000.0,
    remaining: 2000.0,
    variancePercent: 6.67,
    createdAt: "2024-05-31",
  },
];

const budgets = [
  "All",
  "Marketing Budget",
  "IT Infrastructure",
  "HR Operations",
  "Office Supplies",
  "Research & Development",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField =
  | "budget"
  | "date"
  | "allocated"
  | "spent"
  | "remaining"
  | "variancePercent";
type SortDir = "asc" | "desc";

// ─── API ↔ display mapping (read-only; tolerant of snake/camel + seed) ─────────

const refName = (v: any): string =>
  v && typeof v === "object" ? v.budget_name ?? v.name ?? "" : typeof v === "string" ? v : "";

function mapFromApi(m: any): BudgetMonitoring {
  const allocated = Number(m.allocated ?? m.allocated_amount ?? 0);
  const spent = Number(m.spent ?? m.spent_amount ?? 0);
  const remaining = Number(m.remaining ?? m.remaining_amount ?? allocated - spent);
  return {
    id: String(m.id ?? m._id ?? ""),
    budget: refName(m.budget ?? m.budget_id),
    date: (m.date ?? m.period ?? m.as_of_date ?? m.createdAt ?? "").slice(0, 10),
    allocated,
    spent,
    remaining,
    variancePercent: Number(
      m.variancePercent ?? m.utilization_percentage ?? m.variance_percentage ?? 0,
    ),
    createdAt: (m.createdAt ?? m.created_at ?? "").slice(0, 10),
  };
}

// ─── Main Component ──────────────────────────────────────────────────────────

export const BudgetMonitoring: React.FC = () => {
  const navigate = useNavigate();
  const { items: rawMonitorings } = useResourceData(budgetMonitoringHooks, {
    seed: sampleBudgetMonitoring as unknown as BudgetMonitoringRow[],
    params: { page: 1, limit: 100 },
  });
  const budgetMonitorings = useMemo(
    () => rawMonitorings.map(mapFromApi),
    [rawMonitorings],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [budgetFilter, setBudgetFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // ─── Sorting ────────────────────────────────────────────────────────────────

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  // ─── Filtered & Sorted ─────────────────────────────────────────────────────

  const filteredMonitorings = useMemo(() => {
    let result = [...budgetMonitorings];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((m) => m.budget.toLowerCase().includes(q));
    }

    if (budgetFilter !== "All") {
      result = result.filter((m) => m.budget === budgetFilter);
    }

    if (dateFrom) {
      result = result.filter((m) => m.date >= dateFrom);
    }

    if (dateTo) {
      result = result.filter((m) => m.date <= dateTo);
    }

    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (
        sortField === "allocated" ||
        sortField === "spent" ||
        sortField === "remaining" ||
        sortField === "variancePercent"
      ) {
        aVal = a[sortField];
        bVal = b[sortField];
      }

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [
    budgetMonitorings,
    searchQuery,
    budgetFilter,
    dateFrom,
    dateTo,
    sortField,
    sortDir,
  ]);

  const totalPages = Math.ceil(filteredMonitorings.length / perPage);
  const paginatedMonitorings = filteredMonitorings.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  const resetFilters = () => {
    setBudgetFilter("All");
    setDateFrom("");
    setDateTo("");
    setSearchQuery("");
    setCurrentPage(1);
    showToast("Filters reset", "info");
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return "text-green-600";
    if (variance < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="w-3 h-3" />;
    if (variance < 0) return <TrendingDown className="w-3 h-3" />;
    return null;
  };

  // ─── Sort Header ────────────────────────────────────────────────────────────

  const SortHeader: React.FC<{ field: SortField; label: string }> = ({
    field,
    label,
  }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-600 cursor-pointer select-none hover:bg-gray-50 whitespace-nowrap"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown
          className={`w-3 h-3 ${sortField === field ? "text-gray-900" : "text-gray-400"}`}
        />
      </div>
    </th>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // LIST VIEW
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-hidden flex flex-col">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => navigate("/")}
            className="hover:text-gray-700"
          >
            Dashboard
          </button>
          <span>›</span>
          <button
            onClick={() => navigate("/budget-planner")}
            className="hover:text-gray-700"
          >
            Budget Planner
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Budget Monitoring</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Budget Monitoring
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => showToast("Exporting data...", "info")}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
            >
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Budget Monitoring..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full sm:w-80 pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <button
                onClick={() => showToast("Search applied", "info")}
                className="px-4 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
              >
                Search
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>

              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">Filters</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Budget
                  </label>
                  <select
                    value={budgetFilter}
                    onChange={(e) => {
                      setBudgetFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {budgets.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Date From
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => {
                        setDateFrom(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Date To
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => {
                        setDateTo(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="w-full px-4 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs text-blue-600">Total Allocated</p>
            <p className="text-sm font-bold text-blue-700">
              {fmtCurrency(
                filteredMonitorings.reduce((sum, m) => sum + m.allocated, 0),
              )}
            </p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <p className="text-xs text-orange-600">Total Spent</p>
            <p className="text-sm font-bold text-orange-700">
              {fmtCurrency(
                filteredMonitorings.reduce((sum, m) => sum + m.spent, 0),
              )}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xs text-green-600">Total Remaining</p>
            <p className="text-sm font-bold text-green-700">
              {fmtCurrency(
                filteredMonitorings.reduce((sum, m) => sum + m.remaining, 0),
              )}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <p className="text-xs text-purple-600">Average Usage</p>
            <p className="text-sm font-bold text-purple-700">
              {filteredMonitorings.length > 0
                ? (
                    (filteredMonitorings.reduce((sum, m) => sum + m.spent, 0) /
                      filteredMonitorings.reduce(
                        (sum, m) => sum + m.allocated,
                        0,
                      )) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-3 text-center">
            <p className="text-xs text-indigo-600">Total Records</p>
            <p className="text-sm font-bold text-indigo-700">
              {filteredMonitorings.length}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="budget" label="Budget" />
                <SortHeader field="date" label="Date" />
                <SortHeader field="allocated" label="Allocated" />
                <SortHeader field="spent" label="Spent" />
                <SortHeader field="remaining" label="Remaining" />
                <SortHeader field="variancePercent" label="Variance %" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedMonitorings.map((monitoring) => (
                <tr key={monitoring.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {monitoring.budget}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{monitoring.date}</td>
                  <td className="px-4 py-3 font-medium text-blue-600">
                    {fmtCurrency(monitoring.allocated)}
                  </td>
                  <td className="px-4 py-3 font-medium text-orange-600">
                    {fmtCurrency(monitoring.spent)}
                  </td>
                  <td className="px-4 py-3 font-medium text-green-600">
                    {fmtCurrency(monitoring.remaining)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {getVarianceIcon(monitoring.variancePercent)}
                      <span
                        className={`font-medium ${getVarianceColor(monitoring.variancePercent)}`}
                      >
                        {monitoring.variancePercent > 0 ? "+" : ""}
                        {monitoring.variancePercent.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedMonitorings.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No budget monitoring records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-sm text-gray-500">
            Showing{" "}
            {filteredMonitorings.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredMonitorings.length)} of{" "}
            {filteredMonitorings.length} results
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-8 h-8 text-sm rounded-md flex items-center justify-center ${
                    currentPage === pageNumber
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add missing Calendar component
const Calendar = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);
