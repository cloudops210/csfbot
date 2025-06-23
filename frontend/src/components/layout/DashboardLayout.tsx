"use client";
import React, { ReactNode, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { logout } from "../../store/slices/authSlice";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/dashboard/bots", label: "My Bots", icon: "🤖" },
  { href: "/dashboard/api-keys", label: "API Keys", icon: "🔑" },
  { href: "/dashboard/performance", label: "Performance", icon: "📈" },
  { href: "/dashboard/backtesting", label: "Backtesting", icon: "⏳" },
  { href: "/dashboard/subscription", label: "Subscription", icon: "💳" },
  { href: "/dashboard/referrals", label: "Referrals", icon: "🎁" },
  { href: "/dashboard/support", label: "Support", icon: "💬" },
  { href: "/dashboard/profile", label: "Profile", icon: "👤" },
  // Add admin panel link conditionally if user is admin
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth");
  };

  const handleProfileClick = () => {
    router.push("/dashboard/profile");
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex bg-secondary w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border flex flex-col py-8 px-4 shadow-strong min-h-screen">
        <div className="mb-8 flex items-center gap-2">
          <span className="text-2xl font-bold text-black tracking-tight">TradingBot</span>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-black font-medium hover:bg-secondary hover:shadow-subtle transition-all"
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold mb-2">
            {user?.name?.[0] || user?.email?.[0] || "U"}
          </div>
          <div className="text-sm font-semibold text-black">{user?.name || "User"}</div>
          <div className="text-xs text-accent">{user?.email || "user@example.com"}</div>
        </div>
      </aside>
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Header */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8 shadow-subtle">
          <div className="text-lg font-bold text-black">Platform Dashboard</div>
          <div className="flex items-center gap-4">
            {/* Notifications icon */}
            <button className="relative p-2 rounded-full hover:bg-secondary transition-all">
              <span className="sr-only">Notifications</span>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z" stroke="#18181b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {/* User menu */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={toggleDropdown}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-black font-semibold hover:shadow-subtle transition-all"
              >
                <span>{user?.name || user?.email || "User"}</span>
                <svg 
                  width="16" 
                  height="16" 
                  fill="none" 
                  viewBox="0 0 20 20"
                  className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M6 8l4 4 4-4" stroke="#18181b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-border rounded-lg shadow-strong z-10">
                  <button 
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2 hover:bg-secondary rounded-t-lg"
                  >
                    Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-secondary">Settings</button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-secondary rounded-b-lg text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        {/* Main content */}
        <main className="flex-1 p-8 bg-secondary">
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 