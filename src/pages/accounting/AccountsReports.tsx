/**
 * File: src/pages/accounting/Reports.tsx
 * Complete Accounting Reports page with multiple report types and data visualization
 * Based on provided screenshots design
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import {
  FileText,
  Download,
  Calendar,
  Users,
  Building2,
  Percent,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  Printer,
  Filter,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface InvoiceAgingItem {
  customer: string;
  email: string;
  current: number;
  days130: number;
  days3160: number;
  days6190: number;
  daysOver90: number;
  total: number;
}

interface BillAgingItem {
  vendor: string;
  email: string;
  current: number;
  days130: number;
  days3160: number;
  days6190: number;
  daysOver90: number;
  total: number;
}

interface TaxSummary {
  taxType: string;
  rate: number;
  collected: number;
  paid: number;
  netLiability: number;
}

interface CustomerBalanceItem {
  customer: string;
  email: string;
  totalInvoiced: number;
  totalReturnsAndCreditNotes: number;
  totalPaid: number;
  balance: number;
}

interface VendorBalanceItem {
  vendor: string;
  email: string;
  totalBilled: number;
  totalReturnsAndDebitNotes: number;
  totalPaid: number;
  balance: number;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const invoiceAgingData: InvoiceAgingItem[] = [
  {
    customer: "Lisa Anderson",
    email: "lisa.anderson@client.com",
    current: 0,
    days130: 0,
    days3160: 0,
    days6190: 0,
    daysOver90: 2000.0,
    total: 2000.0,
  },
  {
    customer: "Jessica Harris",
    email: "jessica.harris@client.com",
    current: 0,
    days130: 0,
    days3160: 0,
    days6190: 0,
    daysOver90: 1158.0,
    total: 1158.0,
  },
  {
    customer: "Ashley Lewis",
    email: "ashley.lewis@client.com",
    current: 0,
    days130: 0,
    days3160: 0,
    days6190: 0,
    daysOver90: 1391.57,
    total: 1391.57,
  },
  {
    customer: "Maria Rodriguez",
    email: "maria.rodriguez@client.com",
    current: 0,
    days130: 0,
    days3160: 0,
    days6190: 0,
    daysOver90: 3769.97,
    total: 3769.97,
  },
  {
    customer: "Sarah Johnson",
    email: "sarah.johnson@client.com",
    current: 0,
    days130: 0,
    days3160: 0,
    days6190: 0,
    daysOver90: 975.0,
    total: 975.0,
  },
];

const billAgingData: BillAgingItem[] = [
  {
    vendor: "Alex Vendor",
    email: "alex.vendor@supplier.com",
    current: 0,
    days130: 0,
    days3160: 0,
    days6190: 0.01,
    daysOver90: 5369.2,
    total: 5369.2,
  },
  {
    vendor: "Tech Solutions Inc",
    email: "contact@techsolutions.com",
    current: 0,
    days130: 0,
    days3160: 0,
    days6190: 0.01,
    daysOver90: 3090.25,
    total: 3090.25,
  },
  {
    vendor: "Global Supplies Co",
    email: "info@globalsupplies.com",
    current: 0,
    days130: 0,
    days3160: 0,
    days6190: 0.01,
    daysOver90: 859.0,
    total: 859.0,
  },
  {
    vendor: "Elite Vendors Group",
    email: "orders@elitevendors.com",
    current: 0,
    days130: 0,
    days3160: 0,
    days6190: 0.01,
    daysOver90: 1040.0,
    total: 1040.0,
  },
  {
    vendor: "Sam Supplier",
    email: "sam.supplier@vendor.com",
    current: 0,
    days130: 0,
    days3160: 0,
    days6190: 0.01,
    daysOver90: 4110.0,
    total: 4110.0,
  },
  {
    vendor: "Prime Materials Ltd",
    email: "sales@primematerials.com",
    current: 0,
    days130: 0,
    days3160: 0,
    days6190: 0.01,
    daysOver90: 780.0,
    total: 780.0,
  },
];

const taxSummaryData: TaxSummary[] = [
  {
    taxType: "GST",
    rate: 18.0,
    collected: 3739.59,
    paid: 3294.9,
    netLiability: 444.69,
  },
  {
    taxType: "VAT",
    rate: 12.0,
    collected: 1732.26,
    paid: 1597.8,
    netLiability: 134.46,
  },
  {
    taxType: "Service Tax",
    rate: 15.0,
    collected: 421.45,
    paid: 888.75,
    netLiability: -467.3,
  },
];

const customerBalanceData: CustomerBalanceItem[] = [
  {
    customer: "Maria Rodriguez",
    email: "maria.rodriguez@client.com",
    totalInvoiced: 4781.92,
    totalReturnsAndCreditNotes: 410.75,
    totalPaid: 1011.95,
    balance: 3769.97,
  },
  {
    customer: "Lisa Anderson",
    email: "lisa.anderson@client.com",
    totalInvoiced: 5929.99,
    totalReturnsAndCreditNotes: 289.99,
    totalPaid: 3929.99,
    balance: 2000.0,
  },
  {
    customer: "Ashley Lewis",
    email: "ashley.lewis@client.com",
    totalInvoiced: 1391.57,
    totalReturnsAndCreditNotes: 253.68,
    totalPaid: 0,
    balance: 1391.57,
  },
  {
    customer: "Jessica Harris",
    email: "jessica.harris@client.com",
    totalInvoiced: 3658.0,
    totalReturnsAndCreditNotes: 436.6,
    totalPaid: 2500.0,
    balance: 1158.0,
  },
  {
    customer: "Sarah Johnson",
    email: "sarah.johnson@client.com",
    totalInvoiced: 2900.97,
    totalReturnsAndCreditNotes: 354.0,
    totalPaid: 2925.97,
    balance: -25.0,
  },
];

const vendorBalanceData: VendorBalanceItem[] = [
  {
    vendor: "Alex Vendor",
    email: "alex.vendor@supplier.com",
    totalBilled: 6369.2,
    totalReturnsAndDebitNotes: 208.0,
    totalPaid: 1000.0,
    balance: 5369.2,
  },
  {
    vendor: "Sam Supplier",
    email: "sam.supplier@vendor.com",
    totalBilled: 5220.0,
    totalReturnsAndDebitNotes: 435.0,
    totalPaid: 1110.0,
    balance: 4110.0,
  },
  {
    vendor: "Tech Solutions Inc",
    email: "contact@techsolutions.com",
    totalBilled: 6090.25,
    totalReturnsAndDebitNotes: 767.0,
    totalPaid: 3000.0,
    balance: 3090.25,
  },
  {
    vendor: "Elite Vendors Group",
    email: "orders@elitevendors.com",
    totalBilled: 2040.0,
    totalReturnsAndDebitNotes: 1107.0,
    totalPaid: 1000.0,
    balance: 1040.0,
  },
  {
    vendor: "Global Supplies Co",
    email: "info@globalsupplies.com",
    totalBilled: 2587.0,
    totalReturnsAndDebitNotes: 1487.2,
    totalPaid: 1728.0,
    balance: 859.0,
  },
  {
    vendor: "Prime Materials Ltd",
    email: "sales@primematerials.com",
    totalBilled: 1780.0,
    totalReturnsAndDebitNotes: 227.5,
    totalPaid: 1000.0,
    balance: 780.0,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = Math.abs(val)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type ReportType =
  | "invoiceAging"
  | "billAging"
  | "taxSummary"
  | "customerBalance"
  | "vendorBalance";

// ─── Main Component ──────────────────────────────────────────────────────────

export const AccountsReports: React.FC = () => {
  const navigate = useNavigate();
  const [activeReport, setActiveReport] = useState<ReportType>("invoiceAging");
  const [asOfDate, setAsOfDate] = useState("2026-12-31");
  const [fromDate, setFromDate] = useState("2026-01-01");
  const [toDate, setToDate] = useState("2026-12-31");
  const [showZeroBalances, setShowZeroBalances] = useState(false);

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleGenerateReport = () => {
    showToast("Report generated successfully!", "success");
  };

  const handleDownloadPDF = () => {
    showToast("Downloading PDF...", "info");
  };

  const handlePrint = () => {
    window.print();
  };

  const getTotalOutstanding = () => {
    if (activeReport === "invoiceAging") {
      return invoiceAgingData.reduce((sum, item) => sum + item.total, 0);
    }
    if (activeReport === "billAging") {
      return billAgingData.reduce((sum, item) => sum + item.total, 0);
    }
    if (activeReport === "customerBalance") {
      return customerBalanceData.reduce((sum, item) => sum + item.balance, 0);
    }
    if (activeReport === "vendorBalance") {
      return vendorBalanceData.reduce((sum, item) => sum + item.balance, 0);
    }
    return 0;
  };

  const getFilteredCustomerBalance = () => {
    if (showZeroBalances) {
      return customerBalanceData;
    }
    return customerBalanceData.filter((item) => item.balance !== 0);
  };

  const getFilteredVendorBalance = () => {
    if (showZeroBalances) {
      return vendorBalanceData;
    }
    return vendorBalanceData.filter((item) => item.balance !== 0);
  };

  const renderInvoiceAging = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-900">Invoice Aging Report</h3>
        <p className="text-sm text-gray-500">
          As of {formatDisplayDate(asOfDate)}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Customer
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                Current
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                1-30 Days
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                31-60 Days
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                61-90 Days
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                &gt;90 Days
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoiceAgingData.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {item.customer}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {fmtCurrency(item.current)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {fmtCurrency(item.days130)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {fmtCurrency(item.days3160)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {fmtCurrency(item.days6190)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {fmtCurrency(item.daysOver90)}
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {fmtCurrency(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 border-t border-gray-200">
            <tr>
              <td className="px-4 py-3 font-semibold text-gray-900">Total</td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">
                {fmtCurrency(
                  invoiceAgingData.reduce((sum, i) => sum + i.current, 0),
                )}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">
                {fmtCurrency(
                  invoiceAgingData.reduce((sum, i) => sum + i.days130, 0),
                )}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">
                {fmtCurrency(
                  invoiceAgingData.reduce((sum, i) => sum + i.days3160, 0),
                )}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">
                {fmtCurrency(
                  invoiceAgingData.reduce((sum, i) => sum + i.days6190, 0),
                )}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">
                {fmtCurrency(
                  invoiceAgingData.reduce((sum, i) => sum + i.daysOver90, 0),
                )}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">
                {fmtCurrency(
                  invoiceAgingData.reduce((sum, i) => sum + i.total, 0),
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );

  const renderBillAging = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-900">Bill Aging Report</h3>
        <p className="text-sm text-gray-500">
          As of {formatDisplayDate(asOfDate)}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Vendor
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                Current
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                1-30 Days
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                31-60 Days
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                61-90 Days
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                &gt;90 Days
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {billAgingData.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {item.vendor}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {fmtCurrency(item.current)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {fmtCurrency(item.days130)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {fmtCurrency(item.days3160)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {fmtCurrency(item.days6190)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {fmtCurrency(item.daysOver90)}
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {fmtCurrency(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 border-t border-gray-200">
            <tr>
              <td className="px-4 py-3 font-semibold text-gray-900">Total</td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">
                {fmtCurrency(
                  billAgingData.reduce((sum, i) => sum + i.current, 0),
                )}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">
                {fmtCurrency(
                  billAgingData.reduce((sum, i) => sum + i.days130, 0),
                )}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">
                {fmtCurrency(
                  billAgingData.reduce((sum, i) => sum + i.days3160, 0),
                )}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">
                {fmtCurrency(
                  billAgingData.reduce((sum, i) => sum + i.days6190, 0),
                )}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">
                {fmtCurrency(
                  billAgingData.reduce((sum, i) => sum + i.daysOver90, 0),
                )}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-gray-900">
                {fmtCurrency(
                  billAgingData.reduce((sum, i) => sum + i.total, 0),
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );

  const renderTaxSummary = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-900">Tax Summary Report</h3>
        <p className="text-sm text-gray-500">
          {formatDisplayDate(fromDate)} to {formatDisplayDate(toDate)}
        </p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tax Collected (Sales) */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-green-50 border-b border-green-200">
              <h4 className="font-semibold text-green-700">
                Tax Collected (Sales)
              </h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                {taxSummaryData.map((tax, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {tax.taxType} ({tax.rate}%)
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-green-600">
                      {fmtCurrency(tax.collected)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 border-t border-gray-200">
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    Total Tax Collected
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-green-600">
                    {fmtCurrency(
                      taxSummaryData.reduce((sum, t) => sum + t.collected, 0),
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tax Paid (Purchases) */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-red-50 border-b border-red-200">
              <h4 className="font-semibold text-red-700">
                Tax Paid (Purchases)
              </h4>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                {taxSummaryData.map((tax, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {tax.taxType} ({tax.rate}%)
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-red-600">
                      {fmtCurrency(tax.paid)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 border-t border-gray-200">
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    Total Tax Paid
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-red-600">
                    {fmtCurrency(
                      taxSummaryData.reduce((sum, t) => sum + t.paid, 0),
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Net Tax Liability */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">
                Net Tax Liability
              </p>
              <p className="text-2xl font-bold text-blue-700">
                {fmtCurrency(
                  taxSummaryData.reduce((sum, t) => sum + t.collected, 0) -
                    taxSummaryData.reduce((sum, t) => sum + t.paid, 0),
                )}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Percent className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomerBalance = () => {
    const filteredData = getFilteredCustomerBalance();
    const totalOutstanding = filteredData.reduce(
      (sum, item) => sum + item.balance,
      0,
    );

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">
            Customer Balance Summary
          </h3>
          <p className="text-sm text-gray-500">
            As of {formatDisplayDate(asOfDate)}
          </p>
        </div>
        <div className="px-5 py-3 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-600">
              Total Outstanding:
            </span>
            <span className="text-lg font-bold text-blue-700">
              {fmtCurrency(totalOutstanding)}
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Email
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                  Total Invoiced
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                  Returns & Credit Notes
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                  Total Paid
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {item.customer}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.email}</td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    {fmtCurrency(item.totalInvoiced)}
                  </td>
                  <td className="px-4 py-3 text-right text-red-500">
                    {fmtCurrency(item.totalReturnsAndCreditNotes)}
                  </td>
                  <td className="px-4 py-3 text-right text-green-600">
                    {fmtCurrency(item.totalPaid)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-medium ${item.balance < 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {fmtCurrency(Math.abs(item.balance))}
                    {item.balance < 0 && " (Credit)"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-3 font-semibold text-gray-900"
                >
                  Total
                </td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">
                  {fmtCurrency(
                    filteredData.reduce((sum, i) => sum + i.totalInvoiced, 0),
                  )}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-red-500">
                  {fmtCurrency(
                    filteredData.reduce(
                      (sum, i) => sum + i.totalReturnsAndCreditNotes,
                      0,
                    ),
                  )}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-green-600">
                  {fmtCurrency(
                    filteredData.reduce((sum, i) => sum + i.totalPaid, 0),
                  )}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-red-600">
                  {fmtCurrency(totalOutstanding)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  const renderVendorBalance = () => {
    const filteredData = getFilteredVendorBalance();
    const totalOutstanding = filteredData.reduce(
      (sum, item) => sum + item.balance,
      0,
    );

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">
            Vendor Balance Summary
          </h3>
          <p className="text-sm text-gray-500">
            As of {formatDisplayDate(asOfDate)}
          </p>
        </div>
        <div className="px-5 py-3 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-600">
              Total Outstanding:
            </span>
            <span className="text-lg font-bold text-blue-700">
              {fmtCurrency(totalOutstanding)}
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Vendor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Email
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                  Total Billed
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                  Returns & Debit Notes
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                  Total Paid
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {item.vendor}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.email}</td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    {fmtCurrency(item.totalBilled)}
                  </td>
                  <td className="px-4 py-3 text-right text-green-600">
                    {fmtCurrency(item.totalReturnsAndDebitNotes)}
                  </td>
                  <td className="px-4 py-3 text-right text-green-600">
                    {fmtCurrency(item.totalPaid)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-red-600">
                    {fmtCurrency(item.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-3 font-semibold text-gray-900"
                >
                  Total
                </td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">
                  {fmtCurrency(
                    filteredData.reduce((sum, i) => sum + i.totalBilled, 0),
                  )}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-green-600">
                  {fmtCurrency(
                    filteredData.reduce(
                      (sum, i) => sum + i.totalReturnsAndDebitNotes,
                      0,
                    ),
                  )}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-green-600">
                  {fmtCurrency(
                    filteredData.reduce((sum, i) => sum + i.totalPaid, 0),
                  )}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-red-600">
                  {fmtCurrency(totalOutstanding)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  const renderReportContent = () => {
    switch (activeReport) {
      case "invoiceAging":
        return renderInvoiceAging();
      case "billAging":
        return renderBillAging();
      case "taxSummary":
        return renderTaxSummary();
      case "customerBalance":
        return renderCustomerBalance();
      case "vendorBalance":
        return renderVendorBalance();
      default:
        return renderInvoiceAging();
    }
  };

  const renderDateInputs = () => {
    if (activeReport === "taxSummary") {
      return (
        <div className="flex items-center gap-4">
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
      );
    }

    if (
      activeReport === "customerBalance" ||
      activeReport === "vendorBalance"
    ) {
      return (
        <div className="flex items-center gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              As Of Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input
              type="checkbox"
              id="showZeroBalances"
              checked={showZeroBalances}
              onChange={(e) => setShowZeroBalances(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label
              htmlFor="showZeroBalances"
              className="text-sm text-gray-700 cursor-pointer"
            >
              Show Zero Balances
            </label>
          </div>
        </div>
      );
    }

    return (
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          As Of Date
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveReport("invoiceAging")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  activeReport === "invoiceAging"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Invoice Aging
              </button>
              <button
                onClick={() => setActiveReport("billAging")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  activeReport === "billAging"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Building2 className="w-4 h-4 inline mr-2" />
                Bill Aging
              </button>
              <button
                onClick={() => setActiveReport("taxSummary")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  activeReport === "taxSummary"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Percent className="w-4 h-4 inline mr-2" />
                Tax Summary
              </button>
              <button
                onClick={() => setActiveReport("customerBalance")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  activeReport === "customerBalance"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Customer Balance
              </button>
              <button
                onClick={() => setActiveReport("vendorBalance")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  activeReport === "vendorBalance"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Building2 className="w-4 h-4 inline mr-2" />
                Vendor Balance
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex flex-wrap items-end gap-4">
                {renderDateInputs()}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleGenerateReport}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Filter className="w-4 h-4" />
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

          {/* Report Content */}
          {renderReportContent()}
        </div>
      </div>
    </div>
  );
};
