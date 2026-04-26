import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import {
  Search, Plus, Edit, Trash2, Upload, MoreVertical, Copy, Eye,
  Printer, Mail, MessageCircle, X, Calendar, CheckCircle, Send,
  Ban, Activity, Columns, FileText,
} from "lucide-react";

interface LineItem {
  srNo: number;
  name: string;
  quantity: number;
  rate: number;
  tax: number;
  discount: number;
  amount: number;
}

interface PurchaseOrder {
  id: string;
  number: string;
  vendor: string;
  vendorContact: string;
  status: "Draft" | "Approved" | "Cancelled";
  amount: number;
  date: string;
  deliveryDate: string;
  billAddress: string;
  shippingMethod: string;
  subTitle: string;
  po: string;
  items: LineItem[];
  notes: string;
  internalNotes: string;
  subTotal: number;
  shippingCost: number;
  salesTax: number;
  total: number;
}

const sampleOrders: PurchaseOrder[] = [
  {
    id: "1", number: "#1", vendor: "Spark Tech Agency", vendorContact: "Mahmudul Hasan",
    status: "Draft", amount: 5000, date: "24 Jul 24 PM", deliveryDate: "10 Aug 24",
    billAddress: "Santa, santa Bankok, 122 Bangladesh", shippingMethod: "Priority Shipping",
    subTitle: "fdffdfdf", po: "124",
    items: [
      { srNo: 1, name: "Electronics", quantity: 24, rate: 400, tax: 1, discount: -2, amount: 392 },
      { srNo: 2, name: "Electronics", quantity: 24, rate: 400, tax: 1, discount: -2, amount: 392 },
    ],
    notes: "", internalNotes: "", subTotal: 80, shippingCost: 3.2, salesTax: 10, total: 93.2,
  },
  {
    id: "2", number: "#2", vendor: "Tech Corp", vendorContact: "John Doe",
    status: "Approved", amount: 2000, date: "24 Jul 24 PM", deliveryDate: "15 Aug 24",
    billAddress: "123 Main St", shippingMethod: "Standard",
    subTitle: "Monthly Services", po: "125",
    items: [{ srNo: 1, name: "Consulting", quantity: 10, rate: 500, tax: 1, discount: 0, amount: 5000 }],
    notes: "", internalNotes: "", subTotal: 5000, shippingCost: 0, salesTax: 500, total: 5500,
  },
];

export const PurchaseOrder: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<PurchaseOrder[]>(sampleOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder>(sampleOrders[0]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);
  const [formData, setFormData] = useState<PurchaseOrder>(sampleOrders[0]);

  const handleInputChange = (field: keyof PurchaseOrder, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (isEditing) {
      setOrders((prev) => prev.map((o) => (o.id === formData.id ? formData : o)));
      setSelectedOrder(formData);
      showToast("Purchase order updated!", "success");
    } else {
      const newOrder = { ...formData, id: Date.now().toString() };
      setOrders((prev) => [...prev, newOrder]);
      setSelectedOrder(newOrder);
      showToast("Purchase order created!", "success");
    }
    setShowForm(false);
  };

  const handleEdit = () => { setFormData(selectedOrder); setIsEditing(true); setShowForm(true); setShowMobileList(false); };
  const handleCreate = () => { setFormData({ ...sampleOrders[0], id: "", number: "", vendor: "" }); setIsEditing(false); setShowForm(true); setShowMobileList(false); };
  const handleCancel = () => setShowForm(false);

  const filteredOrders = orders.filter((o) =>
    o.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft": return "bg-red-100 text-red-700 border-red-200";
      case "Approved": return "bg-green-100 text-green-700 border-green-200";
      case "Cancelled": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="flex-1 bg-[#FAFBFC] overflow-hidden flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-6">
            <button className="text-sm font-medium text-gray-900 border-b-2 border-blue-600 pb-2">Summary</button>
          </div>
          <div className="flex items-center gap-3">
            <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">
              <option>This Year</option><option>This Month</option><option>Last Month</option>
            </select>
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 10h18M3 16h18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <h2 className="text-lg font-semibold text-gray-900">{showForm ? (isEditing ? "Edit Purchase Order" : "New Purchase Order") : "Purchase Orders"}</h2>
            {!showForm && (<><h3 className="text-lg font-medium text-gray-700">{selectedOrder.vendor}</h3><span className="text-sm text-gray-500">{selectedOrder.vendorContact}</span></>)}
          </div>
          {showForm ? (
            <div className="flex items-center gap-2">
              <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">Cancel</button>
              <button onClick={() => { showToast("Saved as draft", "success"); setShowForm(false); }} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">Save as Draft</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">Save & Send</button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2 relative">
              <button onClick={() => showToast("Added to favorites!", "success")} className="p-2 hover:bg-gray-100 rounded-md"><CheckCircle className="w-5 h-5 text-gray-600" /></button>
              <button onClick={() => showToast("Column settings coming soon", "info")} className="p-2 hover:bg-gray-100 rounded-md"><Columns className="w-5 h-5 text-gray-600" /></button>
              <button onClick={handleEdit} className="p-2 hover:bg-gray-100 rounded-md"><Edit className="w-5 h-5 text-gray-600" /></button>
              <button onClick={() => setShowPreview(true)} className="p-2 hover:bg-gray-100 rounded-md"><Eye className="w-5 h-5 text-gray-600" /></button>
              <button onClick={() => setShowPreview(true)} className="p-2 hover:bg-gray-100 rounded-md"><Printer className="w-5 h-5 text-gray-600" /></button>
              <button onClick={() => showToast("Email sent!", "success")} className="p-2 hover:bg-gray-100 rounded-md"><Mail className="w-5 h-5 text-gray-600" /></button>
              <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="p-2 hover:bg-gray-100 rounded-md"><MoreVertical className="w-5 h-5 text-gray-600" /></button>
              {showMoreMenu && (
                <div className="absolute right-0 top-12 w-52 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <button onClick={() => { showToast("Opening WhatsApp...", "info"); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><MessageCircle className="w-4 h-4" /> WhatsApp</button>
                  <button onClick={() => { const dup = { ...selectedOrder, id: Date.now().toString(), number: `#${Date.now()}` }; setOrders(prev => [...prev, dup]); showToast("Order duplicated!", "success"); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Copy className="w-4 h-4" /> Duplicate</button>
                  <button onClick={() => { navigate("/purchase/bills"); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><FileText className="w-4 h-4" /> Convert to Bill</button>
                  <div className="border-t border-gray-200 my-1" />
                  <button onClick={() => { setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: "Approved" } : o)); setSelectedOrder(prev => ({ ...prev, status: "Approved" })); showToast("Marked as Approved!", "success"); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Send className="w-4 h-4" /> Mark as Approved</button>
                  <button onClick={() => { setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: "Cancelled" } : o)); setSelectedOrder(prev => ({ ...prev, status: "Cancelled" })); showToast("Marked as Cancelled!", "info"); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Ban className="w-4 h-4" /> Mark as Void</button>
                  <div className="border-t border-gray-200 my-1" />
                  <button onClick={() => { navigate("/reports"); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Activity className="w-4 h-4" /> Activity Log</button>
                  <div className="border-t border-gray-200 my-1" />
                  <button onClick={() => { setOrders(prev => prev.filter(o => o.id !== selectedOrder.id)); showToast("Order moved to trash!", "info"); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Trash</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2">
        <button onClick={() => setShowMobileList(!showMobileList)} className="flex items-center gap-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-md px-3 py-1.5">
          {showMobileList ? "← Back to Details" : "☰ View Orders"}
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex">
        <div className={`${showMobileList ? "flex" : "hidden"} lg:flex flex-col w-full lg:w-64 bg-white border-r border-gray-200`}>
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search orders" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
          </div>
          <div className="p-3 border-b border-gray-200">
            <div className="flex gap-2 text-xs">
              <select className="px-2 py-1 border border-gray-300 rounded text-gray-700 flex-1"><option>Status: All</option><option>Draft</option><option>Approved</option><option>Cancelled</option></select>
              <select className="px-2 py-1 border border-gray-300 rounded text-gray-700 flex-1"><option>Vendor: All</option></select>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredOrders.map((order) => (
              <div key={order.id} onClick={() => { setSelectedOrder(order); setShowForm(false); setShowMobileList(false); }} className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${selectedOrder?.id === order.id && !showForm ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                <div className="flex items-start justify-between mb-1">
                  <div className="text-sm font-medium text-gray-900">{order.number}</div>
                  <span className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(order.status)}`}>{order.status}</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">{order.vendor}</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">${order.amount.toLocaleString()}</span>
                  <span className="text-xs text-gray-500">{order.date}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <button onClick={handleCreate} className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 mx-auto"><Plus className="w-6 h-6" /></button>
          </div>
          <div className="p-4 border-t border-gray-200 text-center">
            <div className="text-xl font-semibold text-gray-900">${orders.reduce((s, o) => s + o.amount, 0).toLocaleString()}</div>
            <div className="text-xs text-gray-500">{orders.length} Orders</div>
          </div>
        </div>

        <div className={`${showMobileList ? "hidden" : "flex"} lg:flex flex-col flex-1 overflow-y-auto p-4 sm:p-6`}>
          {showForm ? (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label><input type="text" value={formData.vendor} onChange={(e) => handleInputChange("vendor", e.target.value)} placeholder="Vendor name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Ship To</label><input type="text" value={formData.billAddress} onChange={(e) => handleInputChange("billAddress", e.target.value)} placeholder="Ship to address" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">PO #</label><input type="text" value={formData.number} onChange={(e) => handleInputChange("number", e.target.value)} placeholder="Auto-generated" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Sub Title</label><input type="text" value={formData.subTitle} onChange={(e) => handleInputChange("subTitle", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Shipping Method</label><input type="text" value={formData.shippingMethod} onChange={(e) => handleInputChange("shippingMethod", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label><div className="relative"><input type="text" value={formData.date} onChange={(e) => handleInputChange("date", e.target.value)} placeholder="DD/MM/YYYY" className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /><Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /></div></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label><div className="relative"><input type="text" value={formData.deliveryDate} onChange={(e) => handleInputChange("deliveryDate", e.target.value)} placeholder="DD/MM/YYYY" className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /><Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /></div></div>
              </div>
              <div className="mb-6 overflow-x-auto">
                <table className="w-full text-sm min-w-[540px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Sr. No.</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Items</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Quantity</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Rate</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Tax</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Discount</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-3 py-3">01</td>
                      <td className="px-3 py-3"><div>Electronics</div><div className="text-xs text-gray-500">Description</div></td>
                      <td className="px-3 py-3">23</td><td className="px-3 py-3">$400</td>
                      <td className="px-3 py-3"><select className="border border-gray-300 rounded px-2 py-1 text-xs"><option>Tax</option></select></td>
                      <td className="px-3 py-3">2%</td>
                      <td className="px-3 py-3 flex items-center gap-2"><span>$392</span><button className="text-green-600"><Plus className="w-4 h-4" /></button><button className="text-red-600"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex gap-3 mb-6">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> Add Product</button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> Add Services</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label><textarea rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea rows={4} value={formData.notes} onChange={(e) => handleInputChange("notes", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Sub Total</span><span className="text-blue-600">${formData.subTotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Shipping</span><span className="text-blue-600">${formData.shippingCost.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Tax</span><span className="text-blue-600">${formData.salesTax.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm font-semibold border-t border-gray-200 pt-1"><span className="text-gray-900">Total</span><span className="text-blue-600">${formData.total.toFixed(2)}</span></div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label><textarea rows={3} value={formData.internalNotes} onChange={(e) => handleInputChange("internalNotes", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><button className="w-full py-8 border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:border-gray-400 flex flex-col items-center justify-center gap-2"><Plus className="w-6 h-6" /><span className="text-sm">Upload Computer</span></button></div>
              </div>
              <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-gray-200">
                <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">Cancel</button>
                <button onClick={() => { showToast("Saved as draft", "success"); setShowForm(false); }} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">Save as Draft</button>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">Save & Send</button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 pb-4 border-b border-gray-200">
                <div><label className="text-xs text-gray-500 block mb-1">PO #</label><p className="text-lg font-semibold text-gray-900">{selectedOrder.number}</p><p className="text-sm text-gray-600">${selectedOrder.amount}</p></div>
                <div><label className="text-xs text-gray-500 block mb-1">Order Date</label><p className="text-sm text-gray-900">{selectedOrder.date}</p></div>
                <div><label className="text-xs text-gray-500 block mb-1">Delivery Date</label><p className="text-sm text-gray-900">{selectedOrder.deliveryDate}</p></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div><label className="text-xs text-gray-500 block mb-1">Ship To</label><p className="text-sm text-gray-900">{selectedOrder.billAddress}</p></div>
                <div><label className="text-xs text-gray-500 block mb-1">Shipping Method</label><p className="text-sm text-gray-900">{selectedOrder.shippingMethod}</p></div>
                <div><label className="text-xs text-gray-500 block mb-1">Sub Title</label><p className="text-sm text-gray-900">{selectedOrder.subTitle}</p></div>
              </div>
              <div className="flex flex-col lg:flex-row gap-6 mb-6">
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-sm border-collapse min-w-[500px]">
                    <thead><tr className="border-b border-gray-200"><th className="px-2 py-2 text-left text-xs font-medium text-gray-600">Sr.No</th><th className="px-2 py-2 text-left text-xs font-medium text-gray-600">Items</th><th className="px-2 py-2 text-left text-xs font-medium text-gray-600">Rate</th><th className="px-2 py-2 text-left text-xs font-medium text-gray-600">Quantity</th><th className="px-2 py-2 text-left text-xs font-medium text-gray-600">Tax</th><th className="px-2 py-2 text-left text-xs font-medium text-gray-600">Discount</th><th className="px-2 py-2 text-left text-xs font-medium text-gray-600">Amount</th></tr></thead>
                    <tbody>{selectedOrder.items.map((item, idx) => (<tr key={idx} className="border-b border-gray-100"><td className="px-2 py-3">{item.srNo}</td><td className="px-2 py-3">{item.name}</td><td className="px-2 py-3">${item.rate.toFixed(2)}</td><td className="px-2 py-3">{item.quantity}</td><td className="px-2 py-3">{item.tax}</td><td className="px-2 py-3">{item.discount}%</td><td className="px-2 py-3">${item.amount.toFixed(2)}</td></tr>))}</tbody>
                  </table>
                </div>
                <div className="w-64 flex-shrink-0 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Sub Total</span><span className="text-blue-600">${selectedOrder.subTotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Shipping</span><span className="text-blue-600">${selectedOrder.shippingCost.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Tax</span><span className="text-blue-600">${selectedOrder.salesTax.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm font-semibold border-t border-gray-200 pt-2"><span className="text-gray-900">Total</span><span className="text-blue-600">${selectedOrder.total.toFixed(2)}</span></div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div><label className="text-xs text-gray-500 block mb-1">Notes</label><p className="text-sm text-gray-900">{selectedOrder.notes || "—"}</p></div>
                <div><label className="text-xs text-gray-500 block mb-1">Internal Notes</label><p className="text-sm text-gray-900">{selectedOrder.internalNotes || "—"}</p></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-gray-100 rounded-md"><X className="w-5 h-5 text-gray-600" /></button>
                <h2 className="text-lg font-semibold text-gray-900">Purchase Order {selectedOrder.number}</h2>
              </div>
              <button onClick={() => showToast("Sent!", "success")} className="p-2 hover:bg-gray-100 rounded-md"><Send className="w-5 h-5 text-gray-600" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
              <div className="bg-white shadow-lg mx-auto p-8" style={{ width: "595px", minHeight: "842px" }}>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">PURCHASE ORDER</h1>
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div><p className="font-semibold">{selectedOrder.vendor}</p><p>{selectedOrder.billAddress}</p></div>
                  <div><p>PO #: {selectedOrder.number}</p><p>Date: {selectedOrder.date}</p><p>Delivery: {selectedOrder.deliveryDate}</p></div>
                </div>
                <table className="w-full text-sm border-collapse mb-8">
                  <thead><tr className="bg-gray-800 text-white"><th className="text-left py-2 px-3 text-xs">Items</th><th className="text-right py-2 px-3 text-xs">Qty</th><th className="text-right py-2 px-3 text-xs">Rate</th><th className="text-right py-2 px-3 text-xs">Amount</th></tr></thead>
                  <tbody>{selectedOrder.items.map((item, idx) => (<tr key={idx} className="border-b border-gray-200"><td className="py-3 px-3">{item.name}</td><td className="py-3 px-3 text-right">{item.quantity}</td><td className="py-3 px-3 text-right">${item.rate.toFixed(2)}</td><td className="py-3 px-3 text-right">${item.amount.toFixed(2)}</td></tr>))}</tbody>
                </table>
                <div className="flex justify-end">
                  <div className="w-64 space-y-2 text-sm">
                    <div className="flex justify-between"><span>Sub Total</span><span>${selectedOrder.subTotal.toFixed(2)}</span></div>
                    <div className="flex justify-between border-t pt-2"><span className="font-bold">Total</span><span className="font-bold">${selectedOrder.total.toFixed(2)}</span></div>
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
