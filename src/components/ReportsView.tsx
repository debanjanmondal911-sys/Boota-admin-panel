import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  FileSpreadsheet,
  TrendingUp,
  Boxes,
  Users,
  ShoppingBag,
  Percent,
  CheckCircle2
} from 'lucide-react';
import { useAdmin } from '../context/AdminDataContext';

export const ReportsView: React.FC = () => {
  const { orders, products, customers, returns, showToast } = useAdmin();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'diwali_season' | 'all'>('diwali_season');

  // Computed metrics
  const validOrders = orders.filter(o => o.orderStatus !== 'cancelled');
  const totalSales = validOrders.reduce((sum, o) => sum + o.total, 0);
  const totalItemsSold = validOrders.reduce(
    (sum, o) => sum + o.items.reduce((iSum, item) => iSum + item.quantity, 0),
    0
  );
  const totalGstCollected = validOrders.reduce((sum, o) => sum + o.gstAmount, 0);

  // Inventory valuation
  const inventoryValuation = products.reduce((acc, p) => {
    const pUnits = p.variants.reduce((vSum, v) => vSum + v.stock, 0);
    return acc + pUnits * p.price;
  }, 0);

  // Category breakdown
  const categorySalesMap: { [cat: string]: { units: number; revenue: number } } = {};
  validOrders.forEach(o => {
    o.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      const cat = prod?.category || 'Boys Festive';
      if (!categorySalesMap[cat]) {
        categorySalesMap[cat] = { units: 0, revenue: 0 };
      }
      categorySalesMap[cat].units += item.quantity;
      categorySalesMap[cat].revenue += item.totalPrice;
    });
  });

  // CSV Exporters
  const downloadCsv = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Exported "${filename}" successfully.`);
  };

  const exportOrdersCsv = () => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Email', 'Phone', 'City', 'State', 'Items', 'Total INR', 'Payment Status', 'Order Status', 'Carrier', 'AWB'];
    const rows = orders.map(o => [
      o.id,
      new Date(o.createdAt).toISOString().split('T')[0],
      `"${o.customerName}"`,
      o.customerEmail,
      `"${o.customerPhone}"`,
      `"${o.shippingAddress.city}"`,
      `"${o.shippingAddress.state}"`,
      `"${o.items.map(i => `${i.productTitle} (${i.size}x${i.quantity})`).join('; ')}"`,
      o.total,
      o.paymentStatus,
      o.orderStatus,
      o.carrier || '',
      o.trackingNumber || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCsv(`boota-orders-report-${new Date().toISOString().split('T')[0]}.csv`, csvContent);
  };

  const exportInventoryCsv = () => {
    const headers = ['Product Title', 'Master SKU', 'Category', 'Color', 'Size', 'Variant SKU', 'Stock On Hand', 'Reserved', 'Retail Price INR', 'Cost Price INR', 'Stock Valuation INR'];
    const rows: string[] = [];

    products.forEach(p => {
      p.variants.forEach(v => {
        rows.push([
          `"${p.title}"`,
          p.sku,
          `"${p.category}"`,
          `"${v.colorName}"`,
          v.size,
          v.sku,
          v.stock,
          v.reserved,
          p.price,
          p.costPrice,
          v.stock * p.price
        ].join(','));
      });
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    downloadCsv(`boota-inventory-valuation-${new Date().toISOString().split('T')[0]}.csv`, csvContent);
  };

  const exportCustomersCsv = () => {
    const headers = ['Customer ID', 'Full Name', 'Phone', 'Email', 'City', 'State', 'Pincode', 'Tier', 'Orders Count', 'Lifetime Spend INR', 'Last Order Date'];
    const rows = customers.map(c => [
      c.id,
      `"${c.fullName}"`,
      `"${c.phone}"`,
      c.email,
      `"${c.city}"`,
      `"${c.state}"`,
      c.pincode,
      c.tier,
      c.totalOrders,
      c.totalSpent,
      c.lastOrderDate
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCsv(`boota-patron-directory-${new Date().toISOString().split('T')[0]}.csv`, csvContent);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h2 className="text-xl font-bold font-serif text-stone-900 tracking-tight">
            Executive Analytics & Data Export Suite
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Download financial ledgers, variant inventory valuations, GST tax reports, and patron cohort spreadsheets.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-stone-400" />
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value as any)}
            className="border border-stone-300 rounded-lg px-3 py-1.5 text-xs bg-white text-stone-800 outline-none focus:border-[#962949] font-medium"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="diwali_season">Diwali Festive Rush (Oct - Nov)</option>
            <option value="all">Lifetime Atelier Records</option>
          </select>
        </div>
      </div>

      {/* KPI Overview Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">Gross Sales Volume</div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-2 tabular-nums">
            ₹{totalSales.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-stone-400 mt-1">{validOrders.length} successful bookings</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">Total Ensembles Dispatched</div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-2 tabular-nums">
            {totalItemsSold} <span className="text-sm font-normal text-stone-400">units</span>
          </div>
          <div className="text-xs text-stone-400 mt-1">Avg 1.4 garments / basket</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">Active Inventory Valuation</div>
          <div className="text-2xl font-bold font-mono text-[#962949] mt-2 tabular-nums">
            ₹{inventoryValuation.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-stone-400 mt-1">Retail value on boutique racks</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">Total GST Accrued</div>
          <div className="text-2xl font-bold font-mono text-stone-900 mt-2 tabular-nums">
            ₹{totalGstCollected.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-stone-400 mt-1">CGST + SGST breakdown ready</div>
        </div>
      </div>

      {/* One-Click Export Hub */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-stone-900">Standard Data Export Center</h3>
          <p className="text-xs text-stone-500">Generate clean CSV files compatible with Excel, Tally ERP, and CA accounting suites.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-stone-200 rounded-xl bg-stone-50/50 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <FileSpreadsheet className="w-4 h-4 text-[#962949]" />
                <span>Orders Ledger Report</span>
              </div>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Complete transactional history with patron contact, itemized ensembles, GST calculations, courier partner and AWB codes.
              </p>
            </div>
            <button
              onClick={exportOrdersCsv}
              className="w-full py-2 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Orders CSV</span>
            </button>
          </div>

          <div className="p-4 border border-stone-200 rounded-xl bg-stone-50/50 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <Boxes className="w-4 h-4 text-[#962949]" />
                <span>Inventory & Stock Matrix</span>
              </div>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                All variant SKUs across sizes, on-hand counts, workshop cost prices, and current warehouse stock valuations.
              </p>
            </div>
            <button
              onClick={exportInventoryCsv}
              className="w-full py-2 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Inventory CSV</span>
            </button>
          </div>

          <div className="p-4 border border-stone-200 rounded-xl bg-stone-50/50 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <Users className="w-4 h-4 text-[#962949]" />
                <span>Patron Directory & LTV</span>
              </div>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Customer profiles, cities, order frequencies, Royal VIP statuses, and lifetime customer expenditure.
              </p>
            </div>
            <button
              onClick={exportCustomersCsv}
              className="w-full py-2 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Patrons CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Performance Breakdown */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6">
        <h3 className="text-sm font-bold text-stone-900 mb-1">Collection Performance Breakdown</h3>
        <p className="text-xs text-stone-500 mb-4">Volume and gross revenue distributed by festive clothing categories</p>

        <div className="space-y-3 text-xs">
          {Object.entries(categorySalesMap).map(([cat, stats]) => (
            <div key={cat} className="p-3 bg-stone-50 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 text-sm">{cat}</span>
                <span className="text-stone-500 text-xs ml-3 font-mono">{stats.units} units sold</span>
              </div>
              <div className="font-mono font-bold text-[#962949] text-sm">
                ₹{stats.revenue.toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
