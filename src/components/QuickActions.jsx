import React from 'react';
import { Zap, PlusCircle, Users, ClipboardList, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickActions({ onOpenAddProduct }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl p-5 border border-purple-100/70 shadow-sm flex flex-col justify-between">
      {/* Header matching Reference Image 1 */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-7 h-7 rounded-lg bg-purple-100/70 flex items-center justify-center text-[#3B0764]">
          <Zap className="w-4 h-4 stroke-[2.2]" />
        </div>
        <h3 className="text-sm font-bold text-[#2D124D]">
          Quick Actions
        </h3>
      </div>

      {/* 2x2 Grid matching Reference Image 1 */}
      <div className="grid grid-cols-2 gap-2.5">
        
        {/* Action 1: Add Product */}
        <button
          onClick={() => {
            if (onOpenAddProduct) {
              onOpenAddProduct();
            } else {
              navigate('/products?add=true');
            }
          }}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#FAF5FF] hover:bg-[#EDE9FE] border border-purple-100/80 transition-all duration-200 group text-center"
        >
          <div className="w-8 h-8 rounded-full bg-white text-[#3B0764] shadow-sm flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <PlusCircle className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-[#2D124D] group-hover:text-[#3B0764]">
            Add Product
          </span>
        </button>

        {/* Action 2: View Customers */}
        <button
          onClick={() => navigate('/customers')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#FAF5FF] hover:bg-[#EDE9FE] border border-purple-100/80 transition-all duration-200 group text-center"
        >
          <div className="w-8 h-8 rounded-full bg-white text-[#3B0764] shadow-sm flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Users className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-[#2D124D] group-hover:text-[#3B0764]">
            View Customers
          </span>
        </button>

        {/* Action 3: View Orders */}
        <button
          onClick={() => navigate('/orders')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#FAF5FF] hover:bg-[#EDE9FE] border border-purple-100/80 transition-all duration-200 group text-center"
        >
          <div className="w-8 h-8 rounded-full bg-white text-[#3B0764] shadow-sm flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <ClipboardList className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-[#2D124D] group-hover:text-[#3B0764]">
            View Orders
          </span>
        </button>

        {/* Action 4: Manage Enquiries */}
        <button
          onClick={() => navigate('/enquiries')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#FAF5FF] hover:bg-[#EDE9FE] border border-purple-100/80 transition-all duration-200 group text-center"
        >
          <div className="w-8 h-8 rounded-full bg-white text-[#3B0764] shadow-sm flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Mail className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-[#2D124D] group-hover:text-[#3B0764]">
            Manage Enquiries
          </span>
        </button>

      </div>
    </div>
  );
}
