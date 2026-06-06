/**
 * File: src/pages/form-builder/FormBuilder.tsx
 * Complete Form Builder Module:
 *   - ManageFormBuilder: list with search, pagination, view toggle, action icons
 *   - FormResponses: response list with view/delete, pagination
 *   - ViewResponseModal: overlay with all field values
 *   - ConvertTo: enable conversion toggle + module selector
 *   - EditForm: split layout with Form Configuration + Form Preview + field types
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Globe,
  Plus,
  Search,
  List,
  Grid3X3,
  ChevronUp,
  ChevronDown,
  Link,
  BarChart2,
  Zap,
  Pencil,
  Trash2,
  Eye,
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
  Type,
  Mail,
  Hash,
  Phone,
  LinkIcon,
  Lock,
  AlignLeft,
  ChevronDownSquare,
  Radio,
  CheckSquare,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type View = "list" | "responses" | "convert" | "edit";

interface FormItem {
  id: number;
  name: string;
  fields: number;
  responses: number;
  status: "Active" | "Inactive";
  createdAt: string;
}

interface ResponseItem {
  id: number;
  name: string;
  email: string;
  priority: string;
  category: string;
  submittedAt: string;
  subject: string;
  description: string;
}

type FieldType =
  | "Text Input"
  | "Email"
  | "Number"
  | "Phone"
  | "URL"
  | "Password"
  | "Textarea"
  | "Select Dropdown"
  | "Radio Buttons"
  | "Checkbox"
  | "Date"
  | "Time";

interface FieldOption {
  id: string;
  value: string;
}

interface FormField {
  id: number;
  type: FieldType;
  label: string;
  placeholder: string;
  required: boolean;
  options?: FieldOption[];
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleForms: FormItem[] = [
  {
    id: 1,
    name: "Technical Support Ticket",
    fields: 6,
    responses: 11,
    status: "Active",
    createdAt: "2026-02-12 00:15",
  },
  {
    id: 2,
    name: "Gym Membership Application",
    fields: 7,
    responses: 13,
    status: "Active",
    createdAt: "2026-02-08 23:28",
  },
  {
    id: 3,
    name: "Restaurant Reservation",
    fields: 7,
    responses: 10,
    status: "Active",
    createdAt: "2026-02-06 03:19",
  },
  {
    id: 4,
    name: "Volunteer Registration Form",
    fields: 6,
    responses: 9,
    status: "Active",
    createdAt: "2026-02-02 21:03",
  },
  {
    id: 5,
    name: "Medical Appointment Booking",
    fields: 7,
    responses: 15,
    status: "Active",
    createdAt: "2026-01-31 07:18",
  },
  {
    id: 6,
    name: "Online Course Enrollment",
    fields: 6,
    responses: 11,
    status: "Active",
    createdAt: "2026-01-28 02:07",
  },
  {
    id: 7,
    name: "Contact Us Form",
    fields: 5,
    responses: 12,
    status: "Active",
    createdAt: "2026-01-25 06:07",
  },
  {
    id: 8,
    name: "Newsletter Subscription",
    fields: 4,
    responses: 12,
    status: "Active",
    createdAt: "2026-01-21 22:53",
  },
  {
    id: 9,
    name: "Conference Registration 2024",
    fields: 5,
    responses: 14,
    status: "Active",
    createdAt: "2026-01-19 01:34",
  },
  {
    id: 10,
    name: "Job Application Form",
    fields: 6,
    responses: 13,
    status: "Active",
    createdAt: "2026-01-16 05:18",
  },
  {
    id: 11,
    name: "Event Feedback Survey",
    fields: 5,
    responses: 8,
    status: "Active",
    createdAt: "2026-01-10 10:45",
  },
];

const sampleResponses: ResponseItem[] = [
  {
    id: 1,
    name: "Adam West",
    email: "adam.w@user.com",
    priority: "High",
    category: "Technical Issue",
    submittedAt: "2026-02-18 18:03",
    subject: "Login not working",
    description: "Unable to login with correct credentials.",
  },
  {
    id: 2,
    name: "Kevin Spacey",
    email: "kevin.s@user.com",
    priority: "Low",
    category: "Feature Request",
    submittedAt: "2026-02-18 11:59",
    subject: "Dark mode request",
    description: "Would love to have a dark mode option.",
  },
  {
    id: 3,
    name: "Ian McKellen",
    email: "ian.m@user.com",
    priority: "Critical",
    category: "Technical Issue",
    submittedAt: "2026-02-17 23:39",
    subject: "App crash on startup",
    description: "Application crashes immediately after launching.",
  },
  {
    id: 4,
    name: "Julia Roberts",
    email: "julia.r@user.com",
    priority: "Medium",
    category: "Billing",
    submittedAt: "2026-02-17 17:13",
    subject: "Invoice discrepancy",
    description: "The invoice amount does not match the agreed price.",
  },
  {
    id: 5,
    name: "Gene Wilder",
    email: "gene.w@user.com",
    priority: "Low",
    category: "Feature Request",
    submittedAt: "2026-02-17 06:51",
    subject: "Export to PDF",
    description: "Please add PDF export functionality.",
  },
  {
    id: 6,
    name: "Morgan Freeman",
    email: "morgan.f@user.com",
    priority: "Medium",
    category: "Technical Issue",
    submittedAt: "2026-02-16 00:43",
    subject: "Email not sending",
    description: "Notification emails are not being received.",
  },
  {
    id: 7,
    name: "Betty White",
    email: "betty.w@user.com",
    priority: "Medium",
    category: "Billing",
    submittedAt: "2026-02-15 16:36",
    subject: "Double charge",
    description: "I was charged twice for the same subscription.",
  },
  {
    id: 8,
    name: "Diane Keaton",
    email: "diane.k@user.com",
    priority: "Critical",
    category: "Bug Report",
    submittedAt: "2026-02-14 20:35",
    subject: "Data not saving",
    description: "Changes made to records are not persisting.",
  },
  {
    id: 9,
    name: "Lucy Liu",
    email: "lucy.l@user.com",
    priority: "High",
    category: "Bug Report",
    submittedAt: "2026-02-13 19:52",
    subject: "Search broken",
    description: "The search functionality returns no results.",
  },
  {
    id: 10,
    name: "Carl Sagan",
    email: "carl.s@user.com",
    priority: "Low",
    category: "Feature Request",
    submittedAt: "2026-02-12 09:12",
    subject: "API access",
    description: "Requesting API access for third-party integration.",
  },
  {
    id: 11,
    name: "Meryl Streep",
    email: "meryl.s@user.com",
    priority: "High",
    category: "Technical Issue",
    submittedAt: "2026-02-11 14:20",
    subject: "File upload failing",
    description: "Cannot upload files larger than 1MB.",
  },
];

const initialFields: FormField[] = [
  {
    id: 1,
    type: "Text Input",
    label: "Your Name",
    placeholder: "Full name",
    required: true,
  },
  {
    id: 2,
    type: "Email",
    label: "Email",
    placeholder: "support@email.com",
    required: true,
  },
  {
    id: 3,
    type: "Radio Buttons",
    label: "Priority",
    placeholder: "",
    required: true,
    options: [
      { id: "o1", value: "Low" },
      { id: "o2", value: "Medium" },
      { id: "o3", value: "High" },
      { id: "o4", value: "Critical" },
    ],
  },
  {
    id: 4,
    type: "Select Dropdown",
    label: "Category",
    placeholder: "",
    required: true,
    options: [
      { id: "o5", value: "Technical Issue" },
      { id: "o6", value: "Billing" },
      { id: "o7", value: "Feature Request" },
      { id: "o8", value: "Bug Report" },
    ],
  },
  {
    id: 5,
    type: "Text Input",
    label: "Subject",
    placeholder: "Brief description",
    required: true,
  },
  {
    id: 6,
    type: "Textarea",
    label: "Description",
    placeholder: "Detailed description of the issue",
    required: true,
  },
];

const fieldTypeIcons: Record<FieldType, React.ReactNode> = {
  "Text Input": <Type className="w-4 h-4" />,
  Email: <Mail className="w-4 h-4" />,
  Number: <Hash className="w-4 h-4" />,
  Phone: <Phone className="w-4 h-4" />,
  URL: <LinkIcon className="w-4 h-4" />,
  Password: <Lock className="w-4 h-4" />,
  Textarea: <AlignLeft className="w-4 h-4" />,
  "Select Dropdown": <ChevronDownSquare className="w-4 h-4" />,
  "Radio Buttons": <Radio className="w-4 h-4" />,
  Checkbox: <CheckSquare className="w-4 h-4" />,
  Date: <Calendar className="w-4 h-4" />,
  Time: <Clock className="w-4 h-4" />,
};

const fieldTypeBgColors: Record<FieldType, string> = {
  "Text Input": "bg-teal-500",
  Email: "bg-green-500",
  Number: "bg-blue-500",
  Phone: "bg-purple-500",
  URL: "bg-indigo-500",
  Password: "bg-gray-500",
  Textarea: "bg-cyan-600",
  "Select Dropdown": "bg-orange-500",
  "Radio Buttons": "bg-pink-500",
  Checkbox: "bg-yellow-500",
  Date: "bg-red-500",
  Time: "bg-violet-500",
};

const allFieldTypes: FieldType[] = [
  "Text Input",
  "Email",
  "Number",
  "Phone",
  "URL",
  "Password",
  "Textarea",
  "Select Dropdown",
  "Radio Buttons",
  "Checkbox",
  "Date",
  "Time",
];

// ─── Shared Header ────────────────────────────────────────────────────────────

const AppHeader: React.FC<{
  breadcrumbs: { label: string; onClick?: () => void }[];
}> = ({ breadcrumbs }) => (
  <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
    <div className="flex items-center gap-2 text-sm text-gray-500">
      {breadcrumbs.map((crumb, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="text-gray-400">›</span>}
          {crumb.onClick ? (
            <button
              onClick={crumb.onClick}
              className="hover:text-gray-700 transition-colors"
            >
              {crumb.label}
            </button>
          ) : (
            <span className="text-gray-900 font-medium">{crumb.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
    <div className="flex items-center gap-1 text-sm text-gray-600 border border-gray-200 rounded-md px-2 py-1">
      <Globe className="w-4 h-4" />
      <span>en English</span>
    </div>
  </div>
);

// ─── Sort Icon ────────────────────────────────────────────────────────────────

const SortIcon: React.FC = () => (
  <span className="inline-flex flex-col ml-1 text-gray-400">
    <ChevronUp className="w-3 h-3 -mb-0.5" />
    <ChevronDown className="w-3 h-3" />
  </span>
);

// ─── Toggle Switch ────────────────────────────────────────────────────────────

const Toggle: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
}> = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-emerald-500" : "bg-gray-300"}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}
    />
  </button>
);

// ─── Pagination ───────────────────────────────────────────────────────────────

const Pagination: React.FC<{
  current: number;
  total: number;
  perPage: number;
  totalItems: number;
  onPage: (p: number) => void;
}> = ({ current, total, perPage, totalItems, onPage }) => {
  const start = (current - 1) * perPage + 1;
  const end = Math.min(current * perPage, totalItems);
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
      <span className="text-sm text-gray-500">
        Showing {start} to {end} of {totalItems} results
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(current - 1)}
          disabled={current === 1}
          className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`w-8 h-8 text-sm rounded ${p === current ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPage(current + 1)}
          disabled={current === total}
          className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ─── 1. Manage Form Builder ───────────────────────────────────────────────────

const ManageFormBuilder: React.FC<{
  onResponses: (form: FormItem) => void;
  onConvert: (form: FormItem) => void;
  onEdit: (form: FormItem) => void;
}> = ({ onResponses, onConvert, onEdit }) => {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [tooltipId, setTooltipId] = useState<number | null>(null);
  const [tooltipType, setTooltipType] = useState<string>("");

  const filtered = sampleForms.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex-1 bg-[#FAFBFC] flex flex-col overflow-hidden">
      <AppHeader
        breadcrumbs={[{ label: "Dashboard" }, { label: "Form Builder" }]}
      />

      {/* Page Title */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">
          Manage Form Builder
        </h1>
        <button className="w-9 h-9 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md flex items-center justify-center transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
              <Search className="w-4 h-4 text-gray-400 ml-3" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search forms..."
                className="px-3 py-2 text-sm outline-none w-52"
              />
            </div>
            <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-md transition-colors">
              Search
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border border-gray-200 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-emerald-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-emerald-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
            <select className="border border-gray-200 rounded-md px-3 py-2 text-sm bg-white text-gray-700 outline-none">
              <option>10 per page</option>
              <option>25 per page</option>
              <option>50 per page</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "Name",
                  "Fields",
                  "Responses",
                  "Status",
                  "Created At",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600"
                  >
                    {col !== "Actions" ? (
                      <span className="flex items-center gap-1 cursor-pointer select-none">
                        {col} <SortIcon />
                      </span>
                    ) : (
                      col
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map((form) => (
                <tr
                  key={form.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    {form.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{form.fields}</td>
                  <td className="px-4 py-3 text-gray-600">{form.responses}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                      {form.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{form.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 relative">
                      {/* Link */}
                      <div className="relative">
                        <button
                          onMouseEnter={() => {
                            setTooltipId(form.id);
                            setTooltipType("link");
                          }}
                          onMouseLeave={() => setTooltipId(null)}
                          className="text-blue-400 hover:text-blue-600 transition-colors"
                        >
                          <Link className="w-4 h-4" />
                        </button>
                        {tooltipId === form.id && tooltipType === "link" && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                            Copy Link
                          </div>
                        )}
                      </div>
                      {/* Responses */}
                      <div className="relative">
                        <button
                          onMouseEnter={() => {
                            setTooltipId(form.id);
                            setTooltipType("responses");
                          }}
                          onMouseLeave={() => setTooltipId(null)}
                          onClick={() => onResponses(form)}
                          className="text-blue-400 hover:text-blue-600 transition-colors"
                        >
                          <BarChart2 className="w-4 h-4" />
                        </button>
                        {tooltipId === form.id &&
                          tooltipType === "responses" && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                              Responses
                            </div>
                          )}
                      </div>
                      {/* Convert */}
                      <div className="relative">
                        <button
                          onMouseEnter={() => {
                            setTooltipId(form.id);
                            setTooltipType("convert");
                          }}
                          onMouseLeave={() => setTooltipId(null)}
                          onClick={() => onConvert(form)}
                          className="text-orange-400 hover:text-orange-600 transition-colors"
                        >
                          <Zap className="w-4 h-4" />
                        </button>
                        {tooltipId === form.id && tooltipType === "convert" && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                            Convert To
                          </div>
                        )}
                      </div>
                      {/* Edit */}
                      <div className="relative">
                        <button
                          onMouseEnter={() => {
                            setTooltipId(form.id);
                            setTooltipType("edit");
                          }}
                          onMouseLeave={() => setTooltipId(null)}
                          onClick={() => onEdit(form)}
                          className="text-blue-400 hover:text-blue-600 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {tooltipId === form.id && tooltipType === "edit" && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                            Edit
                          </div>
                        )}
                      </div>
                      {/* Delete */}
                      <div className="relative">
                        <button
                          onMouseEnter={() => {
                            setTooltipId(form.id);
                            setTooltipType("delete");
                          }}
                          onMouseLeave={() => setTooltipId(null)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {tooltipId === form.id && tooltipType === "delete" && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                            Delete
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            current={page}
            total={totalPages}
            perPage={perPage}
            totalItems={filtered.length}
            onPage={setPage}
          />
        </div>
      </div>
    </div>
  );
};

// ─── 2. Form Responses ────────────────────────────────────────────────────────

const FormResponses: React.FC<{
  form: FormItem;
  onBack: () => void;
}> = ({ form, onBack }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [selectedResponse, setSelectedResponse] = useState<ResponseItem | null>(
    null,
  );

  const filtered = sampleResponses.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex-1 bg-[#FAFBFC] flex flex-col overflow-hidden">
      <AppHeader
        breadcrumbs={[
          { label: "Dashboard" },
          { label: "Form Builder", onClick: onBack },
          { label: form.name },
        ]}
      />

      {/* Page title */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Form Responses</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button className="p-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50">
            <Link className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
              <Search className="w-4 h-4 text-gray-400 ml-3" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search responses..."
                className="px-3 py-2 text-sm outline-none w-52"
              />
            </div>
            <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-md transition-colors">
              Search
            </button>
          </div>
          <select className="border border-gray-200 rounded-md px-3 py-2 text-sm bg-white text-gray-700 outline-none">
            <option>10 per page</option>
            <option>25 per page</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "Your Name",
                  "Email",
                  "Priority",
                  "Category",
                  "Submitted At",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map((resp) => (
                <tr
                  key={resp.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-900">{resp.name}</td>
                  <td className="px-4 py-3 text-gray-600">{resp.email}</td>
                  <td
                    className={`px-4 py-3 ${resp.priority === "Critical" ? "text-red-500" : "text-gray-600"}`}
                  >
                    {resp.priority}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{resp.category}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {resp.submittedAt}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedResponse(resp)}
                        className="text-blue-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            current={page}
            total={totalPages}
            perPage={perPage}
            totalItems={filtered.length}
            onPage={setPage}
          />
        </div>
      </div>

      {/* View Response Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">
                {form.name}
              </h2>
              <button
                onClick={() => setSelectedResponse(null)}
                className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: "Submitted At", value: selectedResponse.submittedAt },
                { label: "Your Name", value: selectedResponse.name },
                { label: "Email", value: selectedResponse.email },
                { label: "Priority", value: selectedResponse.priority },
                { label: "Category", value: selectedResponse.category },
                { label: "Subject", value: selectedResponse.subject },
                { label: "Description", value: selectedResponse.description },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-sm font-medium text-gray-700 mb-0.5">
                    {item.label}
                  </div>
                  <div className="text-sm text-gray-900">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── 3. Convert To ────────────────────────────────────────────────────────────

const ConvertTo: React.FC<{ form: FormItem; onBack: () => void }> = ({
  form,
  onBack,
}) => {
  const [enabled, setEnabled] = useState(false);
  const [selectedModule, setSelectedModule] = useState("");

  return (
    <div className="flex-1 bg-[#FAFBFC] flex flex-col overflow-hidden">
      <AppHeader
        breadcrumbs={[
          { label: "Dashboard" },
          { label: "Form Builder", onClick: onBack },
          { label: "Convert To" },
        ]}
      />

      {/* Page Title */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">
          Convert To - {form.name}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button className="w-8 h-8 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Enable Conversion Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
            <div>
              <div className="text-sm font-medium text-gray-900">
                Enable Conversion
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                Automatically create CRM records from form submissions
              </div>
            </div>
            <Toggle checked={enabled} onChange={setEnabled} />
          </div>

          {/* Select Module */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Select Module
            </label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-80 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none bg-white text-gray-500"
            >
              <option value="">Choose a module</option>
              <option value="contacts">Contacts</option>
              <option value="leads">Leads</option>
              <option value="deals">Deals</option>
              <option value="accounts">Accounts</option>
            </select>
          </div>

          <div className="border-t border-gray-200 pt-4 flex justify-end">
            <button className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-md transition-colors">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── 4. Edit Form ─────────────────────────────────────────────────────────────

const EditForm: React.FC<{ form: FormItem; onBack: () => void }> = ({
  form,
  onBack,
}) => {
  const [formName, setFormName] = useState(form.name);
  const [enableForm, setEnableForm] = useState(true);
  const [defaultLayout, setDefaultLayout] = useState("Single Column");
  const [fields, setFields] = useState<FormField[]>(initialFields);

  const fieldTypeCounts = allFieldTypes.reduce<Record<string, number>>(
    (acc, type) => {
      acc[type] = fields.filter((f) => f.type === type).length;
      return acc;
    },
    {},
  );

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: Date.now(),
      type,
      label: "",
      placeholder: "",
      required: false,
      options: ["Select Dropdown", "Radio Buttons", "Checkbox"].includes(type)
        ? [{ id: `opt_${Date.now()}`, value: "Option 1" }]
        : undefined,
    };
    setFields((prev) => [...prev, newField]);
  };

  const removeField = (id: number) =>
    setFields((prev) => prev.filter((f) => f.id !== id));

  const moveField = (id: number, dir: "up" | "down") => {
    setFields((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (dir === "up" && idx === 0) return prev;
      if (dir === "down" && idx === prev.length - 1) return prev;
      const next = [...prev];
      const swap = dir === "up" ? idx - 1 : idx + 1;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  };

  const updateField = (id: number, key: keyof FormField, value: any) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: value } : f)),
    );
  };

  const addOption = (fieldId: number) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === fieldId
          ? {
              ...f,
              options: [
                ...(f.options || []),
                { id: `opt_${Date.now()}`, value: "" },
              ],
            }
          : f,
      ),
    );
  };

  const updateOption = (fieldId: number, optId: string, value: string) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === fieldId
          ? {
              ...f,
              options: f.options?.map((o) =>
                o.id === optId ? { ...o, value } : o,
              ),
            }
          : f,
      ),
    );
  };

  const removeOption = (fieldId: number, optId: string) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === fieldId
          ? { ...f, options: f.options?.filter((o) => o.id !== optId) }
          : f,
      ),
    );
  };

  const moveOption = (fieldId: number, optId: string, dir: "up" | "down") => {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id !== fieldId || !f.options) return f;
        const idx = f.options.findIndex((o) => o.id === optId);
        if (dir === "up" && idx === 0) return f;
        if (dir === "down" && idx === f.options.length - 1) return f;
        const opts = [...f.options];
        const swap = dir === "up" ? idx - 1 : idx + 1;
        [opts[idx], opts[swap]] = [opts[swap], opts[idx]];
        return { ...f, options: opts };
      }),
    );
  };

  return (
    <div className="flex-1 bg-[#FAFBFC] flex flex-col overflow-hidden">
      <AppHeader
        breadcrumbs={[
          { label: "Dashboard" },
          { label: "Form Builder", onClick: onBack },
          { label: "Edit" },
        ]}
      />

      {/* Page Title */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Edit Form</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="px-4 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-md transition-colors font-medium">
            Update
          </button>
        </div>
      </div>

      {/* Split Layout */}
      <div className="flex-1 overflow-hidden flex gap-0">
        {/* ── Left: Form Configuration ── */}
        <div className="w-[320px] flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto p-5 flex flex-col gap-5">
          {/* Form Configuration */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <Settings className="w-4 h-4 text-gray-500" /> Form Configuration
            </h2>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Form Name <span className="text-red-500">*</span>
              </label>
              <input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-medium text-gray-700">
                Enable Form
              </label>
              <Toggle checked={enableForm} onChange={setEnableForm} />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Default Layout
              </label>
              <select
                value={defaultLayout}
                onChange={(e) => setDefaultLayout(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-emerald-500 bg-white"
              >
                <option>Single Column</option>
                <option>Two Column</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Form Statistics
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 border border-blue-100 rounded-md p-2 text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {fields.length}
                  </div>
                  <div className="text-xs text-gray-500">Fields</div>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-md p-2 text-center">
                  <div className="text-lg font-bold text-emerald-600">
                    {fields.filter((f) => f.required).length}
                  </div>
                  <div className="text-xs text-gray-500">Required</div>
                </div>
              </div>
            </div>
          </div>

          {/* Available Field Types */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-gray-500" /> Available Field Types
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {allFieldTypes.map((type) => {
                const count = fieldTypeCounts[type] || 0;
                return (
                  <button
                    key={type}
                    onClick={() => addField(type)}
                    className="relative flex flex-col items-center gap-1 p-2 border border-gray-200 rounded-lg text-gray-600 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-center group"
                  >
                    {count > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                        {count}
                      </span>
                    )}
                    <span className="text-gray-500 group-hover:text-emerald-600">
                      {fieldTypeIcons[type]}
                    </span>
                    <span className="text-[10px] leading-tight">{type}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right: Form Preview ── */}
        <div className="flex-1 overflow-y-auto bg-[#FAFBFC] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-500" /> Form Preview
            </h2>
            <span className="text-xs text-gray-500">
              {fields.length} fields
            </span>
          </div>

          <div className="space-y-5">
            {fields.map((field, idx) => (
              <div
                key={field.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Field header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                  <div
                    className={`w-8 h-8 rounded-md flex items-center justify-center text-white ${fieldTypeBgColors[field.type]}`}
                  >
                    {fieldTypeIcons[field.type]}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-medium text-gray-700">
                      Field {idx + 1}
                    </span>
                    {field.required && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-semibold rounded">
                        Required
                      </span>
                    )}
                    <span className="text-xs text-gray-400">{field.type}</span>
                  </div>
                  {/* Move / Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveField(field.id, "up")}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveField(field.id, "down")}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeField(field.id)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Field body */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Field Label
                      </label>
                      <input
                        value={field.label}
                        onChange={(e) =>
                          updateField(field.id, "label", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Placeholder Text
                        </label>
                        <input
                          value={field.placeholder}
                          onChange={(e) =>
                            updateField(field.id, "placeholder", e.target.value)
                          }
                          placeholder="Enter placeholder text"
                          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="flex flex-col items-end gap-1 pt-5">
                        <label className="text-xs font-medium text-gray-600 whitespace-nowrap">
                          Required
                        </label>
                        <Toggle
                          checked={field.required}
                          onChange={(v) => updateField(field.id, "required", v)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Options for select/radio/checkbox */}
                  {field.options !== undefined && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-gray-600">
                          Field Options
                        </label>
                        <button
                          onClick={() => addOption(field.id)}
                          className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 border border-emerald-300 rounded px-2 py-0.5"
                        >
                          <Plus className="w-3 h-3" /> Add Option
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        {field.options.map((opt, oIdx) => (
                          <div key={opt.id} className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <button
                                onClick={() =>
                                  moveOption(field.id, opt.id, "up")
                                }
                                className="text-gray-300 hover:text-gray-500"
                              >
                                <ChevronUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() =>
                                  moveOption(field.id, opt.id, "down")
                                }
                                className="text-gray-300 hover:text-gray-500"
                              >
                                <ChevronDown className="w-3 h-3" />
                              </button>
                            </div>
                            <input
                              value={opt.value}
                              onChange={(e) =>
                                updateOption(field.id, opt.id, e.target.value)
                              }
                              className="flex-1 border border-gray-200 rounded px-3 py-1 text-sm outline-none focus:border-emerald-400"
                            />
                            <button
                              onClick={() => removeOption(field.id, opt.id)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {fields.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <AlignLeft className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">
                  Click a field type on the left to add fields
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Root Component ───────────────────────────────────────────────────────────

export const FormBuilder: React.FC = () => {
  const [view, setView] = useState<View>("list");
  const [selectedForm, setSelectedForm] = useState<FormItem | null>(null);

  if (view === "responses" && selectedForm) {
    return <FormResponses form={selectedForm} onBack={() => setView("list")} />;
  }
  if (view === "convert" && selectedForm) {
    return <ConvertTo form={selectedForm} onBack={() => setView("list")} />;
  }
  if (view === "edit" && selectedForm) {
    return <EditForm form={selectedForm} onBack={() => setView("list")} />;
  }

  return (
    <ManageFormBuilder
      onResponses={(form) => {
        setSelectedForm(form);
        setView("responses");
      }}
      onConvert={(form) => {
        setSelectedForm(form);
        setView("convert");
      }}
      onEdit={(form) => {
        setSelectedForm(form);
        setView("edit");
      }}
    />
  );
};

export default FormBuilder;
