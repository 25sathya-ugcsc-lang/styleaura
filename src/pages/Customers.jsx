import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  MapPin,
  Phone,
  Mail,
  ShoppingBag,
  X,
  UserCheck
} from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Customers() {
  const { customers, orders, addCustomer, updateCustomer, deleteCustomer } = useData();

  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | 'view'
  const [currentCustomer, setCurrentCustomer] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Mumbai'
  });

  // Cities list
  const cities = ['All', ...new Set(customers.map(c => c.city).filter(Boolean))];

  // Filtering
  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      (c.fullName || c.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.phone || '').includes(search);
    const matchesCity = selectedCity === 'All' || c.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  // Handlers
  const openAddModal = () => {
    setFormData({
      name: '',
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: 'Mumbai'
    });
    setModalMode('add');
  };

  const openEditModal = (cust) => {
    setCurrentCustomer(cust);
    setFormData({
      name: cust.name,
      fullName: cust.fullName || cust.name,
      email: cust.email,
      phone: cust.phone,
      address: cust.address,
      city: cust.city
    });
    setModalMode('edit');
  };

  const openViewModal = (cust) => {
    setCurrentCustomer(cust);
    setModalMode('view');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    if (modalMode === 'add') {
      addCustomer(formData);
    } else if (modalMode === 'edit' && currentCustomer) {
      updateCustomer(currentCustomer.id, formData);
    }
    setModalMode(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer record?')) {
      deleteCustomer(id);
    }
  };

  // Get customer orders
  const customerOrders = currentCustomer
    ? orders.filter(
        o =>
          (o.customerEmail && o.customerEmail === currentCustomer.email) ||
          (o.customerName && o.customerName.toLowerCase().includes(currentCustomer.name.toLowerCase()))
      )
    : [];

  return (
    <div className="space-y-6">
      
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2D124D] font-serif flex items-center gap-2">
            <Users className="w-7 h-7 text-[#7C3AED]" />
            Customer Management
          </h1>
          <p className="text-xs text-purple-700/80 mt-1">
            View profiles, addresses, contact details, and client purchase histories
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] hover:from-[#3B0764] hover:to-[#6D28D9] text-white text-xs font-bold shadow-md shadow-purple-900/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-purple-100/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, phone or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-purple-50/50 text-xs text-[#2D124D] placeholder-purple-400 border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
          />
        </div>

        {/* City Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-purple-900/70 font-semibold whitespace-nowrap">City:</span>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-2 rounded-xl bg-purple-50/50 text-xs text-[#2D124D] border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
          >
            {cities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-purple-100/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF5FF] text-purple-900/80 font-bold border-b border-purple-100/80">
              <tr>
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">City / Address</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No customers match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-purple-700">
                      {cust.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-[#3B0764] flex items-center justify-center font-bold text-xs shadow-inner">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[#2D124D]">{cust.fullName || cust.name}</p>
                          <span className="text-[10px] text-purple-400">Joined {cust.joinDate || '2026'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-gray-800">{cust.email}</p>
                      <p className="text-[11px] text-purple-600">{cust.phone}</p>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate">
                      <span className="font-semibold text-purple-950">{cust.city}</span>
                      <p className="text-[11px] text-gray-500 truncate">{cust.address}</p>
                    </td>
                    <td className="py-3 px-4 font-semibold text-purple-950">
                      {cust.ordersCount || 0} orders
                    </td>
                    <td className="py-3 px-4 font-bold text-[#3B0764]">
                      ₹{Number(cust.totalSpent || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openViewModal(cust)}
                          className="p-1.5 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors"
                          title="View Details & Purchase History"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(cust)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Customer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cust.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add / Edit Customer */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 relative">
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#2D124D] mb-1 font-serif">
              {modalMode === 'add' ? 'Add New Customer' : 'Edit Customer Details'}
            </h3>
            <p className="text-xs text-purple-700/80 mb-4">
              Enter customer personal information and shipping address
            </p>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Short Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya S"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="priya.s@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-950 mb-1">City</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Bangalore, Delhi"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-950 mb-1">Full Address</label>
                <textarea
                  rows="2"
                  placeholder="Street, Landmark, Postal Code"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                  {modalMode === 'add' ? 'Create Customer' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Customer Details & Purchase History */}
      {modalMode === 'view' && currentCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-purple-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-purple-100">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-[#3B0764] flex items-center justify-center font-bold text-xl shadow-inner">
                {currentCustomer.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-[#2D124D] font-serif">
                    {currentCustomer.fullName || currentCustomer.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                    {currentCustomer.id}
                  </span>
                </div>
                <p className="text-xs text-purple-700/80 mt-0.5 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified StyleAura VIP Client
                </p>
              </div>
            </div>

            {/* Profile Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100">
                <p className="text-[11px] font-bold text-purple-400 uppercase">Contact Information</p>
                <div className="mt-2 space-y-1 text-xs">
                  <p className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-3.5 h-3.5 text-purple-500" />
                    <span>{currentCustomer.email}</span>
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-3.5 h-3.5 text-purple-500" />
                    <span>{currentCustomer.phone}</span>
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100">
                <p className="text-[11px] font-bold text-purple-400 uppercase">Delivery Address</p>
                <div className="mt-2 text-xs text-gray-700 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-purple-950">{currentCustomer.city}</p>
                    <p>{currentCustomer.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase History Section */}
            <div>
              <h4 className="text-sm font-bold text-[#2D124D] mb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#7C3AED]" />
                <span>Purchase History ({customerOrders.length} orders found)</span>
              </h4>

              {customerOrders.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  No orders recorded for this customer yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {customerOrders.map(o => (
                    <div key={o.id} className="p-3.5 rounded-xl border border-purple-100 bg-[#FAF5FF]/60 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-purple-950 text-xs">{o.id}</span>
                          <span className="text-[10px] text-gray-500">{o.date}</span>
                        </div>
                        <p className="text-xs text-purple-700 mt-1">
                          {o.items?.map(i => `${i.name} (x${i.qty})`).join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-[#3B0764]">₹{Number(o.amount).toLocaleString('en-IN')}</p>
                        <span className="text-[10px] font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full inline-block mt-1">
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-purple-100 flex justify-end">
              <button
                onClick={() => setModalMode(null)}
                className="px-5 py-2 text-xs font-semibold bg-purple-100 text-purple-900 hover:bg-purple-200 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
