import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Trash2,
  Filter,
  Search,
  Sparkles,
  ShieldCheck,
  X,
  Send
} from 'lucide-react';
import { useAdmin } from '../context/AdminDataContext';
import { ProductReview } from '../types/admin';

export const ReviewsView: React.FC = () => {
  const { reviews, moderateReview, replyToReview, deleteReview } = useAdmin();

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Reply Modal
  const [replyingReview, setReplyingReview] = useState<ProductReview | null>(null);
  const [replyText, setReplyText] = useState('');

  const filteredReviews = reviews.filter(r => {
    const matchesSearch =
      r.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenReply = (review: ProductReview) => {
    setReplyingReview(review);
    setReplyText(review.merchantReply || '');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingReview) return;
    replyToReview(replyingReview.id, replyText);
    setReplyingReview(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h2 className="text-xl font-bold font-serif text-stone-900 tracking-tight">
            Patron Reviews & Star Moderation
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Approve verified patron testimonials, feature testimonials on product pages and post official Atelier replies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500">
            Pending Moderation: <strong className="font-mono text-[#962949]">{reviews.filter(r => r.status === 'pending').length}</strong> reviews
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ensemble, patron name, or review content..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg outline-none focus:border-[#962949] bg-stone-50/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500">Filter:</span>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 text-xs rounded font-medium ${
              filterStatus === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-2.5 py-1 text-xs rounded font-medium ${
              filterStatus === 'pending' ? 'bg-[#962949] text-white' : 'bg-[#FDF2F4] text-[#962949] hover:bg-amber-100'
            }`}
          >
            Pending ({reviews.filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-2.5 py-1 text-xs rounded font-medium ${
              filterStatus === 'approved' ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Approved ({reviews.filter(r => r.status === 'approved').length})
          </button>
        </div>
      </div>

      {/* Reviews Cards */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-400 italic text-xs">
            No reviews match your selected filter criteria.
          </div>
        ) : (
          filteredReviews.map(review => (
            <div
              key={review.id}
              className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 text-xs space-y-3"
            >
              {/* Review Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="font-bold text-stone-900 text-sm">{review.title}</span>

                  {review.isFeatured && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold uppercase rounded ${
                      review.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        : review.status === 'pending'
                        ? 'bg-amber-100 text-[#962949] border border-amber-200'
                        : 'bg-rose-100 text-rose-900 border border-rose-200'
                    }`}
                  >
                    {review.status}
                  </span>
                  <span className="text-stone-400 font-mono text-[11px]">{review.date}</span>
                </div>
              </div>

              {/* Ensemble and Reviewer info */}
              <div className="flex items-center gap-2 text-stone-500">
                <span className="font-semibold text-stone-800">{review.customerName}</span>
                {review.childAge && <span>(Child: {review.childAge})</span>}
                <span>·</span>
                <span className="text-[#962949] font-medium">Outfit: {review.productTitle}</span>
                {review.verifiedPurchase && (
                  <span className="flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Order
                  </span>
                )}
              </div>

              {/* Comment text */}
              <p className="text-stone-700 leading-relaxed text-xs bg-stone-50/70 p-3 rounded-lg border border-stone-100">
                "{review.comment}"
              </p>

              {/* Official Atelier Reply (if any) */}
              {review.merchantReply && (
                <div className="p-3 bg-[#FDF8F9] rounded-lg border border-[#F3D0D9] ml-4 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#962949] text-[11px]">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-800" />
                    <span>Boota Atelier Concierge:</span>
                  </div>
                  <p className="text-stone-700 leading-relaxed italic">{review.merchantReply}</p>
                </div>
              )}

              {/* Action Buttons Strip */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {review.status !== 'approved' && (
                    <button
                      onClick={() => moderateReview(review.id, 'approved')}
                      className="px-3 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {review.status !== 'rejected' && (
                    <button
                      onClick={() => moderateReview(review.id, 'rejected')}
                      className="px-3 py-1 bg-white hover:bg-rose-50 border border-stone-300 hover:border-rose-300 text-stone-700 hover:text-rose-700 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}

                  <button
                    onClick={() => moderateReview(review.id, review.status, !review.isFeatured)}
                    className="px-3 py-1 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 rounded text-xs font-medium cursor-pointer"
                  >
                    {review.isFeatured ? 'Unfeature' : 'Feature on Product Page'}
                  </button>

                  <button
                    onClick={() => handleOpenReply(review)}
                    className="px-3 py-1 bg-white hover:bg-[#FDF2F4] border border-stone-300 hover:border-[#F3D0D9] text-[#962949] rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{review.merchantReply ? 'Edit Reply' : 'Public Reply'}</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Delete review permanently?')) deleteReview(review.id);
                  }}
                  className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded"
                  title="Delete Review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      {replyingReview && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-800" />
                <h3 className="font-bold text-sm text-stone-900">
                  Reply as Boota Atelier Concierge
                </h3>
              </div>
              <button onClick={() => setReplyingReview(null)} className="p-1 text-stone-400 hover:text-stone-600 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendReply} className="p-5 text-xs space-y-4">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <p className="font-bold text-stone-900">{replyingReview.customerName}</p>
                <p className="text-stone-600 italic mt-0.5">"{replyingReview.comment}"</p>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Official Concierge Reply</label>
                <textarea
                  rows={4}
                  required
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Thank the patron, mention specific artisanal details (pure mulmul lining, hand zardozi), and wish happy festivities..."
                  className="w-full p-2.5 border border-stone-300 rounded-lg outline-none focus:border-[#962949] leading-relaxed text-xs"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReplyingReview(null)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Reply</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
