import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Plus,
  Filter,
  Grid,
  List,
  Upload,
  Image as ImageIcon,
  Edit3,
  Trash2,
  X,
  Star,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  'All',
  'Women Clothing',
  'Men Clothing',
  'Dresses',
  'Tops',
  'Jeans',
  'Sarees',
  'Accessories',
  'Footwear'
];

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useData();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit'
  const [editingProduct, setEditingProduct] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dresses',
    price: '',
    discount: '0',
    size: 'M',
    color: 'Lavender Purple',
    stock: '25',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
    description: ''
  });

  const [imagePreview, setImagePreview] = useState('');

  // Filtering
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.color || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handlers
  const openAddModal = () => {
    setFormData({
      name: '',
      category: 'Dresses',
      price: '',
      discount: '0',
      size: 'M',
      color: 'Lavender Purple',
      stock: '25',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
      description: ''
    });
    setImagePreview('https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80');
    setModalMode('add');
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      discount: prod.discount || 0,
      size: prod.size || 'M',
      color: prod.color || '',
      stock: prod.stock || 0,
      image: prod.image,
      description: prod.description || ''
    });
    setImagePreview(prod.image);
    setModalMode('edit');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const payload = {
      ...formData,
      price: Number(formData.price),
      discount: Number(formData.discount || 0),
      stock: Number(formData.stock || 0),
      image: imagePreview || formData.image
    };

    if (modalMode === 'add') {
      addProduct(payload);
    } else if (modalMode === 'edit' && editingProduct) {
      updateProduct(editingProduct.id, payload);
    }

    setModalMode(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleQuickStockChange = (prod, delta) => {
    const newStock = Math.max(0, Number(prod.stock || 0) + delta);
    updateProduct(prod.id, { stock: newStock });
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2D124D] font-serif flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-[#7C3AED]" />
            Product Management
          </h1>
          <p className="text-xs text-purple-700/80 mt-1">
            Manage fashion inventory, pricing, categories, stock, and photography
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] hover:from-[#3B0764] hover:to-[#6D28D9] text-white text-xs font-bold shadow-md shadow-purple-900/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Categories Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-[#3B0764] text-white shadow-md'
                : 'bg-white hover:bg-purple-100/60 text-purple-900/80 border border-purple-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & View Toggle Bar */}
      <div className="bg-white p-4 rounded-2xl border border-purple-100/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, category, color..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-purple-50/50 text-xs text-[#2D124D] placeholder-purple-400 border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
          />
        </div>

        {/* View Switcher (Grid / Table) */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl transition-colors ${
              viewMode === 'grid' ? 'bg-[#EDE9FE] text-[#3B0764]' : 'text-gray-400 hover:text-purple-700'
            }`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-xl transition-colors ${
              viewMode === 'table' ? 'bg-[#EDE9FE] text-[#3B0764]' : 'text-gray-400 hover:text-purple-700'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Products Display (Grid View) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl p-12 text-center text-gray-500 border border-purple-100">
              No products found in this category.
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                compact={false}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      ) : (
        /* Products Display (Table View with Quick Stock Management) */
        <div className="bg-white rounded-2xl border border-purple-100/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5FF] text-purple-900/80 font-bold border-b border-purple-100/80">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Size & Color</th>
                  <th className="py-3 px-4">Stock Control</th>
                  <th className="py-3 px-4">Sold</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-purple-50 border border-purple-100"
                        />
                        <div>
                          <p className="font-bold text-[#2D124D]">{p.name}</p>
                          <span className="text-[10px] text-gray-400 font-mono">{p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-purple-900">
                      {p.category}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#3B0764]">
                      ₹{Number(p.price).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      {p.discount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-700">
                          {p.discount}% OFF
                        </span>
                      ) : (
                        <span className="text-gray-400">–</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      <span>{p.size || 'M'}</span> • <span className="text-purple-600 font-medium">{p.color}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuickStockChange(p, -1)}
                          className="w-6 h-6 rounded bg-purple-100 text-purple-700 hover:bg-purple-200 font-bold flex items-center justify-center text-xs"
                        >
                          -
                        </button>
                        <span className={`font-bold ${p.stock <= 10 ? 'text-rose-600' : 'text-purple-950'}`}>
                          {p.stock}
                        </span>
                        <button
                          onClick={() => handleQuickStockChange(p, 1)}
                          className="w-6 h-6 rounded bg-purple-100 text-purple-700 hover:bg-purple-200 font-bold flex items-center justify-center text-xs"
                        >
                          +
                        </button>
                        {p.stock <= 10 && (
                          <span className="text-[10px] text-rose-500 font-bold flex items-center gap-0.5 ml-1">
                            <AlertTriangle className="w-3 h-3" /> Low
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-purple-900">
                      {p.sold || 0}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Product */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-purple-100 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#2D124D] mb-1 font-serif">
              {modalMode === 'add' ? 'Add New Fashion Product' : 'Edit Product Details'}
            </h3>
            <p className="text-xs text-purple-700/80 mb-4">
              Configure product catalog fields, pricing, inventory, and photography
            </p>

            <form onSubmit={handleSave} className="space-y-3.5">
              
              {/* Image Preview & Upload Option */}
              <div className="flex items-center gap-4 p-3 bg-[#FAF5FF] rounded-2xl border border-purple-100">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-purple-200 flex items-center justify-center flex-shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-purple-300" />
                  )}
                </div>

                <div className="flex-1">
                  <label className="block text-xs font-semibold text-purple-950 mb-1">
                    Upload Photo or Select Local File
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 text-purple-800 text-xs font-semibold hover:bg-purple-200 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose File</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  <span className="block text-[10px] text-gray-400 mt-1">PNG, JPG, WEBP accepted</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-950 mb-1">Image URL (Fallback / CDN)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-950 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lavender Georgette Anarkali Suit"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="2999"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    placeholder="10"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Size</label>
                  <input
                    type="text"
                    placeholder="S, M, L, XL, Free"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Stock Units</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="25"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-950 mb-1">Color / Finish</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Plum & Gold, Lavender Lilac"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#4C1D95] hover:bg-[#3B0764] rounded-xl shadow-md transition-all"
                >
                  {modalMode === 'add' ? 'Add to Catalog' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
