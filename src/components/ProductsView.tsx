import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Ruler,
  Edit2,
  Trash2,
  Eye,
  Archive,
  CheckCircle2,
  AlertCircle,
  X,
  UploadCloud,
  ChevronDown,
  Layers
} from 'lucide-react';
import { useAdmin } from '../context/AdminDataContext';
import { Product, ProductVariant } from '../types/admin';
import { standardSizeChart } from '../data/initialData';

export const ProductsView: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSizeChartModalOpen, setIsSizeChartModalOpen] = useState(false);
  const [selectedSizeChartProduct, setSelectedSizeChartProduct] = useState<Product | null>(null);

  // Form State
  const initialFormState: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
    title: '',
    slug: '',
    sku: '',
    category: 'Boys Festive',
    subcategory: 'Royal Sherwanis',
    price: 6990,
    compareAtPrice: 7990,
    costPrice: 2800,
    gstRate: 12,
    hsnCode: '62092000',
    status: 'published',
    description: '',
    fabric: 'Pure Raw Silk with Mulmul Cotton Lining',
    craft: 'Handcrafted Zardozi & Gota Patti',
    care: 'Dry Clean Only. Gentle steam press.',
    images: ['/src/assets/images/boota_sherwani_royal_1791696697914.jpg'],
    sizes: ['1-2Y', '2-3Y', '3-4Y', '5-6Y'],
    colors: [{ name: 'Royal Ivory & Gold', hex: '#F7F5EE' }],
    variants: [],
    sizeChart: standardSizeChart,
    isFeatured: false,
  };

  const [formData, setFormData] = useState<typeof initialFormState>(initialFormState);

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.fabric.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    // Initialize default variants
    const defaultVariants: ProductVariant[] = ['1-2Y', '2-3Y', '3-4Y', '5-6Y'].map((s, idx) => ({
      id: `v-new-${idx}`,
      colorName: 'Royal Ivory & Gold',
      colorHex: '#F7F5EE',
      size: s,
      sku: `BOOTA-NEW-${s}`,
      stock: 5,
      reserved: 0,
      lowStockThreshold: 3
    }));

    setFormData({
      ...initialFormState,
      sku: `BOOTA-${Math.floor(1000 + Math.random() * 9000)}`,
      variants: defaultVariants
    });
    setIsEditModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      title: p.title,
      slug: p.slug,
      sku: p.sku,
      category: p.category,
      subcategory: p.subcategory,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      costPrice: p.costPrice,
      gstRate: p.gstRate,
      hsnCode: p.hsnCode,
      status: p.status,
      description: p.description,
      fabric: p.fabric,
      craft: p.craft,
      care: p.care,
      images: p.images,
      sizes: p.sizes,
      colors: p.colors,
      variants: p.variants,
      sizeChart: p.sizeChart || standardSizeChart,
      isFeatured: p.isFeatured
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.sku) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
    setIsEditModalOpen(false);
  };

  const handleAddColor = () => {
    const colorName = prompt('Enter color name (e.g., Royal Peacock Blue, Kesariya):');
    if (!colorName) return;
    const hex = prompt('Enter color hex (e.g., #1E3A8A):') || '#B45309';

    const newColors = [...formData.colors, { name: colorName, hex }];
    // Generate new variants for these sizes
    const newVariants = [...formData.variants];
    formData.sizes.forEach(size => {
      newVariants.push({
        id: `v-${Date.now()}-${size}`,
        colorName,
        colorHex: hex,
        size,
        sku: `${formData.sku}-${colorName.substring(0, 3).toUpperCase()}-${size}`,
        stock: 5,
        reserved: 0,
        lowStockThreshold: 3
      });
    });

    setFormData({
      ...formData,
      colors: newColors,
      variants: newVariants
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#F3D0D9]/80">
        <div>
          <h2 className="text-xl font-bold font-serif text-stone-900 tracking-tight">
            Festive Ensembles Catalog
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage kidswear outfits, pricing, fabrics, size variants and measurement charts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedSizeChartProduct(products[0]);
              setIsSizeChartModalOpen(true);
            }}
            className="px-3.5 py-2 bg-white hover:bg-[#FDF2F4] border border-[#F3D0D9] text-[#962949] rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Size Chart Matrix</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Ensemble</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, SKU, fabric..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg outline-none focus:border-[#962949] bg-stone-50/50"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1 text-xs text-stone-600">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs bg-white text-stone-800 outline-none focus:border-[#962949]"
            >
              <option value="all">All Collections</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs bg-white text-stone-800 outline-none focus:border-[#962949]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FDF8F9] text-stone-500 uppercase text-[10px] font-semibold tracking-wider border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5">Ensemble Details</th>
                <th className="px-4 py-3.5">Category & Fabric</th>
                <th className="px-4 py-3.5 text-right">Selling Price</th>
                <th className="px-4 py-3.5 text-center">GST Slab</th>
                <th className="px-4 py-3.5 text-center">Variants & Stock</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-stone-400">
                    <p className="font-semibold text-stone-600 text-sm">No Ensembles in Catalog</p>
                    <p className="text-xs text-stone-400 mt-1 mb-4">Click below to create your first handcrafted kidswear product.</p>
                    <button
                      onClick={openCreateModal}
                      className="px-4 py-2 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create New Ensemble</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProducts.map(prod => {
                  const totalStock = prod.variants.reduce((acc, v) => acc + v.stock, 0);
                  const isLow = prod.variants.some(v => v.stock <= v.lowStockThreshold);

                  return (
                    <tr key={prod.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images[0]}
                            alt={prod.title}
                            className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-stone-900 line-clamp-1">{prod.title}</div>
                            <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                              SKU: {prod.sku} {prod.isFeatured && '· ⭐ Featured'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-medium text-stone-800 block">{prod.category}</span>
                        <span className="text-[11px] text-stone-500 block line-clamp-1">{prod.fabric}</span>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="font-mono font-bold text-[#962949] text-sm">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </div>
                        {prod.compareAtPrice && (
                          <div className="text-[11px] text-stone-400 line-through font-mono">
                            ₹{prod.compareAtPrice.toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className="font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                          {prod.gstRate}% GST
                        </span>
                        <div className="text-[10px] text-stone-400 mt-0.5">HSN {prod.hsnCode}</div>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span
                            className={`font-mono font-semibold px-2 py-0.5 rounded text-xs ${
                              totalStock === 0
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : isLow
                                ? 'bg-[#FDF2F4] text-[#962949] border border-[#F3D0D9]'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {totalStock} units
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 block mt-1">
                          {prod.sizes.length} sizes · {prod.variants.length} SKUs
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase rounded ${
                            prod.status === 'published'
                              ? 'bg-emerald-100 text-emerald-900'
                              : prod.status === 'draft'
                              ? 'bg-amber-100 accent-[#962949]'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {prod.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedSizeChartProduct(prod);
                              setIsSizeChartModalOpen(true);
                            }}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                            title="View Size Chart"
                          >
                            <Ruler className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-1.5 text-[#962949] hover:text-[#962949] hover:bg-[#FDF2F4] rounded transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove "${prod.title}" from store catalog?`)) {
                                deleteProduct(prod.id);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#962949]" />
                <h3 className="font-bold text-sm text-stone-900">
                  {editingProduct ? 'Edit Ensemble Specifications' : 'Create New Luxury Ensemble'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Ensemble Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. The Shahzada Ivory & Gold Zardozi Sherwani Set"
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-[#962949]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Catalog Master SKU</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none font-mono focus:border-[#962949]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-[#962949] bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Selling Price (INR ₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none font-mono focus:border-[#962949]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Compare At / MRP (INR ₹)</label>
                  <input
                    type="number"
                    value={formData.compareAtPrice || ''}
                    onChange={e => setFormData({ ...formData, compareAtPrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="e.g. 9990"
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none font-mono focus:border-[#962949]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Cost Price / Workshop (INR ₹)</label>
                  <input
                    type="number"
                    value={formData.costPrice}
                    onChange={e => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none font-mono focus:border-[#962949]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">GST Slab Rate</label>
                  <select
                    value={formData.gstRate}
                    onChange={e => setFormData({ ...formData, gstRate: Number(e.target.value) })}
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-[#962949] bg-white"
                  >
                    <option value={5}>5% (Kids Apparel under ₹1,000)</option>
                    <option value={12}>12% (Kids Luxury Apparel above ₹1,000)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Fabric & Pure Mulmul Lining</label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={e => setFormData({ ...formData, fabric: e.target.value })}
                    placeholder="e.g. Pure Banarasi Katan Silk with 100% Breathable Mulmul Underskirt"
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-[#962949]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Craft & Embellishments</label>
                  <input
                    type="text"
                    value={formData.craft}
                    onChange={e => setFormData({ ...formData, craft: e.target.value })}
                    placeholder="e.g. Antique Dabka & Hand Gota Patti Scalloping"
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-[#962949]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Product Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Artisanal narrative, festive occasion suitability and comforting touches..."
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-[#962949]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Product Image URL / Asset</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.images[0] || ''}
                      onChange={e => setFormData({ ...formData, images: [e.target.value] })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none text-xs"
                    />
                  </div>
                  {/* Quick image picker from generated assets */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] text-stone-500">Pick Atelier Photograph:</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, images: ['/src/assets/images/boota_sherwani_royal_1791696697914.jpg'] })}
                      className="text-[10px] px-2 py-0.5 bg-stone-100 hover:bg-stone-200 rounded border border-stone-200"
                    >
                      Royal Sherwani
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, images: ['/src/assets/images/boota_lehenga_maroon_1791696710709.jpg'] })}
                      className="text-[10px] px-2 py-0.5 bg-stone-100 hover:bg-stone-200 rounded border border-stone-200"
                    >
                      Crimson Lehenga
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, images: ['/src/assets/images/boota_kurta_bandhani_1791696723628.jpg'] })}
                      className="text-[10px] px-2 py-0.5 bg-stone-100 hover:bg-stone-200 rounded border border-stone-200"
                    >
                      Bandhani Kurta
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, images: ['/src/assets/images/boota_anarkali_emerald_1791696734452.jpg'] })}
                      className="text-[10px] px-2 py-0.5 bg-stone-100 hover:bg-stone-200 rounded border border-stone-200"
                    >
                      Emerald Anarkali
                    </button>
                  </div>
                </div>

                {/* Variants & Sizes Table */}
                <div className="md:col-span-2 pt-2 border-t border-stone-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-stone-900">Sizes & Inventory Stock Allocation</h4>
                      <p className="text-[11px] text-stone-500">Set stock units per size variant</p>
                    </div>
                  </div>

                  <div className="border border-stone-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 text-[10px] uppercase">
                        <tr>
                          <th className="px-3 py-2">Size</th>
                          <th className="px-3 py-2">Variant SKU</th>
                          <th className="px-3 py-2">On-Hand Stock</th>
                          <th className="px-3 py-2">Low Stock Alert</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {formData.variants.map((variant, index) => (
                          <tr key={variant.id || index}>
                            <td className="px-3 py-2 font-bold text-stone-800">{variant.size}</td>
                            <td className="px-3 py-2 font-mono text-stone-500">{variant.sku}</td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                min={0}
                                value={variant.stock}
                                onChange={e => {
                                  const updated = [...formData.variants];
                                  updated[index].stock = Number(e.target.value);
                                  setFormData({ ...formData, variants: updated });
                                }}
                                className="w-20 p-1 border border-stone-300 rounded font-mono text-xs"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                min={1}
                                value={variant.lowStockThreshold}
                                onChange={e => {
                                  const updated = [...formData.variants];
                                  updated[index].lowStockThreshold = Number(e.target.value);
                                  setFormData({ ...formData, variants: updated });
                                }}
                                className="w-16 p-1 border border-stone-300 rounded font-mono text-xs"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Status & Featured */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Catalog Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-[#962949] bg-white"
                  >
                    <option value="published">Published (Visible on Store)</option>
                    <option value="draft">Draft (Work in Progress)</option>
                    <option value="archived">Archived (Discontinued)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured || false}
                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-[#962949] rounded border-stone-300"
                  />
                  <label htmlFor="isFeatured" className="font-medium text-stone-700">
                    Feature in Homepage Showcase
                  </label>
                </div>
              </div>

              {/* Submit / Cancel Footer */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#962949] hover:bg-[#7E1F3B] text-white rounded-lg font-semibold shadow-xs"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Ensemble'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Size Chart Modal */}
      {isSizeChartModalOpen && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-[#962949]" />
                <h3 className="font-bold text-sm text-stone-900">
                  Boota Indian Festive Kidswear Standard Measurement Chart
                </h3>
              </div>
              <button
                onClick={() => setIsSizeChartModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 text-xs space-y-4">
              <p className="text-stone-600">
                All measurements are in inches. Crafted with 1.5 - 2 inches of comfortable celebratory ease over pure mulmul lining.
              </p>

              <div className="border border-stone-200 rounded-lg overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-stone-100 text-stone-600 font-semibold text-[11px] border-b border-stone-200">
                    <tr>
                      <th className="px-3 py-2">Size</th>
                      <th className="px-3 py-2">Age Bracket</th>
                      <th className="px-3 py-2 text-center">Chest (in)</th>
                      <th className="px-3 py-2 text-center">Kurta/Choli Length (in)</th>
                      <th className="px-3 py-2 text-center">Waist (in)</th>
                      <th className="px-3 py-2 text-center">Bottom Length (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {standardSizeChart.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#FDF2F4]/40">
                        <td className="px-3 py-2 font-bold text-[#962949]">{row.size}</td>
                        <td className="px-3 py-2 text-stone-600">{row.age}</td>
                        <td className="px-3 py-2 text-center font-mono font-medium">{row.chestInches}"</td>
                        <td className="px-3 py-2 text-center font-mono font-medium">{row.topLengthInches}"</td>
                        <td className="px-3 py-2 text-center font-mono font-medium">{row.waistInches}"</td>
                        <td className="px-3 py-2 text-center font-mono font-medium">{row.bottomLengthInches}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-[#FDF2F4] rounded-lg border border-[#F3D0D9]/80 text-[11px] accent-[#962949] leading-relaxed">
                <strong>Measurement Guidance:</strong> For children between standard sizes, always suggest sizing up. Our waistbands feature soft fabric-encased elastic tie-ups to fit comfortably across celebratory banquets.
              </div>
            </div>

            <div className="p-3 border-t border-stone-200 flex justify-end bg-stone-50">
              <button
                onClick={() => setIsSizeChartModalOpen(false)}
                className="px-4 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
