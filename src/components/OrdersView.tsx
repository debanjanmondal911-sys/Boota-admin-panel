import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Truck,
  Printer,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  X,
  CreditCard,
  Ban
} from 'lucide-react';
import { useAdmin } from '../context/AdminDataContext';
import { Order, OrderStatus, PaymentStatus } from '../types/admin';
import { InvoiceModal } from './InvoiceModal';

export const OrdersView: React.FC = () => {
  const { orders, updateOrderStatus, updatePaymentStatus, updateOrderShipping, cancelOrder, settings } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all');

  // Selected Order for Drawer / Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  // Invoice Modal
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Dispatch Form in Drawer
  const [carrierInput, setCarrierInput] = useState('BlueDart Express');
  const [trackingInput, setTrackingInput] = useState('');

  // Filter Orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery) ||
      o.shippingAddress.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingAddress.pincode.includes(searchQuery);

    const matchesStatus = selectedStatus === 'all' || o.orderStatus === selectedStatus;
    const matchesPayment = selectedPaymentStatus === 'all' || o.paymentStatus === selectedPaymentStatus;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleUpdateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !trackingInput.trim()) return;

    updateOrderShipping(selectedOrder.id, carrierInput, trackingInput.trim());
    setSelectedOrder(prev =>
      prev
        ? {
            ...prev,
            carrier: carrierInput,
            trackingNumber: trackingInput.trim(),
            orderStatus: 'shipped'
          }
        : null
    );
    setTrackingInput('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#F3D0D9]/80">
        <div>
          <h2 className="text-xl font-bold font-serif text-stone-900 tracking-tight">
            Orders Fulfillment & Dispatch
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage customer orders, generate AWB tracking codes, track shipments and print GST invoices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500">
            Active Orders: <strong className="font-mono text-stone-800">{orders.filter(o => o.orderStatus !== 'cancelled').length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, Patron, Phone, City..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg outline-none focus:border-[#962949] bg-stone-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs bg-white text-stone-800 outline-none focus:border-[#962949]"
          >
            <option value="all">All Fulfillment Stages</option>
            <option value="confirmed">Confirmed (New)</option>
            <option value="processing">Processing / Tailoring</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={selectedPaymentStatus}
            onChange={e => setSelectedPaymentStatus(e.target.value)}
            className="border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs bg-white text-stone-800 outline-none focus:border-[#962949]"
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Prepaid (Paid)</option>
            <option value="pending_cod">COD Pending</option>
            <option value="cod_collected">COD Collected</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FDF8F9] text-stone-500 uppercase text-[10px] font-semibold tracking-wider border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5">Order ID & Date</th>
                <th className="px-4 py-3.5">Patron & Destination</th>
                <th className="px-4 py-3.5">Ensembles Ordered</th>
                <th className="px-4 py-3.5 text-right">Total Amount</th>
                <th className="px-4 py-3.5 text-center">Payment Status</th>
                <th className="px-4 py-3.5 text-center">Fulfillment Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-stone-400">
                    <p className="font-semibold text-stone-600 text-sm">No Orders in the System Yet</p>
                    <p className="text-xs text-stone-400 mt-1">Customer bookings will appear here for processing and fulfillment.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold font-mono text-stone-900 text-sm flex items-center gap-1.5">
                        {order.id}
                        {order.isGift && (
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-sans font-semibold">
                            Gift
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-semibold text-stone-900">{order.customerName}</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <img
                              src={item.productImage}
                              alt={item.productTitle}
                              className="w-7 h-7 rounded object-cover border border-stone-200 shrink-0"
                            />
                            <div className="line-clamp-1">
                              <span className="font-medium text-stone-800">{item.productTitle}</span>
                              <span className="text-stone-400 text-[11px] ml-1">
                                ({item.size} × {item.quantity})
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="font-mono font-bold text-[#962949] text-sm tabular-nums">
                        ₹{order.total.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-stone-400 uppercase mt-0.5">
                        {order.paymentMethod.replace('_', ' ')}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold uppercase rounded ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : order.paymentStatus === 'pending_cod'
                            ? 'bg-amber-50 text-[#962949] border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {order.paymentStatus.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <select
                        value={order.orderStatus}
                        onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-[11px] font-semibold rounded px-2 py-1 border outline-none cursor-pointer ${
                          order.orderStatus === 'delivered'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : order.orderStatus === 'shipped'
                            ? 'bg-sky-100 text-sky-900 border-sky-300'
                            : order.orderStatus === 'processing'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : order.orderStatus === 'cancelled'
                            ? 'bg-stone-200 text-stone-700 border-stone-300'
                            : 'bg-stone-100 text-stone-800 border-stone-300'
                        }`}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setInvoiceOrder(order)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                          title="Print GST Invoice & Slip"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-2.5 py-1 text-xs font-semibold text-[#962949] hover:bg-[#FDF2F4] rounded border border-[#F3D0D9] transition-colors cursor-pointer"
                        >
                          Details &rarr;
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

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Drawer Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#962949]" />
                <h3 className="font-bold text-sm text-stone-900">
                  Order Dossier: <span className="font-mono">{selectedOrder.id}</span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Order Status Control Strip */}
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-stone-500 uppercase font-bold tracking-wider block">
                    Current Fulfillment State
                  </span>
                  <div className="text-sm font-bold text-stone-900 capitalize mt-0.5">
                    {selectedOrder.orderStatus}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={e => {
                      updateOrderStatus(selectedOrder.id, e.target.value as OrderStatus);
                      setSelectedOrder({ ...selectedOrder, orderStatus: e.target.value as OrderStatus });
                    }}
                    className="border border-stone-300 rounded-lg px-3 py-1.5 bg-white text-xs font-semibold outline-none focus:border-[#962949]"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">In Tailoring / Packing</option>
                    <option value="shipped">Handed to Courier (Shipped)</option>
                    <option value="delivered">Delivered to Patron</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={() => setInvoiceOrder(selectedOrder)}
                    className="px-3 py-1.5 bg-[#962949] text-white rounded-lg font-medium flex items-center gap-1.5 hover:bg-[#7E1F3B] cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Invoice</span>
                  </button>
                </div>
              </div>

              {/* Items in Order */}
              <div>
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-2.5">
                  Handcrafted Ensembles in Order ({selectedOrder.items.length})
                </h4>
                <div className="border border-stone-200 rounded-lg divide-y divide-stone-100 overflow-hidden">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.productImage}
                          alt={item.productTitle}
                          className="w-12 h-12 rounded object-cover border border-stone-200"
                        />
                        <div>
                          <p className="font-bold text-stone-900">{item.productTitle}</p>
                          <p className="text-[11px] text-stone-500">
                            Size: <strong className="text-stone-800">{item.size}</strong> · Color: {item.colorName} · SKU: {item.sku}
                          </p>
                          <p className="text-[11px] text-stone-400 mt-0.5">
                            Qty: {item.quantity} × ₹{item.unitPrice.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <div className="font-mono font-bold text-stone-900 text-sm">
                        ₹{item.totalPrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patron & Shipping Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-stone-200 rounded-lg">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-2">
                    Patron Details
                  </h4>
                  <p className="font-bold text-stone-800">{selectedOrder.customerName}</p>
                  <p className="text-stone-600 font-mono mt-0.5">{selectedOrder.customerPhone}</p>
                  <p className="text-stone-500 mt-0.5">{selectedOrder.customerEmail}</p>

                  {selectedOrder.isGift && (
                    <div className="mt-3 p-2 bg-amber-50 rounded border border-amber-200 text-[11px]">
                      <strong className="text-amber-900 block">🎁 Festive Gift Order</strong>
                      <p className="italic text-stone-700 mt-0.5">"{selectedOrder.giftMessage}"</p>
                    </div>
                  )}
                </div>

                <div className="p-4 border border-stone-200 rounded-lg">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-2">
                    Delivery Address
                  </h4>
                  <p className="text-stone-700 leading-relaxed">
                    {selectedOrder.shippingAddress.addressLine1}
                    {selectedOrder.shippingAddress.addressLine2 ? `, ${selectedOrder.shippingAddress.addressLine2}` : ''}
                    <br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                  </p>
                </div>
              </div>

              {/* Courier Carrier & AWB Tracking */}
              <div className="p-4 border border-stone-200 rounded-lg">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-2 flex items-center justify-between">
                  <span>Logistics Carrier & AWB Tracking</span>
                  {selectedOrder.trackingNumber && (
                    <span className="text-emerald-700 font-mono font-medium">AWB Active</span>
                  )}
                </h4>

                {selectedOrder.trackingNumber ? (
                  <div className="flex items-center justify-between p-3 bg-stone-50 rounded border border-stone-200">
                    <div>
                      <p className="font-bold text-stone-900">{selectedOrder.carrier}</p>
                      <p className="font-mono text-stone-600 mt-0.5">AWB: {selectedOrder.trackingNumber}</p>
                    </div>
                    {selectedOrder.trackingUrl && (
                      <a
                        href={selectedOrder.trackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-white hover:bg-stone-100 border border-stone-300 rounded text-xs font-medium text-stone-800 flex items-center gap-1"
                      >
                        <span>Live Tracking</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleUpdateShipping} className="flex flex-col sm:flex-row gap-2 mt-2">
                    <select
                      value={carrierInput}
                      onChange={e => setCarrierInput(e.target.value)}
                      className="border border-stone-300 rounded p-1.5 bg-white text-xs"
                    >
                      <option value="BlueDart Express">BlueDart Express Air</option>
                      <option value="Delhivery Surface">Delhivery Logistics</option>
                      <option value="DTDC Priority">DTDC Priority Air</option>
                      <option value="Shiprocket">Shiprocket Courier</option>
                    </select>
                    <input
                      type="text"
                      required
                      placeholder="Enter AWB / Airway Bill Number..."
                      value={trackingInput}
                      onChange={e => setTrackingInput(e.target.value)}
                      className="border border-stone-300 rounded p-1.5 flex-1 text-xs font-mono outline-none focus:border-[#962949]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded font-medium text-xs whitespace-nowrap cursor-pointer"
                    >
                      Update & Mark Shipped
                    </button>
                  </form>
                )}
              </div>

              {/* Payment & Financial Breakdown */}
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon Discount ({selectedOrder.couponCode}):</span>
                    <span className="font-mono">-₹{selectedOrder.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>GST (12%):</span>
                  <span className="font-mono">₹{selectedOrder.gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping:</span>
                  <span className="font-mono">{selectedOrder.shippingFee === 0 ? 'FREE' : `₹${selectedOrder.shippingFee}`}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 text-sm pt-2 border-t border-stone-200">
                  <span>Grand Total:</span>
                  <span className="font-mono text-[#962949] font-bold">
                    ₹{selectedOrder.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Cancel Order Action */}
              {selectedOrder.orderStatus !== 'cancelled' && (
                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="text-stone-400">Need to cancel this booking?</span>
                  <button
                    onClick={() => {
                      const reason = prompt('Please enter cancellation reason for patron:');
                      if (reason !== null) {
                        cancelOrder(selectedOrder.id, reason);
                        setSelectedOrder({ ...selectedOrder, orderStatus: 'cancelled' });
                      }
                    }}
                    className="px-3 py-1 text-red-700 hover:bg-red-50 rounded border border-red-200 font-medium cursor-pointer"
                  >
                    Cancel Booking & Refund
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceOrder && (
        <InvoiceModal
          order={invoiceOrder}
          settings={settings}
          onClose={() => setInvoiceOrder(null)}
        />
      )}
    </div>
  );
};
