/**
 * File: src/pages/doubleEntry/TrialBalance.tsx
 * Complete Trial Balance page with date range selection, generate report, and data table
 * Based on provided screenshots design
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import {
  ChevronLeft,
  Calendar,
  Download,
  Printer,
  RefreshCw,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrialBalanceAccount {
  id: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleTrialBalance: TrialBalanceAccount[] = [
  {
    id: "1",
    accountCode: "1000",
    accountName: "Cash",
    debit: 579790.99,
    credit: 0,
  },
  {
    id: "2",
    accountCode: "1005",
    accountName: "Petty Cash",
    debit: 121847.72,
    credit: 0,
  },
  {
    id: "3",
    accountCode: "1010",
    accountName: "Bank Account - Main",
    debit: 41388.94,
    credit: 0,
  },
  {
    id: "4",
    accountCode: "1020",
    accountName: "Bank Account - Savings",
    debit: 0,
    credit: 726626.65,
  },
  {
    id: "5",
    accountCode: "1100",
    accountName: "Accounts Receivable",
    debit: 7619.27,
    credit: 0,
  },
  {
    id: "6",
    accountCode: "1200",
    accountName: "Inventory",
    debit: 4532.0,
    credit: 0,
  },
  {
    id: "7",
    accountCode: "1500",
    accountName: "Tax Receivable (VAT/GST Input)",
    debit: 4831.95,
    credit: 0,
  },
  {
    id: "8",
    accountCode: "2000",
    accountName: "Accounts Payable",
    debit: 0,
    credit: 13910.45,
  },
  {
    id: "9",
    accountCode: "2210",
    accountName: "VAT Payable (Sales Tax Output)",
    debit: 0,
    credit: 5425.48,
  },
  {
    id: "10",
    accountCode: "4010",
    accountName: "Product Sales",
    debit: 0,
    credit: 450.0,
  },
  {
    id: "11",
    accountCode: "4030",
    accountName: "Consulting Revenue",
    debit: 0,
    credit: 2400.0,
  },
  {
    id: "12",
    accountCode: "4040",
    accountName: "Subscription Revenue",
    debit: 0,
    credit: 42.5,
  },
  {
    id: "13",
    accountCode: "4100",
    accountName: "Sales Revenue",
    debit: 0,
    credit: 44060.57,
  },
  {
    id: "14",
    accountCode: "4110",
    accountName: "Commission Income",
    debit: 0,
    credit: 890.0,
  },
  {
    id: "15",
    accountCode: "4120",
    accountName: "Rental Income",
    debit: 0,
    credit: 2000.0,
  },
  {
    id: "16",
    accountCode: "4130",
    accountName: "Maintenance Income",
    debit: 0,
    credit: 1200.0,
  },
  {
    id: "17",
    accountCode: "4200",
    accountName: "Service Revenue",
    debit: 0,
    credit: 53050.0,
  },
  {
    id: "18",
    accountCode: "5100",
    accountName: "Cost of Goods Sold",
    debit: 10678.0,
    credit: 0,
  },
  {
    id: "19",
    accountCode: "5200",
    accountName: "Salaries Expense",
    debit: 76209.78,
    credit: 0,
  },
  {
    id: "20",
    accountCode: "5310",
    accountName: "Office Supplies",
    debit: 585.0,
    credit: 0,
  },
  {
    id: "21",
    accountCode: "5320",
    accountName: "Marketing Expense",
    debit: 1200.0,
    credit: 0,
  },
  {
    id: "22",
    accountCode: "5330",
    accountName: "Travel Expense",
    debit: 750.0,
    credit: 0,
  },
  {
    id: "23",
    accountCode: "5400",
    accountName: "Utilities Expense",
    debit: 210.0,
    credit: 0,
  },
  {
    id: "24",
    accountCode: "5510",
    accountName: "Bank Charges",
    debit: 412.0,
    credit: 0,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// ─── Main Component ──────────────────────────────────────────────────────────

export const TrialBalance: React.FC = () => {
  const navigate = useNavigate();
  const [trialBalance, setTrialBalance] =
    useState<TrialBalanceAccount[]>(sampleTrialBalance);
  const [fromDate, setFromDate] = useState("2026-01-01");
  const [toDate, setToDate] = useState("2026-12-31");
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate totals
  const totalDebit = trialBalance.reduce(
    (sum, account) => sum + account.debit,
    0,
  );
  const totalCredit = trialBalance.reduce(
    (sum, account) => sum + account.credit,
    0,
  );

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      showToast("Trial balance report generated successfully!", "success");
    }, 1000);
  };

  const handleDownloadPDF = () => {
    showToast("Downloading PDF...", "info");
  };

  const handlePrint = () => {
    window.print();
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-auto">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2 sticky top-0 z-10">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => navigate("/")}
            className="hover:text-gray-700"
          >
            Dashboard
          </button>
          <span>›</span>
          <button
            onClick={() => navigate("/double-entry")}
            className="hover:text-gray-700"
          >
            Double Entry
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Trial Balance</span>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Trial Balance
            </h1>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex flex-wrap items-end gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    From Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    To Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  Trial Balance: {formatDisplayDate(fromDate)} -{" "}
                  {formatDisplayDate(toDate)}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Generate
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-medium">
                    Total Debit
                  </p>
                  <p className="text-2xl font-bold text-blue-700">
                    {fmtCurrency(totalDebit)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg border border-green-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 font-medium">
                    Total Credit
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {fmtCurrency(totalCredit)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Account Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Account Name
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Debit
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Credit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {trialBalance.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-sm font-medium text-gray-900">
                        {account.accountCode}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {account.accountName}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-blue-600">
                        {account.debit > 0 ? fmtCurrency(account.debit) : "-"}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-green-600">
                        {account.credit > 0 ? fmtCurrency(account.credit) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <td
                      colSpan={2}
                      className="px-4 py-3 text-right font-semibold text-gray-900"
                    >
                      TOTAL
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-blue-600">
                      {fmtCurrency(totalDebit)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">
                      {fmtCurrency(totalCredit)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Validation Message */}
          {Math.abs(totalDebit - totalCredit) > 0.01 && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-600">
                <span className="font-semibold">Warning:</span> The trial
                balance is not balanced. Debit total ({fmtCurrency(totalDebit)})
                does not equal Credit total ({fmtCurrency(totalCredit)}).
                Difference: {fmtCurrency(Math.abs(totalDebit - totalCredit))}
              </p>
            </div>
          )}

          {Math.abs(totalDebit - totalCredit) <= 0.01 && totalDebit > 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-600">
                <span className="font-semibold">✓ Balanced:</span> The trial
                balance is balanced. Total Debit equals Total Credit.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
