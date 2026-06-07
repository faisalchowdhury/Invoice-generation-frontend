/**
 * File: src/pages/accounting/CreditNotes.tsx
 * Complete Credit Notes Management page with list view, create/edit modal, and details modal
 * Based on provided screenshots design
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  X,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  User,
  Receipt,
  Send,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CreditNoteItem {
  id: string;
  product: string;
  sku: string;
  description: string;
  qty: number;
  unitPrice: number;
  discountPercent: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
}

interface CreditNoteApplication {
  id: string;
  invoiceNumber: string;
  appliedAmount: number;
  date: string;
}

interface CreditNote {
  id: string;
  creditNoteNumber: string;
  salesReturn: string;
  customer: string;
  customerEmail: string;
  date: string;
  reason: string;
  totalAmount: number;
  balance: number;
  status: "Draft" | "Approved" | "Applied" | "Cancelled";
  approvedBy: string;
  items: CreditNoteItem[];
  applications: CreditNoteApplication[];
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleCreditNotes: CreditNote[] = [
  {
    id: "1",
    creditNoteNumber: "CN-2026-01-001",
    salesReturn: "SR-2026-01-001",
    customer: "Sarah Johnson",
    customerEmail: "sarah.johnson@client.com",
    date: "2026-01-20",
    reason: "Sales return - defective products",
    totalAmount: 354.0,
    balance: -200.0,
    status: "Applied",
    approvedBy: "Company",
    items: [],
    applications: [],
    createdAt: "2026-01-20",
  },
  {
    id: "2",
    creditNoteNumber: "CN-2026-01-002",
    salesReturn: "SR-2026-01-002",
    customer: "Lisa Anderson",
    customerEmail: "lisa.anderson@client.com",
    date: "2026-01-20",
    reason: "Sales return - wrong_item",
    totalAmount: 289.99,
    balance: 289.99,
    status: "Draft",
    approvedBy: "",
    items: [
      {
        id: "i1",
        product: "Watch",
        sku: "JEWEL-PROD-033",
        description:
          "Elegant stainless steel watch with water resistance and precision quartz movement",
        qty: 1,
        unitPrice: 199.99,
        discountPercent: 0,
        taxPercent: 45,
        taxAmount: 90.0,
        total: 289.99,
      },
    ],
    applications: [],
    createdAt: "2026-01-20",
  },
  {
    id: "3",
    creditNoteNumber: "CN-2026-01-003",
    salesReturn: "SR-2026-01-003",
    customer: "Emily Davis",
    customerEmail: "emily.davis@client.com",
    date: "2026-01-20",
    reason: "Damaged goods",
    totalAmount: 909.99,
    balance: 0.0,
    status: "Applied",
    approvedBy: "Company",
    items: [],
    applications: [],
    createdAt: "2026-01-20",
  },
  {
    id: "4",
    creditNoteNumber: "CN-2026-01-004",
    salesReturn: "SR-2026-01-004",
    customer: "Maria Rodriguez",
    customerEmail: "maria.rodriguez@client.com",
    date: "2026-01-20",
    reason: "Shortage in delivery",
    totalAmount: 20.75,
    balance: 20.75,
    status: "Draft",
    approvedBy: "",
    items: [],
    applications: [],
    createdAt: "2026-01-20",
  },
  {
    id: "5",
    creditNoteNumber: "CN-2026-01-005",
    salesReturn: "SR-2026-01-005",
    customer: "Jessica Harris",
    customerEmail: "jessica.harris@client.com",
    date: "2026-01-20",
    reason: "Quality issues",
    totalAmount: 141.6,
    balance: 141.6,
    status: "Approved",
    approvedBy: "Company",
    items: [],
    applications: [],
    createdAt: "2026-01-20",
  },
  {
    id: "6",
    creditNoteNumber: "CN-2026-01-006",
    salesReturn: "SR-2026-01-008",
    customer: "Maria Rodriguez",
    customerEmail: "maria.rodriguez@client.com",
    date: "2026-01-20",
    reason: "Incorrect pricing",
    totalAmount: 390.0,
    balance: -200.0,
    status: "Applied",
    approvedBy: "Company",
    items: [],
    applications: [],
    createdAt: "2026-01-20",
  },
  {
    id: "7",
    creditNoteNumber: "CN-2026-01-007",
    salesReturn: "SR-2026-01-007",
    customer: "Jennifer Martinez",
    customerEmail: "jennifer.martinez@client.com",
    date: "2026-01-20",
    reason: "Missing items",
    totalAmount: 130.49,
    balance: 130.49,
    status: "Draft",
    approvedBy: "",
    items: [],
    applications: [],
    createdAt: "2026-01-20",
  },
  {
    id: "8",
    creditNoteNumber: "CN-2026-01-008",
    salesReturn: "SR-2026-01-006",
    customer: "Ashley Lewis",
    customerEmail: "ashley.lewis@client.com",
    date: "2026-01-20",
    reason: "Late delivery penalty",
    totalAmount: 253.68,
    balance: 253.68,
    status: "Approved",
    approvedBy: "Company",
    items: [],
    applications: [],
    createdAt: "2026-01-20",
  },
  {
    id: "9",
    creditNoteNumber: "CN-2026-01-009",
    salesReturn: "SR-2026-01-011",
    customer: "Jennifer Martinez",
    customerEmail: "jennifer.martinez@client.com",
    date: "2026-01-20",
    reason: "Returned items",
    totalAmount: 130.49,
    balance: -130.49,
    status: "Applied",
    approvedBy: "Company",
    items: [],
    applications: [],
    createdAt: "2026-01-20",
  },
];

const customers = [
  "Sarah Johnson",
  "Lisa Anderson",
  "Emily Davis",
  "Maria Rodriguez",
  "Jessica Harris",
  "Jennifer Martinez",
  "Ashley Lewis",
  "Amanda White",
];

const salesReturns = [
  "SR-2026-01-001",
  "SR-2026-01-002",
  "SR-2026-01-003",
  "SR-2026-01-004",
  "SR-2026-01-005",
  "SR-2026-01-006",
  "SR-2026-01-007",
  "SR-2026-01-008",
  "SR-2026-01-011",
];

const reasons = [
  "Sales return - defective products",
  "Sales return - wrong_item",
  "Damaged goods",
  "Shortage in delivery",
  "Quality issues",
  "Incorrect pricing",
  "Missing items",
  "Late delivery penalty",
  "Returned items",
];

const products = [
  {
    name: "Watch",
    sku: "JEWEL-PROD-033",
    price: 199.99,
    description:
      "Elegant stainless steel watch with water resistance and precision quartz movement",
  },
  {
    name: "Laptop",
    sku: "ELEC-PROD-001",
    price: 650.0,
    description: "High-performance laptop",
  },
  {
    name: "Monitor",
    sku: "ELEC-PROD-002",
    price: 350.0,
    description: "4K UHD Monitor",
  },
  {
    name: "Keyboard",
    sku: "ELEC-PROD-003",
    price: 80.0,
    description: "Mechanical keyboard",
  },
  {
    name: "Mouse",
    sku: "ELEC-PROD-004",
    price: 25.0,
    description: "Wireless mouse",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = Math.abs(val)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField =
  | "creditNoteNumber"
  | "salesReturn"
  | "customer"
  | "date"
  | "totalAmount"
  | "balance"
  | "status"
  | "approvedBy";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const AccountsCreditNotes: React.FC = () => {
  const navigate = useNavigate();
  const [creditNotes, setCreditNotes] =
    useState<CreditNote[]>(sampleCreditNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCreditNote, setSelectedCreditNote] =
    useState<CreditNote | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [creditNoteFormData, setCreditNoteFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    salesReturn: "",
    customer: "",
    reason: "",
    notes: "",
  });

  const [creditNoteFormItems, setCreditNoteFormItems] = useState<
    CreditNoteItem[]
  >([
    {
      id: "new-1",
      product: "",
      sku: "",
      description: "",
      qty: 1,
      unitPrice: 0,
      discountPercent: 0,
      taxPercent: 18,
      taxAmount: 0,
      total: 0,
    },
  ]);

  // ─── Sorting ────────────────────────────────────────────────────────────────

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  // ─── Filtered & Sorted ─────────────────────────────────────────────────────

  const filteredCreditNotes = useMemo(() => {
    let result = [...creditNotes];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (cn) =>
          cn.creditNoteNumber.toLowerCase().includes(q) ||
          cn.salesReturn.toLowerCase().includes(q) ||
          cn.customer.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((cn) => cn.status === statusFilter);
    }

    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "totalAmount") {
        aVal = a.totalAmount;
        bVal = b.totalAmount;
      }
      if (sortField === "balance") {
        aVal = a.balance;
        bVal = b.balance;
      }

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [creditNotes, searchQuery, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredCreditNotes.length / perPage);
  const paginatedCreditNotes = filteredCreditNotes.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const recalcItem = (item: CreditNoteItem): CreditNoteItem => {
    const subtotal = item.qty * item.unitPrice;
    const discountAmt = subtotal * (item.discountPercent / 100);
    const afterDiscount = subtotal - discountAmt;
    const taxAmt = afterDiscount * (item.taxPercent / 100);
    return {
      ...item,
      taxAmount: Math.round(taxAmt * 100) / 100,
      total: Math.round((afterDiscount + taxAmt) * 100) / 100,
    };
  };

  const updateCreditNoteItem = (
    id: string,
    field: keyof CreditNoteItem,
    value: any,
  ) => {
    setCreditNoteFormItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "product") {
          const found = products.find((p) => p.name === value);
          if (found) {
            updated.sku = found.sku;
            updated.description = found.description;
            updated.unitPrice = found.price;
          }
        }
        return recalcItem(updated);
      }),
    );
  };

  const addCreditNoteItem = () => {
    setCreditNoteFormItems((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        product: "",
        sku: "",
        description: "",
        qty: 1,
        unitPrice: 0,
        discountPercent: 0,
        taxPercent: 18,
        taxAmount: 0,
        total: 0,
      },
    ]);
  };

  const removeCreditNoteItem = (id: string) => {
    setCreditNoteFormItems((prev) =>
      prev.length <= 1 ? prev : prev.filter((i) => i.id !== id),
    );
  };

  const creditNoteSubtotal = creditNoteFormItems.reduce(
    (sum, i) => sum + i.qty * i.unitPrice,
    0,
  );
  const creditNoteDiscount = creditNoteFormItems.reduce(
    (sum, i) => sum + i.qty * i.unitPrice * (i.discountPercent / 100),
    0,
  );
  const creditNoteTax = creditNoteFormItems.reduce(
    (sum, i) => sum + i.taxAmount,
    0,
  );
  const creditNoteTotal =
    creditNoteSubtotal - creditNoteDiscount + creditNoteTax;

  const resetCreditNoteForm = () => {
    setCreditNoteFormData({
      date: new Date().toISOString().split("T")[0],
      salesReturn: "",
      customer: "",
      reason: "",
      notes: "",
    });
    setCreditNoteFormItems([
      {
        id: "new-1",
        product: "",
        sku: "",
        description: "",
        qty: 1,
        unitPrice: 0,
        discountPercent: 0,
        taxPercent: 18,
        taxAmount: 0,
        total: 0,
      },
    ]);
  };

  const openCreateModal = () => {
    resetCreditNoteForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (creditNote: CreditNote) => {
    setSelectedCreditNote(creditNote);
    setCreditNoteFormData({
      date: creditNote.date,
      salesReturn: creditNote.salesReturn,
      customer: creditNote.customer,
      reason: creditNote.reason,
      notes: "",
    });
    setCreditNoteFormItems(
      creditNote.items.length > 0
        ? creditNote.items
        : [
            {
              id: "new-1",
              product: "",
              sku: "",
              description: "",
              qty: 1,
              unitPrice: 0,
              discountPercent: 0,
              taxPercent: 18,
              taxAmount: 0,
              total: 0,
            },
          ],
    );
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openViewModal = (creditNote: CreditNote) => {
    setSelectedCreditNote(creditNote);
    setShowViewModal(true);
  };

  const openDeleteModal = (creditNote: CreditNote) => {
    setSelectedCreditNote(creditNote);
    setShowDeleteModal(true);
  };

  const handleApproveCreditNote = (id: string) => {
    setCreditNotes((prev) =>
      prev.map((cn) =>
        cn.id === id && cn.status === "Draft"
          ? { ...cn, status: "Approved" as const, approvedBy: "Company" }
          : cn,
      ),
    );
    showToast("Credit note approved successfully!", "success");
  };

  const handleSaveCreditNote = () => {
    if (!creditNoteFormData.customer) {
      showToast("Please select a customer", "info");
      return;
    }
    if (!creditNoteFormData.salesReturn) {
      showToast("Please select a sales return", "info");
      return;
    }
    if (!creditNoteFormData.reason) {
      showToast("Please enter a reason", "info");
      return;
    }

    if (isEditing && selectedCreditNote) {
      setCreditNotes((prev) =>
        prev.map((cn) =>
          cn.id === selectedCreditNote.id
            ? {
                ...cn,
                date: creditNoteFormData.date,
                salesReturn: creditNoteFormData.salesReturn,
                customer: creditNoteFormData.customer,
                reason: creditNoteFormData.reason,
                totalAmount: creditNoteTotal,
                items: creditNoteFormItems,
              }
            : cn,
        ),
      );
      showToast("Credit note updated successfully!", "success");
      setShowEditModal(false);
    } else {
      const newCreditNote: CreditNote = {
        id: Date.now().toString(),
        creditNoteNumber: `CN-${new Date().toISOString().split("T")[0]}-${String(creditNotes.length + 1).padStart(3, "0")}`,
        salesReturn: creditNoteFormData.salesReturn,
        customer: creditNoteFormData.customer,
        customerEmail: `${creditNoteFormData.customer.toLowerCase().replace(/\s/g, ".")}@client.com`,
        date: creditNoteFormData.date,
        reason: creditNoteFormData.reason,
        totalAmount: creditNoteTotal,
        balance: creditNoteTotal,
        status: "Draft",
        approvedBy: "",
        items: creditNoteFormItems,
        applications: [],
        createdAt: new Date().toISOString().split("T")[0],
      };
      setCreditNotes((prev) => [newCreditNote, ...prev]);
      showToast("Credit note created successfully!", "success");
      setShowCreateModal(false);
    }
    resetCreditNoteForm();
  };

  const handleDeleteCreditNote = () => {
    if (selectedCreditNote) {
      setCreditNotes((prev) =>
        prev.filter((cn) => cn.id !== selectedCreditNote.id),
      );
      showToast("Credit note deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedCreditNote(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "bg-green-100 text-green-700";
      case "Approved":
        return "bg-blue-100 text-blue-700";
      case "Draft":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Applied":
        return <CheckCircle className="w-3 h-3" />;
      case "Approved":
        return <AlertCircle className="w-3 h-3" />;
      case "Draft":
        return <Clock className="w-3 h-3" />;
      case "Cancelled":
        return <X className="w-3 h-3" />;
      default:
        return null;
    }
  };

  // ─── Sort Header ────────────────────────────────────────────────────────────

  const SortHeader: React.FC<{ field: SortField; label: string }> = ({
    field,
    label,
  }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-600 cursor-pointer select-none hover:bg-gray-50 whitespace-nowrap"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown
          className={`w-3 h-3 ${sortField === field ? "text-gray-900" : "text-gray-400"}`}
        />
      </div>
    </th>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // LIST VIEW
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-hidden flex flex-col">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => navigate("/")}
            className="hover:text-gray-700"
          >
            Dashboard
          </button>
          <span>›</span>
          <button
            onClick={() => navigate("/accounting")}
            className="hover:text-gray-700"
          >
            Accounting
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Credit Notes</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Credit Notes
          </h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by credit note number..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-80 pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              onClick={() => showToast("Search applied", "info")}
              className="px-4 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
            >
              Search
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>

            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">Filters</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {showFilters && (
                <div className="absolute right-0 top-10 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-3 pb-1.5 mb-1 border-b border-gray-100">
                    <span className="text-xs font-medium text-gray-500">
                      Status
                    </span>
                  </div>
                  {["All", "Draft", "Approved", "Applied", "Cancelled"].map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => {
                          setStatusFilter(st);
                          setCurrentPage(1);
                          setShowFilters(false);
                        }}
                        className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${statusFilter === st ? "text-blue-600 font-medium bg-blue-50" : "text-gray-700"}`}
                      >
                        {st}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader
                  field="creditNoteNumber"
                  label="Credit Note Number"
                />
                <SortHeader field="salesReturn" label="Sales Return" />
                <SortHeader field="customer" label="Customer" />
                <SortHeader field="date" label="Date" />
                <SortHeader field="totalAmount" label="Total Amount" />
                <SortHeader field="balance" label="Balance" />
                <SortHeader field="status" label="Status" />
                <SortHeader field="approvedBy" label="Approved By" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedCreditNotes.map((cn) => (
                <tr
                  key={cn.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openViewModal(cn)}
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-blue-600 hover:underline">
                      {cn.creditNoteNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{cn.salesReturn}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-900">{cn.customer}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{cn.date}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {fmtCurrency(cn.totalAmount)}
                  </td>
                  <td
                    className="px-4 py-3 font-medium"
                    style={{
                      color:
                        cn.balance < 0
                          ? "#16a34a"
                          : cn.balance > 0
                            ? "#dc2626"
                            : "#374151",
                    }}
                  >
                    {fmtCurrency(Math.abs(cn.balance))}
                    {cn.balance < 0 && " (Overpaid)"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(cn.status)}`}
                    >
                      {getStatusIcon(cn.status)}
                      {cn.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {cn.approvedBy || "-"}
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openViewModal(cn)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {cn.status === "Draft" && (
                        <button
                          onClick={() => openEditModal(cn)}
                          className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => openDeleteModal(cn)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedCreditNotes.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No credit notes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-sm text-gray-500">
            Showing{" "}
            {filteredCreditNotes.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredCreditNotes.length)} of{" "}
            {filteredCreditNotes.length} results
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
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
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-8 h-8 text-sm rounded-md flex items-center justify-center ${
                    currentPage === pageNumber
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {isEditing ? "Edit Credit Note" : "Create Credit Note"}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {isEditing
                    ? "Update credit note information"
                    : "Create a new credit note"}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  resetCreditNoteForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={creditNoteFormData.date}
                      onChange={(e) =>
                        setCreditNoteFormData({
                          ...creditNoteFormData,
                          date: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sales Return <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={creditNoteFormData.salesReturn}
                    onChange={(e) =>
                      setCreditNoteFormData({
                        ...creditNoteFormData,
                        salesReturn: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="">Select Sales Return</option>
                    {salesReturns.map((sr) => (
                      <option key={sr} value={sr}>
                        {sr}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={creditNoteFormData.customer}
                    onChange={(e) =>
                      setCreditNoteFormData({
                        ...creditNoteFormData,
                        customer: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="">Select Customer</option>
                    {customers.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={creditNoteFormData.reason}
                    onChange={(e) =>
                      setCreditNoteFormData({
                        ...creditNoteFormData,
                        reason: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="">Select Reason</option>
                    {reasons.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={creditNoteFormData.notes}
                    onChange={(e) =>
                      setCreditNoteFormData({
                        ...creditNoteFormData,
                        notes: e.target.value,
                      })
                    }
                    rows={3}
                    placeholder="Additional notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
                  />
                </div>
              </div>

              {/* Credit Note Items */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-gray-500" />
                    <h3 className="text-base font-semibold text-gray-900">
                      Credit Note Items
                    </h3>
                  </div>
                  <button
                    onClick={addCreditNoteItem}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[800px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 w-48">
                          Product
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 w-20">
                          Qty
                        </th>
                        <th className="px-2 py-2 text-right text-xs font-medium text-gray-600 w-28">
                          Unit Price
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 w-24">
                          Discount %
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 w-24">
                          Tax %
                        </th>
                        <th className="px-2 py-2 text-right text-xs font-medium text-gray-600 w-28">
                          Total
                        </th>
                        <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 w-16">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {creditNoteFormItems.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="px-2 py-2">
                            <select
                              value={item.product}
                              onChange={(e) =>
                                updateCreditNoteItem(
                                  item.id,
                                  "product",
                                  e.target.value,
                                )
                              }
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                              <option value="">Select product</option>
                              {products.map((p) => (
                                <option key={p.name} value={p.name}>
                                  {p.name}
                                </option>
                              ))}
                            </select>
                            {item.sku && (
                              <p className="text-xs text-gray-400 mt-1">
                                SKU: {item.sku}
                              </p>
                            )}
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              min={1}
                              value={item.qty}
                              onChange={(e) =>
                                updateCreditNoteItem(
                                  item.id,
                                  "qty",
                                  Math.max(1, parseInt(e.target.value) || 1),
                                )
                              }
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              min={0}
                              step={0.01}
                              value={item.unitPrice}
                              onChange={(e) =>
                                updateCreditNoteItem(
                                  item.id,
                                  "unitPrice",
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={item.discountPercent}
                              onChange={(e) =>
                                updateCreditNoteItem(
                                  item.id,
                                  "discountPercent",
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={item.taxPercent}
                              onChange={(e) =>
                                updateCreditNoteItem(
                                  item.id,
                                  "taxPercent",
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-2 py-2 text-right font-medium text-gray-900">
                            {fmtCurrency(item.total)}
                          </td>
                          <td className="px-2 py-2 text-center">
                            <button
                              onClick={() => removeCreditNoteItem(item.id)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end mt-6">
                  <div className="w-full sm:w-80">
                    <h4 className="text-base font-semibold text-gray-900 mb-3">
                      Credit Note Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">
                          {fmtCurrency(creditNoteSubtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount</span>
                        <span className="text-red-500">
                          -{fmtCurrency(creditNoteDiscount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="text-gray-900">
                          {fmtCurrency(creditNoteTax)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-gray-200">
                        <span className="text-base font-semibold text-gray-900">
                          Total
                        </span>
                        <span className="text-base font-semibold text-blue-600">
                          {fmtCurrency(creditNoteTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  {creditNoteFormItems.length}{" "}
                  {creditNoteFormItems.length === 1 ? "item" : "items"} added
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  resetCreditNoteForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCreditNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isEditing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedCreditNote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Credit Note Details
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {selectedCreditNote.creditNoteNumber}
                </p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500">CUSTOMER</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedCreditNote.customer}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedCreditNote.customerEmail}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedCreditNote.status)}`}
                  >
                    {getStatusIcon(selectedCreditNote.status)}
                    {selectedCreditNote.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm text-gray-900">
                    {selectedCreditNote.date}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Reason</p>
                  <p className="text-sm text-gray-900">
                    {selectedCreditNote.reason}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Sales Return</p>
                  <p className="text-sm text-blue-600 hover:underline cursor-pointer">
                    {selectedCreditNote.salesReturn}
                  </p>
                </div>
              </div>
              {selectedCreditNote.status === "Draft" && (
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() =>
                      handleApproveCreditNote(selectedCreditNote.id)
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Send className="w-4 h-4 inline mr-2" />
                    Approve Credit Note
                  </button>
                  <div className="flex-1 text-right">
                    <span className="text-sm text-gray-500">
                      Balance Amount:{" "}
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {fmtCurrency(selectedCreditNote.balance)}
                    </span>
                  </div>
                </div>
              )}
              {selectedCreditNote.items.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Credit Note Items
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                            Product
                          </th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">
                            Qty
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                            Unit Price
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                            Discount
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                            Tax
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCreditNote.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-2">
                              <p className="font-medium text-gray-900">
                                {item.product}
                              </p>
                              <p className="text-xs text-gray-400">
                                SKU: {item.sku}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {item.description}
                              </p>
                            </td>
                            <td className="px-4 py-2 text-center text-gray-600">
                              {item.qty}
                            </td>
                            <td className="px-4 py-2 text-right text-gray-600">
                              {fmtCurrency(item.unitPrice)}
                            </td>
                            <td className="px-4 py-2 text-right text-red-500">
                              {item.discountPercent}%
                            </td>
                            <td className="px-4 py-2 text-right text-gray-600">
                              {item.taxPercent}% ({fmtCurrency(item.taxAmount)})
                            </td>
                            <td className="px-4 py-2 text-right font-medium text-gray-900">
                              {fmtCurrency(item.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50 border-t border-gray-200">
                        <tr>
                          <td colSpan={5} className="px-4 py-2 text-right">
                            Subtotal
                          </td>
                          <td className="px-4 py-2 text-right">
                            {fmtCurrency(
                              selectedCreditNote.items.reduce(
                                (sum, i) => sum + i.qty * i.unitPrice,
                                0,
                              ),
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={5} className="px-4 py-2 text-right">
                            Tax
                          </td>
                          <td className="px-4 py-2 text-right">
                            {fmtCurrency(
                              selectedCreditNote.items.reduce(
                                (sum, i) => sum + i.taxAmount,
                                0,
                              ),
                            )}
                          </td>
                        </tr>
                        <tr className="border-t border-gray-200">
                          <td
                            colSpan={5}
                            className="px-4 py-2 text-right font-bold"
                          >
                            Total Credit Amount
                          </td>
                          <td className="px-4 py-2 text-right font-bold text-blue-600">
                            {fmtCurrency(selectedCreditNote.totalAmount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Applied Amount:</span>{" "}
                      {fmtCurrency(
                        selectedCreditNote.totalAmount -
                          selectedCreditNote.balance,
                      )}
                    </div>
                    <div>
                      <span className="text-gray-500">Balance Amount:</span>{" "}
                      <span
                        className={
                          selectedCreditNote.balance !== 0
                            ? "text-red-500"
                            : "text-green-600"
                        }
                      >
                        {fmtCurrency(Math.abs(selectedCreditNote.balance))}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              {selectedCreditNote.status !== "Applied" &&
                selectedCreditNote.status !== "Approved" && (
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      openEditModal(selectedCreditNote);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit Credit Note
                  </button>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedCreditNote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Credit Note
              </h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {selectedCreditNote.creditNoteNumber}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCreditNote}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
