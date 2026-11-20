import React from 'react';

export default function StatCard({ title, value, icon: Icon, trend, isPositive = true, isStar = false }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-purple-100/70 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Lavender Circle with Purple Icon */}
        <div className="w-13 h-13 rounded-2xl bg-[#EDE9FE] flex items-center justify-center text-[#3B0764] flex-shrink-0 shadow-inner">
          <Icon className="w-6 h-6 stroke-[2.2]" />
        </div>

        <div>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl font-bold text-[#2D124D] tracking-tight">
              {value}
            </h3>
            {isStar && <span className="text-xl text-[#3B0764]">★</span>}
          </div>
          <p className="text-xs font-medium text-purple-900/70 mt-0.5">
            {title}
          </p>
        </div>
      </div>

      {/* Trend Percentage Badge */}
      {trend && (
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}
