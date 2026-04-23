/**
 * File: src/pages/sales/PaymentReceived.tsx
 * Complete Payment Received page - 100% exact design
 * Features: Sales Receipts section, Add/Edit Payment modals, Multi-select
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

interface PaymentReceived {
  id: string;
  paymentNumber: string;
  customerName: string;
  customerSubtitle: string;
  status: "Draft" | "Approved" | "Cancelled";
  amount: number;
  paymentDate: string;
  paymentType: string;
  totalAmount: string;
  date: string;
  salesReceiptNumber: string;
  salesReceiptAmount: string;
  notes: string;
  internalNote: string;
  paid: number;
  due: number;
}

const samplePayments: PaymentReceived[] = [
  {
    id: "1",
    paymentNumber: "#1111",
    customerName: "Spark Tech Agency",
    customerSubtitle: "Mahmudul Hasan",
    status: "Draft",
    amount: 5000,
    paymentDate: "Mar 10,2026",
    paymentType: "Master Card",
    totalAmount: "$56,4343",
    date: "23 Jul 24 PM",
    salesReceiptNumber: "#1111",
    salesReceiptAmount: "$56,4343",
    notes: "No Notes",
    internalNote: "Internal Note",
    paid: 0,
    due: 15444,
  },
];

export const PaymentReceived: React.FC = () => {
  const [payments, setPayments] = useState<PaymentReceived[]>(samplePayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentReceived | null>(samplePayments[0]);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    paymentNumber: "2",
    customer: "Customer Name",
    paymentDate: "3/11/2026",
    type: "Master Card",
    amount: "0.00",
    fullPayment: true,
    notes: "",
    internalNotes: "",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setShowAddModal(false);
    setShowEditModal(false);
  };

  const handleEdit = () => {
    if (selectedPayment) {
      setFormData({
        paymentNumber: selectedPayment.paymentNumber.replace("#", ""),
        customer: selectedPayment.customerName,
        paymentDate: selectedPayment.paymentDate,
        type: selectedPayment.paymentType,
        amount: "0.00",
        fullPayment: true,
        notes: selectedPayment.notes,
        internalNotes: "",
      });
      setShowEditModal(true);
    }
  };

  const toggleSelectPayment = (id: string) => {
    setSelectedPayments((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id],
    );
  };

  const filteredPayments = payments.filter((payment) =>
    payment.paymentNumber.toLowerCase().includes(searchQuery.toLowerCase()),
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

  // Calculate total of selected payments
  const selectedTotal = payments
    .filter((p) => selectedPayments.includes(p.id))
    .reduce((sum, p) => sum + p.due, 0);

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

      {/* Payment Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Payment Received
            </h2>
            {selectedPayment && !isMultiSelectMode && (
              <>
                <h3 className="text-lg font-medium text-gray-700">
                  {selectedPayment.customerName}
                </h3>
                <span className="text-sm text-gray-500">
                  {selectedPayment.customerSubtitle}
                </span>
              </>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 relative">
            {isMultiSelectMode ? (
              <>
                <button
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5 text-gray-600" />
                </button>
                <button
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
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="Email"
                >
                  <Mail className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="View"
                >
                  <Eye className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="Check"
                >
                  <Check className="w-5 h-5 text-gray-600" />
                </button>
              </>
            ) : (
              <>
                <button
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="Favorite"
                >
                  <CheckCircle className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="Columns"
                >
                  <Columns className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={handleEdit}
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="Edit"
                >
                  <Edit className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="View"
                >
                  <Eye className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="Print"
                >
                  <Printer className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="Email"
                >
                  <Mail className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="p-2 hover:bg-gray-100 rounded-md"
                  title="More"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </>
            )}

            {/* More Menu Dropdown */}
            {showMoreMenu && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
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
        {/* Left Sidebar - Payment List */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {isMultiSelectMode && (
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={selectedPayments.length === payments.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPayments(payments.map((p) => p.id));
                    } else {
                      setSelectedPayments([]);
                    }
                  }}
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All
                </span>
              </label>
            </div>
          )}

          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-xs mb-2">
              <span className="text-gray-600">Sort by:</span>
              <select className="px-2 py-1 border border-gray-300 rounded text-gray-700">
                <option>Date</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <select className="px-2 py-1 border border-gray-300 rounded text-gray-700 flex-1">
                <option>Status</option>
              </select>
              <select className="px-2 py-1 border border-gray-300 rounded text-gray-700 flex-1">
                <option>Customer: All</option>
              </select>
              <select className="px-2 py-1 border border-gray-300 rounded text-gray-700 flex-1">
                <option>Date</option>
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className={`p-3 border-b border-gray-100 cursor-pointer ${
                  selectedPayment?.id === payment.id && !isMultiSelectMode
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                } ${selectedPayments.includes(payment.id) ? "bg-blue-50" : ""}`}
              >
                <div className="flex items-start gap-2">
                  {isMultiSelectMode && (
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 mt-1"
                      checked={selectedPayments.includes(payment.id)}
                      onChange={() => toggleSelectPayment(payment.id)}
                    />
                  )}
                  <div
                    className="flex-1"
                    onClick={() => {
                      if (!isMultiSelectMode) {
                        setSelectedPayment(payment);
                      } else {
                        toggleSelectPayment(payment.id);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.paymentNumber}
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(payment.status)}`}
                      >
                        {payment.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">hdjjdj</span>
                      <span className="text-xs text-gray-500">
                        {payment.date}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className="text-sm font-semibold text-gray-900">
                        ${payment.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setShowAddModal(true)}
              className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 mx-auto"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 border-t border-gray-200 text-center">
            <div className="text-xl font-semibold text-gray-900">$80.00</div>
            <div className="text-xs text-gray-500">1 Delivery Challan</div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isMultiSelectMode && selectedPayments.length > 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedPayments.length} payment Received
                </h3>
                <div className="text-sm text-gray-600 mb-1">Total</div>
                <div className="text-2xl font-bold text-gray-900">
                  ${selectedTotal.toLocaleString()}
                </div>
              </div>
            </div>
          ) : selectedPayment ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Three column header */}
              <div className="grid grid-cols-3 gap-4 mb-6 pb-4 border-b border-gray-200">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    {selectedPayment.paymentNumber}
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPayment.totalAmount}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Payment date
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedPayment.paymentDate}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Payment Type
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedPayment.paymentType}
                  </p>
                </div>
              </div>

              {/* Sales Receipts Section */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Sales Receipts
                </label>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-900">
                    {selectedPayment.salesReceiptNumber}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {selectedPayment.salesReceiptAmount}
                  </span>
                </div>
              </div>

              {/* Notes Section */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Notes
                </label>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      {selectedPayment.internalNote}
                    </label>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="text-sm text-gray-900">
                      {selectedPayment.notes}
                    </p>
                  </div>
                </div>
              </div>

              {/* Attachments Section */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Attachments
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button className="py-8 border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:border-gray-400 flex flex-col items-center justify-center gap-2">
                    <Plus className="w-6 h-6" />
                    <span className="text-sm">Upload Computer</span>
                  </button>
                  <button className="py-8 border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:border-gray-400 flex flex-col items-center justify-center gap-2">
                    <Plus className="w-6 h-6" />
                    <span className="text-sm">Upload Computer</span>
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Toggle Multi-Select Button */}
      {selectedPayment && (
        <button
          onClick={() => {
            setIsMultiSelectMode(!isMultiSelectMode);
            setSelectedPayments([]);
          }}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 shadow-lg z-40"
        >
          {isMultiSelectMode ? (
            <X className="w-6 h-6" />
          ) : (
            <Check className="w-6 h-6" />
          )}
        </button>
      )}

      {/* Add/Edit Payment Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {showAddModal ? "Add Payment" : "Edit  Payment"}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
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

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment# *
                </label>
                <input
                  type="text"
                  value={formData.paymentNumber}
                  onChange={(e) =>
                    handleInputChange("paymentNumber", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer
                </label>
                <input
                  type="text"
                  value={formData.customer}
                  onChange={(e) =>
                    handleInputChange("customer", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Date *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.paymentDate}
                      onChange={(e) =>
                        handleInputChange("paymentDate", e.target.value)
                      }
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Amount
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      handleInputChange("fullPayment", !formData.fullPayment)
                    }
                    className={`px-4 py-2 border rounded-md ${
                      formData.fullPayment
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    Full payment
                  </button>
                  <input
                    type="text"
                    value={`$${formData.amount}`}
                    onChange={(e) =>
                      handleInputChange(
                        "amount",
                        e.target.value.replace("$", ""),
                      )
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <span className="text-sm text-gray-500">$0.00 Due</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Internal Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.internalNotes}
                  onChange={(e) =>
                    handleInputChange("internalNotes", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachment
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button className="py-8 border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:border-gray-400 flex flex-col items-center justify-center gap-2">
                    <Plus className="w-6 h-6" />
                    <span className="text-sm">Upload Computer</span>
                  </button>
                  <button className="py-8 border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:border-gray-400 flex flex-col items-center justify-center gap-2">
                    <Plus className="w-6 h-6" />
                    <span className="text-sm">Upload Document</span>
                  </button>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Invoices
                  </label>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
