import React, { useState } from "react";
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Eye,
  Layers,
  LayoutTemplate,
  Download,
  Printer,
  Mail,
  Check,
  Edit2,
} from "lucide-react";

/* ── helpers ─────────────────────────────────────────────────────── */

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}
const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none ${checked ? "bg-blue-600" : "bg-gray-300"}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}
    />
  </button>
);

interface RowSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}
const RowSelect: React.FC<RowSelectProps> = ({ label, value, options, onChange }) => (
  <div className="flex items-center justify-between gap-2">
    <span className="text-sm text-gray-700 flex-1">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[130px]"
    >
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  </div>
);

interface RowToggleProps { label: string; checked: boolean; onChange: (v: boolean) => void; }
const RowToggle: React.FC<RowToggleProps> = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-700">{label}</span>
    <Toggle checked={checked} onChange={onChange} />
  </div>
);

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}
const AccordionSection: React.FC<AccordionSectionProps> = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3 text-sm font-medium text-gray-800 hover:text-gray-900"
      >
        <span>{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="pb-4 space-y-3">{children}</div>}
    </div>
  );
};

/* ── Color swatch ─────────────────────────────────────────────────── */
const ColorSwatch: React.FC<{ label: string; color: string; onChange: (v: string) => void }> = ({ label, color, onChange }) => (
  <div className="flex items-center gap-2">
    <label className="relative cursor-pointer">
      <div
        className="w-6 h-6 rounded border border-gray-400 cursor-pointer"
        style={{ backgroundColor: color }}
      />
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
      />
    </label>
    <span className="text-sm text-gray-700">{label}</span>
  </div>
);

/* ── Document Types ───────────────────────────────────────────────── */
const DOC_TYPES = [
  "All", "Invoice", "Sales Receipt", "Proforma Invoice", "Estimate",
  "Delivery Challan", "Bill", "Purchase Order", "Credit Note",
  "Payment Received", "Payment Made", "Debit Note", "Statement",
  "Packing Slip", "Delivery Note",
];

const TEMPLATES = ["Standard", "Letter Head", "Without Head", "Spread Sheet"];

/* ── Invoice Preview ──────────────────────────────────────────────── */
const InvoicePreview: React.FC = () => (
  <div className="bg-white border border-gray-300 rounded text-xs p-4 min-h-full" style={{ fontFamily: "Arial, sans-serif" }}>
    <h2 className="text-center font-bold text-base mb-3 tracking-wide">INVOICE</h2>
    <div className="flex justify-between mb-3">
      <div>
        <div className="font-bold text-sm">info</div>
        <div className="text-gray-600">Bangladesh</div>
        <div className="text-blue-600">info@inovoic.com</div>
      </div>
      <table className="text-xs border-collapse border border-gray-400" style={{ fontSize: "9px" }}>
        <tbody>
          {[["Invoice #", "MTPL001619"], ["P.O. #", "852"], ["Date", "Feb 9, 2021"], ["Due Date", "Feb 9, 2021"], ["Total", "BDT648.53"], ["Outstanding", "$98.52"]].map(([k, v]) => (
            <tr key={k}>
              <td className="border border-gray-400 px-1 py-0.5 font-medium bg-gray-50">{k}</td>
              <td className="border border-gray-400 px-1 py-0.5">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="text-right mb-2">
      <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">Pay Now</span>
    </div>
    <div className="flex gap-8 mb-3" style={{ fontSize: "9px" }}>
      <div>
        <div className="font-medium text-gray-800">Invoice To:</div>
        <div className="text-blue-600">Organization</div>
        <div className="text-blue-600">Email:jully@moontechnolabs.com</div>
        <div className="text-blue-600">Mobile: 7412589633</div>
        <div className="text-blue-600">Business 8523699</div>
        <div className="text-blue-600">Home No: 2501</div>
        <div className="text-blue-600">Fax: KT12030</div>
        <div>Reg. No: REG 001</div>
        <div>VAT: UT147852</div>
      </div>
      <div>
        <div className="font-medium text-gray-800">Ship To:</div>
        <div>A 101</div>
        <div>Tirupati Complex</div>
        <div>Ahmedabaad Gujarat 258741</div>
        <div>India</div>
        <div className="mt-1 font-medium">Shipping Method:</div>
        <div>Standard Ground</div>
      </div>
    </div>
    <div className="text-center text-gray-500 mb-2" style={{ fontSize: "9px" }}>Moon Invoice - Easy Invoicing</div>
    <table className="w-full border-collapse border border-gray-400" style={{ fontSize: "9px" }}>
      <thead>
        <tr className="bg-gray-100">
          {["Sr. No.", "Products", "HSN", "Quantity", "Unit Price", "Discount", "GST", "Amount"].map(h => (
            <th key={h} className="border border-gray-400 px-1 py-1 text-left font-medium">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-gray-400 px-1 py-1">1.</td>
          <td className="border border-gray-400 px-1 py-1">
            <div>Moon Invoice Product</div>
            <div className="text-gray-500">PR01</div>
            <div className="text-gray-400" style={{ fontSize: "8px" }}>Create FREE unlimited invoices for freelancers, small business owners, and contractors for 7 days.</div>
          </td>
          <td className="border border-gray-400 px-1 py-1">HSN0001</td>
          <td className="border border-gray-400 px-1 py-1">1.000</td>
          <td className="border border-gray-400 px-1 py-1">BDT150.0</td>
          <td className="border border-gray-400 px-1 py-1">BDT5.00</td>
          <td className="border border-gray-400 px-1 py-1">BDT7.50</td>
          <td className="border border-gray-400 px-1 py-1">BDT145.00</td>
        </tr>
      </tbody>
    </table>
    <div className="mt-3 text-right space-y-0.5" style={{ fontSize: "9px" }}>
      <div className="flex justify-end gap-8"><span>Sub Total</span><span>BDT448.00</span></div>
      <div className="flex justify-end gap-8"><span>Shipping Cost</span><span>BDT100.00</span></div>
      <div className="flex justify-end gap-8 font-bold"><span>Total</span><span>BDT617.60</span></div>
      <div className="flex justify-end gap-8"><span>Return Order</span><span>BDT1,800.00</span></div>
      <div className="flex justify-end gap-8 font-bold border-t border-gray-400 pt-0.5"><span>Amount Due</span><span>BDT417.60</span></div>
    </div>
  </div>
);

/* ── Select Template Modal ────────────────────────────────────────── */
interface SelectTemplateModalProps {
  selected: string;
  onApply: (t: string) => void;
  onClose: () => void;
}
const SelectTemplateModal: React.FC<SelectTemplateModalProps> = ({ selected, onApply, onClose }) => {
  const [local, setLocal] = useState(selected);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">Select template</h3>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-sm text-gray-600 hover:text-gray-900">Cancel</button>
            <button
              onClick={() => { onApply(local); onClose(); }}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-4 gap-4">
            {TEMPLATES.map((t) => (
              <div
                key={t}
                onClick={() => setLocal(t)}
                className={`cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${local === t ? "border-blue-500" : "border-gray-200 hover:border-gray-400"}`}
              >
                {/* Template thumbnail */}
                <div className="bg-gray-50 p-2 h-52 flex flex-col gap-1 text-gray-400" style={{ fontSize: "5px" }}>
                  {t === "Standard" && (
                    <>
                      <div className="h-2 bg-gray-200 rounded w-1/2 mx-auto" />
                      <div className="flex gap-1 mt-1">
                        <div className="flex-1 space-y-0.5">
                          <div className="h-1 bg-gray-300 rounded w-3/4" />
                          <div className="h-1 bg-gray-200 rounded w-1/2" />
                        </div>
                        <div className="w-12 space-y-0.5">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-1 bg-gray-200 rounded" />
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 bg-gray-100 rounded mt-1" />
                      <div className="h-8 bg-gray-200 rounded mt-1" />
                    </>
                  )}
                  {t === "Letter Head" && (
                    <>
                      <div className="h-4 bg-blue-100 rounded" />
                      <div className="h-1 bg-gray-300 rounded w-1/2 mx-auto" />
                      <div className="flex gap-1 mt-1">
                        <div className="flex-1 space-y-0.5">
                          <div className="h-1 bg-gray-300 rounded w-3/4" />
                          <div className="h-1 bg-gray-200 rounded w-1/2" />
                        </div>
                        <div className="w-12 space-y-0.5">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-1 bg-gray-200 rounded" />
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 bg-gray-100 rounded mt-1" />
                    </>
                  )}
                  {t === "Without Head" && (
                    <>
                      <div className="h-1 bg-gray-300 rounded w-1/2 mx-auto" />
                      <div className="flex gap-1 mt-1">
                        <div className="flex-1 space-y-0.5">
                          <div className="h-1 bg-gray-300 rounded w-3/4" />
                        </div>
                        <div className="w-12 space-y-0.5">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-1 bg-gray-200 rounded" />
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 bg-gray-100 rounded mt-1" />
                      <div className="h-8 bg-gray-200 rounded mt-1" />
                    </>
                  )}
                  {t === "Spread Sheet" && (
                    <>
                      <div className="h-1 bg-gray-300 rounded w-1/3 mx-auto" />
                      <div className="mt-1 space-y-0.5">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="flex gap-0.5">
                            {[...Array(5)].map((_, j) => (
                              <div key={j} className="flex-1 h-1 bg-gray-200 rounded" />
                            ))}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="text-center text-sm font-medium text-gray-800 py-2 border-t border-gray-100">
                  {t}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Preview Modal ────────────────────────────────────────────────── */
const PreviewModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const [printCopy, setPrintCopy] = useState("Double Copy");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">Preview</h3>
          <div className="flex items-center gap-3 relative">
            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><Download className="w-4 h-4" /></button>
            <div className="relative">
              <button
                onClick={() => setShowPrintOptions(!showPrintOptions)}
                className="p-1.5 hover:bg-gray-100 rounded text-gray-500"
              >
                <Printer className="w-4 h-4" />
              </button>
              {showPrintOptions && (
                <div className="absolute right-0 top-8 bg-white rounded-xl shadow-2xl border border-gray-200 w-72 z-10 p-4">
                  <div className="space-y-3">
                    {[
                      { value: "Single Copy", desc: "An original copy will be printed." },
                      { value: "Double Copy", desc: "A supplier copy and a recipient copy will be printed." },
                      { value: "Triple Copy", desc: "A supplier copy a transporter copy, and a recipient copy will be printed." },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="printCopy"
                          value={opt.value}
                          checked={printCopy === opt.value}
                          onChange={() => setPrintCopy(opt.value)}
                          className="mt-0.5 accent-blue-600"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-800">{opt.value}</div>
                          <div className="text-xs text-gray-500">{opt.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <button className="mt-4 w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-md hover:bg-blue-700">
                    Print
                  </button>
                </div>
              )}
            </div>
            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><Mail className="w-4 h-4" /></button>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><X className="w-4 h-4" /></button>
          </div>
        </div>
        {/* Preview content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <div className="max-w-2xl mx-auto">
            <InvoicePreview />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main PDF & Print Settings Modal ────────────────────────────── */
interface PdfPrintSettingsModalProps {
  onClose: () => void;
}

export const PdfPrintSettingsModal: React.FC<PdfPrintSettingsModalProps> = ({ onClose }) => {
  const [selectedDoc, setSelectedDoc] = useState("All");
  const [printMode, setPrintMode] = useState("Normal Print");
  const [selectedTemplate, setSelectedTemplate] = useState("Standard");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  /* ── Style ── */
  const [textColor, setTextColor] = useState("#000000");
  const [borderColor, setBorderColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("#cccccc");
  const [fillTextColor, setFillTextColor] = useState("#000000");
  const [font, setFont] = useState("Arial");
  const [fontSize, setFontSize] = useState("Medium");
  const [letterSize, setLetterSize] = useState("US Paper");
  const [fullPage, setFullPage] = useState("Yes");
  const [horizontalLines, setHorizontalLines] = useState("Show");
  const [verticalLines, setVerticalLines] = useState("Hide");
  const [scaling, setScaling] = useState("Aspect To Fit");
  const [horizontal, setHorizontal] = useState("Center");
  const [vertical, setVertical] = useState("Center");
  const [margin, setMargin] = useState("30,50,40,40");
  const [outerBorder, setOuterBorder] = useState("Show");
  const [compactMode, setCompactMode] = useState(false);

  /* ── Columns ── */
  const [serialNo, setSerialNo] = useState(true);
  const [lineItemsImage, setLineItemsImage] = useState(false);
  const [variantSize, setVariantSize] = useState("With Product");
  const [variantType, setVariantType] = useState("With Product");
  const [sku, setSku] = useState(true);
  const [sac, setSac] = useState(true);
  const [hsn, setHsn] = useState(true);
  const [quantity, setQuantity] = useState("Show for Both");
  const [price, setPrice] = useState(true);
  const [discount, setDiscount] = useState(true);
  const [tax, setTax] = useState("Individual");
  const [lineItemTaxFormat, setLineItemTaxFormat] = useState("Show as Amount");
  const [itemDisplayOrder, setItemDisplayOrder] = useState("Products First");
  const [notesCol, setNotesCol] = useState("Dark");
  const [lineTotal, setLineTotal] = useState(true);
  const [showPriceWithTax, setShowPriceWithTax] = useState("Default");
  const [lineDescFullWidth, setLineDescFullWidth] = useState(true);

  /* ── Header ── */
  const [titleAlignment, setTitleAlignment] = useState("Center");
  const [subTitleAlignment, setSubTitleAlignment] = useState("Center");
  const [subTitle, setSubTitle] = useState(true);
  const [logoSize, setLogoSize] = useState("Medium");
  const [dateFormat, setDateFormat] = useState("Medium");
  const [logo, setLogo] = useState(true);
  const [header, setHeader] = useState(true);
  const [statusWatermark, setStatusWatermark] = useState(true);
  const [numberHash, setNumberHash] = useState(true);
  const [poNo, setPoNo] = useState(true);
  const [dueDate, setDueDate] = useState(true);
  const [totalOutstanding, setTotalOutstanding] = useState(true);
  const [paidAmount, setPaidAmount] = useState(true);
  const [qrCodeAlignment, setQrCodeAlignment] = useState("Center");
  const [documentCopyLabel, setDocumentCopyLabel] = useState(false);
  const [totalAmount, setTotalAmount] = useState(true);
  const [generatedBy, setGeneratedBy] = useState(true);
  const [supplyType, setSupplyType] = useState(true);
  const [generatedDate, setGeneratedDate] = useState(true);
  const [cancelledDate, setCancelledDate] = useState(true);
  const [validTill, setValidTill] = useState(true);

  /* ── Company ── */
  const [compRegNo, setCompRegNo] = useState(true);
  const [regNoVatAlignBelow, setRegNoVatAlignBelow] = useState("Name");
  const [compVat, setCompVat] = useState(true);
  const [compName, setCompName] = useState(true);
  const [compCountry, setCompCountry] = useState(true);
  const [compAddress, setCompAddress] = useState(true);
  const [compPhone, setCompPhone] = useState(true);
  const [compMobile, setCompMobile] = useState(true);
  const [compFax, setCompFax] = useState(true);
  const [compEmail, setCompEmail] = useState(true);
  const [compWebsite, setCompWebsite] = useState(true);

  /* ── Contact ── */
  const [contactVat, setContactVat] = useState(true);
  const [contactRegNo, setContactRegNo] = useState(true);
  const [contactRegNoVatAlignBelow, setContactRegNoVatAlignBelow] = useState("Address");
  const [homePhone, setHomePhone] = useState(true);
  const [businessPhone, setBusinessPhone] = useState(true);
  const [contactEmail, setContactEmail] = useState(true);
  const [emailBelowContact, setEmailBelowContact] = useState("Name");
  const [contactMobile, setContactMobile] = useState(true);
  const [contactFax, setContactFax] = useState(true);
  const [firstLastName, setFirstLastName] = useState(false);
  const [mobileBelowContact, setMobileBelowContact] = useState("Name");
  const [addressAlignment, setAddressAlignment] = useState("Left");
  const [billingAddressAlignment, setBillingAddressAlignment] = useState("Left");
  const [shippingAddressAlignment, setShippingAddressAlignment] = useState("Right");

  /* ── Summary ── */
  const [totalQuantity, setTotalQuantity] = useState("Hidden");
  const [amountUnused, setAmountUnused] = useState(true);
  const [subTotal, setSubTotal] = useState(true);
  const [summaryDiscount, setSummaryDiscount] = useState(true);
  const [inlineDiscount, setInlineDiscount] = useState(true);
  const [shippingCost, setShippingCost] = useState(true);
  const [shippingMethod, setShippingMethod] = useState(true);
  const [total, setTotal] = useState(true);
  const [appliedCreditNotes, setAppliedCreditNotes] = useState("Hide");
  const [amountDue, setAmountDue] = useState(true);
  const [amountPaid, setAmountPaid] = useState(true);
  const [amountUsed, setAmountUsed] = useState(true);
  const [summaryTax, setSummaryTax] = useState("Individual");
  const [taxPercentValue, setTaxPercentValue] = useState(true);
  const [taxableAmount, setTaxableAmount] = useState(true);
  const [totalInWords, setTotalInWords] = useState(false);
  const [hsnSacSummary, setHsnSacSummary] = useState(true);
  const [returnOrder, setReturnOrder] = useState(true);

  /* ── Notes & Terms ── */
  const [notesEnabled, setNotesEnabled] = useState(true);
  const [notesTitle, setNotesTitle] = useState(true);
  const [notesFontSize, setNotesFontSize] = useState("Medium");
  const [bankDetails, setBankDetails] = useState(true);
  const [bankDetailsTitle, setBankDetailsTitle] = useState(true);
  const [fullWidth, setFullWidth] = useState(false);
  const [termsConditions, setTermsConditions] = useState(true);
  const [termsConditionsTitle, setTermsConditionsTitle] = useState(true);

  /* ── Signature ── */
  const [companySign, setCompanySign] = useState("Company");
  const [contactSign, setContactSign] = useState(true);
  const [companySigAlignment, setCompanySigAlignment] = useState("Left");
  const [contactSigAlignment, setContactSigAlignment] = useState("Right");
  const [signatureSize, setSignatureSize] = useState("Small");

  /* ── Footer ── */
  const [createdHyperlink, setCreatedHyperlink] = useState(true);
  const [showTemplateForPages, setShowTemplateForPages] = useState("First");
  const [pageNumberAlignment, setPageNumberAlignment] = useState("Right");
  const [pageNumber, setPageNumber] = useState(false);

  /* ── Payment ── */
  const [paymentHistory, setPaymentHistory] = useState(true);
  const [payNowButtonAlignment, setPayNowButtonAlignment] = useState("Up");
  const [paymentMethodsAlignment, setPaymentMethodsAlignment] = useState("Below");
  const [paymentMethodsShow, setPaymentMethodsShow] = useState("Show");
  const [paymentNote, setPaymentNote] = useState(false);
  const [paymentHash, setPaymentHash] = useState(true);

  return (
    <>
      {showTemplateModal && (
        <SelectTemplateModal
          selected={selectedTemplate}
          onApply={setSelectedTemplate}
          onClose={() => setShowTemplateModal(false)}
        />
      )}
      {showPreview && <PreviewModal onClose={() => setShowPreview(false)} />}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl mx-4 flex flex-col" style={{ maxHeight: "92vh" }}>

          {/* ── Modal Header ── */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-base font-semibold text-gray-900">PDF &amp; Print Settings</h2>
            <div className="flex items-center gap-3">
              <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500">
                <Search className="w-4 h-4" />
              </button>
              <button onClick={onClose} className="text-sm text-gray-600 hover:text-gray-900 px-1">Cancel</button>
              <button onClick={onClose} className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                Save
              </button>
            </div>
          </div>

          {/* ── Sub Header (All + Normal Print) ── */}
          <div className="flex items-center justify-between px-5 py-2 border-b border-gray-100 bg-gray-50 flex-shrink-0">
            <div className="relative">
              <select
                value={selectedDoc === "All" ? "All" : selectedDoc}
                onChange={(e) => setSelectedDoc(e.target.value)}
                className="text-sm border border-gray-300 rounded-md pl-3 pr-7 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
              >
                {DOC_TYPES.map((d) => <option key={d}>{d}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={printMode}
                onChange={(e) => setPrintMode(e.target.value)}
                className="text-sm border border-gray-300 rounded-md pl-3 pr-7 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
              >
                <option>Normal Print</option>
                <option>Thermal Print</option>
              </select>
              <ChevronDown className="absolute right-2 top-2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* ── Body ── */}
          <div className="flex flex-1 overflow-hidden">

            {/* Left: Document Type List */}
            <div className="w-44 flex-shrink-0 border-r border-gray-200 overflow-y-auto py-1">
              {DOC_TYPES.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDoc(d)}
                  className={`w-full flex items-center justify-between text-left px-4 py-2 text-sm transition-colors ${selectedDoc === d ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <span>{d}</span>
                  {selectedDoc === d && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>

            {/* Middle: Template Preview */}
            <div className="w-64 flex-shrink-0 border-r border-gray-200 flex flex-col">
              <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
                <div className="bg-white rounded border border-gray-200 overflow-hidden" style={{ transform: "scale(0.65)", transformOrigin: "top left", width: "154%" }}>
                  <InvoicePreview />
                </div>
              </div>
              {/* Bottom Toolbar */}
              <div className="flex items-center justify-around border-t border-gray-200 py-2 px-2 bg-white flex-shrink-0">
                <button className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-gray-900 px-1">
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-xs">Reset</span>
                </button>
                <button
                  onClick={() => setShowPreview(true)}
                  className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-gray-900 px-1"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-xs">Preview</span>
                </button>
                <button className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-gray-900 px-1">
                  <Layers className="w-4 h-4" />
                  <span className="text-xs">Default</span>
                </button>
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-gray-900 px-1"
                >
                  <LayoutTemplate className="w-4 h-4" />
                  <span className="text-xs">Standard</span>
                </button>
              </div>
            </div>

            {/* Right: Settings Panel */}
            <div className="flex-1 overflow-y-auto p-4 space-y-0">

              {/* Style */}
              <AccordionSection title="Style" defaultOpen={true}>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <ColorSwatch label="Text Color" color={textColor} onChange={setTextColor} />
                  <ColorSwatch label="Border Color" color={borderColor} onChange={setBorderColor} />
                  <ColorSwatch label="Fill Color" color={fillColor} onChange={setFillColor} />
                  <ColorSwatch label="Fill Text Color" color={fillTextColor} onChange={setFillTextColor} />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Font</label>
                    <select value={font} onChange={(e) => setFont(e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none">
                      {["Arial", "Times New Roman", "Helvetica", "Georgia", "Verdana"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Font Size</label>
                    <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none">
                      {["Small", "Medium", "Large"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Letter Size</label>
                  <select value={letterSize} onChange={(e) => setLetterSize(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none">
                    {["US Paper", "A4", "A5", "Letter", "Legal"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Full Page</label>
                  <select value={fullPage} onChange={(e) => setFullPage(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none">
                    {["Yes", "No"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Horizontal Lines</label>
                  <select value={horizontalLines} onChange={(e) => setHorizontalLines(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none">
                    {["Show", "Hide"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Vertical Lines</label>
                  <select value={verticalLines} onChange={(e) => setVerticalLines(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none">
                    {["Hide", "Show"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Scaling</label>
                  <select value={scaling} onChange={(e) => setScaling(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none">
                    {["Aspect To Fit", "Stretch To Fit", "None"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Horizontal</label>
                  <select value={horizontal} onChange={(e) => setHorizontal(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none">
                    {["Center", "Left", "Right"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Vertical</label>
                  <select value={vertical} onChange={(e) => setVertical(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none">
                    {["Center", "Top", "Bottom"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Margin</label>
                  <div className="flex items-center gap-2">
                    <input value={margin} onChange={(e) => setMargin(e.target.value)}
                      className="flex-1 text-sm border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <button className="text-gray-400 hover:text-gray-600"><Edit2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Outer Border</label>
                  <select value={outerBorder} onChange={(e) => setOuterBorder(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none">
                    {["Show", "Hide"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <RowToggle label="Compact Mode" checked={compactMode} onChange={setCompactMode} />
              </AccordionSection>

              {/* Columns */}
              <AccordionSection title="Columns">
                <RowToggle label="Serial #" checked={serialNo} onChange={setSerialNo} />
                <RowToggle label="Line Items Image" checked={lineItemsImage} onChange={setLineItemsImage} />
                <RowSelect label="Variant Size" value={variantSize} options={["With Product", "Separate Column", "Hidden"]} onChange={setVariantSize} />
                <RowSelect label="Variant Type" value={variantType} options={["With Product", "Separate Column", "Hidden"]} onChange={setVariantType} />
                <RowToggle label="SKU" checked={sku} onChange={setSku} />
                <RowToggle label="SAC" checked={sac} onChange={setSac} />
                <RowToggle label="HSN" checked={hsn} onChange={setHsn} />
                <RowSelect label="Quantity" value={quantity} options={["Show for Both", "Show for Products", "Show for Services", "Hidden"]} onChange={setQuantity} />
                <RowToggle label="Price" checked={price} onChange={setPrice} />
                <RowToggle label="Discount" checked={discount} onChange={setDiscount} />
                <RowSelect label="Tax" value={tax} options={["Individual", "Combined", "Hidden"]} onChange={setTax} />
                <RowSelect label="Line Item Tax Format" value={lineItemTaxFormat} options={["Show as Amount", "Show as Percent", "Show Both"]} onChange={setLineItemTaxFormat} />
                <RowSelect label="Item Display Order" value={itemDisplayOrder} options={["Products First", "Services First", "Mixed"]} onChange={setItemDisplayOrder} />
                <RowSelect label="Notes" value={notesCol} options={["Dark", "Light", "Hidden"]} onChange={setNotesCol} />
                <RowToggle label="Line Total" checked={lineTotal} onChange={setLineTotal} />
                <RowSelect label="Show Price with Tax" value={showPriceWithTax} options={["Default", "Yes", "No"]} onChange={setShowPriceWithTax} />
                <RowToggle label="Line description full width" checked={lineDescFullWidth} onChange={setLineDescFullWidth} />
              </AccordionSection>

              {/* Header */}
              <AccordionSection title="Header">
                <RowSelect label="Title Alignment" value={titleAlignment} options={["Center", "Left", "Right"]} onChange={setTitleAlignment} />
                <RowSelect label="Sub Title Alignment" value={subTitleAlignment} options={["Center", "Left", "Right"]} onChange={setSubTitleAlignment} />
                <RowToggle label="Sub Title" checked={subTitle} onChange={setSubTitle} />
                <RowSelect label="Logo Size" value={logoSize} options={["Small", "Medium", "Large"]} onChange={setLogoSize} />
                <RowSelect label="Date Format" value={dateFormat} options={["Short", "Medium", "Long"]} onChange={setDateFormat} />
                <RowToggle label="Logo" checked={logo} onChange={setLogo} />
                <RowToggle label="Header" checked={header} onChange={setHeader} />
                <RowToggle label="Status Watermark" checked={statusWatermark} onChange={setStatusWatermark} />
                <RowToggle label="Number #" checked={numberHash} onChange={setNumberHash} />
                <RowToggle label="P.O. No" checked={poNo} onChange={setPoNo} />
                <RowToggle label="Due Date" checked={dueDate} onChange={setDueDate} />
                <RowToggle label="Total Outstanding" checked={totalOutstanding} onChange={setTotalOutstanding} />
                <RowToggle label="Paid Amount" checked={paidAmount} onChange={setPaidAmount} />
                <RowSelect label="QR Code Alignment" value={qrCodeAlignment} options={["Center", "Left", "Right"]} onChange={setQrCodeAlignment} />
                <RowToggle label="Document Copy Label" checked={documentCopyLabel} onChange={setDocumentCopyLabel} />
                <RowToggle label="Total Amount" checked={totalAmount} onChange={setTotalAmount} />
                <RowToggle label="Generated By" checked={generatedBy} onChange={setGeneratedBy} />
                <RowToggle label="Supply Type" checked={supplyType} onChange={setSupplyType} />
                <RowToggle label="Generated Date" checked={generatedDate} onChange={setGeneratedDate} />
                <RowToggle label="Cancelled Date" checked={cancelledDate} onChange={setCancelledDate} />
                <RowToggle label="Valid Till" checked={validTill} onChange={setValidTill} />
              </AccordionSection>

              {/* Company */}
              <AccordionSection title="Company">
                <RowToggle label="Reg. No" checked={compRegNo} onChange={setCompRegNo} />
                <RowSelect label="Reg. No & VAT Align Below" value={regNoVatAlignBelow} options={["Name", "Address"]} onChange={setRegNoVatAlignBelow} />
                <RowToggle label="VAT" checked={compVat} onChange={setCompVat} />
                <RowToggle label="Name" checked={compName} onChange={setCompName} />
                <RowToggle label="Country" checked={compCountry} onChange={setCompCountry} />
                <RowToggle label="Address" checked={compAddress} onChange={setCompAddress} />
                <RowToggle label="Phone" checked={compPhone} onChange={setCompPhone} />
                <RowToggle label="Mobile" checked={compMobile} onChange={setCompMobile} />
                <RowToggle label="Fax" checked={compFax} onChange={setCompFax} />
                <RowToggle label="Email" checked={compEmail} onChange={setCompEmail} />
                <RowToggle label="Website" checked={compWebsite} onChange={setCompWebsite} />
              </AccordionSection>

              {/* Contact */}
              <AccordionSection title="Contact">
                <RowToggle label="VAT" checked={contactVat} onChange={setContactVat} />
                <RowToggle label="Reg. No" checked={contactRegNo} onChange={setContactRegNo} />
                <RowSelect label="Reg. No & VAT Align Below" value={contactRegNoVatAlignBelow} options={["Address", "Name"]} onChange={setContactRegNoVatAlignBelow} />
                <RowToggle label="Home Phone" checked={homePhone} onChange={setHomePhone} />
                <RowToggle label="Business Phone" checked={businessPhone} onChange={setBusinessPhone} />
                <RowToggle label="Email" checked={contactEmail} onChange={setContactEmail} />
                <RowSelect label="Email Below Contact" value={emailBelowContact} options={["Name", "Address"]} onChange={setEmailBelowContact} />
                <RowToggle label="Mobile" checked={contactMobile} onChange={setContactMobile} />
                <RowToggle label="Fax" checked={contactFax} onChange={setContactFax} />
                <RowToggle label="First/Last Name" checked={firstLastName} onChange={setFirstLastName} />
                <RowSelect label="Mobile Below Contact" value={mobileBelowContact} options={["Name", "Address"]} onChange={setMobileBelowContact} />
                <RowSelect label="Address Alignment" value={addressAlignment} options={["Left", "Center", "Right"]} onChange={setAddressAlignment} />
                <RowSelect label="Billing Address Alignment" value={billingAddressAlignment} options={["Left", "Center", "Right"]} onChange={setBillingAddressAlignment} />
                <RowSelect label="Shipping Address Alignment" value={shippingAddressAlignment} options={["Right", "Left", "Center"]} onChange={setShippingAddressAlignment} />
              </AccordionSection>

              {/* Summary */}
              <AccordionSection title="Summary">
                <RowSelect label="Total Quantity" value={totalQuantity} options={["Hidden", "Show"]} onChange={setTotalQuantity} />
                <RowToggle label="Amount Unused" checked={amountUnused} onChange={setAmountUnused} />
                <RowToggle label="Sub Total" checked={subTotal} onChange={setSubTotal} />
                <RowToggle label="Discount" checked={summaryDiscount} onChange={setSummaryDiscount} />
                <RowToggle label="Inline Discount" checked={inlineDiscount} onChange={setInlineDiscount} />
                <RowToggle label="Shipping Cost" checked={shippingCost} onChange={setShippingCost} />
                <RowToggle label="Shipping Method" checked={shippingMethod} onChange={setShippingMethod} />
                <RowToggle label="Total" checked={total} onChange={setTotal} />
                <RowSelect label="Applied Credit Notes" value={appliedCreditNotes} options={["Hide", "Show"]} onChange={setAppliedCreditNotes} />
                <RowToggle label="Amount Due" checked={amountDue} onChange={setAmountDue} />
                <RowToggle label="Amount Paid" checked={amountPaid} onChange={setAmountPaid} />
                <RowToggle label="Amount Used" checked={amountUsed} onChange={setAmountUsed} />
                <RowSelect label="Tax" value={summaryTax} options={["Individual", "Combined", "Hidden"]} onChange={setSummaryTax} />
                <RowToggle label="Tax % Value" checked={taxPercentValue} onChange={setTaxPercentValue} />
                <RowToggle label="Taxable Amount" checked={taxableAmount} onChange={setTaxableAmount} />
                <RowToggle label="Total in Words" checked={totalInWords} onChange={setTotalInWords} />
                <RowToggle label="HSN/SAC Summary" checked={hsnSacSummary} onChange={setHsnSacSummary} />
                <RowToggle label="Return Order" checked={returnOrder} onChange={setReturnOrder} />
              </AccordionSection>

              {/* Notes & Terms */}
              <AccordionSection title="Notes & Terms">
                <RowToggle label="Notes" checked={notesEnabled} onChange={setNotesEnabled} />
                <RowToggle label="Notes Title" checked={notesTitle} onChange={setNotesTitle} />
                <RowSelect label="Font Size" value={notesFontSize} options={["Small", "Medium", "Large"]} onChange={setNotesFontSize} />
                <RowToggle label="Bank Details" checked={bankDetails} onChange={setBankDetails} />
                <RowToggle label="Bank Details Title" checked={bankDetailsTitle} onChange={setBankDetailsTitle} />
                <RowToggle label="Full width" checked={fullWidth} onChange={setFullWidth} />
                <RowToggle label="Terms & Conditions" checked={termsConditions} onChange={setTermsConditions} />
                <RowToggle label="Terms & Conditions Title" checked={termsConditionsTitle} onChange={setTermsConditionsTitle} />
              </AccordionSection>

              {/* Signature */}
              <AccordionSection title="Signature">
                <RowSelect label="Company Sign" value={companySign} options={["Company", "None"]} onChange={setCompanySign} />
                <RowToggle label="Contact Sign" checked={contactSign} onChange={setContactSign} />
                <RowSelect label="Company Signature Alignment" value={companySigAlignment} options={["Left", "Center", "Right"]} onChange={setCompanySigAlignment} />
                <RowSelect label="Contact Signature Alignment" value={contactSigAlignment} options={["Right", "Left", "Center"]} onChange={setContactSigAlignment} />
                <RowSelect label="Signature Size" value={signatureSize} options={["Small", "Medium", "Large"]} onChange={setSignatureSize} />
              </AccordionSection>

              {/* Footer */}
              <AccordionSection title="Footer">
                <RowToggle label="Created Moon Invoice Hyperlink" checked={createdHyperlink} onChange={setCreatedHyperlink} />
                <RowSelect label="Show Template for Page(s)" value={showTemplateForPages} options={["First", "All", "Last"]} onChange={setShowTemplateForPages} />
                <RowSelect label="Page Number Alignment" value={pageNumberAlignment} options={["Right", "Left", "Center"]} onChange={setPageNumberAlignment} />
                <RowToggle label="Page Number" checked={pageNumber} onChange={setPageNumber} />
              </AccordionSection>

              {/* Payment */}
              <AccordionSection title="Payment">
                <RowToggle label="Payment History" checked={paymentHistory} onChange={setPaymentHistory} />
                <RowSelect label="Pay Now Button Alignment" value={payNowButtonAlignment} options={["Up", "Down", "Hidden"]} onChange={setPayNowButtonAlignment} />
                <RowSelect label="Payment Methods Alignment" value={paymentMethodsAlignment} options={["Below", "Above", "Hidden"]} onChange={setPaymentMethodsAlignment} />
                <RowSelect label="Payment Methods" value={paymentMethodsShow} options={["Show", "Hide"]} onChange={setPaymentMethodsShow} />
                <RowToggle label="Payment Note" checked={paymentNote} onChange={setPaymentNote} />
                <RowToggle label="Payment #" checked={paymentHash} onChange={setPaymentHash} />
              </AccordionSection>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};
