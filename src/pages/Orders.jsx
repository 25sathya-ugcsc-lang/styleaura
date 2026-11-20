import React, { useState } from 'react';
import {
  ShoppingCart,
  Search,
  Plus,
  Eye,
  FileText,
  Printer,
  X,
  CheckCircle,
  Truck,
  Clock,
  Ban,
  PackageCheck
} from 'lucide-react';
import { useData } from '../context/DataContext';

const STATUSES = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function Orders() {
  const { orders, products, customers, addOrder, updateOrder, cancelOrder, deleteOrder, settings } = useData();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [modalMode, setModalMode] = useState(null); // 'add' | 'view' | 'invoice'
  const [activeOrder, setActiveOrder] = useState(null);

  // Add Order Form
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    paymentMethod: 'UPI / Card',
    selectedProductId: products[0]?.id || '',
    qty: 1,
    amount: products[0]?.price || 1999
  });

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (o.customerEmail || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-[#EDE9FE] text-[#6B21A8] border border-purple-200';
      case 'Shipped':
        return 'bg-[#DCFCE7] text-[#15803D] border border-green-200';
      case 'Delivered':
        return 'bg-[#DCFCE7] text-[#15803D] border border-green-200';
      case 'Pending':
        return 'bg-[#FEF3C7] text-[#B45309] border border-amber-200';
      case 'Cancelled':
        return 'bg-[#FEE2E2] text-[#B91C1C] border border-rose-200';
      default:
        return 'bg-purple-50 text-purple-700';
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrder(orderId, { status: newStatus });
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.amount) return;

    const prod = products.find(p => p.id === formData.selectedProductId) || products[0];

    addOrder({
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      shippingAddress: formData.shippingAddress || 'Customer shipping address provided at checkout',
      paymentMethod: formData.paymentMethod,
      amount: Number(formData.amount),
      items: [
        {
          name: prod ? prod.name : 'StyleAura Fashion Ensemble',
          qty: Number(formData.qty),
          price: Number(prod ? prod.price : formData.amount)
        }
      ]
    });

    setModalMode(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Add Order */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2D124D] font-serif flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-[#7C3AED]" />
            Order Management
          </h1>
          <p className="text-xs text-purple-700/80 mt-1">
            Track orders, update delivery statuses, cancel orders, and generate invoices
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              customerName: '',
              customerEmail: '',
              customerPhone: '',
              shippingAddress: '',
              paymentMethod: 'UPI / Card',
              selectedProductId: products[0]?.id || '',
              qty: 1,
              amount: products[0]?.price || 1999
            });
            setModalMode('add');
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] hover:from-[#3B0764] hover:to-[#6D28D9] text-white text-xs font-bold shadow-md shadow-purple-900/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Order</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {STATUSES.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === st
                  ? 'bg-[#3B0764] text-white shadow-md'
                  : 'bg-white hover:bg-purple-100 text-purple-900 border border-purple-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID, customer..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white text-xs text-[#2D124D] placeholder-purple-400 border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400/20 shadow-sm"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-purple-100/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF5FF] text-purple-900/80 font-bold border-b border-purple-100/80">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#2D124D]">
                      {order.id}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-[#2D124D]">{order.customerName}</p>
                      <p className="text-[10px] text-gray-500">{order.customerEmail}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {order.date}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-gray-800">
                      {order.items?.map(i => `${i.name} (x${i.qty})`).join(', ') || '1x Fashion Ensemble'}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#3B0764]">
                      ₹{Number(order.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-medium">
                      {order.paymentMethod || 'UPI / Card'}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer focus:outline-none ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setActiveOrder(order);
                            setModalMode('view');
                          }}
                          className="p-1.5 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setActiveOrder(order);
                            setModalMode('invoice');
                          }}
                          className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Preview & Print Invoice"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        {order.status !== 'Cancelled' && (
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Cancel Order"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Order */}
      {modalMode === 'add' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#2D124D] mb-1 font-serif">Create Manual Order</h3>
            <p className="text-xs text-purple-700/80 mb-4">Record offline boutique order or custom booking</p>

            <form onSubmit={handleCreateOrder} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-purple-950 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shalini Roy"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="customer@example.com"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Select Item</label>
                  <select
                    value={formData.selectedProductId}
                    onChange={(e) => {
                      const prod = products.find(p => p.id === e.target.value);
                      setFormData({
                        ...formData,
                        selectedProductId: e.target.value,
                        amount: prod ? prod.price * formData.qty : formData.amount
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.qty}
                    onChange={(e) => {
                      const qty = Number(e.target.value);
                      const prod = products.find(p => p.id === formData.selectedProductId);
                      setFormData({
                        ...formData,
                        qty,
                        amount: prod ? prod.price * qty : formData.amount
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Total Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white"
                  >
                    <option value="UPI / Card">UPI / Card</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="Store Credit">Store Credit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-950 mb-1">Shipping Address</label>
                <textarea
                  rows="2"
                  placeholder="Full delivery address with pin code"
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
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
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Order Details */}
      {modalMode === 'view' && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-[#2D124D] font-mono">{activeOrder.id}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusBadge(activeOrder.status)}`}>
                {activeOrder.status}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100">
                <p className="font-bold text-purple-950 text-sm">{activeOrder.customerName}</p>
                <p className="text-gray-600">{activeOrder.customerEmail} • {activeOrder.customerPhone || 'N/A'}</p>
                <p className="text-gray-700 mt-1"><strong>Shipping to:</strong> {activeOrder.shippingAddress || 'Not specified'}</p>
              </div>

              <div>
                <p className="font-bold text-purple-950 mb-2">Ordered Items:</p>
                <div className="divide-y divide-purple-50 border border-purple-100 rounded-xl overflow-hidden">
                  {activeOrder.items?.map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between bg-white">
                      <div>
                        <p className="font-semibold text-purple-950">{it.name}</p>
                        <span className="text-gray-500">Qty: {it.qty}</span>
                      </div>
                      <span className="font-bold text-purple-900">₹{(it.price * it.qty).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-100/50 rounded-xl font-bold text-sm text-[#2D124D]">
                <span>Total Amount Paid</span>
                <span className="text-[#3B0764] text-base">₹{Number(activeOrder.amount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-purple-100 flex justify-between">
              <button
                onClick={() => setModalMode('invoice')}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl"
              >
                <FileText className="w-4 h-4" />
                <span>View Full Invoice</span>
              </button>
              <button
                onClick={() => setModalMode(null)}
                className="px-5 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Invoice Preview & Print */}
      {modalMode === 'invoice' && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-purple-100 relative max-h-[92vh] overflow-y-auto">
            
            <div className="no-print flex items-center justify-between pb-4 mb-4 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-700" />
                <span className="font-bold text-sm text-purple-950">Official Tax Invoice Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setModalMode(null)}
                  className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Body */}
            <div className="p-6 bg-[#FAF5FF]/30 rounded-2xl border border-purple-100 print:border-none print:p-0">
              {/* Header with StyleAura Official Logo */}
              <div className="flex items-center justify-between border-b-2 border-purple-200 pb-5 mb-5">
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/logo/styleaura-logo.png"
                    alt="StyleAura Logo"
                    className="w-16 h-16 rounded-full object-cover border-2 border-purple-300"
                  />
                  <div>
                    <h2 className="text-2xl font-bold font-serif text-[#2D124D]">StyleAura</h2>
                    <p className="text-[11px] text-purple-700 font-medium">Fashion for a better you</p>
                    <p className="text-[10px] text-gray-500">GSTIN: 27AABCS1429B1Z2</p>
                  </div>
                </div>

                <div className="text-right">
                  <h3 className="text-lg font-bold font-mono text-purple-950">{activeOrder.id}</h3>
                  <p className="text-xs text-gray-500">Date: {activeOrder.date}</p>
                  <p className="text-xs text-purple-700 font-semibold mt-1">Status: {activeOrder.status}</p>
                </div>
              </div>

              {/* Billed To */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-purple-400 tracking-wider">Customer Details</span>
                  <p className="font-bold text-purple-950 text-sm mt-1">{activeOrder.customerName}</p>
                  <p className="text-gray-600">{activeOrder.customerEmail}</p>
                  <p className="text-gray-600">{activeOrder.customerPhone || '+91 98765 43210'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-purple-400 tracking-wider">Shipping Destination</span>
                  <p className="text-gray-700 mt-1">{activeOrder.shippingAddress || '42 Rosewood Avenue, Bandra West, Mumbai 400050'}</p>
                  <p className="text-gray-600 mt-1">Payment Method: <strong>{activeOrder.paymentMethod || 'Prepaid UPI'}</strong></p>
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-xs text-left mb-6">
                <thead className="bg-purple-100/70 text-purple-950 font-bold border-b border-purple-200">
                  <tr>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  {activeOrder.items?.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-medium text-gray-800">{it.name}</td>
                      <td className="py-2.5 px-3 text-center">{it.qty}</td>
                      <td className="py-2.5 px-3 text-right">₹{Number(it.price).toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-purple-950">₹{(it.price * it.qty).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Invoice Calculations */}
              <div className="flex justify-end text-xs">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>₹{Number(activeOrder.amount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (12% Included):</span>
                    <span>₹{Math.round(activeOrder.amount * 0.12).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Charges:</span>
                    <span className="text-emerald-600 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-purple-200 font-bold text-sm text-[#2D124D]">
                    <span>Grand Total:</span>
                    <span className="text-base text-[#3B0764]">₹{Number(activeOrder.amount).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Invoice Footer */}
              <div className="mt-8 pt-4 border-t border-purple-200 text-center text-[10px] text-gray-500">
                <p className="font-semibold text-purple-900">Thank you for shopping with StyleAura Luxury Fashion!</p>
                <p>For alterations, inquiries or returns, email us at support@styleaura.com</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
