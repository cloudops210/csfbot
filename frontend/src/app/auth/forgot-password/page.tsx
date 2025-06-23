"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, clearForgotState } from "../../../store/slices/authSlice";
import { RootState, AppDispatch } from "../../../store";

export default function ForgotPasswordPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, forgotSuccess } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background w-[500px]">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-strong border border-border flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        {forgotSuccess ? (
          <div className="text-green-600 font-medium mb-4">{forgotSuccess}</div>
        ) : (
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-black bg-secondary text-black"
              autoComplete="email"
              required
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-black text-white font-semibold shadow-subtle hover:shadow-strong transition-all disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            {error && <div className="text-red-600 text-sm font-medium mt-2">{error}</div>}
          </form>
        )}
      </div>
    </div>
  );
} 