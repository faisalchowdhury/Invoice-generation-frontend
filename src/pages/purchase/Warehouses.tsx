/**
 * File: src/pages/warehouses/Warehouses.tsx
 * Complete Warehouses Management page with list view, create/edit modal, filters, pagination
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
  XCircle,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Warehouse {
  id: string;
  name: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  email: string;
  status: "Active" | "Inactive";
  country: string;
  state: string;
  manager: string;
  capacity: number;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleWarehouses: Warehouse[] = [
  {
    id: "1",
    name: "Central Distribution Center",
    address: "1250 Industrial Blvd",
    city: "Los Angeles",
    zipCode: "90021",
    phone: "+12135550101",
    email: "central@warehouse.com",
    status: "Active",
    country: "USA",
    state: "California",
    manager: "John Smith",
    capacity: 50000,
  },
  {
    id: "2",
    name: "East Coast Logistics Hub",
    address: "875 Commerce Drive",
    city: "Atlanta",
    zipCode: "30309",
    phone: "+14045550102",
    email: "eastcoast@warehouse.com",
    status: "Active",
    country: "USA",
    state: "Georgia",
    manager: "Sarah Johnson",
    capacity: 75000,
  },
  {
    id: "3",
    name: "West Coast Storage Facility",
    address: "2100 Pacific Avenue",
    city: "Seattle",
    zipCode: "98101",
    phone: "+12065550103",
    email: "westcoast@warehouse.com",
    status: "Active",
    country: "USA",
    state: "Washington",
    manager: "Michael Chen",
    capacity: 45000,
  },
  {
    id: "4",
    name: "Midwest Regional Warehouse",
    address: "3456 Manufacturing Way",
    city: "Chicago",
    zipCode: "60601",
    phone: "+13125550104",
    email: "midwest@warehouse.com",
    status: "Active",
    country: "USA",
    state: "Illinois",
    manager: "Emily Davis",
    capacity: 60000,
  },
  {
    id: "5",
    name: "Texas Distribution Point",
    address: "789 Freight Lane",
    city: "Dallas",
    zipCode: "75201",
    phone: "+12145550105",
    email: "texas@warehouse.com",
    status: "Active",
    country: "USA",
    state: "Texas",
    manager: "Robert Taylor",
    capacity: 55000,
  },
  {
    id: "6",
    name: "Florida Fulfillment Center",
    address: "1567 Logistics Park",
    city: "Miami",
    zipCode: "33101",
    phone: "+13055550106",
    email: "florida@warehouse.com",
    status: "Active",
    country: "USA",
    state: "Florida",
    manager: "Lisa Anderson",
    capacity: 40000,
  },
  {
    id: "7",
    name: "Northeast Storage Complex",
    address: "4321 Supply Chain Blvd",
    city: "Boston",
    zipCode: "02101",
    phone: "+16175550107",
    email: "northeast@warehouse.com",
    status: "Active",
    country: "USA",
    state: "Massachusetts",
    manager: "David Wilson",
    capacity: 65000,
  },
  {
    id: "8",
    name: "Southwest Depot",
    address: "987 Distribution Road",
    city: "Phoenix",
    zipCode: "85001",
    phone: "+16025550108",
    email: "southwest@warehouse.com",
    status: "Active",
    country: "USA",
    state: "Arizona",
    manager: "Jessica Martinez",
    capacity: 35000,
  },
  {
    id: "9",
    name: "Mountain Region Warehouse",
    address: "2468 Cargo Street",
    city: "Denver",
    zipCode: "80201",
    phone: "+13035550109",
    email: "mountain@warehouse.com",
    status: "Active",
    country: "USA",
    state: "Colorado",
    manager: "James Garcia",
    capacity: 30000,
  },
  {
    id: "10",
    name: "Pacific Northwest Hub",
    address: "5678 Harbor Drive",
    city: "Portland",
    zipCode: "97201",
    phone: "+15035550110",
    email: "pacific@warehouse.com",
    status: "Active",
    country: "USA",
    state: "Oregon",
    manager: "Amanda White",
    capacity: 42000,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

type SortField = "name" | "city" | "zipCode" | "phone" | "status";
type SortDir = "asc" | "desc";

// ─── Component ────────────────────────────────────────────────────────────────

export const Warehouses: React.FC = () => {
  const navigate = useNavigate();

  const [warehouses, setWarehouses] = useState<Warehouse[]>(sampleWarehouses);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
    null,
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState<Warehouse | null>(
    null,
  );

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
    email: "",
    status: "Active" as "Active" | "Inactive",
    country: "USA",
    state: "",
    manager: "",
    capacity: 0,
  });

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

  const filteredWarehouses = useMemo(() => {
    let result = [...warehouses];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.city.toLowerCase().includes(q) ||
          w.address.toLowerCase().includes(q) ||
          w.phone.includes(q),
      );
    }
    if (statusFilter !== "All") {
      result = result.filter((w) => w.status === statusFilter);
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
  }, [warehouses, searchQuery, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredWarehouses.length / perPage);
  const paginatedWarehouses = filteredWarehouses.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Status Badge ───────────────────────────────────────────────────────────

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 border border-green-200";
      case "Inactive":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "Active") {
      return <CheckCircle className="w-3 h-3" />;
    }
    return <XCircle className="w-3 h-3" />;
  };

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      zipCode: "",
      phone: "",
      email: "",
      status: "Active",
      country: "USA",
      state: "",
      manager: "",
      capacity: 0,
    });
    setEditingWarehouse(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      address: warehouse.address,
      city: warehouse.city,
      zipCode: warehouse.zipCode,
      phone: warehouse.phone,
      email: warehouse.email,
      status: warehouse.status,
      country: warehouse.country,
      state: warehouse.state,
      manager: warehouse.manager,
      capacity: warehouse.capacity,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const openDeleteModal = (warehouse: Warehouse) => {
    setWarehouseToDelete(warehouse);
    setShowDeleteModal(true);
  };

  const handleSaveWarehouse = () => {
    if (!formData.name) {
      showToast("Please enter warehouse name", "info");
      return;
    }
    if (!formData.address) {
      showToast("Please enter warehouse address", "info");
      return;
    }
    if (!formData.city) {
      showToast("Please enter city", "info");
      return;
    }
    if (!formData.zipCode) {
      showToast("Please enter zip code", "info");
      return;
    }

    if (isEditing && editingWarehouse) {
      setWarehouses((prev) =>
        prev.map((w) =>
          w.id === editingWarehouse.id
            ? {
                ...w,
                name: formData.name,
                address: formData.address,
                city: formData.city,
                zipCode: formData.zipCode,
                phone: formData.phone,
                email: formData.email,
                status: formData.status,
                country: formData.country,
                state: formData.state,
                manager: formData.manager,
                capacity: formData.capacity,
              }
            : w,
        ),
      );
      showToast("Warehouse updated successfully!", "success");
    } else {
      const newWarehouse: Warehouse = {
        id: Date.now().toString(),
        name: formData.name,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        phone: formData.phone,
        email: formData.email,
        status: formData.status,
        country: formData.country,
        state: formData.state,
        manager: formData.manager,
        capacity: formData.capacity,
      };
      setWarehouses((prev) => [...prev, newWarehouse]);
      showToast("Warehouse created successfully!", "success");
    }
    setShowModal(false);
    resetForm();
  };

  const handleDeleteWarehouse = () => {
    if (warehouseToDelete) {
      setWarehouses((prev) =>
        prev.filter((w) => w.id !== warehouseToDelete.id),
      );
      showToast("Warehouse deleted successfully!", "success");
      setShowDeleteModal(false);
      setWarehouseToDelete(null);
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
          <span className="text-gray-900 font-medium">Warehouses</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Warehouses
          </h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Warehouse"
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
                placeholder="Search warehouses..."
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
                  {["All", "Active", "Inactive"].map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setStatusFilter(st);
                        setCurrentPage(1);
                        setShowFilters(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${
                        statusFilter === st
                          ? "text-blue-600 font-medium bg-blue-50"
                          : "text-gray-700"
                      }`}
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
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="name" label="Name" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Address
                </th>
                <SortHeader field="city" label="City" />
                <SortHeader field="zipCode" label="Zip Code" />
                <SortHeader field="phone" label="Phone" />
                <SortHeader field="status" label="Status" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedWarehouses.map((warehouse) => (
                <tr key={warehouse.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {warehouse.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {warehouse.address}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{warehouse.city}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {warehouse.zipCode}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      {warehouse.phone}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        warehouse.status,
                      )}`}
                    >
                      {getStatusIcon(warehouse.status)}
                      {warehouse.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(warehouse)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(warehouse)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedWarehouses.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No warehouses found.
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
            {filteredWarehouses.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredWarehouses.length)} of{" "}
            {filteredWarehouses.length} results
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

      {/* Create/Edit Warehouse Modal - Transparent Background */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {isEditing ? "Edit Warehouse" : "Create Warehouse"}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {isEditing
                    ? "Update warehouse information"
                    : "Add a new warehouse to your inventory"}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter warehouse name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Enter full address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="Enter city"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zip Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) =>
                      setFormData({ ...formData, zipCode: e.target.value })
                    }
                    placeholder="Enter zip code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Format: [country code][phone number]
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    placeholder="Enter state"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    placeholder="Enter country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manager Name
                  </label>
                  <input
                    type="text"
                    value={formData.manager}
                    onChange={(e) =>
                      setFormData({ ...formData, manager: e.target.value })
                    }
                    placeholder="Enter manager name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity (sq ft)
                  </label>
                  <input
                    type="number"
                    value={formData.capacity || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacity: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter capacity"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
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
                        status: e.target.value as "Active" | "Inactive",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
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
                onClick={handleSaveWarehouse}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                {isEditing ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && warehouseToDelete && (
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
                Delete Warehouse
              </h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{warehouseToDelete.name}</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteWarehouse}
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
