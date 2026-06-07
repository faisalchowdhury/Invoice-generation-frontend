/**
 * File: src/pages/transfers/Transfers.tsx
 * Complete Transfers Management page with list view, create/edit modal, filters, pagination
 * Based on existing pattern — matching exact color codes and design style
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
  CheckCircle,
  Clock,
  ArrowRight,
  Package,
  Warehouse,
  Calendar,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Transfer {
  id: string;
  product: string;
  fromWarehouse: string;
  toWarehouse: string;
  quantity: number;
  date: string;
  status: "Completed" | "Pending" | "In Transit";
  referenceNumber: string;
  notes: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleTransfers: Transfer[] = [
  {
    id: "1",
    product: "Face Cream",
    fromWarehouse: "Southwest Depot",
    toWarehouse: "West Coast Storage Facility",
    quantity: 11,
    date: "2026-06-17",
    status: "Completed",
    referenceNumber: "TR-2026-06-017",
    notes: "",
  },
  {
    id: "2",
    product: "Watch",
    fromWarehouse: "Mid-Atlantic Warehouse",
    toWarehouse: "East Coast Logistics Hub",
    quantity: 10,
    date: "2026-06-06",
    status: "Completed",
    referenceNumber: "TR-2026-06-006",
    notes: "",
  },
  {
    id: "3",
    product: "Coffee",
    fromWarehouse: "Southern Distribution Hub",
    toWarehouse: "Central Distribution Center",
    quantity: 18,
    date: "2026-05-31",
    status: "In Transit",
    referenceNumber: "TR-2026-05-031",
    notes: "",
  },
  {
    id: "4",
    product: "Raspberry",
    fromWarehouse: "Great Lakes Storage",
    toWarehouse: "Florida Fulfillment Center",
    quantity: 25,
    date: "2026-05-25",
    status: "Completed",
    referenceNumber: "TR-2026-05-025",
    notes: "",
  },
  {
    id: "5",
    product: "Ink Cartridge",
    fromWarehouse: "Midwest Regional Warehouse",
    toWarehouse: "Mountain Region Warehouse",
    quantity: 5,
    date: "2026-05-15",
    status: "Completed",
    referenceNumber: "TR-2026-05-015",
    notes: "",
  },
  {
    id: "6",
    product: "Football",
    fromWarehouse: "West Coast Storage Facility",
    toWarehouse: "Florida Fulfillment Center",
    quantity: 10,
    date: "2026-05-05",
    status: "Completed",
    referenceNumber: "TR-2026-05-005",
    notes: "",
  },
  {
    id: "7",
    product: "Car Engine Oil",
    fromWarehouse: "Central Distribution Center",
    toWarehouse: "Southwest Depot",
    quantity: 8,
    date: "2026-04-16",
    status: "Completed",
    referenceNumber: "TR-2026-04-016",
    notes: "",
  },
  {
    id: "8",
    product: "Yoga Mat",
    fromWarehouse: "Northeast Storage Complex",
    toWarehouse: "Great Lakes Storage",
    quantity: 10,
    date: "2026-04-02",
    status: "Pending",
    referenceNumber: "TR-2026-04-002",
    notes: "",
  },
  {
    id: "9",
    product: "Apple",
    fromWarehouse: "Mountain Region Warehouse",
    toWarehouse: "West Coast Storage Facility",
    quantity: 5,
    date: "2026-03-21",
    status: "Completed",
    referenceNumber: "TR-2026-03-021",
    notes: "",
  },
];

const warehouses = [
  "Southwest Depot",
  "West Coast Storage Facility",
  "Mid-Atlantic Warehouse",
  "East Coast Logistics Hub",
  "Southern Distribution Hub",
  "Central Distribution Center",
  "Great Lakes Storage",
  "Florida Fulfillment Center",
  "Midwest Regional Warehouse",
  "Mountain Region Warehouse",
  "Northeast Storage Complex",
];

const products = [
  "Face Cream",
  "Watch",
  "Coffee",
  "Raspberry",
  "Ink Cartridge",
  "Football",
  "Car Engine Oil",
  "Yoga Mat",
  "Apple",
  "Laptop",
  "Mobile Phone",
  "Headphones",
  "Smart Watch",
  "Tablet",
  "Printer",
  "Monitor",
  "Keyboard",
  "Mouse",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

type SortField =
  | "product"
  | "fromWarehouse"
  | "toWarehouse"
  | "quantity"
  | "date";
type SortDir = "asc" | "desc";

// ─── Component ────────────────────────────────────────────────────────────────

export const Transfers: React.FC = () => {
  const navigate = useNavigate();

  const [transfers, setTransfers] = useState<Transfer[]>(sampleTransfers);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transferToDelete, setTransferToDelete] = useState<Transfer | null>(
    null,
  );

  // Form state
  const [formData, setFormData] = useState({
    product: "",
    fromWarehouse: "",
    toWarehouse: "",
    quantity: 1,
    date: new Date().toISOString().split("T")[0],
    status: "Pending" as "Completed" | "Pending" | "In Transit",
    notes: "",
  });

  // Filtered products based on fromWarehouse selection (mock)
  const getAvailableProducts = () => {
    if (!formData.fromWarehouse) {
      return [];
    }
    return products;
  };

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

  const filteredTransfers = useMemo(() => {
    let result = [...transfers];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.product.toLowerCase().includes(q) ||
          t.fromWarehouse.toLowerCase().includes(q) ||
          t.toWarehouse.toLowerCase().includes(q) ||
          t.referenceNumber.toLowerCase().includes(q),
      );
    }
    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [transfers, searchQuery, sortField, sortDir]);

  const totalPages = Math.ceil(filteredTransfers.length / perPage);
  const paginatedTransfers = filteredTransfers.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Status Badge ───────────────────────────────────────────────────────────

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 border border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "In Transit":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "Completed") {
      return <CheckCircle className="w-3 h-3" />;
    }
    if (status === "Pending") {
      return <Clock className="w-3 h-3" />;
    }
    return <Package className="w-3 h-3" />;
  };

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormData({
      product: "",
      fromWarehouse: "",
      toWarehouse: "",
      quantity: 1,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      notes: "",
    });
    setEditingTransfer(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (transfer: Transfer) => {
    setEditingTransfer(transfer);
    setFormData({
      product: transfer.product,
      fromWarehouse: transfer.fromWarehouse,
      toWarehouse: transfer.toWarehouse,
      quantity: transfer.quantity,
      date: transfer.date,
      status: transfer.status,
      notes: transfer.notes,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const openDeleteModal = (transfer: Transfer) => {
    setTransferToDelete(transfer);
    setShowDeleteModal(true);
  };

  const handleSaveTransfer = () => {
    if (!formData.fromWarehouse) {
      showToast("Please select from warehouse", "info");
      return;
    }
    if (!formData.toWarehouse) {
      showToast("Please select to warehouse", "info");
      return;
    }
    if (formData.fromWarehouse === formData.toWarehouse) {
      showToast("From warehouse and To warehouse cannot be the same", "info");
      return;
    }
    if (!formData.product) {
      showToast("Please select a product", "info");
      return;
    }
    if (!formData.quantity || formData.quantity < 1) {
      showToast("Please enter a valid quantity", "info");
      return;
    }

    const referenceNumber = `TR-${formData.date}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;

    if (isEditing && editingTransfer) {
      setTransfers((prev) =>
        prev.map((t) =>
          t.id === editingTransfer.id
            ? {
                ...t,
                product: formData.product,
                fromWarehouse: formData.fromWarehouse,
                toWarehouse: formData.toWarehouse,
                quantity: formData.quantity,
                date: formData.date,
                status: formData.status,
                notes: formData.notes,
              }
            : t,
        ),
      );
      showToast("Transfer updated successfully!", "success");
    } else {
      const newTransfer: Transfer = {
        id: Date.now().toString(),
        product: formData.product,
        fromWarehouse: formData.fromWarehouse,
        toWarehouse: formData.toWarehouse,
        quantity: formData.quantity,
        date: formData.date,
        status: formData.status,
        referenceNumber: referenceNumber,
        notes: formData.notes,
      };
      setTransfers((prev) => [newTransfer, ...prev]);
      showToast("Transfer created successfully!", "success");
    }
    setShowModal(false);
    resetForm();
  };

  const handleDeleteTransfer = () => {
    if (transferToDelete) {
      setTransfers((prev) => prev.filter((t) => t.id !== transferToDelete.id));
      showToast("Transfer deleted successfully!", "success");
      setShowDeleteModal(false);
      setTransferToDelete(null);
    }
  };

  // Handle from warehouse change
  const handleFromWarehouseChange = (value: string) => {
    setFormData({ ...formData, fromWarehouse: value, product: "" });
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
  // MAIN LIST VIEW
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
          <span className="text-gray-900 font-medium">Transfers</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Transfers
          </h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Transfer"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transfers..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-64 pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              onClick={() => showToast("Search applied", "info")}
              className="px-4 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
            >
              Search
            </button>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            {/* Per Page */}
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

            {/* Filters */}
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
                  {["All", "Completed", "Pending", "In Transit"].map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        // Filter logic would go here
                        setShowFilters(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 text-gray-700"
                    >
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="product" label="Product" />
                <SortHeader field="fromWarehouse" label="From Warehouse" />
                <SortHeader field="toWarehouse" label="To Warehouse" />
                <SortHeader field="quantity" label="Quantity" />
                <SortHeader field="date" label="Date" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedTransfers.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {transfer.product}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Warehouse className="w-3.5 h-3.5 text-gray-400" />
                      {transfer.fromWarehouse}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      {transfer.toWarehouse}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    {transfer.quantity}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{transfer.date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        transfer.status,
                      )}`}
                    >
                      {getStatusIcon(transfer.status)}
                      {transfer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(transfer)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(transfer)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedTransfers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No transfers found.
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
            {filteredTransfers.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredTransfers.length)} of{" "}
            {filteredTransfers.length} results
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-sm rounded-md flex items-center justify-center ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
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

      {/* Create/Edit Transfer Modal - Transparent Background */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {isEditing ? "Edit Transfer" : "Create Transfer"}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {isEditing
                    ? "Update transfer information"
                    : "Create a new stock transfer between warehouses"}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Warehouse <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.fromWarehouse}
                    onChange={(e) => handleFromWarehouseChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="">Select warehouse</option>
                    {warehouses.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Warehouse <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.toWarehouse}
                    onChange={(e) =>
                      setFormData({ ...formData, toWarehouse: e.target.value })
                    }
                    disabled={!formData.fromWarehouse}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {formData.fromWarehouse
                        ? "Select warehouse"
                        : "Select from warehouse first"}
                    </option>
                    {formData.fromWarehouse &&
                      warehouses
                        .filter((w) => w !== formData.fromWarehouse)
                        .map((w) => (
                          <option key={w} value={w}>
                            {w}
                          </option>
                        ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.product}
                    onChange={(e) =>
                      setFormData({ ...formData, product: e.target.value })
                    }
                    disabled={!formData.fromWarehouse}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {formData.fromWarehouse
                        ? "Select product"
                        : "Select from warehouse first"}
                    </option>
                    {getAvailableProducts().map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as
                          | "Completed"
                          | "Pending"
                          | "In Transit",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Additional notes..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTransfer}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                {isEditing ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && transferToDelete && (
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
                Delete Transfer
              </h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete this transfer for{" "}
                <span className="font-semibold">
                  {transferToDelete.product}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteTransfer}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
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
