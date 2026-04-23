/**
 * File: src/pages/PurchaseOrder.tsx
 * Complete Purchase Order page with all features
 */

import React, { useState } from "react";
import {
  Search,
  MoreVertical,
  Plus,
  Edit2,
  X,
  Trash2,
  Check,
  Download,
  Eye,
  Send,
  Printer,
  MessageSquare,
  TrendingUp,
  Edit,
} from "lucide-react";

interface PurchaseOrder {
  id: string;
  number: string;
  vendor: string;
  vendorContact: string;
  status: "draft" | "approved" | "cancelled" | "not_billed";
  amount: string;
  date: string;
  items: LineItem[];
  billAddress: string;
  shippingMethod: string;
  subTitle: string;
}

interface LineItem {
  id: string;
  srNo: number;
  name: string;
  description: string;
  quantity: number;
  rate: number;
  tax: number;
  discount: number;
  amount: number;
}

export const PurchaseOrder: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([
    {
      id: "1",
      number: "1111",
      vendor: "Spark Tech Agency",
      vendorContact: "Mahmudul Hasan",
      status: "not_billed",
      amount: "$5000",
      date: "23 4:25 PM",
      billAddress: "Santa, santa Bankok, 122 Bangladesh",
      shippingMethod: "Priority Shipping",
      subTitle: "fdfdfdfd",
      items: [
        {
          id: "1",
          srNo: 1,
          name: "Electronics",
          description: "",
          quantity: 24,
          rate: 400,
          tax: 1,
          discount: -2,
          amount: 392,
        },
        {
          id: "2",
          srNo: 1,
          name: "Electronics",
          description: "",
          quantity: 24,
          rate: 400,
          tax: 1,
          discount: -2,
          amount: 392,
        },
        {
          id: "3",
          srNo: 1,
          name: "Electronics",
          description: "",
          quantity: 24,
          rate: 400,
          tax: 1,
          discount: -2,
          amount: 392,
        },
      ],
    },
    {
      id: "2",
      number: "1112",
      vendor: "Ritat",
      vendorContact: "",
      status: "draft",
      amount: "$5000",
      date: "23 4:25 PM",
      billAddress: "",
      shippingMethod: "",
      subTitle: "",
      items: [],
    },
    {
      id: "3",
      number: "1113",
      vendor: "Ritat",
      vendorContact: "",
      status: "approved",
      amount: "$5000",
      date: "23 4:25 PM",
      billAddress: "",
      shippingMethod: "",
      subTitle: "",
      items: [],
    },
    {
      id: "4",
      number: "1114",
      vendor: "Ritat",
      vendorContact: "",
      status: "approved",
      amount: "$5000",
      date: "23 4:25 PM",
      billAddress: "",
      shippingMethod: "",
      subTitle: "",
      items: [],
    },
    {
      id: "5",
      number: "1115",
      vendor: "Ritat",
      vendorContact: "",
      status: "cancelled",
      amount: "$5000",
      date: "23 4:25 PM",
      billAddress: "",
      shippingMethod: "",
      subTitle: "",
      items: [],
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(
    null,
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showDeliveryChallan, setShowDeliveryChallan] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showMarkAsMenu, setShowMarkAsMenu] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [printCopyType, setPrintCopyType] = useState<
    "single" | "double" | "triple"
  >("single");

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-[#FAFBFC]">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <div className="relative">
              <div className="text-5xl text-blue-600">$</div>
              <div className="absolute -right-2 -bottom-1">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Add a New Purchase Order
          </h2>
          <p className="text-gray-600 mb-6">
            Enter the correct vendor details, including price and
            <br />
            shipping, for issuing a P.O.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create a purchase Order
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
      case "not_billed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "not_billed":
        return "Not Billed";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  };

  const calculateTotal = () => {
    return selectedOrders.reduce((total, orderId) => {
      const order = orders.find((o) => o.id === orderId);
      return total + (order ? parseFloat(order.amount.replace("$", "")) : 0);
    }, 0);
  };

  return (
    <div className="h-full flex bg-[#FAFBFC]">
      {/* Left Panel - Purchase Order List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Purchase Order
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert("Search")}
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
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="text-gray-600">Sort by</span>
            <select className="px-2 py-1 border border-gray-200 rounded text-gray-700">
              <option>Date</option>
              <option>Name</option>
            </select>
            <select className="px-2 py-1 border border-gray-200 rounded text-gray-700">
              <option>Status</option>
              <option>All</option>
            </select>
            <select className="px-2 py-1 border border-gray-200 rounded text-gray-700">
              <option>Customer / All</option>
            </select>
            <button
              onClick={() => setIsSelectionMode(!isSelectionMode)}
              className="px-2 py-1 text-blue-600 hover:text-blue-700"
            >
              {isSelectionMode ? "Cancel" : "Select"}
            </button>
          </div>
        </div>

        {/* Order List */}
        <div className="flex-1 overflow-y-auto">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => !isSelectionMode && setSelectedOrder(order)}
              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedOrder?.id === order.id && !isSelectionMode
                  ? "bg-blue-50"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {isSelectionMode && (
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => toggleOrderSelection(order.id)}
                    className="mt-1"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {order.vendor}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${getStatusColor(order.status)}`}
                      ></span>
                      <span className="text-xs text-gray-500 capitalize">
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {order.amount}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">#{order.id}</span>
                    <span className="text-xs text-gray-400">{order.date}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">hdjfkj</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {isSelectionMode && selectedOrders.length > 0 ? (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="text-center mb-2">
              <div className="text-lg font-semibold text-gray-900">
                {selectedOrders.length} Purchase Order Selected
              </div>
              <div className="text-sm text-gray-600">
                Total{" "}
                <span className="font-medium">
                  ${calculateTotal().toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-t border-gray-200 flex justify-center">
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        )}

        {orders.length > 0 && (
          <div className="p-4 border-t border-gray-200 text-center">
            <div className="text-lg font-semibold text-gray-900">$80.00</div>
            <div className="text-xs text-gray-500">1 Proforma invoices</div>
          </div>
        )}
      </div>

      {/* Right Panel - Order Details/Form */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedOrder || showCreateForm ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Summary</span>
                <select className="px-3 py-1 border border-gray-200 rounded text-sm">
                  <option>This Year</option>
                  <option>This Month</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {showCreateForm
                      ? "New Purchase Order"
                      : selectedOrder?.vendor}
                  </h2>
                  {selectedOrder && (
                    <span className="text-sm text-gray-500">
                      {selectedOrder.vendorContact}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {showCreateForm ? (
                    <>
                      <button
                        onClick={() => setShowCreateForm(false)}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          alert("Purchase Order saved!");
                          setShowCreateForm(false);
                        }}
                        className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => alert("Add note")}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => alert("Filter")}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <TrendingUp className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => setShowCreateForm(true)}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => alert("Chart")}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <TrendingUp className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => alert("View")}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => setShowPrintDialog(true)}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Printer className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => alert("Email")}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Send className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        className="p-2 hover:bg-gray-100 rounded relative"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                        {showMoreMenu && (
                          <div className="absolute right-0 top-10 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                              WhatsApp
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                              Convert to Bill
                            </button>
                            <button
                              onClick={() => setShowMarkAsMenu(!showMarkAsMenu)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                            >
                              Mark As
                              <span>›</span>
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                              Signature Request
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                              Activity Request
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50">
                              Trash
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                              Cancelled
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                              Closed
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                              Received
                            </button>
                          </div>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {selectedOrder && !showCreateForm && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">
                      #{selectedOrder.number}
                    </div>
                    <div className="text-sm font-medium">
                      ${selectedOrder.number}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">
                      Purchase Order date
                    </div>
                    <div className="text-sm font-medium">26 May,26</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Bill Status</div>
                    <div
                      className={`text-sm font-medium ${
                        selectedOrder.status === "not_billed"
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      {getStatusText(selectedOrder.status)}
                      {selectedOrder.status === "draft" && (
                        <span className="ml-2 px-2 py-0.5 bg-gray-200 text-xs rounded">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                {/* Form Fields */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Vendor
                    </label>
                    <input
                      type="text"
                      placeholder="Spark Tech Agency"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      defaultValue={selectedOrder?.vendor}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Address
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option>Default Taxes (Service)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      PO #
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option>Default Taxes (Product)</option>
                    </select>
                  </div>
                </div>

                {selectedOrder && !showCreateForm && (
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Billing Address
                      </div>
                      <div className="text-sm text-gray-900">
                        {selectedOrder.billAddress}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Sub Title
                      </div>
                      <div className="text-sm text-gray-900 mb-4">
                        {selectedOrder.subTitle}
                      </div>
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Shipping Method
                      </div>
                      <div className="text-sm text-gray-900">
                        {selectedOrder.shippingMethod}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Billable
                    </label>
                    <input
                      type="text"
                      placeholder="Default Company"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Shipping Method
                    </label>
                    <input
                      type="text"
                      placeholder="Paypal"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Currency
                    </label>
                    <input
                      type="text"
                      placeholder="$"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-2">
                    Purchase Order Date
                  </label>
                  <input
                    type="text"
                    placeholder="24/3/26"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="mb-6">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm text-gray-700">
                      Discount Before Tax
                    </span>
                  </label>
                </div>

                {/* Items Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                          Sr. No.
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                          Items
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                          Rate
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                          Tax
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                          Discount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(
                        selectedOrder?.items || [
                          {
                            id: "1",
                            srNo: 1,
                            name: "Electronics",
                            description: "Description",
                            quantity: 23,
                            rate: 40000,
                            tax: 1,
                            discount: 2,
                            amount: 32000,
                          },
                        ]
                      ).map((item, index) => (
                        <tr key={item.id} className="border-t border-gray-100">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {String(index + 1).padStart(2, "0")}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {item.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {item.description}
                                </div>
                              </div>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Edit2 className="w-3 h-3 text-gray-600" />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            ${item.rate.toFixed(2)}
                          </td>
                          <td className="px-4 py-3">
                            <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                              <option>Tax</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {item.discount}%
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">
                                ${item.amount.toFixed(2)}
                              </span>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Plus className="w-3 h-3 text-gray-600" />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Trash2 className="w-3 h-3 text-gray-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => alert("Add Product")}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Product
                  </button>
                  <button
                    onClick={() => alert("Add Services")}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Services
                  </button>
                </div>

                {/* Terms, Notes, and Totals */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Terms & Conditions
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Notes
                    </label>
                    <div className="space-y-4">
                      <textarea
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <button className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 inline-flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" />
                        Upload Computer
                      </button>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="flex justify-end mb-6">
                  <div className="w-64 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-600">Sub Total</span>
                      <span className="text-gray-900">$80.00</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-600">Shipping Cost</span>
                      <span className="text-gray-900">$3.20</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-600">
                        Sales Tax 4% on 80.00
                      </span>
                      <span className="text-gray-900">$10.00</span>
                    </div>
                    <div className="flex items-center justify-between text-base font-semibold border-t border-gray-200 pt-2">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">$93.20</span>
                    </div>
                  </div>
                </div>

                {/* Internal Notes */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-700 mb-2">
                    Internal Notes
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* Customer Signature */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Customer Signature
                  </label>
                  <button
                    onClick={() => setShowSignatureModal(true)}
                    className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Customer Signature
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">
              Select a purchase order to view details
            </p>
          </div>
        )}
      </div>

      {/* Print Dialog Modal */}
      {showPrintDialog && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPrintDialog(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Print Options
            </h2>

            <div className="space-y-3 mb-6">
              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600">
                <input
                  type="radio"
                  name="printCopy"
                  value="single"
                  checked={printCopyType === "single"}
                  onChange={() => setPrintCopyType("single")}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">Single Copy</div>
                  <div className="text-sm text-gray-500">
                    Print 1 copy with no extra
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600">
                <input
                  type="radio"
                  name="printCopy"
                  value="double"
                  checked={printCopyType === "double"}
                  onChange={() => setPrintCopyType("double")}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">Double Copy</div>
                  <div className="text-sm text-gray-500">
                    Print 2 copies, 1 original + 1 copy
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600">
                <input
                  type="radio"
                  name="printCopy"
                  value="triple"
                  checked={printCopyType === "triple"}
                  onChange={() => setPrintCopyType("triple")}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900">Triple Copy</div>
                  <div className="text-sm text-gray-500">
                    Print 3 copies, 1 original + 2 copies
                  </div>
                </div>
              </label>
            </div>

            <button
              onClick={() => {
                alert(`Printing ${printCopyType} copy...`);
                setShowPrintDialog(false);
              }}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Print
            </button>
          </div>
        </div>
      )}

      {/* Delivery Challan Modal */}
      {showDeliveryChallan && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeliveryChallan(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Delivery challan #1
              </h2>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded">
                  <TrendingUp className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => setShowDeliveryChallan(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="border border-gray-200 rounded-lg p-8 bg-white">
                <div className="text-center text-gray-600">
                  [Invoice Preview Document]
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Signature Modal */}
      {showSignatureModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSignatureModal(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Customer Signature
            </h2>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Mahmudul Hasan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Master Card"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Date</label>
                <input
                  type="text"
                  placeholder="3/11/2026"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span className="text-sm text-gray-700">
                    Receiver's Signature
                  </span>
                </label>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-700">Thickness</label>
                  <button
                    onClick={() => alert("Signature cleared")}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear
                  </button>
                </div>
                <input type="range" min="1" max="10" className="w-full" />
              </div>

              <div className="border-2 border-gray-300 rounded-lg h-64 bg-gray-50 flex items-center justify-center">
                <span className="text-gray-400">Signature drawing area</span>
              </div>

              <div className="text-center text-sm text-gray-600">
                Customer Signature
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowSignatureModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Signature saved!");
                  setShowSignatureModal(false);
                }}
                className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
