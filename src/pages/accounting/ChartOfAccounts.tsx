/**
 * File: src/pages/accounting/ChartOfAccounts.tsx
 * Complete Chart of Accounts Management page with list view, create/edit modal, and details modal
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
  Save,
  AlertCircle,
  CheckCircle,
  BookOpen,
  DollarSign,
  FileText,
  TrendingUp,
  TrendingDown,
  Building2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChartOfAccount {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: string;
  accountTypeName: string;
  parentAccount: string;
  normalBalance: "Debit" | "Credit";
  openingBalance: number;
  currentBalance: number;
  status: "Active" | "Inactive";
  description: string;
  isSubAccount: boolean;
  parentAccountId?: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleAccounts: ChartOfAccount[] = [
  {
    id: "1",
    accountCode: "5800",
    accountName: "Miscellaneous Expense",
    accountType: "Other Expenses",
    accountTypeName: "Other Expenses",
    parentAccount: "Other Expenses",
    normalBalance: "Debit",
    openingBalance: 0,
    currentBalance: 0,
    status: "Active",
    description: "Other miscellaneous expenses",
    isSubAccount: false,
  },
  {
    id: "2",
    accountCode: "5500",
    accountName: "Interest Expense",
    accountType: "Financial Expenses",
    accountTypeName: "Financial Expenses",
    parentAccount: "Financial Expenses",
    normalBalance: "Debit",
    openingBalance: 0,
    currentBalance: 0,
    status: "Active",
    description: "Interest expense on loans and borrowings",
    isSubAccount: false,
  },
  {
    id: "3",
    accountCode: "5510",
    accountName: "Bank Charges",
    accountType: "Financial Expenses",
    accountTypeName: "Financial Expenses",
    parentAccount: "Financial Expenses",
    normalBalance: "Debit",
    openingBalance: 0,
    currentBalance: 412.0,
    status: "Active",
    description: "Bank service charges and fees",
    isSubAccount: true,
    parentAccountId: "2",
  },
  {
    id: "4",
    accountCode: "5700",
    accountName: "Bad Debt Expense",
    accountType: "Other Expenses",
    accountTypeName: "Other Expenses",
    parentAccount: "Other Expenses",
    normalBalance: "Debit",
    openingBalance: 0,
    currentBalance: 0,
    status: "Active",
    description: "Write-offs for uncollectible accounts",
    isSubAccount: false,
  },
  {
    id: "5",
    accountCode: "5600",
    accountName: "Tax Expense",
    accountType: "Tax Expenses",
    accountTypeName: "Tax Expenses",
    parentAccount: "Tax Expenses",
    normalBalance: "Debit",
    openingBalance: 0,
    currentBalance: 0,
    status: "Active",
    description: "Corporate income tax expense",
    isSubAccount: false,
  },
  {
    id: "6",
    accountCode: "4130",
    accountName: "Maintenance Income",
    accountType: "Other Income",
    accountTypeName: "Other Income",
    parentAccount: "Other Income",
    normalBalance: "Credit",
    openingBalance: 0,
    currentBalance: 1200.0,
    status: "Active",
    description: "Income from maintenance services",
    isSubAccount: false,
  },
  {
    id: "7",
    accountCode: "4140",
    accountName: "Training Income",
    accountType: "Other Income",
    accountTypeName: "Other Income",
    parentAccount: "Other Income",
    normalBalance: "Credit",
    openingBalance: 0,
    currentBalance: 0,
    status: "Active",
    description: "Income from training programs",
    isSubAccount: false,
  },
  {
    id: "8",
    accountCode: "4300",
    accountName: "Other Income",
    accountType: "Other Income",
    accountTypeName: "Other Income",
    parentAccount: "Other Income",
    normalBalance: "Credit",
    openingBalance: 0,
    currentBalance: 0,
    status: "Active",
    description: "Miscellaneous other income",
    isSubAccount: false,
  },
  {
    id: "9",
    accountCode: "4400",
    accountName: "Project Revenue",
    accountType: "Sales Revenue",
    accountTypeName: "Sales Revenue",
    parentAccount: "Sales Revenue",
    normalBalance: "Credit",
    openingBalance: 0,
    currentBalance: 0,
    status: "Active",
    description: "Revenue from project-based work",
    isSubAccount: false,
  },
];

const accountTypes = [
  "Assets",
  "Liabilities",
  "Equity",
  "Income",
  "Sales Revenue",
  "Other Income",
  "Cost of Goods Sold",
  "Expenses",
  "Financial Expenses",
  "Tax Expenses",
  "Other Expenses",
];

const parentAccounts = [
  { id: "1", name: "Assets", code: "1000" },
  { id: "2", name: "Liabilities", code: "2000" },
  { id: "3", name: "Equity", code: "3000" },
  { id: "4", name: "Income", code: "4000" },
  { id: "5", name: "Sales Revenue", code: "4100" },
  { id: "6", name: "Other Income", code: "4200" },
  { id: "7", name: "Cost of Goods Sold", code: "5000" },
  { id: "8", name: "Expenses", code: "6000" },
  { id: "9", name: "Financial Expenses", code: "6500" },
  { id: "10", name: "Tax Expenses", code: "7000" },
  { id: "11", name: "Other Expenses", code: "8000" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField =
  | "accountCode"
  | "accountName"
  | "accountTypeName"
  | "parentAccount"
  | "normalBalance"
  | "currentBalance"
  | "status";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const ChartOfAccounts: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<ChartOfAccount[]>(sampleAccounts);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("accountCode");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<ChartOfAccount | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    accountCode: "",
    accountName: "",
    accountType: "",
    parentAccount: "",
    normalBalance: "Debit" as "Debit" | "Credit",
    openingBalance: 0,
    currentBalance: 0,
    description: "",
    isActive: true,
    isSubAccount: false,
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

  const filteredAccounts = useMemo(() => {
    let result = [...accounts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.accountCode.toLowerCase().includes(q) ||
          a.accountName.toLowerCase().includes(q) ||
          a.accountType.toLowerCase().includes(q),
      );
    }

    if (accountTypeFilter !== "All") {
      result = result.filter((a) => a.accountType === accountTypeFilter);
    }

    if (statusFilter !== "All") {
      result = result.filter((a) => a.status === statusFilter);
    }

    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "currentBalance") {
        aVal = a.currentBalance;
        bVal = b.currentBalance;
      }

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [
    accounts,
    searchQuery,
    accountTypeFilter,
    statusFilter,
    sortField,
    sortDir,
  ]);

  const totalPages = Math.ceil(filteredAccounts.length / perPage);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormData({
      accountCode: "",
      accountName: "",
      accountType: "",
      parentAccount: "",
      normalBalance: "Debit",
      openingBalance: 0,
      currentBalance: 0,
      description: "",
      isActive: true,
      isSubAccount: false,
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (account: ChartOfAccount) => {
    setSelectedAccount(account);
    setFormData({
      accountCode: account.accountCode,
      accountName: account.accountName,
      accountType: account.accountType,
      parentAccount: account.parentAccount,
      normalBalance: account.normalBalance,
      openingBalance: account.openingBalance,
      currentBalance: account.currentBalance,
      description: account.description,
      isActive: account.status === "Active",
      isSubAccount: account.isSubAccount,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openViewModal = (account: ChartOfAccount) => {
    setSelectedAccount(account);
    setShowViewModal(true);
  };

  const openDeleteModal = (account: ChartOfAccount) => {
    setSelectedAccount(account);
    setShowDeleteModal(true);
  };

  const handleSaveAccount = () => {
    if (!formData.accountCode) {
      showToast("Please enter account code", "info");
      return;
    }
    if (!formData.accountName) {
      showToast("Please enter account name", "info");
      return;
    }
    if (!formData.accountType) {
      showToast("Please select account type", "info");
      return;
    }

    if (isEditing && selectedAccount) {
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === selectedAccount.id
            ? {
                ...a,
                accountCode: formData.accountCode,
                accountName: formData.accountName,
                accountType: formData.accountType,
                accountTypeName: formData.accountType,
                parentAccount: formData.parentAccount || formData.accountType,
                normalBalance: formData.normalBalance,
                openingBalance: formData.openingBalance,
                currentBalance: formData.currentBalance,
                status: formData.isActive ? "Active" : "Inactive",
                description: formData.description,
                isSubAccount: formData.isSubAccount,
              }
            : a,
        ),
      );
      showToast("Account updated successfully!", "success");
      setShowEditModal(false);
    } else {
      const existingCodes = accounts.map((a) => a.accountCode);
      if (existingCodes.includes(formData.accountCode)) {
        showToast("Account code already exists", "error");
        return;
      }

      const newAccount: ChartOfAccount = {
        id: Date.now().toString(),
        accountCode: formData.accountCode,
        accountName: formData.accountName,
        accountType: formData.accountType,
        accountTypeName: formData.accountType,
        parentAccount: formData.parentAccount || formData.accountType,
        normalBalance: formData.normalBalance,
        openingBalance: formData.openingBalance,
        currentBalance: formData.currentBalance,
        status: formData.isActive ? "Active" : "Inactive",
        description: formData.description,
        isSubAccount: formData.isSubAccount,
      };
      setAccounts((prev) => [...prev, newAccount]);
      showToast("Account created successfully!", "success");
      setShowCreateModal(false);
    }
    resetForm();
  };

  const handleDeleteAccount = () => {
    if (selectedAccount) {
      setAccounts((prev) => prev.filter((a) => a.id !== selectedAccount.id));
      showToast("Account deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedAccount(null);
    }
  };

  const getNormalBalanceColor = (balance: string) => {
    return balance === "Debit" ? "text-blue-600" : "text-green-600";
  };

  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Chart of Account" : "Create Chart of Account"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing
                ? "Update account information"
                : "Add a new account to the chart"}
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
                Account Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.accountType}
                onChange={(e) =>
                  setFormData({ ...formData, accountType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select Account Type</option>
                {accountTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.accountName}
                onChange={(e) =>
                  setFormData({ ...formData, accountName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.accountCode}
                onChange={(e) =>
                  setFormData({ ...formData, accountCode: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Account
              </label>
              <select
                value={formData.parentAccount}
                onChange={(e) =>
                  setFormData({ ...formData, parentAccount: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select Parent Account</option>
                {parentAccounts.map((account) => (
                  <option key={account.id} value={account.name}>
                    {account.name} ({account.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Normal Balance
              </label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="normalBalance"
                    value="Debit"
                    checked={formData.normalBalance === "Debit"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        normalBalance: e.target.value as "Debit",
                      })
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Debit</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="normalBalance"
                    value="Credit"
                    checked={formData.normalBalance === "Credit"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        normalBalance: e.target.value as "Credit",
                      })
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Credit</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opening Balance
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={formData.openingBalance || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      openingBalance: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Balance
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  step={0.01}
                  value={formData.currentBalance || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentBalance: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                placeholder="Enter description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-2">
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Is Active</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isSubAccount}
                  onChange={(e) =>
                    setFormData({ ...formData, isSubAccount: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">
                  Create as sub account
                </span>
              </label>
            </div>
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
            onClick={handleSaveAccount}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEditing ? "Update" : "Create"}
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
              View Chart of Account
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedAccount?.accountName}
            </p>
          </div>
          <button
            onClick={() => setShowViewModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {selectedAccount && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500">Account Code</p>
                <p className="text-sm font-mono font-medium text-gray-900">
                  #{selectedAccount.accountCode}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Account Name</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedAccount.accountName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Account Type</p>
                <p className="text-sm text-gray-600">
                  {selectedAccount.accountType}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Parent Account</p>
                <p className="text-sm text-gray-600">
                  {selectedAccount.parentAccount || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Normal Balance</p>
                <p
                  className={`text-sm font-medium ${getNormalBalanceColor(selectedAccount.normalBalance)}`}
                >
                  {selectedAccount.normalBalance}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAccount.status)}`}
                >
                  {selectedAccount.status === "Active" ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  {selectedAccount.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Opening Balance</p>
                <p className="text-sm font-medium text-gray-900">
                  {fmtCurrency(selectedAccount.openingBalance)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Current Balance</p>
                <p className="text-sm font-medium text-gray-900">
                  {fmtCurrency(selectedAccount.currentBalance)}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm text-gray-600">
                  {selectedAccount.description || "-"}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-900 mb-3">
                Calculated Balance
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">DR (Debit)</span>
                  <span className="text-sm font-medium text-blue-600">
                    {selectedAccount.normalBalance === "Debit"
                      ? fmtCurrency(selectedAccount.currentBalance)
                      : "0.00$"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">CR (Credit)</span>
                  <span className="text-sm font-medium text-green-600">
                    {selectedAccount.normalBalance === "Credit"
                      ? fmtCurrency(selectedAccount.currentBalance)
                      : "0.00$"}
                  </span>
                </div>
              </div>
            </div>
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
              if (selectedAccount) openEditModal(selectedAccount);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Account
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
            Delete Account
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {selectedAccount?.accountName}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteAccount}
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
          <span className="text-gray-900 font-medium">Chart Of Accounts</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Chart Of Accounts
          </h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Account"
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
                placeholder="Search Chart Of Accounts..."
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
                <div className="absolute right-0 top-10 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-3 pb-2 mb-1 border-b border-gray-100">
                    <span className="text-xs font-medium text-gray-500">
                      Account Type
                    </span>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {["All", ...accountTypes].map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setAccountTypeFilter(type);
                          setCurrentPage(1);
                          setShowFilters(false);
                        }}
                        className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${accountTypeFilter === type ? "text-blue-600 font-medium bg-blue-50" : "text-gray-700"}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <div className="px-3 pb-2 mt-2 mb-1 border-b border-gray-100">
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

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1100px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="accountCode" label="Account Code" />
                <SortHeader field="accountName" label="Account Name" />
                <SortHeader field="accountTypeName" label="Account Type Name" />
                <SortHeader field="parentAccount" label="Parent Account" />
                <SortHeader field="normalBalance" label="Normal Balance" />
                <SortHeader field="currentBalance" label="Current Balance" />
                <SortHeader field="status" label="Status" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedAccounts.map((account) => (
                <tr
                  key={account.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openViewModal(account)}
                >
                  <td className="px-4 py-3 font-mono text-sm font-medium text-gray-900">
                    {account.accountCode}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {account.accountName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {account.accountTypeName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {account.parentAccount}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm font-medium ${getNormalBalanceColor(account.normalBalance)}`}
                    >
                      {account.normalBalance}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {fmtCurrency(account.currentBalance)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}
                    >
                      {account.status === "Active" ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {account.status}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openViewModal(account)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(account)}
                        className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(account)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedAccounts.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No accounts found.
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
            {filteredAccounts.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredAccounts.length)} of{" "}
            {filteredAccounts.length} results
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

      {/* Modals */}
      {(showCreateModal || showEditModal) && <CreateEditModal />}
      {showViewModal && <ViewModal />}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
};
