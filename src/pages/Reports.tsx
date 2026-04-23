/**
 * File: src/pages/Reports.tsx
 * Reports page - Complete with all clickable menus and actions
 * Based on Figma screenshots
 */

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Download,
  Printer,
  Mail,
  MessageCircle,
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
}

const menuItems: MenuItem[] = [
  {
    id: "business-overview",
    label: "Business Overview",
    children: [
      { id: "summary-report", label: "Summary Report" },
      { id: "quarters-report", label: "Quarters Report" },
      { id: "profit-by-product", label: "Profit By Product Report" },
      { id: "profit-loss", label: "Profit & Loss" },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    children: [
      { id: "sales-summary", label: "Sales Summary" },
      { id: "sales-by-customer", label: "Sales by Customer" },
      { id: "sales-by-item", label: "Sales by Item" },
    ],
  },
  {
    id: "purchase-expense",
    label: "Purchase & Expense",
    children: [
      { id: "purchase-summary", label: "Purchase Summary" },
      { id: "expense-summary", label: "Expense Summary" },
      { id: "vendor-balance", label: "Vendor Balance" },
    ],
  },
  {
    id: "items",
    label: "Items",
    children: [
      { id: "inventory-summary", label: "Inventory Summary" },
      { id: "stock-summary", label: "Stock Summary" },
      { id: "product-sales", label: "Product Sales" },
    ],
  },
  {
    id: "project-timesheet",
    label: "Project & Timesheet",
    children: [
      { id: "project-report", label: "Project Report" },
      { id: "timesheet-report", label: "Timesheet Report" },
      { id: "project-profitability", label: "Project Profitability" },
    ],
  },
  {
    id: "taxes",
    label: "Taxes",
    children: [
      { id: "tax-summary", label: "Tax Summary" },
      { id: "tax-liability", label: "Tax Liability" },
      { id: "gst-report", label: "GST Report" },
    ],
  },
];

interface ReportData {
  title: string;
  sections: {
    heading: string;
    items: { label: string; amount: string; isSubItem?: boolean }[];
  }[];
}

const reportData: Record<string, ReportData> = {
  "profit-loss": {
    title: "Profit & Loss",
    sections: [
      {
        heading: "Income",
        items: [
          { label: "Sales", amount: "$57,600" },
          { label: "Returns", amount: "$57,600" },
        ],
      },
      {
        heading: "Net Income",
        items: [{ label: "Net Income", amount: "$343443" }],
      },
      {
        heading: "Less Cost of Sales",
        items: [{ label: "Purchase", amount: "$343443", isSubItem: true }],
      },
      {
        heading: "Total Cost of Sales",
        items: [{ label: "Total Cost of Sales", amount: "$343443" }],
      },
      {
        heading: "Gross Profit",
        items: [{ label: "Gross Profit", amount: "$343443" }],
      },
      {
        heading: "Less Operating Space",
        items: [{ label: "Less Operating Space", amount: "$343443" }],
      },
      {
        heading: "Total Operating Space",
        items: [{ label: "Total Operating Space", amount: "$343443" }],
      },
      {
        heading: "Net Profit",
        items: [{ label: "Net Profit", amount: "$343443" }],
      },
    ],
  },
  "summary-report": {
    title: "Summary Report",
    sections: [
      {
        heading: "Revenue",
        items: [
          { label: "Total Sales", amount: "$125,000" },
          { label: "Total Returns", amount: "$5,000" },
        ],
      },
      {
        heading: "Expenses",
        items: [
          { label: "Operating Costs", amount: "$45,000" },
          { label: "Overhead", amount: "$15,000" },
        ],
      },
    ],
  },
  "sales-summary": {
    title: "Sales Summary",
    sections: [
      {
        heading: "Total Sales",
        items: [
          { label: "Product Sales", amount: "$95,000" },
          { label: "Service Sales", amount: "$30,000" },
        ],
      },
    ],
  },
};

export const Reports: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "business-overview",
  ]);
  const [selectedReport, setSelectedReport] = useState("profit-loss");
  const [selectedFilter, setSelectedFilter] = useState({
    dataRange: "All Data",
    reportType: "PDF",
    contacts: "All",
  });

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleReportClick = (reportId: string) => {
    setSelectedReport(reportId);
  };

  const handleAction = (action: string) => {
    console.log(`Action: ${action}`);
    // Implement actual actions here
    switch (action) {
      case "view":
        alert("View report");
        break;
      case "download":
        alert("Download report");
        break;
      case "print":
        alert("Print report");
        break;
      case "email":
        alert("Email report");
        break;
      case "whatsapp":
        alert("Share via WhatsApp");
        break;
    }
  };

  const currentReport = reportData[selectedReport] || reportData["profit-loss"];

  return (
    <div className="flex-1 flex flex-col bg-[#FAFBFC] overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <button className="text-sm font-medium text-gray-900 border-b-2 border-blue-600 pb-2">
            Summary
          </button>
          <div className="flex items-center gap-3">
            <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">
              <option>This Year</option>
              <option>This Quarter</option>
              <option>This Month</option>
            </select>
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h18M3 10h18M3 16h18"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* LEFT SIDEBAR - Report Categories */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Reports
            </h2>

            <div className="space-y-1">
              {menuItems.map((item) => (
                <div key={item.id}>
                  {/* Parent Menu Item */}
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <span>{item.label}</span>
                    {expandedItems.includes(item.id) ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>

                  {/* Child Menu Items */}
                  {expandedItems.includes(item.id) && item.children && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleReportClick(child.id)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                            selectedReport === child.id
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Report Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-6">
            {/* Report Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentReport.title}
                </h1>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAction("view")}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    title="View"
                  >
                    <Eye className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleAction("download")}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleAction("print")}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    title="Print"
                  >
                    <Printer className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleAction("email")}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    title="Email"
                  >
                    <Mail className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleAction("whatsapp")}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <select
                  value={selectedFilter.dataRange}
                  onChange={(e) =>
                    setSelectedFilter({
                      ...selectedFilter,
                      dataRange: e.target.value,
                    })
                  }
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option>All Data</option>
                  <option>Last Month</option>
                  <option>Last Quarter</option>
                  <option>Last Year</option>
                </select>

                <select
                  value={selectedFilter.reportType}
                  onChange={(e) =>
                    setSelectedFilter({
                      ...selectedFilter,
                      reportType: e.target.value,
                    })
                  }
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option>Report Type: PDF</option>
                  <option>Report Type: Excel</option>
                  <option>Report Type: CSV</option>
                </select>

                <select
                  value={selectedFilter.contacts}
                  onChange={(e) =>
                    setSelectedFilter({
                      ...selectedFilter,
                      contacts: e.target.value,
                    })
                  }
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option>Contacts: All</option>
                  <option>Contacts: Active</option>
                  <option>Contacts: Inactive</option>
                </select>
              </div>
            </div>

            {/* Report Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  {currentReport.sections.map((section, sectionIndex) => (
                    <React.Fragment key={sectionIndex}>
                      {/* Section Heading */}
                      <tr className="bg-gray-50">
                        <td className="px-6 py-3 text-sm font-semibold text-gray-900">
                          {section.heading}
                        </td>
                        <td className="px-6 py-3 text-sm font-semibold text-gray-900 text-right">
                          Amount
                        </td>
                      </tr>

                      {/* Section Items */}
                      {section.items.map((item, itemIndex) => (
                        <tr
                          key={itemIndex}
                          className={`border-t border-gray-100 ${
                            section.heading === "Net Profit"
                              ? "bg-green-50"
                              : ""
                          }`}
                        >
                          <td
                            className={`px-6 py-3 text-sm ${
                              item.isSubItem
                                ? "pl-12 text-gray-600"
                                : "text-gray-700"
                            }`}
                          >
                            {item.label}
                          </td>
                          <td
                            className={`px-6 py-3 text-sm text-right ${
                              section.heading === "Net Profit"
                                ? "text-green-600 font-semibold"
                                : "text-gray-900"
                            }`}
                          >
                            {item.amount}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
