/**
 * File: src/pages/Dashboard.tsx
 * Dashboard page with toggleable chart views (Bar chart / Donut chart)
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, PieChart } from "lucide-react";

export const Dashboard: React.FC = () => {
  const [chartView, setChartView] = useState<"bar" | "donut">("bar");
  const [selectedMonth, setSelectedMonth] = useState("Month");
  const [selectedCurrency, setSelectedCurrency] = useState("$USD");

  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-auto">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2">
        {/* Left - Summary Tab */}
        <div className="flex items-center gap-6">
          <button className="text-sm font-medium text-gray-900 border-b-2 border-blue-600 pb-2">
            Summary
          </button>
        </div>

        {/* Right - Filters */}
        <div className="flex items-center gap-3">
          {/* This Year Dropdown */}
          <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">
            <option>This Year</option>
            <option>This Month</option>
            <option>Last Month</option>
          </select>

          {/* Filter Icon */}
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

      {/* Metrics Row */}
      <div className="px-4 sm:px-6 py-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Outstanding */}
          <Link to="/sales/invoices" className="text-center hover:bg-gray-50 rounded-md p-1 transition-colors cursor-pointer">
            <div className="text-xs text-gray-600 mb-1">Outstanding</div>
            <div className="text-lg font-semibold text-red-600">-$134,720</div>
          </Link>

          {/* Net Profit */}
          <Link to="/reports" className="text-center hover:bg-gray-50 rounded-md p-1 transition-colors cursor-pointer">
            <div className="text-xs text-gray-600 mb-1">Net Profit</div>
            <div className="text-lg font-semibold text-gray-900">$134,720</div>
          </Link>

          {/* Sales */}
          <Link to="/sales/invoices" className="text-center hover:bg-gray-50 rounded-md p-1 transition-colors cursor-pointer">
            <div className="text-xs text-gray-600 mb-1">Sales</div>
            <div className="text-lg font-semibold text-red-600">-$4,720</div>
          </Link>

          {/* Debt Overview */}
          <Link to="/purchase/bills" className="text-center hover:bg-gray-50 rounded-md p-1 transition-colors cursor-pointer">
            <div className="text-xs text-gray-600 mb-1">Debt Overview</div>
            <div className="text-lg font-semibold text-gray-900">$34,720</div>
          </Link>

          {/* Profit */}
          <Link to="/reports" className="text-center hover:bg-gray-50 rounded-md p-1 transition-colors cursor-pointer">
            <div className="text-xs text-gray-600 mb-1">Profit</div>
            <div className="text-lg font-semibold text-gray-900">$34,720</div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        {/* Chart Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
          {/* Chart Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              {/* Sales Dropdown */}
              <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">
                <option>Sales</option>
                <option>Purchase</option>
                <option>Expenses</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              {/* Month Dropdown */}
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white"
              >
                <option>Month</option>
                <option>Week</option>
                <option>Year</option>
              </select>

              {/* Currency Dropdown */}
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white"
              >
                <option>$USD</option>
                <option>€EUR</option>
                <option>£GBP</option>
              </select>

              {/* View Toggle Button */}
              <button
                onClick={() =>
                  setChartView(chartView === "bar" ? "donut" : "bar")
                }
                className="p-2 hover:bg-gray-100 rounded-md border border-gray-300 transition-colors"
                title={
                  chartView === "bar"
                    ? "Switch to Donut Chart"
                    : "Switch to Bar Chart"
                }
              >
                {chartView === "bar" ? (
                  <PieChart className="w-5 h-5 text-blue-600" />
                ) : (
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                )}
              </button>
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="text-sm text-gray-700">Sales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-700">Overdue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-700">Paid</span>
            </div>
          </div>

          {/* Chart Display */}
          {chartView === "bar" ? (
            // Bar Chart View
            <div className="flex items-end justify-center h-64 gap-8 px-8">
              {/* Green Bar (Paid) */}
              <div className="flex flex-col items-center">
                <div
                  className="w-16 bg-green-500 rounded-t-md"
                  style={{ height: "180px" }}
                ></div>
                <div className="mt-2 text-xs text-gray-600">Jan</div>
              </div>
              {/* Red Bar (Overdue) */}
              <div className="flex flex-col items-center">
                <div
                  className="w-16 bg-red-500 rounded-t-md"
                  style={{ height: "80px" }}
                ></div>
                <div className="mt-2 text-xs text-gray-600">Feb</div>
              </div>
            </div>
          ) : (
            // Donut Chart View
            <div className="flex items-center justify-center h-64">
              {/* SVG Donut Chart */}
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="40"
                  strokeDasharray="220 440"
                  transform="rotate(-90 100 100)"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="40"
                  strokeDasharray="110 440"
                  strokeDashoffset="-220"
                  transform="rotate(-90 100 100)"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="40"
                  strokeDasharray="110 440"
                  strokeDashoffset="-330"
                  transform="rotate(-90 100 100)"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Bottom Grid - Vendors, Products, Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Top Vendors */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Top Vendors</h3>
                <Link to="/purchase/vendors" className="text-xs text-blue-600 hover:text-blue-700">View all →</Link>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Spark Tech Agency", amount: "$3,200" },
                  { name: "Fair Electronics", amount: "$2,800" },
                  { name: "Global Supplies", amount: "$1,500" },
                ].map((v) => (
                  <Link key={v.name} to="/purchase/vendors" className="flex items-center justify-between hover:bg-gray-50 rounded px-1 py-0.5 transition-colors">
                    <span className="text-sm text-gray-700">{v.name}</span>
                    <span className="text-sm font-medium text-gray-900">{v.amount}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Top Products</h3>
                <Link to="/items/product" className="text-xs text-blue-600 hover:text-blue-700">View all →</Link>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Electronics Bundle", amount: "$1,000" },
                  { name: "Office Supplies", amount: "$850" },
                  { name: "Software License", amount: "$600" },
                ].map((p) => (
                  <Link key={p.name} to="/items/product" className="flex items-center justify-between hover:bg-gray-50 rounded px-1 py-0.5 transition-colors">
                    <span className="text-sm text-gray-700">{p.name}</span>
                    <span className="text-sm font-medium text-gray-900">{p.amount}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Recent Activity
              </h3>
              <div className="flex items-center gap-2">
                <select className="text-xs border border-gray-300 rounded px-2 py-1">
                  <option>2025</option>
                  <option>2024</option>
                </select>
                <Link to="/reports" className="text-xs text-blue-600 hover:text-blue-700">View all →</Link>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { icon: "$", bg: "bg-blue-100", text: "text-blue-600", title: "Invoice #1 created for Spark Tech", sub: "Feb 18, 2026 — $5,000", path: "/sales/invoices" },
                { icon: "✓", bg: "bg-green-100", text: "text-green-600", title: "Payment received from Tech Corp", sub: "Apr 15, 2026 — $2,000", path: "/sales/payment-received" },
                { icon: "$", bg: "bg-blue-100", text: "text-blue-600", title: "Purchase Order #3 sent to vendor", sub: "Feb 18, 2026 — $1,200", path: "/purchase/purchase-orders" },
                { icon: "!", bg: "bg-yellow-100", text: "text-yellow-600", title: "Invoice #2 overdue — Tech Corp", sub: "Mar 1, 2026 — $5,500", path: "/sales/invoices" },
              ].map((a, i) => (
                <Link key={i} to={a.path} className="flex items-start gap-3 hover:bg-gray-50 rounded-md px-1 py-1 transition-colors">
                  <div className={`w-6 h-6 rounded-full ${a.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <span className={`text-xs ${a.text}`}>{a.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900 font-medium">{a.title}</div>
                    <div className="text-xs text-gray-500">{a.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
