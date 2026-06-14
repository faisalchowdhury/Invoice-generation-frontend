/**
 * File: src/pages/goal/Tracking.tsx
 * Goal Tracking snapshots — list (optional goal filter), create/edit modal, delete.
 *
 * Endpoints (under /goal):
 *   GET    tracking?goal_id=&tracking_date=
 *   GET    tracking/:id
 *   POST   tracking
 *   PUT    tracking/:id
 *   DELETE tracking/:id
 */

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import { api } from "../../lib/api/client";
import { ApiError } from "../../lib/api/ApiError";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Calendar,
  Activity,
  Loader2,
} from "lucide-react";

interface Tracking {
  id: string;
  goalId: string;
  date: string;
  previousAmount: number;
  contributionAmount: number;
  currentAmount: number;
  progress: number;
  daysRemaining: number;
  onTrackStatus: string;
}
interface ApiTracking {
  _id: string;
  goal_id?: string | { _id: string; goal_name?: string };
  tracking_date?: string;
  previous_amount?: number;
  contribution_amount?: number;
  current_amount?: number;
  progress_percentage?: number;
  days_remaining?: number;
  on_track_status?: string;
}
interface ApiGoal { _id: string; goal_name?: string }

const STATUSES = ["ahead", "on_track", "behind", "critical"];
const errMessage = (err: unknown, fallback: string) =>
  err instanceof ApiError && err.message ? err.message : fallback;
const refId = (v: any): string => (typeof v === "object" && v ? v._id : (v ?? ""));
const refGoalName = (v: any): string => (typeof v === "object" && v ? (v.goal_name ?? "") : "");
const toDateInput = (iso?: string) => (iso ? iso.slice(0, 10) : "");
const money = (n: number) =>
  `$${(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
const pretty = (s: string) => s.replace(/_/g, " ");

const mapApi = (t: ApiTracking): Tracking => ({
  id: t._id,
  goalId: refId(t.goal_id),
  date: toDateInput(t.tracking_date),
  previousAmount: t.previous_amount ?? 0,
  contributionAmount: t.contribution_amount ?? 0,
  currentAmount: t.current_amount ?? 0,
  progress: t.progress_percentage ?? 0,
  daysRemaining: t.days_remaining ?? 0,
  onTrackStatus: (t.on_track_status ?? "on_track").toLowerCase(),
});

const statusColor = (s: string) => {
  switch (s) {
    case "ahead": return "bg-green-100 text-green-700";
    case "on_track": return "bg-blue-100 text-blue-700";
    case "behind": return "bg-yellow-100 text-yellow-700";
    case "critical": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

export const Tracking: React.FC = () => {
  const navigate = useNavigate();

  const [goals, setGoals] = useState<ApiGoal[]>([]);
  const [goalNames, setGoalNames] = useState<Record<string, string>>({});
  const [selectedGoal, setSelectedGoal] = useState("");
  const [rows, setRows] = useState<Tracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    goal_id: "",
    tracking_date: new Date().toISOString().split("T")[0],
    previous_amount: 0,
    contribution_amount: 0,
    current_amount: 0,
    progress_percentage: 0,
    days_remaining: 0,
    on_track_status: "on_track",
  });
  const [saving, setSaving] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [toDelete, setToDelete] = useState<Tracking | null>(null);
  const [deleting, setDeleting] = useState(false);

  const goalName = (id: string) => goalNames[id] || id || "—";

  const loadGoals = useCallback(async () => {
    try {
      const data = await api.get<ApiGoal[]>("/goal/goals", { params: { page: 1, limit: 1000 } });
      if (Array.isArray(data)) {
        setGoals(data);
        const m: Record<string, string> = {};
        data.forEach((g) => (m[g._id] = g.goal_name ?? ""));
        setGoalNames((prev) => ({ ...m, ...prev }));
      }
    } catch {
      /* degrade */
    }
  }, []);

  const load = useCallback(async (goalId: string) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await api.get<ApiTracking[]>("/goal/tracking", { params: goalId ? { goal_id: goalId } : {} });
      setRows(Array.isArray(data) ? data.map(mapApi) : []);
      const names: Record<string, string> = {};
      (Array.isArray(data) ? data : []).forEach((t) => {
        const nm = refGoalName(t.goal_id);
        if (nm) names[refId(t.goal_id)] = nm;
      });
      if (Object.keys(names).length) setGoalNames((prev) => ({ ...prev, ...names }));
    } catch (err) {
      const m = errMessage(err, "Couldn't load tracking.");
      setLoadError(m);
      showToast(m, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadGoals(); }, [loadGoals]);
  useEffect(() => { load(selectedGoal); }, [selectedGoal, load]);

  const sorted = useMemo(() => [...rows].sort((a, b) => b.date.localeCompare(a.date)), [rows]);

  const openCreate = () => {
    setForm({ goal_id: selectedGoal || "", tracking_date: new Date().toISOString().split("T")[0], previous_amount: 0, contribution_amount: 0, current_amount: 0, progress_percentage: 0, days_remaining: 0, on_track_status: "on_track" });
    setEditingId(null);
    setShowModal(true);
  };
  const openEdit = (t: Tracking) => {
    setForm({
      goal_id: t.goalId,
      tracking_date: t.date,
      previous_amount: t.previousAmount,
      contribution_amount: t.contributionAmount,
      current_amount: t.currentAmount,
      progress_percentage: t.progress,
      days_remaining: t.daysRemaining,
      on_track_status: t.onTrackStatus,
    });
    setEditingId(t.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingId && !form.goal_id) return showToast("Select a goal", "info");
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/goal/tracking/${editingId}`, {
          tracking_date: form.tracking_date,
          previous_amount: form.previous_amount,
          contribution_amount: form.contribution_amount,
          current_amount: form.current_amount,
          progress_percentage: form.progress_percentage,
          days_remaining: form.days_remaining,
          on_track_status: form.on_track_status,
        });
      } else {
        await api.post("/goal/tracking", { goal_id: form.goal_id, ...{
          tracking_date: form.tracking_date,
          previous_amount: form.previous_amount,
          contribution_amount: form.contribution_amount,
          current_amount: form.current_amount,
          progress_percentage: form.progress_percentage,
          days_remaining: form.days_remaining,
          on_track_status: form.on_track_status,
        } });
      }
      showToast(`Tracking ${editingId ? "updated" : "created"}!`, "success");
      setShowModal(false);
      await load(selectedGoal);
    } catch (err) {
      showToast(errMessage(err, "Couldn't save tracking."), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/goal/tracking/${toDelete.id}`);
      showToast("Tracking deleted!", "success");
      setShowDelete(false);
      setToDelete(null);
      await load(selectedGoal);
    } catch (err) {
      showToast(errMessage(err, "Couldn't delete tracking."), "error");
    } finally {
      setDeleting(false);
    }
  };

  const inputCls =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white";

  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-hidden flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate("/")} className="hover:text-gray-700">Dashboard</button>
          <span>›</span><span className="text-gray-900 font-medium">Goal Tracking</span>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Goal Tracking</h2>
            <p className="text-sm text-gray-500 mt-0.5">Progress snapshots over time</p>
          </div>
          <button onClick={openCreate} className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700" title="Add Tracking"><Plus className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Goal:</span>
          <select value={selectedGoal} onChange={(e) => setSelectedGoal(e.target.value)} className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white min-w-[220px]">
            <option value="">All goals</option>
            {goals.map((g) => (<option key={g._id} value={g._id}>{g.goal_name}</option>))}
          </select>
          <button onClick={() => load(selectedGoal)} className="px-4 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600">Refresh</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Goal</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">Contribution</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">Current</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">Progress</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">Days Left</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">On Track</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-16"><div className="flex items-center justify-center gap-2 text-gray-500"><Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">Loading…</span></div></td></tr>
              ) : loadError ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-red-600">{loadError}</td></tr>
              ) : sorted.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-500">No tracking records found.</td></tr>
              ) : (
                sorted.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{t.date}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><Activity className="w-4 h-4 text-gray-400" /><span className="text-gray-900">{goalName(t.goalId)}</span></div></td>
                    <td className="px-4 py-3 text-right text-green-600">{money(t.contributionAmount)}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">{money(t.currentAmount)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{Math.round(t.progress)}%</td>
                    <td className="px-4 py-3 text-right text-gray-600">{t.daysRemaining}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColor(t.onTrackStatus)}`}>{pretty(t.onTrackStatus)}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(t)} className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50" title="Edit"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => { setToDelete(t); setShowDelete(true); }} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{editingId ? "Edit Tracking" : "Add Tracking"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {!editingId && (
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal *</label>
                  <select className={inputCls} value={form.goal_id} onChange={(e) => setForm({ ...form, goal_id: e.target.value })}>
                    <option value="">Select goal</option>
                    {goals.map((g) => (<option key={g._id} value={g._id}>{g.goal_name}</option>))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Date</label>
                <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="date" className={`${inputCls} pl-10`} value={form.tracking_date} onChange={(e) => setForm({ ...form, tracking_date: e.target.value })} /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">On Track Status</label>
                <select className={inputCls} value={form.on_track_status} onChange={(e) => setForm({ ...form, on_track_status: e.target.value })}>
                  {STATUSES.map((s) => (<option key={s} value={s} className="capitalize">{pretty(s)}</option>))}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Previous Amount</label><input type="number" min={0} step="0.01" className={inputCls} value={form.previous_amount} onChange={(e) => setForm({ ...form, previous_amount: parseFloat(e.target.value) || 0 })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Contribution Amount</label><input type="number" min={0} step="0.01" className={inputCls} value={form.contribution_amount} onChange={(e) => setForm({ ...form, contribution_amount: parseFloat(e.target.value) || 0 })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Current Amount</label><input type="number" min={0} step="0.01" className={inputCls} value={form.current_amount} onChange={(e) => setForm({ ...form, current_amount: parseFloat(e.target.value) || 0 })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Progress %</label><input type="number" min={0} max={100} step="0.01" className={inputCls} value={form.progress_percentage} onChange={(e) => setForm({ ...form, progress_percentage: parseFloat(e.target.value) || 0 })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Days Remaining</label><input type="number" min={0} className={inputCls} value={form.days_remaining} onChange={(e) => setForm({ ...form, days_remaining: parseInt(e.target.value) || 0 })} /></div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} disabled={saving} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm disabled:opacity-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm inline-flex items-center gap-2 disabled:opacity-50">{saving && <Loader2 className="w-4 h-4 animate-spin" />}{editingId ? "Save Changes" : "Create"}</button>
            </div>
          </div>
        </div>
      )}

      {showDelete && toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center"><Trash2 className="w-8 h-8 text-red-600" /></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Tracking</h3>
              <p className="text-gray-500 mb-6">Delete this tracking snapshot ({toDelete.date})? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={handleDelete} disabled={deleting} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 inline-flex items-center justify-center gap-2 disabled:opacity-50">{deleting && <Loader2 className="w-4 h-4 animate-spin" />}{deleting ? "Deleting…" : "Delete"}</button>
                <button onClick={() => setShowDelete(false)} disabled={deleting} className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
