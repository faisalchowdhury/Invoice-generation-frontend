import React, { useState } from "react";
import { showToast } from "../../utils/toast";
import {
  Search, Plus, Edit, Trash2, MoreVertical, Copy, Archive, Columns, CheckCircle,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  unitType: string;
  buyPrice: number;
  sellPrice: number;
  currency: string;
  onHandStock: number;
  committedStock: number;
  availableForSale: number;
  description: string;
  amount: string;
  date: string;
}

const sampleProducts: Product[] = [
  { id: "1", name: "Fair Electronics", category: "Electronics", sku: "FE-001", unitType: "Box", buyPrice: 20, sellPrice: 35, currency: "$USD", onHandStock: 100, committedStock: 20, availableForSale: 80, description: "High-quality electronics", amount: "$5000", date: "23 4:25 PM" },
  { id: "2", name: "Office Chair", category: "Furniture", sku: "OC-001", unitType: "Piece", buyPrice: 150, sellPrice: 280, currency: "$USD", onHandStock: 30, committedStock: 5, availableForSale: 25, description: "Ergonomic office chair", amount: "$8400", date: "15 Jun 26" },
  { id: "3", name: "Notebook Pack", category: "Stationery", sku: "NP-001", unitType: "Pack", buyPrice: 5, sellPrice: 12, currency: "$USD", onHandStock: 500, committedStock: 50, availableForSale: 450, description: "Pack of 10 notebooks", amount: "$6000", date: "10 Jul 26" },
];

export const Product: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product>(sampleProducts[0]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "details">("overview");
  const [formData, setFormData] = useState<Product>(sampleProducts[0]);

  const handleInputChange = (field: keyof Product, value: any) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (isEditing) {
      setProducts((prev) => prev.map((p) => (p.id === formData.id ? formData : p)));
      setSelectedProduct(formData);
      showToast("Product updated!", "success");
    } else {
      const newProduct = { ...formData, id: Date.now().toString() };
      setProducts((prev) => [...prev, newProduct]);
      setSelectedProduct(newProduct);
      showToast("Product created!", "success");
    }
    setShowForm(false);
  };

  const handleEdit = () => { setFormData(selectedProduct); setIsEditing(true); setShowForm(true); setShowMobileList(false); };
  const handleCreate = () => { setFormData({ id: "", name: "", category: "", sku: "", unitType: "Piece", buyPrice: 0, sellPrice: 0, currency: "$USD", onHandStock: 0, committedStock: 0, availableForSale: 0, description: "", amount: "$0", date: "" }); setIsEditing(false); setShowForm(true); setShowMobileList(false); };
  const handleCancel = () => setShowForm(false);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-hidden flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-6"><button className="text-sm font-medium text-gray-900 border-b-2 border-blue-600 pb-2">Summary</button></div>
          <div className="flex items-center gap-3">
            <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white"><option>This Year</option><option>This Month</option></select>
            <button className="p-1.5 hover:bg-gray-100 rounded"><svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 10h18M3 16h18" /></svg></button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <h2 className="text-lg font-semibold text-gray-900">{showForm ? (isEditing ? "Edit Product" : "New Product") : "Products"}</h2>
            {!showForm && (<><h3 className="text-lg font-medium text-gray-700">{selectedProduct.name}</h3><span className="text-sm text-gray-500">{selectedProduct.category}</span></>)}
          </div>
          {showForm ? (
            <div className="flex items-center gap-2">
              <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">Save</button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2 relative">
              <button onClick={() => showToast("Added to favorites!", "success")} className="p-2 hover:bg-gray-100 rounded-md"><CheckCircle className="w-5 h-5 text-gray-600" /></button>
              <button onClick={() => showToast("Column settings coming soon", "info")} className="p-2 hover:bg-gray-100 rounded-md"><Columns className="w-5 h-5 text-gray-600" /></button>
              <button onClick={handleEdit} className="p-2 hover:bg-gray-100 rounded-md"><Edit className="w-5 h-5 text-gray-600" /></button>
              <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="p-2 hover:bg-gray-100 rounded-md"><MoreVertical className="w-5 h-5 text-gray-600" /></button>
              {showMoreMenu && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <button onClick={() => { const dup = { ...selectedProduct, id: Date.now().toString(), name: `${selectedProduct.name} (Copy)`, sku: `${selectedProduct.sku}-COPY` }; setProducts(prev => [...prev, dup]); showToast("Duplicated!", "success"); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Copy className="w-4 h-4" /> Duplicate</button>
                  <button onClick={() => { showToast("Product archived!", "info"); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Archive className="w-4 h-4" /> Archive</button>
                  <div className="border-t border-gray-200 my-1" />
                  <button onClick={() => { setProducts(prev => prev.filter(p => p.id !== selectedProduct.id)); if (products.length > 1) setSelectedProduct(products.find(p => p.id !== selectedProduct.id) || products[0]); showToast("Product deleted!", "info"); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2">
        <button onClick={() => setShowMobileList(!showMobileList)} className="flex items-center gap-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-md px-3 py-1.5">
          {showMobileList ? "← Back to Details" : "☰ View Products"}
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex">
        <div className={`${showMobileList ? "flex" : "hidden"} lg:flex flex-col w-full lg:w-64 bg-white border-r border-gray-200`}>
          <div className="p-3 border-b border-gray-200">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search products" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
          </div>
          <div className="p-3 border-b border-gray-200">
            <select className="w-full px-2 py-1 border border-gray-300 rounded text-gray-700 text-xs"><option>Category: All</option><option>Electronics</option><option>Furniture</option><option>Stationery</option></select>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredProducts.map((product) => (
              <div key={product.id} onClick={() => { setSelectedProduct(product); setShowForm(false); setShowMobileList(false); }} className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${selectedProduct?.id === product.id && !showForm ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 text-xs font-medium">{product.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.category} · SKU: {product.sku}</div>
                  </div>
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>Sell: ${product.sellPrice}</span>
                  <span>Stock: {product.availableForSale}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200"><button onClick={handleCreate} className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 mx-auto"><Plus className="w-6 h-6" /></button></div>
          <div className="p-4 border-t border-gray-200 text-center">
            <div className="text-xl font-semibold text-gray-900">{products.length}</div>
            <div className="text-xs text-gray-500">Products</div>
          </div>
        </div>

        <div className={`${showMobileList ? "hidden" : "flex"} lg:flex flex-col flex-1 overflow-y-auto p-4 sm:p-6`}>
          {showForm ? (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Product Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label><input type="text" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><input type="text" value={formData.category} onChange={(e) => handleInputChange("category", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">SKU</label><input type="text" value={formData.sku} onChange={(e) => handleInputChange("sku", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Unit Type</label><select value={formData.unitType} onChange={(e) => handleInputChange("unitType", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"><option>Piece</option><option>Box</option><option>Pack</option><option>Kg</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Buy Price</label><input type="number" value={formData.buyPrice} onChange={(e) => handleInputChange("buyPrice", parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Sell Price</label><input type="number" value={formData.sellPrice} onChange={(e) => handleInputChange("sellPrice", parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Currency</label><select value={formData.currency} onChange={(e) => handleInputChange("currency", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"><option>$USD</option><option>€EUR</option><option>£GBP</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Opening Stock</label><input type="number" value={formData.onHandStock} onChange={(e) => handleInputChange("onHandStock", parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea rows={3} value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                <button className="w-full py-8 border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:border-gray-400 flex flex-col items-center justify-center gap-2"><Plus className="w-6 h-6" /><span className="text-sm">Upload Image</span></button>
              </div>
              <div className="flex justify-end gap-2 pt-6 border-t border-gray-200">
                <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">Save Product</button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="border-b border-gray-200 px-6">
                <div className="flex gap-6">
                  {(["overview", "details"] as const).map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`}>{tab}</button>
                  ))}
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {activeTab === "overview" && (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 pb-4 border-b border-gray-200">
                      <div className="text-center"><div className="text-xs text-gray-500 mb-1">On Hand</div><div className="text-lg font-semibold text-gray-900">{selectedProduct.onHandStock}</div></div>
                      <div className="text-center"><div className="text-xs text-gray-500 mb-1">Committed</div><div className="text-lg font-semibold text-orange-600">{selectedProduct.committedStock}</div></div>
                      <div className="text-center"><div className="text-xs text-gray-500 mb-1">Available</div><div className="text-lg font-semibold text-green-600">{selectedProduct.availableForSale}</div></div>
                      <div className="text-center"><div className="text-xs text-gray-500 mb-1">Sell Price</div><div className="text-lg font-semibold text-blue-600">${selectedProduct.sellPrice}</div></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="border border-gray-100 rounded-md p-4"><div className="text-xs text-gray-500 mb-2">Buy Price</div><div className="text-xl font-bold text-gray-900">${selectedProduct.buyPrice}</div><div className="text-xs text-gray-500 mt-1">{selectedProduct.currency}</div></div>
                      <div className="border border-gray-100 rounded-md p-4"><div className="text-xs text-gray-500 mb-2">Sell Price</div><div className="text-xl font-bold text-blue-600">${selectedProduct.sellPrice}</div><div className="text-xs text-gray-500 mt-1">Margin: {Math.round(((selectedProduct.sellPrice - selectedProduct.buyPrice) / selectedProduct.sellPrice) * 100)}%</div></div>
                    </div>
                  </>
                )}
                {activeTab === "details" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div><label className="text-xs text-gray-500 block mb-1">Product Name</label><p className="text-sm text-gray-900">{selectedProduct.name}</p></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Category</label><p className="text-sm text-gray-900">{selectedProduct.category}</p></div>
                    <div><label className="text-xs text-gray-500 block mb-1">SKU</label><p className="text-sm text-gray-900">{selectedProduct.sku}</p></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Unit Type</label><p className="text-sm text-gray-900">{selectedProduct.unitType}</p></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Buy Price</label><p className="text-sm text-gray-900">${selectedProduct.buyPrice} {selectedProduct.currency}</p></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Sell Price</label><p className="text-sm text-gray-900">${selectedProduct.sellPrice} {selectedProduct.currency}</p></div>
                    <div><label className="text-xs text-gray-500 block mb-1">On Hand Stock</label><p className="text-sm text-gray-900">{selectedProduct.onHandStock} {selectedProduct.unitType}</p></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Available for Sale</label><p className="text-sm text-gray-900">{selectedProduct.availableForSale} {selectedProduct.unitType}</p></div>
                    <div className="sm:col-span-2"><label className="text-xs text-gray-500 block mb-1">Description</label><p className="text-sm text-gray-900">{selectedProduct.description || "—"}</p></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
