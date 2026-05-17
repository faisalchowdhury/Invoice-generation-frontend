import React, { useState } from "react";
import { PdfPrintSettingsModal } from "../components/modals/PdfPrintSettingsModal";
import { PaymentMethodsModal } from "../components/modals/PaymentMethodsModal";
import { TermsConditionsModal } from "../components/modals/TermsConditionsModal";
import { TaxesModal } from "../components/modals/TaxesModal";
import { BankDetailsModal } from "../components/modals/BankDetailsModal";
import { NotesModal } from "../components/modals/NotesModal";
import { SignatureModal } from "../components/modals/SignatureModal";
import { TeamModal } from "../components/modals/TeamModal";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  RefreshCw,
  ChevronDown,
  Settings,
  FileText,
  CreditCard,
  FileCheck,
  Percent,
  Mail,
  Building2,
  StickyNote,
  PenLine,
  Users,
} from "lucide-react";

interface Company {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  mobile: string;
  fax: string;
  website: string;
  billingAddress: string;
  regNo: string;
  vat: string;
  paymentTermsSales: string;
  paymentTermsPurchase: string;
  startFiscalYear: string;
  isOwner: boolean;
}

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
      checked ? "bg-blue-600" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

interface AccordionProps {
  title: string;
  children?: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3 px-1 text-sm text-gray-700 hover:text-gray-900"
      >
        <span>{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && children && (
        <div className="pb-3 pl-2 pr-1 space-y-3 text-sm text-gray-600">
          {children}
        </div>
      )}
    </div>
  );
};

/* ── App Settings Modal ─────────────────────────────────────────── */

const SIDEBAR_ITEMS = [
  "General",
  "Modules",
  "Currency & Format",
  "Printer",
  "Whatsapp",
  "Invoice",
  "Proforma Invoice",
  "Sales Receipt",
  "Estimate",
  "Delivery Challan",
  "Purchase Order",
  "Bill",
  "Credit Note",
  "Debit Note",
  "Expense",
  "Product",
  "Service",
  "Time Log",
];

interface AppSettingsModalProps {
  initialTab?: string;
  onClose: () => void;
}

const AppSettingsModal: React.FC<AppSettingsModalProps> = ({
  initialTab = "Currency & Format",
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  /* General */
  const [chat, setChat] = useState(true);
  const [publicUrl, setPublicUrl] = useState(true);
  const [appearance, setAppearance] = useState("Auto");
  const [defaultMail, setDefaultMail] = useState("Moon Mail Server");

  /* Modules */
  const [modules, setModules] = useState({
    Invoice: true,
    "Proforma Invoice": true,
    Estimate: true,
    "Delivery Challan": true,
    Bill: true,
    "Credit Note": true,
    "Debit Note": true,
    Expense: true,
    "Sales Receipt": true,
    "Packing Slip": true,
    "Delivery Note": true,
    "Time Log": true,
    "Purchase Order": true,
    Project: true,
  });

  /* Currency & Format */
  const [currency, setCurrency] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState(true);
  const [currencyCode, setCurrencyCode] = useState(false);
  const [multiCurrency, setMultiCurrency] = useState(true);
  const [decimalPlaces, setDecimalPlaces] = useState("2");
  const [dateFormat, setDateFormat] = useState("English (United States)");
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("(GMT-7:00) America/Los_Angeles");

  /* Printer */
  const [printMode, setPrintMode] = useState("Normal");

  /* Whatsapp */
  const [whatsapp, setWhatsapp] = useState(true);
  const [sendVia, setSendVia] = useState("Moon Invoice");

  /* Expense */
  const [roundOff, setRoundOff] = useState(false);
  const [paymentType, setPaymentType] = useState(true);

  /* Product */
  const [sac, setSac] = useState(true);

  const today = new Date(2026, 3, 28); // April 28, 2026
  const datePreviewShort = `${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}/${today.getFullYear()}`;
  const datePreviewMed = today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const datePreviewLong = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const renderContent = () => {
    switch (activeTab) {
      case "General":
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Chat</span>
              <Toggle checked={chat} onChange={setChat} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Create Public URL in Email</span>
              <Toggle checked={publicUrl} onChange={setPublicUrl} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Appearance</span>
              <select
                value={appearance}
                onChange={(e) => setAppearance(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[140px]"
              >
                <option>Auto</option>
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Default Mail</span>
              <select
                value={defaultMail}
                onChange={(e) => setDefaultMail(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[160px]"
              >
                <option>Moon Mail Server</option>
                <option>Custom SMTP</option>
              </select>
            </div>
          </div>
        );

      case "Modules":
        return (
          <div className="space-y-4">
            {Object.entries(modules).map(([name, val]) => (
              <div key={name} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{name}</span>
                <Toggle
                  checked={val}
                  onChange={(v) => setModules((m) => ({ ...m, [name]: v }))}
                />
              </div>
            ))}
          </div>
        );

      case "Currency & Format":
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Currency</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[160px]"
              >
                <option value=""></option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="BDT">BDT - Bangladeshi Taka</option>
                <option value="INR">INR - Indian Rupee</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Currency Symbol</span>
              <Toggle checked={currencySymbol} onChange={setCurrencySymbol} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Currency Code</span>
              <Toggle checked={currencyCode} onChange={setCurrencyCode} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                Multi Currency Display{" "}
                <span className="text-blue-600 cursor-pointer hover:underline text-xs ml-1">
                  Exchange Rates
                </span>
              </span>
              <Toggle checked={multiCurrency} onChange={setMultiCurrency} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Decimal Places</span>
              <select
                value={decimalPlaces}
                onChange={(e) => setDecimalPlaces(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[80px]"
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Date/Number Format</span>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[190px]"
              >
                <option>English (United States)</option>
                <option>English (United Kingdom)</option>
                <option>French</option>
                <option>German</option>
                <option>Spanish</option>
                <option>Arabic</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Language</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[140px]"
              >
                <option>English</option>
                <option>French</option>
                <option>German</option>
                <option>Spanish</option>
                <option>Arabic</option>
                <option>Bengali</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Timezone</span>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[230px]"
              >
                <option>(GMT-12:00) International Date Line West</option>
                <option>(GMT-8:00) Pacific Time (US & Canada)</option>
                <option>(GMT-7:00) America/Los_Angeles</option>
                <option>(GMT-6:00) Central Time (US & Canada)</option>
                <option>(GMT-5:00) Eastern Time (US & Canada)</option>
                <option>(GMT+0:00) UTC</option>
                <option>(GMT+1:00) London</option>
                <option>(GMT+2:00) Paris</option>
                <option>(GMT+5:30) Kolkata</option>
                <option>(GMT+6:00) Dhaka</option>
              </select>
            </div>
            {/* Date preview */}
            <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
              <div>
                {datePreviewShort} | {datePreviewMed} | {datePreviewLong}
              </div>
              <div>First Day Of Week - Sunday</div>
            </div>
          </div>
        );

      case "Printer":
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Print Mode</span>
              <select
                value={printMode}
                onChange={(e) => setPrintMode(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[120px]"
              >
                <option>Normal</option>
                <option>Compact</option>
                <option>Wide</option>
              </select>
            </div>
          </div>
        );

      case "Whatsapp":
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">WhatsApp</span>
              <Toggle checked={whatsapp} onChange={setWhatsapp} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Send Via</span>
              <select
                value={sendVia}
                onChange={(e) => setSendVia(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[140px]"
              >
                <option>Moon Invoice</option>
                <option>WhatsApp Business API</option>
              </select>
            </div>
            <Accordion title="Template" />
          </div>
        );

      case "Invoice":
      case "Proforma Invoice":
      case "Sales Receipt":
      case "Estimate":
      case "Delivery Challan":
      case "Purchase Order":
      case "Bill":
      case "Credit Note":
      case "Debit Note":
        return (
          <div>
            <Accordion title="General" />
            <Accordion title="Columns" />
            <Accordion title="Summary" />
            <Accordion title="Print & Email" />
          </div>
        );

      case "Expense":
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Round Off</span>
              <Toggle checked={roundOff} onChange={setRoundOff} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Payment Type</span>
              <Toggle checked={paymentType} onChange={setPaymentType} />
            </div>
          </div>
        );

      case "Product":
        return (
          <div>
            <Accordion title="General" />
            <Accordion title="Stock" />
          </div>
        );

      case "Service":
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">SAC</span>
              <Toggle checked={sac} onChange={setSac} />
            </div>
          </div>
        );

      case "Time Log":
        return (
          <div>
            <Accordion title="Columns" />
            <Accordion title="Summary" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-900">App Settings</h2>
          <div className="flex items-center gap-3">
            <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-sm text-gray-600 hover:text-gray-900 px-1"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-44 flex-shrink-0 border-r border-gray-200 overflow-y-auto py-2">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  activeTab === item
                    ? "bg-blue-600 text-white font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Right Content */}
          <div className="flex-1 overflow-y-auto p-5">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

/* ── Bottom Setting Cards ───────────────────────────────────────── */

interface SettingCard {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  tab: string;
}

const SETTING_CARDS: SettingCard[] = [
  {
    icon: <Settings className="w-5 h-5 text-white" />,
    title: "Currency & Format",
    tab: "Currency & Format",
  },
  {
    icon: <FileText className="w-5 h-5 text-white" />,
    title: "PDF & Print Settings",
    subtitle: "Standard",
    tab: "Printer",
  },
  {
    icon: <CreditCard className="w-5 h-5 text-white" />,
    title: "Payment Methods",
    tab: "General",
  },
  {
    icon: <FileCheck className="w-5 h-5 text-white" />,
    title: "Terms & Conditions",
    tab: "General",
  },
  {
    icon: <Percent className="w-5 h-5 text-white" />,
    title: "Taxes",
    tab: "General",
  },
  {
    icon: <Mail className="w-5 h-5 text-white" />,
    title: "Email Templates",
    subtitle: "Dear <customer> <no...",
    tab: "General",
  },
  {
    icon: <Building2 className="w-5 h-5 text-white" />,
    title: "Bank Details",
    tab: "General",
  },
  {
    icon: <StickyNote className="w-5 h-5 text-white" />,
    title: "Notes",
    tab: "General",
  },
  {
    icon: <PenLine className="w-5 h-5 text-white" />,
    title: "Signature",
    tab: "General",
  },
  {
    icon: <Users className="w-5 h-5 text-white" />,
    title: "Team",
    subtitle: "1 Member",
    tab: "General",
  },
];

/* ── Main Companies Page ───────────────────────────────────────── */

export const Companies: React.FC = () => {
  const [showMobileList, setShowMobileList] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "1",
      businessName: "info",
      email: "info@inovoic.com",
      phone: "",
      mobile: "",
      fax: "",
      website: "",
      billingAddress: "Bangladesh",
      regNo: "",
      vat: "",
      paymentTermsSales: "",
      paymentTermsPurchase: "",
      startFiscalYear: "January",
      isOwner: true,
    },
    {
      id: "2",
      businessName: "info",
      email: "info@inovoic.com",
      phone: "",
      mobile: "",
      fax: "",
      website: "",
      billingAddress: "Bangladesh",
      regNo: "",
      vat: "",
      paymentTermsSales: "",
      paymentTermsPurchase: "",
      startFiscalYear: "January",
      isOwner: true,
    },
  ]);

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(companies[0]);
  const [activeTab, setActiveTab] = useState<"info" | "add">("info");
  const [isEditing, setIsEditing] = useState(false);
  const [settingsModal, setSettingsModal] = useState<{ open: boolean; tab: string }>({
    open: false,
    tab: "Currency & Format",
  });
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showTaxesModal, setShowTaxesModal] = useState(false);
  const [showBankDetailsModal, setShowBankDetailsModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);

  const emptyForm: Company = {
    id: "",
    businessName: "",
    email: "",
    phone: "",
    mobile: "",
    fax: "",
    website: "",
    billingAddress: "",
    regNo: "",
    vat: "",
    paymentTermsSales: "",
    paymentTermsPurchase: "",
    startFiscalYear: "January",
    isOwner: false,
  };

  const [formData, setFormData] = useState<Company>(emptyForm);

  const handleAddCompany = () => {
    setActiveTab("add");
    setIsEditing(false);
    setFormData(emptyForm);
  };

  const handleSaveCompany = () => {
    if (formData.id) {
      setCompanies(companies.map((c) => (c.id === formData.id ? formData : c)));
      setSelectedCompany(formData);
    } else {
      const newCompany = { ...formData, id: Date.now().toString() };
      setCompanies([...companies, newCompany]);
      setSelectedCompany(newCompany);
    }
    setActiveTab("info");
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (selectedCompany) {
      setFormData(selectedCompany);
      setActiveTab("add");
      setIsEditing(true);
    }
  };

  const handleDelete = () => {
    if (selectedCompany) {
      const remaining = companies.filter((c) => c.id !== selectedCompany.id);
      setCompanies(remaining);
      setSelectedCompany(remaining[0] ?? null);
    }
  };

  const handleCancel = () => {
    setActiveTab("info");
    setIsEditing(false);
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setActiveTab("info");
    setShowMobileList(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FAFBFC] overflow-hidden">
      {/* App Settings Modal */}
      {settingsModal.open && (
        <AppSettingsModal
          initialTab={settingsModal.tab}
          onClose={() => setSettingsModal({ open: false, tab: "Currency & Format" })}
        />
      )}

      {/* PDF & Print Settings Modal */}
      {showPdfModal && (
        <PdfPrintSettingsModal onClose={() => setShowPdfModal(false)} />
      )}

      {/* Payment Methods Modal */}
      {showPaymentModal && (
        <PaymentMethodsModal onClose={() => setShowPaymentModal(false)} />
      )}

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <TermsConditionsModal onClose={() => setShowTermsModal(false)} />
      )}

      {/* Taxes Modal */}
      {showTaxesModal && (
        <TaxesModal onClose={() => setShowTaxesModal(false)} />
      )}

      {/* Bank Details Modal */}
      {showBankDetailsModal && (
        <BankDetailsModal onClose={() => setShowBankDetailsModal(false)} />
      )}

      {/* Notes Modal */}
      {showNotesModal && (
        <NotesModal onClose={() => setShowNotesModal(false)} />
      )}

      {/* Signature Modal */}
      {showSignatureModal && (
        <SignatureModal onClose={() => setShowSignatureModal(false)} />
      )}

      {/* Team Modal */}
      {showTeamModal && (
        <TeamModal
          onClose={() => setShowTeamModal(false)}
          companyEmail={selectedCompany?.email}
        />
      )}

      {/* Mobile Toggle */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-2">
        <button
          onClick={() => setShowMobileList(!showMobileList)}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-md px-3 py-1.5"
        >
          {showMobileList ? "← Back to Details" : "☰ View Companies"}
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* LEFT PANEL */}
        <div
          className={`${showMobileList ? "flex" : "hidden"} lg:flex flex-col w-full lg:w-72 bg-white border-r border-gray-200`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Companies</h2>
            <button
              onClick={handleAddCompany}
              className="p-1 hover:bg-gray-100 rounded-md text-gray-500"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          {/* Sort */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="relative inline-block">
              <button className="flex items-center gap-1 text-xs text-gray-600 border border-gray-300 rounded-full px-3 py-1.5 bg-white hover:bg-gray-50">
                Sort by | Name
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {companies.map((company) => (
              <div
                key={company.id}
                onClick={() => handleCompanySelect(company)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedCompany?.id === company.id ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <div className="w-9 h-9 bg-blue-600 rounded flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {company.businessName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {company.businessName}
                  </div>
                </div>
                {company.isOwner && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                    Owner
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Add Button */}
          <div className="p-4 flex justify-center border-t border-gray-100">
            <button
              onClick={handleAddCompany}
              className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          className={`${showMobileList ? "hidden" : "flex"} lg:flex flex-col flex-1 overflow-y-auto bg-white`}
        >
          {activeTab === "info" && selectedCompany ? (
            <>
              {/* Info Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-base font-semibold text-gray-900">
                  {selectedCompany.businessName}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDelete}
                    className="p-2 hover:bg-gray-100 rounded-md text-gray-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleEdit}
                    className="p-2 hover:bg-gray-100 rounded-md text-gray-500"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Fields */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Business Name</p>
                    <p className="text-sm text-gray-900">{selectedCompany.businessName}</p>
                    <div className="border-b border-gray-200 mt-2" />
                  </div>
                  <div className="flex justify-end">
                    <div className="w-14 h-14 bg-blue-600 rounded flex items-center justify-center text-white font-semibold">
                      {selectedCompany.businessName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <a href={`mailto:${selectedCompany.email}`} className="text-sm text-blue-600 hover:underline">
                    {selectedCompany.email || <span className="text-gray-400">—</span>}
                  </a>
                  <div className="border-b border-gray-200 mt-2" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="text-sm text-gray-900">{selectedCompany.phone || <span className="text-gray-400">—</span>}</p>
                    <div className="border-b border-gray-200 mt-2" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Mobile</p>
                    <p className="text-sm text-gray-900">{selectedCompany.mobile || <span className="text-gray-400">—</span>}</p>
                    <div className="border-b border-gray-200 mt-2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Fax</p>
                    <p className="text-sm text-gray-900">{selectedCompany.fax || <span className="text-gray-400">—</span>}</p>
                    <div className="border-b border-gray-200 mt-2" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Website</p>
                    <p className="text-sm text-gray-900">{selectedCompany.website || <span className="text-gray-400">—</span>}</p>
                    <div className="border-b border-gray-200 mt-2" />
                  </div>
                </div>

                {/* Address Section */}
                <div className="pt-2">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Address</h3>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Billing Address</p>
                    <p className="text-sm text-gray-900 whitespace-pre-line">
                      {selectedCompany.billingAddress || <span className="text-gray-400">—</span>}
                    </p>
                    <div className="border-b border-gray-200 mt-2" />
                  </div>
                </div>

                {/* Settings Section */}
                <div className="pt-2">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Settings</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Reg No</p>
                      <p className="text-sm text-gray-900">{selectedCompany.regNo || <span className="text-gray-400">—</span>}</p>
                      <div className="border-b border-gray-200 mt-2" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">VAT</p>
                      <p className="text-sm text-gray-900">{selectedCompany.vat || <span className="text-gray-400">—</span>}</p>
                      <div className="border-b border-gray-200 mt-2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Payment Terms (Sales)</p>
                      <p className="text-sm text-gray-900">{selectedCompany.paymentTermsSales || <span className="text-gray-400">—</span>}</p>
                      <div className="border-b border-gray-200 mt-2" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Payment Terms (Purchases)</p>
                      <p className="text-sm text-gray-900">{selectedCompany.paymentTermsPurchase || <span className="text-gray-400">—</span>}</p>
                      <div className="border-b border-gray-200 mt-2" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-1">Start Fiscal Year</p>
                    <p className="text-sm text-gray-900">{selectedCompany.startFiscalYear}</p>
                    <div className="border-b border-gray-200 mt-2" />
                  </div>
                </div>

                {/* Setting Cards Grid */}
                <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {SETTING_CARDS.map((card) => (
                    <button
                      key={card.title}
                      onClick={() => {
                        if (card.title === "PDF & Print Settings") setShowPdfModal(true);
                        else if (card.title === "Payment Methods") setShowPaymentModal(true);
                        else if (card.title === "Terms & Conditions") setShowTermsModal(true);
                        else if (card.title === "Taxes") setShowTaxesModal(true);
                        else if (card.title === "Bank Details") setShowBankDetailsModal(true);
                        else if (card.title === "Notes") setShowNotesModal(true);
                        else if (card.title === "Signature") setShowSignatureModal(true);
                        else if (card.title === "Team") setShowTeamModal(true);
                        else setSettingsModal({ open: true, tab: card.tab });
                      }}
                      className="flex flex-col items-start p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all text-left"
                    >
                      <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                        {card.icon}
                      </div>
                      <p className="text-xs font-medium text-gray-800 leading-tight">
                        {card.title}
                      </p>
                      {card.subtitle && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate w-full">
                          {card.subtitle}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Add / Edit Form */
            <>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-base font-semibold text-gray-900">
                  {isEditing ? "Edit Company" : "Add Company"}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancel}
                    className="text-sm text-gray-600 hover:text-gray-900 px-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCompany}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end items-start">
                    <div className="w-14 h-14 bg-blue-600 rounded flex items-center justify-center text-white font-semibold">
                      {formData.businessName.charAt(0).toUpperCase() || "?"}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Mobile</label>
                    <input
                      type="text"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Fax</label>
                    <input
                      type="text"
                      value={formData.fax}
                      onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Website</label>
                    <input
                      type="text"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Address</h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Billing Address
                    </label>
                    <textarea
                      rows={3}
                      value={formData.billingAddress}
                      onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Settings</h3>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Reg No</label>
                      <input
                        type="text"
                        value={formData.regNo}
                        onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">VAT</label>
                      <input
                        type="text"
                        value={formData.vat}
                        onChange={(e) => setFormData({ ...formData, vat: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5 mt-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Payment Terms (Sales)
                      </label>
                      <input
                        type="text"
                        value={formData.paymentTermsSales}
                        onChange={(e) => setFormData({ ...formData, paymentTermsSales: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Payment Terms (Purchases)
                      </label>
                      <input
                        type="text"
                        value={formData.paymentTermsPurchase}
                        onChange={(e) => setFormData({ ...formData, paymentTermsPurchase: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Start Fiscal Year
                    </label>
                    <select
                      value={formData.startFiscalYear}
                      onChange={(e) => setFormData({ ...formData, startFiscalYear: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[
                        "January","February","March","April","May","June",
                        "July","August","September","October","November","December",
                      ].map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
