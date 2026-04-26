/**
 * File: src/pages/sales/ProformaInvoices.tsx
 * Complete Proforma Invoices page - 100% matching all screenshots
 * Includes: Empty state, Create/Edit modals, Multi-select, Signature, Preview
 */

import React, { useState } from "react";
import { showToast } from "../../utils/toast";
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
  RefreshCw,
} from "lucide-react";

interface ProformaItem {
  srNo: number;
  item: string;
  description?: string;
  rate: number;
  quantity: number;
  tax: number;
  discount: number;
  amount: number;
}

interface ProformaInvoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerSubtitle: string;
  status: "Draft" | "Approved" | "Cancelled";
  amount: number;
  proformaInvoiceDate: string;
  date: string;
  billingAddress: string;
  billingCity: string;
  billingZip: string;
  shippingMethod: string;
  subTitle: string;
  items: ProformaItem[];
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

const sampleInvoices: ProformaInvoice[] = [
  {
    id: "1",
    invoiceNumber: "#1",
    customerName: "Spark Tech Agency",
    customerSubtitle: "Mahmudul Hasan",
    status: "Draft",
    amount: 5000,
    proformaInvoiceDate: "26 May,26",
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
];

export const ProformaInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<ProformaInvoice[]>(sampleInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] =
    useState<ProformaInvoice | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showFrameMenu, setShowFrameMenu] = useState(false);
  const [showFrame2Menu, setShowFrame2Menu] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);

  // Form data
  const [formData, setFormData] = useState<ProformaInvoice>(sampleInvoices[0]);
  const [signatureName, setSignatureName] = useState("Mahmudul Hasan");
  const [signatureTitle, setSignatureTitle] = useState("Master Card");
  const [signatureDate, setSignatureDate] = useState("3/11/2026");

  const handleInputChange = (field: keyof ProformaInvoice, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (isEditing && selectedInvoice) {
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === formData.id ? formData : inv)),
      );
      setSelectedInvoice(formData);
      showToast("Proforma Invoice updated!", "success");
    } else {
      const newInvoice = { ...formData, id: Date.now().toString() };
      setInvoices((prev) => [...prev, newInvoice]);
      setSelectedInvoice(newInvoice);
      showToast("Proforma Invoice created!", "success");
    }
    setShowForm(false);
  };

  const handleCancel = () => setShowForm(false);

  const handleEdit = () => {
    if (selectedInvoice) {
      setFormData(selectedInvoice);
      setIsEditing(true);
      setShowForm(true);
      setShowMobileList(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      ...sampleInvoices[0],
      id: "",
      invoiceNumber: "",
      customerName: "",
    });
    setIsEditing(false);
    setShowForm(true);
    setShowMobileList(false);
  };

  const toggleSelectInvoice = (id: string) => {
    setSelectedInvoices((prev) =>
      prev.includes(id) ? prev.filter((invId) => invId !== id) : [...prev, id],
    );
  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()),
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

  // Calculate total of selected invoices
  const selectedTotal = invoices
    .filter((i) => selectedInvoices.includes(i.id))
    .reduce((sum, i) => sum + i.due, 0);

  // Empty state check
  const isEmpty = invoices.length === 0 || selectedInvoice === null;

  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-hidden flex flex-col">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
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

      {isEmpty && !selectedInvoice && !showForm ? (
        // Empty State
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-lg mb-6">
              <svg
                className="w-16 h-16 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Add a New Proforma Invoice
            </h3>
            <p className="text-sm text-gray-600 mb-6 max-w-md">
              Send professional proforma invoices to your
              <br />
              customers by entering the required details.
            </p>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-medium"
            >
              <Plus className="w-5 h-5" />
              Create a Proforma Invoice
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Invoice Header */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <div className="flex items-center gap-4 flex-wrap">
                <h2 className="text-lg font-semibold text-gray-900">
                  Proforma Invoices
                </h2>
                {selectedInvoice && !isMultiSelectMode && (
                  <>
                    <h3 className="text-lg font-medium text-gray-700">
                      {selectedInvoice.customerName}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {selectedInvoice.customerSubtitle}
                    </span>
                  </>
                )}
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-2 relative overflow-x-auto max-w-full">
                {showForm ? (
                  <div className="flex items-center gap-2">
                    <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">Cancel</button>
                    <button onClick={() => { showToast("Saved as draft", "success"); setShowForm(false); }} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">Save as Draft</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">Save & Send</button>
                  </div>
                ) : isMultiSelectMode ? (
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
                      title="Signature"
                    >
                      <PenTool className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setShowInvoicePreview(true)}
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
                  <div className="absolute right-0 top-12 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Convert to Invoice
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Mark In
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </button>
                    <button
                      onClick={() => setShowSignatureModal(true)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <PenTool className="w-4 h-4" />
                      Signature Request
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Activity Request
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={() => setShowFrameMenu(!showFrameMenu)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Convert To
                      </span>
                      <span>→</span>
                    </button>
                    {showFrameMenu && (
                      <div className="ml-4 border-l border-gray-200 pl-2">
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                          Single Copy
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                          As Proforma Invoice
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                          Cancelled
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                          Triple Copy
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                          Draft
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                          Double Copy
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => setShowFrame2Menu(!showFrame2Menu)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Print Options
                      </span>
                      <span>→</span>
                    </button>
                    {showFrame2Menu && (
                      <div className="ml-4 border-l border-gray-200 pl-2">
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                          Single Copy
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                          As Proforma Invoice
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                          Double Copy
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                          Triple Copy
                        </button>
                      </div>
                    )}
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

          {/* Mobile list toggle */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2">
            <button
              onClick={() => setShowMobileList(!showMobileList)}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-md px-3 py-1.5"
            >
              {showMobileList ? "← Back to Details" : "☰ View Proforma Invoices"}
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden flex">
            {/* Left Sidebar - Invoice List */}
            <div className={`${showMobileList ? "flex" : "hidden"} lg:flex flex-col w-full lg:w-64 bg-white border-r border-gray-200`}>
              {isMultiSelectMode && (
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedInvoices.length === invoices.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedInvoices(invoices.map((i) => i.id));
                        } else {
                          setSelectedInvoices([]);
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
                {filteredInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className={`p-3 border-b border-gray-100 cursor-pointer ${
                      selectedInvoice?.id === invoice.id && !isMultiSelectMode
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    } ${selectedInvoices.includes(invoice.id) ? "bg-blue-50" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      {isMultiSelectMode && (
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 mt-1"
                          checked={selectedInvoices.includes(invoice.id)}
                          onChange={() => toggleSelectInvoice(invoice.id)}
                        />
                      )}
                      <div
                        className="flex-1"
                        onClick={() => {
                          if (!isMultiSelectMode) {
                            setSelectedInvoice(invoice);
                            setShowMobileList(false);
                          } else {
                            toggleSelectInvoice(invoice.id);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-sm font-medium text-gray-900">
                            {invoice.invoiceNumber}
                          </div>
                          <span
                            className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(invoice.status)}`}
                          >
                            {invoice.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">hdjjdj</span>
                          <span className="text-xs text-gray-500">
                            {invoice.date}
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className="text-sm font-semibold text-gray-900">
                            ${invoice.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={handleCreate}
                  className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 mx-auto"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>

              <div className="p-4 border-t border-gray-200 text-center">
                <div className="text-xl font-semibold text-gray-900">
                  $80.00
                </div>
                <div className="text-xs text-gray-500">1 Proforma Invoices</div>
              </div>
            </div>

            {/* Right Content */}
            <div className={`${showMobileList ? "hidden" : "flex"} lg:flex flex-col flex-1 overflow-y-auto p-4 sm:p-6`}>
              {isMultiSelectMode && selectedInvoices.length > 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {selectedInvoices.length} Proforma Invoice selected
                    </h3>
                    <div className="text-sm text-gray-600 mb-1">Total</div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${selectedTotal.toLocaleString()}
                    </div>
                  </div>
                </div>
              ) : showForm ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                      <input type="text" value={formData.customerName} onChange={(e) => handleInputChange("customerName", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md"><option>Default Taxes (Service)</option></select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Proforma invoice #</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md"><option>Default Taxes (Product)</option></select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                      <input type="text" placeholder="$" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md"><option>Default Company</option></select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                      <input type="text" placeholder="$0" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Method</label>
                      <input type="text" placeholder="24" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Proforma Invoice Date</label>
                      <div className="relative">
                        <input type="text" placeholder="24" className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md" />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="mb-6 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">Sr. No.</th>
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">Items</th>
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">Quantity</th>
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">Rate</th>
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">Tax</th>
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">Discount</th>
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="px-2 py-3">01</td>
                          <td className="px-2 py-3">
                            <div className="flex items-center gap-2"><span>Electronics</span><button className="text-gray-400 hover:text-gray-600"><Edit className="w-4 h-4" /></button></div>
                            <div className="text-xs text-gray-500">Description</div>
                          </td>
                          <td className="px-2 py-3">23</td>
                          <td className="px-2 py-3">$40000</td>
                          <td className="px-2 py-3"><select className="border border-gray-300 rounded px-2 py-1 text-xs"><option>Tax</option></select></td>
                          <td className="px-2 py-3">2%</td>
                          <td className="px-2 py-3 flex items-center gap-2">
                            <span>$32000</span>
                            <button className="text-green-600"><Plus className="w-4 h-4" /></button>
                            <button className="text-red-600"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex gap-3 mb-6">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Product</button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Services</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
                      <textarea rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span className="text-gray-600">Sub Total</span><span className="text-blue-600">$80.00</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-600">Shipping Cost</span><span className="text-blue-600">$3.20</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-600">Sales Tax 4% on 80.00</span><span className="text-blue-600">$10.00</span></div>
                        <div className="flex justify-between text-sm font-semibold border-t pt-2"><span className="text-gray-900">Total</span><span className="text-blue-600">$93.20</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
                      <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <button className="w-full py-8 border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:border-gray-400 flex flex-col items-center justify-center gap-2">
                        <Plus className="w-6 h-6" />
                        <span className="text-sm">Upload Computer</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Signature</label>
                    <button onClick={() => setShowSignatureModal(true)} className="w-full py-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Customer Signature</button>
                  </div>
                </div>
              ) : selectedInvoice ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-4 border-b border-gray-200">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
                        #1
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        2332
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
                        Proforma invoice Date
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedInvoice.proformaInvoiceDate}
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto mb-6">
                    <table className="w-full min-w-[500px] text-sm">
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
                        {selectedInvoice.items.map((item, idx) => (
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

                  <div className="flex flex-col lg:flex-row gap-6 mb-6">
                    <div className="flex-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">
                            Terms & Conditions
                          </label>
                          <p className="text-sm text-gray-900">
                            {selectedInvoice.termsAndConditions || "—"}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">
                            Notes
                          </label>
                          <p className="text-sm text-gray-900">
                            {selectedInvoice.notes || "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-64">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Sub Total</span>
                          <span className="text-blue-600">
                            ${selectedInvoice.subTotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Shipping Cost</span>
                          <span className="text-blue-600">
                            ${selectedInvoice.shippingCost.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Sales Tax 4% on 80.00
                          </span>
                          <span className="text-blue-600">
                            ${selectedInvoice.salesTax.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold border-t pt-2">
                          <span className="text-gray-900">Total</span>
                          <span className="text-blue-600">
                            ${selectedInvoice.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
                        Internal Notes
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedInvoice.internalNotes || "—"}
                      </p>
                    </div>
                    <div>
                      <button className="w-full py-8 border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:border-gray-400 flex flex-col items-center justify-center gap-2">
                        <Plus className="w-6 h-6" />
                        <span className="text-sm">Upload Computer</span>
                      </button>
                    </div>
                  </div>

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
              ) : null}
            </div>
          </div>
        </>
      )}

      {/* Toggle Multi-Select Button */}
      {!isEmpty && selectedInvoice && (
        <button
          onClick={() => {
            setIsMultiSelectMode(!isMultiSelectMode);
            setSelectedInvoices([]);
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

      {/* Signature Modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200">
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

            <div className="p-4 sm:p-6">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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

      {/* Preview Modal */}
      {showInvoicePreview && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowInvoicePreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-lg font-semibold text-gray-900">
                  Sales receipt #
                  {selectedInvoice.invoiceNumber.replace("#", "")}
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

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-100">
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
                          {selectedInvoice.invoiceNumber}
                        </p>
                        <p>
                          <span className="font-semibold">Date:</span>{" "}
                          {new Date().toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-semibold">Outstanding:</span> $
                          {selectedInvoice.due.toFixed(2)}
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
                        Invoice To.
                      </h3>
                      <div className="text-sm text-gray-900">
                        <p className="font-semibold">
                          {selectedInvoice.customerName}
                        </p>
                        <p>{selectedInvoice.customerSubtitle}</p>
                        <p>{selectedInvoice.billingAddress}</p>
                      </div>
                    </div>
                  </div>

                  <table className="w-full text-sm mb-8">
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
                      {selectedInvoice.items.map((item, idx) => (
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
                            ${selectedInvoice.subTotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="font-bold">Total</span>
                          <span className="font-bold">
                            ${selectedInvoice.total.toFixed(2)}
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
                      {selectedInvoice.termsAndConditions ||
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
