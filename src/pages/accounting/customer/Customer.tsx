/**
 * File: src/pages/accounting/Customers.tsx
 * Complete Customers Management page with list view, customer details, and edit form
 * Based on provided screenshots design
 */

import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "../../../utils/toast";
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
  TrendingUp,
  TrendingDown,
  CreditCard,
  Download,
  Printer,
  Eye,
  Save,
  Calendar,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Customer {
  id: string;
  customerCode: string;
  companyName: string;
  contactPerson: string;
  contactPersonEmail: string;
  contactPersonMobile: string;
  email: string;
  taxNumber: string;
  paymentTerms: string;
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
  shippingAddress: {
    name: string;
    street: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  notes: string;
  startDate: string;
  endDate: string;
  totalInvoiced: number;
  totalReturns: number;
  totalCreditNotes: number;
  totalPayments: number;
  balance: number;
}

interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: "Draft" | "Paid" | "Posted" | "Partial";
  subtotal: number;
  tax: number;
  totalAmount: number;
  balance: number;
}

interface SalesReturn {
  id: string;
  returnNumber: string;
  date: string;
  status: "Draft" | "Completed" | "Approved" | "Rejected";
  subtotal: number;
  tax: number;
  totalAmount: number;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleCustomers: Customer[] = [
  {
    id: "1",
    customerCode: "CUST-0001",
    companyName: "Rath LLC",
    contactPerson: "Sally Mohr",
    contactPersonEmail: "xhills@raynor.com",
    contactPersonMobile: "+3368724832402",
    email: "sarah.johnson@client.com",
    taxNumber: "TAX-56492726",
    paymentTerms: "Net 60",
    user: "Sarah Johnson",
    billingAddress: {
      name: "Dr. Benjamin Mayer I",
      street: "17952 Adams Cliff Suite 425",
      street2: "",
      city: "North Lillaland",
      state: "North Carolina",
      zip: "91876-0828",
      country: "Suriname",
    },
    shippingAddress: {
      name: "Ms. Hassie Koch",
      street: "3531 Hane Common Suite 795",
      street2: "",
      city: "Bayerland",
      state: "Virginia",
      zip: "41016-8438",
      country: "Denmark",
    },
    notes: "Voluptatum aperiam qui et incidunt qui.",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    totalInvoiced: 2900.97,
    totalReturns: 354.0,
    totalCreditNotes: 0,
    totalPayments: 2371.97,
    balance: -25.0,
  },
  {
    id: "2",
    customerCode: "CUST-0002",
    companyName: "Mohr LLC",
    contactPerson: "Mrs. Kelsi Heaney Sr.",
    contactPersonEmail: "jerde.esperanza@corwin.info",
    contactPersonMobile: "+1234567890",
    email: "emily.davis@client.com",
    taxNumber: "TAX-64945903",
    paymentTerms: "Net 30",
    user: "Emily Davis",
    billingAddress: {
      name: "Emily Davis",
      street: "123 Business Ave",
      street2: "",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "USA",
    },
    shippingAddress: {
      name: "Emily Davis",
      street: "123 Business Ave",
      street2: "",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "USA",
    },
    notes: "",
    startDate: "2026-01-15",
    endDate: "2026-12-31",
    totalInvoiced: 0,
    totalReturns: 0,
    totalCreditNotes: 0,
    totalPayments: 0,
    balance: 0,
  },
  {
    id: "3",
    customerCode: "CUST-0003",
    companyName: "Toy, Tillman and Harris",
    contactPerson: "Bertrand Parker",
    contactPersonEmail: "alejandrin.hickle@walker.com",
    contactPersonMobile: "+1234567890",
    email: "lisa.anderson@client.com",
    taxNumber: "TAX-38934565",
    paymentTerms: "Net 30",
    user: "Lisa Anderson",
    billingAddress: {
      name: "Lisa Anderson",
      street: "456 Oak Street",
      street2: "",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "USA",
    },
    shippingAddress: {
      name: "Lisa Anderson",
      street: "456 Oak Street",
      street2: "",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "USA",
    },
    notes: "",
    startDate: "2026-02-01",
    endDate: "2026-12-31",
    totalInvoiced: 0,
    totalReturns: 0,
    totalCreditNotes: 0,
    totalPayments: 0,
    balance: 0,
  },
  {
    id: "4",
    customerCode: "CUST-0004",
    companyName: "Labadie, Homenick and Wolf",
    contactPerson: "Arne Hyatt",
    contactPersonEmail: "lveum@harvey.net",
    contactPersonMobile: "+1234567890",
    email: "jennifer.martinez@client.com",
    taxNumber: "TAX-06088033",
    paymentTerms: "Net 45",
    user: "Jennifer Martinez",
    billingAddress: {
      name: "Jennifer Martinez",
      street: "789 Pine Street",
      street2: "",
      city: "Miami",
      state: "FL",
      zip: "33101",
      country: "USA",
    },
    shippingAddress: {
      name: "Jennifer Martinez",
      street: "789 Pine Street",
      street2: "",
      city: "Miami",
      state: "FL",
      zip: "33101",
      country: "USA",
    },
    notes: "",
    startDate: "2026-02-15",
    endDate: "2026-12-31",
    totalInvoiced: 0,
    totalReturns: 0,
    totalCreditNotes: 0,
    totalPayments: 0,
    balance: 0,
  },
  {
    id: "5",
    customerCode: "CUST-0005",
    companyName: "Welch and Sons",
    contactPerson: "Denis Eichmann",
    contactPersonEmail: "flossie18@bayer.info",
    contactPersonMobile: "+1234567890",
    email: "maria.rodriguez@client.com",
    taxNumber: "TAX-73194026",
    paymentTerms: "Net 30",
    user: "Maria Rodriguez",
    billingAddress: {
      name: "Maria Rodriguez",
      street: "321 Cedar Road",
      street2: "",
      city: "Dallas",
      state: "TX",
      zip: "75201",
      country: "USA",
    },
    shippingAddress: {
      name: "Maria Rodriguez",
      street: "321 Cedar Road",
      street2: "",
      city: "Dallas",
      state: "TX",
      zip: "75201",
      country: "USA",
    },
    notes: "",
    startDate: "2026-03-01",
    endDate: "2026-12-31",
    totalInvoiced: 0,
    totalReturns: 0,
    totalCreditNotes: 0,
    totalPayments: 0,
    balance: 0,
  },
  {
    id: "6",
    customerCode: "CUST-0006",
    companyName: "Koepp, Stokes and Schinner",
    contactPerson: "Mrs. Kari Reichert I",
    contactPersonEmail: "blick.katharina@luettgen.com",
    contactPersonMobile: "+1234567890",
    email: "amanda.white@client.com",
    taxNumber: "TAX-69481837",
    paymentTerms: "Net 60",
    user: "Amanda White",
    billingAddress: {
      name: "Amanda White",
      street: "555 Birch Lane",
      street2: "",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      country: "USA",
    },
    shippingAddress: {
      name: "Amanda White",
      street: "555 Birch Lane",
      street2: "",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      country: "USA",
    },
    notes: "",
    startDate: "2026-03-15",
    endDate: "2026-12-31",
    totalInvoiced: 0,
    totalReturns: 0,
    totalCreditNotes: 0,
    totalPayments: 0,
    balance: 0,
  },
  {
    id: "7",
    customerCode: "CUST-0007",
    companyName: "Cartwright, Mertz and Ryan",
    contactPerson: "Ms. Antonietta Schroeder",
    contactPersonEmail: "kschneider@rosenbaeum.com",
    contactPersonMobile: "+1234567890",
    email: "jessica.harris@client.com",
    taxNumber: "TAX-23841921",
    paymentTerms: "Net 30",
    user: "Jessica Harris",
    billingAddress: {
      name: "Jessica Harris",
      street: "777 Elm Street",
      street2: "",
      city: "Denver",
      state: "CO",
      zip: "80201",
      country: "USA",
    },
    shippingAddress: {
      name: "Jessica Harris",
      street: "777 Elm Street",
      street2: "",
      city: "Denver",
      state: "CO",
      zip: "80201",
      country: "USA",
    },
    notes: "",
    startDate: "2026-04-01",
    endDate: "2026-12-31",
    totalInvoiced: 0,
    totalReturns: 0,
    totalCreditNotes: 0,
    totalPayments: 0,
    balance: 0,
  },
  {
    id: "8",
    customerCode: "CUST-0008",
    companyName: "Abshire-Lindgren",
    contactPerson: "Maci Casper Jr.",
    contactPersonEmail: "chelsie.torphy@schaden.biz",
    contactPersonMobile: "+1234567890",
    email: "ashley.lewis@client.com",
    taxNumber: "TAX-48375310",
    paymentTerms: "Net 30",
    user: "Ashley Lewis",
    billingAddress: {
      name: "Ashley Lewis",
      street: "222 Maple Drive",
      street2: "",
      city: "Boston",
      state: "MA",
      zip: "02101",
      country: "USA",
    },
    shippingAddress: {
      name: "Ashley Lewis",
      street: "222 Maple Drive",
      street2: "",
      city: "Boston",
      state: "MA",
      zip: "02101",
      country: "USA",
    },
    notes: "",
    startDate: "2026-04-15",
    endDate: "2026-12-31",
    totalInvoiced: 0,
    totalReturns: 0,
    totalCreditNotes: 0,
    totalPayments: 0,
    balance: 0,
  },
  {
    id: "9",
    customerCode: "CUST-0009",
    companyName: "Padberg, Torp and Bernier",
    contactPerson: "Jay Blick I",
    contactPersonEmail: "daughtery.clement@labadie.com",
    contactPersonMobile: "+1234567890",
    email: "michelle.hall@client.com",
    taxNumber: "TAX-87477210",
    paymentTerms: "Net 45",
    user: "Michelle Hall",
    billingAddress: {
      name: "Michelle Hall",
      street: "888 Spruce Way",
      street2: "",
      city: "Portland",
      state: "OR",
      zip: "97201",
      country: "USA",
    },
    shippingAddress: {
      name: "Michelle Hall",
      street: "888 Spruce Way",
      street2: "",
      city: "Portland",
      state: "OR",
      zip: "97201",
      country: "USA",
    },
    notes: "",
    startDate: "2026-05-01",
    endDate: "2026-12-31",
    totalInvoiced: 0,
    totalReturns: 0,
    totalCreditNotes: 0,
    totalPayments: 0,
    balance: 0,
  },
];

const sampleInvoices: SalesInvoice[] = [
  {
    id: "inv1",
    invoiceNumber: "SI-2026-01-016",
    invoiceDate: "2026-04-28",
    dueDate: "2026-05-13",
    status: "Posted",
    subtotal: 750.0,
    tax: 225.0,
    totalAmount: 975.0,
    balance: 975.0,
  },
  {
    id: "inv2",
    invoiceNumber: "SI-2026-01-001",
    invoiceDate: "2026-01-20",
    dueDate: "2026-02-03",
    status: "Partial",
    subtotal: 1619.98,
    tax: 305.99,
    totalAmount: 1925.97,
    balance: -1000.0,
  },
];

const sampleReturns: SalesReturn[] = [
  {
    id: "ret1",
    returnNumber: "SR-2026-01-001",
    date: "2026-02-10",
    status: "Completed",
    subtotal: 300.0,
    tax: 54.0,
    totalAmount: 354.0,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField =
  | "customerCode"
  | "companyName"
  | "contactPerson"
  | "email"
  | "taxNumber";
type SortDir = "asc" | "desc";

// ─── Main Customers Component ────────────────────────────────────────────────

export const AccountsCustomers: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("customerCode");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null,
  );

  // Filtered and sorted customers
  const filteredCustomers = useMemo(() => {
    let result = [...customers];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.companyName.toLowerCase().includes(q) ||
          c.contactPerson.toLowerCase().includes(q) ||
          c.customerCode.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q),
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
  }, [customers, searchQuery, sortField, sortDir]);

  const totalPages = Math.ceil(filteredCustomers.length / perPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const openDeleteModal = (customer: Customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const handleDeleteCustomer = () => {
    if (customerToDelete) {
      setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));
      showToast("Customer deleted successfully!", "success");
      setShowDeleteModal(false);
      setCustomerToDelete(null);
    }
  };

  const viewCustomerDetails = (customerId: string) => {
    navigate(`/accounting/customers/${customerId}`);
  };

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
            Delete Customer
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {customerToDelete?.companyName}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteCustomer}
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
          <span className="text-gray-900 font-medium">Customers</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Customers
          </h2>
          <button
            onClick={() => navigate("/customers/create")}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Customer"
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
                placeholder="Search customers..."
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
                <SortHeader field="customerCode" label="Customer Code" />
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
              {paginatedCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => viewCustomerDetails(customer.id)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                        {customer.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="font-medium text-gray-900">
                        {customer.user}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {customer.customerCode}
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    {customer.companyName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {customer.contactPerson}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{customer.email}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {customer.taxNumber}
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => viewCustomerDetails(customer.id)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/accounting/customers/edit/${customer.id}`)
                        }
                        className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(customer)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No customers found.
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
            {filteredCustomers.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredCustomers.length)} of{" "}
            {filteredCustomers.length} results
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

      {showDeleteModal && <DeleteModal />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOMER DETAILS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const CustomerDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);

  React.useEffect(() => {
    const found = sampleCustomers.find((c) => c.id === id);
    setCustomer(found || null);
  }, [id]);

  if (!customer) {
    return (
      <div className="flex-1 bg-[#FAFBFC] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Customer not found
          </h2>
          <button
            onClick={() => navigate("/customers")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-auto">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
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
            <button
              onClick={() => navigate("/customers")}
              className="hover:text-gray-700"
            >
              Customers
            </button>
            <span>›</span>
            <span className="text-gray-900 font-medium">Customer Detail</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Customer Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {customer.user}
              </h1>
              <p className="text-gray-500 mt-1">{customer.email}</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Generate
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Download PDF
              </button>
            </div>
          </div>
          <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500">Start Date</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(customer.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">End Date</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(customer.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-blue-500" />
              <p className="text-xs text-gray-500">Total Invoiced</p>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {fmtCurrency(customer.totalInvoiced)}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <p className="text-xs text-gray-500">Total Returns</p>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {fmtCurrency(customer.totalReturns)}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-purple-500" />
              <p className="text-xs text-gray-500">Total Credit Notes</p>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {fmtCurrency(customer.totalCreditNotes)}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <p className="text-xs text-gray-500">Total Payments</p>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {fmtCurrency(customer.totalPayments)}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <p className="text-xs text-gray-500">Balance</p>
            </div>
            <p
              className={`text-xl font-bold ${customer.balance < 0 ? "text-red-600" : "text-gray-900"}`}
            >
              {fmtCurrency(Math.abs(customer.balance))}{" "}
              {customer.balance < 0 && "(Credit)"}
            </p>
          </div>
        </div>

        {/* Company Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Company Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500">Customer Code</p>
              <p className="text-sm font-medium text-gray-900">
                {customer.customerCode}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Company Name</p>
              <p className="text-sm font-medium text-gray-900">
                {customer.companyName}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Contact Person</p>
              <p className="text-sm font-medium text-gray-900">
                {customer.contactPerson}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">
                {customer.contactPersonEmail}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Mobile</p>
              <p className="text-sm font-medium text-gray-900">
                {customer.contactPersonMobile}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Tax Number</p>
              <p className="text-sm font-medium text-gray-900">
                {customer.taxNumber}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Payment Terms</p>
              <p className="text-sm font-medium text-gray-900">
                {customer.paymentTerms}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">User</p>
              <p className="text-sm font-medium text-gray-900">
                {customer.user}
              </p>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <h3 className="font-semibold text-gray-900">Billing Address</h3>
            </div>
            <p className="text-sm text-gray-700">
              {customer.billingAddress.name}
            </p>
            <p className="text-sm text-gray-500">
              {customer.billingAddress.street}
            </p>
            {customer.billingAddress.street2 && (
              <p className="text-sm text-gray-500">
                {customer.billingAddress.street2}
              </p>
            )}
            <p className="text-sm text-gray-500">
              {customer.billingAddress.city}, {customer.billingAddress.state}{" "}
              {customer.billingAddress.zip}
            </p>
            <p className="text-sm text-gray-500">
              {customer.billingAddress.country}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <h3 className="font-semibold text-gray-900">Shipping Address</h3>
            </div>
            <p className="text-sm text-gray-700">
              {customer.shippingAddress.name}
            </p>
            <p className="text-sm text-gray-500">
              {customer.shippingAddress.street}
            </p>
            {customer.shippingAddress.street2 && (
              <p className="text-sm text-gray-500">
                {customer.shippingAddress.street2}
              </p>
            )}
            <p className="text-sm text-gray-500">
              {customer.shippingAddress.city}, {customer.shippingAddress.state}{" "}
              {customer.shippingAddress.zip}
            </p>
            <p className="text-sm text-gray-500">
              {customer.shippingAddress.country}
            </p>
          </div>
        </div>

        {/* Notes */}
        {customer.notes && (
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">Notes:</span> {customer.notes}
            </p>
          </div>
        )}

        {/* Sales Invoices Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Sales Invoices</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Invoice Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Invoice Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                    Subtotal
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                    Tax
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                    Total Amount
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sampleInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {invoice.invoiceDate}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {invoice.dueDate}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          invoice.status === "Posted"
                            ? "bg-blue-100 text-blue-700"
                            : invoice.status === "Partial"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {fmtCurrency(invoice.subtotal)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {fmtCurrency(invoice.tax)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {fmtCurrency(invoice.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {fmtCurrency(invoice.balance)}
                    </td>
                  </tr>
                ))}
                {sampleInvoices.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales Returns Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Sales Returns</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Return Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                    Subtotal
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                    Tax
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sampleReturns.map((ret) => (
                  <tr key={ret.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">
                      {ret.returnNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{ret.date}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {ret.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {fmtCurrency(ret.subtotal)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {fmtCurrency(ret.tax)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {fmtCurrency(ret.totalAmount)}
                    </td>
                  </tr>
                ))}
                {sampleReturns.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No returns found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Credit Notes */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Credit Notes</h3>
          <p className="text-center text-gray-500 py-6">
            No credit notes available
          </p>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// EDIT CUSTOMER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const EditCustomer: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    customerCode: "",
    email: "",
    mobileNumber: "",
    taxNumber: "",
    paymentTerms: "",
    billingName: "",
    billingAddress: "",
    billingAddress2: "",
    billingCity: "",
    billingState: "",
    billingZip: "",
    billingCountry: "",
    shippingName: "",
    shippingAddress: "",
    shippingAddress2: "",
    shippingCity: "",
    shippingState: "",
    shippingZip: "",
    shippingCountry: "",
    notes: "",
  });

  React.useEffect(() => {
    const found = sampleCustomers.find((c) => c.id === id);
    if (found) {
      setCustomer(found);
      setFormData({
        companyName: found.companyName,
        customerCode: found.customerCode,
        email: found.email,
        mobileNumber: found.contactPersonMobile,
        taxNumber: found.taxNumber,
        paymentTerms: found.paymentTerms,
        billingName: found.billingAddress.name,
        billingAddress: found.billingAddress.street,
        billingAddress2: found.billingAddress.street2,
        billingCity: found.billingAddress.city,
        billingState: found.billingAddress.state,
        billingZip: found.billingAddress.zip,
        billingCountry: found.billingAddress.country,
        shippingName: found.shippingAddress.name,
        shippingAddress: found.shippingAddress.street,
        shippingAddress2: found.shippingAddress.street2,
        shippingCity: found.shippingAddress.city,
        shippingState: found.shippingAddress.state,
        shippingZip: found.shippingAddress.zip,
        shippingCountry: found.shippingAddress.country,
        notes: found.notes,
      });
    }
  }, [id]);

  const handleSave = () => {
    showToast("Customer updated successfully!", "success");
    navigate(`/customers/${id}`);
  };

  if (!customer) {
    return (
      <div className="flex-1 bg-[#FAFBFC] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Customer not found
          </h2>
          <button
            onClick={() => navigate("/customers")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-auto">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sticky top-0 z-10">
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
          <button
            onClick={() => navigate("/customers")}
            className="hover:text-gray-700"
          >
            Customers
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Edit Customer</span>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Customer
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Update customer information
            </p>
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
                  Customer Code
                </label>
                <input
                  type="text"
                  value={formData.customerCode}
                  onChange={(e) =>
                    setFormData({ ...formData, customerCode: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={formData.mobileNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, mobileNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Format: +[country code][phone number]
                </p>
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
                  Payment Terms
                </label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentTerms: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="Net 30">Net 30</option>
                  <option value="Net 45">Net 45</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Due on Receipt">Due on Receipt</option>
                </select>
              </div>
            </div>

            {/* Billing Address */}
            <div className="border-t border-gray-200 pt-4 mt-2 mb-4">
              <h3 className="font-medium text-gray-900 mb-3">
                Billing Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Billing Name <span className="text-red-500">*</span>
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
                    Billing Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.billingAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billingAddress: e.target.value,
                      })
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
                    City <span className="text-red-500">*</span>
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
                    State <span className="text-red-500">*</span>
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
                      setFormData({
                        ...formData,
                        billingCountry: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="border-t border-gray-200 pt-4 mt-2">
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

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={() => navigate(`/customers/${id}`)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
