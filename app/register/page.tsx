"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight, Eye, EyeOff, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    country: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Register
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto sign in after registration
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("Account created but login failed. Please go to login page.");
      } else {
        router.push("/onboarding");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-16 right-16 w-52 h-36 bg-parchment rotate-3 rounded-2xl shadow-lg border border-ink/5 -z-10 opacity-50" />
      <div className="absolute bottom-16 left-16 w-44 h-60 bg-creamy -rotate-6 rounded-xl shadow-xl border border-ink/5 -z-10 opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 bg-stamp-red rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Mail size={20} className="text-creamy" />
            </div>
            <span className="font-serif text-3xl font-bold text-ink tracking-tight">SlowMail</span>
          </Link>
          <p className="font-handwriting text-2xl text-ink/50 mt-4 -rotate-1">Begin your letter-writing journey</p>
        </div>

        {/* Register Card */}
        <div className="bg-creamy/80 backdrop-blur-sm border border-ink/10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(45,42,38,0.12)] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
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
              <label className="block text-[11px] font-sans text-ink/50 uppercase tracking-widest mb-2">Your Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="What should we call you?"
                required
                className="w-full bg-white/60 border border-ink/10 rounded-xl px-4 py-3.5 font-sans text-ink placeholder:text-ink/25 focus:outline-none focus:border-ink/30 focus:ring-2 focus:ring-ink/5 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-sans text-ink/50 uppercase tracking-widest mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
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
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="Create a password"
                  required
                  minLength={6}
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

            {/* Location Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-sans text-ink/50 uppercase tracking-widest mb-2">
                  <MapPin size={10} className="inline mr-1" />City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="Delhi"
                  className="w-full bg-white/60 border border-ink/10 rounded-xl px-4 py-3.5 font-sans text-ink placeholder:text-ink/25 focus:outline-none focus:border-ink/30 focus:ring-2 focus:ring-ink/5 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-sans text-ink/50 uppercase tracking-widest mb-2">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  placeholder="India"
                  className="w-full bg-white/60 border border-ink/10 rounded-xl px-4 py-3.5 font-sans text-ink placeholder:text-ink/25 focus:outline-none focus:border-ink/30 focus:ring-2 focus:ring-ink/5 transition-all"
                />
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
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-sans text-sm text-ink/50">
              Already have an account?{" "}
              <Link href="/login" className="text-stamp-red font-semibold hover:text-stamp-red/80 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
