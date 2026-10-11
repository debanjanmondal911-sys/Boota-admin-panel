import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  Search,
  Filter,
  History,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  RotateCcw,
  Download,
  X
} from 'lucide-react';
import { useAdmin } from '../context/AdminDataContext';
import { InventoryLog } from '../types/admin';

export const InventoryView: React.FC = () => {
  const { products, adjustStock, inventoryLogs } = useAdmin();

  const [activeTab, setActiveTab] = useState<'matrix' | 'logs'>('matrix');
  const [filterState, setFilterState] = useState<'all' | 'low_stock' | 'out_of_stock'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Stock Adjustment Modal
  const [adjustModalData, setAdjustModalData] = useState<{
    productId: string;
    productTitle: string;
    sku: string;
    size: string;
    currentStock: number;
    colorName: string;
  } | null>(null);

  const [adjustAmount, setAdjustAmount] = useState<number>(5);
  const [adjustType, setAdjustType] = useState<'add' | 'subtract'>('add');
  const [adjustReason, setAdjustReason] = useState<InventoryLog['reason']>('restock');
  const [adjustNotes, setAdjustNotes] = useState('');

  // Flatten variants from all products
  const flatVariants = products.flatMap(prod =>
    prod.variants.map(v => ({
      productId: prod.id,
      productTitle: prod.title,
      productImage: prod.images[0],
      category: prod.category,
      price: prod.price,
      sku: v.sku,
      colorName: v.colorName,
      colorHex: v.colorHex,
      size: v.size,
      stock: v.stock,
      reserved: v.reserved,
      available: Math.max(0, v.stock - v.reserved),
      threshold: v.lowStockThreshold,
      isLow: v.stock <= v.lowStockThreshold,
      isOut: v.stock === 0
    }))
  );

  const filteredVariants = flatVariants.filter(item => {
    const matchesSearch =
      item.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.size.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterState === 'low_stock') return item.isLow && !item.isOut;
    if (filterState === 'out_of_stock') return item.isOut;
    return true;
  });

  const lowStockCount = flatVariants.filter(v => v.isLow && !v.isOut).length;
  const outOfStockCount = flatVariants.filter(v => v.isOut).length;
  const totalUnits = flatVariants.reduce((sum, v) => sum + v.stock, 0);

  const handleConfirmAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalData) return;

    const delta = adjustType === 'add' ? adjustAmount : -adjustAmount;
    adjustStock(
      adjustModalData.productId,
      adjustModalData.sku,
      delta,
      adjustReason,
      adjustNotes
    );

    setAdjustModalData(null);
    setAdjustAmount(5);
    setAdjustNotes('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h2 className="text-xl font-bold font-serif text-stone-900 tracking-tight">
            Inventory & Variant Stock Matrix
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor kidswear sizes, handle artisan batch restocks, defect write-offs, and track stock audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs for Matrix vs Audit Logs */}
          <div className="flex items-center p-1 bg-stone-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'matrix' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Variant Matrix ({flatVariants.length})
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'logs' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit History ({inventoryLogs.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Counters Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setFilterState('all')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            filterState === 'all'
              ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
              : 'bg-white text-stone-800 border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="text-xs font-semibold uppercase tracking-wider opacity-75">Total Stock Units</div>
          <div className="text-2xl font-bold font-mono mt-1 tabular-nums">
            {totalUnits} <span className="text-xs font-normal opacity-70">across all sizes</span>
          </div>
        </div>

        <div
          onClick={() => setFilterState('all')}
          className="p-4 rounded-xl border bg-white text-stone-800 border-stone-200"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">Active SKUs</div>
          <div className="text-2xl font-bold font-mono mt-1 text-stone-900 tabular-nums">
            {flatVariants.length} <span className="text-xs font-normal text-stone-400">variants</span>
          </div>
        </div>

        <div
          onClick={() => setFilterState('low_stock')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            filterState === 'low_stock'
              ? 'bg-[#962949] text-white border-[#962949] shadow-sm'
              : 'bg-white text-stone-800 border-stone-200 hover:border-[#962949]'
          }`}
        >
          <div className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 opacity-80">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            Low Stock Alert
          </div>
          <div className="text-2xl font-bold font-mono mt-1 tabular-nums">
            {lowStockCount} <span className="text-xs font-normal opacity-70">below threshold</span>
          </div>
        </div>

        <div
          onClick={() => setFilterState('out_of_stock')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            filterState === 'out_of_stock'
              ? 'bg-rose-950 text-rose-50 border-rose-950 shadow-sm'
              : 'bg-white text-stone-800 border-stone-200 hover:border-rose-300'
          }`}
        >
          <div className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 opacity-80">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            Out of Stock
          </div>
          <div className="text-2xl font-bold font-mono mt-1 tabular-nums text-rose-950">
            {outOfStockCount} <span className="text-xs font-normal opacity-70">zero balance</span>
          </div>
        </div>
      </div>

      {activeTab === 'matrix' ? (
        <>
          {/* Search & Filter Header */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by outfit name, SKU, size..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg outline-none focus:border-[#962949] bg-stone-50/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">Filter view:</span>
              <button
                onClick={() => setFilterState('all')}
                className={`px-2.5 py-1 text-xs rounded font-medium ${
                  filterState === 'all' ? 'bg-[#962949] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterState('low_stock')}
                className={`px-2.5 py-1 text-xs rounded font-medium ${
                  filterState === 'low_stock' ? 'bg-[#962949] text-white' : 'bg-[#FDF2F4] text-[#962949] hover:bg-[#FCE7EC]'
                }`}
              >
                Low Stock ({lowStockCount})
              </button>
              <button
                onClick={() => setFilterState('out_of_stock')}
                className={`px-2.5 py-1 text-xs rounded font-medium ${
                  filterState === 'out_of_stock' ? 'bg-rose-800 text-white' : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                }`}
              >
                Out of Stock ({outOfStockCount})
              </button>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FDF8F9] text-stone-500 uppercase text-[10px] font-semibold tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="px-5 py-3.5">Outfit & Color</th>
                    <th className="px-4 py-3.5">Size Bracket</th>
                    <th className="px-4 py-3.5 font-mono">SKU</th>
                    <th className="px-4 py-3.5 text-center">On-Hand</th>
                    <th className="px-4 py-3.5 text-center">Reserved</th>
                    <th className="px-4 py-3.5 text-center">Available</th>
                    <th className="px-4 py-3.5 text-center">Threshold</th>
                    <th className="px-4 py-3.5 text-right">Quick Stock Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredVariants.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-12 text-center text-stone-400">
                        <p className="font-semibold text-stone-600 text-sm">No Inventory Records Available</p>
                        <p className="text-xs text-stone-400 mt-1">Products added to the catalog will automatically appear in this variant matrix.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredVariants.map(item => (
                      <tr key={item.sku} className="hover:bg-stone-50/70 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.productImage}
                              alt={item.productTitle}
                              className="w-10 h-10 rounded object-cover border border-stone-200 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-stone-900 line-clamp-1">{item.productTitle}</p>
                              <p className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-stone-300 inline-block"
                                  style={{ backgroundColor: item.colorHex }}
                                />
                                {item.colorName}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="font-bold text-stone-900 px-2 py-0.5 bg-stone-100 rounded text-xs">
                            {item.size}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 font-mono text-stone-600 text-[11px]">
                          {item.sku}
                        </td>

                        <td className="px-4 py-3.5 text-center font-mono font-bold text-stone-900">
                          {item.stock}
                        </td>

                        <td className="px-4 py-3.5 text-center font-mono text-stone-400">
                          {item.reserved}
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                              item.isOut
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : item.isLow
                                ? 'bg-amber-50 text-[#962949] border border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {item.available}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-center font-mono text-stone-500 text-[11px]">
                          ≤ {item.threshold}
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() =>
                                adjustStock(item.productId, item.sku, -1, 'manual', 'Quick -1 adjustment')
                              }
                              disabled={item.stock <= 0}
                              className="p-1.5 bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed rounded text-stone-700 transition-colors"
                              title="Decrease stock by 1"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                adjustStock(item.productId, item.sku, 1, 'manual', 'Quick +1 adjustment')
                              }
                              className="p-1.5 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 transition-colors"
                              title="Increase stock by 1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setAdjustModalData({
                                  productId: item.productId,
                                  productTitle: item.productTitle,
                                  sku: item.sku,
                                  size: item.size,
                                  currentStock: item.stock,
                                  colorName: item.colorName
                                });
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-[#962949] hover:bg-[#FDF2F4] rounded border border-[#F3D0D9] transition-colors cursor-pointer ml-1"
                            >
                              Adjust Batch
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Inventory Audit Log View */
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Inventory Modification Ledger</h3>
              <p className="text-xs text-stone-500">Every restock, shipment deduction, return, and physical audit recorded</p>
            </div>
            <span className="text-xs font-mono text-stone-400">{inventoryLogs.length} events logged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] font-semibold tracking-wider border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-4 py-3">Ensemble & Size</th>
                  <th className="px-4 py-3 font-mono">SKU</th>
                  <th className="px-4 py-3 text-center">Change</th>
                  <th className="px-4 py-3 text-center">New Balance</th>
                  <th className="px-4 py-3">Reason Code</th>
                  <th className="px-4 py-3">Admin / Origin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {inventoryLogs.map(log => (
                  <tr key={log.id} className="hover:bg-stone-50/70">
                    <td className="px-5 py-3 font-mono text-stone-500">
                      {new Date(log.timestamp).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-stone-900 block">{log.productTitle}</span>
                      <span className="text-[11px] text-stone-500">
                        Size: {log.size} · {log.colorName}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-stone-600">{log.variantSku}</td>
                    <td className="px-4 py-3 text-center font-mono font-bold">
                      <span
                        className={
                          log.change > 0
                            ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded'
                            : 'text-rose-700 bg-rose-50 px-2 py-0.5 rounded'
                        }
                      >
                        {log.change > 0 ? `+${log.change}` : log.change}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-stone-900">
                      {log.newStock}
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize font-medium text-stone-800 block">
                        {log.reason.replace('_', ' ')}
                      </span>
                      {log.notes && (
                        <span className="text-[11px] text-stone-500 italic block">{log.notes}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-stone-600">{log.performedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustModalData && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-[#962949]" />
                <h3 className="font-bold text-sm text-stone-900">Adjust Variant Stock</h3>
              </div>
              <button
                onClick={() => setAdjustModalData(null)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAdjustment} className="p-5 text-xs space-y-4">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <p className="font-bold text-stone-900">{adjustModalData.productTitle}</p>
                <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                  <span>Size: <strong className="text-stone-800">{adjustModalData.size}</strong></span>
                  <span>SKU: <code className="font-mono">{adjustModalData.sku}</code></span>
                  <span>Current: <strong className="text-stone-800">{adjustModalData.currentStock}</strong></span>
                </div>
              </div>

              {/* Add vs Subtract */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustType('add')}
                  className={`py-2 rounded-lg font-bold border transition-colors cursor-pointer ${
                    adjustType === 'add'
                      ? 'bg-emerald-800 text-white border-emerald-900'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  + Add Stock (Restock)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('subtract')}
                  className={`py-2 rounded-lg font-bold border transition-colors cursor-pointer ${
                    adjustType === 'subtract'
                      ? 'bg-rose-800 text-white border-rose-900'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  - Deduct (Defect/Damage)
                </button>
              </div>

              {/* Units */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Quantity Units</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={adjustAmount}
                  onChange={e => setAdjustAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none font-mono text-sm focus:border-[#962949]"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Reason Code</label>
                <select
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value as any)}
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none bg-white focus:border-[#962949]"
                >
                  <option value="restock">Artisan Workshop Restock Batch</option>
                  <option value="defect">Embroidery Defect / Damaged Garment</option>
                  <option value="audit_adjustment">Physical Stocktake Count Discrepancy</option>
                  <option value="return">Customer Return Restocked to Shelf</option>
                  <option value="manual">Other Manual Adjustment</option>
                </select>
              </div>

              {/* Note */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Audit Note (Optional)</label>
                <input
                  type="text"
                  value={adjustNotes}
                  onChange={e => setAdjustNotes(e.target.value)}
                  placeholder="e.g. Received shipment from Jaipur workshop #PO-442"
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-[#962949]"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalData(null)}
                  className="px-4 py-2 border border-stone-300 rounded-lg font-medium text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg font-semibold"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
