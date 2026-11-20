import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { BarChart3, ChevronDown } from 'lucide-react';

const DATA_SETS = {
  'This Month': [
    { period: 'Sep', sales: 1200, orders: 420 },
    { period: 'Oct', sales: 1800, orders: 580 },
    { period: 'Nov', sales: 2000, orders: 690 },
    { period: 'Dec', sales: 2400, orders: 810 },
    { period: 'Jan', sales: 2900, orders: 950 }
  ],
  'Weekly': [
    { period: 'Mon', sales: 450, orders: 120 },
    { period: 'Tue', sales: 620, orders: 160 },
    { period: 'Wed', sales: 580, orders: 145 },
    { period: 'Thu', sales: 790, orders: 210 },
    { period: 'Fri', sales: 940, orders: 280 },
    { period: 'Sat', sales: 1150, orders: 340 },
    { period: 'Sun', sales: 1080, orders: 310 }
  ],
  'Yearly': [
    { period: '2022', sales: 14500, orders: 3200 },
    { period: '2023', sales: 24000, orders: 5100 },
    { period: '2024', sales: 38000, orders: 7400 },
    { period: '2025', sales: 49500, orders: 9800 },
    { period: '2026', sales: 64200, orders: 12400 }
  ]
};

export default function SalesChart() {
  const [timeframe, setTimeframe] = useState('This Month');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const data = DATA_SETS[timeframe] || DATA_SETS['This Month'];

  return (
    <div className="bg-white rounded-2xl p-6 border border-purple-100/70 shadow-sm flex flex-col justify-between">
      {/* Header matching Reference Image 1 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-100/70 flex items-center justify-center text-[#3B0764]">
            <BarChart3 className="w-4 h-4 stroke-[2.5]" />
          </div>
          <h2 className="text-base font-bold text-[#2D124D]">
            Sales Overview
          </h2>
        </div>

        {/* Timeframe Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDE9FE]/70 hover:bg-[#EDE9FE] text-xs font-semibold text-[#3B0764] transition-colors border border-purple-200/50"
          >
            <span>{timeframe}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-32 bg-white rounded-xl shadow-lg border border-purple-100 py-1 z-20 animate-fade-in">
              {['Weekly', 'This Month', 'Yearly'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setTimeframe(tf);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors ${
                    timeframe === tf ? 'bg-purple-50 text-[#3B0764] font-bold' : 'text-gray-700 hover:bg-purple-50/50'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="purpleSalesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#C4B5FD" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3E8FF" />
            <XAxis
              dataKey="period"
              stroke="#A78BFA"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#EDE9FE' }}
            />
            <YAxis
              stroke="#A78BFA"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#EDE9FE' }}
              tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-purple-950 text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-purple-800">
                      <p className="font-semibold text-purple-200">{payload[0].payload.period}</p>
                      <p className="text-sm font-bold text-white mt-0.5">
                        ₹{Number(payload[0].value).toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-purple-300">
                        {payload[0].payload.orders} orders placed
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#7C3AED"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#purpleSalesGradient)"
              dot={{ r: 4, fill: '#7C3AED', stroke: '#FFFFFF', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#6D28D9', stroke: '#EDE9FE', strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
