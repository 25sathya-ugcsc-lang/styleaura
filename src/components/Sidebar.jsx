import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  ShoppingCart,
  Truck,
  Star,
  MessageSquare,
  BarChart2,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Customer Management', path: '/customers', icon: Users },
    { name: 'Product Management', path: '/products', icon: ShoppingBag },
    { name: 'Order Management', path: '/orders', icon: ShoppingCart },
    { name: 'Services Management', path: '/services', icon: Truck },
    { name: 'Ratings & Reviews', path: '/reviews', icon: Star },
    { name: 'Enquiry Management', path: '/enquiries', icon: MessageSquare },
    { name: 'Reports', path: '/reports', icon: BarChart2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-purple-950/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-[#2D124D] text-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-2xl overflow-hidden`}
      >
        {/* Top Brand Logo Area */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-purple-800/40">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-purple-400 via-pink-300 to-purple-200 shadow-md shadow-purple-950/50 flex-shrink-0">
              <img
                src="/assets/logo/styleaura-logo.png"
                alt="StyleAura Official Logo"
                className="w-full h-full object-cover rounded-full bg-white"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white font-serif flex items-center gap-1">
                StyleAura
              </h1>
              <p className="text-[11px] text-purple-200/80 font-medium tracking-wide">
                Fashion for a better you
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-purple-200 hover:text-white hover:bg-purple-800/50 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto z-10">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#EDE9FE] text-[#3B0764] shadow-md font-semibold'
                      : 'text-purple-100/90 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isActive ? 'text-[#3B0764] scale-110' : 'text-purple-200/90'
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 w-full px-4 py-3 mt-2 rounded-full text-sm font-medium text-purple-200/90 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-5 h-5 text-purple-200/90" />
            <span>Logout</span>
          </button>
        </nav>

        {/* Botanical Leaves Floral Artwork at Bottom (matching Reference Image 1) */}
        <div className="relative p-4 mt-auto pointer-events-none select-none">
          <svg
            className="w-28 h-28 text-purple-400/20 absolute -bottom-3 -left-3 transform -rotate-12"
            fill="currentColor"
            viewBox="0 0 100 100"
          >
            <path d="M20,90 Q30,60 50,50 Q70,40 85,20 Q65,40 50,60 Q35,80 20,90 Z" />
            <path d="M20,90 Q40,75 55,80 Q40,85 20,90 Z" />
            <path d="M35,65 Q50,55 60,62 Q45,67 35,65 Z" />
            <path d="M50,50 Q65,35 78,42 Q60,48 50,50 Z" />
          </svg>
          <div className="relative z-10 px-3 py-2 rounded-xl bg-purple-900/40 border border-purple-700/30 text-center">
            <span className="text-[10px] tracking-wider uppercase text-purple-300 font-semibold">
              Pure React CRM v2.0
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
