import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  RotateCcw,
  PlusCircle,
  Truck,
  ArrowUpRight,
  Package,
  Layers,
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useAdmin } from '../context/AdminDataContext';

interface DashboardViewProps {
  onNavigate: (module: string) => void;
  onOpenOrderModal?: (orderId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { orders, products, returns } = useAdmin();

  // Aggregate metrics
  const totalSales = orders.reduce((sum, o) => o.orderStatus !== 'cancelled' ? sum + o.total : sum, 0);
  const validOrders = orders.filter(o => o.orderStatus !== 'cancelled');
  const aov = validOrders.length > 0 ? Math.round(totalSales / validOrders.length) : 0;

  const pendingOrders = orders.filter(o => o.orderStatus === 'confirmed' || o.orderStatus === 'processing');
  const deliveredOrders = orders.filter(o => o.orderStatus === 'delivered');

  // Low stock variants
  const lowStockItems: {
    productId: string;
    productTitle: string;
    image: string;
    sku: string;
    size: string;
    stock: number;
    threshold: number;
  }[] = [];

  products.forEach(p => {
    p.variants.forEach(v => {
      if (v.stock <= v.lowStockThreshold) {
        lowStockItems.push({
          productId: p.id,
          productTitle: p.title,
          image: p.images[0] || '',
          sku: v.sku,
          size: v.size,
          stock: v.stock,
          threshold: v.lowStockThreshold
        });
      }
    });
  });

  const pendingReturns = returns.filter(r => r.status === 'requested');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#F3D0D9]/80">
        <div>
          <h2 className="text-2xl font-bold font-serif text-stone-900 tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time orders, catalog health, inventory levels, and customer operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('products')}
            className="px-3.5 py-2 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Product</span>
          </button>
          <button
            onClick={() => onNavigate('orders')}
            className="px-3.5 py-2 bg-white hover:bg-[#FDF2F4] border border-[#F3D0D9] text-[#962949] rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Fulfill Orders</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Gross Revenue */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Sales</span>
            <span className="p-1.5 bg-[#FDF2F4] text-[#962949] rounded-md">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
              ₹{totalSales.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-1">
              <span>{validOrders.length} processed orders</span>
            </div>
          </div>
        </div>

        {/* Card 2: Orders & AOV */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Orders</span>
            <span className="p-1.5 bg-[#FDF2F4] text-[#962949] rounded-md">
              <ShoppingBag className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
              {orders.length} <span className="text-sm font-normal text-stone-400">total</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
              <span className="font-mono font-medium text-stone-800">₹{aov.toLocaleString('en-IN')}</span>
              <span>Avg Order Value (AOV)</span>
            </div>
          </div>
        </div>

        {/* Card 3: Low Stock Alerts */}
        <div
          onClick={() => onNavigate('inventory')}
          className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-[#962949] transition-colors"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Low Stock SKUs</span>
            <span className="p-1.5 bg-[#FDF2F4] text-[#962949] rounded-md">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-[#962949] tabular-nums">
              {lowStockItems.length} <span className="text-sm font-normal text-stone-400">SKUs</span>
            </div>
            <div className="text-xs text-stone-500 mt-1 flex items-center justify-between">
              <span>{products.length} products in catalog</span>
              <span className="text-[#962949] font-semibold hover:underline">Manage &rarr;</span>
            </div>
          </div>
        </div>

        {/* Card 4: Returns / Exchanges */}
        <div
          onClick={() => onNavigate('returns')}
          className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-[#962949] transition-colors"
        >
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Returns & Exchanges</span>
            <span className="p-1.5 bg-[#FDF2F4] text-[#962949] rounded-md">
              <RotateCcw className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
              {pendingReturns.length} <span className="text-sm font-normal text-stone-400">pending</span>
            </div>
            <div className="text-xs text-stone-500 mt-1 flex items-center justify-between">
              <span>{returns.length} total tickets</span>
              <span className="text-[#962949] font-semibold hover:underline">Review &rarr;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Operational Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sales & Activity Status */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Sales & Order Activity</h3>
                <p className="text-xs text-stone-500">Daily gross revenue and order intake in INR (₹)</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-stone-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#962949] inline-block"></span>
                  Daily Revenue
                </span>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="h-48 border border-dashed border-[#F3D0D9] rounded-xl flex flex-col items-center justify-center p-6 text-center bg-[#FDF8F9]/50">
                <ShoppingBag className="w-8 h-8 text-[#962949]/50 mb-2" />
                <p className="text-xs font-bold text-stone-800">No Sales Transactions Recorded Yet</p>
                <p className="text-[11px] text-stone-500 mt-0.5 max-w-sm">
                  Once patrons place orders on the storefront, real-time revenue and order velocity metrics will appear here.
                </p>
              </div>
            ) : (
              <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-stone-100">
                {/* When orders exist, render dynamic distribution */}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 text-xs text-stone-500 border-t border-stone-100 mt-4">
            <span>Store Status: <strong className="text-emerald-700">Online</strong></span>
            <span className="font-mono font-medium text-stone-800">
              Total Revenue: ₹{totalSales.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Right 1 Col: Quick Launch & Inventory Health */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 mb-1">Quick Management Actions</h3>
            <p className="text-xs text-stone-500 mb-4">Frequent operations for store admins</p>

            <div className="space-y-2">
              <button
                onClick={() => onNavigate('products')}
                className="w-full p-2.5 bg-stone-50 hover:bg-[#FDF2F4] text-left rounded-lg border border-stone-200 hover:border-[#F3D0D9] flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle className="w-4 h-4 text-[#962949]" />
                  <div>
                    <p className="text-xs font-bold text-stone-800 group-hover:text-[#962949]">Add New Product</p>
                    <p className="text-[10px] text-stone-400">Add titles, images, sizes & pricing</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#962949]" />
              </button>

              <button
                onClick={() => onNavigate('inventory')}
                className="w-full p-2.5 bg-stone-50 hover:bg-[#FDF2F4] text-left rounded-lg border border-stone-200 hover:border-[#F3D0D9] flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-[#962949]" />
                  <div>
                    <p className="text-xs font-bold text-stone-800 group-hover:text-[#962949]">Manage Inventory</p>
                    <p className="text-[10px] text-stone-400">Adjust stock quantities & thresholds</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#962949]" />
              </button>

              <button
                onClick={() => onNavigate('coupons')}
                className="w-full p-2.5 bg-stone-50 hover:bg-[#FDF2F4] text-left rounded-lg border border-stone-200 hover:border-[#F3D0D9] flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#962949]" />
                  <div>
                    <p className="text-xs font-bold text-stone-800 group-hover:text-[#962949]">Promotions & Coupons</p>
                    <p className="text-[10px] text-stone-400">Create discount promo codes</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#962949]" />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-500">Catalog size:</span>
            <span className="font-bold text-stone-900">{products.length} Products</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Recent Patron Orders</h3>
            <p className="text-xs text-stone-500">Live order queue ready for fulfillment</p>
          </div>
          <button
            onClick={() => onNavigate('orders')}
            className="text-xs text-[#962949] font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Orders ({orders.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400">
            <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="font-semibold text-stone-600">No Orders in the System Yet</p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Customer orders placed on the storefront will appear here for fulfillment and dispatch.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FDF8F9] text-stone-500 uppercase text-[10px] font-semibold tracking-wider border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-4 py-3">Patron & Destination</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3 text-right">Order Total</th>
                  <th className="px-4 py-3 text-center">Payment</th>
                  <th className="px-4 py-3 text-center">Fulfillment</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.slice(0, 5).map(o => (
                  <tr key={o.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-bold font-mono text-stone-900">{o.id}</td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-stone-900 block">{o.customerName}</span>
                      <span className="text-[11px] text-stone-500">{o.shippingAddress.city}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-stone-800 font-medium block">{o.items[0]?.productTitle}</span>
                      <span className="text-[11px] text-stone-500">Size: {o.items[0]?.size}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-stone-900 tabular-nums">
                      ₹{o.total.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-block px-2.5 py-0.5 text-[10px] font-semibold uppercase rounded bg-[#FDF2F4] text-[#962949] border border-[#F3D0D9]">
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => onNavigate('orders')}
                        className="px-2.5 py-1 text-xs text-[#962949] font-bold hover:underline cursor-pointer"
                      >
                        Manage &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
