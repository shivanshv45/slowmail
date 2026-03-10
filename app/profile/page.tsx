"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Heading } from "@/components/ui/typography";
import { Loader2, Save, Mail, Send, MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  city: string;
  country: string;
  bio: string;
  isPublic: boolean;
  createdAt: string;
  _count: {
    sentLetters: number;
    receivedLetters: number;
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    country: "",
    bio: "",
    isPublic: false,
  });

  useEffect(() => {
    fetch("/api/users/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setProfile(data.user);
          setFormData({
            name: data.user.name,
            city: data.user.city,
            country: data.user.country,
            bio: data.user.bio,
            isPublic: data.user.isPublic,
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Header />
        <Loader2 size={32} className="text-ink/30 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <main className="max-w-3xl mx-auto px-6 pt-32">
        <div className="mb-10 border-b border-ink/10 pb-8">
          <Heading className="mb-3 text-5xl">Your Profile</Heading>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: Send, label: "Letters Sent", value: profile?._count?.sentLetters || 0 },
            { icon: Mail, label: "Letters Received", value: profile?._count?.receivedLetters || 0 },
            { icon: Calendar, label: "Member Since", value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—" },
          ].map(({ icon: Icon, label, value }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-creamy/80 border border-ink/10 rounded-2xl p-5 text-center"
            >
              <Icon size={20} className="text-ink/30 mx-auto mb-2" />
              <p className="font-serif text-2xl text-ink font-bold">{value}</p>
              <p className="text-xs text-ink/50 font-sans uppercase tracking-wider mt-1">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Edit Form */}
        <div className="bg-creamy/80 border border-ink/10 rounded-2xl p-8 shadow-sm">
          <div className="space-y-6">
            <div>
              <label className="block text-[11px] font-sans text-ink/50 uppercase tracking-widest mb-2">Display Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/60 border border-ink/10 rounded-xl px-4 py-3.5 font-sans text-ink placeholder:text-ink/25 focus:outline-none focus:border-ink/30 focus:ring-2 focus:ring-ink/5 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-sans text-ink/50 uppercase tracking-widest mb-2">
                  <MapPin size={10} className="inline mr-1" />City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Your city"
                  className="w-full bg-white/60 border border-ink/10 rounded-xl px-4 py-3.5 font-sans text-ink placeholder:text-ink/25 focus:outline-none focus:border-ink/30 focus:ring-2 focus:ring-ink/5 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-sans text-ink/50 uppercase tracking-widest mb-2">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Your country"
                  className="w-full bg-white/60 border border-ink/10 rounded-xl px-4 py-3.5 font-sans text-ink placeholder:text-ink/25 focus:outline-none focus:border-ink/30 focus:ring-2 focus:ring-ink/5 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-sans text-ink/50 uppercase tracking-widest mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell others about yourself..."
                rows={4}
                className="w-full bg-white/60 border border-ink/10 rounded-xl px-4 py-3.5 font-sans text-ink placeholder:text-ink/25 focus:outline-none focus:border-ink/30 focus:ring-2 focus:ring-ink/5 transition-all resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  formData.isPublic ? "bg-stamp-red" : "bg-ink/15"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-1 transition-all ${
                    formData.isPublic ? "left-6" : "left-1"
                  }`}
                />
              </button>
              <span className="font-sans text-sm text-ink/70">Make profile public (visible in Discover)</span>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-ink text-creamy rounded-full font-sans font-semibold shadow-xl shadow-ink/20 hover:bg-ink/90 transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-creamy/30 border-t-creamy rounded-full animate-spin" />
              ) : saved ? (
                <>
                  <Save size={16} />
                  Saved!
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
