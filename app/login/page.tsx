"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/inbox");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-48 h-64 bg-creamy rotate-6 rounded-2xl shadow-lg border border-ink/5 -z-10 opacity-60" />
      <div className="absolute bottom-20 right-10 w-56 h-40 bg-parchment -rotate-3 rounded-xl shadow-xl border border-ink/5 -z-10 opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 bg-stamp-red rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Mail size={20} className="text-creamy" />
            </div>
            <span className="font-serif text-3xl font-bold text-ink tracking-tight">SlowMail</span>
          </Link>
          <p className="font-handwriting text-2xl text-ink/50 mt-4 -rotate-1">Welcome back, letter writer</p>
        </div>

        {/* Login Card */}
        <div className="bg-creamy/80 backdrop-blur-sm border border-ink/10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(45,42,38,0.12)] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-stamp-red/10 border border-stamp-red/20 text-stamp-red text-sm px-4 py-3 rounded-xl"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-[11px] font-sans text-ink/50 uppercase tracking-widest mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-white/60 border border-ink/10 rounded-xl px-4 py-3.5 font-sans text-ink placeholder:text-ink/25 focus:outline-none focus:border-ink/30 focus:ring-2 focus:ring-ink/5 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-sans text-ink/50 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-white/60 border border-ink/10 rounded-xl px-4 py-3.5 pr-12 font-sans text-ink placeholder:text-ink/25 focus:outline-none focus:border-ink/30 focus:ring-2 focus:ring-ink/5 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-ink text-creamy py-4 rounded-xl font-sans font-semibold tracking-wide shadow-xl shadow-ink/20 hover:bg-ink/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-creamy/30 border-t-creamy rounded-full animate-spin" />
              ) : (
                <>
                  Open Your Desk
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-sans text-sm text-ink/50">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-stamp-red font-semibold hover:text-stamp-red/80 transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
