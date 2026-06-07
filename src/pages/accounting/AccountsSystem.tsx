/**
 * File: src/pages/accounting/SystemSetup.tsx
 * Complete Accounting System Setup page with Account Types, Revenue Categories, and Expense Categories
 * Based on provided screenshots design
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import {
  Plus,
  Edit,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  ChevronLeft,
  Tag,
  DollarSign,
  FolderOpen,
  Save,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AccountType {
  id: string;
  name: string;
  code: string;
  normalBalance: "Debit" | "Credit";
  categoryName: string;
  isActive: boolean;
}

interface RevenueCategory {
  id: string;
  name: string;
  glAccount: string;
  description: string;
  isActive: boolean;
}

interface ExpenseCategory {
  id: string;
  name: string;
  code: string;
  glAccount: string;
  description: string;
  isActive: boolean;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleAccountTypes: AccountType[] = [
  {
    id: "1",
    name: "Current Assets",
    code: "CA",
    normalBalance: "Debit",
    categoryName: "Assets",
    isActive: true,
  },
  {
    id: "2",
    name: "Fixed Assets",
    code: "FA",
    normalBalance: "Debit",
    categoryName: "Assets",
    isActive: true,
  },
  {
    id: "3",
    name: "Other Assets",
    code: "OA",
    normalBalance: "Debit",
    categoryName: "Assets",
    isActive: true,
  },
  {
    id: "4",
    name: "Current Liabilities",
    code: "CL",
    normalBalance: "Credit",
    categoryName: "Liabilities",
    isActive: true,
  },
  {
    id: "5",
    name: "Long-term Liabilities",
    code: "LTL",
    normalBalance: "Credit",
    categoryName: "Liabilities",
    isActive: true,
  },
  {
    id: "6",
    name: "Share Capital",
    code: "SC",
    normalBalance: "Credit",
    categoryName: "Equity",
    isActive: true,
  },
  {
    id: "7",
    name: "Retained Earnings",
    code: "RE",
    normalBalance: "Credit",
    categoryName: "Equity",
    isActive: true,
  },
  {
    id: "8",
    name: "Sales Revenue",
    code: "SR",
    normalBalance: "Credit",
    categoryName: "Revenue",
    isActive: true,
  },
  {
    id: "9",
    name: "Other Income",
    code: "OI",
    normalBalance: "Credit",
    categoryName: "Revenue",
    isActive: true,
  },
  {
    id: "10",
    name: "Cost of Goods Sold",
    code: "COGS",
    normalBalance: "Debit",
    categoryName: "Expenses",
    isActive: true,
  },
];

const sampleRevenueCategories: RevenueCategory[] = [
  {
    id: "1",
    name: "Product Sales",
    glAccount: "Sales Revenue",
    description: "Revenue from product sales",
    isActive: true,
  },
  {
    id: "2",
    name: "Service Income",
    glAccount: "Product Sales",
    description: "Revenue from services provided",
    isActive: true,
  },
  {
    id: "3",
    name: "Consulting Fees",
    glAccount: "Service Revenue",
    description: "Revenue from consulting services",
    isActive: true,
  },
  {
    id: "4",
    name: "Subscription Revenue",
    glAccount: "Consulting Revenue",
    description: "Revenue from subscription plans",
    isActive: true,
  },
  {
    id: "5",
    name: "Interest Income",
    glAccount: "Subscription Revenue",
    description: "Revenue from interest earnings",
    isActive: true,
  },
];

const sampleExpenseCategories: ExpenseCategory[] = [
  {
    id: "1",
    name: "Office Supplies",
    code: "EXP-001",
    glAccount: "Cost of Goods Sold",
    description: "Expenses for office supplies and stationery",
    isActive: true,
  },
  {
    id: "2",
    name: "Utilities",
    code: "EXP-002",
    glAccount: "Salaries Expense",
    description: "Expenses for electricity, water, and internet",
    isActive: true,
  },
  {
    id: "3",
    name: "Rent",
    code: "EXP-003",
    glAccount: "Employee Benefits",
    description: "Office and property rent expenses",
    isActive: true,
  },
  {
    id: "4",
    name: "Marketing",
    code: "EXP-004",
    glAccount: "Sales Commission Expense",
    description: "Marketing and advertising expenses",
    isActive: true,
  },
  {
    id: "5",
    name: "Travel",
    code: "EXP-005",
    glAccount: "Rent Expense",
    description: "Business travel and transportation expenses",
    isActive: true,
  },
];

const giAccounts = [
  "Cost of Goods Sold",
  "Salaries Expense",
  "Employee Benefits",
  "Sales Commission Expense",
  "Rent Expense",
  "Utilities Expense",
  "Marketing Expense",
  "Travel Expense",
];

const glAccounts = [
  "Sales Revenue",
  "Product Sales",
  "Service Revenue",
  "Consulting Revenue",
  "Subscription Revenue",
  "Interest Income",
];

const categoryNames = [
  "Assets",
  "Liabilities",
  "Equity",
  "Revenue",
  "Expenses",
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

const fmtDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// ─── Main Component ──────────────────────────────────────────────────────────

export const AccountingSystem: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "accountTypes" | "revenueCategories" | "expenseCategories"
  >("accountTypes");

  // Data states
  const [accountTypes, setAccountTypes] =
    useState<AccountType[]>(sampleAccountTypes);
  const [revenueCategories, setRevenueCategories] = useState<RevenueCategory[]>(
    sampleRevenueCategories,
  );
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(
    sampleExpenseCategories,
  );

  // Modal states
  const [showAccountTypeModal, setShowAccountTypeModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Account Type Form
  const [accountTypeForm, setAccountTypeForm] = useState({
    name: "",
    code: "",
    normalBalance: "Debit" as "Debit" | "Credit",
    categoryName: "",
    isActive: true,
  });

  // Revenue Category Form
  const [revenueForm, setRevenueForm] = useState({
    name: "",
    glAccount: "",
    description: "",
    isActive: true,
  });

  // Expense Category Form
  const [expenseForm, setExpenseForm] = useState({
    name: "",
    code: "",
    glAccount: "",
    description: "",
    isActive: true,
  });

  // ─── Account Type CRUD ─────────────────────────────────────────────────────

  const openAccountTypeModal = (item?: AccountType) => {
    if (item) {
      setIsEditing(true);
      setEditingItem(item);
      setAccountTypeForm({
        name: item.name,
        code: item.code,
        normalBalance: item.normalBalance,
        categoryName: item.categoryName,
        isActive: item.isActive,
      });
    } else {
      setIsEditing(false);
      setEditingItem(null);
      setAccountTypeForm({
        name: "",
        code: "",
        normalBalance: "Debit",
        categoryName: "",
        isActive: true,
      });
    }
    setShowAccountTypeModal(true);
  };

  const handleSaveAccountType = () => {
    if (!accountTypeForm.name) {
      showToast("Please enter account type name", "info");
      return;
    }
    if (!accountTypeForm.code) {
      showToast("Please enter account code", "info");
      return;
    }
    if (!accountTypeForm.categoryName) {
      showToast("Please select category name", "info");
      return;
    }

    if (isEditing && editingItem) {
      setAccountTypes((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: accountTypeForm.name,
                code: accountTypeForm.code,
                normalBalance: accountTypeForm.normalBalance,
                categoryName: accountTypeForm.categoryName,
                isActive: accountTypeForm.isActive,
              }
            : item,
        ),
      );
      showToast("Account type updated successfully!", "success");
    } else {
      const newItem: AccountType = {
        id: Date.now().toString(),
        name: accountTypeForm.name,
        code: accountTypeForm.code,
        normalBalance: accountTypeForm.normalBalance,
        categoryName: accountTypeForm.categoryName,
        isActive: accountTypeForm.isActive,
      };
      setAccountTypes((prev) => [...prev, newItem]);
      showToast("Account type created successfully!", "success");
    }
    setShowAccountTypeModal(false);
  };

  const handleDeleteAccountType = (id: string) => {
    if (confirm("Are you sure you want to delete this account type?")) {
      setAccountTypes((prev) => prev.filter((item) => item.id !== id));
      showToast("Account type deleted successfully!", "success");
    }
  };

  // ─── Revenue Category CRUD ─────────────────────────────────────────────────

  const openRevenueModal = (item?: RevenueCategory) => {
    if (item) {
      setIsEditing(true);
      setEditingItem(item);
      setRevenueForm({
        name: item.name,
        glAccount: item.glAccount,
        description: item.description,
        isActive: item.isActive,
      });
    } else {
      setIsEditing(false);
      setEditingItem(null);
      setRevenueForm({
        name: "",
        glAccount: "",
        description: "",
        isActive: true,
      });
    }
    setShowRevenueModal(true);
  };

  const handleSaveRevenue = () => {
    if (!revenueForm.name) {
      showToast("Please enter revenue category name", "info");
      return;
    }
    if (!revenueForm.glAccount) {
      showToast("Please select GL account", "info");
      return;
    }

    if (isEditing && editingItem) {
      setRevenueCategories((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: revenueForm.name,
                glAccount: revenueForm.glAccount,
                description: revenueForm.description,
                isActive: revenueForm.isActive,
              }
            : item,
        ),
      );
      showToast("Revenue category updated successfully!", "success");
    } else {
      const newItem: RevenueCategory = {
        id: Date.now().toString(),
        name: revenueForm.name,
        glAccount: revenueForm.glAccount,
        description: revenueForm.description,
        isActive: revenueForm.isActive,
      };
      setRevenueCategories((prev) => [...prev, newItem]);
      showToast("Revenue category created successfully!", "success");
    }
    setShowRevenueModal(false);
  };

  const handleDeleteRevenue = (id: string) => {
    if (confirm("Are you sure you want to delete this revenue category?")) {
      setRevenueCategories((prev) => prev.filter((item) => item.id !== id));
      showToast("Revenue category deleted successfully!", "success");
    }
  };

  // ─── Expense Category CRUD ─────────────────────────────────────────────────

  const openExpenseModal = (item?: ExpenseCategory) => {
    if (item) {
      setIsEditing(true);
      setEditingItem(item);
      setExpenseForm({
        name: item.name,
        code: item.code,
        glAccount: item.glAccount,
        description: item.description,
        isActive: item.isActive,
      });
    } else {
      setIsEditing(false);
      setEditingItem(null);
      setExpenseForm({
        name: "",
        code: "",
        glAccount: "",
        description: "",
        isActive: true,
      });
    }
    setShowExpenseModal(true);
  };

  const handleSaveExpense = () => {
    if (!expenseForm.name) {
      showToast("Please enter expense category name", "info");
      return;
    }
    if (!expenseForm.code) {
      showToast("Please enter category code", "info");
      return;
    }
    if (!expenseForm.glAccount) {
      showToast("Please select GI account", "info");
      return;
    }

    if (isEditing && editingItem) {
      setExpenseCategories((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: expenseForm.name,
                code: expenseForm.code,
                glAccount: expenseForm.glAccount,
                description: expenseForm.description,
                isActive: expenseForm.isActive,
              }
            : item,
        ),
      );
      showToast("Expense category updated successfully!", "success");
    } else {
      const newItem: ExpenseCategory = {
        id: Date.now().toString(),
        name: expenseForm.name,
        code: expenseForm.code,
        glAccount: expenseForm.glAccount,
        description: expenseForm.description,
        isActive: expenseForm.isActive,
      };
      setExpenseCategories((prev) => [...prev, newItem]);
      showToast("Expense category created successfully!", "success");
    }
    setShowExpenseModal(false);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm("Are you sure you want to delete this expense category?")) {
      setExpenseCategories((prev) => prev.filter((item) => item.id !== id));
      showToast("Expense category deleted successfully!", "success");
    }
  };

  // ─── Render Functions ──────────────────────────────────────────────────────

  const renderAccountTypesTab = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Account Types</h3>
        <button
          onClick={() => openAccountTypeModal()}
          className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Normal Balance
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Category Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Is Active
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {accountTypes.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {item.name}
                </td>
                <td className="px-4 py-3 text-gray-600">{item.code}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium ${item.normalBalance === "Debit" ? "text-blue-600" : "text-green-600"}`}
                  >
                    {item.normalBalance}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{item.categoryName}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {item.isActive ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAccountTypeModal(item)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAccountType(item.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRevenueCategoriesTab = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Revenue Categories</h3>
        <button
          onClick={() => openRevenueModal()}
          className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Category Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                GL Account
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Is Active
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {revenueCategories.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {item.name}
                </td>
                <td className="px-4 py-3 text-gray-600">{item.glAccount}</td>
                <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                  {item.description}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {item.isActive ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openRevenueModal(item)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRevenue(item.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderExpenseCategoriesTab = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Expense Categories</h3>
        <button
          onClick={() => openExpenseModal()}
          className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Category Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Category Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                GL Account
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Is Active
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {expenseCategories.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {item.name}
                </td>
                <td className="px-4 py-3 text-gray-600">{item.code}</td>
                <td className="px-4 py-3 text-gray-600">{item.glAccount}</td>
                <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                  {item.description}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {item.isActive ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openExpenseModal(item)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(item.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // MODALS
  // ═══════════════════════════════════════════════════════════════════════════

  const AccountTypeModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Account Type" : "Create Account Type"}
          </h2>
          <button
            onClick={() => setShowAccountTypeModal(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={accountTypeForm.name}
              onChange={(e) =>
                setAccountTypeForm({ ...accountTypeForm, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code *
            </label>
            <input
              type="text"
              value={accountTypeForm.code}
              onChange={(e) =>
                setAccountTypeForm({ ...accountTypeForm, code: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
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
                  checked={accountTypeForm.normalBalance === "Debit"}
                  onChange={(e) =>
                    setAccountTypeForm({
                      ...accountTypeForm,
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
                  checked={accountTypeForm.normalBalance === "Credit"}
                  onChange={(e) =>
                    setAccountTypeForm({
                      ...accountTypeForm,
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
              Category Name *
            </label>
            <select
              value={accountTypeForm.categoryName}
              onChange={(e) =>
                setAccountTypeForm({
                  ...accountTypeForm,
                  categoryName: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="">Select Category</option>
              {categoryNames.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="accountTypeActive"
              checked={accountTypeForm.isActive}
              onChange={(e) =>
                setAccountTypeForm({
                  ...accountTypeForm,
                  isActive: e.target.checked,
                })
              }
              className="w-4 h-4 text-blue-600 rounded border-gray-300"
            />
            <label
              htmlFor="accountTypeActive"
              className="text-sm text-gray-700"
            >
              Is Active
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-100">
          <button
            onClick={() => setShowAccountTypeModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAccountType}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEditing ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );

  const RevenueModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Revenue Category" : "Create Revenue Category"}
          </h2>
          <button
            onClick={() => setShowRevenueModal(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              value={revenueForm.name}
              onChange={(e) =>
                setRevenueForm({ ...revenueForm, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GL Account *
            </label>
            <select
              value={revenueForm.glAccount}
              onChange={(e) =>
                setRevenueForm({ ...revenueForm, glAccount: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="">Select GL Account</option>
              {glAccounts.map((acc) => (
                <option key={acc} value={acc}>
                  {acc}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={revenueForm.description}
              onChange={(e) =>
                setRevenueForm({ ...revenueForm, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="revenueActive"
              checked={revenueForm.isActive}
              onChange={(e) =>
                setRevenueForm({ ...revenueForm, isActive: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded border-gray-300"
            />
            <label htmlFor="revenueActive" className="text-sm text-gray-700">
              Is Active
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-100">
          <button
            onClick={() => setShowRevenueModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveRevenue}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEditing ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );

  const ExpenseModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Expense Category" : "Create Expense Category"}
          </h2>
          <button
            onClick={() => setShowExpenseModal(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              value={expenseForm.name}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Code *
            </label>
            <input
              type="text"
              value={expenseForm.code}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, code: e.target.value })
              }
              placeholder="EXP-001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GI Account *
            </label>
            <select
              value={expenseForm.glAccount}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, glAccount: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="">Select GI Account</option>
              {giAccounts.map((acc) => (
                <option key={acc} value={acc}>
                  {acc}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={expenseForm.description}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="expenseActive"
              checked={expenseForm.isActive}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, isActive: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded border-gray-300"
            />
            <label htmlFor="expenseActive" className="text-sm text-gray-700">
              Is Active
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-100">
          <button
            onClick={() => setShowExpenseModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveExpense}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEditing ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════════════════

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
            onClick={() => navigate("/accounting")}
            className="hover:text-gray-700"
          >
            Accounting
          </button>
          <span>›</span>
          <button
            onClick={() => navigate("/accounting/system")}
            className="hover:text-gray-700"
          >
            System Setup
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Account Types</span>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              System Setup
            </h1>
          </div>

          {/* Tabs */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 rounded-t-lg">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab("accountTypes")}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "accountTypes"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <FolderOpen className="w-4 h-4 inline mr-2" />
                Account Types
              </button>
              <button
                onClick={() => setActiveTab("revenueCategories")}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "revenueCategories"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <DollarSign className="w-4 h-4 inline mr-2" />
                Revenue Categories
              </button>
              <button
                onClick={() => setActiveTab("expenseCategories")}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "expenseCategories"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Tag className="w-4 h-4 inline mr-2" />
                Expense Categories
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="mt-6">
            {activeTab === "accountTypes" && renderAccountTypesTab()}
            {activeTab === "revenueCategories" && renderRevenueCategoriesTab()}
            {activeTab === "expenseCategories" && renderExpenseCategoriesTab()}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAccountTypeModal && <AccountTypeModal />}
      {showRevenueModal && <RevenueModal />}
      {showExpenseModal && <ExpenseModal />}
    </div>
  );
};
