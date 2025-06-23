"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { loginUser, registerUser, loginWithToken } from "../../store/slices/authSlice";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const dispatch = useDispatch<AppDispatch>();
  const { token, loading, error } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (token) {
      router.replace("/dashboard");
    }
  }, [token, router]);

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      dispatch(loginWithToken(token));
      router.push("/dashboard");
    }
  }, [params, dispatch, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(loginUser({ email: form.email, password: form.password }));
    } else {
      dispatch(registerUser({ email: form.email, password: form.password, name: form.name }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary w-[500px]">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-strong border border-border flex flex-col items-center">
        <div className="flex w-full mb-8">
          <button
            className={`flex-1 py-2 rounded-l-xl font-semibold transition-all ${isLogin ? "bg-black text-white shadow-subtle" : "bg-secondary text-black"}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-r-xl font-semibold transition-all ${!isLogin ? "bg-black text-white shadow-subtle" : "bg-secondary text-black"}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-black bg-secondary text-black"
              autoComplete="name"
              required
            />
          )}
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
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-black bg-secondary text-black"
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
          />
          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-lg bg-black text-white font-semibold shadow-subtle hover:shadow-strong transition-all disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (isLogin ? "Logging in..." : "Registering...") : isLogin ? "Login" : "Register"}
          </button>
          {isLogin && (
            <a href="/auth/forgot-password" className="mt-2 text-sm text-accent hover:underline text-center">Forgot password?</a>
          )}
        </form>
        {error && <div className="mt-4 text-red-600 text-sm font-medium">{error}</div>}
        <div className="mt-6 w-full flex flex-col items-center">
          <span className="text-xs text-accent mb-2">or continue with</span>
          <button
            onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
            className="w-full py-3 rounded-lg border border-border bg-white text-black font-semibold shadow-subtle hover:shadow-strong flex items-center justify-center gap-2 transition-all"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303C33.978 32.042 29.369 35 24 35c-6.075 0-11-4.925-11-11s4.925-11 11-11c2.507 0 4.81.857 6.646 2.278l6.366-6.366C33.527 6.671 28.977 5 24 5 12.954 5 4 13.954 4 25s8.954 20 20 20c10.493 0 19.5-8.507 19.5-19 0-1.27-.138-2.507-.389-3.694z"/><path fill="#34A853" d="M6.306 14.691l6.571 4.819C14.655 16.104 19.004 13 24 13c2.507 0 4.81.857 6.646 2.278l6.366-6.366C33.527 6.671 28.977 5 24 5c-6.627 0-12.31 2.69-16.694 7.691z"/><path fill="#FBBC05" d="M24 45c5.311 0 10.13-1.822 13.885-4.942l-6.418-5.263C29.37 36.042 26.791 37 24 37c-5.352 0-9.872-3.438-11.489-8.13l-6.57 5.066C7.67 41.02 15.27 45 24 45z"/><path fill="#EA4335" d="M43.611 20.083H42V20H24v8h11.303c-1.23 3.29-4.37 7-11.303 7-6.075 0-11-4.925-11-11s4.925-11 11-11c2.507 0 4.81.857 6.646 2.278l6.366-6.366C33.527 6.671 28.977 5 24 5c-6.627 0-12.31 2.69-16.694 7.691z"/></g></svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
} 