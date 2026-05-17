/**
 * File: src/pages/hrm/Payroll.tsx
 * Complete Payroll page with list view, payroll generation, and payroll details modal
 * Based on provided screenshots design
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/utils/toast";
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
  DollarSign,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  Printer,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  User,
  Building2,
  Briefcase,
  Clock,
  Banknote,
  Receipt,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Employee {
  id: string;
  employeeId: string;
  employeeName: string;
  branch: string;
  department: string;
  designation: string;
  basicSalary: number;
}

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  branch: string;
  department: string;
  designation: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  payPeriod: string;
  paymentDate: string;
  status: "Pending" | "Processed" | "Paid" | "Cancelled";
  bankAccount: string;
  accountNumber: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleEmployees: Employee[] = [
  {
    id: "1",
    employeeId: "EMP20260001",
    employeeName: "John Smith",
    branch: "Sales Office",
    department: "Customer Service",
    designation: "Senior Consultant",
    basicSalary: 53966.48,
  },
  {
    id: "2",
    employeeId: "EMP20260002",
    employeeName: "Michael Brown",
    branch: "Regional Office",
    department: "Finance & Accounting",
    designation: "Assistant Manager",
    basicSalary: 76552.41,
  },
  {
    id: "3",
    employeeId: "EMP20260003",
    employeeName: "David Wilson",
    branch: "Regional Office",
    department: "Human Resources",
    designation: "Officer",
    basicSalary: 69649.95,
  },
  {
    id: "4",
    employeeId: "EMP20260004",
    employeeName: "Robert Taylor",
    branch: "North Branch",
    department: "Procurement",
    designation: "Analyst",
    basicSalary: 70011.43,
  },
  {
    id: "5",
    employeeId: "EMP20260005",
    employeeName: "James Garcia",
    branch: "Customer Service Center",
    department: "Legal & Compliance",
    designation: "Officer",
    basicSalary: 72940.89,
  },
  {
    id: "6",
    employeeId: "EMP20260006",
    employeeName: "Christopher Lee",
    branch: "South Branch",
    department: "Finance & Accounting",
    designation: "Director",
    basicSalary: 65651.24,
  },
  {
    id: "7",
    employeeId: "EMP20260007",
    employeeName: "Daniel Thompson",
    branch: "Downtown Branch",
    department: "Quality Assurance",
    designation: "Analyst",
    basicSalary: 51912.3,
  },
  {
    id: "8",
    employeeId: "EMP20260008",
    employeeName: "Matthew Clark",
    branch: "South Branch",
    department: "Finance & Accounting",
    designation: "Team Lead",
    basicSalary: 42024.53,
  },
  {
    id: "9",
    employeeId: "EMP20260009",
    employeeName: "Anthony Walker",
    branch: "Downtown Branch",
    department: "Quality Assurance",
    designation: "Executive",
    basicSalary: 39727.77,
  },
  {
    id: "10",
    employeeId: "EMP20260010",
    employeeName: "Mark Allen",
    branch: "South Branch",
    department: "Finance & Accounting",
    designation: "Team Lead",
    basicSalary: 42986.94,
  },
];

const samplePayrollRecords: PayrollRecord[] = [
  {
    id: "1",
    employeeId: "EMP20260001",
    employeeName: "John Smith",
    branch: "Sales Office",
    department: "Customer Service",
    designation: "Senior Consultant",
    basicSalary: 53966.48,
    allowances: 5000,
    deductions: 8000,
    netSalary: 50966.48,
    payPeriod: "May 2026",
    paymentDate: "2026-05-31",
    status: "Processed",
    bankAccount: "Business Checking",
    accountNumber: "****1234",
  },
  {
    id: "2",
    employeeId: "EMP20260002",
    employeeName: "Michael Brown",
    branch: "Regional Office",
    department: "Finance & Accounting",
    designation: "Assistant Manager",
    basicSalary: 76552.41,
    allowances: 7500,
    deductions: 12000,
    netSalary: 72052.41,
    payPeriod: "May 2026",
    paymentDate: "2026-05-31",
    status: "Paid",
    bankAccount: "Business Checking",
    accountNumber: "****5678",
  },
  {
    id: "3",
    employeeId: "EMP20260003",
    employeeName: "David Wilson",
    branch: "Regional Office",
    department: "Human Resources",
    designation: "Officer",
    basicSalary: 69649.95,
    allowances: 6000,
    deductions: 9500,
    netSalary: 66149.95,
    payPeriod: "May 2026",
    paymentDate: "2026-05-31",
    status: "Pending",
    bankAccount: "Savings",
    accountNumber: "****9012",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField =
  | "employeeId"
  | "employeeName"
  | "branch"
  | "department"
  | "designation"
  | "basicSalary";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const Payroll: React.FC = () => {
  const navigate = useNavigate();
  const [employees] = useState<Employee[]>(sampleEmployees);
  const [payrollRecords, setPayrollRecords] =
    useState<PayrollRecord[]>(samplePayrollRecords);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("employeeId");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(
    null,
  );
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate Payroll Form
  const [generateForm, setGenerateForm] = useState({
    payPeriod: new Date().toLocaleString("default", {
      month: "long",
      year: "numeric",
    }),
    paymentDate: new Date().toISOString().split("T")[0],
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const filteredEmployees = useMemo(() => {
    let result = [...employees];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.employeeId.toLowerCase().includes(q) ||
          e.employeeName.toLowerCase().includes(q),
      );
    }
    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];
      if (sortField === "basicSalary") {
        aVal = a.basicSalary;
        bVal = b.basicSalary;
      }
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [employees, searchQuery, sortField, sortDir]);

  const totalPages = Math.ceil(filteredEmployees.length / perPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  const openPayrollModal = (payroll: PayrollRecord) => {
    setSelectedPayroll(payroll);
    setShowPayrollModal(true);
  };

  const openGenerateModal = () => {
    setShowGenerateModal(true);
  };

  const handleGeneratePayroll = () => {
    if (!generateForm.payPeriod) {
      showToast("Please enter pay period", "info");
      return;
    }
    if (!generateForm.paymentDate) {
      showToast("Please select payment date", "info");
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const newPayrollRecords: PayrollRecord[] = employees.map((emp) => ({
        id: Date.now().toString() + emp.id,
        employeeId: emp.employeeId,
        employeeName: emp.employeeName,
        branch: emp.branch,
        department: emp.department,
        designation: emp.designation,
        basicSalary: emp.basicSalary,
        allowances: Math.round(emp.basicSalary * 0.15),
        deductions: Math.round(emp.basicSalary * 0.12),
        netSalary:
          emp.basicSalary +
          Math.round(emp.basicSalary * 0.15) -
          Math.round(emp.basicSalary * 0.12),
        payPeriod: generateForm.payPeriod,
        paymentDate: generateForm.paymentDate,
        status: "Pending",
        bankAccount: "Business Checking",
        accountNumber:
          "****" +
          Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0"),
      }));
      setPayrollRecords([...payrollRecords, ...newPayrollRecords]);
      showToast(`Payroll generated for ${generateForm.payPeriod}!`, "success");
      setShowGenerateModal(false);
      setIsGenerating(false);
    }, 1000);
  };

  const handleProcessPayment = (payroll: PayrollRecord) => {
    setPayrollRecords((prev) =>
      prev.map((p) =>
        p.id === payroll.id && p.status === "Pending"
          ? { ...p, status: "Processed" as const }
          : p,
      ),
    );
    showToast(`Payment processed for ${payroll.employeeName}`, "success");
  };

  const handleMarkAsPaid = (payroll: PayrollRecord) => {
    setPayrollRecords((prev) =>
      prev.map((p) =>
        p.id === payroll.id && p.status === "Processed"
          ? { ...p, status: "Paid" as const }
          : p,
      ),
    );
    showToast(`Salary marked as paid for ${payroll.employeeName}`, "success");
  };

  const handleDownloadPayslip = (payroll: PayrollRecord) => {
    showToast(`Downloading payslip for ${payroll.employeeName}`, "info");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Processed":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <CheckCircle className="w-3 h-3" />;
      case "Processed":
        return <RefreshCw className="w-3 h-3" />;
      case "Pending":
        return <Clock className="w-3 h-3" />;
      case "Cancelled":
        return <AlertCircle className="w-3 h-3" />;
      default:
        return null;
    }
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

  const GenerateModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Generate Payroll
          </h2>
          <button
            onClick={() => setShowGenerateModal(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pay Period
            </label>
            <input
              type="text"
              value={generateForm.payPeriod}
              onChange={(e) =>
                setGenerateForm({ ...generateForm, payPeriod: e.target.value })
              }
              placeholder="e.g., May 2026"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Date
            </label>
            <input
              type="date"
              value={generateForm.paymentDate}
              onChange={(e) =>
                setGenerateForm({
                  ...generateForm,
                  paymentDate: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-600">
              This will generate payroll for all active employees for the
              selected period.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-100">
          <button
            onClick={() => setShowGenerateModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleGeneratePayroll}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );

  const PayrollDetailsModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Payroll Details
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedPayroll?.employeeName} - {selectedPayroll?.payPeriod}
            </p>
          </div>
          <button
            onClick={() => setShowPayrollModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        {selectedPayroll && (
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
              <div>
                <p className="text-xs text-gray-500">Employee ID</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedPayroll.employeeId}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Branch</p>
                <p className="text-sm text-gray-600">
                  {selectedPayroll.branch}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="text-sm text-gray-600">
                  {selectedPayroll.department}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Designation</p>
                <p className="text-sm text-gray-600">
                  {selectedPayroll.designation}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Earnings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Basic Salary</span>
                    <span className="font-medium">
                      {fmtCurrency(selectedPayroll.basicSalary)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Allowances</span>
                    <span className="font-medium text-green-600">
                      {fmtCurrency(selectedPayroll.allowances)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Total Earnings</span>
                    <span className="font-semibold">
                      {fmtCurrency(
                        selectedPayroll.basicSalary +
                          selectedPayroll.allowances,
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Deductions</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Deductions</span>
                    <span className="font-medium text-red-600">
                      {fmtCurrency(selectedPayroll.deductions)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Net Salary</span>
                    <span className="font-semibold text-blue-600">
                      {fmtCurrency(selectedPayroll.netSalary)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Payment Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Pay Period</p>
                  <p className="text-sm text-gray-900">
                    {selectedPayroll.payPeriod}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Payment Date</p>
                  <p className="text-sm text-gray-600">
                    {selectedPayroll.paymentDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Bank Account</p>
                  <p className="text-sm text-gray-600">
                    {selectedPayroll.bankAccount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Account Number</p>
                  <p className="text-sm text-gray-600">
                    {selectedPayroll.accountNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPayroll.status)}`}
                  >
                    {getStatusIcon(selectedPayroll.status)}
                    {selectedPayroll.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => handleDownloadPayslip(selectedPayroll)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                Download Payslip
              </button>
              {selectedPayroll.status === "Pending" && (
                <button
                  onClick={() => {
                    handleProcessPayment(selectedPayroll);
                    setShowPayrollModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Process Payment
                </button>
              )}
              {selectedPayroll.status === "Processed" && (
                <button
                  onClick={() => {
                    handleMarkAsPaid(selectedPayroll);
                    setShowPayrollModal(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-hidden flex flex-col">
      {/* Breadcrumbs */}
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
            onClick={() => navigate("/hrm")}
            className="hover:text-gray-700"
          >
            HRM
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Payroll</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Payroll Management
          </h2>
          <button
            onClick={openGenerateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Generate Payroll
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by employee name or ID..."
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
                  <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50">
                    Pending
                  </button>
                  <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50">
                    Processed
                  </button>
                  <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50">
                    Paid
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="employeeId" label="Employee ID" />
                <SortHeader field="employeeName" label="Employee Name" />
                <SortHeader field="branch" label="Branch" />
                <SortHeader field="department" label="Department" />
                <SortHeader field="designation" label="Designation" />
                <SortHeader field="basicSalary" label="Basic Salary" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedEmployees.map((employee) => {
                const payroll = payrollRecords.find(
                  (p) => p.employeeId === employee.employeeId,
                );
                return (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm text-gray-900">
                      {employee.employeeId}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {employee.employeeName}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {employee.branch}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {employee.department}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {employee.designation}
                    </td>
                    <td className="px-4 py-3 font-medium text-blue-600">
                      {fmtCurrency(employee.basicSalary)}
                    </td>
                    {payroll ? (
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openPayrollModal(payroll)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    ) : (
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        Not generated
                      </td>
                    )}
                  </tr>
                );
              })}
              {paginatedEmployees.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-sm text-gray-500">
            Showing{" "}
            {filteredEmployees.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredEmployees.length)} of{" "}
            {filteredEmployees.length} results
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
                  className={`w-8 h-8 text-sm rounded-md flex items-center justify-center ${currentPage === pageNumber ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
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

      {/* Modals */}
      {showGenerateModal && <GenerateModal />}
      {showPayrollModal && <PayrollDetailsModal />}
    </div>
  );
};
