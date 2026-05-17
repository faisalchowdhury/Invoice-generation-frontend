/**
 * File: src/pages/doubleEntry/BalanceSheet.tsx
 * Complete Balance Sheet page with generate modal, data display, and export functionality
 * Based on provided screenshots design
 */

import React, { useState } from "react";
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
  X,
  Eye,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BalanceSheetItem {
  id: string;
  name: string;
  code: string;
  amount: number;
  level: number;
  parent?: string;
}

interface BalanceSheetSection {
  title: string;
  items: BalanceSheetItem[];
  total: number;
}

interface BalanceSheetData {
  asOfDate: string;
  financialYear: string;
  status: "Draft" | "Balanced" | "Finalized";
  assets: BalanceSheetSection[];
  liabilities: BalanceSheetSection[];
  equity: BalanceSheetSection[];
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleBalanceSheet: BalanceSheetData = {
  asOfDate: "2026-12-31",
  financialYear: "2026",
  status: "Draft",
  assets: [
    {
      title: "Current Assets",
      items: [
        { id: "1", name: "Cash", code: "1000", amount: 328729.05, level: 1 },
        {
          id: "2",
          name: "Petty Cash",
          code: "1005",
          amount: 121847.725,
          level: 1,
        },
        {
          id: "3",
          name: "Bank Account - Main",
          code: "1010",
          amount: 41388.945,
          level: 1,
        },
        {
          id: "4",
          name: "Bank Account - Savings",
          code: "1020",
          amount: 476526.655,
          level: 1,
        },
        {
          id: "5",
          name: "Accounts Receivable",
          code: "1100",
          amount: 7909.265,
          level: 1,
        },
        {
          id: "6",
          name: "Inventory",
          code: "1200",
          amount: 28410.275,
          level: 1,
        },
      ],
      total: 1041811.915,
    },
    {
      title: "Other Assets",
      items: [
        {
          id: "7",
          name: "Tax Receivable (VAT/GST Input)",
          code: "1500",
          amount: 4831.955,
          level: 1,
        },
      ],
      total: 4831.955,
    },
  ],
  liabilities: [
    {
      title: "Current Liabilities",
      items: [
        {
          id: "8",
          name: "Accounts Payable",
          code: "2000",
          amount: 13910.455,
          level: 1,
        },
        {
          id: "9",
          name: "VAT Payable (Sales Tax Output)",
          code: "2210",
          amount: 5353.485,
          level: 1,
        },
      ],
      total: 19263.94,
    },
  ],
  equity: [
    {
      title: "Equity",
      items: [
        {
          id: "10",
          name: "Retained Earnings",
          code: "3000",
          amount: 13978.295,
          level: 1,
        },
      ],
      total: 13978.295,
    },
  ],
  totalAssets: 1046643.87,
  totalLiabilities: 19263.94,
  totalEquity: 13978.295,
};

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

export const BalanceSheet: React.FC = () => {
  const navigate = useNavigate();
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheetData | null>(
    null,
  );
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    balanceSheetDate: new Date().toISOString().split("T")[0],
    financialYear: new Date().getFullYear().toString(),
  });

  const handleGenerateClick = () => {
    setShowGenerateModal(true);
  };

  const handleGenerateReport = () => {
    if (!formData.balanceSheetDate) {
      showToast("Please select balance sheet date", "info");
      return;
    }
    if (!formData.financialYear) {
      showToast("Please enter financial year", "info");
      return;
    }

    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setBalanceSheet({
        ...sampleBalanceSheet,
        asOfDate: formData.balanceSheetDate,
        financialYear: formData.financialYear,
      });
      setIsGenerating(false);
      setShowGenerateModal(false);
      showToast("Balance sheet generated successfully!", "success");
    }, 1000);
  };

  const handleDownloadPDF = () => {
    showToast("Downloading PDF...", "info");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFinalize = () => {
    if (balanceSheet && balanceSheet.status === "Draft") {
      setBalanceSheet({ ...balanceSheet, status: "Finalized" });
      showToast("Balance sheet finalized successfully!", "success");
    }
  };

  const handleAddNote = () => {
    showToast("Add note functionality coming soon", "info");
  };

  const handleCompare = () => {
    showToast("Compare functionality coming soon", "info");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Balanced":
        return "bg-green-100 text-green-700";
      case "Finalized":
        return "bg-blue-100 text-blue-700";
      case "Draft":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // GENERATE MODAL
  // ═══════════════════════════════════════════════════════════════════════════

  const GenerateModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Generate Balance Sheet
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Select date and financial year
            </p>
          </div>
          <button
            onClick={() => setShowGenerateModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Balance Sheet Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.balanceSheetDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      balanceSheetDate: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Select the date for which you want to generate the balance
                sheet.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Financial Year <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.financialYear}
                onChange={(e) =>
                  setFormData({ ...formData, financialYear: e.target.value })
                }
                placeholder="e.g., 2024"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                Enter the financial year (e.g., 2024)
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mt-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">
                How it works
              </h4>
              <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                <li>
                  System will calculate balances for all accounts up to the
                  selected date
                </li>
                <li>
                  Accounts will be automatically categorized into Assets,
                  Liabilities, and Equity
                </li>
                <li>
                  Balance sheet will be validated to ensure Assets = Liabilities
                  + Equity
                </li>
                <li>
                  You can review and finalize the balance sheet after generation
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => setShowGenerateModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // BALANCE SHEET VIEW
  // ═══════════════════════════════════════════════════════════════════════════

  const renderBalanceSheet = () => {
    if (!balanceSheet) {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Balance Sheet Generated
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Click the "Generate" button above to create a new balance sheet.
            </p>
            <button
              onClick={handleGenerateClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Generate Balance Sheet
            </button>
          </div>
        </div>
      );
    }

    const isBalanced =
      Math.abs(
        balanceSheet.totalAssets -
          (balanceSheet.totalLiabilities + balanceSheet.totalEquity),
      ) < 0.01;

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Balance Sheet
              </h2>
              <p className="text-sm text-gray-500">
                As of {formatDisplayDate(balanceSheet.asOfDate)} | Financial
                Year {balanceSheet.financialYear}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(balanceSheet.status)}`}
              >
                {balanceSheet.status === "Balanced" ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                {balanceSheet.status}
              </span>
              <button
                onClick={handleAddNote}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
              >
                Add Note
              </button>
              <button
                onClick={handleCompare}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
              >
                Compare
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
              >
                <Download className="w-4 h-4 inline mr-1" />
                Download PDF
              </button>
              {balanceSheet.status === "Draft" && (
                <button
                  onClick={handleFinalize}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Finalize
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 border-b border-gray-200">
          <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
            <p className="text-xs text-blue-600 font-medium">Total Assets</p>
            <p className="text-2xl font-bold text-blue-700">
              {fmtCurrency(balanceSheet.totalAssets)}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
            <p className="text-xs text-red-600 font-medium">
              Total Liabilities
            </p>
            <p className="text-2xl font-bold text-red-700">
              {fmtCurrency(balanceSheet.totalLiabilities)}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
            <p className="text-xs text-green-600 font-medium">Total Equity</p>
            <p className="text-2xl font-bold text-green-700">
              {fmtCurrency(balanceSheet.totalEquity)}
            </p>
          </div>
        </div>

        {/* Balance Sheet Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Assets Section */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
              Assets
            </h3>
            {balanceSheet.assets.map((section, idx) => (
              <div key={idx} className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">
                  {section.title}
                </h4>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm py-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-12">{item.code}</span>
                        <span className="text-gray-700">{item.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {fmtCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm pt-2 mt-1 border-t border-gray-100">
                    <span className="font-semibold text-gray-900">
                      Total {section.title}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {fmtCurrency(section.total)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-between text-base pt-3 mt-2 border-t border-gray-300">
              <span className="font-bold text-gray-900">Total for Assets</span>
              <span className="font-bold text-blue-600">
                {fmtCurrency(balanceSheet.totalAssets)}
              </span>
            </div>
          </div>

          {/* Liabilities & Equity Section */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
              Liabilities & Equity
            </h3>

            {/* Liabilities */}
            {balanceSheet.liabilities.map((section, idx) => (
              <div key={idx} className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">
                  {section.title}
                </h4>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm py-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-12">{item.code}</span>
                        <span className="text-gray-700">{item.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {fmtCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm pt-2 mt-1 border-t border-gray-100">
                    <span className="font-semibold text-gray-900">
                      Total {section.title}
                    </span>
                    <span className="font-semibold text-red-600">
                      {fmtCurrency(section.total)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Equity */}
            {balanceSheet.equity.map((section, idx) => (
              <div key={idx} className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">
                  {section.title}
                </h4>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm py-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-12">{item.code}</span>
                        <span className="text-gray-700">{item.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {fmtCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm pt-2 mt-1 border-t border-gray-100">
                    <span className="font-semibold text-gray-900">
                      Total for {section.title}
                    </span>
                    <span className="font-semibold text-green-600">
                      {fmtCurrency(section.total)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between text-base pt-3 mt-2 border-t border-gray-300">
              <span className="font-bold text-gray-900">
                Total for Liabilities & Equity
              </span>
              <span className="font-bold text-purple-600">
                {fmtCurrency(
                  balanceSheet.totalLiabilities + balanceSheet.totalEquity,
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Validation Message */}
        {isBalanced ? (
          <div className="mx-6 mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-600">
              <span className="font-semibold">✓ Balanced:</span> Assets =
              Liabilities + Equity
            </p>
          </div>
        ) : (
          <div className="mx-6 mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-600">
              <span className="font-semibold">⚠ Unbalanced:</span> Assets (
              {fmtCurrency(balanceSheet.totalAssets)}) does not equal
              Liabilities + Equity (
              {fmtCurrency(
                balanceSheet.totalLiabilities + balanceSheet.totalEquity,
              )}
              )
            </p>
          </div>
        )}
      </div>
    );
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
            onClick={() => navigate("/dashboard")}
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
          <button
            onClick={() => navigate("/double-entry/balance-sheets")}
            className="hover:text-gray-700"
          >
            Balance Sheets
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">
            Balance Sheet{" "}
            {balanceSheet
              ? `- ${formatDisplayDate(balanceSheet.asOfDate)}`
              : ""}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Balance Sheet{" "}
                {balanceSheet
                  ? `- ${formatDisplayDate(balanceSheet.asOfDate)}`
                  : ""}
              </h1>
            </div>
            {!balanceSheet && (
              <button
                onClick={handleGenerateClick}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4" />
                Generate Balance Sheet
              </button>
            )}
          </div>

          {/* Balance Sheet Content */}
          {renderBalanceSheet()}
        </div>
      </div>

      {/* Generate Modal */}
      {showGenerateModal && <GenerateModal />}
    </div>
  );
};
