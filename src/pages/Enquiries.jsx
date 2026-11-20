import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Plus,
  Send,
  Trash2,
  X,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useData } from '../context/DataContext';

const STATUS_FILTERS = ['All', 'New', 'In Progress', 'Resolved'];

export default function Enquiries() {
  const { enquiries, addEnquiry, replyEnquiry, updateEnquiryStatus, deleteEnquiry } = useData();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New enquiry form
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const filteredEnquiries = enquiries.filter(e => {
    const matchesSearch =
      e.customerName.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase()) ||
      e.message.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || e.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendReply = (id) => {
    if (!replyText.trim()) return;
    replyEnquiry(id, replyText, 'Resolved');
    setActiveReplyId(null);
    setReplyText('');
  };

  const handleCreateEnquiry = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.subject || !formData.message) return;
    addEnquiry(formData);
    setIsAddModalOpen(false);
    setFormData({
      customerName: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this customer enquiry record?')) {
      deleteEnquiry(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Add Enquiry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2D124D] font-serif flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-[#7C3AED]" />
            Enquiry Management
          </h1>
          <p className="text-xs text-purple-700/80 mt-1">
            Handle bespoke customer styling consultations, wedding bulk inquiries, and sizing requests
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] hover:from-[#3B0764] hover:to-[#6D28D9] text-white text-xs font-bold shadow-md shadow-purple-900/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Customer Enquiry</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search enquiries by subject, customer name, email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-purple-50/50 text-xs text-[#2D124D] placeholder-purple-400 border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedStatus === st
                  ? 'bg-[#3B0764] text-white shadow'
                  : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Enquiries List */}
      <div className="space-y-4">
        {filteredEnquiries.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-500 border border-purple-100">
            No enquiries match the selected filter.
          </div>
        ) : (
          filteredEnquiries.map((enq) => (
            <div
              key={enq.id}
              className="bg-white rounded-2xl p-5 border border-purple-100/80 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-purple-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-[#3B0764] flex items-center justify-center font-bold text-sm shadow-inner">
                    {enq.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-[#2D124D]">{enq.customerName}</h3>
                      <span className="font-mono text-[10px] text-gray-400">({enq.id})</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-purple-500" /> {enq.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-purple-500" /> {enq.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-[11px] text-gray-400 font-medium">{enq.date}</span>
                  
                  {/* Status Dropdown */}
                  <select
                    value={enq.status}
                    onChange={(e) => updateEnquiryStatus(enq.id, e.target.value)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer focus:outline-none ${getStatusBadge(
                      enq.status
                    )}`}
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>

                  <button
                    onClick={() => handleDelete(enq.id)}
                    className="p-1 rounded text-gray-300 hover:text-rose-600 transition-colors"
                    title="Delete Enquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subject & Enquiry Message */}
              <div className="py-3">
                <h4 className="text-xs font-bold text-[#3B0764] mb-1 uppercase tracking-wide">
                  Subject: {enq.subject}
                </h4>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed font-normal">
                  {enq.message}
                </p>
              </div>

              {/* Existing Admin Reply */}
              {enq.reply ? (
                <div className="mt-2 p-3.5 rounded-xl bg-[#FAF5FF] border border-purple-100 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span className="font-bold text-purple-950">Concierge Response Sent</span>
                  </div>
                  <p className="text-purple-900/90 pl-5">{enq.reply}</p>
                  <div className="mt-2 pl-5">
                    <button
                      onClick={() => {
                        setActiveReplyId(enq.id);
                        setReplyText(enq.reply);
                      }}
                      className="text-[11px] font-semibold text-purple-600 hover:text-purple-800"
                    >
                      Update Response
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <button
                    onClick={() => {
                      setActiveReplyId(enq.id);
                      setReplyText('');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3.5 py-1.5 rounded-xl transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Respond to Customer</span>
                  </button>
                </div>
              )}

              {/* Active Reply Input Box */}
              {activeReplyId === enq.id && (
                <div className="mt-3 p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-2 animate-fade-in">
                  <textarea
                    rows="3"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type official response or consultation details..."
                    className="w-full p-2.5 rounded-lg border border-purple-200 text-xs text-[#2D124D] focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setActiveReplyId(null)}
                      className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSendReply(enq.id)}
                      className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-sm"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send & Mark Resolved</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal: Add Enquiry */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#2D124D] mb-1 font-serif">Log Customer Enquiry</h3>
            <p className="text-xs text-purple-700/80 mb-4">Record phone inquiry, bridal appointment, or WhatsApp message</p>

            <form onSubmit={handleCreateEnquiry} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
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
                <label className="block text-xs font-semibold text-purple-950 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="customer@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-950 mb-1">Subject / Inquiry Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bridal Lehengas Fabric & Custom Fit"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-950 mb-1">Enquiry Details *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Client questions, quantities, color preferences, event dates..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
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
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#4C1D95] hover:bg-[#3B0764] rounded-xl shadow-md transition-all"
                >
                  Log Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
