/**
 * File: src/pages/training/TrainingList.tsx
 * Manage Training List – full CRUD for trainings and tasks
 * Includes: training table, edit training modal, tasks sub‑page, create/edit task modal
 * Design matches EmployeeGoals and TrainingTypesSetup components
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
  Clock,
  MapPin,
  Users,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Globe,
  ArrowLeft,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Branch {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
  branchId: string;
}

interface TrainingType {
  id: string;
  name: string;
}

interface Trainer {
  id: string;
  name: string;
  specialization: string;
}

interface Training {
  id: string;
  title: string;
  trainingTypeId: string;
  trainingTypeName: string;
  trainerId: string;
  trainerName: string;
  branchId: string;
  branchName: string;
  departmentId: string;
  departmentName: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  maxParticipants: number;
  description: string;
  cost: number;
  status: "Scheduled" | "Completed" | "Cancelled" | "Ongoing";
  createdAt: string;
}

interface Task {
  id: string;
  trainingId: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  status: "Pending" | "In Progress" | "Completed";
  description: string;
  createdAt: string;
}

// ─── Sample Data (matches screenshots) ───────────────────────────────────────

const branches: Branch[] = [
  { id: "1", name: "Main Office" },
  { id: "2", name: "Downtown Branch" },
  { id: "3", name: "North Branch" },
  { id: "4", name: "South Branch" },
  { id: "5", name: "East Branch" },
  { id: "6", name: "West Branch" },
];

const departments: Department[] = [
  { id: "1", name: "Operations", branchId: "5" },
  { id: "2", name: "Finance & Accounting", branchId: "4" },
  { id: "3", name: "Administration", branchId: "3" },
  { id: "4", name: "Legal & Compliance", branchId: "2" },
  { id: "5", name: "Sales & Marketing", branchId: "1" },
  { id: "6", name: "Customer Service", branchId: "5" },
  { id: "7", name: "IT", branchId: "3" },
  { id: "8", name: "HR", branchId: "1" },
];

const trainingTypes: TrainingType[] = [
  { id: "1", name: "Artificial Intelligence & Machine Learning" },
  { id: "2", name: "Risk Management & Assessment" },
  { id: "3", name: "International Business & Trade" },
  { id: "4", name: "Environmental Sustainability" },
  { id: "5", name: "Negotiation & Conflict Resolution" },
  { id: "6", name: "Time Management & Productivity" },
  { id: "7", name: "E-commerce & Online Business" },
  { id: "8", name: "Mobile App Development" },
  { id: "9", name: "Business Intelligence & Reporting" },
];

const trainers: Trainer[] = [
  {
    id: "1",
    name: "Dr. Andrew Carter",
    specialization: "AI & Machine Learning",
  },
  { id: "2", name: "Michelle Nelson", specialization: "Risk Management" },
  { id: "3", name: "Steven Green", specialization: "International Trade" },
  { id: "4", name: "Kimberly Baker", specialization: "Sustainability" },
  { id: "5", name: "Jonathan Adams", specialization: "Negotiation" },
  { id: "6", name: "Megan Scott", specialization: "Productivity" },
  { id: "7", name: "Gregory King", specialization: "E-commerce" },
  { id: "8", name: "Samantha Young", specialization: "Mobile Development" },
  { id: "9", name: "Brian Allen", specialization: "Business Intelligence" },
];

const sampleTrainings: Training[] = [
  {
    id: "1",
    title: "Artificial Intelligence and Machine Learning Applications",
    trainingTypeId: "1",
    trainingTypeName: "Artificial Intelligence & Machine Learning",
    trainerId: "1",
    trainerName: "Dr. Andrew Carter",
    branchId: "5",
    branchName: "East Branch",
    departmentId: "1",
    departmentName: "Operations",
    startDate: "2026-02-05",
    endDate: "2026-02-08",
    startTime: "10:00",
    endTime: "18:00",
    location: "AI and ML Research Center",
    maxParticipants: 15,
    description:
      "AI fundamentals and machine learning training covering practical implementation strategies, intelligent automation solutions, and AI integration for modern business applications and competitive advantage.",
    cost: 200,
    status: "Scheduled",
    createdAt: "2025-12-01",
  },
  {
    id: "2",
    title: "Risk Management and Business Continuity",
    trainingTypeId: "2",
    trainingTypeName: "Risk Management & Assessment",
    trainerId: "2",
    trainerName: "Michelle Nelson",
    branchId: "4",
    branchName: "South Branch",
    departmentId: "2",
    departmentName: "Finance & Accounting",
    startDate: "2026-01-30",
    endDate: "2026-02-01",
    startTime: "09:00",
    endTime: "17:00",
    location: "Risk Management Institute",
    maxParticipants: 20,
    description:
      "Comprehensive risk assessment and business continuity planning.",
    cost: 250,
    status: "Completed",
    createdAt: "2025-11-15",
  },
  {
    id: "3",
    title: "International Business and Global Trade",
    trainingTypeId: "3",
    trainingTypeName: "International Business & Trade",
    trainerId: "3",
    trainerName: "Steven Green",
    branchId: "3",
    branchName: "North Branch",
    departmentId: "3",
    departmentName: "Administration",
    startDate: "2026-01-24",
    endDate: "2026-01-26",
    startTime: "10:00",
    endTime: "16:00",
    location: "International Business Center",
    maxParticipants: 12,
    description:
      "Global trade regulations, cross‑cultural management, and export strategies.",
    cost: 300,
    status: "Scheduled",
    createdAt: "2025-12-10",
  },
  {
    id: "4",
    title: "Environmental Sustainability and Green Practices",
    trainingTypeId: "4",
    trainingTypeName: "Environmental Sustainability",
    trainerId: "4",
    trainerName: "Kimberly Baker",
    branchId: "2",
    branchName: "Downtown Branch",
    departmentId: "4",
    departmentName: "Legal & Compliance",
    startDate: "2026-01-18",
    endDate: "2026-01-23",
    startTime: "09:30",
    endTime: "17:30",
    location: "Sustainability Training Center",
    maxParticipants: 18,
    description:
      "Sustainable business practices, environmental compliance, and CSR.",
    cost: 220,
    status: "Cancelled",
    createdAt: "2025-11-20",
  },
  {
    id: "5",
    title: "Advanced Negotiation and Conflict Resolution",
    trainingTypeId: "5",
    trainingTypeName: "Negotiation & Conflict Resolution",
    trainerId: "5",
    trainerName: "Jonathan Adams",
    branchId: "1",
    branchName: "Main Office",
    departmentId: "5",
    departmentName: "Sales & Marketing",
    startDate: "2026-01-12",
    endDate: "2026-01-13",
    startTime: "10:00",
    endTime: "18:00",
    location: "Negotiation Skills Center",
    maxParticipants: 10,
    description:
      "Professional negotiation techniques, conflict resolution frameworks, and mediation skills.",
    cost: 180,
    status: "Completed",
    createdAt: "2025-11-05",
  },
  {
    id: "6",
    title: "Time Management and Personal Productivity",
    trainingTypeId: "6",
    trainingTypeName: "Time Management & Productivity",
    trainerId: "6",
    trainerName: "Megan Scott",
    branchId: "5",
    branchName: "East Branch",
    departmentId: "6",
    departmentName: "Customer Service",
    startDate: "2026-01-06",
    endDate: "2026-01-09",
    startTime: "09:00",
    endTime: "13:00",
    location: "Productivity Training Room",
    maxParticipants: 25,
    description:
      "Personal productivity techniques, time management tools, and workflow optimization.",
    cost: 150,
    status: "Scheduled",
    createdAt: "2025-12-05",
  },
  {
    id: "7",
    title: "E-commerce and Digital Business Strategy",
    trainingTypeId: "7",
    trainingTypeName: "E-commerce & Online Business",
    trainerId: "7",
    trainerName: "Gregory King",
    branchId: "4",
    branchName: "South Branch",
    departmentId: "2",
    departmentName: "Finance & Accounting",
    startDate: "2025-12-31",
    endDate: "2026-01-01",
    startTime: "10:00",
    endTime: "18:00",
    location: "E-commerce Training Center",
    maxParticipants: 15,
    description:
      "E‑commerce platform management, online marketing strategies, and digital payment systems.",
    cost: 280,
    status: "Ongoing",
    createdAt: "2025-11-25",
  },
  {
    id: "8",
    title: "Mobile Application Development Bootcamp",
    trainingTypeId: "8",
    trainingTypeName: "Mobile App Development",
    trainerId: "8",
    trainerName: "Samantha Young",
    branchId: "3",
    branchName: "North Branch",
    departmentId: "7",
    departmentName: "IT",
    startDate: "2025-12-25",
    endDate: "2025-12-27",
    startTime: "09:00",
    endTime: "17:00",
    location: "Mobile Development Studio",
    maxParticipants: 12,
    description:
      "iOS and Android development, UI/UX principles, and app deployment.",
    cost: 350,
    status: "Scheduled",
    createdAt: "2025-11-18",
  },
  {
    id: "9",
    title: "Business Intelligence and Reporting Systems",
    trainingTypeId: "9",
    trainingTypeName: "Business Intelligence & Reporting",
    trainerId: "9",
    trainerName: "Brian Allen",
    branchId: "2",
    branchName: "Downtown Branch",
    departmentId: "4",
    departmentName: "Legal & Compliance",
    startDate: "2025-12-19",
    endDate: "2025-12-24",
    startTime: "10:00",
    endTime: "16:00",
    location: "Business Intelligence Lab",
    maxParticipants: 20,
    description: "BI tools, data visualization, and reporting best practices.",
    cost: 240,
    status: "Scheduled",
    createdAt: "2025-11-10",
  },
];

// Generate extra trainings to reach 30 (pagination demo)
for (let i = 10; i <= 30; i++) {
  const type = trainingTypes[i % trainingTypes.length];
  const trainer = trainers[i % trainers.length];
  const branch = branches[i % branches.length];
  const dept =
    departments.find((d) => d.branchId === branch.id) || departments[0];
  sampleTrainings.push({
    id: i.toString(),
    title: `${type.name} Training ${i}`,
    trainingTypeId: type.id,
    trainingTypeName: type.name,
    trainerId: trainer.id,
    trainerName: trainer.name,
    branchId: branch.id,
    branchName: branch.name,
    departmentId: dept.id,
    departmentName: dept.name,
    startDate: `2026-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    endDate: `2026-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 3).padStart(2, "0")}`,
    startTime: "09:00",
    endTime: "17:00",
    location: `${branch.name} Training Center`,
    maxParticipants: 15 + (i % 10),
    description: `Comprehensive training on ${type.name.toLowerCase()}.`,
    cost: 150 + i * 5,
    status:
      i % 4 === 0
        ? "Completed"
        : i % 5 === 0
          ? "Cancelled"
          : i % 3 === 0
            ? "Ongoing"
            : "Scheduled",
    createdAt: "2025-10-01",
  });
}

const sampleTasks: Task[] = [
  {
    id: "1",
    trainingId: "1",
    title: "Group Discussion Participation",
    assignedTo: "John Smith",
    dueDate: "2026-02-08",
    status: "Pending",
    description: "Participate in group discussion on AI ethics.",
    createdAt: "2026-01-01",
  },
  {
    id: "2",
    trainingId: "1",
    title: "Complete Module 1 Exercises",
    assignedTo: "John Smith",
    dueDate: "2026-02-07",
    status: "Pending",
    description: "Complete all exercises in Module 1.",
    createdAt: "2026-01-01",
  },
  {
    id: "3",
    trainingId: "1",
    title: "Attend Opening Session",
    assignedTo: "John Smith",
    dueDate: "2026-02-05",
    status: "Completed",
    description: "Attend the opening session of the training.",
    createdAt: "2026-01-01",
  },
  {
    id: "4",
    trainingId: "1",
    title: "Review Training Materials",
    assignedTo: "John Smith",
    dueDate: "2026-01-31",
    status: "Completed",
    description: "Review all pre‑training materials.",
    createdAt: "2026-01-01",
  },
  {
    id: "5",
    trainingId: "1",
    title: "Pre-Training Assessment",
    assignedTo: "John Smith",
    dueDate: "2026-01-29",
    status: "Completed",
    description: "Complete the pre‑training assessment.",
    createdAt: "2026-01-01",
  },
];

type SortField =
  | "title"
  | "trainingTypeName"
  | "trainerName"
  | "startDate"
  | "endDate"
  | "status"
  | "branchName"
  | "location";
type SortDir = "asc" | "desc";

// ─── Main Component ──────────────────────────────────────────────────────────

export const TrainingList: React.FC = () => {
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState<Training[]>(sampleTrainings);
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("startDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  // View states
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(
    null,
  );
  const [showTasksView, setShowTasksView] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Form states
  const [editFormData, setEditFormData] = useState({
    title: "",
    trainingTypeId: "",
    trainerId: "",
    branchId: "",
    departmentId: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
    maxParticipants: 0,
    description: "",
    cost: 0,
    status: "Scheduled" as Training["status"],
  });

  const [taskFormData, setTaskFormData] = useState({
    title: "",
    assignedTo: "",
    dueDate: "",
    status: "Pending" as Task["status"],
    description: "",
  });

  // ─── Sorting & Filtering ───────────────────────────────────────────────────

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const filteredTrainings = useMemo(() => {
    let result = [...trainings];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.trainingTypeName.toLowerCase().includes(q) ||
          t.trainerName.toLowerCase().includes(q) ||
          t.branchName.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "All") {
      result = result.filter((t) => t.status === statusFilter);
    }
    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [trainings, searchQuery, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredTrainings.length / perPage);
  const paginatedTrainings = filteredTrainings.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  // Training tasks
  const trainingTasks = tasks.filter(
    (t) => t.trainingId === selectedTraining?.id,
  );

  // ─── Training CRUD ─────────────────────────────────────────────────────────

  const openEditModal = (training: Training) => {
    setSelectedTraining(training);
    setEditFormData({
      title: training.title,
      trainingTypeId: training.trainingTypeId,
      trainerId: training.trainerId,
      branchId: training.branchId,
      departmentId: training.departmentId,
      startDate: training.startDate,
      endDate: training.endDate,
      startTime: training.startTime,
      endTime: training.endTime,
      location: training.location,
      maxParticipants: training.maxParticipants,
      description: training.description,
      cost: training.cost,
      status: training.status,
    });
    setShowEditModal(true);
  };

  const handleUpdateTraining = () => {
    if (!selectedTraining) return;
    const selectedType = trainingTypes.find(
      (t) => t.id === editFormData.trainingTypeId,
    );
    const selectedTrainer = trainers.find(
      (t) => t.id === editFormData.trainerId,
    );
    const selectedBranch = branches.find((b) => b.id === editFormData.branchId);
    const selectedDept = departments.find(
      (d) => d.id === editFormData.departmentId,
    );

    setTrainings((prev) =>
      prev.map((t) =>
        t.id === selectedTraining.id
          ? {
              ...t,
              title: editFormData.title,
              trainingTypeId: editFormData.trainingTypeId,
              trainingTypeName: selectedType?.name || "",
              trainerId: editFormData.trainerId,
              trainerName: selectedTrainer?.name || "",
              branchId: editFormData.branchId,
              branchName: selectedBranch?.name || "",
              departmentId: editFormData.departmentId,
              departmentName: selectedDept?.name || "",
              startDate: editFormData.startDate,
              endDate: editFormData.endDate,
              startTime: editFormData.startTime,
              endTime: editFormData.endTime,
              location: editFormData.location,
              maxParticipants: editFormData.maxParticipants,
              description: editFormData.description,
              cost: editFormData.cost,
              status: editFormData.status,
            }
          : t,
      ),
    );
    showToast("Training updated successfully!", "success");
    setShowEditModal(false);
  };

  // ─── Task CRUD ─────────────────────────────────────────────────────────────

  const openCreateTaskModal = () => {
    setTaskFormData({
      title: "",
      assignedTo: "",
      dueDate: "",
      status: "Pending",
      description: "",
    });
    setShowCreateTaskModal(true);
  };

  const openEditTaskModal = (task: Task) => {
    setSelectedTask(task);
    setTaskFormData({
      title: task.title,
      assignedTo: task.assignedTo,
      dueDate: task.dueDate,
      status: task.status,
      description: task.description,
    });
    setShowEditTaskModal(true);
  };

  const handleSaveTask = () => {
    if (!taskFormData.title.trim()) {
      showToast("Please enter task title", "info");
      return;
    }
    if (!taskFormData.dueDate) {
      showToast("Please select due date", "info");
      return;
    }
    if (!taskFormData.assignedTo) {
      showToast("Please select assignee", "info");
      return;
    }

    if (selectedTask) {
      // Edit existing task
      setTasks((prev) =>
        prev.map((t) =>
          t.id === selectedTask.id
            ? {
                ...t,
                title: taskFormData.title,
                assignedTo: taskFormData.assignedTo,
                dueDate: taskFormData.dueDate,
                status: taskFormData.status,
                description: taskFormData.description,
              }
            : t,
        ),
      );
      showToast("Task updated successfully!", "success");
      setShowEditTaskModal(false);
      setSelectedTask(null);
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        trainingId: selectedTraining!.id,
        title: taskFormData.title,
        assignedTo: taskFormData.assignedTo,
        dueDate: taskFormData.dueDate,
        status: taskFormData.status,
        description: taskFormData.description,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setTasks((prev) => [...prev, newTask]);
      showToast("Task created successfully!", "success");
      setShowCreateTaskModal(false);
    }
    setTaskFormData({
      title: "",
      assignedTo: "",
      dueDate: "",
      status: "Pending",
      description: "",
    });
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      setTasks((prev) => prev.filter((t) => t.id !== selectedTask.id));
      showToast("Task deleted successfully!", "success");
      setShowDeleteTaskModal(false);
      setSelectedTask(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Ongoing":
        return "bg-yellow-100 text-yellow-700";
      case "Pending":
        return "bg-orange-100 text-orange-700";
      case "In Progress":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-3 h-3" />;
      case "Scheduled":
        return <Calendar className="w-3 h-3" />;
      case "Cancelled":
        return <XCircle className="w-3 h-3" />;
      case "Ongoing":
        return <AlertCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  // Sort header component
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

  const EditTrainingModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Training List
            </h2>
            <p className="text-sm text-gray-500">Update training details</p>
          </div>
          <button
            onClick={() => setShowEditModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={editFormData.title}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Training Type *
              </label>
              <select
                value={editFormData.trainingTypeId}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    trainingTypeId: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                {trainingTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trainer *
              </label>
              <select
                value={editFormData.trainerId}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    trainerId: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch *
              </label>
              <select
                value={editFormData.branchId}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    branchId: e.target.value,
                    departmentId: "",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                value={editFormData.departmentId}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    departmentId: e.target.value,
                  })
                }
                disabled={!editFormData.branchId}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-100"
              >
                <option value="">
                  {editFormData.branchId
                    ? "Select department"
                    : "Select branch first"}
                </option>
                {departments
                  .filter((d) => d.branchId === editFormData.branchId)
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={editFormData.startDate}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    startDate: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <input
                type="date"
                value={editFormData.endDate}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, endDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={editFormData.startTime}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    startTime: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={editFormData.endTime}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, endTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={editFormData.location}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, location: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Participants
              </label>
              <input
                type="number"
                value={editFormData.maxParticipants}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    maxParticipants: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={editFormData.cost}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    cost: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={editFormData.status}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    status: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Ongoing">Ongoing</option>
              </select>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateTraining}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );

  const CreateTaskModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Create Task</h2>
          <button
            onClick={() => setShowCreateTaskModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={taskFormData.title}
              onChange={(e) =>
                setTaskFormData({ ...taskFormData, title: e.target.value })
              }
              placeholder="Enter task title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date *
            </label>
            <input
              type="date"
              value={taskFormData.dueDate}
              onChange={(e) =>
                setTaskFormData({ ...taskFormData, dueDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign To *
            </label>
            <input
              type="text"
              value={taskFormData.assignedTo}
              onChange={(e) =>
                setTaskFormData({ ...taskFormData, assignedTo: e.target.value })
              }
              placeholder="Enter assignee name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={taskFormData.status}
              onChange={(e) =>
                setTaskFormData({
                  ...taskFormData,
                  status: e.target.value as any,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={taskFormData.description}
              onChange={(e) =>
                setTaskFormData({
                  ...taskFormData,
                  description: e.target.value,
                })
              }
              placeholder="Enter task description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => setShowCreateTaskModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveTask}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );

  const EditTaskModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Edit Task</h2>
          <button
            onClick={() => setShowEditTaskModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={taskFormData.title}
              onChange={(e) =>
                setTaskFormData({ ...taskFormData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date *
            </label>
            <input
              type="date"
              value={taskFormData.dueDate}
              onChange={(e) =>
                setTaskFormData({ ...taskFormData, dueDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign To *
            </label>
            <input
              type="text"
              value={taskFormData.assignedTo}
              onChange={(e) =>
                setTaskFormData({ ...taskFormData, assignedTo: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={taskFormData.status}
              onChange={(e) =>
                setTaskFormData({
                  ...taskFormData,
                  status: e.target.value as any,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={taskFormData.description}
              onChange={(e) =>
                setTaskFormData({
                  ...taskFormData,
                  description: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => setShowEditTaskModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveTask}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );

  const DeleteTaskModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Task
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedTask?.title}</span>? This
            action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteTask}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteTaskModal(false)}
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
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  if (showTasksView && selectedTraining) {
    return (
      <div className="flex-1 bg-[#FAFBFC] overflow-hidden flex flex-col">
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <button
                onClick={() => navigate("/dashboard")}
                className="hover:text-gray-700"
              >
                Dashboard
              </button>
              <span>›</span>
              <button
                onClick={() => navigate("/training")}
                className="hover:text-gray-700"
              >
                Training
              </button>
              <span>›</span>
              <button
                onClick={() => setShowTasksView(false)}
                className="hover:text-gray-700"
              >
                Training List
              </button>
              <span>›</span>
              <span className="text-gray-900 font-medium">
                {selectedTraining.title} - Tasks
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600 border border-gray-200 rounded-md px-2 py-1 bg-white">
              <Globe className="w-4 h-4" />
              <span>GB English</span>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {selectedTraining.title} - Tasks
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage tasks for this training
                </p>
              </div>
              <button
                onClick={() => setShowTasksView(false)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50/40">
                <h2 className="font-semibold text-gray-900">Tasks</h2>
                <button
                  onClick={openCreateTaskModal}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" /> Create Task
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                        Assigned To
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                        Due Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {trainingTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {task.title}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {task.assignedTo}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {task.dueDate}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                          >
                            {getStatusIcon(task.status)}
                            {task.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditTaskModal(task)}
                              className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTask(task);
                                setShowDeleteTaskModal(true);
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {trainingTasks.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-12 text-center text-gray-500"
                        >
                          No tasks found. Click "Create Task" to add one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {showCreateTaskModal && <CreateTaskModal />}
        {showEditTaskModal && <EditTaskModal />}
        {showDeleteTaskModal && <DeleteTaskModal />}
      </div>
    );
  }

  // Main training list view
  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-hidden flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button
              onClick={() => navigate("/dashboard")}
              className="hover:text-gray-700"
            >
              Dashboard
            </button>
            <span>›</span>
            <button
              onClick={() => navigate("/training")}
              className="hover:text-gray-700"
            >
              Training
            </button>
            <span>›</span>
            <span className="text-gray-900 font-medium">Training List</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600 border border-gray-200 rounded-md px-2 py-1 bg-white">
            <Globe className="w-4 h-4" />
            <span>GB English</span>
          </div>
        </div>
      </div>
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Training List
          </h2>
          <button
            onClick={() =>
              showToast("Add training feature coming soon", "info")
            }
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
                placeholder="Search trainings..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-80 pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={() => showToast("Search applied", "info")}
              className="px-4 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
            >
              Search
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
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
                <span>Filters</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {showFilters && (
                <div className="absolute right-0 top-10 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-3 pb-1.5 mb-1 border-b border-gray-100">
                    Status
                  </div>
                  <button
                    onClick={() => {
                      setStatusFilter("All");
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                  >
                    All
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("Scheduled");
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                  >
                    Scheduled
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("Completed");
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("Cancelled");
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                  >
                    Cancelled
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("Ongoing");
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                  >
                    Ongoing
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1200px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <SortHeader field="title" label="Title" />
                <SortHeader field="trainingTypeName" label="Training Type" />
                <SortHeader field="trainerName" label="Trainer" />
                <SortHeader field="startDate" label="Start Date" />
                <SortHeader field="endDate" label="End Date" />
                <SortHeader field="status" label="Status" />
                <SortHeader field="branchName" label="Branch" />
                <SortHeader field="location" label="Location" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedTrainings.map((training) => (
                <tr
                  key={training.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedTraining(training);
                    setShowTasksView(true);
                  }}
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {training.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {training.trainingTypeName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {training.trainerName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {training.startDate}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {training.endDate}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(training.status)}`}
                    >
                      {getStatusIcon(training.status)}
                      {training.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {training.branchName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {training.location}
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(training)}
                        className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedTrainings.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No trainings found.
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
            {filteredTrainings.length === 0
              ? 0
              : (currentPage - 1) * perPage + 1}{" "}
            to {Math.min(currentPage * perPage, filteredTrainings.length)} of{" "}
            {filteredTrainings.length} results
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) pageNumber = i + 1;
              else if (currentPage <= 3) pageNumber = i + 1;
              else if (currentPage >= totalPages - 2)
                pageNumber = totalPages - 4 + i;
              else pageNumber = currentPage - 2 + i;
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
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      {showEditModal && <EditTrainingModal />}
    </div>
  );
};

export default TrainingList;
