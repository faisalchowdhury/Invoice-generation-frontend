/**
 * File: src/pages/purchase/Vendors.tsx
 * Complete Vendors page with all features
 */

import React, { useState } from "react";
import {
  Search,
  MoreVertical,
  Plus,
  Edit2,
  Upload,
  Download,
  X,
  FileText,
  DollarSign,
  Users,
  Calendar,
} from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  status: "draft" | "approved" | "cancelled";
  amount: string;
  date: string;
  email: string;
  phone: string;
  mobile: string;
  address: string;
}

export const Vendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: "1",
      name: "Ritat",
      status: "draft",
      amount: "$5000",
      date: "23 4:25 PM",
      email: "info@gmail.com",
      phone: "0238393884",
      mobile: "8984934838",
      address: "Santa, santa Bankok, 122 Bangladesh",
    },
    {
      id: "2",
      name: "Ritat",
      status: "approved",
      amount: "$5000",
      date: "23 4:25 PM",
      email: "info@gmail.com",
      phone: "0238393884",
      mobile: "8984934838",
      address: "Santa, santa Bankok, 122 Bangladesh",
    },
    {
      id: "3",
      name: "Ritat",
      status: "approved",
      amount: "$5000",
      date: "23 4:25 PM",
      email: "info@gmail.com",
      phone: "0238393884",
      mobile: "8984934838",
      address: "Santa, santa Bankok, 122 Bangladesh",
    },
    {
      id: "4",
      name: "Ritat",
      status: "approved",
      amount: "$5000",
      date: "23 4:25 PM",
      email: "info@gmail.com",
      phone: "0238393884",
      mobile: "8984934838",
      address: "Santa, santa Bankok, 122 Bangladesh",
    },
    {
      id: "5",
      name: "Ritat",
      status: "cancelled",
      amount: "$5000",
      date: "23 4:25 PM",
      email: "info@gmail.com",
      phone: "0238393884",
      mobile: "8984934838",
      address: "Santa, santa Bankok, 122 Bangladesh",
    },
  ]);

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "details" | "settings"
  >("overview");
  const [createTab, setCreateTab] = useState<"details" | "settings">("details");
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [chartType, setChartType] = useState<"bar" | "donut">("bar");

  // Empty state - no vendors
  if (vendors.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-[#FAFBFC]">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Add New Contacts
          </h2>
          <p className="text-gray-600 mb-6">
            Create new customer and vendor contacts by
            <br />
            adding the required business details.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Contact
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-500";
      case "approved":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="h-full flex bg-[#FAFBFC]">
      {/* Left Panel - Vendor List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Vendors</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert("Search vendors")}
                className="p-1.5 hover:bg-gray-100 rounded"
              >
                <Search className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setShowCreateForm(true)}
                className="p-1.5 hover:bg-gray-100 rounded"
              >
                <Edit2 className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-1.5 hover:bg-gray-100 rounded relative"
              >
                <MoreVertical className="w-4 h-4 text-gray-600" />
                {showMoreMenu && (
                  <div className="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button
                      onClick={() => {
                        setShowImportModal(true);
                        setShowMoreMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Import
                    </button>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600">Sort by</span>
            <select className="px-2 py-1 border border-gray-200 rounded text-gray-700">
              <option>Date</option>
              <option>Name</option>
              <option>Amount</option>
            </select>
            <select className="px-2 py-1 border border-gray-200 rounded text-gray-700">
              <option>Status</option>
              <option>All</option>
              <option>Draft</option>
              <option>Approved</option>
            </select>
            <select className="px-2 py-1 border border-gray-200 rounded text-gray-700">
              <option>Customer / All</option>
              <option>Customer</option>
              <option>Vendor</option>
            </select>
          </div>
        </div>

        {/* Vendor List */}
        <div className="flex-1 overflow-y-auto">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              onClick={() => setSelectedVendor(vendor)}
              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedVendor?.id === vendor.id ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {vendor.name}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${getStatusColor(vendor.status)}`}
                  ></span>
                  <span className="text-xs text-gray-500 capitalize">
                    {vendor.status}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {vendor.amount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">#{vendor.id}</span>
                <span className="text-xs text-gray-400">{vendor.date}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">hdjfkj</div>
            </div>
          ))}
        </div>

        {/* Add Button */}
        <div className="p-4 border-t border-gray-200 flex justify-center">
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Right Panel - Vendor Details */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedVendor ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Summary</span>
                  <select className="px-3 py-1 border border-gray-200 rounded text-sm">
                    <option>This Year</option>
                    <option>This Month</option>
                    <option>Last Year</option>
                  </select>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`pb-2 text-sm font-medium border-b-2 ${
                      activeTab === "overview"
                        ? "text-gray-900 border-blue-600"
                        : "text-gray-500 border-transparent"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`pb-2 text-sm font-medium border-b-2 ${
                      activeTab === "details"
                        ? "text-gray-900 border-blue-600"
                        : "text-gray-500 border-transparent"
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`pb-2 text-sm font-medium border-b-2 ${
                      activeTab === "settings"
                        ? "text-gray-900 border-blue-600"
                        : "text-gray-500 border-transparent"
                    }`}
                  >
                    Settings
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setShowAddPayment(true)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <DollarSign className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => alert("Export")}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <FileText className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded relative">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Financial Cards */}
                  <div className="grid grid-cols-5 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">
                        Outstanding
                      </div>
                      <div className="text-xl font-semibold text-red-600">
                        -$134,720
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">
                        Net Profit
                      </div>
                      <div className="text-xl font-semibold text-green-600">
                        $134,720
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Sales</div>
                      <div className="text-xl font-semibold text-gray-900">
                        -$4,720
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Bills</div>
                      <div className="text-xl font-semibold text-gray-900">
                        $34,720
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">
                        Draft Invoices
                      </div>
                      <div className="text-xl font-semibold text-gray-900">
                        $34,720
                      </div>
                    </div>
                  </div>

                  {/* Chart Section */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                      <select className="px-3 py-1.5 border border-gray-200 rounded text-sm">
                        <option>Sales</option>
                        <option>Purchase</option>
                      </select>
                      <div className="flex items-center gap-4">
                        <select className="px-3 py-1.5 border border-gray-200 rounded text-sm">
                          <option>Month</option>
                          <option>Week</option>
                          <option>Year</option>
                        </select>
                        <select className="px-3 py-1.5 border border-gray-200 rounded text-sm">
                          <option>$USD</option>
                          <option>€EUR</option>
                        </select>
                        <button
                          onClick={() =>
                            setChartType(chartType === "bar" ? "donut" : "bar")
                          }
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-6 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <span className="text-sm text-gray-600">Sales</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Overdue</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Paid</span>
                      </div>
                    </div>

                    {/* Chart */}
                    {chartType === "bar" ? (
                      <div className="h-64 flex items-end gap-4">
                        <div className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-green-500 rounded-t"
                            style={{ height: "70%" }}
                          ></div>
                          <div
                            className="w-full bg-red-500 rounded-b"
                            style={{ height: "15%" }}
                          ></div>
                          <span className="text-xs text-gray-500 mt-2">
                            Feb-26
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center">
                        <div className="relative w-48 h-48">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#3B82F6"
                              strokeWidth="20"
                              strokeDasharray="125 251"
                              transform="rotate(-90 50 50)"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#EF4444"
                              strokeWidth="20"
                              strokeDasharray="75 251"
                              strokeDashoffset="-125"
                              transform="rotate(-90 50 50)"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#10B981"
                              strokeWidth="20"
                              strokeDasharray="51 251"
                              strokeDashoffset="-200"
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-gray-900">
                        Recent Activity
                      </h3>
                      <select className="px-3 py-1 border border-gray-200 rounded text-sm">
                        <option>2025</option>
                        <option>2024</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Plus className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-900">
                              Ney Payment #1 Create for Spark Tech
                            </div>
                            <div className="text-xs text-gray-500">
                              Feb 19, 2026 · info@invoice.com
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Details Tab */}
              {activeTab === "details" && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Company
                        </div>
                        <div className="text-base font-medium text-gray-900">
                          Spark Tech Agency
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Reg No.
                        </div>
                        <div className="text-base text-gray-900">222</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Tax ID</div>
                        <div className="text-base text-gray-900">22</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          First Name
                        </div>
                        <div className="text-base text-gray-900">Mahmudul</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Last Name
                        </div>
                        <div className="text-base text-gray-900">
                          Spark Tech Agency
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Billing Address
                        </div>
                        <div className="text-base text-gray-900">
                          Santa, santa Bankok, 122 Bangladesh
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Email</div>
                        <div className="text-base text-blue-600">
                          info@gmail.com
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Mobile Number
                        </div>
                        <div className="text-base text-gray-900">
                          0238393884
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Business Phone
                        </div>
                        <div className="text-base text-gray-900">
                          8984934838
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          Shipping Address
                        </div>
                        <div className="text-base text-gray-900">
                          Santa, santa Bankok, 122 Bangladesh
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Bank Details
                    </h3>
                    <div className="text-sm text-gray-600">Ffdlkfkd</div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Currency
                        </label>
                        <div className="px-3 py-2 border border-gray-200 rounded text-gray-900">
                          $USD
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Payment Terms (Sales)
                        </label>
                        <div className="px-3 py-2 border border-gray-200 rounded text-gray-900">
                          Default Company
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          Payment Reminder
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          Contact Login
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a vendor to view details</p>
          </div>
        )}
      </div>

      {/* Create Vendor Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Create Vendor
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert("Vendor saved!");
                    setShowCreateForm(false);
                  }}
                  className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 px-6 border-b border-gray-200">
              <button
                onClick={() => setCreateTab("details")}
                className={`py-3 text-sm font-medium border-b-2 ${
                  createTab === "details"
                    ? "text-gray-900 border-blue-600"
                    : "text-gray-500 border-transparent"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setCreateTab("settings")}
                className={`py-3 text-sm font-medium border-b-2 ${
                  createTab === "settings"
                    ? "text-gray-900 border-blue-600"
                    : "text-gray-500 border-transparent"
                }`}
              >
                Settings
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {createTab === "details" ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      placeholder="Spark Tech Agency"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="info@invite.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reg No.
                      </label>
                      <input
                        type="text"
                        placeholder="3/11/2026"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax ID
                      </label>
                      <input
                        type="text"
                        placeholder="Master Card"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        placeholder="Mahmudul"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="Tamim"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Phone
                      </label>
                      <input
                        type="text"
                        placeholder="3/11/2026"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fax
                      </label>
                      <input
                        type="text"
                        placeholder="Master Card"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile
                      </label>
                      <input
                        type="text"
                        placeholder="023330330"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Home Phone
                      </label>
                      <input
                        type="text"
                        placeholder="0437483494"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">
                      Address
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">
                            Billing
                          </label>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="sameBilling" />
                            <label
                              htmlFor="sameBilling"
                              className="text-sm text-gray-600"
                            >
                              Same as Billing Address
                            </label>
                          </div>
                        </div>
                        <input
                          type="text"
                          placeholder="Street"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          placeholder="Spark Tech Agency"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Zip"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                          <input
                            type="text"
                            placeholder="City"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="State"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                          <input
                            type="text"
                            placeholder="Country"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">
                            Shipping
                          </label>
                        </div>
                        <input
                          type="text"
                          placeholder="Street"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          placeholder="Spark Tech Agency"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Zip"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                          <input
                            type="text"
                            placeholder="City"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="State"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                          <input
                            type="text"
                            placeholder="Country"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Bank Details
                    </h3>
                    <textarea
                      rows={3}
                      placeholder="Ffdlkfkd"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option>$USD</option>
                        <option>€EUR</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option>Default Taxes (Service)</option>
                        <option>Custom Tax</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option>Default Taxes (Product)</option>
                        <option>Custom Tax</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hourly Rate
                      </label>
                      <input
                        type="text"
                        placeholder="$"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Terms(Sales)
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option>Default Company</option>
                        <option>Custom Terms</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opening Balance
                      </label>
                      <input
                        type="text"
                        placeholder="$0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opening Balance Date
                      </label>
                      <input
                        type="text"
                        placeholder="24"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="flex items-center justify-between py-4 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-700">
                      Payment Reminder
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center gap-8">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="contactType"
                        value="customer"
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Customer</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="contactType"
                        value="vendor"
                        defaultChecked
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Vendor</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Import Contacts
              </h2>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base font-medium text-gray-900 mb-2">
                  Please Choose a file
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  You Can Upload CSV,TSV, SLSX, XLS files
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Choose File
                </button>
              </div>

              <button
                onClick={() => alert("Downloading template...")}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Download a formatted template
              </button>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert("Importing...");
                    setShowImportModal(false);
                  }}
                  className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Sidebar */}
      {showAddPayment && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setShowAddPayment(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Add Payment
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddPayment(false)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      alert("Payment saved!");
                      setShowAddPayment(false);
                    }}
                    className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Payment #
                  </label>
                  <input
                    type="text"
                    placeholder="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Customer
                  </label>
                  <input
                    type="text"
                    placeholder="Customer Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Payment Date
                    </label>
                    <input
                      type="text"
                      placeholder="3/11/2026"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Type
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option>Master Card</option>
                      <option>Cash</option>
                      <option>Bank Transfer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Amount
                  </label>
                  <div className="space-y-2">
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                      <option>Full payment</option>
                      <option>Partial payment</option>
                    </select>
                    <input
                      type="text"
                      placeholder="$0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Internal Notes
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Attachment
                  </label>
                  <div className="flex items-center gap-4">
                    <button className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
                      <Plus className="w-4 h-4 mx-auto mb-1" />
                      Upload Computer
                    </button>
                    <button className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
                      <Plus className="w-4 h-4 mx-auto mb-1" />
                      Upload Document
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-gray-700">Invoices</label>
                    <button className="text-blue-600 hover:text-blue-700">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-md p-3 text-sm text-gray-600">
                    No invoices selected
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
