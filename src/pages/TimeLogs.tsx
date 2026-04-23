/**
 * File: src/pages/TimeLogs.tsx
 * Time Logs page - FIXED TIMER VERSION
 * Timer now works properly with start/stop/reset
 */

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  MoreVertical,
  Copy,
  X,
  Calendar,
  Clock,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  Check,
  Search,
} from "lucide-react";

interface TimeLog {
  id: string;
  email: string;
  hours: string;
  date: string;
  project: string;
  task: string;
  notes: string;
}

export const TimeLogs: React.FC = () => {
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([
    {
      id: "1",
      email: "info@gmail.com",
      hours: "00:00",
      date: "March 26, (01)",
      project: "Project",
      task: "task",
      notes: "No Notes",
    },
  ]);

  const [isEmpty, setIsEmpty] = useState(true);
  const [showNewTimeLog, setShowNewTimeLog] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLog, setSelectedLog] = useState<TimeLog | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<"time-logs" | "products">(
    "time-logs",
  );

  // Timer state - NOW WITH RUNNING STATE
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    date: "24/3/26",
    project: "Project",
    task: "task",
    internalNotes: "",
  });

  const [projectData, setProjectData] = useState({
    name: "",
    customer: "",
    defaultRate: "",
  });

  const [taskData, setTaskData] = useState({
    name: "",
    sac: "",
    defaultProject: "Hour",
    defaultQuantity: "1",
    defaultCustomerRate: "",
    notes: "",
  });

  // ⭐ TIMER LOGIC - THIS WAS MISSING!
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 59) {
            setMinutes((prevMinutes) => {
              if (prevMinutes === 59) {
                setHours((prevHours) => prevHours + 1);
                return 0;
              }
              return prevMinutes + 1;
            });
            return 0;
          }
          return prevSeconds + 1;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const formatTime = (val: number) => val.toString().padStart(2, "0");

  const handleStartStopTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setSeconds(0);
    setMinutes(0);
    setHours(0);
  };

  const handleCreateTimeLog = () => {
    setIsEmpty(false);
    setShowNewTimeLog(true);
  };

  const handleSaveTimeLog = () => {
    // Save the current timer value to the log
    const timeValue = `${formatTime(hours)}:${formatTime(minutes)}`;
    const updatedLogs = [...timeLogs];
    updatedLogs[0] = {
      ...updatedLogs[0],
      hours: timeValue,
    };
    setTimeLogs(updatedLogs);

    setShowNewTimeLog(false);
    setShowDetails(true);
    setSelectedLog(timeLogs[0]);
  };

  const handleSaveProject = () => {
    setShowAddProject(false);
    setProjectData({ name: "", customer: "", defaultRate: "" });
  };

  const handleSaveTask = () => {
    setShowNewTask(false);
    setTaskData({
      name: "",
      sac: "",
      defaultProject: "Hour",
      defaultQuantity: "1",
      defaultCustomerRate: "",
      notes: "",
    });
  };

  const toggleSelectLog = (id: string) => {
    setSelectedLogs((prev) =>
      prev.includes(id) ? prev.filter((logId) => logId !== id) : [...prev, id],
    );
  };

  if (isEmpty) {
    // EMPTY STATE
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FAFBFC]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
            <Clock className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-blue-600 mb-2">
            Start Time Log From Options
          </h3>
          <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
            Log on to manual hours, In/Out and timer options
            <br />
            for starting a new project time log.
          </p>
          <button
            onClick={handleCreateTimeLog}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Time Logs
          </button>
        </div>
      </div>
    );
  }

  // MAIN CONTENT
  return (
    <div className="flex-1 flex flex-col bg-[#FAFBFC] overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
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

      <div className="flex-1 overflow-hidden flex">
        {/* LEFT PANEL */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeView === "time-logs" ? "Time Logs" : "Products"}
              </h2>
              <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-gray-100 rounded">
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {showNewTimeLog && (
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-medium text-gray-900">
                  New Time Log
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowNewTimeLog(false)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveTimeLog}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Save
                  </button>
                </div>
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

          {/* List Content */}
          <div className="flex-1 overflow-y-auto">
            {activeView === "time-logs" ? (
              <div className="p-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-700">Service name</span>
                  <span className="text-sm font-semibold text-gray-900">
                    $5000
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4">
                {/* Timer Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Timer
                    </span>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Plus className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                </div>

                {/* Date Group */}
                {showDetails && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">
                      March 26, (01)
                    </div>
                    <div
                      className={`flex items-center gap-2 p-3 rounded hover:bg-gray-50 cursor-pointer ${
                        selectedLogs.includes("1") ? "bg-blue-50" : ""
                      }`}
                      onClick={() => !isMultiSelect && setShowDetails(true)}
                    >
                      {isMultiSelect && (
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedLogs.includes("1")}
                          onChange={() => toggleSelectLog("1")}
                        />
                      )}
                      <span className="text-sm text-gray-700 flex-1">
                        info@gmail.com
                      </span>
                      <span className="text-sm text-gray-900">
                        {timeLogs[0].hours}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
                setShowNewTimeLog(true);
                setActiveView("products");
              }}
              className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 mx-auto"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 border-t border-gray-200 text-center">
            <div className="text-xl font-semibold text-gray-900">
              {showDetails
                ? `${formatTime(hours)}:${formatTime(minutes)} Hours`
                : "$80.00"}
            </div>
            <div className="text-xs text-gray-500">
              {showDetails ? "1 Time log" : "1 Proforma Invoices"}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 overflow-y-auto p-6">
          {(showNewTimeLog || showDetails) && (
            <div className="max-w-3xl mx-auto">
              {/* Header with Actions */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-semibold text-gray-900">
                  {showDetails ? "Time Log Details" : "New Time Log"}
                </h2>
                {showDetails && (
                  <div className="flex items-center gap-2 relative">
                    <button
                      onClick={handleStartStopTimer}
                      className="p-2 hover:bg-gray-100 rounded-md"
                      title={isTimerRunning ? "Pause Timer" : "Start Timer"}
                    >
                      {isTimerRunning ? (
                        <Pause className="w-5 h-5 text-orange-600" />
                      ) : (
                        <Play className="w-5 h-5 text-green-600" />
                      )}
                    </button>
                    <button
                      onClick={handleResetTimer}
                      className="p-2 hover:bg-gray-100 rounded-md"
                      title="Reset Timer"
                    >
                      <RotateCcw className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-md">
                      <Copy className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => {
                        setShowDetails(false);
                        setShowNewTimeLog(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-md"
                    >
                      <Edit className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setShowMoreMenu(!showMoreMenu)}
                      className="p-2 hover:bg-gray-100 rounded-md"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* 3 Dot Menu */}
                    {showMoreMenu && (
                      <div className="absolute right-0 top-12 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                          Mark As Invoice
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                          Duplicate
                        </button>
                        <div className="border-t border-gray-200 my-1"></div>
                        <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Timer Display */}
              <div className="text-center mb-12">
                <div className="text-7xl font-bold text-gray-900 mb-2">
                  {formatTime(hours)}:{formatTime(minutes)}
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  hh: mm{" "}
                  {isTimerRunning && (
                    <span className="text-green-600 ml-2">● Running</span>
                  )}
                </div>
                {showDetails && (
                  <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium">
                    In/out
                  </button>
                )}
              </div>

              {/* Details Form or Display */}
              {showDetails ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hours
                      </label>
                      <div className="text-2xl font-semibold text-gray-900">
                        {formatTime(hours)}:{formatTime(minutes)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <div className="text-base text-gray-900">
                        Today, 11:50 AM
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <div className="text-sm text-gray-600">
                      {formData.internalNotes || "No Notes"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-base font-semibold text-gray-900">
                    Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      project
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.project}
                        onChange={(e) =>
                          setFormData({ ...formData, project: e.target.value })
                        }
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <button
                        onClick={() => setShowAddProject(true)}
                        className="p-2.5 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        <Plus className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.task}
                        onChange={(e) =>
                          setFormData({ ...formData, task: e.target.value })
                        }
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <button
                        onClick={() => setShowNewTask(true)}
                        className="p-2.5 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        <Plus className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Internal Notes
                    </label>
                    <textarea
                      rows={5}
                      value={formData.internalNotes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          internalNotes: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}

      {/* Add Project Modal */}
      {showAddProject && (
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
                  value={projectData.name}
                  onChange={(e) =>
                    setProjectData({ ...projectData, name: e.target.value })
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
                  value={projectData.customer}
                  onChange={(e) =>
                    setProjectData({ ...projectData, customer: e.target.value })
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
                  value={projectData.defaultRate}
                  onChange={(e) =>
                    setProjectData({
                      ...projectData,
                      defaultRate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddProject(false)}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
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

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              New Task
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name*
                </label>
                <input
                  type="text"
                  value={taskData.name}
                  onChange={(e) =>
                    setTaskData({ ...taskData, name: e.target.value })
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
                  value={taskData.sac}
                  onChange={(e) =>
                    setTaskData({ ...taskData, sac: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    $ Default Project
                  </label>
                  <select
                    value={taskData.defaultProject}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
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
                    value={taskData.defaultQuantity}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
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
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
                  <option value="">Select rate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  rows={4}
                  value={taskData.notes}
                  onChange={(e) =>
                    setTaskData({ ...taskData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowNewTask(false)}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTask}
                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Select Toggle */}
      {showDetails && (
        <button
          onClick={() => setIsMultiSelect(!isMultiSelect)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 shadow-lg z-40 transition-all"
        >
          {isMultiSelect ? (
            <X className="w-6 h-6" />
          ) : (
            <Check className="w-6 h-6" />
          )}
        </button>
      )}
    </div>
  );
};
