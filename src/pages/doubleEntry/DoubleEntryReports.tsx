/**
 * File: src/pages/doubleEntry/DoubleEntryReports.tsx
 * Complete Double Entry Reports page with multiple report types
 * Includes Journal Entry, General Ledger, Account Statement, Account Balance, Cash Flow, and Expense Report
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
  X,
  Eye,
  Search,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface JournalEntry {
  id: string;
  journalNumber: string;
  date: string;
  reference: string;
  description: string;
  totalDebit: number;
  totalCredit: number;
  status: "Posted" | "Draft" | "Approved";
}

interface AccountTransaction {
  id: string;
  date: string;
  description: string;
  reference: string;
  debit: number;
  credit: number;
  balance: number;
}

interface CashFlowData {
  beginningCash: number;
  netCashFlow: number;
  endingCash: number;
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netIncreaseDecrease: number;
}

interface ExpenseReportItem {
  rank: number;
  accountCode: string;
  expenseCategory: string;
  amount: number;
  percentageOfTotal: number;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleJournalEntries: JournalEntry[] = [
  {
    id: "1",
    journalNumber: "JE-2026-113",
    date: "2026-05-16",
    reference: "pos_sale_cogs",
    description: "COGS for POS Sale #POS00033",
    totalDebit: 650.0,
    totalCredit: 650.0,
    status: "Posted",
  },
  {
    id: "2",
    journalNumber: "JE-2026-112",
    date: "2026-05-16",
    reference: "pos_sale",
    description: "POS Sale #POS00033",
    totalDebit: 1061.99,
    totalCredit: 1061.99,
    status: "Posted",
  },
  {
    id: "3",
    journalNumber: "JE-2026-026",
    date: "2026-04-28",
    reference: "service_invoice",
    description: "Service Invoice #SI-2026-01-016",
    totalDebit: 975.0,
    totalCredit: 975.0,
    status: "Posted",
  },
  {
    id: "4",
    journalNumber: "JE-2026-049",
    date: "2026-04-25",
    reference: "bank_transfer",
    description: "Bank Transfer #BT-2026-01-014",
    totalDebit: 15000.0,
    totalCredit: 15000.0,
    status: "Posted",
  },
  {
    id: "5",
    journalNumber: "JE-2026-025",
    date: "2026-04-22",
    reference: "stock_transfer",
    description:
      "Stock Transfer #15-West Coast Storage Facility to Florida Fulfillment Center",
    totalDebit: 300.0,
    totalCredit: 300.0,
    status: "Posted",
  },
  {
    id: "6",
    journalNumber: "JE-2026-050",
    date: "2026-04-20",
    reference: "bank_transfer",
    description: "Bank Transfer #BT-2026-01-013",
    totalDebit: 50025.0,
    totalCredit: 50025.0,
    status: "Posted",
  },
  {
    id: "7",
    journalNumber: "JE-2026-001",
    date: "2026-04-18",
    reference: "purchase_invoice",
    description: "Purchase Invoice #PI-2026-01-014",
    totalDebit: 2610.0,
    totalCredit: 2610.0,
    status: "Posted",
  },
  {
    id: "8",
    journalNumber: "JE-2026-114",
    date: "2026-04-15",
    reference: "bank_transfer",
    description: "Bank Transfer #BT-2026-01-012",
    totalDebit: 250100.0,
    totalCredit: 250100.0,
    status: "Posted",
  },
  {
    id: "9",
    journalNumber: "JE-2026-024",
    date: "2026-04-15",
    reference: "stock_transfer",
    description:
      "Stock Transfer #14-Mountain Region Warehouse to Midwest Regional Warehouse",
    totalDebit: 800.0,
    totalCredit: 800.0,
    status: "Posted",
  },
  {
    id: "10",
    journalNumber: "JE-2026-002",
    date: "2026-04-12",
    reference: "purchase_invoice",
    description: "Purchase Invoice #PI-2026-01-013",
    totalDebit: 2015.0,
    totalCredit: 2015.0,
    status: "Posted",
  },
];

const sampleAccountTransactions: AccountTransaction[] = [
  {
    id: "1",
    date: "2026-01-10",
    description: "Payment received from Sarah Johnson",
    reference: "customer_payment",
    debit: 800.0,
    credit: 0,
    balance: 800.0,
  },
  {
    id: "2",
    date: "2026-01-11",
    description: "Payment from Business Checking Account",
    reference: "vendor_payment",
    debit: 0,
    credit: 792.0,
    balance: 8.0,
  },
  {
    id: "3",
    date: "2026-01-16",
    description: "Payment from Business Checking Account",
    reference: "vendor_payment",
    debit: 0,
    credit: 652.0,
    balance: -644.0,
  },
  {
    id: "4",
    date: "2026-01-23",
    description: "Revenue received",
    reference: "revenue",
    debit: 1250.0,
    credit: 0,
    balance: 606.0,
  },
  {
    id: "5",
    date: "2026-01-23",
    description: "Revenue received",
    reference: "revenue",
    debit: 5400.0,
    credit: 0,
    balance: 6006.0,
  },
  {
    id: "6",
    date: "2026-01-23",
    description: "Payment made",
    reference: "expense",
    debit: 0,
    credit: 210.0,
    balance: 5796.0,
  },
  {
    id: "7",
    date: "2026-01-25",
    description: "Transfer sent to Savings Account",
    reference: "bank_transfer",
    debit: 0,
    credit: 50015.0,
    balance: -44219.0,
  },
  {
    id: "8",
    date: "2026-02-02",
    description: "Transfer received from Savings Account",
    reference: "bank_transfer",
    debit: 20000.0,
    credit: 0,
    balance: -24219.0,
  },
  {
    id: "9",
    date: "2026-02-18",
    description: "Transfer sent to Credit Line Account",
    reference: "bank_transfer",
    debit: 0,
    credit: 2000.0,
    balance: -26219.0,
  },
  {
    id: "10",
    date: "2026-02-25",
    description: "Transfer received from Equipment Loan Account",
    reference: "bank_transfer",
    debit: 500000.0,
    credit: 0,
    balance: 473781.0,
  },
  {
    id: "11",
    date: "2026-03-05",
    description: "Transfer sent to Savings Account",
    reference: "bank_transfer",
    debit: 0,
    credit: 75015.0,
    balance: 398766.0,
  },
];

const sampleCashFlowData: CashFlowData = {
  beginningCash: 0,
  netCashFlow: 16401.0,
  endingCash: 16401.0,
  operatingCashFlow: 14048.29,
  investingCashFlow: -16983.22,
  financingCashFlow: 19335.93,
  netIncreaseDecrease: 16401.0,
};

const sampleExpenseReport: ExpenseReportItem[] = [
  {
    rank: 1,
    accountCode: "5200",
    expenseCategory: "Salaries Expense",
    amount: 76209.78,
    percentageOfTotal: 84.6,
  },
  {
    rank: 2,
    accountCode: "5100",
    expenseCategory: "Cost of Goods Sold",
    amount: 10678.0,
    percentageOfTotal: 11.9,
  },
  {
    rank: 3,
    accountCode: "5320",
    expenseCategory: "Marketing Expense",
    amount: 1200.0,
    percentageOfTotal: 1.3,
  },
  {
    rank: 4,
    accountCode: "5330",
    expenseCategory: "Travel Expense",
    amount: 750.0,
    percentageOfTotal: 0.8,
  },
  {
    rank: 5,
    accountCode: "5310",
    expenseCategory: "Office Supplies",
    amount: 585.0,
    percentageOfTotal: 0.6,
  },
  {
    rank: 6,
    accountCode: "5510",
    expenseCategory: "Bank Charges",
    amount: 412.0,
    percentageOfTotal: 0.5,
  },
  {
    rank: 7,
    accountCode: "5400",
    expenseCategory: "Utilities Expense",
    amount: 210.0,
    percentageOfTotal: 0.2,
  },
];

const accounts = [
  "1000 - Cash",
  "1005 - Petty Cash",
  "1010 - Bank Account - Main",
  "1020 - Bank Account - Savings",
  "1100 - Accounts Receivable",
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

type ReportType =
  | "journalEntry"
  | "generalLedger"
  | "accountStatement"
  | "accountBalance"
  | "cashFlow"
  | "expenseReport";

// ─── Main Component ──────────────────────────────────────────────────────────

export const DoubleEntryReports: React.FC = () => {
  const navigate = useNavigate();
  const [activeReport, setActiveReport] = useState<ReportType>("journalEntry");
  const [fromDate, setFromDate] = useState("2026-01-01");
  const [toDate, setToDate] = useState("2026-12-31");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedAccount, setSelectedAccount] = useState<string>("1000 - Cash");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      showToast("Report generated successfully!", "success");
    }, 1000);
  };

  const handleClear = () => {
    setFromDate("2026-01-01");
    setToDate("2026-12-31");
    setStatusFilter("All");
    setSelectedAccount("1000 - Cash");
    showToast("Filters cleared", "info");
  };

  const handleDownloadPDF = () => {
    showToast("Downloading PDF...", "info");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Posted":
        return "bg-green-100 text-green-700";
      case "Draft":
        return "bg-yellow-100 text-yellow-700";
      case "Approved":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ─── Report Renderers ───────────────────────────────────────────────────────

  const renderJournalEntry = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Journal #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Reference
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Description
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                Total Debit
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                Total Credit
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sampleJournalEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-sm font-medium text-blue-600">
                  {entry.journalNumber}
                </td>
                <td className="px-4 py-3 text-gray-600">{entry.date}</td>
                <td className="px-4 py-3 font-mono text-sm text-gray-600">
                  {entry.reference}
                </td>
                <td className="px-4 py-3 text-gray-500 max-w-md truncate">
                  {entry.description}
                </td>
                <td className="px-4 py-3 text-right font-medium text-blue-600">
                  {fmtCurrency(entry.totalDebit)}
                </td>
                <td className="px-4 py-3 text-right font-medium text-green-600">
                  {fmtCurrency(entry.totalCredit)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}
                  >
                    {entry.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAccountStatement = () => {
    let runningBalance = 0;
    const transactionsWithBalance = sampleAccountTransactions.map((t) => {
      runningBalance += t.debit - t.credit;
      return { ...t, balance: runningBalance };
    });

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">{selectedAccount}</h3>
          <p className="text-sm text-gray-500">
            Statement Period: {formatDisplayDate(fromDate)} to{" "}
            {formatDisplayDate(toDate)}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Reference
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                  Debit
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                  Credit
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactionsWithBalance.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{t.date}</td>
                  <td className="px-4 py-3 text-gray-700">{t.description}</td>
                  <td className="px-4 py-3 font-mono text-sm text-gray-500">
                    {t.reference}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-blue-600">
                    {t.debit > 0 ? fmtCurrency(t.debit) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-green-600">
                    {t.credit > 0 ? fmtCurrency(t.credit) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    {fmtCurrency(t.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-3 text-right font-semibold text-gray-900"
                >
                  Closing Balance
                </td>
                <td className="px-4 py-3 text-right font-semibold text-blue-600">
                  {fmtCurrency(
                    transactionsWithBalance[transactionsWithBalance.length - 1]
                      ?.balance || 0,
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  const renderCashFlow = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <p className="text-xs text-blue-600 font-medium">Beginning Cash</p>
          <p className="text-2xl font-bold text-blue-700">
            {fmtCurrency(sampleCashFlowData.beginningCash)}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <p className="text-xs text-green-600 font-medium">Net Cash Flow</p>
          <p className="text-2xl font-bold text-green-700">
            {fmtCurrency(sampleCashFlowData.netCashFlow)}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
          <p className="text-xs text-purple-600 font-medium">Ending Cash</p>
          <p className="text-2xl font-bold text-purple-700">
            {fmtCurrency(sampleCashFlowData.endingCash)}
          </p>
        </div>
      </div>

      {/* Cash Flow Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">
              Operating Activities
            </h3>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {fmtCurrency(sampleCashFlowData.operatingCashFlow)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Net cash from operations</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-gray-900">
              Investing Activities
            </h3>
          </div>
          <p className="text-2xl font-bold text-red-600">
            {fmtCurrency(sampleCashFlowData.investingCashFlow)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Net cash from investing</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">
              Financing Activities
            </h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {fmtCurrency(sampleCashFlowData.financingCashFlow)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Net cash from financing</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
        <p className="text-sm text-gray-600">Net Increase/Decrease in Cash</p>
        <p className="text-xl font-bold text-blue-600">
          {fmtCurrency(sampleCashFlowData.netIncreaseDecrease)}
        </p>
      </div>
    </div>
  );

  const renderExpenseReport = () => {
    const totalExpenses = sampleExpenseReport.reduce(
      (sum, item) => sum + item.amount,
      0,
    );

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">
            Expense Report by Category
          </h3>
          <p className="text-sm text-gray-500">
            {formatDisplayDate(fromDate)} to {formatDisplayDate(toDate)}
          </p>
        </div>
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <p className="text-sm font-medium text-blue-600">
            Total Expenses: {fmtCurrency(totalExpenses)}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Account Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Expense Category
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                  Amount
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sampleExpenseReport.map((item) => (
                <tr key={item.rank} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{item.rank}</td>
                  <td className="px-4 py-3 font-mono text-sm font-medium text-gray-900">
                    {item.accountCode}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {item.expenseCategory}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-red-600">
                    {fmtCurrency(item.amount)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    {item.percentageOfTotal}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-3 text-right font-semibold text-gray-900"
                >
                  Total Expenses
                </td>
                <td className="px-4 py-3 text-right font-semibold text-red-600">
                  {fmtCurrency(totalExpenses)}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">
                  100%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  const renderGeneralLedger = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p className="text-gray-500">
        General Ledger report will be displayed here
      </p>
    </div>
  );

  const renderAccountBalance = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p className="text-gray-500">
        Account Balance report will be displayed here
      </p>
    </div>
  );

  const renderReportContent = () => {
    switch (activeReport) {
      case "journalEntry":
        return renderJournalEntry();
      case "generalLedger":
        return renderGeneralLedger();
      case "accountStatement":
        return renderAccountStatement();
      case "accountBalance":
        return renderAccountBalance();
      case "cashFlow":
        return renderCashFlow();
      case "expenseReport":
        return renderExpenseReport();
      default:
        return renderJournalEntry();
    }
  };

  const renderExtraFilters = () => {
    if (activeReport === "journalEntry") {
      return (
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="All">All Status</option>
            <option value="Posted">Posted</option>
            <option value="Draft">Draft</option>
            <option value="Approved">Approved</option>
          </select>
        </div>
      );
    }
    if (
      activeReport === "accountStatement" ||
      activeReport === "accountBalance"
    ) {
      return (
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Account
          </label>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {accounts.map((acc) => (
              <option key={acc} value={acc}>
                {acc}
              </option>
            ))}
          </select>
        </div>
      );
    }
    return null;
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
          <span className="text-gray-900 font-medium">Reports</span>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
          </div>

          {/* Report Type Navigation */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 overflow-x-auto">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveReport("journalEntry")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${activeReport === "journalEntry" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Journal Entry
              </button>
              <button
                onClick={() => setActiveReport("generalLedger")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${activeReport === "generalLedger" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                General Ledger
              </button>
              <button
                onClick={() => setActiveReport("accountStatement")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${activeReport === "accountStatement" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Account Statement
              </button>
              <button
                onClick={() => setActiveReport("accountBalance")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${activeReport === "accountBalance" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Account Balance
              </button>
              <button
                onClick={() => setActiveReport("cashFlow")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${activeReport === "cashFlow" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Cash Flow
              </button>
              <button
                onClick={() => setActiveReport("expenseReport")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${activeReport === "expenseReport" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Expense Report
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-col gap-4">
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
                {renderExtraFilters()}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Generate
                </button>
                <button
                  onClick={handleClear}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Clear
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </div>
          </div>

          {/* Report Content */}
          {renderReportContent()}
        </div>
      </div>
    </div>
  );
};
