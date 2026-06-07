/**
 * File: src/pages/product/SystemSetup.tsx
 * Complete System Setup page with Categories, Taxes, and Units management
 * Includes tabs, CRUD operations for each section, modals with transparent background
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Tag,
  Percent,
  Ruler,
  ChevronLeft,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Tax {
  id: string;
  name: string;
  rate: number;
}

interface Unit {
  id: string;
  name: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleCategories: Category[] = [
  { id: "1", name: "Food & Beverages", color: "#EF4444" },
  { id: "2", name: "Fashion & Apparel", color: "#3B82F6" },
  { id: "3", name: "Sports & Fitness", color: "#10B981" },
  { id: "4", name: "Automotive & Tools", color: "#F59E0B" },
  { id: "5", name: "Electronics & Technology", color: "#8B5CF6" },
  { id: "6", name: "Home & Garden", color: "#EC4899" },
  { id: "7", name: "Jewelry & Accessories", color: "#06B6D4" },
  { id: "8", name: "Books & Stationery", color: "#F97316" },
  { id: "9", name: "Health & Beauty", color: "#84CC16" },
  { id: "10", name: "Fruits & Vegetables", color: "#22C55E" },
];

const sampleTaxes: Tax[] = [
  { id: "1", name: "GST", rate: 18.0 },
  { id: "2", name: "VAT", rate: 12.0 },
  { id: "3", name: "Service Tax", rate: 15.0 },
  { id: "4", name: "Sales Tax", rate: 8.5 },
];

const sampleUnits: Unit[] = [
  { id: "1", name: "Gallon" },
  { id: "2", name: "Milliliter" },
  { id: "3", name: "Kilogram" },
  { id: "4", name: "Gram" },
  { id: "5", name: "Basket" },
  { id: "6", name: "Crate" },
  { id: "7", name: "Ton" },
  { id: "8", name: "Liter" },
  { id: "9", name: "Can" },
  { id: "10", name: "Jar" },
];

const colorOptions = [
  "#EF4444",
  "#F59E0B",
  "#F97316",
  "#84CC16",
  "#10B981",
  "#22C55E",
  "#06B6D4",
  "#3B82F6",
  "#8B5CF6",
  "#A855F7",
  "#EC4899",
  "#F43F5E",
  "#78716C",
  "#64748B",
  "#1E293B",
];

// ─── Component ────────────────────────────────────────────────────────────────

export const SystemSetup: React.FC = () => {
  const navigate = useNavigate();

  // Active tab state
  const [activeTab, setActiveTab] = useState<"categories" | "taxes" | "units">(
    "categories",
  );

  // Data states
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [taxes, setTaxes] = useState<Tax[]>(sampleTaxes);
  const [units, setUnits] = useState<Unit[]>(sampleUnits);

  // Search states
  const [categorySearch, setCategorySearch] = useState("");
  const [taxSearch, setTaxSearch] = useState("");
  const [unitSearch, setUnitSearch] = useState("");

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    color: "#3B82F6",
  });
  const [taxForm, setTaxForm] = useState({ name: "", rate: 0 });
  const [unitForm, setUnitForm] = useState({ name: "" });

  // ─── Category CRUD ──────────────────────────────────────────────────────────

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  const openCategoryModal = (category?: Category) => {
    if (category) {
      setIsEditing(true);
      setEditingItem(category);
      setCategoryForm({ name: category.name, color: category.color });
    } else {
      setIsEditing(false);
      setEditingItem(null);
      setCategoryForm({ name: "", color: "#3B82F6" });
    }
    setShowCategoryModal(true);
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name.trim()) {
      showToast("Please enter category name", "info");
      return;
    }

    if (isEditing && editingItem) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingItem.id
            ? { ...c, name: categoryForm.name, color: categoryForm.color }
            : c,
        ),
      );
      showToast("Category updated successfully!", "success");
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: categoryForm.name,
        color: categoryForm.color,
      };
      setCategories((prev) => [...prev, newCategory]);
      showToast("Category created successfully!", "success");
    }
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast("Category deleted successfully!", "success");
    }
  };

  // ─── Tax CRUD ───────────────────────────────────────────────────────────────

  const filteredTaxes = taxes.filter((t) =>
    t.name.toLowerCase().includes(taxSearch.toLowerCase()),
  );

  const openTaxModal = (tax?: Tax) => {
    if (tax) {
      setIsEditing(true);
      setEditingItem(tax);
      setTaxForm({ name: tax.name, rate: tax.rate });
    } else {
      setIsEditing(false);
      setEditingItem(null);
      setTaxForm({ name: "", rate: 0 });
    }
    setShowTaxModal(true);
  };

  const handleSaveTax = () => {
    if (!taxForm.name.trim()) {
      showToast("Please enter tax name", "info");
      return;
    }
    if (taxForm.rate <= 0 || taxForm.rate > 100) {
      showToast("Please enter a valid tax rate (1-100)", "info");
      return;
    }

    if (isEditing && editingItem) {
      setTaxes((prev) =>
        prev.map((t) =>
          t.id === editingItem.id
            ? { ...t, name: taxForm.name, rate: taxForm.rate }
            : t,
        ),
      );
      showToast("Tax updated successfully!", "success");
    } else {
      const newTax: Tax = {
        id: Date.now().toString(),
        name: taxForm.name,
        rate: taxForm.rate,
      };
      setTaxes((prev) => [...prev, newTax]);
      showToast("Tax created successfully!", "success");
    }
    setShowTaxModal(false);
  };

  const handleDeleteTax = (id: string) => {
    if (confirm("Are you sure you want to delete this tax?")) {
      setTaxes((prev) => prev.filter((t) => t.id !== id));
      showToast("Tax deleted successfully!", "success");
    }
  };

  // ─── Unit CRUD ──────────────────────────────────────────────────────────────

  const filteredUnits = units.filter((u) =>
    u.name.toLowerCase().includes(unitSearch.toLowerCase()),
  );

  const openUnitModal = (unit?: Unit) => {
    if (unit) {
      setIsEditing(true);
      setEditingItem(unit);
      setUnitForm({ name: unit.name });
    } else {
      setIsEditing(false);
      setEditingItem(null);
      setUnitForm({ name: "" });
    }
    setShowUnitModal(true);
  };

  const handleSaveUnit = () => {
    if (!unitForm.name.trim()) {
      showToast("Please enter unit name", "info");
      return;
    }

    if (isEditing && editingItem) {
      setUnits((prev) =>
        prev.map((u) =>
          u.id === editingItem.id ? { ...u, name: unitForm.name } : u,
        ),
      );
      showToast("Unit updated successfully!", "success");
    } else {
      const newUnit: Unit = {
        id: Date.now().toString(),
        name: unitForm.name,
      };
      setUnits((prev) => [...prev, newUnit]);
      showToast("Unit created successfully!", "success");
    }
    setShowUnitModal(false);
  };

  const handleDeleteUnit = (id: string) => {
    if (confirm("Are you sure you want to delete this unit?")) {
      setUnits((prev) => prev.filter((u) => u.id !== id));
      showToast("Unit deleted successfully!", "success");
    }
  };

  // ─── Render Functions ───────────────────────────────────────────────────────

  const renderCategoriesTab = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => openCategoryModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Category
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Color
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCategories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {category.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border border-gray-200"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-xs text-gray-500 uppercase">
                      {category.color}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openCategoryModal(category)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTaxesTab = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search taxes..."
            value={taxSearch}
            onChange={(e) => setTaxSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => openTaxModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Tax
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Tax Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Rate (%)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTaxes.map((tax) => (
              <tr key={tax.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {tax.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-gray-600">{tax.rate.toFixed(2)}%</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openTaxModal(tax)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTax(tax.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredTaxes.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  No taxes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUnitsTab = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search units..."
            value={unitSearch}
            onChange={(e) => setUnitSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => openUnitModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Unit
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Unit Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUnits.map((unit) => (
              <tr key={unit.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {unit.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openUnitModal(unit)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUnit(unit.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUnits.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  No units found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // MODALS
  // ═══════════════════════════════════════════════════════════════════════════

  // Category Modal
  const CategoryModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Category" : "Create Category"}
          </h2>
          <button
            onClick={() => setShowCategoryModal(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={categoryForm.name}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, name: e.target.value })
              }
              placeholder="Enter category name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setCategoryForm({ ...categoryForm, color })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    categoryForm.color === color
                      ? "border-gray-900 scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-100">
          <button
            onClick={() => setShowCategoryModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveCategory}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            {isEditing ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );

  // Tax Modal
  const TaxModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Tax" : "Create Tax"}
          </h2>
          <button
            onClick={() => setShowTaxModal(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={taxForm.name}
              onChange={(e) => setTaxForm({ ...taxForm, name: e.target.value })}
              placeholder="Enter tax name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rate (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={taxForm.rate || ""}
              onChange={(e) =>
                setTaxForm({
                  ...taxForm,
                  rate: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="Enter tax rate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-100">
          <button
            onClick={() => setShowTaxModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveTax}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            {isEditing ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );

  // Unit Modal
  const UnitModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Unit" : "Create Unit"}
          </h2>
          <button
            onClick={() => setShowUnitModal(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={unitForm.name}
              onChange={(e) =>
                setUnitForm({ ...unitForm, name: e.target.value })
              }
              placeholder="Enter unit name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-100">
          <button
            onClick={() => setShowUnitModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveUnit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            {isEditing ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN RENDER
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
            onClick={() => navigate("/items/product")}
            className="hover:text-gray-700"
          >
            Product & Service
          </button>
          <span>›</span>
          <button
            onClick={() => navigate("/items/system-setup")}
            className="hover:text-gray-700"
          >
            System Setup
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <h2 className="text-lg font-semibold text-gray-900">System Setup</h2>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("categories")}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "categories"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Category
            </div>
          </button>
          <button
            onClick={() => setActiveTab("taxes")}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "taxes"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4" />
              Taxes
            </div>
          </button>
          <button
            onClick={() => setActiveTab("units")}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "units"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Units
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        {activeTab === "categories" && renderCategoriesTab()}
        {activeTab === "taxes" && renderTaxesTab()}
        {activeTab === "units" && renderUnitsTab()}
      </div>

      {/* Modals */}
      {showCategoryModal && <CategoryModal />}
      {showTaxModal && <TaxModal />}
      {showUnitModal && <UnitModal />}
    </div>
  );
};
