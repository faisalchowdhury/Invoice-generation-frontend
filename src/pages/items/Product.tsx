/**
 * File: src/pages/Products.tsx
 * Complete Products page with all features
 */

import React, { useState } from "react";
import {
  Search,
  MoreVertical,
  Plus,
  Edit2,
  X,
  FileText,
  Package,
  Edit,
  Trash2,
  Archive,
  Copy,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  unitType: string;
  quantity: number;
  buyPrice: number;
  buyPriceTax: number;
  sellPrice: number;
  sellPriceTax: number;
  currency: string;
  expiryDate: string;
  onHandStock: number;
  committedStock: number;
  availableForSale: number;
  toBeInvoiced: number;
  toBeBilled: number;
  description: string;
  image?: string;
  amount: string;
  date: string;
  contact: string;
}

export const Product: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Fair Electronics",
      category: "Fair Electronics",
      sku: "",
      unitType: "Box",
      quantity: 10,
      buyPrice: 20,
      buyPriceTax: 20,
      sellPrice: 20,
      sellPriceTax: 20,
      currency: "$USD",
      expiryDate: "25 May,2026",
      onHandStock: 14575.0,
      committedStock: -12.0,
      availableForSale: 15000.0,
      toBeInvoiced: -12.0,
      toBeBilled: 0.0,
      description: "",
      amount: "$5000",
      date: "23 4:25 PM",
      contact: "hdjfj",
    },
    {
      id: "2",
      name: "Ritat",
      category: "Electronics",
      sku: "",
      unitType: "Box",
      quantity: 10,
      buyPrice: 20,
      buyPriceTax: 20,
      sellPrice: 20,
      sellPriceTax: 20,
      currency: "$USD",
      expiryDate: "",
      onHandStock: 0,
      committedStock: 0,
      availableForSale: 0,
      toBeInvoiced: 0,
      toBeBilled: 0,
      description: "",
      amount: "$50",
      date: "24 4:25",
      contact: "hdjfj",
    },
    {
      id: "3",
      name: "Ritat",
      category: "Electronics",
      sku: "",
      unitType: "Box",
      quantity: 10,
      buyPrice: 20,
      buyPriceTax: 20,
      sellPrice: 20,
      sellPriceTax: 20,
      currency: "$USD",
      expiryDate: "",
      onHandStock: 0,
      committedStock: 0,
      availableForSale: 0,
      toBeInvoiced: 0,
      toBeBilled: 0,
      description: "",
      amount: "$50",
      date: "24 4:25",
      contact: "hdjfj",
    },
    {
      id: "4",
      name: "Ritat",
      category: "Electronics",
      sku: "",
      unitType: "Box",
      quantity: 10,
      buyPrice: 20,
      buyPriceTax: 20,
      sellPrice: 20,
      sellPriceTax: 20,
      currency: "$USD",
      expiryDate: "",
      onHandStock: 0,
      committedStock: 0,
      availableForSale: 0,
      toBeInvoiced: 0,
      toBeBilled: 0,
      description: "",
      amount: "$50",
      date: "24 4:25",
      contact: "hdjfj",
    },
    {
      id: "5",
      name: "Ritat",
      category: "Electronics",
      sku: "",
      unitType: "Box",
      quantity: 10,
      buyPrice: 20,
      buyPriceTax: 20,
      sellPrice: 20,
      sellPriceTax: 20,
      currency: "$USD",
      expiryDate: "",
      onHandStock: 0,
      committedStock: 0,
      availableForSale: 0,
      toBeInvoiced: 0,
      toBeBilled: 0,
      description: "",
      amount: "$50",
      date: "24 4:25",
      contact: "hdjfj",
    },
  ]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Empty state
  if (products.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-[#FAFBFC]">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-16 h-16 text-blue-600"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
              <path d="M16 14h-2v2h-4v-2H8v-2h2v-2h4v2h2v2z" opacity="0.6" />
              <path
                d="M18 18l-1.5-1.5c-.4-.4-.4-1 0-1.4l1.5-1.5c.4-.4 1-.4 1.4 0l1.5 1.5c.4.4.4 1 0 1.4l-1.5 1.5c-.4.4-1 .4-1.4 0z"
                transform="translate(-2, -2) scale(0.8)"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Add New Product
          </h2>
          <p className="text-gray-600 mb-6">
            Ensuring accuracy and transparency in your
            <br />
            invoicing process – making adjustments easy and
            <br />
            understandable
          </p>
          <button
            onClick={() => setShowEditModal(true)}
            className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New product
          </button>
        </div>
      </div>
    );
  }

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, productId) => {
      const product = products.find((p) => p.id === productId);
      return (
        total + (product ? parseFloat(product.amount.replace(/[$,]/g, "")) : 0)
      );
    }, 0);
  };

  return (
    <div className="h-full flex bg-[#FAFBFC]">
      {/* Left Panel - Products List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Products</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert("Search")}
                className="p-1.5 hover:bg-gray-100 rounded"
              >
                <Search className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setShowEditModal(true)}
                className="p-1.5 hover:bg-gray-100 rounded"
              >
                <Edit2 className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-1.5 hover:bg-gray-100 rounded relative"
              >
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="text-gray-600">Sort by</span>
            <select className="px-2 py-1 border border-gray-200 rounded text-gray-700">
              <option>Date</option>
              <option>Name</option>
            </select>
            <select className="px-2 py-1 border border-gray-200 rounded text-gray-700">
              <option>Status</option>
              <option>All</option>
            </select>
            <select className="px-2 py-1 border border-gray-200 rounded text-gray-700">
              <option>Customer / All</option>
            </select>
            <button className="px-2 py-1 border border-gray-200 rounded text-gray-700">
              Date Range
            </button>
          </div>
        </div>

        {/* Products List */}
        <div className="flex-1 overflow-y-auto">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => !isSelectionMode && setSelectedProduct(product)}
              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedProduct?.id === product.id && !isSelectionMode
                  ? "bg-blue-50"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {isSelectionMode && (
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                    className="mt-1"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {product.name}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {product.amount}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">#{product.id}</span>
                    <span className="text-xs text-gray-400">
                      {product.date}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {product.contact}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {isSelectionMode && selectedProducts.length > 0 ? (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="text-center mb-2">
              <div className="text-lg font-semibold text-gray-900">
                {selectedProducts.length} Product selected
              </div>
              <div className="text-sm text-gray-600">
                Total{" "}
                <span className="font-medium">
                  ${calculateTotal().toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-t border-gray-200 flex justify-center">
            <button
              onClick={() => setShowEditModal(true)}
              className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        )}

        {products.length > 0 && (
          <div className="p-4 border-t border-gray-200 text-center">
            <div className="text-lg font-semibold text-gray-900">$80.00</div>
            <div className="text-xs text-gray-500">1 Proforma Invoices</div>
          </div>
        )}
      </div>

      {/* Right Panel - Product Details */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedProduct ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Summary</span>
                <select className="px-3 py-1 border border-gray-200 rounded text-sm">
                  <option>This Year</option>
                  <option>This Month</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedProduct.name}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="p-2 hover:bg-gray-100 rounded relative"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                    {showMoreMenu && (
                      <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                          Add Variation
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                          Duplicate
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                          Archive
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50">
                          Delete
                        </button>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                {/* Details Section */}
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">
                    Details
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <div className="text-sm text-gray-600 mb-1">
                          Product Name
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {selectedProduct.name}
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="text-sm text-gray-600 mb-1">
                          Category
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {selectedProduct.category}
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="text-sm text-gray-600 mb-1">SKU</div>
                        <div className="text-sm font-medium text-gray-900">
                          {selectedProduct.sku || "-"}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            Unit Type
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {selectedProduct.unitType}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            Quantity
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {selectedProduct.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                        {selectedProduct.image ? (
                          <img
                            src={selectedProduct.image}
                            alt={selectedProduct.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing & Tax Section */}
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">
                    Pricing & Tax
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            Buy Price
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {selectedProduct.buyPrice}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            Buy Price Tax
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {selectedProduct.buyPriceTax}
                          </div>
                        </div>
                      </div>
                      <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            Sell Price
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {selectedProduct.sellPrice}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            Sell Price Tax
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {selectedProduct.sellPriceTax}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            Currency
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {selectedProduct.currency}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            Expiry Date
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {selectedProduct.expiryDate || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stock Status Section */}
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">
                    Stock Status
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            On hand Stock
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {selectedProduct.onHandStock.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            Committed Stock
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {selectedProduct.committedStock.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            Available for Sale
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {selectedProduct.availableForSale.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            To Be Invoiced
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {selectedProduct.toBeInvoiced.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">
                          To be Billed
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {selectedProduct.toBeBilled.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-4">
                    Description
                  </h3>
                  <div className="text-sm text-gray-600">
                    {selectedProduct.description || "Description"}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a product to view details</p>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedProduct ? "Edit Product" : "Product Name"}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert("Product saved!");
                    setShowEditModal(false);
                  }}
                  className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
                >
                  Save
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-3 gap-6">
                {/* Left Column - Form Fields */}
                <div className="col-span-2 space-y-6">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      placeholder="Electronics"
                      defaultValue={selectedProduct?.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Details Section */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          SKU
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          HSN
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">
                            Variant Sizes
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">
                            Variant Type
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" />
                          <span className="text-sm text-gray-700">
                            Inventory
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Quantity
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Quantity
                        </label>
                        <input
                          type="text"
                          placeholder="20"
                          defaultValue={selectedProduct?.quantity}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Unit Type
                        </label>
                        <input
                          type="text"
                          placeholder="20"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Tax */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Pricing & Tax
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Buy Price
                        </label>
                        <input
                          type="text"
                          placeholder="$120"
                          defaultValue={`$${selectedProduct?.buyPrice}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Buy Price Tax
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                          <option>-</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Sell Price
                        </label>
                        <input
                          type="text"
                          placeholder="$400"
                          defaultValue={`$${selectedProduct?.sellPrice}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">
                          Sell Price Tax
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                          <option>-</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Notes
                    </h3>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Description
                    </h3>
                    <textarea
                      placeholder="Description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Right Column - Image & Stock */}
                <div className="space-y-6">
                  {/* Product Image */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Product Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="w-24 h-24 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                        <Package className="w-12 h-12 text-gray-400" />
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-700">
                        Upload Image
                      </button>
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-xs text-gray-600">
                          Buy Price Tax
                        </div>
                        <div className="text-xs font-medium text-gray-900">
                          {selectedProduct?.buyPriceTax || "20"}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-xs text-gray-600">
                          Sell Price Tax
                        </div>
                        <div className="text-xs font-medium text-gray-900">
                          {selectedProduct?.sellPriceTax || "20"}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-xs text-gray-600">
                          Committed Stock
                        </div>
                        <div className="text-xs font-medium text-gray-900">
                          {selectedProduct?.committedStock.toFixed(2) ||
                            "-12.00"}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-xs text-gray-600">
                          To Be Invoiced
                        </div>
                        <div className="text-xs font-medium text-gray-900">
                          {selectedProduct?.toBeInvoiced.toFixed(2) || "-12.00"}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-xs text-gray-600">
                          To be Billed
                        </div>
                        <div className="text-xs font-medium text-gray-900">
                          {selectedProduct?.toBeBilled.toFixed(2) || "0.00"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
