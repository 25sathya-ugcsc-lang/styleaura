import React, { useState } from 'react';
import { Users, ShoppingCart, Package, Star, ArrowRight, Sparkles, X, PlusCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import StatCard from '../components/StatCard';
import SalesChart from '../components/SalesChart';
import ProductCard from '../components/ProductCard';
import RecentOrders from '../components/RecentOrders';
import CustomerFeedback from '../components/CustomerFeedback';
import QuickActions from '../components/QuickActions';

export default function Dashboard() {
  const { stats, products, orders, reviews, addProduct } = useData();
  const navigate = useNavigate();

  // Quick Add Product Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Dresses',
    price: '',
    discount: '0',
    size: 'M',
    color: 'Lavender Purple',
    stock: '50',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
    description: ''
  });

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    addProduct({
      ...newProduct,
      price: Number(newProduct.price),
      discount: Number(newProduct.discount || 0),
      stock: Number(newProduct.stock || 10)
    });
    setIsAddModalOpen(false);
    setNewProduct({
      name: '',
      category: 'Dresses',
      price: '',
      discount: '0',
      size: 'M',
      color: 'Lavender Purple',
      stock: '50',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
      description: ''
    });
  };

  // Top selling products (first 3 matching Reference Image 1)
  const topSellingProducts = products.slice(0, 3);

  return (
    <div className="space-y-6">
      
      {/* 1. Welcome Banner - Exact layout matching Reference Image 1 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EDE2FC] via-[#F3E8FF] to-[#E9D5FF] p-7 md:p-9 border border-purple-200/60 shadow-sm">
        
        {/* Botanical leaves & sparkles background illustrations */}
        <div className="absolute top-2 left-3 text-purple-400/40 pointer-events-none select-none">
          <svg className="w-16 h-16 transform -rotate-12" fill="currentColor" viewBox="0 0 100 100">
            <path d="M20,90 Q40,40 80,20 Q60,60 20,90 Z" />
            <path d="M30,70 Q50,45 70,50 Q45,65 30,70 Z" />
          </svg>
        </div>

        <div className="absolute top-4 right-1/3 text-purple-400/50 pointer-events-none">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2D124D] tracking-tight font-serif flex items-center gap-2">
              Welcome Back, Admin!
            </h1>
            <p className="mt-2 text-sm md:text-base text-purple-900/80 font-medium">
              Here's what's happening with your StyleAura store today.
            </p>
          </div>

          {/* Luxury Purple Shopping Bag Graphic with White Heart - matching Reference Image 1 */}
          <div className="relative flex-shrink-0 self-end md:self-center pr-4">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
              {/* Shopping Bag SVG */}
              <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-xl">
                <defs>
                  <linearGradient id="bagGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#5B21B6" />
                  </linearGradient>
                  <linearGradient id="handleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4C1D95" />
                    <stop offset="100%" stopColor="#6D28D9" />
                  </linearGradient>
                </defs>

                {/* Bag Handles */}
                <path
                  d="M 65 80 C 65 30, 135 30, 135 80"
                  fill="none"
                  stroke="url(#handleGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                {/* Bag Body with 3D folded edge */}
                <polygon
                  points="45,80 155,80 170,205 30,205"
                  fill="url(#bagGradient)"
                />
                <polygon
                  points="155,80 175,95 190,205 170,205"
                  fill="#4C1D95"
                  opacity="0.8"
                />

                {/* White Heart on Bag */}
                <path
                  d="M100,150 C100,150 70,125 70,110 C70,98 80,90 90,90 C96,90 100,95 100,95 C100,95 104,90 110,90 C120,90 130,98 130,110 C130,125 100,150 100,150 Z"
                  fill="#FFFFFF"
                  opacity="0.95"
                />
              </svg>

              {/* Sparkle stars around bag */}
              <div className="absolute -top-1 -right-1 text-purple-400">✦</div>
              <div className="absolute bottom-2 -left-3 text-purple-400 text-sm">✦</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Four Statistics Cards - Exact layout matching Reference Image 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          trend={`↑ ${stats.customersGrowth.replace('+', '')}`}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          trend={`↑ ${stats.ordersGrowth.replace('+', '')}`}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          trend={`↑ ${stats.productsGrowth.replace('+', '')}`}
        />
        <StatCard
          title="Avg Rating"
          value={stats.avgRating}
          icon={Star}
          isStar={true}
          trend={`↑ ${stats.ratingGrowth.replace('+', '')}`}
        />
      </div>

      {/* 3. Middle Section: Sales Overview (60%) & Top Selling Products (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Sales Overview Chart (7 Cols on desktop) */}
        <div className="lg:col-span-7">
          <SalesChart />
        </div>

        {/* Top Selling Products (5 Cols on desktop) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-purple-100/70 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-[#7C3AED] text-[#7C3AED]" />
              <h2 className="text-base font-bold text-[#2D124D]">
                Top Selling Products
              </h2>
            </div>
            <Link
              to="/products"
              className="text-xs font-semibold text-[#6B21A8] hover:text-[#4C1D95] flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 3 Compact Product Cards Side by Side - matching Reference Image 1 */}
          <div className="grid grid-cols-3 gap-3">
            {topSellingProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                compact={true}
              />
            ))}
          </div>
        </div>

      </div>

      {/* 4. Bottom Section: Recent Orders (4 cols), Customer Feedback (4 cols), Quick Actions (4 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Recent Orders Component */}
        <RecentOrders orders={orders} />

        {/* Customer Feedback Component */}
        <CustomerFeedback reviews={reviews} />

        {/* Quick Actions Component */}
        <QuickActions onOpenAddProduct={() => setIsAddModalOpen(true)} />

      </div>

      {/* Modal: Quick Add Product */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#3B0764] flex items-center justify-center font-bold">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2D124D]">Quick Add Product</h3>
                <p className="text-xs text-purple-700/80">Add a new item to StyleAura catalog</p>
              </div>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-purple-950 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Silk Organza Anarkali Gown"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white"
                  >
                    <option value="Women Clothing">Women Clothing</option>
                    <option value="Men Clothing">Men Clothing</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Tops">Tops</option>
                    <option value="Jeans">Jeans</option>
                    <option value="Sarees">Sarees</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Footwear">Footwear</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="2499"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
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
                    value={newProduct.discount}
                    onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Size</label>
                  <input
                    type="text"
                    placeholder="M"
                    value={newProduct.size}
                    onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Stock Qty</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="25"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-950 mb-1">Product Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 rounded-xl shadow-md transition-all"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
