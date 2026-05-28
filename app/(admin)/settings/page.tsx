"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  User, 
  Lock, 
  Settings, 
  Bell, 
  Store, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Save, 
  Mail, 
  Phone,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Zod schemas for validation
const securitySchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SecurityFormValues = z.infer<typeof securitySchema>;

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();
  const { user } = useAuthStore();
  
  // Settings Tab state
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'store' | 'notifications'>('profile');

  // Password visibility
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Profile form state (mock saving)
  const [profileName, setProfileName] = useState(user?.name || 'Admin User');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'admin@gmail.com');
  const [profilePhone, setProfilePhone] = useState('+91 99999 88888');

  // Store form state (mock saving)
  const [storeName, setStoreName] = useState('AL HIKMATH ENTERPRISES PVT LTD');
  const [storeAddress, setStoreAddress] = useState('42, Industrial Zone, Bangalore, Karnataka - 560002');
  const [storePhone, setStorePhone] = useState('+91 80 4567 8901');
  const [storeTaxInfo, setStoreTaxInfo] = useState('GSTIN29AAAAA1111A1Z1');

  // Notifications state
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifOrders, setNotifOrders] = useState(true);
  const [notifSecurity, setNotifSecurity] = useState(true);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Security Form hook
  const {
    register: registerSecurity,
    handleSubmit: handleSubmitSecurity,
    reset: resetSecurity,
    formState: { errors: securityErrors },
  } = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('Profile parameters updated on admin database.');
  };

  const handleStoreSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('Store parameters sync completed successfully.');
  };

  const handleSecuritySave = (data: SecurityFormValues) => {
    triggerToast('Security credentials updated. Re-authentication synced.');
    resetSecurity();
  };

  const handleNotificationSave = () => {
    triggerToast('Alert routing endpoints updated.');
  };

  const tabs = [
    { id: 'profile', label: 'Admin profile', icon: User },
    { id: 'security', label: 'Security gateway', icon: Lock },
    { id: 'store', label: 'Logistics & Store', icon: Store },
    { id: 'notifications', label: 'Alert systems', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed top-6 right-6 z-50 glass-card-static p-4 border flex items-center gap-3 bg-[#1A1A1A]/95 text-xs font-bold uppercase shadow-2xl border-[#9EFF00]/30 shadow-[#9EFF00]/10"
          >
            <ShieldCheck size={18} className="text-[#9EFF00]" />
            <span className="text-white">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <PageHeader
        title="System Parameters"
        description="Modify administration metadata, security credentials, visual layouts and notification routes."
      />

      {/* Main layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation Tabs Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#9EFF00]/10 border-[#9EFF00]/30 text-[#9EFF00]'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="glass-card p-6 border"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <div className="border-b pb-4 mb-6" style={{ borderColor: 'var(--border-color)' }}>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Administrative Profile Info
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Modify profile parameters displayed in dashboard layouts.
                  </p>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-4 text-xs font-semibold">
                  <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#9EFF00] font-extrabold text-2xl">
                      {profileName.charAt(0)}
                    </div>
                    <div className="space-y-1 text-center sm:text-left">
                      <h4 className="text-white font-bold text-sm">Avatar Profile Photo</h4>
                      <p className="text-[10px] text-gray-500 font-medium">PNG or JPEG format up to 2MB size.</p>
                      <button 
                        type="button" 
                        onClick={() => triggerToast('Avatar uploading UI initialized.')}
                        className="py-1 px-3 border border-white/10 hover:border-white/20 rounded-lg hover:bg-white/5 transition-all text-[10px] font-bold text-white uppercase mt-1 cursor-pointer"
                      >
                        Upload Avatar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Admin Display Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="admin-input"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Role Identifier</label>
                      <input
                        type="text"
                        value={user?.role || 'Super Admin'}
                        disabled
                        className="admin-input opacity-50 cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Contact Email</label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                          type="email"
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          className="admin-input pl-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Contact Phone</label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                          type="text"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          className="admin-input pl-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-end" style={{ borderColor: 'var(--border-color)' }}>
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider text-black bg-[#9EFF00] hover:bg-[#9EFF00]/90 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save size={14} /> Save Profile Parameters
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="glass-card p-6 border"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <div className="border-b pb-4 mb-6" style={{ borderColor: 'var(--border-color)' }}>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Security Credentials Gateway
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Update master administrator access keys.
                  </p>
                </div>

                <form onSubmit={handleSubmitSecurity(handleSecuritySave)} className="space-y-4 text-xs font-semibold">
                  <div className="space-y-1.5 relative">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Current Security Key</label>
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      {...registerSecurity('currentPassword')}
                      placeholder="••••••••"
                      className="admin-input pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-7 text-gray-400 hover:text-white"
                    >
                      {showCurrentPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    {securityErrors.currentPassword && (
                      <span className="text-red-400 text-xs font-semibold">{securityErrors.currentPassword.message}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 relative">
                      <label className="text-[10px] uppercase font-bold text-gray-400">New Security Key</label>
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        {...registerSecurity('newPassword')}
                        placeholder="••••••••"
                        className="admin-input pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-7 text-gray-400 hover:text-white"
                      >
                        {showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      {securityErrors.newPassword && (
                        <span className="text-red-400 text-xs font-semibold">{securityErrors.newPassword.message}</span>
                      )}
                    </div>

                    <div className="space-y-1.5 relative">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Confirm Security Key</label>
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        {...registerSecurity('confirmPassword')}
                        placeholder="••••••••"
                        className="admin-input pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-7 text-gray-400 hover:text-white"
                      >
                        {showConfirmPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      {securityErrors.confirmPassword && (
                        <span className="text-red-400 text-xs font-semibold">{securityErrors.confirmPassword.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-end" style={{ borderColor: 'var(--border-color)' }}>
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider text-black bg-[#9EFF00] hover:bg-[#9EFF00]/90 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save size={14} /> Update Access Keys
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'store' && (
              <motion.div
                key="store"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="glass-card p-6 border"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <div className="border-b pb-4 mb-6" style={{ borderColor: 'var(--border-color)' }}>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Logistics & Store Info
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Structure company metadata embedded on invoices and client portals.
                  </p>
                </div>

                <form onSubmit={handleStoreSave} className="space-y-4 text-xs font-semibold">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Registered Store Name</label>
                      <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="admin-input"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-gray-400">Store HQ Address</label>
                      <input
                        type="text"
                        value={storeAddress}
                        onChange={(e) => setStoreAddress(e.target.value)}
                        className="admin-input"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400">HQ phone line</label>
                      <input
                        type="text"
                        value={storePhone}
                        onChange={(e) => setStorePhone(e.target.value)}
                        className="admin-input"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-gray-400">GSTIN / Tax ID</label>
                      <input
                        type="text"
                        value={storeTaxInfo}
                        onChange={(e) => setStoreTaxInfo(e.target.value)}
                        className="admin-input font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-end" style={{ borderColor: 'var(--border-color)' }}>
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider text-black bg-[#9EFF00] hover:bg-[#9EFF00]/90 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save size={14} /> Save Logistics Parameters
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Visual Theme Selector Card */}
                <div 
                  className="glass-card p-6 border"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <div className="border-b pb-4 mb-6" style={{ borderColor: 'var(--border-color)' }}>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      Visual Interface System Theme
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Switch data visualizer skins to match desktop ambient lighting.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Dark Theme */}
                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-4 rounded-xl border flex items-center gap-3 text-left transition-all duration-300 relative cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-black/40 border-[#9EFF00]/40 text-[#9EFF00] shadow-md shadow-[#9EFF00]/5'
                          : 'border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Moon size={22} className={theme === 'dark' ? 'text-[#9EFF00]' : ''} />
                      <div>
                        <h4 className="font-bold text-xs uppercase text-white">Matte Dark Cyber Grid</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">Saves battery. Cyber neon layout.</p>
                      </div>
                    </button>

                    {/* Light Theme */}
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-4 rounded-xl border flex items-center gap-3 text-left transition-all duration-300 relative cursor-pointer ${
                        theme === 'light'
                          ? 'bg-white border-[#7ACC00]/40 text-[#7ACC00] shadow-md shadow-[#7ACC00]/5'
                          : 'border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Sun size={22} className={theme === 'light' ? 'text-[#7ACC00]' : ''} />
                      <div>
                        <h4 className="font-bold text-xs uppercase text-white">High Contrast Light</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">Optimal readability during day cycles.</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Notifications Toggles */}
                <div 
                  className="glass-card p-6 border"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <div className="border-b pb-4 mb-6" style={{ borderColor: 'var(--border-color)' }}>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      System Event Alert Routing
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Configure server alerts and triggers.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Toggle items */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <div className="space-y-0.5">
                        <h4 className="text-xs uppercase text-white font-bold">Email Alert Reports</h4>
                        <p className="text-[10px] text-gray-500 font-medium">Receive weekly compiled operational metrics.</p>
                      </div>
                      <label className="inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notifEmail} 
                          onChange={(e) => setNotifEmail(e.target.checked)} 
                        />
                        <div className="relative w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9EFF00]/30 peer-checked:after:bg-[#9EFF00]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <div className="space-y-0.5">
                        <h4 className="text-xs uppercase text-white font-bold">Push Notifications</h4>
                        <p className="text-[10px] text-gray-500 font-medium">Display notifications immediately on browser windows.</p>
                      </div>
                      <label className="inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notifPush} 
                          onChange={(e) => setNotifPush(e.target.checked)} 
                        />
                        <div className="relative w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9EFF00]/30 peer-checked:after:bg-[#9EFF00]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <div className="space-y-0.5">
                        <h4 className="text-xs uppercase text-white font-bold">New Checkout Triggers</h4>
                        <p className="text-[10px] text-gray-500 font-medium">Trigger immediate UI alerts when clients complete checkouts.</p>
                      </div>
                      <label className="inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notifOrders} 
                          onChange={(e) => setNotifOrders(e.target.checked)} 
                        />
                        <div className="relative w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9EFF00]/30 peer-checked:after:bg-[#9EFF00]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between pb-3">
                      <div className="space-y-0.5">
                        <h4 className="text-xs uppercase text-white font-bold">Security Firewall Reports</h4>
                        <p className="text-[10px] text-gray-500 font-medium">Log and display alerts on unauthorized login attempts.</p>
                      </div>
                      <label className="inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notifSecurity} 
                          onChange={(e) => setNotifSecurity(e.target.checked)} 
                        />
                        <div className="relative w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9EFF00]/30 peer-checked:after:bg-[#9EFF00]"></div>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-end" style={{ borderColor: 'var(--border-color)' }}>
                    <button
                      onClick={handleNotificationSave}
                      className="px-4 py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider text-black bg-[#9EFF00] hover:bg-[#9EFF00]/90 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save size={14} /> Update Alert Endpoints
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
