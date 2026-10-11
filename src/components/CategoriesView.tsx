import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { useAdmin } from '../context/AdminDataContext';
import { Category } from '../types/admin';

export const CategoriesView: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [bannerImage, setBannerImage] = useState('/src/assets/images/boota_banner_festive_1791696746200.jpg');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setBannerImage('/src/assets/images/boota_banner_festive_1791696746200.jpg');
    setDisplayOrder(categories.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setBannerImage(cat.bannerImage);
    setDisplayOrder(cat.displayOrder);
    setIsActive(cat.isActive);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const generatedSlug = slug.trim() ? slug.trim() : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name,
        slug: generatedSlug,
        description,
        bannerImage,
        displayOrder,
        isActive
      });
    } else {
      addCategory({
        name,
        slug: generatedSlug,
        description,
        bannerImage,
        displayOrder,
        isActive,
        productCount: 0
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#F3D0D9]/80">
        <div>
          <h2 className="text-xl font-bold font-serif text-stone-900 tracking-tight">
            Collections & Category Management
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Organize kidswear taxonomy, customize collection hero banners, and configure storefront navigation.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Collection</span>
        </button>
      </div>

      {/* Categories Grid or Empty State */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center shadow-xs">
          <p className="font-semibold text-stone-600 text-sm">No Categories or Collections Configured</p>
          <p className="text-xs text-stone-400 mt-1 mb-4">Create your first category (e.g., Boys Festive, Girls Festive, Newborn Heritage) to group ensembles.</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Collection</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Category Banner Preview */}
              <div className="h-40 w-full relative overflow-hidden bg-stone-100">
                <img
                  src={cat.bannerImage}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-stone-950/70 via-stone-950/20 to-transparent flex items-end p-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-rose-200 font-bold">
                      Order #{cat.displayOrder}
                    </span>
                    <h3 className="text-white font-bold text-base line-clamp-1">{cat.name}</h3>
                  </div>
                </div>
              </div>

              {/* Category Info */}
              <div className="p-4 space-y-2">
                <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100 text-stone-500">
                  <span className="font-mono text-[11px]">/{cat.slug}</span>
                  <span className="font-semibold text-stone-800">{cat.productCount} Ensembles</span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
              <span
                className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase rounded ${
                  cat.isActive
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {cat.isActive ? 'Active on Store' : 'Hidden'}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 text-stone-600 hover:text-[#962949] hover:bg-stone-200/60 rounded transition-colors"
                  title="Edit Category"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete category "${cat.name}"?`)) {
                      deleteCategory(cat.id);
                    }
                  }}
                  className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-[#962949]" />
                <h3 className="font-bold text-sm text-stone-900">
                  {editingCategory ? 'Edit Collection' : 'Create New Collection'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 text-xs space-y-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Collection Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if (!editingCategory) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Newborn Heritage (0-12M)"
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-[#962949] text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none font-mono text-xs focus:border-[#962949]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Collection Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Artisanal focus, weaves, and festive wear occasion guidance..."
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-[#962949] text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Hero Banner Image URL</label>
                <input
                  type="text"
                  value={bannerImage}
                  onChange={e => setBannerImage(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none text-xs"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setBannerImage('/src/assets/images/boota_banner_festive_1791696746200.jpg')}
                    className="text-[10px] px-2 py-0.5 bg-stone-100 hover:bg-stone-200 rounded border border-stone-200"
                  >
                    Festive Banner
                  </button>
                  <button
                    type="button"
                    onClick={() => setBannerImage('/src/assets/images/boota_sherwani_royal_1791696697914.jpg')}
                    className="text-[10px] px-2 py-0.5 bg-stone-100 hover:bg-stone-200 rounded border border-stone-200"
                  >
                    Boys Sherwani
                  </button>
                  <button
                    type="button"
                    onClick={() => setBannerImage('/src/assets/images/boota_lehenga_maroon_1791696710709.jpg')}
                    className="text-[10px] px-2 py-0.5 bg-stone-100 hover:bg-stone-200 rounded border border-stone-200"
                  >
                    Girls Lehenga
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Display Sort Order</label>
                  <input
                    type="number"
                    min={1}
                    value={displayOrder}
                    onChange={e => setDisplayOrder(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none font-mono text-xs focus:border-[#962949]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="catIsActive"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="w-4 h-4 accent-[#962949] rounded"
                  />
                  <label htmlFor="catIsActive" className="font-semibold text-stone-700">
                    Active on Storefront
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg font-semibold"
                >
                  {editingCategory ? 'Save Changes' : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
