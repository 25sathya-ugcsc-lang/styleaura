import React, { useState } from 'react';
import {
  Truck,
  RotateCcw,
  RefreshCw,
  Scissors,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';

const SERVICE_TYPES = ['All', 'Delivery', 'Returns', 'Exchanges', 'Alterations'];

export default function Services() {
  const { services, addService, updateService, deleteService } = useData();

  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit'
  const [currentService, setCurrentService] = useState(null);

  const [formData, setFormData] = useState({
    type: 'Delivery',
    customerName: '',
    phone: '',
    item: '',
    status: 'Pending',
    assignedTo: '',
    notes: ''
  });

  const filteredServices = services.filter(s => {
    const matchesTab = activeTab === 'All' || s.type === activeTab;
    const matchesSearch =
      s.customerName.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      (s.item || '').toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getServiceIcon = (type) => {
    switch (type) {
      case 'Delivery':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'Returns':
        return <RotateCcw className="w-4 h-4 text-rose-600" />;
      case 'Exchanges':
        return <RefreshCw className="w-4 h-4 text-amber-600" />;
      case 'Alterations':
        return <Scissors className="w-4 h-4 text-purple-600" />;
      default:
        return <Truck className="w-4 h-4 text-purple-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const openAddModal = () => {
    setFormData({
      type: activeTab === 'All' ? 'Delivery' : activeTab,
      customerName: '',
      phone: '',
      item: '',
      status: 'Pending',
      assignedTo: '',
      notes: ''
    });
    setModalMode('add');
  };

  const openEditModal = (srv) => {
    setCurrentService(srv);
    setFormData({
      type: srv.type,
      customerName: srv.customerName,
      phone: srv.phone,
      item: srv.item,
      status: srv.status,
      assignedTo: srv.assignedTo || '',
      notes: srv.notes || ''
    });
    setModalMode('edit');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.item) return;

    if (modalMode === 'add') {
      addService(formData);
    } else if (modalMode === 'edit' && currentService) {
      updateService(currentService.id, formData);
    }
    setModalMode(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this service request?')) {
      deleteService(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2D124D] font-serif flex items-center gap-2">
            <Truck className="w-7 h-7 text-[#7C3AED]" />
            Services Management
          </h1>
          <p className="text-xs text-purple-700/80 mt-1">
            Track white-glove delivery, garment alterations, size returns, and boutique exchanges
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] hover:from-[#3B0764] hover:to-[#6D28D9] text-white text-xs font-bold shadow-md shadow-purple-900/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Service Request</span>
        </button>
      </div>

      {/* Service Type Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {SERVICE_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === type
                ? 'bg-[#3B0764] text-white shadow-md'
                : 'bg-white hover:bg-purple-50 text-purple-900 border border-purple-100'
            }`}
          >
            {type !== 'All' && getServiceIcon(type)}
            <span>{type}</span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-purple-100 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service ID, customer name, item..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-purple-50/50 text-xs text-[#2D124D] placeholder-purple-400 border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
          />
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF5FF] text-purple-950 font-bold border-b border-purple-100">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Service Type</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Garment / Item</th>
                <th className="py-3 px-4">Request Date</th>
                <th className="py-3 px-4">Assigned Partner / Notes</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500">
                    No service requests found for this category.
                  </td>
                </tr>
              ) : (
                filteredServices.map((srv) => (
                  <tr key={srv.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-purple-950">
                      {srv.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-semibold text-[#2D124D]">
                        {getServiceIcon(srv.type)}
                        <span>{srv.type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-purple-950">{srv.customerName}</p>
                      <p className="text-[10px] text-gray-500">{srv.phone}</p>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {srv.item}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {srv.requestDate}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-gray-600">
                      <p className="font-semibold text-purple-900">{srv.assignedTo || 'Unassigned'}</p>
                      <p className="text-[10px] text-gray-500 truncate">{srv.notes}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadge(srv.status)}`}>
                        {srv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(srv)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Service Request"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(srv.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Request"
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

      {/* Modal: Add / Edit Service */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 relative">
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#2D124D] mb-1 font-serif">
              {modalMode === 'add' ? 'Log New Service Request' : 'Update Service Request'}
            </h3>
            <p className="text-xs text-purple-700/80 mb-4">
              Manage status and notes for tailoring, return logistics, and delivery
            </p>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Service Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white"
                  >
                    <option value="Delivery">Delivery</option>
                    <option value="Returns">Returns</option>
                    <option value="Exchanges">Exchanges</option>
                    <option value="Alterations">Alterations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya S"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-950 mb-1">Phone Number</label>
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
                <label className="block text-xs font-semibold text-purple-950 mb-1">Garment / Item Details *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Floral Midi Dress (M - Hem adjustment)"
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-950 mb-1">Assigned Partner / Courier</label>
                <input
                  type="text"
                  placeholder="e.g. Master Tailor Raghav, BlueDart Express Tracking #..."
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-950 mb-1">Special Notes</label>
                <textarea
                  rows="2"
                  placeholder="Fitting preferences, pickup time, etc."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                  Save Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
