/**
 * File: src/pages/doubleEntry/ProfitLoss.tsx
 * Complete Profit & Loss Statement page with date range selection, generate report, and data display
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
  FileText,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RevenueItem {
  id: string;
  code: string;
  name: string;
  amount: number;
}

interface ExpenseItem {
  id: string;
  code: string;
  name: string;
  amount: number;
}

interface ProfitLossData {
  fromDate: string;
  toDate: string;
  revenues: RevenueItem[];
  expenses: ExpenseItem[];
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleProfitLoss: ProfitLossData = {
  fromDate: "2026-01-01",
  toDate: "2026-12-31",
  revenues: [
    { id: "1", code: "4100", name: "Sales Revenue", amount: 44060.57 },
    { id: "2", code: "4010", name: "Product Sales", amount: 450.0 },
    { id: "3", code: "4200", name: "Service Revenue", amount: 53050.0 },
    { id: "4", code: "4030", name: "Consulting Revenue", amount: 2400.0 },
    { id: "5", code: "4040", name: "Subscription Revenue", amount: 42.5 },
    { id: "6", code: "4110", name: "Commission Income", amount: 890.0 },
    { id: "7", code: "4120", name: "Rental Income", amount: 2000.0 },
    { id: "8", code: "4130", name: "Maintenance Income", amount: 1200.0 },
  ],
  expenses: [
    { id: "1", code: "5100", name: "Cost of Goods Sold", amount: 10678.0 },
    { id: "2", code: "5200", name: "Salaries Expense", amount: 76209.78 },
    { id: "3", code: "5310", name: "Office Supplies", amount: 585.0 },
    { id: "4", code: "5320", name: "Marketing Expense", amount: 1200.0 },
    { id: "5", code: "5330", name: "Travel Expense", amount: 750.0 },
    { id: "6", code: "5400", name: "Utilities Expense", amount: 210.0 },
    { id: "7", code: "5510", name: "Bank Charges", amount: 412.0 },
  ],
  totalRevenue: 104093.07,
  totalExpenses: 90044.78,
  netProfit: 14048.29,
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

export const ProfitLoss: React.FC = () => {
  const navigate = useNavigate();
  const [profitLoss, setProfitLoss] = useState<ProfitLossData | null>(null);
  const [fromDate, setFromDate] = useState("2026-01-01");
  const [toDate, setToDate] = useState("2026-12-31");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    if (!fromDate) {
      showToast("Please select from date", "info");
      return;
    }
    if (!toDate) {
      showToast("Please select to date", "info");
      return;
    }

    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setProfitLoss({
        ...sampleProfitLoss,
        fromDate: fromDate,
        toDate: toDate,
      });
      setIsGenerating(false);
      showToast("Profit & Loss statement generated successfully!", "success");
    }, 1000);
  };

  const handleDownloadPDF = () => {
    showToast("Downloading PDF...", "info");
  };

  const handlePrint = () => {
    window.print();
  };

  const getNetProfitColor = (netProfit: number) => {
    if (netProfit > 0) return "text-green-600";
    if (netProfit < 0) return "text-red-600";
    return "text-gray-600";
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
          <span className="text-gray-900 font-medium">Profit & Loss</span>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Profit & Loss Statement
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

          {!profitLoss ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="flex flex-col items-center justify-center">
                <FileText className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Statement Generated
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Click the "Generate" button above to create a new profit &
                  loss statement.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-blue-600 font-medium">
                        Total Revenue
                      </p>
                      <p className="text-2xl font-bold text-blue-700">
                        {fmtCurrency(profitLoss.totalRevenue)}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg border border-orange-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-orange-600 font-medium">
                        Total Expenses
                      </p>
                      <p className="text-2xl font-bold text-orange-700">
                        {fmtCurrency(profitLoss.totalExpenses)}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <TrendingDown className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>
                <div
                  className={`rounded-lg border p-4 ${profitLoss.netProfit >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-xs font-medium ${profitLoss.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        Net Profit
                      </p>
                      <p
                        className={`text-2xl font-bold ${getNetProfitColor(profitLoss.netProfit)}`}
                      >
                        {fmtCurrency(Math.abs(profitLoss.netProfit))}
                        {profitLoss.netProfit < 0 && " (Loss)"}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${profitLoss.netProfit >= 0 ? "bg-green-100" : "bg-red-100"}`}
                    >
                      <DollarSign
                        className={`w-6 h-6 ${profitLoss.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Profit & Loss Statement */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Profit & Loss Statement
                  </h2>
                  <p className="text-sm text-gray-500">
                    {formatDisplayDate(profitLoss.fromDate)} -{" "}
                    {formatDisplayDate(profitLoss.toDate)}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                  {/* Revenue Section */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                      Revenue
                    </h3>
                    <div className="space-y-2">
                      {profitLoss.revenues.map((revenue) => (
                        <div
                          key={revenue.id}
                          className="flex justify-between text-sm py-1"
                        >
                          <span className="text-gray-700">
                            {revenue.code} - {revenue.name}
                          </span>
                          <span className="font-medium text-blue-600">
                            {fmtCurrency(revenue.amount)}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between text-base pt-3 mt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">
                          Total Revenue
                        </span>
                        <span className="font-semibold text-blue-600">
                          {fmtCurrency(profitLoss.totalRevenue)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expenses Section */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                      Expenses
                    </h3>
                    <div className="space-y-2">
                      {profitLoss.expenses.map((expense) => (
                        <div
                          key={expense.id}
                          className="flex justify-between text-sm py-1"
                        >
                          <span className="text-gray-700">
                            {expense.code} - {expense.name}
                          </span>
                          <span className="font-medium text-orange-600">
                            {fmtCurrency(expense.amount)}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between text-base pt-3 mt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">
                          Total Expenses
                        </span>
                        <span className="font-semibold text-orange-600">
                          {fmtCurrency(profitLoss.totalExpenses)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Net Profit Section */}
                <div
                  className={`mx-6 mb-6 p-4 rounded-lg border ${profitLoss.netProfit >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">
                      Net Profit
                    </span>
                    <span
                      className={`text-xl font-bold ${getNetProfitColor(profitLoss.netProfit)}`}
                    >
                      {fmtCurrency(Math.abs(profitLoss.netProfit))}
                      {profitLoss.netProfit < 0 && " (Loss)"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2 pt-2 border-t border-gray-200">
                    <span className="text-gray-500">Revenue - Expenses</span>
                    <span className="text-gray-600">
                      {fmtCurrency(profitLoss.totalRevenue)} -{" "}
                      {fmtCurrency(profitLoss.totalExpenses)} ={" "}
                      {fmtCurrency(Math.abs(profitLoss.netProfit))}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
