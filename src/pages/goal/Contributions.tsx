/**
 * File: src/pages/goals/Contributions.tsx
 * Complete Contributions Management page with list view, create/edit modal, and details modal
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
  Calendar,
  DollarSign,
  Target,
  CreditCard,
  TrendingUp,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Contribution {
  id: string;
  goal: string;
  date: string;
  amount: number;
  type: "Manual" | "Automatic";
  notes: string;
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleContributions: Contribution[] = [
  {
    id: "1",
    goal: "Investment Portfolio",
    date: "2025-12-20",
    amount: 5000.0,
    type: "Manual",
    notes: "Initial contribution to start the goal",
    createdAt: "2025-12-20",
  },
  {
    id: "2",
    goal: "Credit Card Debt",
    date: "2025-12-25",
    amount: 2500.0,
    type: "Automatic",
    notes: "Monthly automatic transfer",
    createdAt: "2025-12-25",
  },
  {
    id: "3",
    goal: "Operational Cost Reduction",
    date: "2025-12-30",
    amount: 1000.0,
    type: "Automatic",
    notes: "Bonus allocation from quarterly performance",
    createdAt: "2025-12-30",
  },
  {
    id: "4",
    goal: "Retirement Savings",
    date: "2026-01-04",
    amount: 3000.0,
    type: "Manual",
    notes: "Additional contribution from savings",
    createdAt: "2026-01-04",
  },
  {
    id: "5",
    goal: "Student Loan Payoff",
    date: "2026-01-09",
    amount: 1500.0,
    type: "Automatic",
    notes: "Scheduled monthly contribution",
    createdAt: "2026-01-09",
  },
  {
    id: "6",
    goal: "Investment Portfolio",
    date: "2026-01-14",
    amount: 750.0,
    type: "Manual",
    notes: "Weekend side income contribution",
    createdAt: "2026-01-14",
  },
  {
    id: "7",
    goal: "Credit Card Debt",
    date: "2026-01-17",
    amount: 2000.0,
    type: "Automatic",
    notes: "Investment return allocation",
    createdAt: "2026-01-17",
  },
  {
    id: "8",
    goal: "Operational Cost Reduction",
    date: "2026-01-19",
    amount: 500.0,
    type: "Automatic",
    notes: "Daily savings plan contribution",
    createdAt: "2026-01-19",
  },
];

const goalsList = [
  "Investment Portfolio",
  "Credit Card Debt",
  "Operational Cost Reduction",
  "Retirement Savings",
  "Student Loan Payoff",
  "Emergency Fund",
  "Annual Revenue Target",
  "Home Down Payment",
];

const contributionTypes = ["Manual", "Automatic"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtCurrency = (val: number) => {
  const formatted = val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}$`;
};

type SortField = "goal" | "date" | "amount" | "type";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const Contributions: React.FC = () => {
  const navigate = useNavigate();
  const [contributions, setContributions] =
    useState<Contribution[]>(sampleContributions);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedContribution, setSelectedContribution] =
    useState<Contribution | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [contributionFormData, setContributionFormData] = useState({
    goal: "",
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    type: "Manual" as "Manual" | "Automatic",
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

  const filteredContributions = useMemo(() => {
    let result = [...contributions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.goal.toLowerCase().includes(q) || c.notes.toLowerCase().includes(q),
      );
    }

    if (typeFilter !== "All") {
      result = result.filter((c) => c.type === typeFilter);
    }

    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "amount") {
        aVal = a.amount;
        bVal = b.amount;
      }

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [contributions, searchQuery, typeFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredContributions.length / perPage);
  const paginatedContributions = filteredContributions.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const resetContributionForm = () => {
    setContributionFormData({
      goal: "",
      date: new Date().toISOString().split("T")[0],
      amount: 0,
      type: "Manual",
      notes: "",
    });
  };

  const openCreateModal = () => {
    resetContributionForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (contribution: Contribution) => {
    setSelectedContribution(contribution);
    setContributionFormData({
      goal: contribution.goal,
      date: contribution.date,
      amount: contribution.amount,
      type: contribution.type,
      notes: contribution.notes,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openViewModal = (contribution: Contribution) => {
    setSelectedContribution(contribution);
    setShowViewModal(true);
  };

  const openDeleteModal = (contribution: Contribution) => {
    setSelectedContribution(contribution);
    setShowDeleteModal(true);
  };

  const handleSaveContribution = () => {
    if (!contributionFormData.goal) {
      showToast("Please select a goal", "info");
      return;
    }
    if (!contributionFormData.date) {
      showToast("Please select a date", "info");
      return;
    }
    if (contributionFormData.amount <= 0) {
      showToast("Please enter a valid amount", "info");
      return;
    }

    if (isEditing && selectedContribution) {
      setContributions((prev) =>
        prev.map((c) =>
          c.id === selectedContribution.id
            ? {
                ...c,
                goal: contributionFormData.goal,
                date: contributionFormData.date,
                amount: contributionFormData.amount,
                type: contributionFormData.type,
                notes: contributionFormData.notes,
              }
            : c,
        ),
      );
      showToast("Contribution updated successfully!", "success");
      setShowEditModal(false);
    } else {
      const newContribution: Contribution = {
        id: Date.now().toString(),
        goal: contributionFormData.goal,
        date: contributionFormData.date,
        amount: contributionFormData.amount,
        type: contributionFormData.type,
        notes: contributionFormData.notes,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setContributions((prev) => [newContribution, ...prev]);
      showToast("Contribution created successfully!", "success");
      setShowCreateModal(false);
    }
    resetContributionForm();
  };

  const handleDeleteContribution = () => {
    if (selectedContribution) {
      setContributions((prev) =>
        prev.filter((c) => c.id !== selectedContribution.id),
      );
      showToast("Contribution deleted successfully!", "success");
      setShowDeleteModal(false);
      setSelectedContribution(null);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Manual":
        return "bg-blue-100 text-blue-700";
      case "Automatic":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Manual":
        return <CreditCard className="w-3 h-3" />;
      case "Automatic":
        return <TrendingUp className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
  // MODALS
  // ═══════════════════════════════════════════════════════════════════════════

  const CreateEditModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Contribution" : "Create Contribution"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing
                ? "Update contribution information"
                : "Add a new contribution"}
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetContributionForm();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal <span className="text-red-500">*</span>
              </label>
              <select
                value={contributionFormData.goal}
                onChange={(e) =>
                  setContributionFormData({
                    ...contributionFormData,
                    goal: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select Goal</option>
                {goalsList.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={contributionFormData.date}
                  onChange={(e) =>
                    setContributionFormData({
                      ...contributionFormData,
                      date: e.target.value,
                    })
                  }
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={contributionFormData.amount || ""}
                  onChange={(e) =>
                    setContributionFormData({
                      ...contributionFormData,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={contributionFormData.type}
                onChange={(e) =>
                  setContributionFormData({
                    ...contributionFormData,
                    type: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                {contributionTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={contributionFormData.notes}
                onChange={(e) =>
                  setContributionFormData({
                    ...contributionFormData,
                    notes: e.target.value,
                  })
                }
                rows={3}
                placeholder="Enter notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetContributionForm();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveContribution}
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Contribution Details
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedContribution?.goal}
            </p>
          </div>
          <button
            onClick={() => setShowViewModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {selectedContribution && (
          <div className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Goal</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedContribution.goal}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm text-gray-600">
                    {selectedContribution.date}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="text-lg font-bold text-blue-600">
                    {fmtCurrency(selectedContribution.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(selectedContribution.type)}`}
                  >
                    {getTypeIcon(selectedContribution.type)}
                    {selectedContribution.type}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Notes</p>
                  <p className="text-sm text-gray-600">
                    {selectedContribution.notes || "-"}
                  </p>
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
              if (selectedContribution) openEditModal(selectedContribution);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Contribution
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
            Delete Contribution
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete this contribution of{" "}
            <span className="font-semibold">
              {selectedContribution
                ? fmtCurrency(selectedContribution.amount)
                : ""}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteContribution}
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
            onClick={() => navigate("/goal")}
            className="hover:text-gray-700"
          >
            Goal
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">Contributions</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Contributions
          </h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
            title="Create Contribution"
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
                placeholder="Search Contributions..."
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
                      Type
                    </span>
                  </div>
                  {["All", "Manual", "Automatic"].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTypeFilter(t);
                        setCurrentPage(1);
                        setShowFilters(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${typeFilter === t ? "text-blue-600 font-medium bg-blue-50" : "text-gray-700"}`}
                    >
                      {t}
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
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="goal" label="Goal" />
                <SortHeader field="date" label="Date" />
                <SortHeader field="amount" label="Amount" />
                <SortHeader field="type" label="Type" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Notes
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedContributions.map((contribution) => (
                <tr
                  key={contribution.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openViewModal(contribution)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {contribution.goal}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {contribution.date}
                  </td>
                  <td className="px-4 py-3 font-medium text-green-600">
                    {fmtCurrency(contribution.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(contribution.type)}`}
                    >
                      {getTypeIcon(contribution.type)}
                      {contribution.type}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 text-gray-500 max-w-xs truncate"
                    title={contribution.notes}
                  >
                    {contribution.notes}
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openViewModal(contribution)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(contribution)}
                        className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(contribution)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedContributions.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No contributions found.
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
            {filteredContributions.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredContributions.length)}{" "}
            of {filteredContributions.length} results
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
