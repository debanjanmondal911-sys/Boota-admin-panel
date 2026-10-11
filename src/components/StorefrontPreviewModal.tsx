import React from 'react';
import { ExternalLink, X, Globe, Crown, ShoppingBag, Sparkles } from 'lucide-react';

interface StorefrontPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StorefrontPreviewModal: React.FC<StorefrontPreviewModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const storefrontUrl = 'https://boota-luxury-indian-festive-kidswea-eight.vercel.app/';

  return (
    <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="p-3.5 bg-stone-900 text-stone-200 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-[#962949] text-white flex items-center justify-center font-bold">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-white">Live Storefront Frontend</span>
                <span className="text-[10px] text-rose-300 font-mono">boota-luxury-indian-festive-kidswea-eight.vercel.app</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={storefrontUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Embedded Iframe Preview with Fallback Header */}
        <div className="flex-1 w-full bg-stone-100 relative">
          <iframe
            src={storefrontUrl}
            title="Boota Luxury Indian Festive Kidswear Storefront"
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>

        {/* Modal Footer */}
        <div className="p-2.5 bg-white border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Customer storefront running independently on Vercel</span>
          </div>
          <button
            onClick={onClose}
            className="text-stone-700 font-medium hover:text-stone-900"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
