/**
 * File: src/pages/accounting/BankTransactions.tsx
 * Complete Bank Transactions Management page with list view, filters, search, pagination
 * Based on provided screenshots design
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  Eye,
  Download,
  Printer,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2,
  Calendar,
  FileText,
  DollarSign,
} from "lucide-react";
import { showToast } from "@/utils/toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BankTransaction {
  id: string;
  date: string;
  bankAccount: string;
  accountNumber: string;
  reference: string;
  type: "Credit" | "Debit";
  amount: number;
  balance: number;
  description: string;
  status: "Cleared" | "Pending" | "Reconciled";
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleTransactions: BankTransaction[] = [
  {
    id: "1",
    date: "2026-05-16",
    bankAccount: "Business Checking Account",
    accountNumber: "1234567890",
    reference: "#POS00033",
    type: "Credit",
    amount: 1061.99,
    balance: 1079790.99,
    description: "POS Sale #POS00033",
    status: "Cleared",
  },
  {
    id: "2",
    date: "2026-04-27",
    bankAccount: "Equipment Loan Account",
    accountNumber: "1111222233",
    reference: "REV-2026-01-018",
    type: "Credit",
    amount: 20000.0,
    balance: 3023473.35,
    description:
      "Revenue Posted: Major Infrastructure Contract (Deficit Clearance).",
    status: "Cleared",
  },
  {
    id: "3",
    date: "2026-04-21",
    bankAccount: "Credit Line Account",
    accountNumber: "5555666677",
    reference: "REV-2026-01-017",
    type: "Credit",
    amount: 50000.0,
    balance: 2541388.94,
    description: "Revenue Posted: Strategic Partnership Funding.",
    status: "Cleared",
  },
  {
    id: "4",
    date: "2026-02-11",
    bankAccount: "Savings Account",
    accountNumber: "9876543210",
    reference: "EXP-2026-01-005",
    type: "Debit",
    amount: 300.0,
    balance: 1371847.72,
    description: "Expense Posted: Flight tickets for regional branch audit.",
    status: "Cleared",
  },
  {
    id: "5",
    date: "2026-03-02",
    bankAccount: "Savings Account",
    accountNumber: "9876543210",
    reference: "EXP-2026-01-008",
    type: "Debit",
    amount: 85.0,
    balance: 1372147.72,
    description:
      "Expense Posted: Printer maintenance and cartridge replacement.",
    status: "Cleared",
  },
  {
    id: "6",
    date: "2026-03-21",
    bankAccount: "Equipment Loan Account",
    accountNumber: "1111222233",
    reference: "EXP-2026-01-010",
    type: "Debit",
    amount: 450.0,
    balance: 3003473.35,
    description:
      "Expense Posted: Vehicle maintenance and fuel for logistics fleet.",
    status: "Cleared",
  },
  {
    id: "7",
    date: "2026-03-31",
    bankAccount: "Business Checking Account",
    accountNumber: "1234567890",
    reference: "EXP-2026-01-011",
    type: "Debit",
    amount: 210.0,
    balance: 1078729.0,
    description:
      "Expense Posted: Electricity bill for December (Backdated entry).",
    status: "Cleared",
  },
  {
    id: "8",
    date: "2026-04-15",
    bankAccount: "Equipment Loan Account",
    accountNumber: "1111222233",
    reference: "EXP-2026-01-013",
    type: "Debit",
    amount: 500.0,
    balance: 3003923.35,
    description: "Expense Posted: Annual paper and filing system bulk order.",
    status: "Cleared",
  },
  {
    id: "9",
    date: "2026-01-31",
    bankAccount: "Credit Line Account",
    accountNumber: "5555666677",
    reference: "EXP-2026-01-003",
    type: "Debit",
    amount: 1200.0,
    balance: 2491388.94,
    description: "Expense Posted: Social media advertising campaign.",
    status: "Cleared",
  },
  {
    id: "10",
    date: "2026-02-23",
    bankAccount: "Credit Line Account",
    accountNumber: "5555666677",
    reference: "REV-2026-01-009",
    type: "Credit",
    amount: 920.0,
    balance: 2492588.94,
    description: "Revenue Posted: Black Friday promotional sales (Batch A).",
    status: "Cleared",
  },
  {
    id: "11",
    date: "2026-01-15",
    bankAccount: "Business Checking Account",
    accountNumber: "1234567890",
    reference: "TFR-001",
    type: "Debit",
    amount: 5000.0,
    balance: 1079790.99,
    description: "Transfer to Savings Account",
    status: "Cleared",
  },
  {
    id: "12",
    date: "2026-01-10",
    bankAccount: "Petty Cash Account",
    accountNumber: "7777888899",
    reference: "EXP-2026-01-001",
    type: "Debit",
    amount: 150.0,
    balance: 85000.0,
    description: "Office supplies purchase",
    status: "Pending",
  },
];

const bankAccounts = [
  "Business Checking Account (1234567890)",
  "Savings Account (9876543210)",
  "Credit Line Account (5555666677)",
  "Equipment Loan Account (1111222233)",
  "Petty Cash Account (7777888899)",
];

const transactionTypes = ["All", "Credit", "Debit"];
const statuses = ["All", "Cleared", "Pending", "Reconciled"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField =
  | "date"
  | "bankAccount"
  | "reference"
  | "type"
  | "amount"
  | "balance"
  | "status";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const BankTransactions: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] =
    useState<BankTransaction[]>(sampleTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedBankAccount, setSelectedBankAccount] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // ─── Filtered & Sorted ─────────────────────────────────────────────────────

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.reference.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.bankAccount.toLowerCase().includes(q) ||
          t.accountNumber.includes(q),
      );
    }

    // Bank account filter
    if (selectedBankAccount !== "All") {
      result = result.filter(
        (t) => `${t.bankAccount} (${t.accountNumber})` === selectedBankAccount,
      );
    }

    // Transaction type filter
    if (selectedType !== "All") {
      result = result.filter((t) => t.type === selectedType);
    }

    // Status filter
    if (selectedStatus !== "All") {
      result = result.filter((t) => t.status === selectedStatus);
    }

    // Date range filter
    if (dateFrom) {
      result = result.filter((t) => t.date >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((t) => t.date <= dateTo);
    }

    // Sorting
    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];
      if (sortField === "amount" || sortField === "balance") {
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
    transactions,
    searchQuery,
    selectedBankAccount,
    selectedType,
    selectedStatus,
    dateFrom,
    dateTo,
    sortField,
    sortDir,
  ]);

  const totalPages = Math.ceil(filteredTransactions.length / perPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Helper Functions ───────────────────────────────────────────────────────

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedBankAccount("All");
    setSelectedType("All");
    setSelectedStatus("All");
    setDateFrom("");
    setDateTo("");
    setSearchQuery("");
    setCurrentPage(1);
    showToast("Filters reset", "info");
  };

  const getTypeIcon = (type: string) => {
    if (type === "Credit") {
      return <TrendingUp className="w-3.5 h-3.5 text-green-600" />;
    }
    return <TrendingDown className="w-3.5 h-3.5 text-red-600" />;
  };

  const getTypeColor = (type: string) => {
    return type === "Credit" ? "text-green-600" : "text-red-600";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Cleared":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Reconciled":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Cleared":
        return <CheckCircle className="w-3 h-3" />;
      case "Pending":
        return <Clock className="w-3 h-3" />;
      case "Reconciled":
        return <AlertCircle className="w-3 h-3" />;
      default:
        return null;
    }
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
            onClick={() => navigate("/accounting")}
            className="hover:text-gray-700"
          >
            Accounting
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Bank Transactions</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Bank Transactions
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => showToast("Exporting transactions...", "info")}
              className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 text-sm"
            >
              <Printer className="w-4 h-4" />
              Print
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
                  placeholder="Search transactions..."
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
                <option value={100}>100 per page</option>
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
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Bank Account
                  </label>
                  <select
                    value={selectedBankAccount}
                    onChange={(e) => {
                      setSelectedBankAccount(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All Accounts</option>
                    {bankAccounts.map((account) => (
                      <option key={account} value={account}>
                        {account}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Transaction Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => {
                      setSelectedType(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {transactionTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Date From
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => {
                      setDateFrom(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Date To
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => {
                      setDateTo(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={resetFilters}
                  className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1100px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="date" label="Date" />
                <SortHeader field="bankAccount" label="Bank Account" />
                <SortHeader field="reference" label="Reference" />
                <SortHeader field="type" label="Type" />
                <SortHeader field="amount" label="Amount" />
                <SortHeader field="balance" label="Balance" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Description
                </th>
                <SortHeader field="status" label="Status" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {transaction.date}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-900">
                        {transaction.bankAccount}
                      </span>
                      <span className="text-gray-400 text-xs">
                        ({transaction.accountNumber})
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-gray-600">
                      {transaction.reference}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {getTypeIcon(transaction.type)}
                      <span
                        className={`text-sm font-medium ${getTypeColor(transaction.type)}`}
                      >
                        {transaction.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-medium ${getTypeColor(transaction.type)}`}
                    >
                      {transaction.type === "Credit" ? "+" : "-"}
                      {fmtCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {fmtCurrency(transaction.balance)}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-500 max-w-xs truncate"
                    title={transaction.description}
                  >
                    {transaction.description.length > 50
                      ? transaction.description.substring(0, 50) + "..."
                      : transaction.description}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                    >
                      {getStatusIcon(transaction.status)}
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        showToast(
                          `Viewing transaction ${transaction.reference}`,
                          "info",
                        )
                      }
                      className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedTransactions.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No transactions found.
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
            {filteredTransactions.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredTransactions.length)} of{" "}
            {filteredTransactions.length} results
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

      {/* Summary Stats */}
      <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-500">
              Credit:{" "}
              {fmtCurrency(
                filteredTransactions
                  .filter((t) => t.type === "Credit")
                  .reduce((sum, t) => sum + t.amount, 0),
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-500">
              Debit:{" "}
              {fmtCurrency(
                filteredTransactions
                  .filter((t) => t.type === "Debit")
                  .reduce((sum, t) => sum + t.amount, 0),
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-500">
              Net:{" "}
              {fmtCurrency(
                filteredTransactions
                  .filter((t) => t.type === "Credit")
                  .reduce((sum, t) => sum + t.amount, 0) -
                  filteredTransactions
                    .filter((t) => t.type === "Debit")
                    .reduce((sum, t) => sum + t.amount, 0),
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
