import React, { useState } from "react";
import { showToast } from "../../utils/toast";
import {
  Search, Plus, Edit, Trash2, MoreVertical, Copy, Eye,
  Printer, Mail, X, Calendar, CheckCircle, Columns,
} from "lucide-react";

interface PaymentReceived {
  id: string;
  paymentNumber: string;
  customerName: string;
  customerSubtitle: string;
  status: "Draft" | "Approved" | "Cancelled";
  amount: number;
  paymentDate: string;
  paymentType: string;
  totalAmount: string;
  date: string;
  salesReceiptNumber: string;
  salesReceiptAmount: string;
  notes: string;
  internalNote: string;
}

const samplePayments: PaymentReceived[] = [
  {
    id: "1", paymentNumber: "#1111", customerName: "Spark Tech Agency", customerSubtitle: "Mahmudul Hasan",
    status: "Draft", amount: 5000, paymentDate: "Mar 10,2026", paymentType: "Master Card",
    totalAmount: "$56,4343", date: "23 Jul 24 PM", salesReceiptNumber: "#1111", salesReceiptAmount: "$56,4343",
    notes: "No Notes", internalNote: "Internal Note",
  },
  {
    id: "2", paymentNumber: "#1112", customerName: "Tech Corp", customerSubtitle: "John Doe",
    status: "Approved", amount: 2000, paymentDate: "Apr 15,2026", paymentType: "Visa",
    totalAmount: "$2000", date: "15 Apr 26 PM", salesReceiptNumber: "#1112", salesReceiptAmount: "$2000",
    notes: "", internalNote: "",
  },
];

export const PaymentReceived: React.FC = () => {
  const [payments, setPayments] = useState<PaymentReceived[]>(samplePayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentReceived>(samplePayments[0]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);
  const [formData, setFormData] = useState<PaymentReceived>(samplePayments[0]);

  const handleInputChange = (field: keyof PaymentReceived, value: any) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (isEditing) {
      setPayments((prev) => prev.map((p) => (p.id === formData.id ? formData : p)));
      setSelectedPayment(formData);
      showToast("Payment updated!", "success");
    } else {
      const newPayment = { ...formData, id: Date.now().toString() };
      setPayments((prev) => [...prev, newPayment]);
      setSelectedPayment(newPayment);
      showToast("Payment recorded!", "success");
    }
    setShowForm(false);
  };

  const handleEdit = () => { setFormData(selectedPayment); setIsEditing(true); setShowForm(true); setShowMobileList(false); };
  const handleCreate = () => { setFormData({ ...samplePayments[0], id: "", paymentNumber: "", customerName: "" }); setIsEditing(false); setShowForm(true); setShowMobileList(false); };
  const handleCancel = () => setShowForm(false);

  const filteredPayments = payments.filter((p) =>
    p.paymentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.customerName.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h2 className="text-lg font-semibold text-gray-900">{showForm ? (isEditing ? "Edit Payment" : "New Payment Received") : "Payment Received"}</h2>
            {!showForm && (<><h3 className="text-lg font-medium text-gray-700">{selectedPayment.customerName}</h3><span className="text-sm text-gray-500">{selectedPayment.customerSubtitle}</span></>)}
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
              <button onClick={() => showToast("Printing...", "info")} className="p-2 hover:bg-gray-100 rounded-md"><Printer className="w-5 h-5 text-gray-600" /></button>
              <button onClick={() => showToast("Email sent!", "success")} className="p-2 hover:bg-gray-100 rounded-md"><Mail className="w-5 h-5 text-gray-600" /></button>
              <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="p-2 hover:bg-gray-100 rounded-md"><MoreVertical className="w-5 h-5 text-gray-600" /></button>
              {showMoreMenu && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <button onClick={() => { const dup = { ...selectedPayment, id: Date.now().toString(), paymentNumber: `#${Date.now()}` }; setPayments(prev => [...prev, dup]); showToast("Duplicated!", "success"); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Copy className="w-4 h-4" /> Duplicate</button>
                  <div className="border-t border-gray-200 my-1" />
                  <button onClick={() => { setPayments(prev => prev.filter(p => p.id !== selectedPayment.id)); showToast("Moved to trash!", "info"); setShowMoreMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Trash</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2">
        <button onClick={() => setShowMobileList(!showMobileList)} className="flex items-center gap-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-md px-3 py-1.5">
          {showMobileList ? "← Back to Details" : "☰ View Payments"}
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex">
        <div className={`${showMobileList ? "flex" : "hidden"} lg:flex flex-col w-full lg:w-64 bg-white border-r border-gray-200`}>
          <div className="p-3 border-b border-gray-200">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search payments" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
          </div>
          <div className="p-3 border-b border-gray-200">
            <select className="w-full px-2 py-1 border border-gray-300 rounded text-gray-700 text-xs"><option>Customer: All</option></select>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredPayments.map((payment) => (
              <div key={payment.id} onClick={() => { setSelectedPayment(payment); setShowForm(false); setShowMobileList(false); }} className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${selectedPayment?.id === payment.id && !showForm ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                <div className="flex items-start justify-between mb-1">
                  <div className="text-sm font-medium text-gray-900">{payment.paymentNumber}</div>
                  <span className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(payment.status)}`}>{payment.status}</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">{payment.customerName} · {payment.paymentType}</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">${payment.amount.toLocaleString()}</span>
                  <span className="text-xs text-gray-500">{payment.date}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200"><button onClick={handleCreate} className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 mx-auto"><Plus className="w-6 h-6" /></button></div>
          <div className="p-4 border-t border-gray-200 text-center">
            <div className="text-xl font-semibold text-gray-900">${payments.reduce((s, p) => s + p.amount, 0).toLocaleString()}</div>
            <div className="text-xs text-gray-500">{payments.length} Payments</div>
          </div>
        </div>

        <div className={`${showMobileList ? "hidden" : "flex"} lg:flex flex-col flex-1 overflow-y-auto p-4 sm:p-6`}>
          {showForm ? (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Payment # <span className="text-red-500">*</span></label><input type="text" value={formData.paymentNumber} onChange={(e) => handleInputChange("paymentNumber", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Customer</label><input type="text" value={formData.customerName} onChange={(e) => handleInputChange("customerName", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Payment Date <span className="text-red-500">*</span></label><div className="relative"><input type="text" value={formData.paymentDate} onChange={(e) => handleInputChange("paymentDate", e.target.value)} placeholder="DD/MM/YYYY" className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /><Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /></div></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Payment Type <span className="text-red-500">*</span></label><select value={formData.paymentType} onChange={(e) => handleInputChange("paymentType", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"><option>Master Card</option><option>Visa</option><option>Cash</option><option>Bank Transfer</option></select></div>
              </div>
              <div className="border border-gray-200 rounded-md p-4 mb-6">
                <div className="text-sm text-gray-500 mb-4">Apply to Invoices</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount</label><input type="number" value={formData.amount} onChange={(e) => handleInputChange("amount", parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Sales Receipt #</label><input type="text" value={formData.salesReceiptNumber} onChange={(e) => handleInputChange("salesReceiptNumber", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
                </div>
              </div>
              <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea rows={3} value={formData.notes} onChange={(e) => handleInputChange("notes", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
              <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-1">Internal Note</label><textarea rows={3} value={formData.internalNote} onChange={(e) => handleInputChange("internalNote", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" /></div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button className="py-8 border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:border-gray-400 flex flex-col items-center justify-center gap-2"><Plus className="w-6 h-6" /><span className="text-sm">Upload Computer</span></button>
                  <button className="py-8 border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:border-gray-400 flex flex-col items-center justify-center gap-2"><Plus className="w-6 h-6" /><span className="text-sm">Upload Document</span></button>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-6 border-t border-gray-200">
                <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">Save Payment</button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 pb-4 border-b border-gray-200">
                <div><label className="text-xs text-gray-500 block mb-1">Payment #</label><p className="text-lg font-semibold text-gray-900">{selectedPayment.paymentNumber}</p><p className="text-sm text-gray-600">${selectedPayment.amount.toLocaleString()}</p></div>
                <div><label className="text-xs text-gray-500 block mb-1">Payment Date</label><p className="text-sm text-gray-900">{selectedPayment.paymentDate}</p></div>
                <div><label className="text-xs text-gray-500 block mb-1">Payment Type</label><p className="text-sm text-gray-900">{selectedPayment.paymentType}</p></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div><label className="text-xs text-gray-500 block mb-1">Customer</label><p className="text-sm text-gray-900">{selectedPayment.customerName}</p><p className="text-xs text-gray-500">{selectedPayment.customerSubtitle}</p></div>
                <div><label className="text-xs text-gray-500 block mb-1">Amount Received</label><p className="text-2xl font-bold text-green-600">${selectedPayment.amount.toLocaleString()}</p></div>
              </div>
              <div className="border border-gray-100 rounded-md p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div><div className="text-sm font-medium text-gray-900">Sales Receipt {selectedPayment.salesReceiptNumber}</div><div className="text-xs text-gray-500">Applied Amount: {selectedPayment.salesReceiptAmount}</div></div>
                  <div className="text-sm font-semibold text-gray-900">${selectedPayment.amount.toLocaleString()}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div><label className="text-xs text-gray-500 block mb-1">Notes</label><p className="text-sm text-gray-900">{selectedPayment.notes || "—"}</p></div>
                <div><label className="text-xs text-gray-500 block mb-1">Internal Note</label><p className="text-sm text-gray-900">{selectedPayment.internalNote || "—"}</p></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
