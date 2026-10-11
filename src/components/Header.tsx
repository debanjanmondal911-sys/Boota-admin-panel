import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ExternalLink,
  RotateCcw,
  Download,
  AlertTriangle,
  Package,
  Sparkles,
  X,
  LogOut,
  User,
  Shield,
  ChevronDown
} from 'lucide-react';
import { useAdmin } from '../context/AdminDataContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeModule: string;
  onNavigate: (module: string) => void;
  onOpenStorefront: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeModule, onNavigate, onOpenStorefront }) => {
  const { orders, products, returns, exportDatabaseJson } = useAdmin();
  const { currentUser, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Compute alerts
  const pendingOrders = orders.filter(o => o.orderStatus === 'confirmed' || o.orderStatus === 'processing');
  const lowStockVariants = products.flatMap(p =>
    p.variants.filter(v => v.stock <= v.lowStockThreshold)
  );
  const pendingReturns = returns.filter(r => r.status === 'requested');

  const totalAlertsCount = pendingOrders.length + lowStockVariants.length + pendingReturns.length;

  // Search results
  const searchResults = searchQuery.trim()
    ? {
        orders: orders.filter(
          o =>
            o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.shippingAddress.city.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        products: products.filter(
          p =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
    : null;

  return (
    <header className="h-16 bg-white border-b border-[#F3D0D9]/80 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Module Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-[#962949] font-bold">Boota</span>
          <span className="text-stone-300">/</span>
          <h1 className="text-lg font-semibold text-stone-900 capitalize">
            {activeModule === 'cms' ? 'Content & CMS' : activeModule.replace('-', ' ')}
          </h1>
        </div>
      </div>

      {/* Center / Right Toolbar */}
      <div className="flex items-center gap-3">
        {/* Quick Search Bar trigger */}
        <button
          onClick={() => setShowSearchModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-stone-500 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-stone-400" />
          <span className="hidden md:inline">Search catalog, orders, patrons...</span>
          <span className="inline md:hidden">Search</span>
          <kbd className="hidden md:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-mono bg-white border border-stone-300 rounded text-stone-500">
            /
          </kbd>
        </button>

        {/* View Storefront Link */}
        <button
          onClick={onOpenStorefront}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#962949] hover:bg-[#7E1F3B] rounded-lg transition-colors cursor-pointer shadow-xs"
          title="Open live customer storefront website"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Storefront</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-stone-600 hover:text-[#962949] hover:bg-[#FDF2F4] rounded-lg relative transition-colors cursor-pointer"
            title="Operational Alerts"
          >
            <Bell className="w-4 h-4" />
            {totalAlertsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#962949] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalAlertsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#F3D0D9] rounded-xl shadow-xl z-50 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="text-xs font-bold uppercase tracking-wider text-[#962949]">Operations Alerts</span>
                <span className="text-xs text-stone-400 font-mono">{totalAlertsCount} pending</span>
              </div>

              <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto">
                {pendingOrders.length > 0 && (
                  <div
                    onClick={() => {
                      onNavigate('orders');
                      setShowNotifications(false);
                    }}
                    className="py-2.5 flex items-start gap-2.5 hover:bg-stone-50 cursor-pointer rounded px-1.5"
                  >
                    <Package className="w-4 h-4 text-[#962949] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-stone-800">
                        {pendingOrders.length} orders awaiting fulfillment
                      </p>
                      <p className="text-[11px] text-stone-500">Ready for packaging & AWB dispatch</p>
                    </div>
                  </div>
                )}

                {lowStockVariants.length > 0 && (
                  <div
                    onClick={() => {
                      onNavigate('inventory');
                      setShowNotifications(false);
                    }}
                    className="py-2.5 flex items-start gap-2.5 hover:bg-stone-50 cursor-pointer rounded px-1.5"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-stone-800">
                        {lowStockVariants.length} sizes in critical stock
                      </p>
                      <p className="text-[11px] text-stone-500">Less than threshold units available</p>
                    </div>
                  </div>
                )}

                {pendingReturns.length > 0 && (
                  <div
                    onClick={() => {
                      onNavigate('returns');
                      setShowNotifications(false);
                    }}
                    className="py-2.5 flex items-start gap-2.5 hover:bg-stone-50 cursor-pointer rounded px-1.5"
                  >
                    <RotateCcw className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-stone-800">
                        {pendingReturns.length} return / size exchange requests
                      </p>
                      <p className="text-[11px] text-stone-500">Requires review and pickup approval</p>
                    </div>
                  </div>
                )}

                {totalAlertsCount === 0 && (
                  <div className="py-6 text-center text-xs text-stone-400">
                    No pending alerts. All operations are up to date!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Database Export & Reset Shortcuts */}
        <button
          onClick={exportDatabaseJson}
          className="p-2 text-stone-600 hover:text-[#962949] hover:bg-[#FDF2F4] rounded-lg transition-colors cursor-pointer"
          title="Export Admin Database JSON"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* User Profile & Logout Popover */}
        <div className="relative pl-2 border-l border-stone-200">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-[#962949] text-white text-xs font-bold flex items-center justify-center shadow-xs ring-1 ring-[#F3D0D9]">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-stone-800 leading-none group-hover:text-[#962949] transition-colors">
                {currentUser?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-[#962949] font-medium leading-none mt-0.5">
                {currentUser?.roleLabel || 'Boota Atelier'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 transition-transform" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[#F3D0D9] rounded-xl shadow-xl z-50 p-3 animate-in fade-in zoom-in-95 duration-100">
              <div className="pb-3 border-b border-stone-100 flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#962949] text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-stone-900 truncate">
                    {currentUser?.name || 'Admin'}
                  </p>
                  <p className="text-[11px] text-stone-500 truncate font-mono">
                    {currentUser?.email || 'admin@boota.com'}
                  </p>
                  <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 bg-[#FDF2F4] text-[#962949] rounded text-[10px] font-semibold border border-[#F3D0D9]">
                    <Shield className="w-2.5 h-2.5" />
                    <span>{currentUser?.roleLabel || 'Super Admin'}</span>
                  </div>
                </div>
              </div>

              <div className="py-2 space-y-1 text-xs">
                {currentUser?.lastLogin && (
                  <div className="px-2 py-1 text-[10px] text-stone-400">
                    Last session: {currentUser.lastLogin}
                  </div>
                )}

                <button
                  onClick={() => {
                    onNavigate('settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-stone-700 hover:text-[#962949] hover:bg-[#FDF2F4] rounded-lg transition-colors cursor-pointer text-left"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Security & Passkey Settings</span>
                </button>
              </div>

              <div className="pt-2 border-t border-stone-100">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold transition-colors cursor-pointer text-left text-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of Workstation</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-3 border-b border-stone-200 flex items-center gap-3">
              <Search className="w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search orders (BOOTA-9418), patrons, products (Sherwani, Lehenga)..."
                className="w-full text-sm outline-none text-stone-800 placeholder-stone-400"
                autoFocus
              />
              <button
                onClick={() => {
                  setShowSearchModal(false);
                  setSearchQuery('');
                }}
                className="p-1 hover:bg-stone-100 rounded text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-4 text-xs">
              {searchResults ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-stone-400 uppercase tracking-wider text-[11px] mb-2">
                      Matching Orders ({searchResults.orders.length})
                    </h3>
                    {searchResults.orders.length === 0 ? (
                      <p className="text-stone-400 italic">No orders found.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {searchResults.orders.map(o => (
                          <div
                            key={o.id}
                            onClick={() => {
                              onNavigate('orders');
                              setShowSearchModal(false);
                            }}
                            className="p-2 hover:bg-stone-50 rounded border border-stone-100 flex items-center justify-between cursor-pointer"
                          >
                            <div>
                              <span className="font-bold text-stone-900">{o.id}</span>
                              <span className="text-stone-500 ml-2">· {o.customerName} ({o.shippingAddress.city})</span>
                            </div>
                            <span className="font-mono font-medium text-amber-900">₹{o.total.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-stone-400 uppercase tracking-wider text-[11px] mb-2">
                      Matching Products ({searchResults.products.length})
                    </h3>
                    {searchResults.products.length === 0 ? (
                      <p className="text-stone-400 italic">No products found.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {searchResults.products.map(p => (
                          <div
                            key={p.id}
                            onClick={() => {
                              onNavigate('products');
                              setShowSearchModal(false);
                            }}
                            className="p-2 hover:bg-stone-50 rounded border border-stone-100 flex items-center justify-between cursor-pointer"
                          >
                            <div>
                              <span className="font-bold text-stone-900">{p.title}</span>
                              <span className="text-stone-400 ml-2">[{p.sku}]</span>
                            </div>
                            <span className="font-mono text-stone-700">₹{p.price.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-stone-400 text-center py-4">
                  Type to instantly search across orders, ensembles, and customers.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
