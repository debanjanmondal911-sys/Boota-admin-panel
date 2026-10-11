import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Crown,
  ShoppingBag,
  RotateCcw,
  Clock,
  X,
  FileText,
  Save
} from 'lucide-react';
import { useAdmin } from '../context/AdminDataContext';
import { Customer } from '../types/admin';

export const CustomersView: React.FC = () => {
  const { customers, orders, returns, updateCustomerNotes } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);
  const [noteInput, setNoteInput] = useState('');

  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier = selectedTier === 'all' || c.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const openCustomerProfile = (cust: Customer) => {
    setActiveCustomer(cust);
    setNoteInput(cust.notes || '');
  };

  const handleSaveNotes = () => {
    if (!activeCustomer) return;
    updateCustomerNotes(activeCustomer.id, noteInput);
    setActiveCustomer({ ...activeCustomer, notes: noteInput });
  };

  // Get customer specific orders and returns
  const customerOrders = activeCustomer ? orders.filter(o => o.customerEmail === activeCustomer.email || o.customerId === activeCustomer.id) : [];
  const customerReturns = activeCustomer ? returns.filter(r => r.customerEmail === activeCustomer.email) : [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#F3D0D9]/80">
        <div>
          <h2 className="text-xl font-bold font-serif text-stone-900 tracking-tight">
            Patron Profiles & Directory
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor patron lifetime value (LTV), order frequency, size preferences, and bespoke customer notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500">
            Total Patrons: <strong className="font-mono text-stone-800">{customers.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patron name, phone, email, city..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg outline-none focus:border-[#962949] bg-stone-50/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTier}
            onChange={e => setSelectedTier(e.target.value)}
            className="border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs bg-white text-stone-800 outline-none focus:border-[#962949]"
          >
            <option value="all">All Patron Tiers</option>
            <option value="Royal VIP">Royal VIP</option>
            <option value="Frequent Festive">Frequent Festive</option>
            <option value="New Patron">New Patron</option>
            <option value="At Risk">At Risk</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FDF8F9] text-stone-500 uppercase text-[10px] font-semibold tracking-wider border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5">Patron Name</th>
                <th className="px-4 py-3.5">Contact & Location</th>
                <th className="px-4 py-3.5 text-center">Orders Placed</th>
                <th className="px-4 py-3.5 text-right">Lifetime Spend (LTV)</th>
                <th className="px-4 py-3.5 text-center">Last Order</th>
                <th className="px-4 py-3.5 text-center">Patron Tier</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-stone-400">
                    <p className="font-semibold text-stone-600 text-sm">No Patrons in the System Yet</p>
                    <p className="text-xs text-stone-400 mt-1">Customers who place orders on the storefront will appear here.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(cust => (
                  <tr key={cust.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-stone-900 text-sm">{cust.fullName}</div>
                      <div className="text-[11px] text-stone-400 mt-0.5">Patron #{cust.id}</div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-stone-800 font-mono text-[11px]">{cust.phone}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{cust.city}, {cust.state}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className="font-mono font-bold text-stone-900 text-sm">
                        {cust.totalOrders}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="font-mono font-bold text-[#962949] text-sm tabular-nums">
                        ₹{cust.totalSpent.toLocaleString('en-IN')}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center font-mono text-stone-500 text-[11px]">
                      {cust.lastOrderDate}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold uppercase rounded ${
                          cust.tier === 'Royal VIP'
                            ? 'bg-amber-100 text-[#962949] border border-amber-300'
                            : cust.tier === 'Frequent Festive'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : cust.tier === 'At Risk'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-stone-100 text-stone-800'
                        }`}
                      >
                        {cust.tier}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => openCustomerProfile(cust)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#962949] hover:bg-[#FDF2F4] rounded border border-[#F3D0D9] transition-colors cursor-pointer"
                      >
                        View Profile &rarr;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal */}
      {activeCustomer && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#962949]" />
                <h3 className="font-bold text-sm text-stone-900">
                  Patron Dossier: {activeCustomer.fullName}
                </h3>
              </div>
              <button
                onClick={() => setActiveCustomer(null)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Profile Card */}
              <div className="p-4 bg-linear-to-r from-stone-900 to-stone-800 text-stone-100 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{activeCustomer.fullName}</h3>
                  <p className="text-amber-400 text-xs mt-0.5">{activeCustomer.tier} Member</p>
                  <div className="flex items-center gap-4 text-[11px] text-stone-300 mt-2 font-mono">
                    <span>{activeCustomer.phone}</span>
                    <span>·</span>
                    <span>{activeCustomer.email}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-stone-400">Total Lifetime Value</div>
                  <div className="text-xl font-bold font-mono text-amber-300">
                    ₹{activeCustomer.totalSpent.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-stone-400 mt-0.5">{activeCustomer.totalOrders} festive orders placed</div>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-2.5">
                  Order History ({customerOrders.length})
                </h4>
                {customerOrders.length === 0 ? (
                  <p className="text-stone-400 italic">No orders logged in current session.</p>
                ) : (
                  <div className="border border-stone-200 rounded-lg divide-y divide-stone-100 overflow-hidden">
                    {customerOrders.map(o => (
                      <div key={o.id} className="p-3 flex items-center justify-between hover:bg-stone-50">
                        <div>
                          <div className="font-bold text-stone-900 flex items-center gap-2">
                            <span>{o.id}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 uppercase">
                              {o.orderStatus}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            {o.items.map(i => `${i.productTitle} (${i.size})`).join(', ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-stone-900">
                            ₹{o.total.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-stone-400 block mt-0.5 font-mono">
                            {new Date(o.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Internal Notes */}
              <div>
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-1.5">
                  Atelier Concierge Notes
                </h4>
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={noteInput}
                    onChange={e => setNoteInput(e.target.value)}
                    placeholder="Sizing nuances, child preference, Diwali delivery requirements, VIP concierge preferences..."
                    className="w-full p-2.5 border border-stone-300 rounded-lg outline-none focus:border-[#962949] text-xs"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveNotes}
                      className="px-3.5 py-1.5 bg-stone-900 text-white rounded-lg font-medium text-xs flex items-center gap-1.5 hover:bg-stone-800 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Concierge Notes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-stone-200 flex justify-end bg-stone-50">
              <button
                onClick={() => setActiveCustomer(null)}
                className="px-4 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
