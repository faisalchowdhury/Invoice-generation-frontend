/**
 * File: src/pages/PaymentMade.tsx
 * Complete Payment Made (Expenses) page with all features
 */

import React, { useState } from "react";
import {
  Search,
  MoreVertical,
  Plus,
  Edit2,
  X,
  Download,
  Eye,
  Wallet,
  Edit,
  Printer,
  Send,
  FileText,
} from "lucide-react";

interface Payment {
  id: string;
  number: string;
  vendor: string;
  paymentDate: string;
  paymentType: string;
  amount: string;
  date: string;
  notes: string;
  internalNotes: string;
}

export const PaymentMade: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "1",
      number: "2332",
      vendor: "Footwear",
      paymentDate: "26 May,26",
      paymentType: "Mastercard",
      amount: "$5000",
      date: "23 4:25 PM",
      notes: "",
      internalNotes: "",
    },
    {
      id: "2",
      number: "2333",
      vendor: "Ritat",
      paymentDate: "23 4:25 PM",
      paymentType: "Mastercard",
      amount: "$5000",
      date: "23 4:25 PM",
      notes: "",
      internalNotes: "",
    },
    {
      id: "3",
      number: "2334",
      vendor: "Ritat",
      paymentDate: "23 4:25 PM",
      paymentType: "Mastercard",
      amount: "$5000",
      date: "23 4:25 PM",
      notes: "",
      internalNotes: "",
    },
    {
      id: "4",
      number: "2335",
      vendor: "Ritat",
      paymentDate: "23 4:25 PM",
      paymentType: "Mastercard",
      amount: "$5000",
      date: "23 4:25 PM",
      notes: "",
      internalNotes: "",
    },
    {
      id: "5",
      number: "2336",
      vendor: "Ritat",
      paymentDate: "23 4:25 PM",
      paymentType: "Mastercard",
      amount: "$5000",
      date: "23 4:25 PM",
      notes: "",
      internalNotes: "",
    },
  ]);

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);

  // Empty state
  if (payments.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-[#FAFBFC]">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-lg flex items-center justify-center">
            <Wallet className="w-16 h-16 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Add Payment or Pay Online
          </h2>
          <p className="text-gray-600 mb-6">
            Setup a payment gateway and send payment a link
            <br />
            to your client.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-[#FAFBFC]">
      {/* Left Panel - Payment List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Payment Made
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
              <option>Amount</option>
            </select>
            <select className="px-2 py-1 border border-gray-200 rounded text-gray-700">
              <option>Status</option>
              <option>All</option>
            </select>
            <select className="px-2 py-1 border border-gray-200 rounded text-gray-700">
              <option>Customer / All</option>
            </select>
          </div>
        </div>

        {/* Payment List */}
        <div className="flex-1 overflow-y-auto">
          {payments.map((payment) => (
            <div
              key={payment.id}
              onClick={() => setSelectedPayment(payment)}
              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedPayment?.id === payment.id ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {payment.vendor}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {payment.amount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">#{payment.id}</span>
                <span className="text-xs text-gray-400">{payment.date}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {payment.paymentType}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-center">
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {payments.length > 0 && (
          <div className="p-4 border-t border-gray-200 text-center">
            <div className="text-lg font-semibold text-gray-900">$80.00</div>
            <div className="text-xs text-gray-500">1 Proforma Invoices</div>
          </div>
        )}
      </div>

      {/* Right Panel - Payment Details/Form */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedPayment || showCreateForm ? (
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
                      ? "Add Payment"
                      : `Payment Made - ${selectedPayment?.vendor}`}
                  </h2>
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
                          alert("Payment saved!");
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
                        onClick={() => alert("Plus")}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => alert("Filter")}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <FileText className="w-4 h-4 text-gray-600" />
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
                        <FileText className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => alert("View")}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => alert("Print")}
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
                          <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                              WhatsApp
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50">
                              Trash
                            </button>
                          </div>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {selectedPayment && !showCreateForm && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">#1</div>
                    <div className="text-sm font-medium">
                      ${selectedPayment.number}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Payment Date</div>
                    <div className="text-sm font-medium">
                      {selectedPayment.paymentDate}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Payment Type</div>
                    <div className="text-sm font-medium">
                      {selectedPayment.paymentType}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                {/* Form Fields */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Payment # *
                    </label>
                    <input
                      type="text"
                      placeholder="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      defaultValue={
                        showCreateForm ? "2" : selectedPayment?.number
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Vendor
                    </label>
                    <input
                      type="text"
                      placeholder="Customer Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      defaultValue={selectedPayment?.vendor}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Payment Date *
                      </label>
                      <input
                        type="text"
                        placeholder="3/11/2026"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Type *
                      </label>
                      <input
                        type="text"
                        placeholder="Master Card"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">$0.00 Due</div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Amount
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <select className="px-3 py-2 border border-gray-300 rounded-md">
                        <option>Full payment</option>
                        <option>Partial payment</option>
                      </select>
                      <input
                        type="text"
                        placeholder="$0.00"
                        className="px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Internal Notes
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Attachments */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-4">
                    Attachments
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => alert("Upload Computer")}
                      className="px-4 py-8 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 flex flex-col items-center justify-center"
                    >
                      <Plus className="w-5 h-5 mb-2" />
                      Upload Computer
                    </button>
                    <button
                      onClick={() => alert("Upload Document")}
                      className="px-4 py-8 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 flex flex-col items-center justify-center"
                    >
                      <Plus className="w-5 h-5 mb-2" />
                      Upload Computer
                    </button>
                  </div>
                </div>

                {/* Invoices */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-900">
                      I Invoices
                    </label>
                    <button className="text-blue-600 hover:text-blue-700">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-md p-4 text-center text-sm text-gray-500">
                    No invoices linked
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a payment to view details</p>
          </div>
        )}
      </div>

      {/* Bill Preview Modal */}
      {showBillPreview && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowBillPreview(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Bills #1</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded">
                  <FileText className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => setShowBillPreview(false)}
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
    </div>
  );
};
