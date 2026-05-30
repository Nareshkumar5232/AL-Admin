"use client";

import { Menu, Moon, Search, Sun } from "lucide-react";
import { useSidebarStore } from "@/store/sidebarStore";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getInitials } from "@/lib/utils";

export function Navbar() {
  const { toggleMobile } = useSidebarStore();
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header
      className="sticky top-0 z-20 h-16 flex items-center justify-between px-4 lg:px-6 border-b backdrop-blur-xl"
      style={{
        background: 'var(--glass-bg)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Left: Mobile menu + Search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={toggleMobile}
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
        >
          <Menu className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
        </button>

        <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search anything..."
              className="admin-input pl-10 h-10"
              style={{ background: 'var(--bg-tertiary)' }}
            />
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2.5 rounded-xl transition-colors hover:bg-[var(--bg-hover)]"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <AnimatePresence mode="wait">
            {theme === "dark" ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-5 h-5 text-yellow-400" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-5 h-5 text-blue-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-[var(--bg-hover)] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9EFF00] to-[#00BFFF] flex items-center justify-center text-xs font-bold text-black">
              {user ? getInitials(user.name) : "AU"}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium leading-tight" style={{ color: 'var(--text-primary)' }}>
                {user?.name || "Admin User"}
              </p>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                {user?.role || "Super Admin"}
              </p>
            </div>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-48 glass-card-static p-2 z-50"
              >
                <button
                  onClick={() => { router.push("/settings"); setShowProfileMenu(false); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Profile Settings
                </button>
                <div className="my-1 border-t" style={{ borderColor: 'var(--border-color)' }} />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </header>
  );
}
