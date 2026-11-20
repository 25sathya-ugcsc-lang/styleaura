import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Store,
  Bell,
  Image as ImageIcon,
  Check,
  RefreshCw,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const { settings, updateSettings, resetToDefaultData } = useData();

  // Admin Profile form
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Admin',
    email: user?.email || 'admin@styleaura.com',
    role: user?.role || 'Head Store Manager'
  });
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  // Store settings form
  const [storeData, setStoreData] = useState({
    storeName: settings.storeName || 'StyleAura Luxury Fashion',
    contactEmail: settings.contactEmail || 'contact@styleaura.com',
    phone: settings.phone || '+91 800-STYLE-AURA',
    address: settings.address || 'StyleAura Luxury Towers, Fashion Avenue, Mumbai 400001',
    currency: settings.currency || '₹',
    taxRate: settings.taxRate || 12,
    lowStockAlert: settings.lowStockAlert || 10
  });
  const [storeSuccess, setStoreSuccess] = useState(false);

  // Notification toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(profileData);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Please fill in all password fields.' });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setPasswordMsg({ type: 'success', text: 'Admin password updated successfully in local session.' });
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setPasswordMsg({ type: '', text: '' }), 4000);
  };

  const handleStoreSubmit = (e) => {
    e.preventDefault();
    updateSettings(storeData);
    setStoreSuccess(true);
    setTimeout(() => setStoreSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data (customers, orders, products, reviews) to initial defaults?')) {
      resetToDefaultData();
      alert('All demo data has been reset to default.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-[#2D124D] font-serif flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-[#7C3AED]" />
          Store & System Settings
        </h1>
        <p className="text-xs text-purple-700/80 mt-1">
          Configure StyleAura store information, security, branding assets, and notification preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Profile & Branding Logo (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Official StyleAura Logo Showcase */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm text-center">
            <h3 className="text-sm font-bold text-purple-950 uppercase tracking-wider mb-4 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Official Brand Logo</span>
            </h3>

            <div className="relative w-36 h-36 mx-auto rounded-full p-1.5 bg-gradient-to-tr from-purple-500 via-pink-400 to-purple-300 shadow-xl mb-4 group">
              <img
                src="/assets/logo/styleaura-logo.png"
                alt="StyleAura Official Logo"
                className="w-full h-full object-cover rounded-full bg-white shadow-inner group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <h4 className="text-lg font-bold font-serif text-[#2D124D]">StyleAura</h4>
            <p className="text-xs text-purple-700/80 mt-0.5">Fashion for a better you</p>
            
            <div className="mt-4 pt-3 border-t border-purple-50 text-[11px] text-gray-500">
              <p>Path: <code className="text-purple-700 font-mono">public/assets/logo/styleaura-logo.png</code></p>
            </div>
          </div>

          {/* Admin Profile Details */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm">
            <h3 className="text-sm font-bold text-[#2D124D] mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-purple-600" />
              <span>Admin Profile</span>
            </h3>

            {profileSuccess && (
              <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 animate-fade-in">
                <Check className="w-4 h-4" /> Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-purple-950 mb-1">Display Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-purple-950 mb-1">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-purple-950 mb-1">System Role</label>
                <input
                  type="text"
                  value={profileData.role}
                  onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-400 focus:outline-none bg-purple-50/50"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold transition-all shadow-sm"
              >
                Save Profile Changes
              </button>
            </form>
          </div>

          {/* Reset Demo Data Card */}
          <div className="bg-purple-50/60 rounded-3xl p-5 border border-purple-200/80 text-center">
            <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider mb-1">
              Demo Data Reset
            </h4>
            <p className="text-[11px] text-purple-700/80 mb-3">
              Restore initial luxury products, orders, and customer records from scratch
            </p>
            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 shadow-sm transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Sample Data</span>
            </button>
          </div>

        </div>

        {/* Right Column: Store Info, Password, Notifications (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Store Information */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#2D124D] flex items-center gap-2">
                <Store className="w-5 h-5 text-purple-600" />
                <span>StyleAura Boutique Information</span>
              </h3>
              {storeSuccess && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full animate-fade-in flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </div>

            <form onSubmit={handleStoreSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-purple-950 mb-1">Store / Brand Name</label>
                  <input
                    type="text"
                    value={storeData.storeName}
                    onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-purple-950 mb-1">Official Contact Email</label>
                  <input
                    type="email"
                    value={storeData.contactEmail}
                    onChange={(e) => setStoreData({ ...storeData, contactEmail: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-purple-950 mb-1">Support Phone</label>
                  <input
                    type="text"
                    value={storeData.phone}
                    onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-purple-950 mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    value={storeData.currency}
                    onChange={(e) => setStoreData({ ...storeData, currency: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-purple-950 mb-1">Standard Tax / GST (%)</label>
                  <input
                    type="number"
                    value={storeData.taxRate}
                    onChange={(e) => setStoreData({ ...storeData, taxRate: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-purple-950 mb-1">Headquarter / Boutique Address</label>
                <textarea
                  rows="2"
                  value={storeData.address}
                  onChange={(e) => setStoreData({ ...storeData, address: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold transition-all shadow-md"
                >
                  Update Store Settings
                </button>
              </div>
            </form>
          </div>

          {/* Change Password UI */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm">
            <h3 className="text-base font-bold text-[#2D124D] mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-600" />
              <span>Change Password</span>
            </h3>

            {passwordMsg.text && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs font-semibold animate-fade-in ${
                  passwordMsg.type === 'error'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-purple-950 mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-purple-950 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-purple-950 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#4C1D95] hover:bg-[#3B0764] text-white font-bold transition-all shadow-md"
                >
                  Update Admin Password
                </button>
              </div>
            </form>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm">
            <h3 className="text-base font-bold text-[#2D124D] mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-600" />
              <span>Notification Preferences</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-purple-50/50 hover:bg-purple-50 cursor-pointer transition-colors">
                <div>
                  <p className="font-bold text-purple-950">In-App Sound & Popups</p>
                  <p className="text-gray-500 text-[11px]">Play chime and show toast when a new luxury order is booked</p>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-400"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-purple-50/50 hover:bg-purple-50 cursor-pointer transition-colors">
                <div>
                  <p className="font-bold text-purple-950">Low Stock Inventory Alerts</p>
                  <p className="text-gray-500 text-[11px]">Notify when sizes or gowns fall below 10 remaining pieces</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-400"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-purple-50/50 hover:bg-purple-50 cursor-pointer transition-colors">
                <div>
                  <p className="font-bold text-purple-950">Bespoke Concierge & Customer Inquiries</p>
                  <p className="text-gray-500 text-[11px]">Instant alerts for alteration requests and wedding queries</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-400"
                />
              </label>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
