"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail, clearVerifyState } from "../../../store/slices/authSlice";
import { RootState, AppDispatch } from "../../../store";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, verifySuccess } = useSelector((state: RootState) => state.auth);
  const [form, setForm] = useState({ email: "", token: "" });

  useEffect(() => {
    const email = searchParams.get("email");
    const token = searchParams.get("token");
    if (email && token) {
      setForm({ email, token });
      dispatch(verifyEmail({ email, token }));
    }
    return () => { dispatch(clearVerifyState()); };
    // eslint-disable-next-line
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(verifyEmail(form));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background w-[500px]">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-strong border border-border flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        {verifySuccess ? (
          <>
            <div className="text-green-600 font-medium mb-4">{verifySuccess}</div>
            <button
              className="w-full py-3 rounded-lg bg-black text-white font-semibold shadow-subtle hover:shadow-strong transition-all"
              onClick={() => router.replace("/auth")}
            >
              Go to Login
            </button>
          </>
        ) : (
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-black bg-secondary text-black"
              autoComplete="email"
              required
            />
            <input
              type="text"
              name="token"
              placeholder="Verification Token"
              value={form.token}
              onChange={handleChange}
              className="px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-black bg-secondary text-black"
              required
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-black text-white font-semibold shadow-subtle hover:shadow-strong transition-all disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
            {error && <div className="text-red-600 text-sm font-medium mt-2">{error}</div>}
          </form>
        )}
      </div>
    </div>
  );
} 