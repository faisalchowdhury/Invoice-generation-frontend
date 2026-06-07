/**
 * File: src/pages/crm/CrmSystemSetup.tsx
 * CRM System Setup – modules: Pipelines, Lead Stages, Deal Stages, Labels, Sources
 * Full CRUD with modals for each module
 * Design matches provided screenshots and existing component patterns
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
  Globe,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Tag,
  Database,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Pipeline {
  id: string;
  name: string;
  description?: string;
}

interface LeadStage {
  id: string;
  name: string;
  order: number;
}

interface DealStage {
  id: string;
  name: string;
  order: number;
}

interface Label {
  id: string;
  name: string;
  pipelineId: string;
  pipelineName: string;
  color: string;
}

interface Source {
  id: string;
  name: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const samplePipelines: Pipeline[] = [
  { id: "1", name: "Marketing", description: "Marketing qualified leads" },
  { id: "2", name: "Sales", description: "Sales pipeline" },
];

const sampleLeadStages: LeadStage[] = [
  { id: "1", name: "Marketing", order: 1 },
  { id: "2", name: "Lead Qualification", order: 2 },
  { id: "3", name: "Sales", order: 3 },
  { id: "4", name: "Prospect", order: 4 },
  { id: "5", name: "Contacted", order: 5 },
  { id: "6", name: "Engaged", order: 6 },
  { id: "7", name: "Qualified", order: 7 },
  { id: "8", name: "Converted", order: 8 },
];

const sampleDealStages: DealStage[] = [
  { id: "1", name: "Campaign Launch", order: 1 },
  { id: "2", name: "Lead Generation", order: 2 },
  { id: "3", name: "Nurturing", order: 3 },
  { id: "4", name: "Qualification", order: 4 },
  { id: "5", name: "Handoff", order: 5 },
];

const sampleLabels: Label[] = [
  {
    id: "1",
    name: "First Visit",
    pipelineId: "1",
    pipelineName: "Marketing",
    color: "#3b82f6",
  },
  {
    id: "2",
    name: "Return Visitor",
    pipelineId: "1",
    pipelineName: "Marketing",
    color: "#10b981",
  },
  {
    id: "3",
    name: "Content Downloaded",
    pipelineId: "1",
    pipelineName: "Marketing",
    color: "#f59e0b",
  },
  {
    id: "4",
    name: "Forms Submitted",
    pipelineId: "1",
    pipelineName: "Marketing",
    color: "#8b5cf6",
  },
  {
    id: "5",
    name: "MQL Ready",
    pipelineId: "1",
    pipelineName: "Marketing",
    color: "#ef4444",
  },
];

const sampleSources: Source[] = [
  { id: "1", name: "Website Contact Form" },
  { id: "2", name: "Social Media Marketing" },
  { id: "3", name: "Email Marketing" },
  { id: "4", name: "Referral Program" },
  { id: "5", name: "Cold Calling" },
  { id: "6", name: "Google Ads Campaign" },
  { id: "7", name: "Trade Show Events" },
  { id: "8", name: "LinkedIn Outreach" },
  { id: "9", name: "Content Marketing" },
  { id: "10", name: "Partner Referral" },
];

type ModuleType =
  | "pipelines"
  | "leadStages"
  | "dealStages"
  | "labels"
  | "sources";

// ─── Main Component ──────────────────────────────────────────────────────────

export const CrmSystemSetup: React.FC = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<ModuleType>("pipelines");

  // Data states
  const [pipelines, setPipelines] = useState<Pipeline[]>(samplePipelines);
  const [leadStages, setLeadStages] = useState<LeadStage[]>(sampleLeadStages);
  const [dealStages, setDealStages] = useState<DealStage[]>(sampleDealStages);
  const [labels, setLabels] = useState<Label[]>(sampleLabels);
  const [sources, setSources] = useState<Source[]>(sampleSources);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form data for different modules
  const [pipelineForm, setPipelineForm] = useState({ name: "" });
  const [stageForm, setStageForm] = useState({ name: "", order: 0 });
  const [labelForm, setLabelForm] = useState({
    name: "",
    pipelineId: "",
    color: "#3b82f6",
  });
  const [sourceForm, setSourceForm] = useState({ name: "" });

  // ─── CRUD Handlers ─────────────────────────────────────────────────────────

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item: any, type: ModuleType) => {
    setIsEditing(true);
    setEditingId(item.id);
    switch (type) {
      case "pipelines":
        setPipelineForm({ name: item.name });
        break;
      case "leadStages":
      case "dealStages":
        setStageForm({ name: item.name, order: item.order });
        break;
      case "labels":
        setLabelForm({
          name: item.name,
          pipelineId: item.pipelineId,
          color: item.color,
        });
        break;
      case "sources":
        setSourceForm({ name: item.name });
        break;
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setPipelineForm({ name: "" });
    setStageForm({ name: "", order: 0 });
    setLabelForm({ name: "", pipelineId: "", color: "#3b82f6" });
    setSourceForm({ name: "" });
  };

  const handleSave = () => {
    switch (activeModule) {
      case "pipelines":
        if (!pipelineForm.name.trim()) {
          showToast("Pipeline name required", "info");
          return;
        }
        if (isEditing && editingId) {
          setPipelines((prev) =>
            prev.map((p) =>
              p.id === editingId ? { ...p, name: pipelineForm.name.trim() } : p,
            ),
          );
          showToast("Pipeline updated", "success");
        } else {
          const newPipeline: Pipeline = {
            id: Date.now().toString(),
            name: pipelineForm.name.trim(),
          };
          setPipelines((prev) => [newPipeline, ...prev]);
          showToast("Pipeline created", "success");
        }
        break;
      case "leadStages":
        if (!stageForm.name.trim()) {
          showToast("Stage name required", "info");
          return;
        }
        if (isEditing && editingId) {
          setLeadStages((prev) =>
            prev.map((s) =>
              s.id === editingId
                ? { ...s, name: stageForm.name.trim(), order: stageForm.order }
                : s,
            ),
          );
          showToast("Lead stage updated", "success");
        } else {
          const newStage: LeadStage = {
            id: Date.now().toString(),
            name: stageForm.name.trim(),
            order: stageForm.order || leadStages.length + 1,
          };
          setLeadStages((prev) => [...prev, newStage]);
          showToast("Lead stage created", "success");
        }
        break;
      case "dealStages":
        if (!stageForm.name.trim()) {
          showToast("Stage name required", "info");
          return;
        }
        if (isEditing && editingId) {
          setDealStages((prev) =>
            prev.map((s) =>
              s.id === editingId
                ? { ...s, name: stageForm.name.trim(), order: stageForm.order }
                : s,
            ),
          );
          showToast("Deal stage updated", "success");
        } else {
          const newStage: DealStage = {
            id: Date.now().toString(),
            name: stageForm.name.trim(),
            order: stageForm.order || dealStages.length + 1,
          };
          setDealStages((prev) => [...prev, newStage]);
          showToast("Deal stage created", "success");
        }
        break;
      case "labels":
        if (!labelForm.name.trim()) {
          showToast("Label name required", "info");
          return;
        }
        if (!labelForm.pipelineId) {
          showToast("Please select a pipeline", "info");
          return;
        }
        const selectedPipeline = pipelines.find(
          (p) => p.id === labelForm.pipelineId,
        );
        if (isEditing && editingId) {
          setLabels((prev) =>
            prev.map((l) =>
              l.id === editingId
                ? {
                    ...l,
                    name: labelForm.name.trim(),
                    pipelineId: labelForm.pipelineId,
                    pipelineName: selectedPipeline?.name || "",
                    color: labelForm.color,
                  }
                : l,
            ),
          );
          showToast("Label updated", "success");
        } else {
          const newLabel: Label = {
            id: Date.now().toString(),
            name: labelForm.name.trim(),
            pipelineId: labelForm.pipelineId,
            pipelineName: selectedPipeline?.name || "",
            color: labelForm.color,
          };
          setLabels((prev) => [...prev, newLabel]);
          showToast("Label created", "success");
        }
        break;
      case "sources":
        if (!sourceForm.name.trim()) {
          showToast("Source name required", "info");
          return;
        }
        if (isEditing && editingId) {
          setSources((prev) =>
            prev.map((s) =>
              s.id === editingId ? { ...s, name: sourceForm.name.trim() } : s,
            ),
          );
          showToast("Source updated", "success");
        } else {
          const newSource: Source = {
            id: Date.now().toString(),
            name: sourceForm.name.trim(),
          };
          setSources((prev) => [...prev, newSource]);
          showToast("Source created", "success");
        }
        break;
    }
    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id: string, name: string, type: ModuleType) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      switch (type) {
        case "pipelines":
          setPipelines((prev) => prev.filter((p) => p.id !== id));
          break;
        case "leadStages":
          setLeadStages((prev) => prev.filter((s) => s.id !== id));
          break;
        case "dealStages":
          setDealStages((prev) => prev.filter((s) => s.id !== id));
          break;
        case "labels":
          setLabels((prev) => prev.filter((l) => l.id !== id));
          break;
        case "sources":
          setSources((prev) => prev.filter((s) => s.id !== id));
          break;
      }
      showToast(`${name} deleted`, "success");
    }
  };

  // ─── Render module content ─────────────────────────────────────────────────

  const renderModuleContent = () => {
    switch (activeModule) {
      case "pipelines":
        return (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Pipelines</h3>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" /> Add Pipeline
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pipelines.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {p.name}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(p, "pipelines")}
                            className="p-1 text-gray-400 hover:text-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(p.id, p.name, "pipelines")
                            }
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
      case "leadStages":
        return (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h3 className="font-semibold">Lead Stages</h3>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md"
              >
                <Plus className="w-4 h-4" /> Add Stage
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Order</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leadStages.map((s) => (
                    <tr key={s.id} className="border-b">
                      <td className="px-4 py-3 font-medium">{s.name}</td>
                      <td className="px-4 py-3">{s.order}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(s, "leadStages")}
                          >
                            <Edit className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(s.id, s.name, "leadStages")
                            }
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
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
      case "dealStages":
        return (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h3 className="font-semibold">Deal Stages</h3>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md"
              >
                <Plus className="w-4 h-4" /> Add Stage
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Order</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dealStages.map((s) => (
                    <tr key={s.id} className="border-b">
                      <td className="px-4 py-3 font-medium">{s.name}</td>
                      <td className="px-4 py-3">{s.order}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(s, "dealStages")}
                          >
                            <Edit className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(s.id, s.name, "dealStages")
                            }
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
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
      case "labels":
        return (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h3 className="font-semibold">Labels</h3>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md"
              >
                <Plus className="w-4 h-4" /> Add Label
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Pipeline</th>
                    <th className="px-4 py-3 text-left">Color</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {labels.map((l) => (
                    <tr key={l.id} className="border-b">
                      <td className="px-4 py-3 font-medium">{l.name}</td>
                      <td className="px-4 py-3">{l.pipelineName}</td>
                      <td className="px-4 py-3">
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: l.color }}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEditModal(l, "labels")}>
                            <Edit className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(l.id, l.name, "labels")}
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
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
      case "sources":
        return (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h3 className="font-semibold">Sources</h3>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md"
              >
                <Plus className="w-4 h-4" /> Add Source
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Source</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sources.map((s) => (
                    <tr key={s.id} className="border-b">
                      <td className="px-4 py-3 font-medium">{s.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEditModal(s, "sources")}>
                            <Edit className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(s.id, s.name, "sources")
                            }
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
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
      default:
        return null;
    }
  };

  // ─── Modal render (dynamic based on active module) ─────────────────────────

  const renderModal = () => {
    let title = "";
    let content = null;
    switch (activeModule) {
      case "pipelines":
        title = `${isEditing ? "Edit" : "Create"} Pipeline`;
        content = (
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              value={pipelineForm.name}
              onChange={(e) =>
                setPipelineForm({ ...pipelineForm, name: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        );
        break;
      case "leadStages":
      case "dealStages":
        title = `${isEditing ? "Edit" : "Create"} Stage`;
        content = (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                value={stageForm.name}
                onChange={(e) =>
                  setStageForm({ ...stageForm, name: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Order</label>
              <input
                type="number"
                value={stageForm.order}
                onChange={(e) =>
                  setStageForm({
                    ...stageForm,
                    order: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>
        );
        break;
      case "labels":
        title = `${isEditing ? "Edit" : "Create"} Label`;
        content = (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                value={labelForm.name}
                onChange={(e) =>
                  setLabelForm({ ...labelForm, name: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Pipeline *
              </label>
              <select
                value={labelForm.pipelineId}
                onChange={(e) =>
                  setLabelForm({ ...labelForm, pipelineId: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 bg-white"
              >
                <option value="">Select Pipeline</option>
                {pipelines.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={labelForm.color}
                  onChange={(e) =>
                    setLabelForm({ ...labelForm, color: e.target.value })
                  }
                  className="w-10 h-10 border rounded"
                />
                <input
                  type="text"
                  value={labelForm.color}
                  onChange={(e) =>
                    setLabelForm({ ...labelForm, color: e.target.value })
                  }
                  className="flex-1 border rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>
        );
        break;
      case "sources":
        title = `${isEditing ? "Edit" : "Create"} Source`;
        content = (
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              value={sourceForm.name}
              onChange={(e) =>
                setSourceForm({ ...sourceForm, name: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        );
        break;
    }
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
      >
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={() => setShowModal(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">{content}</div>
          <div className="p-4 border-t flex justify-end gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── Main Render ───────────────────────────────────────────────────────────

  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-hidden flex flex-col">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
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
            <span className="text-gray-900 font-medium">System Setup</span>
            <span>›</span>
            <span className="text-gray-900 font-medium capitalize">
              {activeModule}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600 border border-gray-200 rounded-md px-2 py-1 bg-white">
            <Globe className="w-4 h-4" />
            <span>ga English</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              System Setup
            </h3>
            <nav className="space-y-1">
              {[
                { id: "pipelines", label: "Pipelines", icon: GitBranch },
                { id: "leadStages", label: "Lead Stages", icon: GitCommit },
                {
                  id: "dealStages",
                  label: "Deal Stages",
                  icon: GitPullRequest,
                },
                { id: "labels", label: "Labels", icon: Tag },
                { id: "sources", label: "Sources", icon: Database },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id as ModuleType)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                    activeModule === item.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              System Setup
            </h1>
            {renderModuleContent()}
          </div>
        </div>
      </div>

      {showModal && renderModal()}
    </div>
  );
};

export default CrmSystemSetup;
