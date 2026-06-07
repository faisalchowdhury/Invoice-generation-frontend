/**
 * File: src/pages/crm/DealDetail.tsx
 * Deal Detail page – VERTICAL TABS (sidebar style) with: General, Tasks, Users, Products, Sources, Files, Calls, Clients, Activity
 * Full CRUD for tasks, calls, and management of linked items
 * Matches the screenshot and your existing design pattern
 */

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "../../utils/toast";
import {
  ArrowLeft,
  Globe,
  DollarSign,
  Phone,
  User,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  X,
  Calendar,
  Clock,
  Flag,
  Users,
  Package,
  Link as LinkIcon,
  FileText,
  PhoneCall,
  Activity,
  Save,
  Settings,
} from "lucide-react";

// Types
interface Task {
  id: string;
  name: string;
  date: string;
  time: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "Completed";
  assignee: string;
}

interface Call {
  id: string;
  subject: string;
  callType: string;
  duration: number;
  assignee: string;
  date: string;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface Product {
  id: string;
  name: string;
}

interface Source {
  id: string;
  name: string;
}

interface Client {
  id: string;
  name: string;
}

// Mock data for the deal (will be fetched by ID)
const mockDeal = {
  id: "1",
  name: "Marketing Analytics Platform",
  price: 42000,
  phone: "+74767921217",
  creator: "Company",
  pipeline: "Marketing",
  stage: "Nurturing",
  clients: ["Acme Corp"],
  notes:
    "Vendor evaluation process concluded with our solution selected as preferred choice. Reference customer calls completed successfully and due diligence phase finalized with positive outcome.",
  status: "Won",
};

const mockTasks: Task[] = [
  {
    id: "t1",
    name: "Follow up with client",
    date: "2026-02-15",
    time: "10:00",
    priority: "High",
    status: "Pending",
    assignee: "John Smith",
  },
  {
    id: "t2",
    name: "Send proposal",
    date: "2026-02-10",
    time: "14:30",
    priority: "Medium",
    status: "Completed",
    assignee: "Jane Doe",
  },
];

const mockCalls: Call[] = [
  {
    id: "c1",
    subject: "Initial intro",
    callType: "Phone",
    duration: 30,
    assignee: "John Smith",
    date: "2026-02-01",
  },
  {
    id: "c2",
    subject: "Demo session",
    callType: "Video",
    duration: 60,
    assignee: "Jane Doe",
    date: "2026-02-05",
  },
];

const mockUsers: User[] = [
  { id: "u1", name: "Anthony Walker", avatar: "" },
  { id: "u2", name: "John Smith", avatar: "" },
];

const mockProducts: Product[] = [
  { id: "p1", name: "IT Support Service" },
  { id: "p2", name: "Laptop" },
];

const mockSources: Source[] = [
  { id: "s1", name: "Website Contact Form" },
  { id: "s2", name: "Networking Events" },
];

const mockClients: Client[] = [{ id: "cl1", name: "Acme Corp" }];

export const DealDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("General");
  const [deal, setDeal] = useState(mockDeal);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [calls, setCalls] = useState<Call[]>(mockCalls);
  const [users] = useState<User[]>(mockUsers);
  const [products] = useState<Product[]>(mockProducts);
  const [sources] = useState<Source[]>(mockSources);
  const [clients, setClients] = useState<Client[]>(mockClients);

  // Modal states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingCall, setEditingCall] = useState<Call | null>(null);

  // Form states
  const [taskForm, setTaskForm] = useState({
    name: "",
    date: "",
    time: "",
    priority: "Medium" as Task["priority"],
    assignee: "",
  });
  const [callForm, setCallForm] = useState({
    subject: "",
    callType: "Phone",
    duration: 30,
    assignee: "",
    date: "",
  });
  const [newClientName, setNewClientName] = useState("");

  // Tab definitions for vertical navigation
  const tabs = [
    { id: "General", label: "General", icon: Settings },
    { id: "Tasks", label: "Tasks", icon: CheckCircle },
    { id: "Users", label: "Users", icon: Users },
    { id: "Products", label: "Products", icon: Package },
    { id: "Sources", label: "Sources", icon: LinkIcon },
    { id: "Files", label: "Files", icon: FileText },
    { id: "Calls", label: "Calls", icon: PhoneCall },
    { id: "Clients", label: "Clients", icon: User },
    { id: "Activity", label: "Activity", icon: Activity },
  ];

  // ─── Task CRUD ─────────────────────────────────────────────────────────────
  const openCreateTask = () => {
    setEditingTask(null);
    setTaskForm({
      name: "",
      date: "",
      time: "",
      priority: "Medium",
      assignee: "",
    });
    setShowTaskModal(true);
  };
  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      name: task.name,
      date: task.date,
      time: task.time,
      priority: task.priority,
      assignee: task.assignee,
    });
    setShowTaskModal(true);
  };
  const saveTask = () => {
    if (!taskForm.name) {
      showToast("Task name required", "info");
      return;
    }
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id ? { ...t, ...taskForm, status: t.status } : t,
        ),
      );
      showToast("Task updated", "success");
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        ...taskForm,
        status: "Pending",
      };
      setTasks((prev) => [newTask, ...prev]);
      showToast("Task created", "success");
    }
    setShowTaskModal(false);
  };
  const deleteTask = (id: string) => {
    if (confirm("Delete task?")) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast("Task deleted", "success");
    }
  };
  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Completed" ? "Pending" : "Completed" }
          : t,
      ),
    );
  };

  // ─── Call CRUD ─────────────────────────────────────────────────────────────
  const openCreateCall = () => {
    setEditingCall(null);
    setCallForm({
      subject: "",
      callType: "Phone",
      duration: 30,
      assignee: "",
      date: "",
    });
    setShowCallModal(true);
  };
  const openEditCall = (call: Call) => {
    setEditingCall(call);
    setCallForm({
      subject: call.subject,
      callType: call.callType,
      duration: call.duration,
      assignee: call.assignee,
      date: call.date,
    });
    setShowCallModal(true);
  };
  const saveCall = () => {
    if (!callForm.subject) {
      showToast("Subject required", "info");
      return;
    }
    if (editingCall) {
      setCalls((prev) =>
        prev.map((c) => (c.id === editingCall.id ? { ...c, ...callForm } : c)),
      );
      showToast("Call updated", "success");
    } else {
      const newCall: Call = { id: Date.now().toString(), ...callForm };
      setCalls((prev) => [newCall, ...prev]);
      showToast("Call created", "success");
    }
    setShowCallModal(false);
  };
  const deleteCall = (id: string) => {
    if (confirm("Delete call?")) {
      setCalls((prev) => prev.filter((c) => c.id !== id));
      showToast("Call deleted", "success");
    }
  };

  // ─── Client management ─────────────────────────────────────────────────────
  const addClient = () => {
    if (!newClientName) {
      showToast("Client name required", "info");
      return;
    }
    const newClient: Client = {
      id: Date.now().toString(),
      name: newClientName,
    };
    setClients((prev) => [...prev, newClient]);
    setNewClientName("");
    setShowClientModal(false);
    showToast("Client added", "success");
  };
  const removeClient = (id: string) => {
    if (confirm("Remove client?"))
      setClients((prev) => prev.filter((c) => c.id !== id));
  };

  // ─── Save Notes ────────────────────────────────────────────────────────────
  const saveNotes = () => {
    showToast("Notes saved", "success");
  };

  // ─── Tab content renderer (vertical layout) ────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "General":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">PRICE</span>
                <div className="font-medium">
                  ${deal.price.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-gray-500">PHONE</span>
                <div>{deal.phone}</div>
              </div>
              <div>
                <span className="text-gray-500">CREATOR</span>
                <div>{deal.creator}</div>
              </div>
              <div>
                <span className="text-gray-500">PIPELINE</span>
                <div>{deal.pipeline}</div>
              </div>
              <div>
                <span className="text-gray-500">STAGE</span>
                <div>{deal.stage}</div>
              </div>
              <div>
                <span className="text-gray-500">Clients</span>
                <div>{deal.clients.join(", ")}</div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                rows={6}
                defaultValue={deal.notes}
                className="w-full border rounded-md p-3"
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={saveNotes}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </div>
          </div>
        );
      case "Tasks":
        return (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={openCreateTask}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Create Task
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Time</th>
                    <th className="px-4 py-2 text-left">Priority</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t) => (
                    <tr key={t.id} className="border-b">
                      <td className="px-4 py-2">{t.name}</td>
                      <td className="px-4 py-2">{t.date}</td>
                      <td className="px-4 py-2">{t.time}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${t.priority === "High" ? "bg-red-100 text-red-700" : t.priority === "Medium" ? "bg-yellow-100" : "bg-green-100"}`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => toggleTaskStatus(t.id)}
                          className="flex items-center gap-1"
                        >
                          {t.status === "Completed" ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                          {t.status}
                        </button>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button onClick={() => openEditTask(t)}>
                            <Edit className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                          </button>
                          <button onClick={() => deleteTask(t.id)}>
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tasks.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        No tasks found.{" "}
                        <button
                          onClick={openCreateTask}
                          className="text-blue-600"
                        >
                          Create your first task
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "Users":
        return (
          <div className="space-y-2">
            {users.map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-2 border-b">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
                <span>{u.name}</span>
              </div>
            ))}
          </div>
        );
      case "Products":
        return (
          <div className="space-y-2">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex justify-between items-center p-2 border-b"
              >
                <span>{p.name}</span>
                <button className="text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        );
      case "Sources":
        return (
          <div className="space-y-2">
            {sources.map((s) => (
              <div
                key={s.id}
                className="flex justify-between items-center p-2 border-b"
              >
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        );
      case "Files":
        return (
          <div className="text-center text-gray-500 py-8">
            No files uploaded yet.
          </div>
        );
      case "Calls":
        return (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={openCreateCall}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Create Call
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Subject</th>
                    <th className="px-4 py-2">Call Type</th>
                    <th className="px-4 py-2">Duration</th>
                    <th className="px-4 py-2">Assignee</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {calls.map((c) => (
                    <tr key={c.id} className="border-b">
                      <td className="px-4 py-2">{c.subject}</td>
                      <td className="px-4 py-2">{c.callType}</td>
                      <td className="px-4 py-2">{c.duration} min</td>
                      <td className="px-4 py-2">{c.assignee}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button onClick={() => openEditCall(c)}>
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteCall(c.id)}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {calls.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-8 text-gray-500"
                      >
                        No calls found.{" "}
                        <button
                          onClick={openCreateCall}
                          className="text-blue-600"
                        >
                          Create your first call
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "Clients":
        return (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowClientModal(true)}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Clients
              </button>
            </div>
            <div className="space-y-2">
              {clients.map((c) => (
                <div
                  key={c.id}
                  className="flex justify-between items-center p-2 border-b"
                >
                  <span>{c.name}</span>
                  <button
                    onClick={() => removeClient(c.id)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case "Activity":
        return (
          <div className="text-center text-gray-500 py-8">
            No Activities found. Activities will appear here when actions are
            performed.
          </div>
        );
      default:
        return null;
    }
  };

  // ─── Modals ────────────────────────────────────────────────────────────────
  const TaskModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-4 border-b flex justify-between">
          <h3 className="font-semibold">
            {editingTask ? "Edit Task" : "Create Task"}
          </h3>
          <button onClick={() => setShowTaskModal(false)}>
            <X />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <input
            type="text"
            placeholder="Task name"
            value={taskForm.name}
            onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
            className="w-full border rounded p-2"
          />
          <input
            type="date"
            value={taskForm.date}
            onChange={(e) => setTaskForm({ ...taskForm, date: e.target.value })}
            className="w-full border rounded p-2"
          />
          <input
            type="time"
            value={taskForm.time}
            onChange={(e) => setTaskForm({ ...taskForm, time: e.target.value })}
            className="w-full border rounded p-2"
          />
          <select
            value={taskForm.priority}
            onChange={(e) =>
              setTaskForm({ ...taskForm, priority: e.target.value as any })
            }
            className="w-full border rounded p-2"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <input
            type="text"
            placeholder="Assignee"
            value={taskForm.assignee}
            onChange={(e) =>
              setTaskForm({ ...taskForm, assignee: e.target.value })
            }
            className="w-full border rounded p-2"
          />
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={() => setShowTaskModal(false)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={saveTask}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  const CallModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-4 border-b flex justify-between">
          <h3 className="font-semibold">
            {editingCall ? "Edit Call" : "Create Call"}
          </h3>
          <button onClick={() => setShowCallModal(false)}>
            <X />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <input
            type="text"
            placeholder="Subject"
            value={callForm.subject}
            onChange={(e) =>
              setCallForm({ ...callForm, subject: e.target.value })
            }
            className="w-full border rounded p-2"
          />
          <select
            value={callForm.callType}
            onChange={(e) =>
              setCallForm({ ...callForm, callType: e.target.value })
            }
            className="w-full border rounded p-2"
          >
            <option>Phone</option>
            <option>Video</option>
            <option>In-person</option>
          </select>
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={callForm.duration}
            onChange={(e) =>
              setCallForm({ ...callForm, duration: parseInt(e.target.value) })
            }
            className="w-full border rounded p-2"
          />
          <input
            type="text"
            placeholder="Assignee"
            value={callForm.assignee}
            onChange={(e) =>
              setCallForm({ ...callForm, assignee: e.target.value })
            }
            className="w-full border rounded p-2"
          />
          <input
            type="date"
            value={callForm.date}
            onChange={(e) => setCallForm({ ...callForm, date: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={() => setShowCallModal(false)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={saveCall}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  const ClientModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Add Client</h3>
        </div>
        <div className="p-4">
          <input
            type="text"
            placeholder="Client Name"
            value={newClientName}
            onChange={(e) => setNewClientName(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={() => setShowClientModal(false)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={addClient}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-hidden flex flex-col">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button
              onClick={() => navigate("/crm/deals")}
              className="hover:text-gray-700 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Deals
            </button>
            <span>›</span>
            <button
              onClick={() => navigate("/")}
              className="hover:text-gray-700"
            >
              Dashboard
            </button>
            <span>›</span>
            <button
              onClick={() => navigate("/crm")}
              className="hover:text-gray-700"
            >
              CRM
            </button>
            <span>›</span>
            <button
              onClick={() => navigate("/crm/deals")}
              className="hover:text-gray-700"
            >
              Deals
            </button>
            <span>›</span>
            <span className="text-gray-900 font-medium">{deal.name}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600 border border-gray-200 rounded-md px-2 py-1 bg-white">
            <Globe className="w-4 h-4" />
            <span>en English</span>
          </div>
        </div>
      </div>

      {/* Main Content with Vertical Tabs */}
      <div className="flex flex-1 overflow-hidden">
        {/* Vertical Tab Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Deal Details
            </h3>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {/* Header (Optional) */}
              <div className="p-6 border-b border-gray-200 bg-gray-50/40">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {deal.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          deal.status === "Won"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {deal.status === "Won" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : null}
                        {deal.status}
                      </span>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm flex items-center gap-1 hover:bg-gray-50">
                    <Edit className="w-4 h-4" /> Edit Deal
                  </button>
                </div>
              </div>

              {/* Active Tab Content */}
              <div className="p-6">{renderTabContent()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTaskModal && <TaskModal />}
      {showCallModal && <CallModal />}
      {showClientModal && <ClientModal />}
    </div>
  );
};

export default DealDetail;
