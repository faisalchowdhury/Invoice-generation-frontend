/**
 * File: src/pages/sales/SalesInvoices.tsx
 * Complete Sales Invoices page with list view, create/edit form, filters, pagination
 * Based on existing SalesReceipts pattern — matching exact color codes and design style
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Eye,
  Save,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  Filter,
  List,
  LayoutGrid,
  ArrowLeft,
  Settings,
  Check,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface InvoiceItem {
  id: string;
  product: string;
  qty: number;
  unitPrice: number;
  discountPercent: number;
  tax: number;
  total: number;
}

interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  invoiceDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  totalAmount: number;
  balance: number;
  status: "Draft" | "Paid" | "Posted" | "Partial";
  warehouse: string;
  paymentTerms: string;
  notes: string;
  syncToCalendar: boolean;
  invoiceType: "product" | "service";
  items: InvoiceItem[];
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleInvoices: SalesInvoice[] = [
  {
    id: "1",
    invoiceNumber: "SI-2026-02-018",
    customer: "Jennifer Martinez",
    invoiceDate: "2026-06-02",
    dueDate: "2026-08-07",
    subtotal: 1100.0,
    tax: 330.0,
    totalAmount: 1430.0,
    balance: 1430.0,
    status: "Draft",
    warehouse: "Main Warehouse",
    paymentTerms: "Net 30",
    notes: "",
    syncToCalendar: false,
    invoiceType: "product",
    items: [
      {
        id: "i1",
        product: "Laptop Pro 15",
        qty: 2,
        unitPrice: 500,
        discountPercent: 0,
        tax: 150,
        total: 1000,
      },
      {
        id: "i2",
        product: "USB-C Hub",
        qty: 2,
        unitPrice: 50,
        discountPercent: 0,
        tax: 30,
        total: 100,
      },
    ],
  },
  {
    id: "2",
    invoiceNumber: "SI-2026-02-017",
    customer: "Lisa Anderson",
    invoiceDate: "2026-06-01",
    dueDate: "2026-08-13",
    subtotal: 990.0,
    tax: 178.2,
    totalAmount: 1168.2,
    balance: 0.0,
    status: "Paid",
    warehouse: "Main Warehouse",
    paymentTerms: "Net 30",
    notes: "",
    syncToCalendar: false,
    invoiceType: "product",
    items: [
      {
        id: "i1",
        product: "Office Chair Ergonomic",
        qty: 3,
        unitPrice: 330,
        discountPercent: 0,
        tax: 59.4,
        total: 990,
      },
    ],
  },
  {
    id: "3",
    invoiceNumber: "SI-2026-02-016",
    customer: "Emily Davis",
    invoiceDate: "2026-05-31",
    dueDate: "2026-08-05",
    subtotal: 1830.0,
    tax: 329.4,
    totalAmount: 2159.4,
    balance: 2159.4,
    status: "Posted",
    warehouse: "Warehouse B",
    paymentTerms: "Net 60",
    notes: "",
    syncToCalendar: false,
    invoiceType: "product",
    items: [
      {
        id: "i1",
        product: "Server Rack Unit",
        qty: 1,
        unitPrice: 1830,
        discountPercent: 0,
        tax: 329.4,
        total: 1830,
      },
    ],
  },
  {
    id: "4",
    invoiceNumber: "SI-2026-02-015",
    customer: "Sarah Johnson",
    invoiceDate: "2026-05-27",
    dueDate: "2026-07-27",
    subtotal: 960.0,
    tax: 391.5,
    totalAmount: 1351.5,
    balance: 1351.5,
    status: "Draft",
    warehouse: "Main Warehouse",
    paymentTerms: "Net 30",
    notes: "",
    syncToCalendar: false,
    invoiceType: "service",
    items: [
      {
        id: "i1",
        product: "Consulting Hours",
        qty: 16,
        unitPrice: 60,
        discountPercent: 0,
        tax: 172.8,
        total: 960,
      },
    ],
  },
  {
    id: "5",
    invoiceNumber: "SI-2026-02-014",
    customer: "Amanda White",
    invoiceDate: "2026-05-14",
    dueDate: "2026-07-21",
    subtotal: 1399.95,
    tax: 623.23,
    totalAmount: 2023.18,
    balance: 0.0,
    status: "Paid",
    warehouse: "Main Warehouse",
    paymentTerms: "Net 45",
    notes: "",
    syncToCalendar: false,
    invoiceType: "product",
    items: [
      {
        id: "i1",
        product: 'Monitor 27" 4K',
        qty: 3,
        unitPrice: 466.65,
        discountPercent: 0,
        tax: 207.74,
        total: 1399.95,
      },
    ],
  },
  {
    id: "6",
    invoiceNumber: "SI-2026-02-013",
    customer: "Maria Rodriguez",
    invoiceDate: "2026-05-05",
    dueDate: "2026-07-07",
    subtotal: 1200.0,
    tax: 360.0,
    totalAmount: 1560.0,
    balance: 1560.0,
    status: "Draft",
    warehouse: "Warehouse B",
    paymentTerms: "Net 30",
    notes: "",
    syncToCalendar: false,
    invoiceType: "product",
    items: [
      {
        id: "i1",
        product: "Mechanical Keyboard",
        qty: 10,
        unitPrice: 120,
        discountPercent: 0,
        tax: 36,
        total: 1200,
      },
    ],
  },
  {
    id: "7",
    invoiceNumber: "SI-2026-02-012",
    customer: "Jennifer Martinez",
    invoiceDate: "2026-04-30",
    dueDate: "2026-06-30",
    subtotal: 3025.96,
    tax: 547.79,
    totalAmount: 3573.75,
    balance: 1573.75,
    status: "Partial",
    warehouse: "Main Warehouse",
    paymentTerms: "Net 60",
    notes: "",
    syncToCalendar: false,
    invoiceType: "product",
    items: [
      {
        id: "i1",
        product: "Network Switch 48-Port",
        qty: 2,
        unitPrice: 1200,
        discountPercent: 0,
        tax: 216,
        total: 2400,
      },
      {
        id: "i2",
        product: "Cat6 Cable Bundle",
        qty: 5,
        unitPrice: 125.19,
        discountPercent: 0,
        tax: 66.36,
        total: 625.96,
      },
    ],
  },
  {
    id: "8",
    invoiceNumber: "SI-2026-02-011",
    customer: "Lisa Anderson",
    invoiceDate: "2026-04-13",
    dueDate: "2026-06-13",
    subtotal: 840.0,
    tax: 180.0,
    totalAmount: 1020.0,
    balance: 1020.0,
    status: "Posted",
    warehouse: "Warehouse B",
    paymentTerms: "Net 30",
    notes: "",
    syncToCalendar: false,
    invoiceType: "service",
    items: [
      {
        id: "i1",
        product: "IT Support Hours",
        qty: 14,
        unitPrice: 60,
        discountPercent: 0,
        tax: 12.86,
        total: 840,
      },
    ],
  },
  {
    id: "9",
    invoiceNumber: "SI-2026-02-010",
    customer: "Emily Davis",
    invoiceDate: "2026-04-04",
    dueDate: "2026-06-08",
    subtotal: 450.0,
    tax: 81.0,
    totalAmount: 531.0,
    balance: 531.0,
    status: "Draft",
    warehouse: "Main Warehouse",
    paymentTerms: "Net 30",
    notes: "",
    syncToCalendar: false,
    invoiceType: "product",
    items: [
      {
        id: "i1",
        product: "Wireless Mouse",
        qty: 15,
        unitPrice: 30,
        discountPercent: 0,
        tax: 5.4,
        total: 450,
      },
    ],
  },
  {
    id: "10",
    invoiceNumber: "SI-2026-02-009",
    customer: "Sarah Johnson",
    invoiceDate: "2026-03-28",
    dueDate: "2026-05-28",
    subtotal: 2200.0,
    tax: 396.0,
    totalAmount: 2596.0,
    balance: 0.0,
    status: "Paid",
    warehouse: "Main Warehouse",
    paymentTerms: "Net 60",
    notes: "",
    syncToCalendar: false,
    invoiceType: "product",
    items: [
      {
        id: "i1",
        product: "Standing Desk Electric",
        qty: 2,
        unitPrice: 1100,
        discountPercent: 0,
        tax: 198,
        total: 2200,
      },
    ],
  },
  {
    id: "11",
    invoiceNumber: "SI-2026-02-008",
    customer: "Amanda White",
    invoiceDate: "2026-03-20",
    dueDate: "2026-05-20",
    subtotal: 675.0,
    tax: 121.5,
    totalAmount: 796.5,
    balance: 796.5,
    status: "Draft",
    warehouse: "Warehouse B",
    paymentTerms: "Net 30",
    notes: "",
    syncToCalendar: false,
    invoiceType: "product",
    items: [
      {
        id: "i1",
        product: "Webcam HD 1080p",
        qty: 9,
        unitPrice: 75,
        discountPercent: 0,
        tax: 13.5,
        total: 675,
      },
    ],
  },
  {
    id: "12",
    invoiceNumber: "SI-2026-02-007",
    customer: "Maria Rodriguez",
    invoiceDate: "2026-03-15",
    dueDate: "2026-05-15",
    subtotal: 1500.0,
    tax: 270.0,
    totalAmount: 1770.0,
    balance: 1770.0,
    status: "Posted",
    warehouse: "Main Warehouse",
    paymentTerms: "Net 45",
    notes: "",
    syncToCalendar: false,
    invoiceType: "service",
    items: [
      {
        id: "i1",
        product: "Cloud Migration Service",
        qty: 1,
        unitPrice: 1500,
        discountPercent: 0,
        tax: 270,
        total: 1500,
      },
    ],
  },
  {
    id: "13",
    invoiceNumber: "SI-2026-02-006",
    customer: "Jennifer Martinez",
    invoiceDate: "2026-03-10",
    dueDate: "2026-05-10",
    subtotal: 380.0,
    tax: 68.4,
    totalAmount: 448.4,
    balance: 0.0,
    status: "Paid",
    warehouse: "Warehouse B",
    paymentTerms: "Net 30",
    notes: "",
    syncToCalendar: false,
    invoiceType: "product",
    items: [
      {
        id: "i1",
        product: "USB Flash Drive 128GB",
        qty: 20,
        unitPrice: 19,
        discountPercent: 0,
        tax: 3.42,
        total: 380,
      },
    ],
  },
  {
    id: "14",
    invoiceNumber: "SI-2026-02-005",
    customer: "Lisa Anderson",
    invoiceDate: "2026-03-02",
    dueDate: "2026-05-02",
    subtotal: 920.0,
    tax: 165.6,
    totalAmount: 1085.6,
    balance: 542.8,
    status: "Partial",
    warehouse: "Main Warehouse",
    paymentTerms: "Net 60",
    notes: "",
    syncToCalendar: false,
    invoiceType: "product",
    items: [
      {
        id: "i1",
        product: "Docking Station",
        qty: 4,
        unitPrice: 230,
        discountPercent: 0,
        tax: 41.4,
        total: 920,
      },
    ],
  },
  {
    id: "15",
    invoiceNumber: "SI-2026-02-004",
    customer: "Emily Davis",
    invoiceDate: "2026-02-25",
    dueDate: "2026-04-25",
    subtotal: 1640.0,
    tax: 295.2,
    totalAmount: 1935.2,
    balance: 1935.2,
    status: "Draft",
    warehouse: "Warehouse B",
    paymentTerms: "Net 30",
    notes: "",
    syncToCalendar: false,
    invoiceType: "product",
    items: [
      {
        id: "i1",
        product: "Printer LaserJet",
        qty: 4,
        unitPrice: 410,
        discountPercent: 0,
        tax: 73.8,
        total: 1640,
      },
    ],
  },
  {
    id: "16",
    invoiceNumber: "SI-2026-02-003",
    customer: "Sarah Johnson",
    invoiceDate: "2026-02-18",
    dueDate: "2026-04-18",
    subtotal: 560.0,
    tax: 100.8,
    totalAmount: 660.8,
    balance: 0.0,
    status: "Paid",
    warehouse: "Main Warehouse",
    paymentTerms: "Net 30",
    notes: "",
    syncToCalendar: false,
    invoiceType: "product",
    items: [
      {
        id: "i1",
        product: "Headset Noise Cancel",
        qty: 7,
        unitPrice: 80,
        discountPercent: 0,
        tax: 14.4,
        total: 560,
      },
    ],
  },
  {
    id: "17",
    invoiceNumber: "SI-2026-02-002",
    customer: "Amanda White",
    invoiceDate: "2026-02-10",
    dueDate: "2026-04-10",
    subtotal: 2400.0,
    tax: 432.0,
    totalAmount: 2832.0,
    balance: 2832.0,
    status: "Posted",
    warehouse: "Warehouse B",
    paymentTerms: "Net 60",
    notes: "",
    syncToCalendar: false,
    invoiceType: "service",
    items: [
      {
        id: "i1",
        product: "Annual Support Contract",
        qty: 1,
        unitPrice: 2400,
        discountPercent: 0,
        tax: 432,
        total: 2400,
      },
    ],
  },
  {
    id: "18",
    invoiceNumber: "SI-2026-02-001",
    customer: "Maria Rodriguez",
    invoiceDate: "2026-02-01",
    dueDate: "2026-04-01",
    subtotal: 750.0,
    tax: 135.0,
    totalAmount: 885.0,
    balance: 885.0,
    status: "Draft",
    warehouse: "Main Warehouse",
    paymentTerms: "Net 30",
    notes: "",
    syncToCalendar: false,
    invoiceType: "product",
    items: [
      {
        id: "i1",
        product: "External SSD 1TB",
        qty: 5,
        unitPrice: 150,
        discountPercent: 0,
        tax: 27,
        total: 750,
      },
    ],
  },
];

const customers = [
  "Jennifer Martinez",
  "Lisa Anderson",
  "Emily Davis",
  "Sarah Johnson",
  "Amanda White",
  "Maria Rodriguez",
];
const warehouses = ["Main Warehouse", "Warehouse B", "Warehouse C"];
const products = [
  { name: "Laptop Pro 15", price: 500 },
  { name: "USB-C Hub", price: 50 },
  { name: "Office Chair Ergonomic", price: 330 },
  { name: 'Monitor 27" 4K', price: 466.65 },
  { name: "Mechanical Keyboard", price: 120 },
  { name: "Wireless Mouse", price: 30 },
  { name: "Webcam HD 1080p", price: 75 },
  { name: "Headset Noise Cancel", price: 80 },
  { name: "External SSD 1TB", price: 150 },
  { name: "Docking Station", price: 230 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField =
  | "invoiceNumber"
  | "customer"
  | "invoiceDate"
  | "dueDate"
  | "subtotal"
  | "tax"
  | "totalAmount"
  | "balance"
  | "status";
type SortDir = "asc" | "desc";

// ─── Component ────────────────────────────────────────────────────────────────

export const SalesInvoice: React.FC = () => {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState<SalesInvoice[]>(sampleInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("invoiceNumber");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<SalesInvoice | null>(
    null,
  );

  const [formInvoiceDate, setFormInvoiceDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [formDueDate, setFormDueDate] = useState("");
  const [formCustomer, setFormCustomer] = useState("");
  const [formWarehouse, setFormWarehouse] = useState("");
  const [formPaymentTerms, setFormPaymentTerms] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formSyncCalendar, setFormSyncCalendar] = useState(false);
  const [formInvoiceType, setFormInvoiceType] = useState<"product" | "service">(
    "product",
  );
  const [formItems, setFormItems] = useState<InvoiceItem[]>([
    {
      id: "new-1",
      product: "",
      qty: 1,
      unitPrice: 0,
      discountPercent: 0,
      tax: 0,
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

  const filteredInvoices = useMemo(() => {
    let result = [...invoices];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((inv) =>
        inv.invoiceNumber.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "All") {
      result = result.filter((inv) => inv.status === statusFilter);
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
  }, [invoices, searchQuery, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredInvoices.length / perPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Status Badge — matches existing pattern ───────────────────────────────

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-700 border border-gray-200";
      case "Paid":
        return "bg-green-100 text-green-700 border border-green-200";
      case "Posted":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "Partial":
        return "bg-orange-100 text-orange-700 border border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const canEdit = (status: string) => status === "Draft";
  const canDelete = (status: string) => status === "Draft";

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormInvoiceDate(new Date().toISOString().split("T")[0]);
    setFormDueDate("");
    setFormCustomer("");
    setFormWarehouse("");
    setFormPaymentTerms("");
    setFormNotes("");
    setFormSyncCalendar(false);
    setFormInvoiceType("product");
    setFormItems([
      {
        id: "new-1",
        product: "",
        qty: 1,
        unitPrice: 0,
        discountPercent: 0,
        tax: 0,
        total: 0,
      },
    ]);
    setEditingInvoice(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditInvoice = (invoice: SalesInvoice) => {
    setEditingInvoice(invoice);
    setFormInvoiceDate(invoice.invoiceDate);
    setFormDueDate(invoice.dueDate);
    setFormCustomer(invoice.customer);
    setFormWarehouse(invoice.warehouse);
    setFormPaymentTerms(invoice.paymentTerms);
    setFormNotes(invoice.notes);
    setFormSyncCalendar(invoice.syncToCalendar);
    setFormInvoiceType(invoice.invoiceType);
    setFormItems(
      invoice.items.length > 0
        ? invoice.items
        : [
            {
              id: "new-1",
              product: "",
              qty: 1,
              unitPrice: 0,
              discountPercent: 0,
              tax: 0,
              total: 0,
            },
          ],
    );
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteInvoice = (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      showToast("Invoice deleted!", "success");
    }
  };

  const recalcItem = (item: InvoiceItem): InvoiceItem => {
    const subtotal = item.qty * item.unitPrice;
    const discountAmt = subtotal * (item.discountPercent / 100);
    const afterDiscount = subtotal - discountAmt;
    const taxAmt = afterDiscount * 0.18;
    return {
      ...item,
      tax: Math.round(taxAmt * 100) / 100,
      total: Math.round(afterDiscount * 100) / 100,
    };
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setFormItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "product") {
          const found = products.find((p) => p.name === value);
          if (found) updated.unitPrice = found.price;
        }
        return recalcItem(updated);
      }),
    );
  };

  const addItem = () => {
    setFormItems((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        product: "",
        qty: 1,
        unitPrice: 0,
        discountPercent: 0,
        tax: 0,
        total: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setFormItems((prev) =>
      prev.length <= 1 ? prev : prev.filter((i) => i.id !== id),
    );
  };

  const formSubtotal = formItems.reduce((sum, i) => sum + i.total, 0);
  const formDiscount = formItems.reduce((sum, i) => {
    const sub = i.qty * i.unitPrice;
    return sum + sub * (i.discountPercent / 100);
  }, 0);
  const formTax = formItems.reduce((sum, i) => sum + i.tax, 0);
  const formTotal = formSubtotal + formTax;

  const handleSaveInvoice = () => {
    if (!formCustomer) {
      showToast("Please select a customer", "info");
      return;
    }
    if (!formDueDate) {
      showToast("Please select a due date", "info");
      return;
    }
    if (!formWarehouse) {
      showToast("Please select a warehouse", "info");
      return;
    }

    if (isEditing && editingInvoice) {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === editingInvoice.id
            ? {
                ...inv,
                invoiceDate: formInvoiceDate,
                dueDate: formDueDate,
                customer: formCustomer,
                warehouse: formWarehouse,
                paymentTerms: formPaymentTerms,
                notes: formNotes,
                syncToCalendar: formSyncCalendar,
                invoiceType: formInvoiceType,
                items: formItems,
                subtotal: formSubtotal,
                tax: formTax,
                totalAmount: formTotal,
                balance: formTotal,
              }
            : inv,
        ),
      );
      showToast("Invoice updated!", "success");
    } else {
      const newInvoice: SalesInvoice = {
        id: Date.now().toString(),
        invoiceNumber: `SI-2026-02-${String(invoices.length + 1).padStart(3, "0")}`,
        customer: formCustomer,
        invoiceDate: formInvoiceDate,
        dueDate: formDueDate,
        subtotal: formSubtotal,
        tax: formTax,
        totalAmount: formTotal,
        balance: formTotal,
        status: "Draft",
        warehouse: formWarehouse,
        paymentTerms: formPaymentTerms,
        notes: formNotes,
        syncToCalendar: formSyncCalendar,
        invoiceType: formInvoiceType,
        items: formItems,
      };
      setInvoices((prev) => [newInvoice, ...prev]);
      showToast("Invoice created!", "success");
    }
    setShowForm(false);
    resetForm();
  };

  // ─── Sort Header ────────────────────────────────────────────────────────────

  const SortHeader: React.FC<{ field: SortField; label: string }> = ({
    field,
    label,
  }) => (
    <th
      className="px-3 py-3 text-left text-xs font-medium text-gray-600 cursor-pointer select-none hover:bg-gray-50 whitespace-nowrap"
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
  // CREATE / EDIT FORM VIEW
  // ═══════════════════════════════════════════════════════════════════════════

  if (showForm) {
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
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="hover:text-gray-700"
            >
              Sales Invoice
            </button>
            <span>›</span>
            <span className="text-gray-900 font-medium">
              {isEditing ? "Edit Sales Invoice" : "Create Sales Invoice"}
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Sales Invoice" : "Create Sales Invoice"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Sales Invoice Details Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <h3 className="text-base font-semibold text-gray-900">
                  Sales Invoice Details
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="invoiceType"
                    checked={formInvoiceType === "product"}
                    onChange={() => setFormInvoiceType("product")}
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="text-sm text-gray-700">Product Wise</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="invoiceType"
                    checked={formInvoiceType === "service"}
                    onChange={() => setFormInvoiceType("service")}
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="text-sm text-gray-700">Service Wise</span>
                </label>
              </div>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={formInvoiceDate}
                    onChange={(e) => setFormInvoiceDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer <span className="text-red-500">*</span>
                </label>
                <select
                  value={formCustomer}
                  onChange={(e) => setFormCustomer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white"
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
                  Warehouse <span className="text-red-500">*</span>
                </label>
                <select
                  value={formWarehouse}
                  onChange={(e) => setFormWarehouse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white"
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Terms
                </label>
                <input
                  type="text"
                  value={formPaymentTerms}
                  onChange={(e) => setFormPaymentTerms(e.target.value)}
                  placeholder="e.g., Net 30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Additional notes..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm resize-y"
                />
              </div>
            </div>

            {/* Sync Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFormSyncCalendar(!formSyncCalendar)}
                className={`relative w-11 h-6 rounded-full transition-colors ${formSyncCalendar ? "bg-gray-900" : "bg-gray-300"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${formSyncCalendar ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
              <span className="text-sm text-gray-700">
                Sync to Google Calendar
              </span>
            </div>
          </div>

          {/* Sales Invoice Items Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-500" />
                <h3 className="text-base font-semibold text-gray-900">
                  Sales Invoice Items
                </h3>
              </div>
              <button
                onClick={addItem}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-sm border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-600">
                      Product <span className="text-red-500">*</span>
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 w-20">
                      Qty <span className="text-red-500">*</span>
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 w-28">
                      Unit Price <span className="text-red-500">*</span>
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 w-24">
                      Discount %
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 w-24">
                      Tax
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-600 w-28">
                      Total
                    </th>
                    <th className="px-2 py-2 text-center text-xs font-medium text-gray-600 w-16">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="px-2 py-3">
                        <select
                          value={item.product}
                          onChange={(e) =>
                            updateItem(item.id, "product", e.target.value)
                          }
                          className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                        >
                          <option value=""></option>
                          {products.map((p) => (
                            <option key={p.name} value={p.name}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-3">
                        <input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "qty",
                              Math.max(1, parseInt(e.target.value) || 1),
                            )
                          }
                          className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </td>
                      <td className="px-2 py-3">
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "unitPrice",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </td>
                      <td className="px-2 py-3">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={item.discountPercent}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "discountPercent",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-600">
                        {item.tax > 0 ? fmtCurrency(item.tax) : "No tax"}
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-900">
                        {fmtCurrency(item.total)}
                      </td>
                      <td className="px-2 py-3 text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Invoice Summary */}
            <div className="flex justify-end mt-6">
              <div className="w-full sm:w-72">
                <h4 className="text-base font-semibold text-gray-900 mb-3">
                  Invoice Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">
                      {fmtCurrency(formSubtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-red-500">
                      -{fmtCurrency(formDiscount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">
                      {fmtCurrency(formTax)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="text-base font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-base font-semibold text-gray-900">
                      {fmtCurrency(formTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions — matches existing SalesReceipts pattern */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pb-6">
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                showToast("Saved as draft", "success");
                setShowForm(false);
                resetForm();
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
            >
              Save as Draft
            </button>
            <button
              onClick={handleSaveInvoice}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Save & Send
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <span className="text-gray-900 font-medium">Sales Invoices</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Sales Invoices
          </h2>
          <button
            onClick={handleCreate}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Invoice"
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
                placeholder="Search by invoice number..."
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
            {/* View toggle */}
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

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
                  {["All", "Draft", "Paid", "Posted", "Partial"].map((st) => (
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
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table / Grid */}
      <div className="flex-1 overflow-auto">
        {viewMode === "list" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
                <tr>
                  <SortHeader field="invoiceNumber" label="Invoice Number" />
                  <SortHeader field="customer" label="Customer" />
                  <SortHeader field="invoiceDate" label="Invoice Date" />
                  <SortHeader field="dueDate" label="Due Date" />
                  <SortHeader field="subtotal" label="Subtotal" />
                  <SortHeader field="tax" label="Tax" />
                  <SortHeader field="totalAmount" label="Total Amount" />
                  <SortHeader field="balance" label="Balance" />
                  <SortHeader field="status" label="Status" />
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4">
                      <button
                        onClick={() => handleEditInvoice(inv)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {inv.invoiceNumber}
                      </button>
                    </td>
                    <td className="px-3 py-4 text-gray-900">{inv.customer}</td>
                    <td className="px-3 py-4 text-gray-600">
                      {inv.invoiceDate}
                    </td>
                    <td className="px-3 py-4 text-gray-600">{inv.dueDate}</td>
                    <td className="px-3 py-4 text-gray-900">
                      {fmtCurrency(inv.subtotal)}
                    </td>
                    <td className="px-3 py-4 text-gray-900">
                      {fmtCurrency(inv.tax)}
                    </td>
                    <td className="px-3 py-4 text-gray-900">
                      {fmtCurrency(inv.totalAmount)}
                    </td>
                    <td className="px-3 py-4 text-gray-900">
                      {fmtCurrency(inv.balance)}
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(inv.status)}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            showToast("Downloading PDF...", "info")
                          }
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            showToast("Opening preview...", "info")
                          }
                          className="p-1.5 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 rounded"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canEdit(inv.status) && (
                          <>
                            <button
                              onClick={() => showToast("Saving...", "info")}
                              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                              title="Save"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditInvoice(inv)}
                              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {canDelete(inv.status) && (
                          <button
                            onClick={() => handleDeleteInvoice(inv.id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedInvoices.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-3 py-12 text-center text-gray-500"
                    >
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedInvoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <button
                    onClick={() => handleEditInvoice(inv)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {inv.invoiceNumber}
                  </button>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(inv.status)}`}
                  >
                    {inv.status}
                  </span>
                </div>
                <div className="text-sm text-gray-900 mb-1">{inv.customer}</div>
                <div className="text-xs text-gray-500 mb-3">
                  {inv.invoiceDate} → {inv.dueDate}
                </div>
                <div className="flex items-center justify-between mb-3 pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {fmtCurrency(inv.totalAmount)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Balance</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {fmtCurrency(inv.balance)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => showToast("Downloading PDF...", "info")}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => showToast("Opening preview...", "info")}
                    className="p-1.5 text-yellow-500 hover:text-yellow-600 rounded"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {canEdit(inv.status) && (
                    <button
                      onClick={() => handleEditInvoice(inv)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {canDelete(inv.status) && (
                    <button
                      onClick={() => handleDeleteInvoice(inv.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {paginatedInvoices.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                No invoices found.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination — matches screenshot exactly */}
      <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-sm text-gray-500">
            Showing{" "}
            {filteredInvoices.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredInvoices.length)} of{" "}
            {filteredInvoices.length} results
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
    </div>
  );
};
