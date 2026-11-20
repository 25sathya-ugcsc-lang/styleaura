import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, Menu, User, Settings as SettingsIcon, LogOut, CheckCircle2, Package, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, products, customers, orders } = useData();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick filtered results for the search pill
  const filteredProducts = searchQuery
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
    : [];
  const filteredCustomers = searchQuery
    ? customers.filter(c => (c.fullName || c.name).toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2)
    : [];
  const filteredOrders = searchQuery
    ? orders.filter(o => o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.customerName.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2)
    : [];

  const hasSearchResults = searchQuery.trim().length > 0;

  return (
    <header className="sticky top-0 z-30 bg-[#F8F5FE]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 border-b border-purple-100/60 transition-all">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left Side: Mobile Menu Button & Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl text-purple-900 bg-purple-100/70 hover:bg-purple-200/80 transition-colors lg:hidden"
            aria-label="Open Sidebar Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar - matching Reference Image 1 */}
          <div className="relative flex-1" ref={searchRef}>
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-purple-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search customers, orders, products..."
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#EDE9FE]/70 hover:bg-[#EDE9FE] focus:bg-white text-sm text-[#2E1065] placeholder-purple-400 border border-transparent focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400/20 shadow-sm transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-xs text-purple-500 hover:text-purple-800 bg-purple-200/60 rounded-full px-1.5 py-0.5"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Live Search Overlay */}
            {isSearchFocused && hasSearchResults && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-purple-100 p-3 z-50 animate-fade-in max-h-96 overflow-y-auto">
                <div className="text-xs font-semibold uppercase tracking-wider text-purple-500 px-2 py-1 flex items-center justify-between">
                  <span>Search Matches</span>
                  <span className="text-[10px] text-gray-400">Press Esc to close</span>
                </div>

                {filteredProducts.length > 0 && (
                  <div className="mt-2">
                    <span className="text-[11px] font-bold text-gray-400 px-2">Products</span>
                    {filteredProducts.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          navigate('/products');
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-purple-50 cursor-pointer transition-colors"
                      >
                        <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-purple-950">{p.name}</p>
                          <p className="text-xs text-purple-600">₹{p.price.toLocaleString('en-IN')} • {p.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {filteredCustomers.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-purple-50">
                    <span className="text-[11px] font-bold text-gray-400 px-2">Customers</span>
                    {filteredCustomers.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          navigate('/customers');
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-purple-50 cursor-pointer transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                          {c.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-purple-950">{c.fullName || c.name}</p>
                          <p className="text-xs text-purple-600">{c.city} • {c.ordersCount} orders</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {filteredOrders.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-purple-50">
                    <span className="text-[11px] font-bold text-gray-400 px-2">Orders</span>
                    {filteredOrders.map(o => (
                      <div
                        key={o.id}
                        onClick={() => {
                          navigate('/orders');
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-purple-50 cursor-pointer transition-colors"
                      >
                        <div>
                          <p className="text-sm font-semibold text-purple-950">{o.id} - {o.customerName}</p>
                          <p className="text-xs text-gray-500">{o.date}</p>
                        </div>
                        <span className="text-xs font-bold text-purple-700">₹{o.amount.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                )}

                {filteredProducts.length === 0 && filteredCustomers.length === 0 && filteredOrders.length === 0 && (
                  <div className="text-center py-6 text-sm text-gray-500">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Notification Bell & Admin Profile */}
        <div className="flex items-center gap-4">
          
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2.5 rounded-full text-purple-900 bg-purple-100/60 hover:bg-purple-200/80 transition-colors focus:outline-none"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-purple-900" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#EF4444] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-purple-100 py-3 z-50 animate-fade-in">
                <div className="flex items-center justify-between px-4 pb-3 border-b border-purple-100">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-purple-950 text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-700 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-purple-50">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-gray-500">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3.5 hover:bg-purple-50/70 transition-colors cursor-pointer flex gap-3 ${
                          !n.read ? 'bg-purple-50/40' : ''
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                          {n.type === 'order' ? <Package className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-purple-950">{n.title}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{n.message}</p>
                          <span className="text-[10px] text-purple-400 mt-1 block">{n.time}</span>
                        </div>
                        {!n.read && (
                          <div className="w-2 h-2 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Pill - matching Reference Image 1 */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full hover:bg-purple-100/60 transition-colors focus:outline-none"
            >
              <div className="w-9 h-9 rounded-full bg-[#3B0764] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-purple-300">
                A
              </div>
              <span className="font-semibold text-sm text-[#2E1065] hidden sm:inline-block">
                Admin
              </span>
              <ChevronDown className="w-4 h-4 text-purple-700 transition-transform duration-200" />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-purple-100 py-2 z-50 animate-fade-in">
                <div className="px-4 py-2.5 border-b border-purple-100">
                  <p className="text-sm font-bold text-purple-950">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-purple-600 truncate">{user?.email || 'admin@styleaura.com'}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-900 transition-colors"
                  >
                    <SettingsIcon className="w-4 h-4 text-purple-600" />
                    <span>Store Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/customers');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-900 transition-colors"
                  >
                    <User className="w-4 h-4 text-purple-600" />
                    <span>Customer List</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-purple-100">
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
