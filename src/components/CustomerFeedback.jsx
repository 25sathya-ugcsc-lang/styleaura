import React from 'react';
import { MessageSquareQuote, ArrowRight, Star, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CustomerFeedback({ reviews = [] }) {
  // Display top 2 reviews matching Reference Image 1
  const displayReviews = reviews.slice(0, 2);

  return (
    <div className="bg-white rounded-2xl p-5 border border-purple-100/70 shadow-sm flex flex-col justify-between">
      {/* Header matching Reference Image 1 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-100/70 flex items-center justify-center text-[#3B0764]">
            <MessageSquareQuote className="w-4 h-4 stroke-[2.2]" />
          </div>
          <h3 className="text-sm font-bold text-[#2D124D]">
            Customer Feedback
          </h3>
        </div>

        <Link
          to="/reviews"
          className="text-xs font-semibold text-[#6B21A8] hover:text-[#4C1D95] flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Reviews List matching Reference Image 1 */}
      <div className="space-y-3.5">
        {displayReviews.map((item) => (
          <div key={item.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-purple-50/50 transition-colors">
            {/* Purple Circular Avatar */}
            <div className="w-9 h-9 rounded-full bg-[#EDE9FE] text-[#3B0764] flex items-center justify-center flex-shrink-0 font-bold text-xs shadow-inner">
              <User className="w-4 h-4" />
            </div>

            <div className="flex-1">
              {/* Star Rating */}
              <div className="flex items-center gap-0.5 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= item.rating
                        ? 'fill-[#7C3AED] text-[#7C3AED]'
                        : 'text-purple-200'
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-xs font-medium text-purple-950/90 italic">
                "{item.comment}"
              </p>
              
              {/* Author */}
              <p className="text-[11px] font-semibold text-purple-700/80 mt-0.5">
                – {item.customerName}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
