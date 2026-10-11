import React from 'react';
import {
  LayoutDashboard,
  Shirt,
  Boxes,
  ShoppingBag,
  RotateCcw,
  Users,
  FolderTree,
  Tag,
  LayoutTemplate,
  Star,
  BarChart3,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { useAdmin } from '../context/AdminDataContext';
import { BootaLogo } from './BootaLogo';

interface SidebarProps {
  activeModule: string;
  onNavigate: (module: string) => void;
  onOpenStorefront: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, onNavigate, onOpenStorefront }) => {
  const { orders, products, returns, reviews } = useAdmin();

  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'confirmed' || o.orderStatus === 'processing').length;
  const lowStockCount = products.flatMap(p => p.variants.filter(v => v.stock <= v.lowStockThreshold)).length;
  const pendingReturnsCount = returns.filter(r => r.status === 'requested').length;
  const pendingReviewsCount = reviews.filter(r => r.status === 'pending').length;

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Shirt },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Boxes,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-[#FDF2F4] text-[#962949] border border-[#F3D0D9]'
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: 'bg-[#962949] text-white'
    },
    {
      id: 'returns',
      label: 'Returns & Exchanges',
      icon: RotateCcw,
      badge: pendingReturnsCount > 0 ? pendingReturnsCount : undefined,
      badgeColor: 'bg-[#FDF2F4] text-[#962949] border border-[#F3D0D9]'
    },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'coupons', label: 'Coupons & Promos', icon: Tag },
    { id: 'cms', label: 'Content (CMS)', icon: LayoutTemplate },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: Star,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
      badgeColor: 'bg-stone-100 text-stone-700'
    },
    { id: 'reports', label: 'Reports & Export', icon: BarChart3 },
    { id: 'settings', label: 'Store Settings', icon: SlidersHorizontal },
  ];

  return (
    <aside className="w-64 bg-white text-stone-800 flex flex-col shrink-0 min-h-screen border-r border-[#F3D0D9]/80 shadow-xs">
      {/* Brand Header with Logo (No Tagline) */}
      <div className="p-6 border-b border-[#F3D0D9]/80 flex flex-col items-center justify-center bg-[#FDF8F9]">
        <BootaLogo variant="vertical" size="lg" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-stone-400">
          Admin Operations
        </p>
        {navigation.map(item => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#962949] text-white shadow-sm'
                  : 'text-stone-700 hover:bg-[#FDF2F5] hover:text-[#962949]'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-stone-400 group-hover:text-[#962949]'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${isActive ? 'bg-white/20 text-white' : item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Storefront Link Card */}
      <div className="p-4 border-t border-[#F3D0D9]/80 bg-[#FDF8F9]">
        <div className="p-3 bg-white rounded-lg border border-[#F3D0D9] shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-[#962949]">Customer Website</span>
            <span className="text-[9px] text-stone-400 font-mono">External</span>
          </div>
          <p className="text-[10px] text-stone-500 truncate mb-2.5">
            boota-luxury-indian-festive...
          </p>
          <button
            onClick={onOpenStorefront}
            className="w-full py-2 px-2.5 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>View Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
