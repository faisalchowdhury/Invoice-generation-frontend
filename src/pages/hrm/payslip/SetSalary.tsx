/**
 * File: src/pages/hrm/SetSalary.tsx
 * Complete Set Salary page with list view, employee salary details modal with allowances, deductions, loans, and overtimes
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
  Eye,
  DollarSign,
  Calendar,
  Percent,
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Briefcase,
  Clock,
  User,
  Building2,
  Tag,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { showToast } from "@/utils/toast";

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

interface Allowance {
  id: string;
  type: string;
  typeValue: "Fixed" | "Percentage";
  amount: number;
  percentage?: number;
}

interface Deduction {
  id: string;
  type: string;
  typeValue: "Fixed" | "Percentage";
  amount: number;
  percentage?: number;
}

interface Loan {
  id: string;
  type: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: "Active" | "Completed" | "Pending";
}

interface Overtime {
  id: string;
  title: string;
  days: number;
  hours: number;
  rate: number;
  status: "Active" | "Inactive";
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
];

const sampleAllowances: Record<string, Allowance[]> = {
  EMP20260002: [
    {
      id: "a1",
      type: "Education Allowance",
      typeValue: "Fixed",
      amount: 1600,
      percentage: 0,
    },
    {
      id: "a2",
      type: "Overtime Allowance",
      typeValue: "Fixed",
      amount: 5000,
      percentage: 0,
    },
    {
      id: "a3",
      type: "Food Allowance",
      typeValue: "Percentage",
      amount: 0,
      percentage: 15,
    },
    {
      id: "a4",
      type: "Performance Bonus",
      typeValue: "Percentage",
      amount: 0,
      percentage: 20,
    },
  ],
};

const sampleDeductions: Record<string, Deduction[]> = {
  EMP20260002: [
    {
      id: "d1",
      type: "Employee State Insurance (ESI)",
      typeValue: "Percentage",
      amount: 0,
      percentage: 7,
    },
    {
      id: "d2",
      type: "Income Tax",
      typeValue: "Percentage",
      amount: 0,
      percentage: 8,
    },
    {
      id: "d3",
      type: "Professional Tax",
      typeValue: "Percentage",
      amount: 0,
      percentage: 8,
    },
    {
      id: "d4",
      type: "Provident Fund (PF)",
      typeValue: "Percentage",
      amount: 0,
      percentage: 2,
    },
  ],
};

const sampleLoans: Record<string, Loan[]> = {
  EMP20260002: [
    {
      id: "l1",
      type: "Emergency Loan",
      amount: 2000,
      startDate: "2026-01-04",
      endDate: "2027-07-04",
      status: "Active",
    },
    {
      id: "l2",
      type: "Travel Loan",
      amount: 5000,
      startDate: "2026-01-01",
      endDate: "2027-06-01",
      status: "Active",
    },
    {
      id: "l3",
      type: "Vehicle Loan",
      amount: 10000,
      startDate: "2025-12-22",
      endDate: "2027-12-22",
      status: "Active",
    },
    {
      id: "l4",
      type: "Salary Advance",
      amount: 15000,
      startDate: "2026-01-13",
      endDate: "2028-01-13",
      status: "Active",
    },
  ],
};

const sampleOvertimes: Record<string, Overtime[]> = {
  EMP20260002: [
    {
      id: "o1",
      title: "Weekend Work",
      days: 2,
      hours: 16,
      rate: 50,
      status: "Active",
    },
    {
      id: "o2",
      title: "Holiday Work",
      days: 1,
      hours: 8,
      rate: 75,
      status: "Active",
    },
  ],
};

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

export const SetSalary: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("employeeId");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [showSalaryModal, setShowSalaryModal] = useState(false);

  // Modal sub-tabs
  const [activeTab, setActiveTab] = useState<
    "allowances" | "deductions" | "loans" | "overtimes"
  >("allowances");

  // Form states for modals
  const [showAllowanceModal, setShowAllowanceModal] = useState(false);
  const [showDeductionModal, setShowDeductionModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showOvertimeModal, setShowOvertimeModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Allowance form
  const [allowanceForm, setAllowanceForm] = useState({
    type: "",
    typeValue: "Fixed" as "Fixed" | "Percentage",
    amount: 0,
    percentage: 0,
  });

  // Deduction form
  const [deductionForm, setDeductionForm] = useState({
    type: "",
    typeValue: "Fixed" as "Fixed" | "Percentage",
    amount: 0,
    percentage: 0,
  });

  // Loan form
  const [loanForm, setLoanForm] = useState({
    type: "",
    amount: 0,
    startDate: "",
    endDate: "",
    status: "Active" as "Active" | "Completed" | "Pending",
  });

  // Overtime form
  const [overtimeForm, setOvertimeForm] = useState({
    title: "",
    days: 0,
    hours: 0,
    rate: 0,
    status: "Active" as "Active" | "Inactive",
  });

  // Data states
  const [allowances, setAllowances] =
    useState<Record<string, Allowance[]>>(sampleAllowances);
  const [deductions, setDeductions] =
    useState<Record<string, Deduction[]>>(sampleDeductions);
  const [loans, setLoans] = useState<Record<string, Loan[]>>(sampleLoans);
  const [overtimes, setOvertimes] =
    useState<Record<string, Overtime[]>>(sampleOvertimes);

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

  const openSalaryModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setActiveTab("allowances");
    setShowSalaryModal(true);
  };

  const calculateTotalAllowances = (empId: string): number => {
    const empAllowances = allowances[empId] || [];
    const empBasicSalary =
      employees.find((e) => e.employeeId === empId)?.basicSalary || 0;
    return empAllowances.reduce((sum, a) => {
      if (a.typeValue === "Fixed") {
        return sum + a.amount;
      } else {
        return sum + (empBasicSalary * (a.percentage || 0)) / 100;
      }
    }, 0);
  };

  const calculateTotalDeductions = (empId: string): number => {
    const empDeductions = deductions[empId] || [];
    const empBasicSalary =
      employees.find((e) => e.employeeId === empId)?.basicSalary || 0;
    return empDeductions.reduce((sum, d) => {
      if (d.typeValue === "Fixed") {
        return sum + d.amount;
      } else {
        return sum + (empBasicSalary * (d.percentage || 0)) / 100;
      }
    }, 0);
  };

  const calculateNetSalary = (empId: string): number => {
    const emp = employees.find((e) => e.employeeId === empId);
    if (!emp) return 0;
    return (
      emp.basicSalary +
      calculateTotalAllowances(empId) -
      calculateTotalDeductions(empId)
    );
  };

  // Allowance CRUD
  const handleAddAllowance = () => {
    if (!allowanceForm.type) {
      showToast("Please enter allowance type", "info");
      return;
    }
    if (allowanceForm.typeValue === "Fixed" && allowanceForm.amount <= 0) {
      showToast("Please enter valid amount", "info");
      return;
    }
    if (
      allowanceForm.typeValue === "Percentage" &&
      (allowanceForm.percentage <= 0 || allowanceForm.percentage > 100)
    ) {
      showToast("Please enter valid percentage (1-100)", "info");
      return;
    }

    const newAllowance: Allowance = {
      id: Date.now().toString(),
      type: allowanceForm.type,
      typeValue: allowanceForm.typeValue,
      amount: allowanceForm.amount,
      percentage: allowanceForm.percentage,
    };

    setAllowances((prev) => ({
      ...prev,
      [selectedEmployee!.employeeId]: [
        ...(prev[selectedEmployee!.employeeId] || []),
        newAllowance,
      ],
    }));
    showToast("Allowance added successfully!", "success");
    setShowAllowanceModal(false);
    setAllowanceForm({
      type: "",
      typeValue: "Fixed",
      amount: 0,
      percentage: 0,
    });
  };

  const handleDeleteAllowance = (id: string) => {
    setAllowances((prev) => ({
      ...prev,
      [selectedEmployee!.employeeId]: (
        prev[selectedEmployee!.employeeId] || []
      ).filter((a) => a.id !== id),
    }));
    showToast("Allowance deleted successfully!", "success");
  };

  // Deduction CRUD
  const handleAddDeduction = () => {
    if (!deductionForm.type) {
      showToast("Please enter deduction type", "info");
      return;
    }
    if (deductionForm.typeValue === "Fixed" && deductionForm.amount <= 0) {
      showToast("Please enter valid amount", "info");
      return;
    }
    if (
      deductionForm.typeValue === "Percentage" &&
      (deductionForm.percentage <= 0 || deductionForm.percentage > 100)
    ) {
      showToast("Please enter valid percentage (1-100)", "info");
      return;
    }

    const newDeduction: Deduction = {
      id: Date.now().toString(),
      type: deductionForm.type,
      typeValue: deductionForm.typeValue,
      amount: deductionForm.amount,
      percentage: deductionForm.percentage,
    };

    setDeductions((prev) => ({
      ...prev,
      [selectedEmployee!.employeeId]: [
        ...(prev[selectedEmployee!.employeeId] || []),
        newDeduction,
      ],
    }));
    showToast("Deduction added successfully!", "success");
    setShowDeductionModal(false);
    setDeductionForm({
      type: "",
      typeValue: "Fixed",
      amount: 0,
      percentage: 0,
    });
  };

  const handleDeleteDeduction = (id: string) => {
    setDeductions((prev) => ({
      ...prev,
      [selectedEmployee!.employeeId]: (
        prev[selectedEmployee!.employeeId] || []
      ).filter((d) => d.id !== id),
    }));
    showToast("Deduction deleted successfully!", "success");
  };

  // Loan CRUD
  const handleAddLoan = () => {
    if (!loanForm.type) {
      showToast("Please enter loan type", "info");
      return;
    }
    if (loanForm.amount <= 0) {
      showToast("Please enter valid amount", "info");
      return;
    }
    if (!loanForm.startDate || !loanForm.endDate) {
      showToast("Please select start and end dates", "info");
      return;
    }

    const newLoan: Loan = {
      id: Date.now().toString(),
      type: loanForm.type,
      amount: loanForm.amount,
      startDate: loanForm.startDate,
      endDate: loanForm.endDate,
      status: loanForm.status,
    };

    setLoans((prev) => ({
      ...prev,
      [selectedEmployee!.employeeId]: [
        ...(prev[selectedEmployee!.employeeId] || []),
        newLoan,
      ],
    }));
    showToast("Loan added successfully!", "success");
    setShowLoanModal(false);
    setLoanForm({
      type: "",
      amount: 0,
      startDate: "",
      endDate: "",
      status: "Active",
    });
  };

  const handleDeleteLoan = (id: string) => {
    setLoans((prev) => ({
      ...prev,
      [selectedEmployee!.employeeId]: (
        prev[selectedEmployee!.employeeId] || []
      ).filter((l) => l.id !== id),
    }));
    showToast("Loan deleted successfully!", "success");
  };

  // Overtime CRUD
  const handleAddOvertime = () => {
    if (!overtimeForm.title) {
      showToast("Please enter overtime title", "info");
      return;
    }
    if (overtimeForm.days <= 0 && overtimeForm.hours <= 0) {
      showToast("Please enter valid days or hours", "info");
      return;
    }
    if (overtimeForm.rate <= 0) {
      showToast("Please enter valid rate", "info");
      return;
    }

    const newOvertime: Overtime = {
      id: Date.now().toString(),
      title: overtimeForm.title,
      days: overtimeForm.days,
      hours: overtimeForm.hours,
      rate: overtimeForm.rate,
      status: overtimeForm.status,
    };

    setOvertimes((prev) => ({
      ...prev,
      [selectedEmployee!.employeeId]: [
        ...(prev[selectedEmployee!.employeeId] || []),
        newOvertime,
      ],
    }));
    showToast("Overtime added successfully!", "success");
    setShowOvertimeModal(false);
    setOvertimeForm({
      title: "",
      days: 0,
      hours: 0,
      rate: 0,
      status: "Active",
    });
  };

  const handleDeleteOvertime = (id: string) => {
    setOvertimes((prev) => ({
      ...prev,
      [selectedEmployee!.employeeId]: (
        prev[selectedEmployee!.employeeId] || []
      ).filter((o) => o.id !== id),
    }));
    showToast("Overtime deleted successfully!", "success");
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

  const AllowanceModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Add Allowance</h2>
          <button
            onClick={() => setShowAllowanceModal(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Allowance Type *
            </label>
            <input
              type="text"
              value={allowanceForm.type}
              onChange={(e) =>
                setAllowanceForm({ ...allowanceForm, type: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="allowanceType"
                  checked={allowanceForm.typeValue === "Fixed"}
                  onChange={() =>
                    setAllowanceForm({
                      ...allowanceForm,
                      typeValue: "Fixed",
                      amount: 0,
                      percentage: 0,
                    })
                  }
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">Fixed</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="allowanceType"
                  checked={allowanceForm.typeValue === "Percentage"}
                  onChange={() =>
                    setAllowanceForm({
                      ...allowanceForm,
                      typeValue: "Percentage",
                      amount: 0,
                      percentage: 0,
                    })
                  }
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">Percentage</span>
              </label>
            </div>
          </div>
          {allowanceForm.typeValue === "Fixed" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={allowanceForm.amount || ""}
                  onChange={(e) =>
                    setAllowanceForm({
                      ...allowanceForm,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Percentage (%) *
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={allowanceForm.percentage || ""}
                onChange={(e) =>
                  setAllowanceForm({
                    ...allowanceForm,
                    percentage: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-100">
          <button
            onClick={() => setShowAllowanceModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAddAllowance}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );

  const DeductionModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Add Deduction</h2>
          <button
            onClick={() => setShowDeductionModal(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deduction Type *
            </label>
            <input
              type="text"
              value={deductionForm.type}
              onChange={(e) =>
                setDeductionForm({ ...deductionForm, type: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="deductionType"
                  checked={deductionForm.typeValue === "Fixed"}
                  onChange={() =>
                    setDeductionForm({
                      ...deductionForm,
                      typeValue: "Fixed",
                      amount: 0,
                      percentage: 0,
                    })
                  }
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">Fixed</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="deductionType"
                  checked={deductionForm.typeValue === "Percentage"}
                  onChange={() =>
                    setDeductionForm({
                      ...deductionForm,
                      typeValue: "Percentage",
                      amount: 0,
                      percentage: 0,
                    })
                  }
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">Percentage</span>
              </label>
            </div>
          </div>
          {deductionForm.typeValue === "Fixed" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={deductionForm.amount || ""}
                  onChange={(e) =>
                    setDeductionForm({
                      ...deductionForm,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Percentage (%) *
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={deductionForm.percentage || ""}
                onChange={(e) =>
                  setDeductionForm({
                    ...deductionForm,
                    percentage: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-100">
          <button
            onClick={() => setShowDeductionModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAddDeduction}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );

  const LoanModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Add Loan</h2>
          <button
            onClick={() => setShowLoanModal(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Type *
            </label>
            <input
              type="text"
              value={loanForm.type}
              onChange={(e) =>
                setLoanForm({ ...loanForm, type: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                min={0}
                step={0.01}
                value={loanForm.amount || ""}
                onChange={(e) =>
                  setLoanForm({
                    ...loanForm,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={loanForm.startDate}
                onChange={(e) =>
                  setLoanForm({ ...loanForm, startDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <input
                type="date"
                value={loanForm.endDate}
                onChange={(e) =>
                  setLoanForm({ ...loanForm, endDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={loanForm.status}
              onChange={(e) =>
                setLoanForm({ ...loanForm, status: e.target.value as any })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-100">
          <button
            onClick={() => setShowLoanModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAddLoan}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );

  const OvertimeModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Add Overtime</h2>
          <button
            onClick={() => setShowOvertimeModal(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={overtimeForm.title}
              onChange={(e) =>
                setOvertimeForm({ ...overtimeForm, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Days
              </label>
              <input
                type="number"
                min={0}
                value={overtimeForm.days || ""}
                onChange={(e) =>
                  setOvertimeForm({
                    ...overtimeForm,
                    days: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hours
              </label>
              <input
                type="number"
                min={0}
                value={overtimeForm.hours || ""}
                onChange={(e) =>
                  setOvertimeForm({
                    ...overtimeForm,
                    hours: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rate Per Hour/Day *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                min={0}
                step={0.01}
                value={overtimeForm.rate || ""}
                onChange={(e) =>
                  setOvertimeForm({
                    ...overtimeForm,
                    rate: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={overtimeForm.status}
              onChange={(e) =>
                setOvertimeForm({
                  ...overtimeForm,
                  status: e.target.value as any,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-100">
          <button
            onClick={() => setShowOvertimeModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAddOvertime}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );

  const SalaryDetailsModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Employee Salary Details
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedEmployee?.employeeName} - {selectedEmployee?.employeeId}
            </p>
          </div>
          <button
            onClick={() => setShowSalaryModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          {/* Employee Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
            <div>
              <p className="text-xs text-gray-500">Basic Salary</p>
              <p className="text-lg font-bold text-blue-600">
                {fmtCurrency(selectedEmployee?.basicSalary || 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Allowances</p>
              <p className="text-lg font-bold text-green-600">
                {fmtCurrency(
                  calculateTotalAllowances(selectedEmployee?.employeeId || ""),
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Deductions</p>
              <p className="text-lg font-bold text-red-600">
                {fmtCurrency(
                  calculateTotalDeductions(selectedEmployee?.employeeId || ""),
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Net Salary</p>
              <p className="text-lg font-bold text-purple-600">
                {fmtCurrency(
                  calculateNetSalary(selectedEmployee?.employeeId || ""),
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Branch</p>
              <p className="text-sm font-medium text-gray-900">
                {selectedEmployee?.branch}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200 pb-3">
            <button
              onClick={() => setActiveTab("allowances")}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${activeTab === "allowances" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              Allowances
            </button>
            <button
              onClick={() => setActiveTab("deductions")}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${activeTab === "deductions" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              Deductions
            </button>
            <button
              onClick={() => setActiveTab("loans")}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${activeTab === "loans" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              Loans
            </button>
            <button
              onClick={() => setActiveTab("overtimes")}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${activeTab === "overtimes" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              Overtimes
            </button>
          </div>

          {/* Allowances Tab */}
          {activeTab === "allowances" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Allowances</h3>
                <button
                  onClick={() => setShowAllowanceModal(true)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Allowance
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                        Allowance Type
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                        Type
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                        Amount
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(allowances[selectedEmployee?.employeeId || ""] || []).map(
                      (a) => (
                        <tr key={a.id}>
                          <td className="px-4 py-2 text-gray-900">{a.type}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${a.typeValue === "Fixed" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}
                            >
                              {a.typeValue}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-right font-medium">
                            {a.typeValue === "Fixed"
                              ? fmtCurrency(a.amount)
                              : `${a.percentage}%`}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              onClick={() => handleDeleteAllowance(a.id)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Deductions Tab */}
          {activeTab === "deductions" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Deductions</h3>
                <button
                  onClick={() => setShowDeductionModal(true)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Deduction
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                        Deduction Type
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                        Type
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                        Amount
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(deductions[selectedEmployee?.employeeId || ""] || []).map(
                      (d) => (
                        <tr key={d.id}>
                          <td className="px-4 py-2 text-gray-900">{d.type}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${d.typeValue === "Fixed" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}
                            >
                              {d.typeValue}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-right font-medium">
                            {d.typeValue === "Fixed"
                              ? fmtCurrency(d.amount)
                              : `${d.percentage}%`}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              onClick={() => handleDeleteDeduction(d.id)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Loans Tab */}
          {activeTab === "loans" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Loans</h3>
                <button
                  onClick={() => setShowLoanModal(true)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Loan
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                        Type
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                        Amount
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                        Start Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                        End Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                        Status
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(loans[selectedEmployee?.employeeId || ""] || []).map(
                      (l) => (
                        <tr key={l.id}>
                          <td className="px-4 py-2 text-gray-900">{l.type}</td>
                          <td className="px-4 py-2 text-right font-medium">
                            {fmtCurrency(l.amount)}
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {l.startDate}
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {l.endDate}
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${l.status === "Active" ? "bg-green-100 text-green-700" : l.status === "Completed" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}
                            >
                              {l.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              onClick={() => handleDeleteLoan(l.id)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Overtimes Tab */}
          {activeTab === "overtimes" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Overtimes</h3>
                <button
                  onClick={() => setShowOvertimeModal(true)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Overtime
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                        Title
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">
                        Days
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">
                        Hours
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                        Rate
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">
                        Status
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(overtimes[selectedEmployee?.employeeId || ""] || []).map(
                      (o) => (
                        <tr key={o.id}>
                          <td className="px-4 py-2 text-gray-900">{o.title}</td>
                          <td className="px-4 py-2 text-center text-gray-600">
                            {o.days}
                          </td>
                          <td className="px-4 py-2 text-center text-gray-600">
                            {o.hours}
                          </td>
                          <td className="px-4 py-2 text-right font-medium">
                            {fmtCurrency(o.rate)}
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${o.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                            >
                              {o.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              onClick={() => handleDeleteOvertime(o.id)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end">
          <button
            onClick={() => setShowSalaryModal(false)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-hidden flex flex-col">
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
            onClick={() => navigate("/hrm")}
            className="hover:text-gray-700"
          >
            HRM
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Set Salary</span>
        </div>
      </div>
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Set Salary</h2>
        </div>
      </div>
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
                      Branch
                    </span>
                  </div>
                  <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50">
                    Regional Office
                  </button>
                  <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50">
                    Sales Office
                  </button>
                  <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50">
                    North Branch
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
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
              {paginatedEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm text-gray-900">
                    {employee.employeeId}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {employee.employeeName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{employee.branch}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {employee.department}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {employee.designation}
                  </td>
                  <td className="px-4 py-3 font-medium text-blue-600">
                    {fmtCurrency(employee.basicSalary)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openSalaryModal(employee)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
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
      {showSalaryModal && <SalaryDetailsModal />}
      {showAllowanceModal && <AllowanceModal />}
      {showDeductionModal && <DeductionModal />}
      {showLoanModal && <LoanModal />}
      {showOvertimeModal && <OvertimeModal />}
    </div>
  );
};
