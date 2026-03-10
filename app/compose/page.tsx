"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/ui/header";
import { Send, MapPin, Search, X, Calendar, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface UserResult {
  id: string;
  name: string;
  email: string;
  city: string;
  country: string;
}

const STATIONERY_STYLES = [
  { id: "classic-cream", name: "Classic Cream", bg: "bg-[#FDFCFB]", border: "border-ink/5", textColor: "text-ink" },
  { id: "ocean-blue", name: "Ocean Blue", bg: "bg-[#F0F4F8]", border: "border-[#B8D4E3]/30", textColor: "text-[#2C3E50]" },
  { id: "rose-petal", name: "Rose Petal", bg: "bg-[#FFF5F5]", border: "border-[#E8B4B8]/30", textColor: "text-[#5D3A3A]" },
  { id: "midnight", name: "Midnight", bg: "bg-[#1A1A2E]", border: "border-[#3A3A5C]/50", textColor: "text-[#E0E0E0]" },
  { id: "vintage", name: "Vintage", bg: "bg-[#F5E6C8]", border: "border-[#C9A96E]/30", textColor: "text-[#4A3728]" },
];

export default function Compose() {
  const router = useRouter();
  const [recipient, setRecipient] = useState<UserResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [content, setContent] = useState("");
  const [signOff, setSignOff] = useState("");
  const [stationery, setStationery] = useState("classic-cream");
  const [showStationery, setShowStationery] = useState(false);
  const [isFutureLetter, setIsFutureLetter] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ eta: string; city: string } | null>(null);
  const [remainingLetters, setRemainingLetters] = useState(3);

  const currentStyle = STATIONERY_STYLES.find((s) => s.id === stationery) || STATIONERY_STYLES[0];

  // Fetch remaining letters
  useEffect(() => {
    fetch("/api/users/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.remainingLetters !== undefined) setRemainingLetters(d.remainingLetters);
      })
      .catch(() => {});
  }, []);

  // Search users
  const searchUsers = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.users || []);
    } catch {
      setSearchResults([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchUsers(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchUsers]);

  async function handleSend() {
    if (!recipient || !content.trim()) {
      setError("Please select a recipient and write your letter");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/letters/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: recipient.email,
          content: content.trim(),
          signOff,
          receiverCity: recipient.city || "Unknown",
          stationeryStyle: stationery,
          scheduledDate: isFutureLetter && scheduledDate ? scheduledDate : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send letter");
        setLoading(false);
        return;
      }

      const eta = new Date(data.letter.deliveryEta);
      const now = Date.now();
      const diffMs = eta.getTime() - now;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const etaStr = hours > 24
        ? `${Math.floor(hours / 24)}d ${hours % 24}h`
        : `${hours}h ${minutes}m`;

      setSuccess({ eta: etaStr, city: data.letter.receiverCity });
      setRemainingLetters(data.remainingLetters);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen pb-20">
        <Header />
        <main className="max-w-2xl mx-auto px-6 pt-32 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-stamp-red/10 border border-stamp-red/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Send size={36} className="text-stamp-red" />
            </div>
            <h1 className="font-serif text-4xl text-ink mb-4">Letter Sent!</h1>
            <p className="font-sans text-lg text-ink/60 mb-2">
              Your letter is traveling to <strong className="text-ink">{success.city}</strong>
            </p>
            <p className="font-handwriting text-3xl text-stamp-red/70 -rotate-1">
              ETA: {success.eta}
            </p>
          </motion.div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => {
                setSuccess(null);
                setContent("");
                setSignOff("");
                setRecipient(null);
                setSearchQuery("");
              }}
              className="px-6 py-3 bg-ink text-creamy rounded-full font-sans font-semibold shadow-xl shadow-ink/20 hover:bg-ink/90 transition-all active:scale-95"
            >
              Write Another
            </button>
            <button
              onClick={() => router.push("/sent")}
              className="px-6 py-3 bg-creamy text-ink border border-ink/10 rounded-full font-sans font-semibold shadow-md hover:bg-parchment transition-all active:scale-95"
            >
              View Outbox
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment pb-20">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-32">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink/10 pb-6">
          <div>
            <h1 className="font-serif text-4xl text-ink tracking-tight mb-2">Write a Letter</h1>
            <p className="font-sans text-ink/60">Take a breath. What do you want to say?</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-sans text-sm text-ink/50">
              <strong className="text-ink">{remainingLetters}</strong>/3 letters today
            </span>
            <button
              onClick={() => setShowStationery(!showStationery)}
              className="flex items-center gap-1.5 px-3 py-2 bg-creamy border border-ink/10 rounded-xl text-sm font-sans text-ink/70 hover:bg-white transition-colors"
            >
              <Palette size={14} />
              Stationery
            </button>
          </div>
        </div>

        {/* Stationery Picker */}
        <AnimatePresence>
          {showStationery && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="flex flex-wrap gap-3 p-4 bg-creamy/80 border border-ink/10 rounded-2xl">
                {STATIONERY_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setStationery(style.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-sans transition-all ${
                      stationery === style.id
                        ? "border-ink shadow-md scale-105"
                        : "border-transparent hover:border-ink/20"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md ${style.bg} border ${style.border}`} />
                    <span className="text-ink/80">{style.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-stamp-red/10 border border-stamp-red/20 text-stamp-red text-sm px-4 py-3 rounded-xl mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* The Writing Desktop Paper Canvas */}
        <div className={`relative w-full min-h-[700px] ${currentStyle.bg} shadow-2xl rounded-sm border ${currentStyle.border} flex flex-col pt-10 pb-8 px-6 sm:px-16 overflow-hidden`}>
          {/* Paper texture overlay */}
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.75\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\"/%3E%3C/svg%3E')" }} />

          {/* Header of paper (Recipient) */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-ink/10 pb-6 mb-8 relative z-10 gap-4">
            <div className="flex-1 relative">
              <label className="text-[10px] font-sans text-ink/40 uppercase tracking-widest mb-1.5 block">To</label>
              {recipient ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-ink/5 px-4 py-2 rounded-xl">
                    <span className="font-serif text-xl text-ink">{recipient.name}</span>
                    <span className="text-xs text-ink/40 font-sans">({recipient.email})</span>
                  </div>
                  <button
                    onClick={() => { setRecipient(null); setSearchQuery(""); }}
                    className="text-ink/30 hover:text-ink/60 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <Search size={16} className="text-ink/30" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }}
                      onFocus={() => setShowSearch(true)}
                      placeholder="Search by name or email..."
                      className={`w-full bg-transparent border-none outline-none font-serif text-2xl ${currentStyle.textColor} placeholder:text-ink/20 focus:ring-0`}
                    />
                  </div>

                  {/* Search dropdown */}
                  {showSearch && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-creamy border border-ink/10 rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto">
                      {searchResults.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => {
                            setRecipient(user);
                            setShowSearch(false);
                            setSearchQuery("");
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-ink/5 transition-colors flex items-center justify-between border-b border-ink/5 last:border-none"
                        >
                          <div>
                            <p className="font-serif text-ink font-semibold">{user.name}</p>
                            <p className="text-xs text-ink/40 font-sans">{user.email}</p>
                          </div>
                          {user.city && (
                            <span className="flex items-center gap-1 text-xs text-ink/40 font-sans">
                              <MapPin size={10} />
                              {user.city}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {recipient?.city && (
              <div className="flex items-center gap-2 text-ink/40 shrink-0">
                <MapPin size={16} />
                <span className="font-sans text-sm">{recipient.city}{recipient.country ? `, ${recipient.country}` : ""}</span>
              </div>
            )}
          </div>

          {/* Letter Body */}
          <div className="flex-1 relative z-10 min-h-[300px]">
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, var(--ink) 31px, var(--ink) 32px)",
                backgroundPosition: "0 4px",
              }}
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`absolute inset-0 w-full h-full bg-transparent border-none outline-none resize-none font-serif text-lg leading-[32px] ${currentStyle.textColor} placeholder:text-ink/20 focus:ring-0`}
              placeholder="Write your message here... take your time."
            />
          </div>

          {/* Footer */}
          <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between relative z-10 mt-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="font-handwriting text-3xl text-ink/80">
                <input
                  type="text"
                  value={signOff}
                  onChange={(e) => setSignOff(e.target.value)}
                  placeholder="Sign your name"
                  className="bg-transparent border-none outline-none placeholder:text-ink/20 w-48 focus:ring-0"
                />
              </div>

              {/* Future letter toggle */}
              <button
                onClick={() => setIsFutureLetter(!isFutureLetter)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans transition-all border ${
                  isFutureLetter
                    ? "bg-stamp-red/10 border-stamp-red/20 text-stamp-red"
                    : "bg-ink/5 border-ink/10 text-ink/50 hover:bg-ink/10"
                }`}
              >
                <Calendar size={12} />
                Future Letter
              </button>
            </div>

            <div className="flex items-center gap-3">
              {isFutureLetter && (
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                  className="bg-white/60 border border-ink/10 rounded-xl px-3 py-2 font-sans text-sm text-ink focus:outline-none focus:border-ink/30"
                />
              )}

              <button
                onClick={handleSend}
                disabled={loading || !recipient || !content.trim()}
                className="flex items-center gap-2.5 bg-stamp-red text-creamy px-7 py-3 rounded-full font-sans text-sm font-semibold tracking-wide shadow-[0_8px_20px_-6px_rgba(217,74,56,0.6)] hover:bg-stamp-red/90 transition-all hover:-translate-y-0.5 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-creamy/30 border-t-creamy rounded-full animate-spin" />
                ) : (
                  <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                )}
                <span>Seal & Send</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
