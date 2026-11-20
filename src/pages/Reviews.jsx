import React, { useState } from 'react';
import {
  Star,
  Search,
  Plus,
  MessageSquare,
  Trash2,
  CornerDownRight,
  Send,
  X,
  Sparkles
} from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Reviews() {
  const { reviews, products, addReview, replyReview, deleteReview } = useData();

  const [search, setSearch] = useState('');
  const [selectedRating, setSelectedRating] = useState('All');
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New review form
  const [formData, setFormData] = useState({
    customerName: '',
    productName: products[0]?.name || 'Floral Midi Dress',
    rating: 5,
    comment: ''
  });

  const filteredReviews = reviews.filter(r => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase());
    const matchesRating = selectedRating === 'All' || r.rating === Number(selectedRating);
    return matchesSearch && matchesRating;
  });

  const handleSendReply = (id) => {
    if (!replyText.trim()) return;
    replyReview(id, replyText);
    setActiveReplyId(null);
    setReplyText('');
  };

  const handleCreateReview = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.comment) return;
    addReview({
      ...formData,
      rating: Number(formData.rating)
    });
    setIsAddModalOpen(false);
    setFormData({
      customerName: '',
      productName: products[0]?.name || 'Floral Midi Dress',
      rating: 5,
      comment: ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this review entry?')) {
      deleteReview(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Add Review */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2D124D] font-serif flex items-center gap-2">
            <Star className="w-7 h-7 text-[#7C3AED] fill-[#7C3AED]" />
            Ratings & Reviews
          </h1>
          <p className="text-xs text-purple-700/80 mt-1">
            Read verified boutique client testimonials and submit official brand replies
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] hover:from-[#3B0764] hover:to-[#6D28D9] text-white text-xs font-bold shadow-md shadow-purple-900/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer Review</span>
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
            placeholder="Search reviews by customer name, product, comment..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-purple-50/50 text-xs text-[#2D124D] placeholder-purple-400 border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
          />
        </div>

        {/* Star Rating Filter */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['All', '5', '4', '3', '2', '1'].map((star) => (
            <button
              key={star}
              onClick={() => setSelectedRating(star)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                selectedRating === star
                  ? 'bg-[#3B0764] text-white shadow'
                  : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-100'
              }`}
            >
              <span>{star === 'All' ? 'All Stars' : `${star} ★`}</span>
            </button>
          ))}
        </div>

      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-500 border border-purple-100">
            No reviews match the selected filter.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-5 border border-purple-100/80 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-purple-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-[#3B0764] flex items-center justify-center font-bold text-sm shadow-inner">
                    {rev.customerName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#2D124D]">{rev.customerName}</h3>
                    <p className="text-xs text-purple-700 font-semibold">{rev.productName}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  {/* Star Rating */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= rev.rating
                            ? 'fill-[#7C3AED] text-[#7C3AED]'
                            : 'text-purple-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">{rev.date}</span>
                  
                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-1 rounded text-gray-300 hover:text-rose-600 transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Review Comment */}
              <div className="py-3">
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed font-medium italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Existing Admin Reply */}
              {rev.reply ? (
                <div className="mt-2 p-3.5 rounded-xl bg-[#FAF5FF] border border-purple-100/90 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span className="font-bold text-purple-950">Official StyleAura Reply</span>
                  </div>
                  <p className="text-purple-900/90 pl-5">{rev.reply}</p>
                  <div className="mt-2 pl-5">
                    <button
                      onClick={() => {
                        setActiveReplyId(rev.id);
                        setReplyText(rev.reply);
                      }}
                      className="text-[11px] font-semibold text-purple-600 hover:text-purple-800"
                    >
                      Edit Reply
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <button
                    onClick={() => {
                      setActiveReplyId(rev.id);
                      setReplyText('');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    <CornerDownRight className="w-3.5 h-3.5" />
                    <span>Reply as Admin</span>
                  </button>
                </div>
              )}

              {/* Active Reply Input Box */}
              {activeReplyId === rev.id && (
                <div className="mt-3 p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-2 animate-fade-in">
                  <textarea
                    rows="2"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a warm, gracious reply to the customer..."
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
                      onClick={() => handleSendReply(rev.id)}
                      className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-sm"
                    >
                      <Send className="w-3 h-3" />
                      <span>Post Reply</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal: Add Review */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-100 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#2D124D] mb-1 font-serif">Add Customer Review</h3>
            <p className="text-xs text-purple-700/80 mb-4">Record in-store customer feedback or external reviews</p>

            <form onSubmit={handleCreateReview} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-purple-950 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Sen"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-950 mb-1">Product Purchased</label>
                <select
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-950 mb-1">Star Rating (1-5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formData.rating
                            ? 'fill-[#7C3AED] text-[#7C3AED]'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-purple-950 ml-2">{formData.rating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-950 mb-1">Review Message *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="What did the client say about the fabric, fit and packaging?"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
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
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
