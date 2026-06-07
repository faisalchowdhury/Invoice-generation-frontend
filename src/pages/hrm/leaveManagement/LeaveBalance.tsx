/**
 * File: src/pages/hrm/LeaveBalance.tsx
 * Complete Leave Balance page with employee selection and leave balance details
 * Based on provided screenshots design
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Filter,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Download,
  Printer,
} from "lucide-react";
import { showToast } from "@/utils/toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LeaveTypeBalance {
  leaveType: string;
  total: number;
  used: number;
  available: number;
  isPaid: boolean;
  color: string;
}

interface EmployeeLeaveBalance {
  employeeId: string;
  employeeName: string;
  branch: string;
  department: string;
  balances: LeaveTypeBalance[];
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const leaveTypeConfig = [
  { name: "Annual Leave", total: 21, isPaid: true, color: "#10B981" },
  { name: "Sick Leave", total: 10, isPaid: true, color: "#3B82F6" },
  { name: "Maternity Leave", total: 90, isPaid: true, color: "#EC4899" },
  { name: "Paternity Leave", total: 15, isPaid: true, color: "#06B6D4" },
  { name: "Personal Leave", total: 5, isPaid: false, color: "#F59E0B" },
  { name: "Bereavement Leave", total: 7, isPaid: true, color: "#6B7280" },
  { name: "Study Leave", total: 30, isPaid: false, color: "#8B5CF6" },
  { name: "Emergency Leave", total: 3, isPaid: true, color: "#EF4444" },
];

const sampleEmployees: EmployeeLeaveBalance[] = [
  {
    employeeId: "EMP20260001",
    employeeName: "David Wilson",
    branch: "Regional Office",
    department: "Human Resources",
    balances: leaveTypeConfig.map((lt) => ({
      leaveType: lt.name,
      total: lt.total,
      used: 0,
      available: lt.total,
      isPaid: lt.isPaid,
      color: lt.color,
    })),
  },
  {
    employeeId: "EMP20260002",
    employeeName: "Michael Brown",
    branch: "Regional Office",
    department: "Finance & Accounting",
    balances: leaveTypeConfig.map((lt) => ({
      leaveType: lt.name,
      total: lt.total,
      used: 0,
      available: lt.total,
      isPaid: lt.isPaid,
      color: lt.color,
    })),
  },
  {
    employeeId: "EMP20260003",
    employeeName: "Robert Taylor",
    branch: "North Branch",
    department: "Procurement",
    balances: leaveTypeConfig.map((lt) => ({
      leaveType: lt.name,
      total: lt.total,
      used: 0,
      available: lt.total,
      isPaid: lt.isPaid,
      color: lt.color,
    })),
  },
  {
    employeeId: "EMP20260004",
    employeeName: "James Garcia",
    branch: "Customer Service Center",
    department: "Legal & Compliance",
    balances: leaveTypeConfig.map((lt) => ({
      leaveType: lt.name,
      total: lt.total,
      used: 0,
      available: lt.total,
      isPaid: lt.isPaid,
      color: lt.color,
    })),
  },
  {
    employeeId: "EMP20260005",
    employeeName: "Christopher Lee",
    branch: "South Branch",
    department: "Finance & Accounting",
    balances: leaveTypeConfig.map((lt) => ({
      leaveType: lt.name,
      total: lt.total,
      used: 0,
      available: lt.total,
      isPaid: lt.isPaid,
      color: lt.color,
    })),
  },
  {
    employeeId: "EMP20260006",
    employeeName: "Matthew Clark",
    branch: "South Branch",
    department: "Finance & Accounting",
    balances: leaveTypeConfig.map((lt) => ({
      leaveType: lt.name,
      total: lt.total,
      used: 0,
      available: lt.total,
      isPaid: lt.isPaid,
      color: lt.color,
    })),
  },
  {
    employeeId: "EMP20260007",
    employeeName: "John Smith",
    branch: "Sales Office",
    department: "Customer Service",
    balances: leaveTypeConfig.map((lt) => ({
      leaveType: lt.name,
      total: lt.total,
      used: 2,
      available: lt.total - 2,
      isPaid: lt.isPaid,
      color: lt.color,
    })),
  },
  {
    employeeId: "EMP20260008",
    employeeName: "Anthony Walker",
    branch: "Downtown Branch",
    department: "Quality Assurance",
    balances: leaveTypeConfig.map((lt) => ({
      leaveType: lt.name,
      total: lt.total,
      used: 1,
      available: lt.total - 1,
      isPaid: lt.isPaid,
      color: lt.color,
    })),
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatPercentage = (used: number, total: number) => {
  if (total === 0) return 0;
  return Math.round((used / total) * 100);
};

// ─── Main Component ──────────────────────────────────────────────────────────

export const LeaveBalance: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] =
    useState<EmployeeLeaveBalance[]>(sampleEmployees);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeLeaveBalance | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [branchFilter, setBranchFilter] = useState<string>("All");

  // Get unique branches for filter
  const branches = useMemo(() => {
    const uniqueBranches = [...new Set(employees.map((e) => e.branch))];
    return ["All", ...uniqueBranches];
  }, [employees]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    let result = [...employees];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.employeeName.toLowerCase().includes(q) ||
          e.employeeId.toLowerCase().includes(q),
      );
    }

    if (branchFilter !== "All") {
      result = result.filter((e) => e.branch === branchFilter);
    }

    return result;
  }, [employees, searchQuery, branchFilter]);

  const handleEmployeeClick = (employee: EmployeeLeaveBalance) => {
    setSelectedEmployee(employee);
  };

  const handleBackToList = () => {
    setSelectedEmployee(null);
  };

  const handleExportData = () => {
    showToast("Exporting leave balance data...", "info");
  };

  const handlePrint = () => {
    window.print();
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 80) return "text-red-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-green-600";
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 80) return "bg-red-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Calculate summary stats
  const totalEmployees = filteredEmployees.length;
  const totalLeaveDays = filteredEmployees.reduce(
    (sum, emp) => sum + emp.balances.reduce((s, b) => s + b.used, 0),
    0,
  );
  const averageUsage =
    totalEmployees > 0
      ? (filteredEmployees.reduce(
          (sum, emp) =>
            sum +
            emp.balances.reduce((s, b) => s + b.used / b.total, 0) /
              emp.balances.length,
          0,
        ) /
          totalEmployees) *
        100
      : 0;

  // ─── LIST VIEW (Employee Grid)
  // ═══════════════════════════════════════════════════════════════════════════

  if (!selectedEmployee) {
    return (
      <div className="flex-1 bg-[#FAFBFC] overflow-auto">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2 sticky top-0 z-10">
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
            <span className="text-gray-900 font-medium">Leave Balance</span>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Leave Balance
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  View and manage employee leave balances
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" /> Export
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-600 font-medium">
                      Total Employees
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      {totalEmployees}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-green-600 font-medium">
                      Total Leave Days Taken
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {totalLeaveDays}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-purple-600 font-medium">
                      Average Usage
                    </p>
                    <p className="text-2xl font-bold text-purple-700">
                      {averageUsage.toFixed(1)}%
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by employee name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                    >
                      <Filter className="w-4 h-4" /> Filters{" "}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {showFilters && (
                      <div className="absolute right-0 top-12 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                        <div className="px-3 pb-1.5 mb-1 border-b border-gray-100">
                          <span className="text-xs font-medium text-gray-500">
                            Branch
                          </span>
                        </div>
                        {branches.map((b) => (
                          <button
                            key={b}
                            onClick={() => {
                              setBranchFilter(b);
                              setShowFilters(false);
                            }}
                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Employee Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map((employee) => {
                const totalUsed = employee.balances.reduce(
                  (sum, b) => sum + b.used,
                  0,
                );
                const totalAvailable = employee.balances.reduce(
                  (sum, b) => sum + b.available,
                  0,
                );
                const usagePercentage =
                  totalAvailable + totalUsed > 0
                    ? (totalUsed / (totalAvailable + totalUsed)) * 100
                    : 0;
                return (
                  <div
                    key={employee.employeeId}
                    onClick={() => handleEmployeeClick(employee)}
                    className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {employee.employeeName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {employee.employeeId}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-xs text-gray-500">Branch</p>
                      <p className="text-sm text-gray-700">{employee.branch}</p>
                      <p className="text-xs text-gray-500 mt-1">Department</p>
                      <p className="text-sm text-gray-700">
                        {employee.department}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Leave Usage</span>
                        <span
                          className={`font-medium ${getUsageColor(usagePercentage)}`}
                        >
                          {usagePercentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getProgressBarColor(usagePercentage)}`}
                          style={{ width: `${usagePercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-xs">
                        <span className="text-gray-500">
                          Used: {totalUsed} days
                        </span>
                        <span className="text-gray-500">
                          Available: {totalAvailable} days
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredEmployees.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No employees found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DETAILS VIEW (Employee Leave Balance Details)
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-auto">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2 sticky top-0 z-10">
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
          <button onClick={handleBackToList} className="hover:text-gray-700">
            Leave Balance
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">
            {selectedEmployee.employeeName}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Employee Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
                  {selectedEmployee.employeeName.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedEmployee.employeeName}
                  </h1>
                  <p className="text-gray-500">
                    {selectedEmployee.employeeId} • {selectedEmployee.branch} •{" "}
                    {selectedEmployee.department}
                  </p>
                </div>
              </div>
              <button
                onClick={handleBackToList}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Back to List
              </button>
            </div>
          </div>

          {/* Leave Balance Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-xs text-blue-600">Total Leave Types</p>
              <p className="text-2xl font-bold text-blue-700">
                {selectedEmployee.balances.length}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-xs text-green-600">Total Days Available</p>
              <p className="text-2xl font-bold text-green-700">
                {selectedEmployee.balances.reduce(
                  (sum, b) => sum + b.available,
                  0,
                )}
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <p className="text-xs text-orange-600">Total Days Used</p>
              <p className="text-2xl font-bold text-orange-700">
                {selectedEmployee.balances.reduce((sum, b) => sum + b.used, 0)}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-xs text-purple-600">Overall Usage</p>
              <p className="text-2xl font-bold text-purple-700">
                {formatPercentage(
                  selectedEmployee.balances.reduce((sum, b) => sum + b.used, 0),
                  selectedEmployee.balances.reduce(
                    (sum, b) => sum + b.total,
                    0,
                  ),
                )}
                %
              </p>
            </div>
          </div>

          {/* Leave Balance Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">
                Leave Balance Details
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                      Leave Type
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                      Total
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                      Used
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                      Available
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                      Usage
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedEmployee.balances.map((balance) => {
                    const percentage = formatPercentage(
                      balance.used,
                      balance.total,
                    );
                    return (
                      <tr key={balance.leaveType} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: balance.color }}
                            />
                            <span className="font-medium text-gray-900">
                              {balance.leaveType}
                            </span>
                            {balance.isPaid ? (
                              <span className="text-xs text-green-600">
                                (Paid)
                              </span>
                            ) : (
                              <span className="text-xs text-yellow-600">
                                (Unpaid)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {balance.total} days
                        </td>
                        <td className="px-4 py-3 text-right text-orange-600">
                          {balance.used} days
                        </td>
                        <td className="px-4 py-3 text-right text-green-600">
                          {balance.available} days
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${getProgressBarColor(percentage)}`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span
                              className={`text-xs font-medium ${getUsageColor(percentage)}`}
                            >
                              {percentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Section */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Leave Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  Total Leave Entitlement:
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {selectedEmployee.balances.reduce(
                    (sum, b) => sum + b.total,
                    0,
                  )}{" "}
                  days
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Leave Balance Remaining:
                </p>
                <p className="text-lg font-bold text-green-600">
                  {selectedEmployee.balances.reduce(
                    (sum, b) => sum + b.available,
                    0,
                  )}{" "}
                  days
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Leave Taken This Year:</p>
                <p className="text-lg font-bold text-orange-600">
                  {selectedEmployee.balances.reduce(
                    (sum, b) => sum + b.used,
                    0,
                  )}{" "}
                  days
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Remaining Percentage:</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(selectedEmployee.balances.reduce((sum, b) => sum + b.available, 0) / selectedEmployee.balances.reduce((sum, b) => sum + b.total, 0)) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {(
                      (selectedEmployee.balances.reduce(
                        (sum, b) => sum + b.available,
                        0,
                      ) /
                        selectedEmployee.balances.reduce(
                          (sum, b) => sum + b.total,
                          0,
                        )) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
