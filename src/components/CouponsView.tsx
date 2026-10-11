import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Percent,
  CheckCircle2,
  XCircle,
  X,
  Calendar,
  Layers
} from 'lucide-react';
import { useAdmin } from '../context/AdminDataContext';
import { Coupon } from '../types/admin';

export const CouponsView: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, toggleCoupon } = useAdmin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed_amount'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [minOrderValue, setMinOrderValue] = useState<number>(3999);
  const [maxDiscountCap, setMaxDiscountCap] = useState<number | undefined>(2000);
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-11-15');
  const [usageLimitTotal, setUsageLimitTotal] = useState<number>(500);
  const [usageLimitPerUser, setUsageLimitPerUser] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setCode('');
    setDescription('');
    setDiscountType('percentage');
    setDiscountValue(15);
    setMinOrderValue(3999);
    setMaxDiscountCap(2000);
    setStartDate('2026-10-01');
    setEndDate('2026-11-30');
    setUsageLimitTotal(500);
    setUsageLimitPerUser(1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDescription(coupon.description);
    setDiscountType(coupon.discountType);
    setDiscountValue(coupon.discountValue);
    setMinOrderValue(coupon.minOrderValue);
    setMaxDiscountCap(coupon.maxDiscountCap);
    setStartDate(coupon.startDate);
    setEndDate(coupon.endDate);
    setUsageLimitTotal(coupon.usageLimitTotal);
    setUsageLimitPerUser(coupon.usageLimitPerUser);
    setIsActive(coupon.isActive);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, {
        code: code.toUpperCase().trim(),
        description,
        discountType,
        discountValue,
        minOrderValue,
        maxDiscountCap,
        startDate,
        endDate,
        usageLimitTotal,
        usageLimitPerUser,
        isActive
      });
    } else {
      addCoupon({
        code: code.toUpperCase().trim(),
        description,
        discountType,
        discountValue,
        minOrderValue,
        maxDiscountCap,
        startDate,
        endDate,
        usageLimitTotal,
        usageLimitPerUser,
        isActive
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#F3D0D9]/80">
        <div>
          <h2 className="text-xl font-bold font-serif text-stone-900 tracking-tight">
            Coupons & Promotional Discounts
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure percentage and fixed price discount codes, order thresholds, and usage limits.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Promo Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FDF8F9] text-stone-500 uppercase text-[10px] font-semibold tracking-wider border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5">Promo Code</th>
                <th className="px-4 py-3.5">Discount Benefit</th>
                <th className="px-4 py-3.5">Minimum Order Threshold</th>
                <th className="px-4 py-3.5">Redemptions / Limit</th>
                <th className="px-4 py-3.5">Validity Window</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-stone-400">
                    <p className="font-semibold text-stone-600 text-sm">No Active Promotional Coupons</p>
                    <p className="text-xs text-stone-400 mt-1 mb-4">Create coupons for seasonal sales, wedding specials, or first-order welcome gifts.</p>
                    <button
                      onClick={openCreateModal}
                      className="px-4 py-2 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create First Coupon</span>
                    </button>
                  </td>
                </tr>
              ) : (
                coupons.map(coupon => (
                  <tr key={coupon.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold font-mono text-base text-[#962949] flex items-center gap-2">
                        <span>{coupon.code}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{coupon.description}</div>
                    </td>

                  <td className="px-4 py-4">
                    <span className="font-mono font-bold text-stone-900 text-sm">
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}% OFF`
                        : `₹${coupon.discountValue} FLAT OFF`}
                    </span>
                    {coupon.maxDiscountCap && (
                      <span className="text-[10px] text-stone-400 block mt-0.5">
                        Capped at ₹{coupon.maxDiscountCap}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 font-mono font-medium text-stone-800">
                    ₹{coupon.minOrderValue.toLocaleString('en-IN')}
                  </td>

                  <td className="px-4 py-4">
                    <div className="font-mono text-stone-900">
                      <strong>{coupon.timesUsed}</strong> / {coupon.usageLimitTotal} uses
                    </div>
                    <div className="w-24 bg-stone-100 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        style={{
                          width: `${Math.min(100, Math.round((coupon.timesUsed / coupon.usageLimitTotal) * 100))}%`
                        }}
                        className="bg-[#962949] h-full rounded-full"
                      />
                    </div>
                  </td>

                  <td className="px-4 py-4 font-mono text-stone-500 text-[11px]">
                    {coupon.startDate} &rarr; {coupon.endDate}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => toggleCoupon(coupon.id)}
                      className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase rounded transition-colors cursor-pointer ${
                        coupon.isActive
                          ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                          : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                      }`}
                    >
                      {coupon.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="p-1.5 text-stone-600 hover:text-[#962949] hover:bg-stone-100 rounded transition-colors"
                        title="Edit Coupon"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete coupon "${coupon.code}"?`)) {
                            deleteCoupon(coupon.id);
                          }
                        }}
                        className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#962949]" />
                <h3 className="font-bold text-sm text-stone-900">
                  {editingCoupon ? 'Edit Promo Coupon' : 'Create New Festive Coupon'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 text-xs space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="e.g. DIWALI20"
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none font-mono font-bold uppercase text-xs focus:border-[#962949]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value as any)}
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none bg-white focus:border-[#962949] text-xs"
                  >
                    <option value="percentage">Percentage Discount (%)</option>
                    <option value="fixed_amount">Fixed Amount Off (₹)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Offer Description</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g. 15% Festive Savings for Diwali Celebrations"
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-[#962949] text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    {discountType === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={discountValue}
                    onChange={e => setDiscountValue(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded-lg font-mono text-xs focus:border-[#962949]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={minOrderValue}
                    onChange={e => setMinOrderValue(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded-lg font-mono text-xs focus:border-[#962949]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={maxDiscountCap || ''}
                    onChange={e => setMaxDiscountCap(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Optional"
                    className="w-full p-2 border border-stone-300 rounded-lg font-mono text-xs focus:border-[#962949]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg font-mono text-xs focus:border-[#962949]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg font-mono text-xs focus:border-[#962949]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Max Total Uses</label>
                  <input
                    type="number"
                    min={1}
                    value={usageLimitTotal}
                    onChange={e => setUsageLimitTotal(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded-lg font-mono text-xs focus:border-[#962949]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Limit Per Patron</label>
                  <input
                    type="number"
                    min={1}
                    value={usageLimitPerUser}
                    onChange={e => setUsageLimitPerUser(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded-lg font-mono text-xs focus:border-[#962949]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="couponActive"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#962949] rounded"
                />
                <label htmlFor="couponActive" className="font-semibold text-stone-700">
                  Coupon is Active & Redeemable at Checkout
                </label>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg font-semibold"
                >
                  {editingCoupon ? 'Save Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
