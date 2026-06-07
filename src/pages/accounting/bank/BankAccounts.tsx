/**
 * File: src/pages/accounting/BankAccounts.tsx
 * Complete Bank Accounts Management page with list view, create/edit modal, and details modal
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
  Building2,
  CreditCard,
  DollarSign,
  Eye,
  Save,
  AlertCircle,
  CheckCircle,
  Landmark,
  Globe,
  Hash,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { showToast } from "@/utils/toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BankAccount {
  id: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  branchName: string;
  accountType: "checking" | "savings" | "credit" | "loan";
  giAccount: string;
  openingBalance: number;
  currentBalance: number;
  iban: string;
  routingNumber: string;
  swiftCode: string;
  status: "Active" | "Inactive";
  creditLimit?: number;
  savingsAmount?: number;
  equipmentAmount?: number;
  pettyCashAmount?: number;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleBankAccounts: BankAccount[] = [
  {
    id: "1",
    accountNumber: "1234567890",
    accountName: "Business Checking Account",
    bankName: "Chase Bank",
    branchName: "Downtown Branch",
    accountType: "checking",
    giAccount: "1000 - Cash",
    openingBalance: 500000.0,
    currentBalance: 1079790.99,
    iban: "US64SVBKUS6S3300958879",
    routingNumber: "021000021",
    swiftCode: "CHASUS33",
    status: "Active",
    creditLimit: 0,
    savingsAmount: 0,
    equipmentAmount: 0,
    pettyCashAmount: 0,
  },
  {
    id: "2",
    accountNumber: "9876543210",
    accountName: "Savings Account",
    bankName: "Bank of America",
    branchName: "Main Street Branch",
    accountType: "savings",
    giAccount: "1010 - Savings",
    openingBalance: 1000000.0,
    currentBalance: 2541388.94,
    iban: "US64BOFAUS6S3300958880",
    routingNumber: "026009593",
    swiftCode: "BOFAUS3N",
    status: "Active",
    creditLimit: 0,
    savingsAmount: 2541388.94,
    equipmentAmount: 0,
    pettyCashAmount: 0,
  },
  {
    id: "3",
    accountNumber: "5555666677",
    accountName: "Credit Line Account",
    bankName: "Wells Fargo",
    branchName: "Financial District",
    accountType: "credit",
    giAccount: "1020 - Credit Card",
    openingBalance: 0,
    currentBalance: 3023473.35,
    iban: "US64WFUS6S3300958881",
    routingNumber: "121000248",
    swiftCode: "WFBIUS6S",
    status: "Active",
    creditLimit: 5000000.0,
    savingsAmount: 0,
    equipmentAmount: 0,
    pettyCashAmount: 0,
  },
  {
    id: "4",
    accountNumber: "1111222233",
    accountName: "Equipment Loan Account",
    bankName: "Citibank",
    branchName: "Business Center",
    accountType: "loan",
    giAccount: "1030 - Loan",
    openingBalance: 100000.0,
    currentBalance: 85000.0,
    iban: "US64CITIUS6S3300958882",
    routingNumber: "321171184",
    swiftCode: "CITIUS33",
    status: "Inactive",
    creditLimit: 0,
    savingsAmount: 0,
    equipmentAmount: 3023473.35,
    pettyCashAmount: 0,
  },
  {
    id: "5",
    accountNumber: "7777888899",
    accountName: "Petty Cash Account",
    bankName: "TD Bank",
    branchName: "Local Branch",
    accountType: "checking",
    giAccount: "1040 - Petty Cash",
    openingBalance: 5000.0,
    currentBalance: 85000.0,
    iban: "US64TDBKUS6S3300958883",
    routingNumber: "031101266",
    swiftCode: "NRTHUS33",
    status: "Active",
    creditLimit: 0,
    savingsAmount: 0,
    equipmentAmount: 0,
    pettyCashAmount: 85000.0,
  },
];

const giAccounts = [
  "1000 - Cash",
  "1010 - Savings",
  "1020 - Credit Card",
  "1030 - Loan",
  "1040 - Petty Cash",
  "1050 - Investments",
];
const bankNames = [
  "Chase Bank",
  "Bank of America",
  "Wells Fargo",
  "Citibank",
  "TD Bank",
  "PNC Bank",
  "US Bank",
  "Capital One",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField =
  | "accountNumber"
  | "accountName"
  | "bankName"
  | "accountType"
  | "currentBalance"
  | "status";
type SortDir = "asc" | "desc";

// ─── Main Bank Accounts Component ────────────────────────────────────────────

export const BankAccounts: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<BankAccount[]>(sampleBankAccounts);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("accountNumber");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    accountNumber: "",
    accountName: "",
    bankName: "",
    branchName: "",
    accountType: "checking" as "checking" | "savings" | "credit" | "loan",
    giAccount: "",
    openingBalance: 0,
    currentBalance: 0,
    iban: "",
    routingNumber: "",
    swiftCode: "",
    status: "Active" as "Active" | "Inactive",
    creditLimit: 0,
    savingsAmount: 0,
    equipmentAmount: 0,
    pettyCashAmount: 0,
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
          a.accountNumber.toLowerCase().includes(q) ||
          a.accountName.toLowerCase().includes(q) ||
          a.bankName.toLowerCase().includes(q),
      );
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
  }, [accounts, searchQuery, sortField, sortDir]);

  const totalPages = Math.ceil(filteredAccounts.length / perPage);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormData({
      accountNumber: "",
      accountName: "",
      bankName: "",
      branchName: "",
      accountType: "checking",
      giAccount: "",
      openingBalance: 0,
      currentBalance: 0,
      iban: "",
      routingNumber: "",
      swiftCode: "",
      status: "Active",
      creditLimit: 0,
      savingsAmount: 0,
      equipmentAmount: 0,
      pettyCashAmount: 0,
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (account: BankAccount) => {
    setSelectedAccount(account);
    setFormData({
      accountNumber: account.accountNumber,
      accountName: account.accountName,
      bankName: account.bankName,
      branchName: account.branchName,
      accountType: account.accountType,
      giAccount: account.giAccount,
      openingBalance: account.openingBalance,
      currentBalance: account.currentBalance,
      iban: account.iban,
      routingNumber: account.routingNumber,
      swiftCode: account.swiftCode,
      status: account.status,
      creditLimit: account.creditLimit ?? 0,
      savingsAmount: account.savingsAmount ?? 0,
      equipmentAmount: account.equipmentAmount ?? 0,
      pettyCashAmount: account.pettyCashAmount ?? 0,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openViewModal = (account: BankAccount) => {
    setSelectedAccount(account);
    setShowViewModal(true);
  };

  const openDeleteModal = (account: BankAccount) => {
    setSelectedAccount(account);
    setShowDeleteModal(true);
  };

  const handleSaveAccount = () => {
    if (!formData.accountNumber) {
      showToast("Please enter account number", "info");
      return;
    }
    if (!formData.accountName) {
      showToast("Please enter account name", "info");
      return;
    }
    if (!formData.bankName) {
      showToast("Please enter bank name", "info");
      return;
    }

    if (isEditing && selectedAccount) {
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === selectedAccount.id
            ? {
                ...a,
                accountNumber: formData.accountNumber,
                accountName: formData.accountName,
                bankName: formData.bankName,
                branchName: formData.branchName,
                accountType: formData.accountType,
                giAccount: formData.giAccount,
                openingBalance: formData.openingBalance,
                currentBalance: formData.currentBalance,
                iban: formData.iban,
                routingNumber: formData.routingNumber,
                swiftCode: formData.swiftCode,
                status: formData.status,
                creditLimit: formData.creditLimit,
                savingsAmount: formData.savingsAmount,
                equipmentAmount: formData.equipmentAmount,
                pettyCashAmount: formData.pettyCashAmount,
              }
            : a,
        ),
      );
      showToast("Bank account updated successfully!", "success");
      setShowEditModal(false);
    } else {
      const newAccount: BankAccount = {
        id: Date.now().toString(),
        accountNumber: formData.accountNumber,
        accountName: formData.accountName,
        bankName: formData.bankName,
        branchName: formData.branchName,
        accountType: formData.accountType,
        giAccount: formData.giAccount,
        openingBalance: formData.openingBalance,
        currentBalance: formData.currentBalance,
        iban: formData.iban,
        routingNumber: formData.routingNumber,
        swiftCode: formData.swiftCode,
        status: formData.status,
        creditLimit: formData.creditLimit,
        savingsAmount: formData.savingsAmount,
        equipmentAmount: formData.equipmentAmount,
        pettyCashAmount: formData.pettyCashAmount,
      };
      setAccounts((prev) => [...prev, newAccount]);
      showToast("Bank account created successfully!", "success");
      setShowCreateModal(false);
    }
    resetForm();
  };

  const handleDeleteAccount = () => {
    if (selectedAccount) {
      setAccounts((prev) => prev.filter((a) => a.id !== selectedAccount.id));
      showToast("Bank account deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedAccount(null);
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "checking":
        return "bg-blue-100 text-blue-700";
      case "savings":
        return "bg-green-100 text-green-700";
      case "credit":
        return "bg-purple-100 text-purple-700";
      case "loan":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Bank Account" : "Create Bank Account"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing
                ? "Update bank account information"
                : "Add a new bank account"}
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
                Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) =>
                  setFormData({ ...formData, accountNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
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
                Bank Name <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.bankName}
                onChange={(e) =>
                  setFormData({ ...formData, bankName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select Bank</option>
                {bankNames.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Name
              </label>
              <input
                type="text"
                value={formData.branchName}
                onChange={(e) =>
                  setFormData({ ...formData, branchName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <div className="flex flex-wrap gap-4 mt-1">
                {["checking", "savings", "credit", "loan"].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="accountType"
                      value={type}
                      checked={formData.accountType === type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          accountType: e.target.value as any,
                        })
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GI Account
              </label>
              <select
                value={formData.giAccount}
                onChange={(e) =>
                  setFormData({ ...formData, giAccount: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select GI Account</option>
                {giAccounts.map((gi) => (
                  <option key={gi} value={gi}>
                    {gi}
                  </option>
                ))}
              </select>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IBAN
              </label>
              <input
                type="text"
                value={formData.iban}
                onChange={(e) =>
                  setFormData({ ...formData, iban: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Routing Number
              </label>
              <input
                type="text"
                value={formData.routingNumber}
                onChange={(e) =>
                  setFormData({ ...formData, routingNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Swift Code
              </label>
              <input
                type="text"
                value={formData.swiftCode}
                onChange={(e) =>
                  setFormData({ ...formData, swiftCode: e.target.value })
                }
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

          {/* Account Type Specific Fields */}
          {formData.accountType === "credit" && (
            <div className="border-t border-gray-200 pt-4 mt-2">
              <h3 className="font-medium text-gray-900 mb-3">
                Credit Account Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credit Limit
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={formData.creditLimit || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          creditLimit: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Bank Account Details
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
                <p className="text-xs text-gray-500">Account Number</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedAccount.accountNumber}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Account Name</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedAccount.accountName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Bank Name</p>
                <p className="text-sm text-gray-600">
                  {selectedAccount.bankName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Branch Name</p>
                <p className="text-sm text-gray-600">
                  {selectedAccount.branchName || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Opening Balance</p>
                <p className="text-sm font-medium text-gray-900">
                  {fmtCurrency(selectedAccount.openingBalance)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">IBAN</p>
                <p className="text-sm text-gray-600">
                  {selectedAccount.iban || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Routing Number</p>
                <p className="text-sm text-gray-600">
                  {selectedAccount.routingNumber || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAccount.status)}`}
                >
                  {selectedAccount.status}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <h3 className="font-medium text-gray-900 mb-3">
                Current Balances
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-blue-600">Current Balance</p>
                  <p className="text-lg font-bold text-blue-700">
                    {fmtCurrency(selectedAccount.currentBalance)}
                  </p>
                </div>
                {(selectedAccount.savingsAmount ?? 0) > 0 && (
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-green-600">Savings Amount</p>
                    <p className="text-lg font-bold text-green-700">
                      {fmtCurrency(selectedAccount.savingsAmount ?? 0)}
                    </p>
                  </div>
                )}
                {(selectedAccount.creditLimit ?? 0) > 0 && (
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-purple-600">Credit Limit</p>
                    <p className="text-lg font-bold text-purple-700">
                      {fmtCurrency(selectedAccount.creditLimit ?? 0)}
                    </p>
                  </div>
                )}
                {(selectedAccount.equipmentAmount ?? 0) > 0 && (
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-orange-600">Equipment</p>
                    <p className="text-lg font-bold text-orange-700">
                      {fmtCurrency(selectedAccount.equipmentAmount ?? 0)}
                    </p>
                  </div>
                )}
                {(selectedAccount.pettyCashAmount ?? 0) > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-yellow-600">Petty Cash</p>
                    <p className="text-lg font-bold text-yellow-700">
                      {fmtCurrency(selectedAccount.pettyCashAmount ?? 0)}
                    </p>
                  </div>
                )}
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
            Delete Bank Account
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
          <span className="text-gray-900 font-medium">Bank Accounts</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Bank Accounts
          </h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Bank Account"
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
                placeholder="Search Bank Accounts..."
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
                  <button
                    onClick={() => { showToast("Exporting as CSV...", "info"); setShowFilters(false); }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 text-gray-700"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={() => { showToast("Exporting as PDF...", "info"); setShowFilters(false); }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 text-gray-700"
                  >
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
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="accountNumber" label="Account Number" />
                <SortHeader field="accountName" label="Account Name" />
                <SortHeader field="bankName" label="Bank Name" />
                <SortHeader field="accountType" label="Account Type" />
                <SortHeader field="currentBalance" label="Current Balance" />
                <SortHeader field="status" label="Is Active" />
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
                  <td className="px-4 py-3 font-mono text-sm text-gray-900">
                    {account.accountNumber}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {account.accountName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {account.bankName}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getAccountTypeColor(account.accountType)}`}
                    >
                      {account.accountType}
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
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No bank accounts found.
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
