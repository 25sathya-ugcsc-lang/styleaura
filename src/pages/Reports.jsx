import React, { useState } from 'react';
import {
  BarChart2,
  Download,
  Printer,
  Calendar,
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  FileSpreadsheet
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useData } from '../context/DataContext';

const PERIOD_DATA = {
  Daily: [
    { label: '09 AM', revenue: 12500, orders: 8 },
    { label: '11 AM', revenue: 24000, orders: 15 },
    { label: '01 PM', revenue: 18500, orders: 12 },
    { label: '03 PM', revenue: 32000, orders: 19 },
    { label: '05 PM', revenue: 48000, orders: 26 },
    { label: '07 PM', revenue: 62000, orders: 34 },
    { label: '09 PM', revenue: 41000, orders: 22 }
  ],
  Weekly: [
    { label: 'Mon', revenue: 145000, orders: 82 },
    { label: 'Tue', revenue: 182000, orders: 104 },
    { label: 'Wed', revenue: 165000, orders: 95 },
    { label: 'Thu', revenue: 210000, orders: 124 },
    { label: 'Fri', revenue: 295000, orders: 168 },
    { label: 'Sat', revenue: 380000, orders: 210 },
    { label: 'Sun', revenue: 340000, orders: 195 }
  ],
  Monthly: [
    { label: 'Sep', revenue: 1250000, orders: 740 },
    { label: 'Oct', revenue: 1580000, orders: 920 },
    { label: 'Nov', revenue: 1890000, orders: 1100 },
    { label: 'Dec', revenue: 2450000, orders: 1420 },
    { label: 'Jan', revenue: 2980000, orders: 1710 }
  ],
  Yearly: [
    { label: '2023', revenue: 14200000, orders: 8500 },
    { label: '2024', revenue: 21800000, orders: 12400 },
    { label: '2025', revenue: 29500000, orders: 16900 },
    { label: '2026', revenue: 38200000, orders: 21800 }
  ]
};

const CATEGORY_COLORS = ['#6D28D9', '#8B5CF6', '#A78BFA', '#C4B5FD', '#EC4899', '#F472B6', '#F43F5E', '#3B82F6'];

export default function Reports() {
  const { products, orders, customers, stats } = useData();
  const [period, setPeriod] = useState('Monthly');

  const chartData = PERIOD_DATA[period] || PERIOD_DATA.Monthly;

  // Category distribution
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    value: categoryCounts[cat]
  }));

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Date', 'Amount', 'Status'];
    const rows = orders.map(o => [o.id, `"${o.customerName}"`, o.date, o.amount, o.status]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StyleAura_Report_${period}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2D124D] font-serif flex items-center gap-2">
            <BarChart2 className="w-7 h-7 text-[#7C3AED]" />
            Reports & Business Intelligence
          </h1>
          <p className="text-xs text-purple-700/80 mt-1">
            Analyze fashion sales trajectory, category breakdowns, stock velocity, and customer growth
          </p>
        </div>

        {/* Export Buttons */}
        <div className="no-print flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-purple-50 text-purple-900 text-xs font-bold border border-purple-200 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4C1D95] hover:bg-[#3B0764] text-white text-xs font-bold shadow-md shadow-purple-900/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print PDF Report</span>
          </button>
        </div>
      </div>

      {/* Period Filter Tabs */}
      <div className="no-print flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              period === p
                ? 'bg-[#3B0764] text-white shadow-md'
                : 'bg-white hover:bg-purple-50 text-purple-900 border border-purple-100'
            }`}
          >
            {p} Sales Report
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between text-xs text-purple-600 font-semibold mb-2">
            <span>Period Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-[#2D124D]">₹29,80,000</h3>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">↑ 18.4% vs previous {period.toLowerCase()}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between text-xs text-purple-600 font-semibold mb-2">
            <span>Total Units Sold</span>
            <ShoppingCart className="w-4 h-4 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-[#2D124D]">1,710</h3>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">↑ 14.2% demand spike</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between text-xs text-purple-600 font-semibold mb-2">
            <span>Avg Order Value (AOV)</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-[#2D124D]">₹1,742</h3>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">↑ 3.8% higher cart spend</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between text-xs text-purple-600 font-semibold mb-2">
            <span>Stock Health Index</span>
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-[#2D124D]">94.2%</h3>
          <p className="text-[11px] text-purple-700 font-semibold mt-1">Optimal luxury inventory</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Revenue Trajectory (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-[#2D124D]">{period} Revenue Trajectory</h2>
              <p className="text-xs text-gray-500">Gross sales performance over {period.toLowerCase()} milestones</p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
              INR (₹)
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="reportGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C4B5FD" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3E8FF" />
                <XAxis dataKey="label" stroke="#A78BFA" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#A78BFA"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => (val >= 100000 ? `${(val / 100000).toFixed(1)}L` : `${val / 1000}k`)}
                />
                <Tooltip
                  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Gross Revenue']}
                  contentStyle={{ backgroundColor: '#2E1065', borderRadius: '12px', color: '#fff', border: 'none' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6D28D9" strokeWidth={3} fill="url(#reportGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-purple-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#2D124D]">Category Catalog Share</h2>
            <p className="text-xs text-gray-500">Portfolio product distribution</p>
          </div>

          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#2E1065', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-2 justify-center text-[11px] text-gray-600">
            {pieData.map((p, idx) => (
              <span key={p.name} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }} />
                <span>{p.name} ({p.value})</span>
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Best-Selling Products & Stock Report */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Best Selling Products */}
        <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm">
          <h2 className="text-base font-bold text-[#2D124D] mb-3">Best-Selling Collections</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF5FF] text-purple-950 font-bold border-b border-purple-100">
                <tr>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3 text-right">Sold Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {[...products].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 px-3 font-semibold text-[#2D124D]">{p.name}</td>
                    <td className="py-2.5 px-3 text-purple-700">{p.category}</td>
                    <td className="py-2.5 px-3 font-bold text-[#3B0764]">₹{p.price.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-600">{p.sold || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Inventory Health */}
        <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm">
          <h2 className="text-base font-bold text-[#2D124D] mb-3">Inventory Stock Status</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF5FF] text-purple-950 font-bold border-b border-purple-100">
                <tr>
                  <th className="py-2.5 px-3">SKU / Item</th>
                  <th className="py-2.5 px-3">Current Stock</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Alert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {products.slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 px-3 font-semibold text-[#2D124D]">{p.name}</td>
                    <td className="py-2.5 px-3 font-bold text-purple-950">{p.stock} units</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stock <= 10 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {p.stock <= 10 ? 'Low Stock' : 'Healthy'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-gray-500">
                      {p.stock <= 10 ? '⚠️ Reorder' : '✓ Normal'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
