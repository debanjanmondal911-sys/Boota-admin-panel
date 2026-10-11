import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Save,
  Truck,
  CreditCard,
  Percent,
  Bell,
  Building,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2
} from 'lucide-react';
import { useAdmin } from '../context/AdminDataContext';
import { StoreSettings } from '../types/admin';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetToDefaults,
    clearAllData,
    loadSampleData,
    exportDatabaseJson,
    importDatabaseJson,
    showToast
  } = useAdmin();

  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;
    const ok = importDatabaseJson(importJsonText.trim());
    if (ok) {
      setShowImportModal(false);
      setImportJsonText('');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h2 className="text-xl font-bold font-serif text-stone-900 tracking-tight">
            Store Settings & Commercial Governance
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure logistics charges, Razorpay keys, COD ceilings, kidswear GST slabs, and automated messaging.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (confirm('Clear all data from the admin panel? All products, orders, customers, etc. will be removed.')) {
                clearAllData();
              }
            }}
            className="px-3.5 py-1.5 bg-[#FDF2F4] hover:bg-[#F3D0D9] border border-[#F3D0D9] text-[#962949] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All Data</span>
          </button>
          <button
            onClick={() => {
              if (confirm('Load sample kidswear products, orders, and categories for testing?')) {
                loadSampleData();
              }
            }}
            className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Load Sample Data</span>
          </button>
          <button
            onClick={exportDatabaseJson}
            className="px-3.5 py-1.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Backup Database</span>
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-1.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Restore Backup</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Section 1: Store & Atelier Profile */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Building className="w-4 h-4 text-[#962949]" />
            <h3 className="text-sm font-bold text-stone-900">Atelier Profile & Legal Entity</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Brand Name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-[#962949] text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Brand Tagline</label>
              <input
                type="text"
                value={formData.brandTagline}
                onChange={e => setFormData({ ...formData, brandTagline: e.target.value })}
                className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-[#962949] text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Support Email</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={e => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-[#962949] text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Support & WhatsApp Concierge</label>
              <input
                type="text"
                value={formData.whatsappSupport}
                onChange={e => setFormData({ ...formData, whatsappSupport: e.target.value })}
                className="w-full p-2 border border-stone-300 rounded-lg outline-none font-mono focus:border-[#962949] text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">GSTIN (Goods and Services Tax ID)</label>
              <input
                type="text"
                value={formData.gstin}
                onChange={e => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full p-2 border border-stone-300 rounded-lg outline-none font-mono focus:border-[#962949] text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Currency Code & Symbol</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.currency}
                  disabled
                  className="w-1/2 p-2 border border-stone-200 bg-stone-50 rounded-lg font-mono text-xs"
                />
                <input
                  type="text"
                  value={formData.currencySymbol}
                  disabled
                  className="w-1/2 p-2 border border-stone-200 bg-stone-50 rounded-lg font-mono text-xs text-center"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">Fulfillment Atelier Dispatch Address</label>
              <textarea
                rows={2}
                value={formData.warehouseAddress}
                onChange={e => setFormData({ ...formData, warehouseAddress: e.target.value })}
                className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-[#962949] text-xs leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Shipping Rules */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Truck className="w-4 h-4 text-[#962949]" />
            <h3 className="text-sm font-bold text-stone-900">Shipping & Delivery Rates</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Standard Domestic Shipping (₹)</label>
              <input
                type="number"
                value={formData.standardShippingFee}
                onChange={e => setFormData({ ...formData, standardShippingFee: Number(e.target.value) })}
                className="w-full p-2 border border-stone-300 rounded-lg font-mono focus:border-[#962949] text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Express Festive Priority Air (₹)</label>
              <input
                type="number"
                value={formData.expressShippingFee}
                onChange={e => setFormData({ ...formData, expressShippingFee: Number(e.target.value) })}
                className="w-full p-2 border border-stone-300 rounded-lg font-mono focus:border-[#962949] text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                value={formData.freeShippingThreshold}
                onChange={e => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                className="w-full p-2 border border-stone-300 rounded-lg font-mono focus:border-[#962949] text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Payment Gateways */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <CreditCard className="w-4 h-4 text-[#962949]" />
            <h3 className="text-sm font-bold text-stone-900">Payment Gateways & COD Policies</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-stone-700">Razorpay Payment Gateway</label>
                <input
                  type="checkbox"
                  checked={formData.razorpayEnabled}
                  onChange={e => setFormData({ ...formData, razorpayEnabled: e.target.checked })}
                  className="w-4 h-4 accent-[#962949] rounded"
                />
              </div>
              <input
                type="text"
                value={formData.razorpayKeyId}
                onChange={e => setFormData({ ...formData, razorpayKeyId: e.target.value })}
                placeholder="rzp_live_xxxxxxxxxx"
                className="w-full p-2 border border-stone-300 rounded-lg font-mono text-xs focus:border-[#962949]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-stone-700">Cash on Delivery (COD)</label>
                <input
                  type="checkbox"
                  checked={formData.codEnabled}
                  onChange={e => setFormData({ ...formData, codEnabled: e.target.checked })}
                  className="w-4 h-4 accent-[#962949] rounded"
                />
              </div>
              <input
                type="number"
                value={formData.codMaxOrderValue}
                onChange={e => setFormData({ ...formData, codMaxOrderValue: Number(e.target.value) })}
                placeholder="Max order value allowed for COD"
                className="w-full p-2 border border-stone-300 rounded-lg font-mono text-xs focus:border-[#962949]"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Ceiling limit for COD bookings (e.g. ₹15,000)
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Automated Notifications */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Bell className="w-4 h-4 text-[#962949]" />
            <h3 className="text-sm font-bold text-stone-900">Automated Patron & Atelier Alerts</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
              <div>
                <p className="font-bold text-stone-900">Order Confirmation Notification</p>
                <p className="text-stone-500 text-[11px]">Send instant festive order confirmation receipt via email and SMS</p>
              </div>
              <input
                type="checkbox"
                checked={formData.notifyOnNewOrderEmail}
                onChange={e => setFormData({ ...formData, notifyOnNewOrderEmail: e.target.checked })}
                className="w-4 h-4 accent-[#962949] rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
              <div>
                <p className="font-bold text-stone-900">Low Stock Internal Warehouse Alert</p>
                <p className="text-stone-500 text-[11px]">Alert atelier team when any ensemble size drops below configured threshold</p>
              </div>
              <input
                type="checkbox"
                checked={formData.notifyOnLowStockEmail}
                onChange={e => setFormData({ ...formData, notifyOnLowStockEmail: e.target.checked })}
                className="w-4 h-4 accent-[#962949] rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
              <div>
                <p className="font-bold text-stone-900">WhatsApp Dispatch & AWB Live Tracking</p>
                <p className="text-stone-500 text-[11px]">Automatically ping patron via WhatsApp with BlueDart tracking link on dispatch</p>
              </div>
              <input
                type="checkbox"
                checked={formData.whatsappDispatchAlerts}
                onChange={e => setFormData({ ...formData, whatsappDispatchAlerts: e.target.checked })}
                className="w-4 h-4 accent-[#962949] rounded"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              if (confirm('Clear all dummy records and reset to clean empty state?')) {
                clearAllData();
              }
            }}
            className="px-4 py-2 border border-rose-200 text-[#962949] hover:bg-[#FDF2F4] rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Wipe All Dummy Data</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-sm text-stone-900">Restore Catalog Database JSON</h3>
              <button onClick={() => setShowImportModal(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>
            <form onSubmit={handleImport} className="p-5 text-xs space-y-3">
              <p className="text-stone-600">
                Paste JSON exported from another session or backup:
              </p>
              <textarea
                rows={8}
                required
                value={importJsonText}
                onChange={e => setImportJsonText(e.target.value)}
                placeholder='{"products": [...], "orders": [...]}'
                className="w-full p-2 border border-stone-300 rounded font-mono text-[11px]"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-1.5 border border-stone-300 rounded text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded font-semibold transition-colors cursor-pointer"
                >
                  Import Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
