/**
 * File: src/pages/SalesProposals.tsx
 * Complete Sales Proposal Management system with list view and create proposal modal
 * Based on provided screenshots design
 */

import React, { useState } from "react";
import {
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  Plus,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
  Printer,
  Copy,
  Globe,
  User,
  Building2,
  Hash,
  Percent,
  Tag,
  FileSignature,
  Save,
  RefreshCw,
} from "lucide-react";

// Proposal type definition
interface Proposal {
  id: number;
  proposalNumber: string;
  customer: string;
  proposalDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  totalAmount: number;
  balance: number;
  status: "Draft" | "Sent" | "Accepted" | "Rejected" | "Overdue";
}

// Proposals data
const initialProposalsData: Proposal[] = [
  {
    id: 1,
    proposalNumber: "SP-2026-02-016",
    customer: "Maria Rodriguez",
    proposalDate: "2026-05-28",
    dueDate: "2026-06-15",
    subtotal: 1199.8,
    tax: 539.91,
    totalAmount: 1739.71,
    balance: 1739.71,
    status: "Draft",
  },
  {
    id: 2,
    proposalNumber: "SP-2026-02-015",
    customer: "Maria Rodriguez",
    proposalDate: "2026-05-20",
    dueDate: "2026-06-05",
    subtotal: 503.86,
    tax: 151.16,
    totalAmount: 655.02,
    balance: 655.02,
    status: "Accepted",
  },
  {
    id: 3,
    proposalNumber: "SP-2026-02-014",
    customer: "Jennifer Martinez",
    proposalDate: "2026-05-10",
    dueDate: "2026-05-25",
    subtotal: 549.88,
    tax: 247.45,
    totalAmount: 797.33,
    balance: 797.33,
    status: "Sent",
  },
  {
    id: 4,
    proposalNumber: "SP-2026-02-013",
    customer: "Lisa Anderson",
    proposalDate: "2026-05-01",
    dueDate: "2026-05-15",
    subtotal: 540.0,
    tax: 243.0,
    totalAmount: 783.0,
    balance: 783.0,
    status: "Draft",
  },
  {
    id: 5,
    proposalNumber: "SP-2026-02-012",
    customer: "Lisa Anderson",
    proposalDate: "2026-04-15",
    dueDate: "2026-05-01",
    subtotal: 1799.98,
    tax: 324.0,
    totalAmount: 2123.98,
    balance: 2123.98,
    status: "Sent",
  },
  {
    id: 6,
    proposalNumber: "SP-2026-02-011",
    customer: "Emily Davis",
    proposalDate: "2026-04-05",
    dueDate: "2026-04-20",
    subtotal: 2740.0,
    tax: 1233.0,
    totalAmount: 3973.0,
    balance: 3973.0,
    status: "Accepted",
  },
  {
    id: 7,
    proposalNumber: "SP-2026-02-010",
    customer: "Sarah Johnson",
    proposalDate: "2026-03-25",
    dueDate: "2026-04-10",
    subtotal: 499.8,
    tax: 224.91,
    totalAmount: 724.71,
    balance: 724.71,
    status: "Draft",
  },
  {
    id: 8,
    proposalNumber: "SP-2026-02-009",
    customer: "Jessica Harris",
    proposalDate: "2026-03-12",
    dueDate: "2026-04-01",
    subtotal: 135.0,
    tax: 60.75,
    totalAmount: 195.75,
    balance: 195.75,
    status: "Sent",
  },
  {
    id: 9,
    proposalNumber: "SP-2026-02-008",
    customer: "Amanda White",
    proposalDate: "2026-03-05",
    dueDate: "2026-03-20",
    subtotal: 1799.95,
    tax: 404.98,
    totalAmount: 2204.93,
    balance: 2204.93,
    status: "Rejected",
  },
];

// Product item interface
interface ProposalItem {
  id: number;
  product: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

// Customer list
const customers = [
  "Maria Rodriguez",
  "Jennifer Martinez",
  "Lisa Anderson",
  "Emily Davis",
  "Sarah Johnson",
  "Jessica Harris",
  "Amanda White",
  "Michael Brown",
  "David Wilson",
];

// Languages
const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
];

export const SalesProposals: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>(initialProposalsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Form state for creating proposal
  const [formData, setFormData] = useState({
    customer: "",
    proposalDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    paymentTerms: "Net 30",
    notes: "",
    footer: "",
  });

  // Proposal items state
  const [proposalItems, setProposalItems] = useState<ProposalItem[]>([
    {
      id: 1,
      product: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      tax: 0,
      total: 0,
    },
  ]);

  // Calculate totals
  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    proposalItems.forEach((item) => {
      const itemTotal = item.quantity * item.unitPrice;
      const discountAmount = itemTotal * (item.discount / 100);
      const taxableAmount = itemTotal - discountAmount;
      const taxAmount = taxableAmount * (item.tax / 100);

      subtotal += itemTotal;
      totalDiscount += discountAmount;
      totalTax += taxAmount;
    });

    const total = subtotal - totalDiscount + totalTax;
    return { subtotal, totalDiscount, totalTax, total };
  };

  const { subtotal, totalDiscount, totalTax, total } = calculateTotals();

  // Add new item row
  const addItemRow = () => {
    const newId = Math.max(...proposalItems.map((i) => i.id), 0) + 1;
    setProposalItems([
      ...proposalItems,
      {
        id: newId,
        product: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        tax: 0,
        total: 0,
      },
    ]);
  };

  // Remove item row
  const removeItemRow = (id: number) => {
    if (proposalItems.length > 1) {
      setProposalItems(proposalItems.filter((item) => item.id !== id));
    }
  };

  // Update item
  const updateItem = (
    id: number,
    field: keyof ProposalItem,
    value: string | number,
  ) => {
    setProposalItems(
      proposalItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          // Recalculate total
          const itemTotal = updatedItem.quantity * updatedItem.unitPrice;
          const discountAmount = itemTotal * (updatedItem.discount / 100);
          const taxableAmount = itemTotal - discountAmount;
          const taxAmount = taxableAmount * (updatedItem.tax / 100);
          updatedItem.total = itemTotal - discountAmount + taxAmount;
          return updatedItem;
        }
        return item;
      }),
    );
  };

  // Create proposal
  const handleCreateProposal = () => {
    if (!formData.customer) {
      alert("Please select a customer");
      return;
    }
    if (proposalItems.some((item) => !item.product)) {
      alert("Please fill in all product names");
      return;
    }

    const newProposalNumber = `SP-${new Date().toISOString().split("T")[0]}-${String(proposals.length + 1).padStart(3, "0")}`;

    const newProposal: Proposal = {
      id: Math.max(...proposals.map((p) => p.id), 0) + 1,
      proposalNumber: newProposalNumber,
      customer: formData.customer,
      proposalDate: formData.proposalDate,
      dueDate: formData.dueDate,
      subtotal: subtotal,
      tax: totalTax,
      totalAmount: total,
      balance: total,
      status: "Draft",
    };

    setProposals([newProposal, ...proposals]);
    setShowCreateModal(false);
    resetForm();
    showToast("Proposal created successfully!");
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      customer: "",
      proposalDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      paymentTerms: "Net 30",
      notes: "",
      footer: "",
    });
    setProposalItems([
      {
        id: 1,
        product: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        tax: 0,
        total: 0,
      },
    ]);
  };

  // Show toast notification
  const showToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  // Filter proposals based on search term
  const filteredProposals = proposals.filter(
    (proposal) =>
      proposal.proposalNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      proposal.customer.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination
  const totalPages = Math.ceil(filteredProposals.length / itemsPerPage);
  const paginatedProposals = filteredProposals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-700";
      case "Sent":
        return "bg-blue-100 text-blue-700";
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Overdue":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Draft":
        return <FileText className="w-3 h-3" />;
      case "Sent":
        return <Send className="w-3 h-3" />;
      case "Accepted":
        return <CheckCircle className="w-3 h-3" />;
      case "Rejected":
        return <X className="w-3 h-3" />;
      case "Overdue":
        return <AlertCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Success Toast */}
        {showSuccessToast && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </div>
          </div>
        )}

        {/* Breadcrumb */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">SalesProposals</span>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Globe className="w-4 h-4" />
              {languages.find((lang) => lang.code === selectedLanguage)?.name}
              <ChevronRight className="w-3 h-3 rotate-90" />
            </button>
            {showLanguageDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowLanguageDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.code);
                        setShowLanguageDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2 ${
                        selectedLanguage === lang.code
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      <span>{lang.flag}</span>
                      {lang.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              Manage Proposal
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Create and manage sales proposals for your customers
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Proposal
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search proposals..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Status:</span>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      "All",
                      "Draft",
                      "Sent",
                      "Accepted",
                      "Rejected",
                      "Overdue",
                    ].map((status) => (
                      <button
                        key={status}
                        className="px-3 py-1 text-sm rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Proposals Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Proposal Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Proposal Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Subtotal
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tax
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedProposals.map((proposal) => (
                  <tr
                    key={proposal.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900 text-sm">
                        {proposal.proposalNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {proposal.customer}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {proposal.proposalDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {proposal.dueDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatCurrency(proposal.subtotal)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatCurrency(proposal.tax)}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {formatCurrency(proposal.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatCurrency(proposal.balance)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          proposal.status,
                        )}`}
                      >
                        {getStatusIcon(proposal.status)}
                        {proposal.status}
                        {proposal.status === "Overdue" && "!"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
                className="px-2 py-1 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-500">per page</span>
            </div>

            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredProposals.length)}{" "}
              of {filteredProposals.length} results
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      currentPage === pageNumber
                        ? "bg-blue-600 text-white"
                        : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Proposal Modal - Full Screen (90% of screen) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[90vw] max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Create Sales Proposal
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Fill in the details to create a new sales proposal
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Proposal Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Sales Proposal Details */}
                  <div className="bg-gray-50 rounded-lg p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Sales Proposal Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Customer *
                        </label>
                        <select
                          value={formData.customer}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              customer: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Customer</option>
                          {customers.map((customer) => (
                            <option key={customer} value={customer}>
                              {customer}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Proposal Date
                        </label>
                        <input
                          type="date"
                          value={formData.proposalDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              proposalDate: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Due Date
                        </label>
                        <input
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dueDate: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Terms
                        </label>
                        <input
                          type="text"
                          value={formData.paymentTerms}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              paymentTerms: e.target.value,
                            })
                          }
                          placeholder="e.g., Net 30"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="bg-gray-50 rounded-lg p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Notes
                    </h3>
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={3}
                      placeholder="Additional notes..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {/* Sales Proposal Items */}
                  <div className="bg-gray-50 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-gray-900">
                        Sales Proposal Items
                      </h3>
                      <button
                        onClick={addItemRow}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Item
                      </button>
                    </div>

                    {/* Items Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-white rounded-lg">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                              Product
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">
                              Qty
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">
                              Unit Price
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">
                              Discount %
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">
                              Tax %
                            </th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">
                              Total
                            </th>
                            <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {proposalItems.map((item) => (
                            <tr
                              key={item.id}
                              className="border-t border-gray-200"
                            >
                              <td className="px-3 py-2">
                                <input
                                  type="text"
                                  value={item.product}
                                  onChange={(e) =>
                                    updateItem(
                                      item.id,
                                      "product",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Product name"
                                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateItem(
                                      item.id,
                                      "quantity",
                                      parseFloat(e.target.value) || 0,
                                    )
                                  }
                                  className="w-20 px-2 py-1 text-sm border border-gray-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="number"
                                  value={item.unitPrice}
                                  onChange={(e) =>
                                    updateItem(
                                      item.id,
                                      "unitPrice",
                                      parseFloat(e.target.value) || 0,
                                    )
                                  }
                                  className="w-24 px-2 py-1 text-sm border border-gray-200 rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="number"
                                  value={item.discount}
                                  onChange={(e) =>
                                    updateItem(
                                      item.id,
                                      "discount",
                                      parseFloat(e.target.value) || 0,
                                    )
                                  }
                                  className="w-16 px-2 py-1 text-sm border border-gray-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="number"
                                  value={item.tax}
                                  onChange={(e) =>
                                    updateItem(
                                      item.id,
                                      "tax",
                                      parseFloat(e.target.value) || 0,
                                    )
                                  }
                                  className="w-16 px-2 py-1 text-sm border border-gray-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-3 py-2 text-right text-sm font-medium text-gray-900">
                                {formatCurrency(item.total)}
                              </td>
                              <td className="px-3 py-2 text-center">
                                <button
                                  onClick={() => removeItemRow(item.id)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-gray-50 rounded-lg p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Footer{" "}
                    </h3>
                    <textarea
                      value={formData.footer}
                      onChange={(e) =>
                        setFormData({ ...formData, footer: e.target.value })
                      }
                      rows={2}
                      placeholder="Additional footer text..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>

                {/* Right Column - Proposal Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 sticky top-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Proposal Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount:</span>
                        <span className="font-medium text-red-600">
                          -{formatCurrency(totalDiscount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax:</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(totalTax)}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <div className="flex justify-between text-base font-bold">
                          <span className="text-gray-900">Total:</span>
                          <span className="text-blue-600">
                            {formatCurrency(total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProposal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Create Proposal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
