"use client";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export default function DashboardOverview() {
  useAuthGuard();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Message */}
      <div className="bg-white rounded-xl shadow-subtle p-6 border border-border">
        <h1 className="text-2xl font-bold text-black mb-2">
          Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'}! 👋
        </h1>
        <p className="text-accent">Here's what's happening with your trading bots today.</p>
      </div>

      {/* Account summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-subtle p-6 flex flex-col items-center border border-border">
          <div className="text-2xl font-bold text-black mb-2">$12,340</div>
          <div className="text-sm text-accent">Account Balance</div>
        </div>
        <div className="bg-white rounded-xl shadow-subtle p-6 flex flex-col items-center border border-border">
          <div className="text-2xl font-bold text-black mb-2">3</div>
          <div className="text-sm text-accent">Active Bots</div>
        </div>
        <div className="bg-white rounded-xl shadow-subtle p-6 flex flex-col items-center border border-border">
          <div className="text-2xl font-bold text-black mb-2">Premium</div>
          <div className="text-sm text-accent">Subscription</div>
        </div>
      </div>
      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-subtle p-4 flex flex-col items-center border border-border">
          <div className="text-lg font-semibold text-black">+4.2%</div>
          <div className="text-xs text-accent">P&L Today</div>
        </div>
        <div className="bg-white rounded-xl shadow-subtle p-4 flex flex-col items-center border border-border">
          <div className="text-lg font-semibold text-black">12</div>
          <div className="text-xs text-accent">Trades Today</div>
        </div>
        <div className="bg-white rounded-xl shadow-subtle p-4 flex flex-col items-center border border-border">
          <div className="text-lg font-semibold text-black">1</div>
          <div className="text-xs text-accent">Alerts</div>
        </div>
      </div>
      {/* Recent activity */}
      <div className="bg-white rounded-xl shadow-subtle p-6 border border-border">
        <div className="text-lg font-bold mb-4">Recent Activity</div>
        <ul className="divide-y divide-border">
          <li className="py-2 flex items-center gap-2 text-sm"><span className="text-green-600">●</span> Bot "Momentum" executed a trade (BTC/USDT)</li>
          <li className="py-2 flex items-center gap-2 text-sm"><span className="text-blue-600">●</span> Subscription renewed (Premium)</li>
          <li className="py-2 flex items-center gap-2 text-sm"><span className="text-yellow-500">●</span> New alert: High volatility detected</li>
        </ul>
      </div>
      {/* Get Started button */}
      <div className="flex justify-end">
        <a href="/dashboard/bots" className="px-6 py-3 rounded-lg bg-black text-white font-semibold shadow-subtle hover:shadow-strong transition-all">Get Started / Create Bot</a>
      </div>
    </div>
  );
} 