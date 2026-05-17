/**
 * File: src/pages/accounting/Vendors.tsx
 * Complete Vendors Management page with list view, create/edit modal, and details modal
 * Based on provided screenshots design
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

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
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  CreditCard,
  Eye,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { showToast } from "@/utils/toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Vendor {
  id: string;
  vendorCode: string;
  companyName: string;
  contactPerson: string;
  contactPersonEmail: string;
  contactPersonMobile: string;
  primaryEmail: string;
  primaryMobile: string;
  taxNumber: string;
  currencyCode: string;
  paymentTerms: string;
  creditLimit: number;
  user: string;
  billingAddress: {
    name: string;
    street: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  notes: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleVendors: Vendor[] = [
  {
    id: "1",
    vendorCode: "VEN-0001",
    companyName: "Pollich-Fay",
    contactPerson: "Miss Kyla Kub MD",
    contactPersonEmail: "ekirlin@bernier.com",
    contactPersonMobile: "+3041165018885",
    primaryEmail: "thjordyn@friesen.com",
    primaryMobile: "",
    taxNumber: "TAX-86010232",
    currencyCode: "USD",
    paymentTerms: "COD",
    creditLimit: 0,
    user: "Alex Vendor",
    billingAddress: {
      name: "Bart Kub",
      street: "9510 Parker Garden",
      street2: "Suite 948",
      city: "West Kirstinberg",
      state: "Colorado",
      zip: "13477",
      country: "Guernsey",
    },
    notes: "Vel velit adipisci quo sed.",
  },
  {
    id: "2",
    vendorCode: "VEN-0002",
    companyName: "Grady, Hane and Bruen",
    contactPerson: "Erin Gusikowski",
    contactPersonEmail: "altenwerth.jordyn@friesen.com",
    contactPersonMobile: "+1234567890",
    primaryEmail: "contact@grady.com",
    primaryMobile: "",
    taxNumber: "TAX-64646361",
    currencyCode: "USD",
    paymentTerms: "Net 30",
    creditLimit: 50000,
    user: "Sam Supplier",
    billingAddress: {
      name: "Erin Gusikowski",
      street: "123 Business Ave",
      street2: "",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "USA",
    },
    notes: "",
  },
  {
    id: "3",
    vendorCode: "VEN-0003",
    companyName: "Lockman-Zboncak",
    contactPerson: "Jordi Haley",
    contactPersonEmail: "madilyn50@hessel.com",
    contactPersonMobile: "+1234567890",
    primaryEmail: "info@lockman.com",
    primaryMobile: "",
    taxNumber: "TAX-59933203",
    currencyCode: "USD",
    paymentTerms: "Net 45",
    creditLimit: 75000,
    user: "Tech Solutions Inc",
    billingAddress: {
      name: "Jordi Haley",
      street: "456 Tech Park",
      street2: "",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "USA",
    },
    notes: "",
  },
  {
    id: "4",
    vendorCode: "VEN-0004",
    companyName: "Cruickshank-Goyette",
    contactPerson: "Xander Skiles",
    contactPersonEmail: "kassulke.makenna@white.com",
    contactPersonMobile: "+1234567890",
    primaryEmail: "sales@cruickshank.com",
    primaryMobile: "",
    taxNumber: "TAX-30215366",
    currencyCode: "USD",
    paymentTerms: "Net 30",
    creditLimit: 100000,
    user: "Global Supplies Co",
    billingAddress: {
      name: "Xander Skiles",
      street: "789 Supply Chain Blvd",
      street2: "",
      city: "Atlanta",
      state: "GA",
      zip: "30309",
      country: "USA",
    },
    notes: "",
  },
  {
    id: "5",
    vendorCode: "VEN-0005",
    companyName: "Williamson, Howe and Wisozk",
    contactPerson: "Kaleb Nikolaus",
    contactPersonEmail: "gmuller@beahan.biz",
    contactPersonMobile: "+1234567890",
    primaryEmail: "info@williamson.com",
    primaryMobile: "",
    taxNumber: "TAX-41523171",
    currencyCode: "USD",
    paymentTerms: "Net 60",
    creditLimit: 150000,
    user: "Prime Materials Ltd",
    billingAddress: {
      name: "Kaleb Nikolaus",
      street: "321 Industrial Blvd",
      street2: "",
      city: "Detroit",
      state: "MI",
      zip: "48201",
      country: "USA",
    },
    notes: "",
  },
  {
    id: "6",
    vendorCode: "VEN-0006",
    companyName: "Rosenbaum, Romaguera and Paucek",
    contactPerson: "Mrs. Fatima Moen DDS",
    contactPersonEmail: "williamson.gudrun@glover.com",
    contactPersonMobile: "+1234567890",
    primaryEmail: "contact@rosenbaum.com",
    primaryMobile: "",
    taxNumber: "TAX-15876103",
    currencyCode: "USD",
    paymentTerms: "Net 30",
    creditLimit: 50000,
    user: "Elite Vendors Group",
    billingAddress: {
      name: "Fatima Moen",
      street: "555 Elite Way",
      street2: "",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
    },
    notes: "",
  },
  {
    id: "7",
    vendorCode: "VEN-0007",
    companyName: "Abshire, Hauck and Sanford",
    contactPerson: "Elroy Hirthe",
    contactPersonEmail: "vrosenbaum@breitenberg.com",
    contactPersonMobile: "+1234567890",
    primaryEmail: "parts@abshire.com",
    primaryMobile: "",
    taxNumber: "TAX-42881628",
    currencyCode: "USD",
    paymentTerms: "Net 15",
    creditLimit: 25000,
    user: "Quality Parts Corp",
    billingAddress: {
      name: "Elroy Hirthe",
      street: "777 Quality Drive",
      street2: "",
      city: "Cleveland",
      state: "OH",
      zip: "44101",
      country: "USA",
    },
    notes: "",
  },
  {
    id: "8",
    vendorCode: "VEN-0008",
    companyName: "Lakin-Metz",
    contactPerson: "Janae Langworth",
    contactPersonEmail: "sharon.balistreri@beer.com",
    contactPersonMobile: "+1234567890",
    primaryEmail: "logistics@lakin.com",
    primaryMobile: "",
    taxNumber: "TAX-15141708",
    currencyCode: "USD",
    paymentTerms: "Net 30",
    creditLimit: 60000,
    user: "Swift Logistics",
    billingAddress: {
      name: "Janae Langworth",
      street: "888 Swift Road",
      street2: "",
      city: "Dallas",
      state: "TX",
      zip: "75201",
      country: "USA",
    },
    notes: "",
  },
  {
    id: "9",
    vendorCode: "VEN-0009",
    companyName: "Goodwin, Beatty and Mayer",
    contactPerson: "Mrs. Josephine Huels",
    contactPersonEmail: "portiz@yost.com",
    contactPersonMobile: "+1234567890",
    primaryEmail: "sales@goodwin.com",
    primaryMobile: "",
    taxNumber: "TAX-69273268",
    currencyCode: "USD",
    paymentTerms: "Net 30",
    creditLimit: 80000,
    user: "Mega Distributors",
    billingAddress: {
      name: "Josephine Huels",
      street: "999 Mega Drive",
      street2: "",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "USA",
    },
    notes: "",
  },
];

const paymentTermsOptions = [
  "Net 30",
  "Net 45",
  "Net 60",
  "COD",
  "Due on Receipt",
  "Net 15",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

type SortField =
  | "vendorCode"
  | "companyName"
  | "contactPerson"
  | "email"
  | "taxNumber";
type SortDir = "asc" | "desc";

// ─── Main Vendors Component ──────────────────────────────────────────────────

export const AccountsVendors: React.FC = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<Vendor[]>(sampleVendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("vendorCode");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    companyName: "",
    vendorCode: "",
    contactPerson: "",
    contactPersonEmail: "",
    contactPersonMobile: "",
    primaryEmail: "",
    primaryMobile: "",
    taxNumber: "",
    currencyCode: "USD",
    paymentTerms: "Net 30",
    creditLimit: 0,
    user: "",
    billingName: "",
    billingAddress: "",
    billingAddress2: "",
    billingCity: "",
    billingState: "",
    billingZip: "",
    billingCountry: "",
    notes: "",
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

  const filteredVendors = useMemo(() => {
    let result = [...vendors];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.companyName.toLowerCase().includes(q) ||
          v.contactPerson.toLowerCase().includes(q) ||
          v.vendorCode.toLowerCase().includes(q) ||
          v.contactPersonEmail.toLowerCase().includes(q),
      );
    }
    result.sort((a, b) => {
      let aVal = (a as any)[sortField];
      let bVal = (b as any)[sortField];
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [vendors, searchQuery, sortField, sortDir]);

  const totalPages = Math.ceil(filteredVendors.length / perPage);
  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const resetForm = () => {
    const nextCode = `VEN-${String(vendors.length + 1).padStart(4, "0")}`;
    setFormData({
      companyName: "",
      vendorCode: nextCode,
      contactPerson: "",
      contactPersonEmail: "",
      contactPersonMobile: "",
      primaryEmail: "",
      primaryMobile: "",
      taxNumber: "",
      currencyCode: "USD",
      paymentTerms: "Net 30",
      creditLimit: 0,
      user: "",
      billingName: "",
      billingAddress: "",
      billingAddress2: "",
      billingCity: "",
      billingState: "",
      billingZip: "",
      billingCountry: "",
      notes: "",
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setFormData({
      companyName: vendor.companyName,
      vendorCode: vendor.vendorCode,
      contactPerson: vendor.contactPerson,
      contactPersonEmail: vendor.contactPersonEmail,
      contactPersonMobile: vendor.contactPersonMobile,
      primaryEmail: vendor.primaryEmail,
      primaryMobile: vendor.primaryMobile,
      taxNumber: vendor.taxNumber,
      currencyCode: vendor.currencyCode,
      paymentTerms: vendor.paymentTerms,
      creditLimit: vendor.creditLimit,
      user: vendor.user,
      billingName: vendor.billingAddress.name,
      billingAddress: vendor.billingAddress.street,
      billingAddress2: vendor.billingAddress.street2,
      billingCity: vendor.billingAddress.city,
      billingState: vendor.billingAddress.state,
      billingZip: vendor.billingAddress.zip,
      billingCountry: vendor.billingAddress.country,
      notes: vendor.notes,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openViewModal = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowViewModal(true);
  };

  const openDeleteModal = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowDeleteModal(true);
  };

  const handleSaveVendor = () => {
    if (!formData.companyName) {
      showToast("Please enter company name", "info");
      return;
    }
    if (!formData.contactPerson) {
      showToast("Please enter contact person", "info");
      return;
    }

    if (isEditing && selectedVendor) {
      setVendors((prev) =>
        prev.map((v) =>
          v.id === selectedVendor.id
            ? {
                ...v,
                companyName: formData.companyName,
                vendorCode: formData.vendorCode,
                contactPerson: formData.contactPerson,
                contactPersonEmail: formData.contactPersonEmail,
                contactPersonMobile: formData.contactPersonMobile,
                primaryEmail: formData.primaryEmail,
                primaryMobile: formData.primaryMobile,
                taxNumber: formData.taxNumber,
                currencyCode: formData.currencyCode,
                paymentTerms: formData.paymentTerms,
                creditLimit: formData.creditLimit,
                user: formData.user,
                billingAddress: {
                  name: formData.billingName,
                  street: formData.billingAddress,
                  street2: formData.billingAddress2,
                  city: formData.billingCity,
                  state: formData.billingState,
                  zip: formData.billingZip,
                  country: formData.billingCountry,
                },
                notes: formData.notes,
              }
            : v,
        ),
      );
      showToast("Vendor updated successfully!", "success");
      setShowEditModal(false);
    } else {
      const newVendor: Vendor = {
        id: Date.now().toString(),
        companyName: formData.companyName,
        vendorCode: formData.vendorCode,
        contactPerson: formData.contactPerson,
        contactPersonEmail: formData.contactPersonEmail,
        contactPersonMobile: formData.contactPersonMobile,
        primaryEmail: formData.primaryEmail,
        primaryMobile: formData.primaryMobile,
        taxNumber: formData.taxNumber,
        currencyCode: formData.currencyCode,
        paymentTerms: formData.paymentTerms,
        creditLimit: formData.creditLimit,
        user: formData.user,
        billingAddress: {
          name: formData.billingName,
          street: formData.billingAddress,
          street2: formData.billingAddress2,
          city: formData.billingCity,
          state: formData.billingState,
          zip: formData.billingZip,
          country: formData.billingCountry,
        },
        notes: formData.notes,
      };
      setVendors((prev) => [newVendor, ...prev]);
      showToast("Vendor created successfully!", "success");
      setShowCreateModal(false);
    }
    resetForm();
  };

  const handleDeleteVendor = () => {
    if (selectedVendor) {
      setVendors((prev) => prev.filter((v) => v.id !== selectedVendor.id));
      showToast("Vendor deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedVendor(null);
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

  // ─── Modals ─────────────────────────────────────────────────────────────────

  const CreateEditModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Vendor" : "Create Vendor"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing
                ? "Update vendor information"
                : "Add a new vendor to your system"}
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetForm();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor Code
              </label>
              <input
                type="text"
                value={formData.vendorCode}
                onChange={(e) =>
                  setFormData({ ...formData, vendorCode: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50"
                readOnly={isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) =>
                  setFormData({ ...formData, contactPerson: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person Email
              </label>
              <input
                type="email"
                value={formData.contactPersonEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactPersonEmail: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person Mobile
              </label>
              <input
                type="text"
                value={formData.contactPersonMobile}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactPersonMobile: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                Format: +[country code][phone number]
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Email
              </label>
              <input
                type="email"
                value={formData.primaryEmail}
                onChange={(e) =>
                  setFormData({ ...formData, primaryEmail: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Mobile
              </label>
              <input
                type="text"
                value={formData.primaryMobile}
                onChange={(e) =>
                  setFormData({ ...formData, primaryMobile: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Number
              </label>
              <input
                type="text"
                value={formData.taxNumber}
                onChange={(e) =>
                  setFormData({ ...formData, taxNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency Code
              </label>
              <select
                value={formData.currencyCode}
                onChange={(e) =>
                  setFormData({ ...formData, currencyCode: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Terms
              </label>
              <select
                value={formData.paymentTerms}
                onChange={(e) =>
                  setFormData({ ...formData, paymentTerms: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                {paymentTermsOptions.map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credit Limit
              </label>
              <input
                type="number"
                min={0}
                value={formData.creditLimit || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    creditLimit: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User
              </label>
              <input
                type="text"
                value={formData.user}
                onChange={(e) =>
                  setFormData({ ...formData, user: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Billing Address */}
          <div className="border-t border-gray-200 pt-4 mt-2 mb-4">
            <h3 className="font-medium text-gray-900 mb-3">Billing Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Name
                </label>
                <input
                  type="text"
                  value={formData.billingName}
                  onChange={(e) =>
                    setFormData({ ...formData, billingName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Address
                </label>
                <input
                  type="text"
                  value={formData.billingAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, billingAddress: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={formData.billingAddress2}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      billingAddress2: e.target.value,
                    })
                  }
                  placeholder="Apartment, suite, etc. (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.billingCity}
                  onChange={(e) =>
                    setFormData({ ...formData, billingCity: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={formData.billingState}
                  onChange={(e) =>
                    setFormData({ ...formData, billingState: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code
                </label>
                <input
                  type="text"
                  value={formData.billingZip}
                  onChange={(e) =>
                    setFormData({ ...formData, billingZip: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.billingCountry}
                  onChange={(e) =>
                    setFormData({ ...formData, billingCountry: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetForm();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveVendor}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEditing ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );

  const ViewModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Vendor Details
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedVendor?.companyName}
            </p>
          </div>
          <button
            onClick={() => setShowViewModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {selectedVendor && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">Vendor Code</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedVendor.vendorCode}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Company Name</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedVendor.companyName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Contact Person</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedVendor.contactPerson}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Contact Person Email</p>
                <p className="text-sm text-gray-600">
                  {selectedVendor.contactPersonEmail}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Contact Person Mobile</p>
                <p className="text-sm text-gray-600">
                  {selectedVendor.contactPersonMobile}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Primary Email</p>
                <p className="text-sm text-gray-600">
                  {selectedVendor.primaryEmail || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Primary Mobile</p>
                <p className="text-sm text-gray-600">
                  {selectedVendor.primaryMobile || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tax Number</p>
                <p className="text-sm text-gray-600">
                  {selectedVendor.taxNumber}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Currency Code</p>
                <p className="text-sm text-gray-600">
                  {selectedVendor.currencyCode}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Payment Terms</p>
                <p className="text-sm text-gray-600">
                  {selectedVendor.paymentTerms}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Credit Limit</p>
                <p className="text-sm text-gray-600">
                  {selectedVendor.creditLimit > 0
                    ? `$${selectedVendor.creditLimit.toLocaleString()}`
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">User</p>
                <p className="text-sm text-gray-600">{selectedVendor.user}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-2 mb-4">
              <h3 className="font-medium text-gray-900 mb-3">
                Billing Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm text-gray-900">
                    {selectedVendor.billingAddress.name}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm text-gray-600">
                    {selectedVendor.billingAddress.street}
                  </p>
                  {selectedVendor.billingAddress.street2 && (
                    <p className="text-sm text-gray-600">
                      {selectedVendor.billingAddress.street2}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">City</p>
                  <p className="text-sm text-gray-600">
                    {selectedVendor.billingAddress.city}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">State</p>
                  <p className="text-sm text-gray-600">
                    {selectedVendor.billingAddress.state}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Zip Code</p>
                  <p className="text-sm text-gray-600">
                    {selectedVendor.billingAddress.zip}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Country</p>
                  <p className="text-sm text-gray-600">
                    {selectedVendor.billingAddress.country}
                  </p>
                </div>
              </div>
            </div>

            {selectedVendor.notes && (
              <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">Notes:</span>{" "}
                  {selectedVendor.notes}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => setShowViewModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={() => {
              setShowViewModal(false);
              if (selectedVendor) openEditModal(selectedVendor);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Vendor
          </button>
        </div>
      </div>
    </div>
  );

  const DeleteModal = () => (
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
            Delete Vendor
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedVendor?.companyName}</span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteVendor}
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
            onClick={() => navigate("/dashboard")}
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
          <span className="text-gray-900 font-medium">Vendors</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Vendors
          </h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Vendor"
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
                placeholder="Search vendors..."
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
                      Options
                    </span>
                  </div>
                  <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 text-gray-700">
                    Export CSV
                  </button>
                  <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 text-gray-700">
                    Export PDF
                  </button>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  User
                </th>
                <SortHeader field="vendorCode" label="Vendor Code" />
                <SortHeader field="companyName" label="Company Name" />
                <SortHeader field="contactPerson" label="Contact Person" />
                <SortHeader field="email" label="Email" />
                <SortHeader field="taxNumber" label="Tax Number" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">
                        {vendor.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="font-medium text-gray-900">
                        {vendor.user}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {vendor.vendorCode}
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    {vendor.companyName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {vendor.contactPerson}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {vendor.contactPersonEmail}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {vendor.taxNumber}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openViewModal(vendor)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(vendor)}
                        className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(vendor)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedVendors.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No vendors found.
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
            {filteredVendors.length === 0 ? 0 : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredVendors.length)} of{" "}
            {filteredVendors.length} results
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

      {/* Modals */}
      {(showCreateModal || showEditModal) && <CreateEditModal />}
      {showViewModal && <ViewModal />}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
};
