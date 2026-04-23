/**
 * File: src/pages/sales/SalesReceipts.tsx
 * Complete Sales Receipts page with multi-select, all modals working
 * Based on Invoices structure but adapted for Sales Receipts
 */

import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  Info,
  MoreVertical,
  Copy,
  Eye,
  Printer,
  Mail,
  MessageCircle,
  FileText,
  Truck,
  X,
  Calendar,
  DollarSign,
  CreditCard,
  Wallet,
  Building,
  Smartphone,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Ban,
  PenTool,
  Activity,
  Columns,
  ShoppingCart,
  Receipt,
  Package,
  Check,
} from "lucide-react";

interface ReceiptItem {
  srNo: number;
  item: string;
  description?: string;
  rate: number;
  quantity: number;
  tax: number;
  discount: number;
  amount: number;
}

interface SalesReceipt {
  id: string;
  receiptNumber: string;
  customerName: string;
  customerSubtitle: string;
  status: "Draft" | "Approved" | "Cancelled";
  amount: number;
  receiptDate: string;
  paymentType: string;
  date: string;
  billingAddress: string;
  billingCity: string;
  billingZip: string;
  shippingMethod: string;
  subTitle: string;
  items: ReceiptItem[];
  termsAndConditions: string;
  notes: string;
  internalNotes: string;
  subTotal: number;
  shippingCost: number;
  salesTax: number;
  total: number;
  paid: number;
  due: number;
}

const sampleReceipts: SalesReceipt[] = [
  {
    id: "1",
    receiptNumber: "#1",
    customerName: "Spark Tech Agency",
    customerSubtitle: "Mahmudul Hasan",
    status: "Draft",
    amount: 5000,
    receiptDate: "26 March,26",
    paymentType: "Mastercard",
    date: "23 Jul 24 PM",
    billingAddress: "Santa, santa",
    billingCity: "Bankok, 122 Bangladesh",
    billingZip: "",
    shippingMethod: "Priority Shipping",
    subTitle: "fdffdfdf",
    items: [
      {
        srNo: 1,
        item: "Electronics",
        rate: 400,
        quantity: 24,
        tax: 1,
        discount: -2,
        amount: 392,
      },
      {
        srNo: 2,
        item: "Electronics",
        rate: 400,
        quantity: 24,
        tax: 1,
        discount: -2,
        amount: 392,
      },
      {
        srNo: 3,
        item: "Electronics",
        rate: 400,
        quantity: 24,
        tax: 1,
        discount: -2,
        amount: 392,
      },
    ],
    termsAndConditions: "",
    notes: "",
    internalNotes: "",
    subTotal: 80.0,
    shippingCost: 3.2,
    salesTax: 10.0,
    total: 93.2,
    paid: 0,
    due: 15444,
  },
  {
    id: "2",
    receiptNumber: "#2",
    customerName: "Tech Corp",
    customerSubtitle: "John Doe",
    status: "Approved",
    amount: 5000,
    receiptDate: "27 March,26",
    paymentType: "Visa",
    date: "23 Jul 24 PM",
    billingAddress: "123 Main St",
    billingCity: "New York, USA",
    billingZip: "10001",
    shippingMethod: "Standard",
    subTitle: "Monthly Service",
    items: [
      {
        srNo: 1,
        item: "Consulting",
        rate: 500,
        quantity: 10,
        tax: 1,
        discount: 0,
        amount: 5000,
      },
    ],
    termsAndConditions: "",
    notes: "",
    internalNotes: "",
    subTotal: 5000,
    shippingCost: 0,
    salesTax: 500,
    total: 5500,
    paid: 0,
    due: 5500,
  },
];

export const SalesReceipts: React.FC = () => {
  const [receipts, setReceipts] = useState<SalesReceipt[]>(sampleReceipts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<SalesReceipt>(
    sampleReceipts[0],
  );
  const [selectedReceipts, setSelectedReceipts] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showPrintMenu, setShowPrintMenu] = useState(false);
  const [showConvertMenu, setShowConvertMenu] = useState(false);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);

  // Form data
  const [formData, setFormData] = useState<SalesReceipt>(sampleReceipts[0]);
  const [signatureName, setSignatureName] = useState("Mahmudul Hasan");
  const [signatureTitle, setSignatureTitle] = useState("Master Card");
  const [signatureDate, setSignatureDate] = useState("3/11/2026");

  const handleInputChange = (field: keyof SalesReceipt, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (showEditModal) {
      setReceipts((prev) =>
        prev.map((rec) => (rec.id === formData.id ? formData : rec)),
      );
      setSelectedReceipt(formData);
      setShowEditModal(false);
    } else if (showCreateModal) {
      const newReceipt = { ...formData, id: Date.now().toString() };
      setReceipts((prev) => [...prev, newReceipt]);
      setSelectedReceipt(newReceipt);
      setShowCreateModal(false);
    }
  };

  const handleEdit = () => {
    setFormData(selectedReceipt);
    setShowEditModal(true);
  };

  const handleCreate = () => {
    setFormData({
      ...sampleReceipts[0],
      id: "",
      receiptNumber: "",
      customerName: "",
    });
    setShowCreateModal(true);
  };

  const toggleSelectReceipt = (id: string) => {
    setSelectedReceipts((prev) =>
      prev.includes(id) ? prev.filter((recId) => recId !== id) : [...prev, id],
    );
  };

  const filteredReceipts = receipts.filter((receipt) =>
    receipt.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-red-100 text-red-700 border-red-200";
      case "Approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "Cancelled":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Calculate total of selected receipts
  const selectedTotal = receipts
    .filter((r) => selectedReceipts.includes(r.id))
    .reduce((sum, r) => sum + r.due, 0);

  // Payment Method Icons Component
  const PaymentMethods = () => (
    <div className="flex flex-wrap gap-2">
      <div className="w-16 h-10 bg-purple-600 rounded flex items-center justify-center">
        <Wallet className="w-5 h-5 text-white" />
      </div>
      <div className="w-16 h-10 bg-blue-500 rounded flex items-center justify-center">
        <DollarSign className="w-5 h-5 text-white" />
      </div>
      <div className="w-16 h-10 bg-gray-700 rounded flex items-center justify-center">
        <Building className="w-5 h-5 text-white" />
      </div>
      <div className="w-16 h-10 bg-green-500 rounded flex items-center justify-center">
        <CreditCard className="w-5 h-5 text-white" />
      </div>
    </div>
  );

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
            <select
              onChange={(e) => alert(`Filtering by: ${e.target.value}`)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white"
            >
              <option>This Year</option>
              <option>This Month</option>
              <option>Last Month</option>
            </select>
            <button
              onClick={() => alert("Filter menu opened")}
              className="p-1.5 hover:bg-gray-100 rounded"
            >
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

      {/* Receipt Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Sales Receipts
            </h2>
            {!isMultiSelectMode && (
              <>
                <h3 className="text-lg font-medium text-gray-700">
                  {selectedReceipt.customerName}
                </h3>
                <span className="text-sm text-gray-500">
                  {selectedReceipt.customerSubtitle}
                </span>
              </>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 relative">
            {isMultiSelectMode ? (
              <>
                <button
                  onClick={() => alert("Deleting selected receipts...")}
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => alert("Calling selected customers...")}
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="Call"
                >
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => alert("Sending email to selected...")}
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="Email"
                >
                  <Mail className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setShowReceiptPreview(true)}
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="View"
                >
                  <Eye className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => alert("Opening dropdown...")}
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="More"
                >
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
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => alert("Added to favorites!")}
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="Add to favorites"
                >
                  <CheckCircle className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => alert("Column settings opened")}
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="Columns"
                >
                  <Columns className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={handleEdit}
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="Edit Receipt"
                >
                  <Edit className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => alert("Receipt expanded to full screen")}
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="Expand"
                >
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
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setShowReceiptPreview(true)}
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="View Receipt"
                >
                  <Eye className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => alert("Printing receipt...")}
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="Print"
                >
                  <Printer className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => alert("Email dialog opened")}
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="Send Email"
                >
                  <Mail className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="More Options"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </>
            )}

            {/* More Menu Dropdown */}
            {showMoreMenu && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => {
                    alert("Opening WhatsApp...");
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </button>
                <button
                  onClick={() => {
                    alert("Receipt duplicated!");
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button
                  onClick={() => {
                    alert("Opening activity log...");
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  Active Log
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={() => setShowConvertMenu(!showConvertMenu)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 justify-between"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Frame 214723...
                  </span>
                  <span>→</span>
                </button>
                {showConvertMenu && (
                  <div className="ml-4 border-l border-gray-200 pl-2">
                    <button
                      onClick={() => {
                        alert("Converting to Sales Receipts...");
                        setShowMoreMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      As Sales Receipts
                    </button>
                    <button
                      onClick={() => {
                        alert("Printing single copy...");
                        setShowMoreMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Single Copy
                    </button>
                    <button
                      onClick={() => {
                        alert("Printing double copy...");
                        setShowMoreMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Double Copy
                    </button>
                    <button
                      onClick={() => {
                        alert("Printing triple copy...");
                        setShowMoreMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Triple Copy
                    </button>
                  </div>
                )}
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete this receipt?")
                    ) {
                      alert("Receipt moved to trash!");
                    }
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Trash
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Sidebar - Receipts List */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Multi-select mode header */}
          {isMultiSelectMode && (
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedReceipts.length === receipts.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedReceipts(receipts.map((r) => r.id));
                      } else {
                        setSelectedReceipts([]);
                      }
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Select All
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search receipts"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-xs mb-2">
              <span className="text-gray-600">Sort by:</span>
              <select
                onChange={(e) => alert(`Sorting by: ${e.target.value}`)}
                className="px-2 py-1 border border-gray-300 rounded text-gray-700"
              >
                <option>Date</option>
                <option>Amount</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <select
                onChange={(e) => alert(`Filter by status: ${e.target.value}`)}
                className="px-2 py-1 border border-gray-300 rounded text-gray-700 flex-1"
              >
                <option>Status</option>
                <option>Draft</option>
                <option>Approved</option>
              </select>
              <select
                onChange={(e) => alert(`Filter by customer: ${e.target.value}`)}
                className="px-2 py-1 border border-gray-300 rounded text-gray-700 flex-1"
              >
                <option>Customer: All</option>
              </select>
              <select
                onChange={(e) => alert(`Filter by date: ${e.target.value}`)}
                className="px-2 py-1 border border-gray-300 rounded text-gray-700 flex-1"
              >
                <option>Date Range</option>
              </select>
              <button
                onClick={() => alert("Custom filter opened")}
                className="px-2 py-1 border border-gray-300 rounded text-gray-700 text-xs"
              >
                Custo
              </button>
            </div>
          </div>

          {/* Receipt List */}
          <div className="flex-1 overflow-y-auto">
            {filteredReceipts.map((receipt) => (
              <div
                key={receipt.id}
                className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedReceipt?.id === receipt.id && !isMultiSelectMode
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                } ${selectedReceipts.includes(receipt.id) ? "bg-blue-50" : ""}`}
              >
                <div className="flex items-start gap-2">
                  {isMultiSelectMode && (
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 mt-1"
                      checked={selectedReceipts.includes(receipt.id)}
                      onChange={() => toggleSelectReceipt(receipt.id)}
                    />
                  )}
                  <div
                    className="flex-1"
                    onClick={() => {
                      if (!isMultiSelectMode) {
                        setSelectedReceipt(receipt);
                      } else {
                        toggleSelectReceipt(receipt.id);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-sm font-medium text-gray-900">
                        {receipt.receiptNumber}
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(receipt.status)}`}
                      >
                        {receipt.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">hdjjdj</span>
                      <span className="text-xs text-gray-500">
                        {receipt.date}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className="text-sm font-semibold text-gray-900">
                        ${receipt.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleCreate}
              className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 mx-auto"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Summary */}
          <div className="p-4 border-t border-gray-200 text-center">
            <div className="text-xl font-semibold text-gray-900">$80.00</div>
            <div className="text-xs text-gray-500">1 Proforma Invoices</div>
          </div>
        </div>

        {/* Right Content - Receipt Details or Selection Summary */}
        <div className="flex-1 overflow-y-auto p-6">
          {isMultiSelectMode && selectedReceipts.length > 0 ? (
            // Selection Summary
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedReceipts.length} Sales received selected
                </h3>
                <div className="text-sm text-gray-600 mb-1">Total</div>
                <div className="text-2xl font-bold text-gray-900">
                  ${selectedTotal.toLocaleString()}
                </div>
              </div>
            </div>
          ) : (
            // Receipt Details
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Receipt Header Info - 3 columns */}
              <div className="grid grid-cols-3 gap-4 mb-6 pb-4 border-b border-gray-200">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Receipt #
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedReceipt.receiptNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    ${selectedReceipt.amount}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Sales Receipt date
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedReceipt.receiptDate}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Payment Type
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedReceipt.paymentType}
                  </p>
                </div>
              </div>

              {/* Billing Address */}
              <div className="mb-6">
                <label className="text-xs text-gray-500 block mb-2">
                  Billing Address
                </label>
                <p className="text-sm text-gray-900">
                  {selectedReceipt.billingAddress}
                </p>
                <p className="text-sm text-gray-900">
                  {selectedReceipt.billingCity}
                </p>
              </div>

              {/* Sub Title & Shipping Method */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Sub Title
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedReceipt.subTitle}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Shipping Method
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedReceipt.shippingMethod}
                  </p>
                </div>
              </div>

              {/* Items Table with Totals on Right */}
              <div className="flex gap-6 mb-6">
                <div className="flex-1">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">
                          Sr.No
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">
                          Items
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">
                          Rate
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">
                          Quantity
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">
                          Tax
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">
                          Discount
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReceipt.items.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="px-2 py-3 text-gray-900">
                            {item.srNo}
                          </td>
                          <td className="px-2 py-3 text-gray-900">
                            {item.item}
                          </td>
                          <td className="px-2 py-3 text-gray-900">
                            ${item.rate.toFixed(2)}
                          </td>
                          <td className="px-2 py-3 text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-2 py-3 text-gray-900">
                            {item.tax}
                          </td>
                          <td className="px-2 py-3 text-gray-900">
                            {item.discount}%
                          </td>
                          <td className="px-2 py-3 text-gray-900">
                            ${item.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals on Right */}
                <div className="w-64 flex-shrink-0">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sub Total</span>
                      <span className="text-blue-600">
                        ${selectedReceipt.subTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping Cost</span>
                      <span className="text-blue-600">
                        ${selectedReceipt.shippingCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Sales Tax 4% on 80.00
                      </span>
                      <span className="text-blue-600">
                        ${selectedReceipt.salesTax.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold border-t border-gray-200 pt-2 mt-2">
                      <span className="text-gray-900">Total</span>
                      <span className="text-blue-600">
                        ${selectedReceipt.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions and Notes */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Terms & Conditions
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedReceipt.termsAndConditions || "—"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Notes
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedReceipt.notes || "—"}
                  </p>
                </div>
              </div>

              {/* Internal Notes & Upload */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Internal Notes
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedReceipt.internalNotes || "—"}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => alert("Upload Computer clicked")}
                    className="w-full py-8 border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:border-gray-400 hover:text-gray-500 flex flex-col items-center justify-center gap-2 transition-colors"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-sm">Upload Computer</span>
                  </button>
                </div>
              </div>

              {/* Customer Signature Section */}
              <div>
                <label className="text-xs text-gray-500 block mb-2">
                  Customer Signature
                </label>
                <button
                  onClick={() => setShowSignatureModal(true)}
                  className="w-full py-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Customer Signature
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Multi-Select Button (floating) */}
      <button
        onClick={() => {
          setIsMultiSelectMode(!isMultiSelectMode);
          setSelectedReceipts([]);
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 shadow-lg z-40"
        title={isMultiSelectMode ? "Exit Multi-Select" : "Enable Multi-Select"}
      >
        {isMultiSelectMode ? (
          <X className="w-6 h-6" />
        ) : (
          <Check className="w-6 h-6" />
        )}
      </button>

      {/* Create/Edit Sales Receipt Modal */}
      {(showEditModal || showCreateModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {showEditModal
                  ? "Edit sales Receipts"
                  : "Create sales Receipts"}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setShowCreateModal(false);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                  Save as Draft
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save & Save
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) =>
                      handleInputChange("customerName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>Default Taxes (Service)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sales Receipts #
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>Default Taxes (Product)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <input
                    type="text"
                    placeholder="$"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>Default Company</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Type
                  </label>
                  <input
                    type="text"
                    placeholder="$0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Method
                  </label>
                  <input
                    type="text"
                    placeholder="24"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sales Receipts Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="24"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">
                        Sr. No.
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">
                        Items
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">
                        Quantity
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">
                        Rate
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">
                        Tax
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">
                        Discount
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-2 py-3">01</td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2">
                          <span>Electronics</span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-xs text-gray-500">Description</div>
                      </td>
                      <td className="px-2 py-3">23</td>
                      <td className="px-2 py-3">$40000</td>
                      <td className="px-2 py-3">
                        <select className="border border-gray-300 rounded px-2 py-1 text-xs">
                          <option>Tax</option>
                        </select>
                      </td>
                      <td className="px-2 py-3">2%</td>
                      <td className="px-2 py-3 flex items-center gap-2">
                        <span>$32000</span>
                        <button className="text-green-600 hover:text-green-700">
                          <Plus className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex gap-3 mb-6">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Services
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terms & Conditions
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sub Total</span>
                      <span className="text-blue-600">$80.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping Cost</span>
                      <span className="text-blue-600">$3.20</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Sales Tax 4% on 80.00
                      </span>
                      <span className="text-blue-600">$10.00</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold border-t pt-2">
                      <span className="text-gray-900">Total</span>
                      <span className="text-blue-600">$93.20</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Internal Notes
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <button className="w-full py-8 border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:border-gray-400 flex flex-col items-center justify-center gap-2">
                    <Plus className="w-6 h-6" />
                    <span className="text-sm">Upload Computer</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Signature
                </label>
                <button
                  onClick={() => setShowSignatureModal(true)}
                  className="w-full py-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Customer Signature
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Signature Modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Customer Signature
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSignatureModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Done
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={signatureTitle}
                    onChange={(e) => setSignatureTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={signatureDate}
                      onChange={(e) => setSignatureDate(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" className="rounded border-gray-300" />
                  Receiver's Signature
                </label>
              </div>

              <div className="border-2 border-gray-300 rounded-md h-40 mb-4 bg-gray-50"></div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-6 h-6 bg-black rounded"></div>
                  <span className="text-sm text-gray-700">Thickness</span>
                </div>
                <input type="range" min="1" max="10" className="flex-1" />
                <button className="text-gray-400 hover:text-gray-600">
                  <Upload className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Preview Modal */}
      {showReceiptPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowReceiptPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-lg font-semibold text-gray-900">
                  Sales receipt #
                  {selectedReceipt.receiptNumber.replace("#", "")}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-md">
                  <Columns className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-md">
                  <Send className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-md">
                  <Upload className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
              <div
                className="bg-white shadow-lg mx-auto"
                style={{ width: "595px", minHeight: "842px" }}
              >
                <div className="relative">
                  <div className="absolute top-0 left-0 w-0 h-0 border-t-[60px] border-t-black border-r-[60px] border-r-transparent"></div>
                </div>

                <div className="px-12 pt-16 pb-8">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        INVOICE
                      </h1>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <span className="font-semibold">Invoice #:</span>{" "}
                          {selectedReceipt.receiptNumber}
                        </p>
                        <p>
                          <span className="font-semibold">Date:</span>{" "}
                          {new Date().toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-semibold">Outstanding:</span> $
                          {selectedReceipt.due.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-xs font-bold text-gray-700 mb-2">
                        Info.
                      </h3>
                      <div className="text-sm text-gray-900">
                        <p className="font-semibold">Your Company Name</p>
                        <p>123 Business Street</p>
                        <p>City, State ZIP</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-700 mb-2">
                        Receipt To.
                      </h3>
                      <div className="text-sm text-gray-900">
                        <p className="font-semibold">
                          {selectedReceipt.customerName}
                        </p>
                        <p>{selectedReceipt.customerSubtitle}</p>
                        <p>{selectedReceipt.billingAddress}</p>
                      </div>
                    </div>
                  </div>

                  <table className="w-full text-sm border-collapse mb-8">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="text-left py-2 px-3 text-xs"># Items</th>
                        <th className="text-left py-2 px-3 text-xs">
                          Quantity
                        </th>
                        <th className="text-right py-2 px-3 text-xs">
                          Unit Price
                        </th>
                        <th className="text-right py-2 px-3 text-xs">Tax</th>
                        <th className="text-right py-2 px-3 text-xs">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReceipt.items.map((item, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="py-3 px-3">
                            <div className="font-semibold">
                              {idx + 1} {item.item}
                            </div>
                          </td>
                          <td className="py-3 px-3">{item.quantity}</td>
                          <td className="py-3 px-3 text-right">
                            ${item.rate.toFixed(2)}
                          </td>
                          <td className="py-3 px-3 text-right">{item.tax}%</td>
                          <td className="py-3 px-3 text-right">
                            ${item.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-end mb-8">
                    <div className="w-64">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Sub Total</span>
                          <span className="font-semibold">
                            ${selectedReceipt.subTotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="font-bold">Receipt Total</span>
                          <span className="font-bold">
                            ${selectedReceipt.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-xs font-bold mb-2">
                      Terms & Conditions
                    </h3>
                    <p className="text-xs text-gray-600">
                      {selectedReceipt.termsAndConditions ||
                        "Payment is due within 30 days."}
                    </p>
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
