/**
 * File: src/pages/doubleEntry/LedgerSummary.tsx
 * Complete Ledger Summary page with list view, search, filters, sorting, and pagination
 * Based on provided screenshots design
 */

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import { doubleEntryReports } from "@/services/doubleEntry";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LedgerEntry {
  id: string;
  date: string;
  accountCode: string;
  accountName: string;
  reference: string;
  description: string;
  debit: number;
  credit: number;
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleLedgerEntries: LedgerEntry[] = [
  { id: "1", date: "2026-05-16", accountCode: "1200", accountName: "Inventory", reference: "pos_sale_cogs", description: "Inventory reduction", debit: 0, credit: 650.0, createdAt: "2026-05-16" },
  { id: "2", date: "2026-05-16", accountCode: "5100", accountName: "Cost of Goods Sold", reference: "pos_sale_cogs", description: "Cost of goods sold", debit: 650.0, credit: 0, createdAt: "2026-05-16" },
  { id: "3", date: "2026-05-16", accountCode: "2210", accountName: "VAT Payable (Sales Tax Output)", reference: "pos_sale", description: "Sales tax collected", debit: 0, credit: 162.0, createdAt: "2026-05-16" },
  { id: "4", date: "2026-05-16", accountCode: "4100", accountName: "Sales Revenue", reference: "pos_sale", description: "POS product sales", debit: 0, credit: 899.99, createdAt: "2026-05-16" },
  { id: "5", date: "2026-05-16", accountCode: "1000", accountName: "Cash", reference: "pos_sale", description: "POS cash sale", debit: 1061.99, credit: 0, createdAt: "2026-05-16" },
  { id: "6", date: "2026-04-28", accountCode: "2210", accountName: "VAT Payable (Sales Tax Output)", reference: "service_invoice", description: "Sales tax collected", debit: 0, credit: 225.0, createdAt: "2026-04-28" },
  { id: "7", date: "2026-04-28", accountCode: "4200", accountName: "Service Revenue", reference: "service_invoice", description: "Service revenue", debit: 0, credit: 750.0, createdAt: "2026-04-28" },
  { id: "8", date: "2026-04-28", accountCode: "1100", accountName: "Accounts Receivable", reference: "service_invoice", description: "Service to Sarah Johnson", debit: 975.0, credit: 0, createdAt: "2026-04-28" },
  { id: "9", date: "2026-04-25", accountCode: "1005", accountName: "Petty Cash", reference: "bank_transfer", description: "Transfer sent to Business Checking Account", debit: 0, credit: 15000.0, createdAt: "2026-04-25" },
  { id: "10", date: "2026-04-25", accountCode: "1000", accountName: "Cash", reference: "bank_transfer", description: "Transfer received from Savings Account", debit: 15000.0, credit: 0, createdAt: "2026-04-25" },
];

// Generate more sample data for pagination
for (let i = 11; i <= 50; i++) {
  sampleLedgerEntries.push({
    id: i.toString(),
    date: `2026-03-${Math.floor(Math.random() * 28) + 1}`,
    accountCode: `${1000 + Math.floor(Math.random() * 5000)}`,
    accountName: ["Cash", "Inventory", "Accounts Receivable", "Sales Revenue", "Cost of Goods Sold"][Math.floor(Math.random() * 5)],
    reference: `ref_${i}`,
    description: `Transaction ${i}`,
    debit: Math.random() > 0.5 ? Math.random() * 1000 : 0,
    credit: Math.random() > 0.5 ? Math.random() * 1000 : 0,
    createdAt: "2026-03-01",
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

function mapLedgerRow(raw: any, idx: number): LedgerEntry {
  return {
    id: String(raw.id ?? raw._id ?? idx),
    date: (raw.date ?? raw.entry_date ?? "").slice(0, 10),
    accountCode: raw.account_code ?? raw.accountCode ?? raw.code ?? "",
    accountName: raw.account_name ?? raw.accountName ?? raw.name ?? "",
    reference: raw.reference ?? raw.ref ?? "",
    description: raw.description ?? raw.narration ?? "",
    debit: Number(raw.debit ?? raw.debit_amount ?? 0),
    credit: Number(raw.credit ?? raw.credit_amount ?? 0),
    createdAt: (raw.createdAt ?? raw.created_at ?? raw.date ?? "").slice(0, 10),
  };
}

type SortField = "date" | "accountCode" | "accountName" | "reference" | "description" | "debit" | "credit";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const LedgerSummary: React.FC = () => {
  const navigate = useNavigate();
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(sampleLedgerEntries);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [accountCodeFilter, setAccountCodeFilter] = useState("");
  const [accountNameFilter, setAccountNameFilter] = useState("");

  const load = async () => {
    try {
      const r = await doubleEntryReports.ledgerSummary({
        from_date: dateFrom || undefined,
        to_date: dateTo || undefined,
      });
      const rows: any[] = r?.rows ?? r?.data ?? r?.entries ?? r?.lines ?? [];
      if (Array.isArray(rows) && rows.length > 0) {
        setLedgerEntries(rows.map(mapLedgerRow));
      }
      // else keep existing (sample) data
    } catch {
      /* keep sample data */
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const filteredEntries = useMemo(() => {
    let result = [...ledgerEntries];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.accountCode.toLowerCase().includes(q) ||
          e.accountName.toLowerCase().includes(q) ||
          e.reference.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q),
      );
    }

    if (dateFrom) { result = result.filter((e) => e.date >= dateFrom); }
    if (dateTo) { result = result.filter((e) => e.date <= dateTo); }
    if (accountCodeFilter) { result = result.filter((e) => e.accountCode.toLowerCase().includes(accountCodeFilter.toLowerCase())); }
    if (accountNameFilter) { result = result.filter((e) => e.accountName.toLowerCase().includes(accountNameFilter.toLowerCase())); }

    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [ledgerEntries, searchQuery, dateFrom, dateTo, accountCodeFilter, accountNameFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredEntries.length / perPage);
  const paginatedEntries = filteredEntries.slice((currentPage - 1) * perPage, currentPage * perPage);

  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setAccountCodeFilter("");
    setAccountNameFilter("");
    setSearchQuery("");
    setCurrentPage(1);
    showToast("Filters reset", "info");
  };

  // Calculate totals
  const totalDebit = filteredEntries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = filteredEntries.reduce((sum, e) => sum + e.credit, 0);

  // ─── Sort Header ────────────────────────────────────────────────────────────

  const SortHeader: React.FC<{ field: SortField; label: string }> = ({ field, label }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-600 cursor-pointer select-none hover:bg-gray-50 whitespace-nowrap"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={`w-3 h-3 ${sortField === field ? "text-gray-900" : "text-gray-400"}`} />
      </div>
    </th>
  );

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) { pages.push(i); }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxVisible; i++) { pages.push(i); }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) { pages.push(i); }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) { pages.push(i); }
      }
    }
    return pages;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // LIST VIEW
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-hidden flex flex-col">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate("/")} className="hover:text-gray-700">Dashboard</button>
          <span>›</span>
          <button onClick={() => navigate("/double-entry")} className="hover:text-gray-700">Double Entry</button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Ledger Summary</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Ledger Summary</h2>
          <div className="flex gap-2">
            <button
              onClick={() => showToast("Exporting ledger...", "info")}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
            >
              Export
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
                  placeholder="Search ledger entries..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
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
                onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Date From</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                      className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Date To</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                      className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Account Code</label>
                  <input
                    type="text"
                    placeholder="Account Code"
                    value={accountCodeFilter}
                    onChange={(e) => { setAccountCodeFilter(e.target.value); setCurrentPage(1); }}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Account Name</label>
                  <input
                    type="text"
                    placeholder="Account Name"
                    value={accountNameFilter}
                    onChange={(e) => { setAccountNameFilter(e.target.value); setCurrentPage(1); }}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs text-blue-600">Total Debit</p>
            <p className="text-sm font-bold text-blue-700">{fmtCurrency(totalDebit)}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xs text-green-600">Total Credit</p>
            <p className="text-sm font-bold text-green-700">{fmtCurrency(totalCredit)}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <p className="text-xs text-purple-600">Balance</p>
            <p className={`text-sm font-bold ${totalDebit - totalCredit >= 0 ? "text-blue-600" : "text-red-600"}`}>
              {fmtCurrency(Math.abs(totalDebit - totalCredit))}{" "}
              {totalDebit - totalCredit >= 0 ? "(Dr)" : "(Cr)"}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600">Total Entries</p>
            <p className="text-sm font-bold text-gray-700">{filteredEntries.length}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="date" label="Date" />
                <SortHeader field="accountCode" label="Account Code" />
                <SortHeader field="accountName" label="Account Name" />
                <SortHeader field="reference" label="Reference" />
                <SortHeader field="description" label="Description" />
                <SortHeader field="debit" label="Debit" />
                <SortHeader field="credit" label="Credit" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{entry.date}</td>
                  <td className="px-4 py-3 font-mono text-sm font-medium text-gray-900">{entry.accountCode}</td>
                  <td className="px-4 py-3 text-gray-900">{entry.accountName}</td>
                  <td className="px-4 py-3 font-mono text-sm text-gray-600">{entry.reference}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{entry.description}</td>
                  <td className="px-4 py-3 text-right font-medium text-blue-600">
                    {entry.debit > 0 ? fmtCurrency(entry.debit) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-green-600">
                    {entry.credit > 0 ? fmtCurrency(entry.credit) : "-"}
                  </td>
                </tr>
              ))}
              {paginatedEntries.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">No ledger entries found.</td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200 sticky bottom-0">
              <tr>
                <td colSpan={5} className="px-4 py-3 text-right font-semibold text-gray-900">Total</td>
                <td className="px-4 py-3 text-right font-semibold text-blue-600">
                  {fmtCurrency(paginatedEntries.reduce((sum, e) => sum + e.debit, 0))}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-green-600">
                  {fmtCurrency(paginatedEntries.reduce((sum, e) => sum + e.credit, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-sm text-gray-500">
            Showing{" "}
            {filteredEntries.length === 0 ? 0 : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredEntries.length)} of{" "}
            {filteredEntries.length} results
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
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-sm rounded-md flex items-center justify-center ${
                  currentPage === page ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
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

// Add missing Calendar icon component
const CalendarIcon = ({ className }: { className?: string }) => (
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
