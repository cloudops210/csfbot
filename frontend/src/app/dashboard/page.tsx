"use client";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { setUser } from "../../store/slices/authSlice";

export default function DashboardOverview() {
  useAuthGuard();
  const dispatch = useDispatch();
  const { user, loading, token } = useSelector((state: RootState) => state.auth);
  const searchParams = useSearchParams();
  const [trades, setTrades] = useState<any[]>([]);
  const [tradesLoading, setTradesLoading] = useState(false);

  useEffect(() => {
    // Check if we're returning from Stripe checkout
    const sessionId = searchParams.get('session_id');
    if (sessionId && token) {
      // Refresh user data to get updated subscription status
      api.get('/api/auth/me')
        .then(res => {
          dispatch(setUser(res.data.user));
        }).catch(console.error);
    }
  }, [searchParams, token, dispatch]);

  useEffect(() => {
    if (token) {
      setTradesLoading(true);
      api.get('/api/auth/trades')
        .then(res => setTrades(res.data.trades))
        .catch(() => setTrades([]))
        .finally(() => setTradesLoading(false));
    }
  }, [token]);

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
          <div className="text-2xl font-bold text-black mb-2">{user?.subscriptionPlan || 'Free'}</div>
          <div className="text-sm text-accent">Subscription ({user?.subscriptionStatus || 'inactive'})</div>
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
      {/* Trading History Section */}
      <div className="bg-white rounded-xl shadow-subtle p-6 border border-border">
        <h2 className="text-xl font-bold mb-4 text-black flex items-center gap-2">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="inline-block text-blue-600"><path d="M3 17V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M16 3v4M8 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M3 9h18" stroke="currentColor" strokeWidth="2"/></svg>
          Trading History
        </h2>
        {tradesLoading ? (
          <div className="flex justify-center items-center py-8">
            <span className="loader border-blue-600"></span>
            <span className="ml-2 text-blue-600">Loading trades...</span>
          </div>
        ) : trades.length === 0 ? (
          <div className="text-center text-accent py-8">No trades found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Symbol</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Side</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Exchange</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {trades.map((trade) => (
                  <tr key={trade._id} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-2 font-mono text-sm text-blue-700">{trade.symbol}</td>
                    <td className={`px-4 py-2 font-semibold ${trade.side === 'buy' ? 'text-green-600' : 'text-red-600'}`}>{trade.side.toUpperCase()}</td>
                    <td className="px-4 py-2">{trade.quantity}</td>
                    <td className="px-4 py-2">${trade.price.toLocaleString()}</td>
                    <td className="px-4 py-2 text-xs text-gray-500">{new Date(trade.timestamp).toLocaleString()}</td>
                    <td className={`px-4 py-2 capitalize font-semibold ${trade.status === 'filled' ? 'text-green-600' : trade.status === 'pending' ? 'text-yellow-600' : 'text-gray-500'}`}>{trade.status}</td>
                    <td className="px-4 py-2 text-blue-500">{trade.exchange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Get Started button */}
      <div className="flex justify-end">
        <a href="/dashboard/bots" className="px-6 py-3 rounded-lg bg-black text-white font-semibold shadow-subtle hover:shadow-strong transition-all">Get Started / Create Bot</a>
      </div>
    </div>
  );
} 