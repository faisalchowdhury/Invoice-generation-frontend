/**
 * File: src/pages/hrm/Holidays.tsx
 * Complete Holidays Management page with list view, create/edit modal, and details modal
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
  CheckCircle,
} from "lucide-react";
import { useResourceData } from "@/hooks/useResourceData";
import {
  holidayHooks,
  holidayTypeHooks,
} from "@/services/hrm";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Holiday {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  holidayType: string;
  isPaid: boolean;
  isSyncGoogleCalendar: boolean;
  isSyncOutlookCalendar: boolean;
  description: string;
  createdAt: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleHolidays: Holiday[] = [
  {
    id: "1",
    name: "International Volunteer Day - Community Service",
    startDate: "2025-12-20",
    endDate: "2025-12-20",
    holidayType: "Regional Holiday",
    isPaid: true,
    isSyncGoogleCalendar: false,
    isSyncOutlookCalendar: false,
    description:
      "International recognition day celebrating volunteers and their contributions to communities through service and charitable activities.",
    createdAt: "2025-01-01",
  },
  {
    id: "2",
    name: "World AIDS Day - Health Awareness",
    startDate: "2025-12-15",
    endDate: "2025-12-16",
    holidayType: "International Holiday",
    isPaid: true,
    isSyncGoogleCalendar: false,
    isSyncOutlookCalendar: false,
    description:
      "Global health awareness day for HIV/AIDS prevention and support.",
    createdAt: "2025-01-01",
  },
  {
    id: "3",
    name: "International Human Rights Day - Justice",
    startDate: "2025-12-10",
    endDate: "2025-12-10",
    holidayType: "Traditional Holiday",
    isPaid: true,
    isSyncGoogleCalendar: false,
    isSyncOutlookCalendar: false,
    description: "Celebration of human rights and social justice worldwide.",
    createdAt: "2025-01-01",
  },
  {
    id: "4",
    name: "World Teachers Day - Education Honor",
    startDate: "2025-12-05",
    endDate: "2025-12-05",
    holidayType: "Festival Holiday",
    isPaid: false,
    isSyncGoogleCalendar: false,
    isSyncOutlookCalendar: false,
    description: "Honoring educators and their contributions to society.",
    createdAt: "2025-01-01",
  },
  {
    id: "5",
    name: "International Peace Day - Global Unity",
    startDate: "2025-11-30",
    endDate: "2025-11-30",
    holidayType: "Independence Holiday",
    isPaid: false,
    isSyncGoogleCalendar: false,
    isSyncOutlookCalendar: false,
    description: "Global day of ceasefire and non-violence.",
    createdAt: "2025-01-01",
  },
  {
    id: "6",
    name: "World Environment Day - Sustainability",
    startDate: "2025-11-25",
    endDate: "2025-11-28",
    holidayType: "Memorial Holiday",
    isPaid: true,
    isSyncGoogleCalendar: false,
    isSyncOutlookCalendar: false,
    description: "Environmental awareness and sustainability initiatives.",
    createdAt: "2025-01-01",
  },
  {
    id: "7",
    name: "International Workers Day - Labor Rights",
    startDate: "2025-11-20",
    endDate: "2025-11-20",
    holidayType: "Seasonal Holiday",
    isPaid: true,
    isSyncGoogleCalendar: false,
    isSyncOutlookCalendar: false,
    description: "Celebrating workers rights and labor movements.",
    createdAt: "2025-01-01",
  },
  {
    id: "8",
    name: "World Health Day - Wellness Focus",
    startDate: "2025-11-15",
    endDate: "2025-11-15",
    holidayType: "Cultural Holiday",
    isPaid: true,
    isSyncGoogleCalendar: false,
    isSyncOutlookCalendar: false,
    description: "Global health awareness and wellness promotion.",
    createdAt: "2025-01-01",
  },
  {
    id: "9",
    name: "Earth Day - Environmental Awareness",
    startDate: "2025-11-10",
    endDate: "2025-11-10",
    holidayType: "Local Holiday",
    isPaid: false,
    isSyncGoogleCalendar: false,
    isSyncOutlookCalendar: false,
    description: "Environmental protection and climate action awareness.",
    createdAt: "2025-01-01",
  },
];

const holidayTypes = [
  "Regional Holiday",
  "International Holiday",
  "Traditional Holiday",
  "Festival Holiday",
  "Independence Holiday",
  "Memorial Holiday",
  "Seasonal Holiday",
  "Cultural Holiday",
  "Local Holiday",
];

// ─── Seed (snake_case for API) ────────────────────────────────────────────────

const sampleHolidaysSeed = sampleHolidays.map((h) => ({
  id: h.id,
  name: h.name,
  start_date: h.startDate,
  end_date: h.endDate,
  holiday_type_id: h.holidayType,
  description: h.description,
  is_paid: h.isPaid,
}));

// ─── mapFromApi ───────────────────────────────────────────────────────────────

function mapFromApi(p: any): Holiday {
  const htField = p.holiday_type_id ?? p.holidayTypeId;
  return {
    id: String(p.id ?? p._id ?? ""),
    name: p.name ?? "",
    startDate: (p.start_date ?? p.startDate ?? "").slice(0, 10),
    endDate: (p.end_date ?? p.endDate ?? "").slice(0, 10),
    holidayType:
      typeof htField === "object"
        ? htField?.name ?? ""
        : String(htField ?? p.holidayType ?? ""),
    isPaid: Boolean(p.is_paid ?? p.isPaid ?? false),
    isSyncGoogleCalendar: Boolean(
      p.is_sync_google_calendar ?? p.isSyncGoogleCalendar ?? false,
    ),
    isSyncOutlookCalendar: Boolean(
      p.is_sync_outlook_calendar ?? p.isSyncOutlookCalendar ?? false,
    ),
    description: p.description ?? "",
    createdAt: (p.createdAt ?? p.created_at ?? "").slice(0, 10),
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

type SortField = "name" | "startDate" | "endDate" | "holidayType" | "isPaid";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const Holidays: React.FC = () => {
  const navigate = useNavigate();

  const { items: raw, create, update, remove } = useResourceData(
    holidayHooks,
    { seed: sampleHolidaysSeed as any, params: { page: 1, limit: 100 } },
  );
  const items = useMemo(() => raw.map(mapFromApi), [raw]);

  // Holiday type options from API
  const htQuery = holidayTypeHooks.useList({ page: 1, limit: 100 }, { retry: 0 });
  const htOptions = useMemo(
    () =>
      (htQuery.data ?? []).map((t: any) => ({
        id: String(t.id ?? t._id ?? ""),
        name: t.name ?? t.holiday_type ?? "",
      })),
    [htQuery.data],
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("startDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [paidFilter, setPaidFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [holidayFormData, setHolidayFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    holidayType: "",
    description: "",
    isPaid: true,
    isSyncGoogleCalendar: false,
    isSyncOutlookCalendar: false,
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

  const filteredHolidays = useMemo(() => {
    let result = [...items];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.holidayType.toLowerCase().includes(q),
      );
    }

    if (paidFilter !== "All") {
      result = result.filter((h) => h.isPaid === (paidFilter === "Paid"));
    }

    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "isPaid") {
        aVal = a.isPaid ? 1 : 0;
        bVal = b.isPaid ? 1 : 0;
      }

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [items, searchQuery, paidFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredHolidays.length / perPage);
  const paginatedHolidays = filteredHolidays.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // ─── Form Helpers ───────────────────────────────────────────────────────────

  const resetHolidayForm = () => {
    setHolidayFormData({
      name: "",
      startDate: "",
      endDate: "",
      holidayType: "",
      description: "",
      isPaid: true,
      isSyncGoogleCalendar: false,
      isSyncOutlookCalendar: false,
    });
  };

  const openCreateModal = () => {
    resetHolidayForm();
    setIsEditing(false);
    setShowCreateModal(true);
  };

  const openEditModal = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setHolidayFormData({
      name: holiday.name,
      startDate: holiday.startDate,
      endDate: holiday.endDate,
      holidayType: holiday.holidayType,
      description: holiday.description,
      isPaid: holiday.isPaid,
      isSyncGoogleCalendar: holiday.isSyncGoogleCalendar,
      isSyncOutlookCalendar: holiday.isSyncOutlookCalendar,
    });
    setIsEditing(true);
    setShowEditModal(true);
  };

  const openViewModal = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setShowViewModal(true);
  };

  const openDeleteModal = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setShowDeleteModal(true);
  };

  const handleSaveHoliday = async () => {
    if (!holidayFormData.name) {
      showToast("Please enter holiday name", "info");
      return;
    }
    if (!holidayFormData.startDate) {
      showToast("Please select start date", "info");
      return;
    }
    if (!holidayFormData.endDate) {
      showToast("Please select end date", "info");
      return;
    }
    if (!holidayFormData.holidayType) {
      showToast("Please select holiday type", "info");
      return;
    }
    if (holidayFormData.startDate > holidayFormData.endDate) {
      showToast("Start date cannot be after end date", "error");
      return;
    }

    const payload = {
      name: holidayFormData.name,
      start_date: holidayFormData.startDate,
      end_date: holidayFormData.endDate,
      holiday_type_id: holidayFormData.holidayType,
      description: holidayFormData.description,
      is_paid: holidayFormData.isPaid,
    };

    try {
      if (isEditing && selectedHoliday) {
        await update(selectedHoliday.id, payload);
        showToast("Holiday updated successfully!", "success");
        setShowEditModal(false);
      } else {
        await create(payload);
        showToast("Holiday created successfully!", "success");
        setShowCreateModal(false);
      }
      resetHolidayForm();
    } catch {
      showToast("Operation failed.", "error");
    }
  };

  const handleDeleteHoliday = async () => {
    if (selectedHoliday) {
      try {
        await remove(selectedHoliday.id);
        showToast("Holiday deleted successfully!", "success");
        setShowDeleteModal(false);
        setSelectedHoliday(null);
      } catch {
        showToast("Delete failed.", "error");
      }
    }
  };

  const getPaidStatusColor = (isPaid: boolean) => {
    return isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  };

  const getPaidStatusIcon = (isPaid: boolean) => {
    return isPaid ? (
      <CheckCircle className="w-3 h-3" />
    ) : (
      <X className="w-3 h-3" />
    );
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
              {isEditing ? "Edit Holiday" : "Create Holiday"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing ? "Update holiday information" : "Add a new holiday"}
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetHolidayForm();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg"
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
              value={holidayFormData.name}
              onChange={(e) =>
                setHolidayFormData({ ...holidayFormData, name: e.target.value })
              }
              placeholder="Enter Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={holidayFormData.startDate}
                onChange={(e) =>
                  setHolidayFormData({
                    ...holidayFormData,
                    startDate: e.target.value,
                  })
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
                value={holidayFormData.endDate}
                onChange={(e) =>
                  setHolidayFormData({
                    ...holidayFormData,
                    endDate: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Holiday Type *
            </label>
            <select
              value={holidayFormData.holidayType}
              onChange={(e) =>
                setHolidayFormData({
                  ...holidayFormData,
                  holidayType: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="">Select Holiday Type</option>
              {htOptions.length > 0
                ? htOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))
                : holidayTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={holidayFormData.description}
              onChange={(e) =>
                setHolidayFormData({
                  ...holidayFormData,
                  description: e.target.value,
                })
              }
              rows={3}
              placeholder="Enter Description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-y"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={holidayFormData.isPaid}
                onChange={(e) =>
                  setHolidayFormData({
                    ...holidayFormData,
                    isPaid: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Is Paid</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={holidayFormData.isSyncGoogleCalendar}
                onChange={(e) =>
                  setHolidayFormData({
                    ...holidayFormData,
                    isSyncGoogleCalendar: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                Is Sync Google Calendar
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={holidayFormData.isSyncOutlookCalendar}
                onChange={(e) =>
                  setHolidayFormData({
                    ...holidayFormData,
                    isSyncOutlookCalendar: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">
                Is Sync Outlook Calendar
              </span>
            </label>
          </div>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetHolidayForm();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveHoliday}
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
              Holiday Details
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedHoliday?.name}
            </p>
          </div>
          <button
            onClick={() => setShowViewModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        {selectedHoliday && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Start Date</p>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedHoliday.startDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">End Date</p>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedHoliday.endDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Holiday Type</p>
                <p className="text-sm text-gray-600">
                  {selectedHoliday.holidayType}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Paid</p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getPaidStatusColor(selectedHoliday.isPaid)}`}
                >
                  {getPaidStatusIcon(selectedHoliday.isPaid)}
                  {selectedHoliday.isPaid ? "Yes" : "No"}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Google Calendar Sync</p>
                <p className="text-sm text-gray-600">
                  {selectedHoliday.isSyncGoogleCalendar ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Outlook Calendar Sync</p>
                <p className="text-sm text-gray-600">
                  {selectedHoliday.isSyncOutlookCalendar ? "Yes" : "No"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm text-gray-600">
                  {selectedHoliday.description}
                </p>
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
              if (selectedHoliday) openEditModal(selectedHoliday);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Holiday
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
            Delete Holiday
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedHoliday?.name}</span>? This
            action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteHoliday}
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
          <span className="text-gray-900 font-medium">Holidays</span>
        </div>
      </div>
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Holidays
          </h2>
          <button
            onClick={openCreateModal}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by holiday name or type..."
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
                      Paid Status
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setPaidFilter("All");
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                  >
                    All
                  </button>
                  <button
                    onClick={() => {
                      setPaidFilter("Paid");
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                  >
                    Paid
                  </button>
                  <button
                    onClick={() => {
                      setPaidFilter("Unpaid");
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                  >
                    Unpaid
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="name" label="Name" />
                <SortHeader field="startDate" label="Start Date" />
                <SortHeader field="endDate" label="End Date" />
                <SortHeader field="holidayType" label="Holiday Type" />
                <SortHeader field="isPaid" label="Paid" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedHolidays.map((holiday) => (
                <tr
                  key={holiday.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openViewModal(holiday)}
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {holiday.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(holiday.startDate)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(holiday.endDate)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {holiday.holidayType}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getPaidStatusColor(holiday.isPaid)}`}
                    >
                      {getPaidStatusIcon(holiday.isPaid)}
                      {holiday.isPaid ? "Yes" : "No"}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openViewModal(holiday)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(holiday)}
                        className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(holiday)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedHolidays.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No holidays found.
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
            {filteredHolidays.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredHolidays.length)} of{" "}
            {filteredHolidays.length} results
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
      {(showCreateModal || showEditModal) && <CreateEditModal />}
      {showViewModal && <ViewModal />}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
};
