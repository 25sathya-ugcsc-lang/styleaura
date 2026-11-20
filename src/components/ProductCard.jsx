import React from 'react';
import { ShoppingBag, Star, Edit3, Trash2 } from 'lucide-react';

export default function ProductCard({
  product,
  compact = false,
  onEdit,
  onDelete
}) {
  const { name, category, price, discount, sold, stock, image, rating } = product;

  const discountedPrice = discount ? Math.round(price * (1 - discount / 100)) : price;

  if (compact) {
    // Exact Dashboard view matching Reference Image 1
    return (
      <div className="bg-[#FAF5FF]/70 hover:bg-[#F3E8FF]/80 p-3 rounded-2xl border border-purple-100/60 transition-all duration-200 text-center flex flex-col items-center group cursor-pointer">
        <div className="w-full h-32 rounded-xl overflow-hidden bg-white/80 p-1 flex items-center justify-center mb-2.5 shadow-sm group-hover:scale-[1.02] transition-transform">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain mix-blend-multiply"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80';
            }}
          />
        </div>
        <h4 className="text-xs font-semibold text-[#2D124D] truncate w-full group-hover:text-purple-700 transition-colors">
          {name}
        </h4>
        <p className="text-[11px] font-medium text-purple-700/80 mt-0.5">
          {Number(sold).toLocaleString('en-IN')} Sold
        </p>
      </div>
    );
  }

  // Full Catalog / Product Management View
  return (
    <div className="bg-white rounded-2xl p-4 border border-purple-100/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Product Image Container */}
        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-[#FAF5FF] mb-3 flex items-center justify-center">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold bg-pink-500 text-white rounded-full shadow-sm">
              {discount}% OFF
            </span>
          )}
          <span className="absolute bottom-2 right-2 px-2 py-0.5 text-[10px] font-semibold bg-purple-950/70 text-white backdrop-blur-sm rounded-md">
            {category}
          </span>
        </div>

        {/* Title & Rating */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-sm font-bold text-[#2D124D] line-clamp-1">{name}</h3>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-500 flex-shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{rating || 4.8}</span>
          </div>
        </div>

        {/* Stock & Details */}
        <div className="flex items-center justify-between text-xs text-purple-700/80 mb-3">
          <span>Stock: <strong className={stock <= 10 ? 'text-rose-600 font-bold' : 'text-purple-900'}>{stock} units</strong></span>
          <span>{sold || 0} sold</span>
        </div>
      </div>

      {/* Pricing & Actions */}
      <div className="pt-2 border-t border-purple-50 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-[#3B0764]">
              ₹{discountedPrice.toLocaleString('en-IN')}
            </span>
            {discount > 0 && (
              <span className="text-xs text-gray-400 line-through">
                ₹{price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onEdit && (
            <button
              onClick={() => onEdit(product)}
              className="p-1.5 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors"
              title="Edit Product"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(product.id)}
              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete Product"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
