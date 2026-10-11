import React, { useState } from 'react';
import {
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Truck,
  ArrowRight,
  RefreshCw,
  CreditCard,
  X,
  AlertTriangle,
  Package
} from 'lucide-react';
import { useAdmin } from '../context/AdminDataContext';
import { ReturnTicket, ReturnStatus } from '../types/admin';

export const ReturnsView: React.FC = () => {
  const { returns, updateReturnStatus, processExchangeOrder } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<ReturnTicket | null>(null);

  // Modal actions
  const [refundAmountInput, setRefundAmountInput] = useState<number>(0);
  const [refundTxInput, setRefundTxInput] = useState('');
  const [exchangeSizeInput, setExchangeSizeInput] = useState('');

  const filteredReturns = returns.filter(r => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const openTicketModal = (ticket: ReturnTicket) => {
    setSelectedTicket(ticket);
    setRefundAmountInput(ticket.items[0]?.amount || 0);
    setRefundTxInput(`RFND-RZP-${Math.floor(1000000 + Math.random() * 9000000)}`);
    setExchangeSizeInput(ticket.items[0]?.requestedExchangeSize || '3-4Y');
  };

  const handleApprove = () => {
    if (!selectedTicket) return;
    updateReturnStatus(selectedTicket.id, 'approved');
    setSelectedTicket({ ...selectedTicket, status: 'approved' });
  };

  const handleReject = () => {
    if (!selectedTicket) return;
    const reason = prompt('Reason for rejecting return request:');
    if (reason !== null) {
      updateReturnStatus(selectedTicket.id, 'rejected');
      setSelectedTicket({ ...selectedTicket, status: 'rejected' });
    }
  };

  const handleProcessRefund = () => {
    if (!selectedTicket) return;
    updateReturnStatus(selectedTicket.id, 'refunded', {
      amount: refundAmountInput,
      txId: refundTxInput
    });
    setSelectedTicket({
      ...selectedTicket,
      status: 'refunded',
      refundAmount: refundAmountInput,
      refundTransactionId: refundTxInput
    });
  };

  const handleProcessExchange = () => {
    if (!selectedTicket) return;
    processExchangeOrder(selectedTicket.id, exchangeSizeInput);
    setSelectedTicket({
      ...selectedTicket,
      status: 'exchange_shipped'
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#F3D0D9]/80">
        <div>
          <h2 className="text-xl font-bold font-serif text-stone-900 tracking-tight">
            Returns & Doorstep Size Exchanges
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Process size replacements, schedule reverse logistics pickups and issue customer refunds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500">
            Awaiting Review: <strong className="font-mono text-[#962949]">{returns.filter(r => r.status === 'requested').length}</strong> tickets
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ticket ID, Order ID, Patron..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg outline-none focus:border-[#962949] bg-stone-50/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs bg-white text-stone-800 outline-none focus:border-[#962949]"
          >
            <option value="all">All Statuses</option>
            <option value="requested">Pending Approval</option>
            <option value="approved">Pickup Approved</option>
            <option value="refunded">Refund Issued</option>
            <option value="exchange_shipped">Exchange Dispatched</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FDF8F9] text-stone-500 uppercase text-[10px] font-semibold tracking-wider border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5">Ticket & Order</th>
                <th className="px-4 py-3.5">Patron</th>
                <th className="px-4 py-3.5">Ensemble Details</th>
                <th className="px-4 py-3.5 text-center">Request Type</th>
                <th className="px-4 py-3.5">Reason Stated</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-stone-400">
                    <p className="font-semibold text-stone-600 text-sm">No Return or Exchange Requests</p>
                    <p className="text-xs text-stone-400 mt-1">Doorstep size exchanges and refund tickets will be listed here.</p>
                  </td>
                </tr>
              ) : (
                filteredReturns.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold font-mono text-stone-900">{ticket.id}</div>
                      <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                        Ref: {ticket.orderId}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-semibold text-stone-900">{ticket.customerName}</div>
                      <div className="text-[11px] text-stone-500 font-mono mt-0.5">{ticket.customerPhone}</div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={ticket.items[0]?.productImage}
                          alt={ticket.items[0]?.productTitle}
                          className="w-10 h-10 rounded object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <p className="font-medium text-stone-900 line-clamp-1">{ticket.items[0]?.productTitle}</p>
                          <p className="text-[11px] text-stone-500">
                            Current Size: <span className="font-bold text-stone-700">{ticket.items[0]?.size}</span>
                            {ticket.items[0]?.requestedExchangeSize && (
                              <span className="text-amber-900 font-semibold ml-1.5">
                                &rarr; Wants {ticket.items[0]?.requestedExchangeSize}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                          ticket.type === 'exchange'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-stone-100 text-stone-800 border border-stone-300'
                        }`}
                      >
                        {ticket.type === 'exchange' ? 'Size Exchange' : 'Return & Refund'}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-semibold text-stone-800 block">{ticket.reason}</span>
                      {ticket.reasonDetails && (
                        <span className="text-[11px] text-stone-500 line-clamp-1 italic mt-0.5">
                          "{ticket.reasonDetails}"
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold uppercase rounded ${
                          ticket.status === 'requested'
                            ? 'bg-rose-100 text-rose-900 border border-rose-200'
                            : ticket.status === 'approved'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : ticket.status === 'refunded'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            : ticket.status === 'exchange_shipped'
                            ? 'bg-sky-100 text-sky-900 border border-sky-200'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => openTicketModal(ticket)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#962949] hover:bg-[#FDF2F4] rounded border border-[#F3D0D9] transition-colors cursor-pointer"
                      >
                        Resolve &rarr;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details & Resolution Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#962949]" />
                <h3 className="font-bold text-sm text-stone-900">
                  Resolve Return #{selectedTicket.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 text-xs space-y-4">
              {/* Info Box */}
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                <div className="flex justify-between font-bold text-stone-900">
                  <span>Patron: {selectedTicket.customerName}</span>
                  <span className="font-mono text-stone-600">{selectedTicket.orderId}</span>
                </div>
                <p className="text-stone-500 font-mono">{selectedTicket.customerPhone} · {selectedTicket.customerEmail}</p>
                <div className="pt-2 border-t border-stone-200 mt-2">
                  <p className="font-semibold text-stone-800">
                    Reason: <span className="text-rose-900">{selectedTicket.reason}</span>
                  </p>
                  {selectedTicket.reasonDetails && (
                    <p className="text-stone-600 italic mt-0.5">"{selectedTicket.reasonDetails}"</p>
                  )}
                </div>
              </div>

              {/* Garment Details */}
              <div className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg">
                <img
                  src={selectedTicket.items[0]?.productImage}
                  alt={selectedTicket.items[0]?.productTitle}
                  className="w-12 h-12 rounded object-cover border border-stone-200"
                />
                <div>
                  <p className="font-bold text-stone-900">{selectedTicket.items[0]?.productTitle}</p>
                  <p className="text-[11px] text-stone-500">
                    Ordered Size: <strong className="text-stone-800">{selectedTicket.items[0]?.size}</strong> ·
                    Value: <span className="font-mono text-[#962949] font-bold">₹{selectedTicket.items[0]?.amount.toLocaleString('en-IN')}</span>
                  </p>
                </div>
              </div>

              {/* Status Actions */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                  Fulfillment Actions
                </h4>

                {/* Approve Reverse Pickup */}
                {selectedTicket.status === 'requested' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleApprove}
                      className="w-full py-2 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Approve Reverse Pickup</span>
                    </button>
                    <button
                      onClick={handleReject}
                      className="w-full py-2 bg-white hover:bg-rose-50 border border-rose-300 text-rose-800 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Request</span>
                    </button>
                  </div>
                )}

                {/* If approved & Exchange type */}
                {selectedTicket.type === 'exchange' && selectedTicket.status !== 'exchange_shipped' && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg space-y-2">
                    <span className="font-bold text-[#962949] block">Dispatch Replacement Size Ensemble</span>
                    <div className="flex gap-2">
                      <select
                        value={exchangeSizeInput}
                        onChange={e => setExchangeSizeInput(e.target.value)}
                        className="p-1.5 border border-stone-300 rounded bg-white font-medium flex-1"
                      >
                        <option value="0-6M">0-6M</option>
                        <option value="6-12M">6-12M</option>
                        <option value="1-2Y">1-2Y</option>
                        <option value="2-3Y">2-3Y</option>
                        <option value="3-4Y">3-4Y</option>
                        <option value="5-6Y">5-6Y</option>
                        <option value="7-8Y">7-8Y</option>
                        <option value="9-10Y">9-10Y</option>
                      </select>
                      <button
                        onClick={handleProcessExchange}
                        className="px-4 py-1.5 bg-[#962949] text-white rounded font-semibold hover:bg-[#7E1F3B]"
                      >
                        Generate Exchange Order
                      </button>
                    </div>
                  </div>
                )}

                {/* If approved & Refund type */}
                {selectedTicket.type === 'refund' && selectedTicket.status !== 'refunded' && (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-2">
                    <span className="font-bold text-emerald-950 block">Process Razorpay Gateway Refund</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-stone-500 font-semibold block mb-0.5">Refund Amount (₹)</label>
                        <input
                          type="number"
                          value={refundAmountInput}
                          onChange={e => setRefundAmountInput(Number(e.target.value))}
                          className="w-full p-1.5 border border-stone-300 rounded font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-stone-500 font-semibold block mb-0.5">Refund Reference ID</label>
                        <input
                          type="text"
                          value={refundTxInput}
                          onChange={e => setRefundTxInput(e.target.value)}
                          className="w-full p-1.5 border border-stone-300 rounded font-mono text-xs"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleProcessRefund}
                      className="w-full mt-2 py-2 bg-emerald-800 text-white rounded-lg font-semibold hover:bg-emerald-700"
                    >
                      Confirm ₹{refundAmountInput.toLocaleString('en-IN')} Refund to Patron
                    </button>
                  </div>
                )}

                {selectedTicket.status === 'refunded' && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 inline-block mr-1 text-emerald-600" />
                    Refund of ₹{selectedTicket.refundAmount?.toLocaleString('en-IN')} settled ({selectedTicket.refundTransactionId}).
                  </div>
                )}

                {selectedTicket.status === 'exchange_shipped' && (
                  <div className="p-3 bg-sky-50 text-sky-800 rounded border border-sky-200">
                    <Package className="w-4 h-4 inline-block mr-1 text-sky-600" />
                    Replacement order dispatched ({selectedTicket.exchangeOrderId}).
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 border-t border-stone-200 flex justify-end bg-stone-50">
              <button
                onClick={() => setSelectedTicket(null)}
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
