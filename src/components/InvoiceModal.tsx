import React from 'react';
import { Printer, Download, X, CheckCircle2 } from 'lucide-react';
import { Order, StoreSettings } from '../types/admin';
import { BootaLogo } from './BootaLogo';

interface InvoiceModalProps {
  order: Order;
  settings: StoreSettings;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, settings, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  // Calculate CGST and SGST splits (50% each of total GST)
  const halfGst = Math.round(order.gstAmount / 2);

  return (
    <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Top Control Bar (Non-printable) */}
        <div className="p-3 bg-stone-900 text-stone-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-rose-300">GST Tax Invoice & Packing Slip</span>
            <span className="text-stone-400">·</span>
            <span className="font-mono text-stone-300">{order.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-white rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 text-stone-900 text-xs bg-white font-sans print:p-0 print:m-0">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-[#962949] pb-5">
            <div>
              <BootaLogo variant="horizontal" size="md" showSubtitle={false} />
              <p className="text-[11px] text-stone-600 mt-2 max-w-sm leading-relaxed">
                {settings.warehouseAddress || 'DLF Phase 5, Golf Course Road, Gurugram, Haryana - 122002'}
              </p>
              <p className="text-[11px] font-mono text-stone-700 mt-0.5">
                GSTIN: <strong>{settings.gstin || '06AABCB1234D1Z5'}</strong> · CIN: U18101HR2024PTC119022
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-[#FDF2F4] text-[#962949] border border-[#F3D0D9] text-[11px] font-bold uppercase tracking-wider rounded mb-2">
                Original Tax Invoice
              </span>
              <p className="font-mono font-bold text-base text-stone-900">{order.id}</p>
              <p className="text-stone-500 mt-0.5">Invoice Date: {invoiceDate}</p>
              <p className="text-stone-500">
                Payment: <strong className="uppercase text-stone-800">{order.paymentMethod.replace('_', ' ')}</strong> ({order.paymentStatus})
              </p>
            </div>
          </div>

          {/* Billing & Shipping Grid */}
          <div className="grid grid-cols-2 gap-6 py-5 border-b border-stone-200">
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Billed & Shipped To (Patron)
              </h3>
              <p className="font-bold text-stone-900 text-sm">{order.shippingAddress.fullName}</p>
              <p className="text-stone-600 leading-relaxed mt-0.5">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                <br />
                {order.shippingAddress.country}
              </p>
              <p className="text-stone-700 mt-1.5 font-mono">
                Phone: {order.shippingAddress.phone}
              </p>
            </div>

            <div className="text-right">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Dispatch Logistics Details
              </h3>
              <p className="text-stone-700">
                Carrier Partner: <strong>{order.carrier || 'BlueDart Express Air'}</strong>
              </p>
              <p className="text-stone-700 font-mono">
                AWB Tracking #: <strong>{order.trackingNumber || 'Pending AWB Generation'}</strong>
              </p>
              <p className="text-stone-500 mt-1">
                Place of Supply: {order.shippingAddress.state} (State Code)
              </p>
              {order.isGift && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-left text-[11px]">
                  <strong className="text-amber-900">🎁 Festive Gift Message:</strong>
                  <p className="italic text-stone-700 mt-0.5">"{order.giftMessage}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="py-4">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone-300 text-[10px] uppercase font-bold text-stone-500">
                  <th className="py-2">Item & Ensemble</th>
                  <th className="py-2 font-mono">HSN Code</th>
                  <th className="py-2 text-center">Size</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Rate (₹)</th>
                  <th className="py-2 text-right">Taxable Value (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="py-2">
                    <td className="py-2.5">
                      <div className="font-bold text-stone-900">{item.productTitle}</div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        SKU: {item.sku} · Color: {item.colorName}
                      </div>
                    </td>
                    <td className="py-2.5 font-mono text-stone-600">62092000</td>
                    <td className="py-2.5 text-center font-bold text-stone-800">{item.size}</td>
                    <td className="py-2.5 text-center font-mono">{item.quantity}</td>
                    <td className="py-2.5 text-right font-mono">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 text-right font-mono font-semibold">
                      ₹{item.totalPrice.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Tax Breakdown */}
          <div className="border-t border-stone-200 pt-4 grid grid-cols-2 gap-6">
            <div className="text-[11px] text-stone-500 leading-relaxed">
              <p className="font-bold text-stone-700 mb-1">Terms & Festive Return Policy:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                <li>Free doorstep size exchange permitted within 7 days of delivery.</li>
                <li>Garment must remain unworn with original Boota silk security seal and tag intact.</li>
                <li>Pure dry clean only recommended to preserve hand zari embroidery.</li>
              </ul>
            </div>

            <div className="space-y-1.5 text-right text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal:</span>
                <span className="font-mono">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Festive Discount ({order.couponCode || 'Promo'}):</span>
                  <span className="font-mono">-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Shipping & Insurance:</span>
                <span className="font-mono">{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-stone-600 pt-1 border-t border-stone-100">
                <span>CGST (6%):</span>
                <span className="font-mono">₹{halfGst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>SGST (6%):</span>
                <span className="font-mono">₹{halfGst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-stone-900 pt-2 border-t border-stone-300">
                <span>Grand Total (INR):</span>
                <span className="font-mono text-[#962949] font-bold">
                  ₹{order.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="mt-8 pt-6 border-t border-stone-200 flex items-center justify-between">
            <div className="text-[10px] text-stone-400">
              This is a computer-generated tax invoice. No physical signature required.
              <br />
              Atelier Support: {settings.supportEmail} · Phone: {settings.supportPhone}
            </div>
            <div className="text-right">
              <div className="font-serif italic text-sm text-stone-700">Simran Kaur</div>
              <div className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                For Boota Luxury Kidswear
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
