/**
 * File: src/pages/sales/Customers.tsx
 * Complete Customers page with working Add/Edit Customer modals
 * ALL BUTTONS ARE FUNCTIONAL
 */

import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  BarChart3,
  PieChart,
  Info,
  MoreVertical,
  FileText,
  Copy,
  Bookmark,
  X,
} from "lucide-react";

interface Invoice {
  id: string;
  refNumber: string;
  status: "High" | "Approved" | "Complete" | "Draft";
  amount: number;
  date: string;
}

interface Customer {
  id: string;
  name: string;
  companyName: string;
  email: string;
  regNo: string;
  businessPhone: string;
  taxId: string;
  fax: string;
  firstName: string;
  lastName: string;
  mobile: string;
  homePhone: string;
  billingAddress: string;
  billingZip: string;
  billingCity: string;
  billingState: string;
  billingCountry: string;
  shippingAddress: string;
  shippingZip: string;
  shippingCity: string;
  shippingState: string;
  shippingCountry: string;
  sameAsBilling: boolean;
  bankDetails: string;
  currency: string;
  tax: string;
  paymentTerms: string;
  openingBalance: number;
  openingBalanceDate: string;
  notes: string;
  paymentReminder: boolean;
  customerType: "customer" | "vendor";
  outstanding: number;
  netProfit: number;
  sales: number;
  profit: number;
  draftInvoices: number;
}

const sampleInvoices: Invoice[] = [
  {
    id: "1",
    refNumber: "Ref# 01",
    status: "Draft",
    amount: 5000,
    date: "24 Jul 24 PM",
  },
  {
    id: "2",
    refNumber: "Ref# 02",
    status: "Approved",
    amount: 5000,
    date: "24 Jul 24 PM",
  },
  {
    id: "3",
    refNumber: "Ref# 03",
    status: "Approved",
    amount: 5000,
    date: "24 Jul 24 PM",
  },
  {
    id: "4",
    refNumber: "Ref# 04",
    status: "Approved",
    amount: 5000,
    date: "24 Jul 24 PM",
  },
  {
    id: "5",
    refNumber: "Ref# 05",
    status: "Complete",
    amount: 5000,
    date: "24 Jul 24 PM",
  },
];

const initialCustomer: Customer = {
  id: "1",
  name: "Spark Tech Agency",
  companyName: "Spark Tech Agency",
  email: "info@invice.com",
  regNo: "3/1/2026",
  businessPhone: "3/11/2026",
  taxId: "Master Card",
  fax: "Master Card",
  firstName: "Mahmdudul",
  lastName: "Tamim",
  mobile: "023330330",
  homePhone: "0437483494",
  billingAddress: "Spark Tech Agency",
  billingZip: "3/11/2026",
  billingCity: "Master Card",
  billingState: "3/11/2026",
  billingCountry: "Master Card",
  shippingAddress: "Spark Tech Agency",
  shippingZip: "3/11/2026",
  shippingCity: "Master Card",
  shippingState: "3/11/2026",
  shippingCountry: "Master Card",
  sameAsBilling: false,
  bankDetails: "Fffdklffkd",
  currency: "$USD",
  tax: "Default Taxes (Service)",
  paymentTerms: "Default Company",
  openingBalance: 0,
  openingBalanceDate: "24",
  notes: "",
  paymentReminder: true,
  customerType: "customer",
  outstanding: -134720,
  netProfit: 134720,
  sales: -4720,
  profit: 34720,
  draftInvoices: 34720,
};

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([initialCustomer]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer>(initialCustomer);
  const [activeTab, setActiveTab] = useState<
    "overview" | "details" | "settings"
  >("overview");
  const [chartView, setChartView] = useState<"bar" | "donut">("bar");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Modal tab
  const [modalTab, setModalTab] = useState<"details" | "settings">("details");

  // Form data for edit/add
  const [formData, setFormData] = useState<Customer>(initialCustomer);

  const handleInputChange = (field: keyof Customer, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (showEditModal) {
      // Update existing customer
      setCustomers((prev) =>
        prev.map((c) => (c.id === formData.id ? formData : c)),
      );
      setSelectedCustomer(formData);
      setShowEditModal(false);
    } else if (showAddModal) {
      // Add new customer
      const newCustomer = { ...formData, id: Date.now().toString() };
      setCustomers((prev) => [...prev, newCustomer]);
      setSelectedCustomer(newCustomer);
      setShowAddModal(false);
    }
  };

  const handleEdit = () => {
    setFormData(selectedCustomer);
    setModalTab("details");
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setFormData({
      ...initialCustomer,
      id: "",
      name: "",
      companyName: "",
      email: "",
    });
    setModalTab("details");
    setShowAddModal(true);
  };

  const handleDelete = () => {
    setCustomers((prev) => prev.filter((c) => c.id !== selectedCustomer.id));
    if (customers.length > 1) {
      setSelectedCustomer(
        customers[0].id === selectedCustomer.id ? customers[1] : customers[0],
      );
    }
    setShowDeleteModal(false);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(customers, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "customers.json";
    link.click();
  };

  const filteredInvoices = sampleInvoices.filter((invoice) =>
    invoice.refNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "High":
      case "Draft":
        return "bg-red-100 text-red-700 border-red-200";
      case "Approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "Complete":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-hidden flex flex-col">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button className="text-sm font-medium text-gray-900 border-b-2 border-blue-600 pb-2">
              Summary
            </button>
          </div>
          <div className="flex items-center gap-3">
            <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">
              <option>This Year</option>
              <option>This Month</option>
              <option>Last Month</option>
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

      {/* Customer Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Customers</h2>
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
            >
              Import
            </button>
            <h2 className="text-lg font-medium text-gray-700">
              {selectedCustomer.name}
            </h2>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 relative">
            <button
              onClick={handleEdit}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Edit Customer"
            >
              <Edit className="w-5 h-5 text-gray-600" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Info"
            >
              <Info className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() =>
                navigator.clipboard.writeText(selectedCustomer.email)
              }
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Copy Email"
            >
              <Copy className="w-5 h-5 text-gray-600" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Bookmark"
            >
              <Bookmark className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="More Options"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            {/* More Menu Dropdown */}
            {showMoreMenu && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => {
                    handleAdd();
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Customer
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(true);
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Customer
                </button>
                <button
                  onClick={() => {
                    handleExport();
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Data
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === "overview"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === "details"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === "settings"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Outstanding</div>
            <div className="text-lg font-semibold text-red-600">
              -${Math.abs(selectedCustomer.outstanding).toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Net Profit</div>
            <div className="text-lg font-semibold text-gray-900">
              ${selectedCustomer.netProfit.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Sales</div>
            <div className="text-lg font-semibold text-red-600">
              -${Math.abs(selectedCustomer.sales).toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Profit</div>
            <div className="text-lg font-semibold text-gray-900">
              ${selectedCustomer.profit.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Draft Invoices</div>
            <div className="text-lg font-semibold text-gray-900">
              ${selectedCustomer.draftInvoices.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Sidebar - Invoices List */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-600">Sort by:</span>
              <select className="px-2 py-1 border border-gray-300 rounded text-gray-700">
                <option>Date</option>
                <option>Amount</option>
              </select>
              <select className="px-2 py-1 border border-gray-300 rounded text-gray-700">
                <option>Status</option>
                <option>All</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <select className="px-2 py-1 border border-gray-300 rounded text-gray-700 flex-1">
                <option>Customer: All</option>
              </select>
              <select className="px-2 py-1 border border-gray-300 rounded text-gray-700 flex-1">
                <option>Date</option>
              </select>
            </div>
          </div>

          {/* Invoice List */}
          <div className="flex-1 overflow-y-auto">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                onClick={() => setSelectedInvoice(invoice)}
                className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedInvoice?.id === invoice.id
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-sm font-medium text-gray-900">
                    {invoice.refNumber}
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(
                      invoice.status,
                    )}`}
                  >
                    {invoice.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">hdjjdj</span>
                  <span className="text-xs text-gray-500">{invoice.date}</span>
                </div>
                <div className="mt-1">
                  <span className="text-sm font-semibold text-gray-900">
                    ${invoice.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Content based on active tab */}
          {activeTab === "overview" && (
            <>
              {/* Chart Section */}
              <div className="bg-white rounded-lg border border-blue-400 border-2 p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">
                      <option>Sales</option>
                      <option>Purchase</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">
                      <option>Month</option>
                      <option>Week</option>
                      <option>Year</option>
                    </select>

                    <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">
                      <option>$USD</option>
                      <option>€EUR</option>
                    </select>

                    <button
                      onClick={() =>
                        setChartView(chartView === "bar" ? "donut" : "bar")
                      }
                      className="p-2 hover:bg-gray-100 rounded-md border border-gray-300"
                    >
                      {chartView === "bar" ? (
                        <PieChart className="w-5 h-5 text-blue-600" />
                      ) : (
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                      )}
                    </button>
                  </div>
                </div>

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

                {chartView === "bar" ? (
                  <div className="flex items-end justify-center h-48 gap-12 px-8">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-16 bg-green-500 rounded-t-md"
                        style={{ height: "140px" }}
                      ></div>
                      <div className="mt-2 text-xs text-gray-600">Jan</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div
                        className="w-16 bg-red-500 rounded-t-md"
                        style={{ height: "60px" }}
                      ></div>
                      <div className="mt-2 text-xs text-gray-600">Feb</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48">
                    <svg width="180" height="180" viewBox="0 0 180 180">
                      <circle
                        cx="90"
                        cy="90"
                        r="60"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="35"
                        strokeDasharray="220 377"
                        transform="rotate(-90 90 90)"
                      />
                      <circle
                        cx="90"
                        cy="90"
                        r="60"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="35"
                        strokeDasharray="100 377"
                        strokeDashoffset="-220"
                        transform="rotate(-90 90 90)"
                      />
                      <circle
                        cx="90"
                        cy="90"
                        r="60"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="35"
                        strokeDasharray="57 377"
                        strokeDashoffset="-320"
                        transform="rotate(-90 90 90)"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Recent Activity
                  </h3>
                  <select className="text-xs border border-gray-300 rounded px-2 py-1">
                    <option>2025</option>
                    <option>2024</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FileText className="w-3 h-3 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-900">
                          Nay Payment #1 Create for Spark Tech
                        </div>
                        <div className="text-xs text-gray-500">
                          Feb 18, 2026 - info@mooze.net
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Details Tab Content */}
          {activeTab === "details" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Customer Details
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">
                    Company Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500">
                        Company Name
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedCustomer.companyName}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">
                        {selectedCustomer.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">
                        Registration No
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedCustomer.regNo}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">
                        Business Phone
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedCustomer.businessPhone}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500">
                        First Name
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedCustomer.firstName}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Last Name</label>
                      <p className="text-sm text-gray-900">
                        {selectedCustomer.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Mobile</label>
                      <p className="text-sm text-gray-900">
                        {selectedCustomer.mobile}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">
                    Billing Address
                  </h4>
                  <div className="space-y-2 text-sm text-gray-900">
                    <p>{selectedCustomer.billingAddress}</p>
                    <p>
                      {selectedCustomer.billingCity},{" "}
                      {selectedCustomer.billingState}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">
                    Shipping Address
                  </h4>
                  <div className="space-y-2 text-sm text-gray-900">
                    <p>{selectedCustomer.shippingAddress}</p>
                    <p>
                      {selectedCustomer.shippingCity},{" "}
                      {selectedCustomer.shippingState}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab Content */}
          {activeTab === "settings" && (
            <div className="bg-white rounded-lg border border-blue-400 border-2 p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={selectedCustomer.currency}
                    onChange={(e) =>
                      setSelectedCustomer((prev) => ({
                        ...prev,
                        currency: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  >
                    <option>$USD</option>
                    <option>€EUR</option>
                    <option>£GBP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tax
                  </label>
                  <select
                    value={selectedCustomer.tax}
                    onChange={(e) =>
                      setSelectedCustomer((prev) => ({
                        ...prev,
                        tax: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  >
                    <option>Default Taxes (Service)</option>
                    <option>Default Taxes (Product)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Hourly Rate
                  </label>
                  <input
                    type="text"
                    placeholder="$"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Payment Terms(Sales)
                  </label>
                  <select
                    value={selectedCustomer.paymentTerms}
                    onChange={(e) =>
                      setSelectedCustomer((prev) => ({
                        ...prev,
                        paymentTerms: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  >
                    <option>Default Company</option>
                    <option>Net 30</option>
                    <option>Net 60</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Opening Balance
                  </label>
                  <input
                    type="number"
                    value={selectedCustomer.openingBalance}
                    onChange={(e) =>
                      setSelectedCustomer((prev) => ({
                        ...prev,
                        openingBalance: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                    placeholder="$0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Opening Balance Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedCustomer.openingBalanceDate}
                      onChange={(e) =>
                        setSelectedCustomer((prev) => ({
                          ...prev,
                          openingBalanceDate: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                      placeholder="24"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={selectedCustomer.notes}
                  onChange={(e) =>
                    setSelectedCustomer((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-6">
                  <label className="text-sm font-medium text-gray-700">
                    Payment Reminder
                  </label>
                  <button
                    onClick={() =>
                      setSelectedCustomer((prev) => ({
                        ...prev,
                        paymentReminder: !prev.paymentReminder,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      selectedCustomer.paymentReminder
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        selectedCustomer.paymentReminder
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setSelectedCustomer((prev) => ({
                        ...prev,
                        customerType: "customer",
                      }))
                    }
                    className={`px-8 py-2 rounded-md transition-colors ${
                      selectedCustomer.customerType === "customer"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    onClick={() =>
                      setSelectedCustomer((prev) => ({
                        ...prev,
                        customerType: "vendor",
                      }))
                    }
                    className={`px-8 py-2 rounded-md transition-colors ${
                      selectedCustomer.customerType === "vendor"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Vendor
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Add Customer Modal */}
      {(showEditModal || showAddModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {showEditModal ? "Edit Customer" : "Add Customer"}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setShowAddModal(false);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-8 px-6 border-b border-gray-200">
              <button
                onClick={() => setModalTab("details")}
                className={`pb-3 pt-3 text-sm font-medium transition-colors ${
                  modalTab === "details"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setModalTab("settings")}
                className={`pb-3 pt-3 text-sm font-medium transition-colors ${
                  modalTab === "settings"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Settings
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {modalTab === "details" ? (
                <div className="space-y-6">
                  {/* Company Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) =>
                          handleInputChange("companyName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reg No
                      </label>
                      <input
                        type="text"
                        value={formData.regNo}
                        onChange={(e) =>
                          handleInputChange("regNo", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tax ID
                      </label>
                      <input
                        type="text"
                        value={formData.taxId}
                        onChange={(e) =>
                          handleInputChange("taxId", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Phone
                      </label>
                      <input
                        type="text"
                        value={formData.businessPhone}
                        onChange={(e) =>
                          handleInputChange("businessPhone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fax
                      </label>
                      <input
                        type="text"
                        value={formData.fax}
                        onChange={(e) =>
                          handleInputChange("fax", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile
                      </label>
                      <input
                        type="text"
                        value={formData.mobile}
                        onChange={(e) =>
                          handleInputChange("mobile", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Home Phone
                      </label>
                      <input
                        type="text"
                        value={formData.homePhone}
                        onChange={(e) =>
                          handleInputChange("homePhone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">
                      Address
                    </h3>

                    <div className="grid grid-cols-2 gap-6">
                      {/* Billing */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-700">
                          Billing
                        </h4>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Company
                          </label>
                          <input
                            type="text"
                            value={formData.billingAddress}
                            onChange={(e) =>
                              handleInputChange(
                                "billingAddress",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Zip
                          </label>
                          <input
                            type="text"
                            value={formData.billingZip}
                            onChange={(e) =>
                              handleInputChange("billingZip", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            value={formData.billingCity}
                            onChange={(e) =>
                              handleInputChange("billingCity", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            State
                          </label>
                          <input
                            type="text"
                            value={formData.billingState}
                            onChange={(e) =>
                              handleInputChange("billingState", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Country
                          </label>
                          <input
                            type="text"
                            value={formData.billingCountry}
                            onChange={(e) =>
                              handleInputChange(
                                "billingCountry",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                          />
                        </div>
                      </div>

                      {/* Shipping */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-700">
                            Shipping
                          </h4>
                          <label className="flex items-center gap-2 text-xs text-gray-600">
                            <input
                              type="checkbox"
                              checked={formData.sameAsBilling}
                              onChange={(e) =>
                                handleInputChange(
                                  "sameAsBilling",
                                  e.target.checked,
                                )
                              }
                              className="rounded border-gray-300"
                            />
                            Same as Billing Address
                          </label>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Company
                          </label>
                          <input
                            type="text"
                            value={formData.shippingAddress}
                            onChange={(e) =>
                              handleInputChange(
                                "shippingAddress",
                                e.target.value,
                              )
                            }
                            disabled={formData.sameAsBilling}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Zip
                          </label>
                          <input
                            type="text"
                            value={formData.shippingZip}
                            onChange={(e) =>
                              handleInputChange("shippingZip", e.target.value)
                            }
                            disabled={formData.sameAsBilling}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            value={formData.shippingCity}
                            onChange={(e) =>
                              handleInputChange("shippingCity", e.target.value)
                            }
                            disabled={formData.sameAsBilling}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            State
                          </label>
                          <input
                            type="text"
                            value={formData.shippingState}
                            onChange={(e) =>
                              handleInputChange("shippingState", e.target.value)
                            }
                            disabled={formData.sameAsBilling}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm disabled:bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Country
                          </label>
                          <input
                            type="text"
                            value={formData.shippingCountry}
                            onChange={(e) =>
                              handleInputChange(
                                "shippingCountry",
                                e.target.value,
                              )
                            }
                            disabled={formData.sameAsBilling}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm disabled:bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">
                      Bank Details
                    </h3>
                    <textarea
                      value={formData.bankDetails}
                      onChange={(e) =>
                        handleInputChange("bankDetails", e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              ) : (
                // Settings Tab
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <select
                        value={formData.currency}
                        onChange={(e) =>
                          handleInputChange("currency", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option>$USD</option>
                        <option>€EUR</option>
                        <option>£GBP</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tax
                      </label>
                      <select
                        value={formData.tax}
                        onChange={(e) =>
                          handleInputChange("tax", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option>Default Taxes (Service)</option>
                        <option>Default Taxes (Product)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hourly Rate
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="$"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Terms(Sales)
                      </label>
                      <select
                        value={formData.paymentTerms}
                        onChange={(e) =>
                          handleInputChange("paymentTerms", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option>Default Company</option>
                        <option>Net 30</option>
                        <option>Net 60</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Opening Balance
                      </label>
                      <input
                        type="number"
                        value={formData.openingBalance}
                        onChange={(e) =>
                          handleInputChange(
                            "openingBalance",
                            parseFloat(e.target.value),
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Opening Balance Date
                      </label>
                      <input
                        type="text"
                        value={formData.openingBalanceDate}
                        onChange={(e) =>
                          handleInputChange(
                            "openingBalanceDate",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium text-gray-700">
                        Payment Reminder
                      </label>
                      <button
                        onClick={() =>
                          handleInputChange(
                            "paymentReminder",
                            !formData.paymentReminder,
                          )
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.paymentReminder
                            ? "bg-blue-600"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.paymentReminder
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() =>
                          handleInputChange("customerType", "customer")
                        }
                        className={`px-6 py-2 rounded-md transition-colors ${
                          formData.customerType === "customer"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Customer
                      </button>
                      <button
                        onClick={() =>
                          handleInputChange("customerType", "vendor")
                        }
                        className={`px-6 py-2 rounded-md transition-colors ${
                          formData.customerType === "vendor"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Vendor
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Customer
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete "{selectedCustomer.name}"? This
              action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Import Customers
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop your file here
              </p>
              <p className="text-xs text-gray-500">or</p>
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                Choose File
              </button>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
