import React, { useState } from 'react';
import {
  LayoutTemplate,
  Plus,
  Edit2,
  Trash2,
  HelpCircle,
  Megaphone,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useAdmin } from '../context/AdminDataContext';
import { CMSBanner, FAQItem } from '../types/admin';

export const ContentView: React.FC = () => {
  const {
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    announcement,
    updateAnnouncement,
    faqs,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    showToast
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'banners' | 'announcement' | 'faqs' | 'about' | 'policies'>('banners');

  // Banner Modal
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<CMSBanner | null>(null);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerCtaText, setBannerCtaText] = useState('Explore Festive Ensembles');
  const [bannerCtaLink, setBannerCtaLink] = useState('/collections/festive-2026');
  const [bannerImage, setBannerImage] = useState('/src/assets/images/boota_banner_festive_1791696746200.jpg');
  const [bannerBadge, setBannerBadge] = useState('Limited Festive Drop');
  const [bannerActive, setBannerActive] = useState(true);

  // Announcement State
  const [annMessage, setAnnMessage] = useState(announcement.message);
  const [annHighlight, setAnnHighlight] = useState(announcement.highlightText || '');
  const [annActive, setAnnActive] = useState(announcement.isActive);

  // FAQ Modal
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [faqCategory, setFaqCategory] = useState<FAQItem['category']>('Sizing & Fit');
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');

  // Story & Policies Local State
  const [heritageStory, setHeritageStory] = useState(
    "Founded with a devotion to preserving royal Indian textiles, Boota crafts bespoke festive wear exclusively for infants and children. Every sherwani, brocade lehenga, and angrakha is meticulously lined with 100% breathable pure mulmul cotton, shielding delicate skin from scratchy seams while presenting magnificent zardozi and gota patti handiwork."
  );
  const [artisanPledge, setArtisanPledge] = useState(
    "Handcrafted in collaboration with master karigars across Jaipur, Varanasi, and Kutch. We practice fair-wage artisan compensation and zero-plastic festive packaging."
  );

  const [shippingPolicy, setShippingPolicy] = useState(
    "Domestic delivery across India via BlueDart Express Air. Metro orders delivered within 2-3 business days. Expedited next-day dispatch available during Diwali and wedding seasons."
  );
  const [exchangePolicy, setExchangePolicy] = useState(
    "Complimentary 7-day doorstep size exchange. If the outfit is slightly snug or loose on your little one, we send a reverse courier to collect it and dispatch the ideal size at no extra cost."
  );

  const openCreateBanner = () => {
    setEditingBanner(null);
    setBannerTitle('');
    setBannerSubtitle('');
    setBannerCtaText('Explore Festive Ensembles');
    setBannerCtaLink('/collections/festive-2026');
    setBannerImage('/src/assets/images/boota_banner_festive_1791696746200.jpg');
    setBannerBadge('Diwali Special');
    setBannerActive(true);
    setIsBannerModalOpen(true);
  };

  const openEditBanner = (ban: CMSBanner) => {
    setEditingBanner(ban);
    setBannerTitle(ban.title);
    setBannerSubtitle(ban.subtitle);
    setBannerCtaText(ban.ctaText);
    setBannerCtaLink(ban.ctaLink);
    setBannerImage(ban.imageUrl);
    setBannerBadge(ban.badge || '');
    setBannerActive(ban.isActive);
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle) return;

    if (editingBanner) {
      updateBanner(editingBanner.id, {
        title: bannerTitle,
        subtitle: bannerSubtitle,
        ctaText: bannerCtaText,
        ctaLink: bannerCtaLink,
        imageUrl: bannerImage,
        badge: bannerBadge,
        isActive: bannerActive
      });
    } else {
      addBanner({
        title: bannerTitle,
        subtitle: bannerSubtitle,
        ctaText: bannerCtaText,
        ctaLink: bannerCtaLink,
        imageUrl: bannerImage,
        badge: bannerBadge,
        position: 'hero_primary',
        isActive: bannerActive,
        displayOrder: banners.length + 1
      });
    }

    setIsBannerModalOpen(false);
  };

  const handleSaveAnnouncement = () => {
    updateAnnouncement({
      message: annMessage,
      highlightText: annHighlight,
      isActive: annActive
    });
  };

  const openCreateFaq = () => {
    setEditingFaq(null);
    setFaqCategory('Sizing & Fit');
    setFaqQuestion('');
    setFaqAnswer('');
    setIsFaqModalOpen(true);
  };

  const openEditFaq = (f: FAQItem) => {
    setEditingFaq(f);
    setFaqCategory(f.category);
    setFaqQuestion(f.question);
    setFaqAnswer(f.answer);
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion || !faqAnswer) return;

    if (editingFaq) {
      updateFAQ(editingFaq.id, {
        category: faqCategory,
        question: faqQuestion,
        answer: faqAnswer
      });
    } else {
      addFAQ({
        category: faqCategory,
        question: faqQuestion,
        answer: faqAnswer,
        displayOrder: faqs.length + 1,
        isActive: true
      });
    }

    setIsFaqModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h2 className="text-xl font-bold font-serif text-stone-900 tracking-tight">
            Storefront Content & CMS Management
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Update homepage hero banners, announcement tickers, FAQs, brand legacy and customer policies.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-stone-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('banners')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'banners' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Hero Banners ({banners.length})
          </button>
          <button
            onClick={() => setActiveTab('announcement')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'announcement' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Announcement Bar
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'faqs' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            FAQs ({faqs.length})
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'about' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Heritage & Story
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'policies' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Store Policies
          </button>
        </div>
      </div>

      {/* Tab 1: Hero Banners */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Homepage Editorial Slides</h3>
              <p className="text-xs text-stone-500">Curate luxury banners shown on customer homepage</p>
            </div>
            <button
              onClick={openCreateBanner}
              className="px-3.5 py-1.5 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Hero Slide</span>
            </button>
          </div>

          {banners.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center shadow-xs">
              <p className="font-semibold text-stone-600 text-sm">No Hero Slides Configured Yet</p>
              <p className="text-xs text-stone-400 mt-1 mb-4">
                Add homepage banners showcasing collections, seasonal festive edits, or special announcements.
              </p>
              <button
                onClick={openCreateBanner}
                className="px-4 py-2 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create First Hero Slide</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((ban, idx) => (
                <div
                  key={ban.id}
                  className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="h-44 w-full relative overflow-hidden bg-stone-100">
                      <img src={ban.imageUrl} alt={ban.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-linear-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-4">
                        <div>
                          {ban.badge && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300">
                              {ban.badge}
                            </span>
                          )}
                          <h4 className="text-white font-bold text-sm line-clamp-1">{ban.title}</h4>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-2 text-xs">
                      <p className="text-stone-600 line-clamp-2">{ban.subtitle}</p>
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                        <span>CTA: <strong>{ban.ctaText}</strong></span>
                        <span className="font-mono text-stone-400">{ban.ctaLink}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase rounded ${
                        ban.isActive ? 'bg-emerald-100 text-emerald-900' : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {ban.isActive ? 'Live on Store' : 'Draft'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditBanner(ban)}
                        className="p-1.5 text-stone-600 hover:text-[#962949] rounded cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this banner slide?')) deleteBanner(ban.id);
                        }}
                        className="p-1.5 text-stone-400 hover:text-red-700 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Announcement Bar */}
      {activeTab === 'announcement' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 max-w-2xl space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Festive Top Announcement Bar</h3>
            <p className="text-stone-500 mt-0.5">
              Pinned promotional notification displayed above the storefront navigation.
            </p>
          </div>

          {/* Live Preview */}
          <div className="p-3 bg-stone-900 text-amber-200 rounded-lg flex items-center justify-center text-center font-medium">
            <span>{annMessage}</span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Ticker Message Copy</label>
              <input
                type="text"
                value={annMessage}
                onChange={e => setAnnMessage(e.target.value)}
                className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-amber-700 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Highlight Keyword (Badge)</label>
              <input
                type="text"
                value={annHighlight}
                onChange={e => setAnnHighlight(e.target.value)}
                placeholder="e.g. Festive Rush"
                className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-[#962949] text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="annActive"
                checked={annActive}
                onChange={e => setAnnActive(e.target.checked)}
                className="w-4 h-4 accent-[#962949] rounded cursor-pointer"
              />
              <label htmlFor="annActive" className="font-semibold text-stone-700 cursor-pointer">
                Show Announcement Bar on Live Storefront
              </label>
            </div>

            <div className="pt-3">
              <button
                onClick={handleSaveAnnouncement}
                className="px-5 py-2 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg font-semibold shadow-xs cursor-pointer transition-colors"
              >
                Save Announcement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: FAQs */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Frequently Asked Questions</h3>
              <p className="text-xs text-stone-500">Provide reassurance regarding sizing, comfort lining, and delivery timelines</p>
            </div>
            <button
              onClick={openCreateFaq}
              className="px-3.5 py-1.5 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          {faqs.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center shadow-xs">
              <p className="font-semibold text-stone-600 text-sm">No FAQs Configured</p>
              <p className="text-xs text-stone-400 mt-1 mb-4">
                Add common questions regarding kidswear sizing, fabric wash care, doorstep exchanges, and delivery.
              </p>
              <button
                onClick={openCreateFaq}
                className="px-4 py-2 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First FAQ</span>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 shadow-xs divide-y divide-stone-100 overflow-hidden text-xs">
              {faqs.map(item => (
                <div key={item.id} className="p-4 flex items-start justify-between gap-4 hover:bg-stone-50">
                  <div className="space-y-1 max-w-3xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#962949] bg-[#FDF2F4] px-2 py-0.5 rounded border border-[#F3D0D9]">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm">{item.question}</h4>
                    <p className="text-stone-600 leading-relaxed">{item.answer}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditFaq(item)}
                      className="p-1.5 text-stone-600 hover:text-[#962949] rounded cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this question?')) deleteFAQ(item.id);
                      }}
                      className="p-1.5 text-stone-400 hover:text-red-700 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Heritage & About */}
      {activeTab === 'about' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 max-w-3xl space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-bold text-stone-900">The Boota Atelier Heritage Story</h3>
            <p className="text-stone-500 mt-0.5">Narrative presented on the About Page and footer editorial</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">The Boota Philosophy</label>
              <textarea
                rows={4}
                value={heritageStory}
                onChange={e => setHeritageStory(e.target.value)}
                className="w-full p-3 border border-stone-300 rounded-lg outline-none focus:border-amber-700 text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Artisan Cluster Commitment</label>
              <textarea
                rows={3}
                value={artisanPledge}
                onChange={e => setArtisanPledge(e.target.value)}
                className="w-full p-3 border border-stone-300 rounded-lg outline-none focus:border-amber-700 text-xs leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={() => showToast('Heritage story content saved successfully.')}
                className="px-5 py-2 bg-amber-900 hover:bg-amber-800 text-white rounded-lg font-semibold"
              >
                Save Brand Heritage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Policies */}
      {activeTab === 'policies' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 max-w-3xl space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Store Policies & Guarantees</h3>
            <p className="text-stone-500 mt-0.5">Transparent guidelines for patrons buying luxury kidswear</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Shipping & Festive Dispatch Policy</label>
              <textarea
                rows={3}
                value={shippingPolicy}
                onChange={e => setShippingPolicy(e.target.value)}
                className="w-full p-3 border border-stone-300 rounded-lg outline-none focus:border-amber-700 text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">7-Day Doorstep Exchange Policy</label>
              <textarea
                rows={3}
                value={exchangePolicy}
                onChange={e => setExchangePolicy(e.target.value)}
                className="w-full p-3 border border-stone-300 rounded-lg outline-none focus:border-amber-700 text-xs leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={() => showToast('Store policies updated successfully.')}
                className="px-5 py-2 bg-amber-900 hover:bg-amber-800 text-white rounded-lg font-semibold"
              >
                Save Policies
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-amber-800" />
                <h3 className="font-bold text-sm text-stone-900">
                  {editingBanner ? 'Edit Banner Slide' : 'Add New Homepage Slide'}
                </h3>
              </div>
              <button onClick={() => setIsBannerModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-600 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="p-5 text-xs space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Banner Title</label>
                <input
                  type="text"
                  required
                  value={bannerTitle}
                  onChange={e => setBannerTitle(e.target.value)}
                  placeholder="e.g. The Royal Diwali Collection '26"
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Subtitle / Descriptor</label>
                <input
                  type="text"
                  value={bannerSubtitle}
                  onChange={e => setBannerSubtitle(e.target.value)}
                  placeholder="Heirloom silken brocades, hand zardozi motifs..."
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={bannerCtaText}
                    onChange={e => setBannerCtaText(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Target Link URL</label>
                  <input
                    type="text"
                    value={bannerCtaLink}
                    onChange={e => setBannerCtaLink(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Banner Image Asset</label>
                <input
                  type="text"
                  value={bannerImage}
                  onChange={e => setBannerImage(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs"
                />
                <div className="flex gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setBannerImage('/src/assets/images/boota_banner_festive_1791696746200.jpg')}
                    className="text-[10px] px-2 py-0.5 bg-stone-100 rounded border border-stone-200"
                  >
                    Festive Atmosphere
                  </button>
                  <button
                    type="button"
                    onClick={() => setBannerImage('/src/assets/images/boota_sherwani_royal_1791696697914.jpg')}
                    className="text-[10px] px-2 py-0.5 bg-stone-100 rounded border border-stone-200"
                  >
                    Sherwani Atelier
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Top Badge Label</label>
                <input
                  type="text"
                  value={bannerBadge}
                  onChange={e => setBannerBadge(e.target.value)}
                  placeholder="e.g. Diwali '26 Exclusive"
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="banActiveCheck"
                  checked={bannerActive}
                  onChange={e => setBannerActive(e.target.checked)}
                  className="w-4 h-4 text-amber-900 rounded"
                />
                <label htmlFor="banActiveCheck" className="font-semibold text-stone-700">
                  Slide is Live on Homepage
                </label>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-900 hover:bg-amber-800 text-white rounded-lg font-semibold"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-800" />
                <h3 className="font-bold text-sm text-stone-900">
                  {editingFaq ? 'Edit FAQ Item' : 'Add FAQ Question'}
                </h3>
              </div>
              <button onClick={() => setIsFaqModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-600 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="p-5 text-xs space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Category</label>
                <select
                  value={faqCategory}
                  onChange={e => setFaqCategory(e.target.value as any)}
                  className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                >
                  <option value="Sizing & Fit">Sizing & Fit</option>
                  <option value="Festive Orders & Delivery">Festive Orders & Delivery</option>
                  <option value="Fabrics & Care">Fabrics & Care</option>
                  <option value="Returns & Exchanges">Returns & Exchanges</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={faqQuestion}
                  onChange={e => setFaqQuestion(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Answer</label>
                <textarea
                  rows={3}
                  required
                  value={faqAnswer}
                  onChange={e => setFaqAnswer(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg text-xs leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-900 hover:bg-amber-800 text-white rounded-lg font-semibold"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
