import React from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecentOrders({ orders = [] }) {
  // Display top 4 orders matching Reference Image 1
  const displayOrders = orders.slice(0, 4);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-[#EDE9FE] text-[#6B21A8] font-semibold';
      case 'Shipped':
        return 'bg-[#DCFCE7] text-[#15803D] font-semibold';
      case 'Delivered':
        return 'bg-[#DCFCE7] text-[#15803D] font-semibold';
      case 'Pending':
        return 'bg-[#FEF3C7] text-[#B45309] font-semibold';
      case 'Cancelled':
        return 'bg-[#FEE2E2] text-[#B91C1C] font-semibold';
      default:
        return 'bg-purple-50 text-purple-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-purple-100/70 shadow-sm flex flex-col justify-between">
      {/* Header matching Reference Image 1 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-100/70 flex items-center justify-center text-[#3B0764]">
            <ShoppingCart className="w-4 h-4 stroke-[2.2]" />
          </div>
          <h3 className="text-sm font-bold text-[#2D124D]">
            Recent Orders
          </h3>
        </div>

        <Link
          to="/orders"
          className="text-xs font-semibold text-[#6B21A8] hover:text-[#4C1D95] flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Orders Table matching Reference Image 1 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-purple-900/60 font-semibold border-b border-purple-100/60 pb-2">
              <th className="pb-2 font-medium">Order ID</th>
              <th className="pb-2 font-medium">Customer</th>
              <th className="pb-2 font-medium">Amount</th>
              <th className="pb-2 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50/70">
            {displayOrders.map((order) => (
              <tr key={order.id} className="hover:bg-purple-50/40 transition-colors">
                <td className="py-2.5 font-semibold text-[#2D124D]">
                  {order.id}
                </td>
                <td className="py-2.5 text-purple-950 font-medium">
                  {order.customerName}
                </td>
                <td className="py-2.5 font-semibold text-[#3B0764]">
                  ₹{Number(order.amount).toLocaleString('en-IN')}
                </td>
                <td className="py-2.5 text-right">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
