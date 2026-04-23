/**
 * File: src/pages/DebitNotes.tsx
 * Complete Debit Notes page with all features
 */

import React, { useState } from "react";
import {
  Search,
  MoreVertical,
  Plus,
  Edit2,
  X,
  Trash2,
  FileText,
  Download,
  Eye,
  Send,
  Printer,
  Edit,
  Wallet,
} from "lucide-react";

interface DebitNote {
  id: string;
  number: string;
  vendor: string;
  vendorContact: string;
  status: "unpaid" | "paid" | "cancelled";
  amount: string;
  date: string;
  debitNoteDate: string;
  items: LineItem[];
  billAddress: string;
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

export const DebitNotes: React.FC = () => {
  const [debitNotes, setDebitNotes] = useState<DebitNote[]>([
    {
      id: "1",
      number: "1111",
      vendor: "Footwear",
      vendorContact: "",
      status: "unpaid",
      amount: "$3344,455",
      date: "23 4:25 PM",
      debitNoteDate: "26 May,26",
      billAddress: "Santa, santa Bankok, 122 Bangladesh",
      subTitle: "fdffdfdf",
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
      vendorContact: "hdjfj",
      status: "unpaid",
      amount: "$5000",
      date: "23 4:25 PM",
      debitNoteDate: "",
      billAddress: "",
      subTitle: "",
      items: [],
    },
    {
      id: "3",
      number: "1113",
      vendor: "Ritat",
      vendorContact: "hdjfj",
      status: "unpaid",
      amount: "$50",
      date: "24 4:25",
      debitNoteDate: "",
      billAddress: "",
      subTitle: "",
      items: [],
    },
    {
      id: "4",
      number: "1114",
      vendor: "Ritat",
      vendorContact: "hdjfj",
      status: "unpaid",
      amount: "$50",
      date: "24 4:25",
      debitNoteDate: "",
      billAddress: "",
      subTitle: "",
      items: [],
    },
    {
      id: "5",
      number: "1115",
      vendor: "Ritat",
      vendorContact: "hdjfj",
      status: "unpaid",
      amount: "$50",
      date: "24 4:25",
      debitNoteDate: "",
      billAddress: "",
      subTitle: "",
      items: [],
    },
  ]);

  const [selectedDebitNote, setSelectedDebitNote] = useState<DebitNote | null>(
    null,
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedDebitNotes, setSelectedDebitNotes] = useState<string[]>([]);

  // Empty state
  if (debitNotes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-[#FAFBFC]">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-lg flex items-center justify-center">
            <Wallet className="w-16 h-16 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Add New Debit Note.
          </h2>
          <p className="text-gray-600 mb-6">
            Ensuring accuracy and transparency in your
            <br />
            invoicing process – making adjustments easy and
            <br />
            understandable.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Debit Note
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unpaid":
        return "bg-orange-500";
      case "paid":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const toggleDebitNoteSelection = (noteId: string) => {
    setSelectedDebitNotes((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [...prev, noteId],
    );
  };

  const calculateTotal = () => {
    return selectedDebitNotes.reduce((total, noteId) => {
      const note = debitNotes.find((n) => n.id === noteId);
      return total + (note ? parseFloat(note.amount.replace(/[$,]/g, "")) : 0);
    }, 0);
  };

  return (
    <div className="h-full flex bg-[#FAFBFC]">
      {/* Left Panel - Debit Notes List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Debit Notes</h2>
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
            <button className="px-2 py-1 border border-gray-200 rounded text-gray-700">
              Date Range
            </button>
            <button className="px-2 py-1 border border-gray-200 rounded text-gray-700">
              Custom
            </button>
          </div>
        </div>

        {/* Debit Notes List */}
        <div className="flex-1 overflow-y-auto">
          {debitNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => !isSelectionMode && setSelectedDebitNote(note)}
              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedDebitNote?.id === note.id && !isSelectionMode
                  ? "bg-blue-50"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {isSelectionMode && (
                  <input
                    type="checkbox"
                    checked={selectedDebitNotes.includes(note.id)}
                    onChange={() => toggleDebitNoteSelection(note.id)}
                    className="mt-1"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {note.vendor}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          note.status,
                        )}`}
                      ></span>
                      <span className="text-xs text-gray-500 capitalize">
                        {note.status}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {note.amount}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      #{note.number}
                    </span>
                    <span className="text-xs text-gray-400">{note.date}</span>
                  </div>
                  {note.vendorContact && (
                    <div className="text-xs text-gray-500 mt-1">
                      {note.vendorContact}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {isSelectionMode && selectedDebitNotes.length > 0 ? (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="text-center mb-2">
              <div className="text-lg font-semibold text-gray-900">
                {selectedDebitNotes.length} Debit Note selected
              </div>
              <div className="text-sm text-gray-600">
                Total{" "}
                <span className="font-medium">
                  ${calculateTotal().toLocaleString()}
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

        {debitNotes.length > 0 && (
          <div className="p-4 border-t border-gray-200 text-center">
            <div className="text-lg font-semibold text-gray-900">$80.00</div>
            <div className="text-xs text-gray-500">
              1 {showCreateForm ? "Delivery Challan" : "Proforma Invoices"}
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Debit Note Details/Form */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedDebitNote || showCreateForm ? (
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
                      ? "New Debit Notes"
                      : selectedDebitNote?.vendor}
                  </h2>
                  {selectedDebitNote && !showCreateForm && (
                    <span className="text-sm text-gray-500">
                      {selectedDebitNote.vendorContact}
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
                        onClick={() => alert("Saved as Draft!")}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                      >
                        Save as Draft
                      </button>
                      <div className="relative">
                        <button className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 inline-flex items-center gap-1">
                          Save & Save
                          <span className="text-xs">▼</span>
                        </button>
                      </div>
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
                          <div className="absolute right-0 top-10 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                              WhatsApp
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between">
                              Duplicate
                              <span className="text-xs text-gray-400">
                                As Debit Notes
                              </span>
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                              Apply to Bill
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                              Signature Request
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                              Activity Log
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

              {selectedDebitNote && !showCreateForm && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">
                      #{selectedDebitNote.number}
                    </div>
                    <div className="text-sm font-medium">
                      {selectedDebitNote.number}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Debit Note Date</div>
                    <div className="text-sm font-medium">
                      {selectedDebitNote.debitNoteDate}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm font-medium text-gray-900">
                      {selectedDebitNote.amount}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          selectedDebitNote.status,
                        )}`}
                      ></span>
                      <span className="text-xs text-gray-500 capitalize">
                        {selectedDebitNote.status}
                      </span>
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
                      defaultValue={
                        showCreateForm
                          ? "Spark Tech Agency"
                          : selectedDebitNote?.vendor
                      }
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
                      Delivery Challan
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option>Default Taxes (Product)</option>
                    </select>
                  </div>
                </div>

                {selectedDebitNote && !showCreateForm && (
                  <div className="mb-6">
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Billing Address
                      </div>
                      <div className="text-sm text-gray-900">
                        {selectedDebitNote.billAddress}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Sub Title
                      </div>
                      <div className="text-sm text-gray-900">
                        {selectedDebitNote.subTitle}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 mb-6">
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
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      placeholder="Default Company"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Delivery Challan Date
                    </label>
                    <input
                      type="text"
                      placeholder="24/3/26"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
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
                        selectedDebitNote?.items || [
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
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Internal Notes
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a debit note to view details</p>
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
