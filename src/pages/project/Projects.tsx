/**
 * File: src/pages/Projects.tsx
 * Projects page - Complete implementation
 * Based on Figma screenshots
 */

import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  MoreVertical,
  FolderOpen,
  Copy,
  Trash2,
  ChevronDown,
  X,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  customer: string;
  totalHours: string;
  totalBillHours: string;
  hourlyRate: string;
  defaultRate: string;
}

interface Task {
  id: string;
  name: string;
  sac: string;
  defaultProject: string;
  defaultQuantity: string;
  defaultCustomerRate: string;
  notes: string;
}

export const Projects: React.FC = () => {
  const [isEmpty, setIsEmpty] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<"tasks" | "time-logs">("tasks");
  const [showMobileList, setShowMobileList] = useState(true);

  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [projectFormData, setProjectFormData] = useState({
    name: "",
    customer: "",
    defaultCustomerRate: "",
  });

  const [taskFormData, setTaskFormData] = useState({
    name: "",
    sac: "",
    defaultProject: "Hour",
    defaultQuantity: "1",
    defaultCustomerRate: "",
    notes: "",
  });

  const handleCreateProject = () => {
    setShowCreateProject(true);
  };

  const handleSaveProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectFormData.name,
      customer: projectFormData.customer,
      totalHours: "00:00",
      totalBillHours: "00:00",
      hourlyRate: projectFormData.defaultCustomerRate || "$4500",
      defaultRate: projectFormData.defaultCustomerRate,
    };

    setProjects([...projects, newProject]);
    setSelectedProject(newProject);
    setIsEmpty(false);
    setShowCreateProject(false);
    setProjectFormData({ name: "", customer: "", defaultCustomerRate: "" });
  };

  const handleSaveTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskFormData,
    };

    setTasks([...tasks, newTask]);
    setShowCreateTask(false);
    setTaskFormData({
      name: "",
      sac: "",
      defaultProject: "Hour",
      defaultQuantity: "1",
      defaultCustomerRate: "",
      notes: "",
    });
  };

  // EMPTY STATE
  if (isEmpty) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FAFBFC]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-2xl mb-6">
            <FolderOpen className="w-12 h-12 text-blue-600" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-semibold text-blue-600 mb-2">
            Add New Project. Go Live
          </h3>
          <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
            Add new project details by entering a name,
            <br />
            customer details, and project rate.
          </p>
          <button
            onClick={handleCreateProject}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-medium"
          >
            <Plus className="w-5 h-5" />
            Create a Project
          </button>
        </div>

        {/* Create Project Modal */}
        {showCreateProject && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Add Project
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name*
                  </label>
                  <input
                    type="text"
                    value={projectFormData.name}
                    onChange={(e) =>
                      setProjectFormData({
                        ...projectFormData,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer
                  </label>
                  <input
                    type="text"
                    value={projectFormData.customer}
                    onChange={(e) =>
                      setProjectFormData({
                        ...projectFormData,
                        customer: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    $ Default Customer Rate
                  </label>
                  <input
                    type="text"
                    value={projectFormData.defaultCustomerRate}
                    onChange={(e) =>
                      setProjectFormData({
                        ...projectFormData,
                        defaultCustomerRate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowCreateProject(false)}
                  className="px-5 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProject}
                  className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // MAIN CONTENT WITH PROJECT
  return (
    <div className="flex-1 flex flex-col bg-[#FAFBFC] overflow-hidden">
      {/* Mobile Toggle Bar */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2">
        <button
          onClick={() => setShowMobileList(!showMobileList)}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-md px-3 py-1.5"
        >
          {showMobileList ? "← Back to Details" : "☰ View Projects"}
        </button>
      </div>

      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <button className="text-sm font-medium text-gray-900 border-b-2 border-blue-600 pb-2">
            Summary
          </button>
          <div className="flex items-center gap-3">
            <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">
              <option>This Year</option>
            </select>
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h18M3 10h18M3 16h18"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* LEFT PANEL - Project List */}
        <div className={`${showMobileList ? "flex" : "hidden"} lg:flex flex-col w-full lg:w-96 bg-white border-r border-gray-200`}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
              <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-gray-100 rounded">
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded">
                  <Edit2 className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Selected Project Name */}
            {selectedProject && (
              <div className="flex items-center gap-2 text-base font-medium text-gray-900">
                <span>{selectedProject.name}</span>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="px-6 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="text-gray-600">Sort by:</span>
              <select className="px-2 py-1 border border-gray-300 rounded text-gray-700 text-xs">
                <option>Date</option>
              </select>
              <select className="px-2 py-1 border border-gray-300 rounded text-gray-700 text-xs">
                <option>Status</option>
              </select>
              <select className="px-2 py-1 border border-gray-300 rounded text-gray-700 text-xs">
                <option>Customer: All</option>
              </select>
              <select className="px-2 py-1 border border-gray-300 rounded text-gray-700 text-xs">
                <option>Date</option>
              </select>
            </div>
          </div>

          {/* Project List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="text-xs text-gray-500 mb-2">Tamim</div>
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => { setSelectedProject(project); setShowMobileList(false); }}
                  className={`p-3 rounded cursor-pointer mb-2 ${
                    selectedProject?.id === project.id
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {project.customer}
                  </div>
                  <div className="text-xs text-gray-500">
                    {project.totalHours}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleCreateProject}
              className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 mx-auto"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 border-t border-gray-200 text-center">
            <div className="text-xl font-semibold text-gray-900">
              {projects.length} Project{projects.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Project Details */}
        <div className={`${showMobileList ? "hidden" : "flex"} lg:flex flex-col flex-1 overflow-y-auto bg-white`}>
          {selectedProject ? (
            <div className="p-4 sm:p-6">
              {/* Project Info Header */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Customer</div>
                    <div className="text-base font-medium text-gray-900">
                      {selectedProject.customer}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Total Hours
                    </div>
                    <div className="text-base font-medium text-gray-900">
                      {selectedProject.totalHours}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Total Bill Hours
                    </div>
                    <div className="text-base font-medium text-gray-900">
                      {selectedProject.totalBillHours}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Hourly Rate
                    </div>
                    <div className="text-base font-medium text-gray-900">
                      {selectedProject.hourlyRate}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex gap-8">
                  <button
                    onClick={() => setActiveTab("tasks")}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "tasks"
                        ? "text-gray-900 border-blue-600"
                        : "text-gray-500 border-transparent hover:text-gray-700"
                    }`}
                  >
                    Tasks
                  </button>
                  <button
                    onClick={() => setActiveTab("time-logs")}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "time-logs"
                        ? "text-gray-900 border-blue-600"
                        : "text-gray-500 border-transparent hover:text-gray-700"
                    }`}
                  >
                    Time Logs
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === "tasks" && (
                <div>
                  {tasks.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl mb-4">
                        <FolderOpen
                          className="w-10 h-10 text-blue-600"
                          strokeWidth={1.5}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-blue-600 mb-2">
                        Add New Project Task
                      </h3>
                      <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
                        Enter the correct project task details and add them
                        <br />
                        before starting a new time log.
                      </p>
                      <button
                        onClick={() => setShowCreateTask(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-medium"
                      >
                        <Plus className="w-5 h-5" />
                        Create Task
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">
                                {task.name}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {task.defaultProject} • $
                                {task.defaultCustomerRate}
                              </div>
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded">
                              <MoreVertical className="w-5 h-5 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "time-logs" && (
                <div className="text-center py-16">
                  <div className="text-gray-500">No time logs yet</div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                Select a project to view details
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">New Task</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCreateTask(false)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTask}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  save
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name*
                </label>
                <input
                  type="text"
                  value={taskFormData.name}
                  onChange={(e) =>
                    setTaskFormData({ ...taskFormData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SAC
                </label>
                <input
                  type="text"
                  value={taskFormData.sac}
                  onChange={(e) =>
                    setTaskFormData({ ...taskFormData, sac: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    $ Default Project
                  </label>
                  <select
                    value={taskFormData.defaultProject}
                    onChange={(e) =>
                      setTaskFormData({
                        ...taskFormData,
                        defaultProject: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option>Hour</option>
                    <option>Day</option>
                  </select>
                  <div className="text-xs text-gray-500 mt-1">unit Type</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Quantity
                  </label>
                  <input
                    type="text"
                    value={taskFormData.defaultQuantity}
                    onChange={(e) =>
                      setTaskFormData({
                        ...taskFormData,
                        defaultQuantity: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  $ Default Customer Rate
                </label>
                <input
                  type="text"
                  value={taskFormData.defaultCustomerRate}
                  onChange={(e) =>
                    setTaskFormData({
                      ...taskFormData,
                      defaultCustomerRate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  rows={4}
                  value={taskFormData.notes}
                  onChange={(e) =>
                    setTaskFormData({ ...taskFormData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
