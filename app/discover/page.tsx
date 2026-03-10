"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Heading, Text } from "@/components/ui/typography";
import { Loader2, MapPin, Pen, Users } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface PublicUser {
  id: string;
  name: string;
  city: string;
  country: string;
  bio: string;
  createdAt: string;
  _count: {
    sentLetters: number;
    receivedLetters: number;
  };
}

export default function DiscoverPage() {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users/discover")
      .then((r) => r.json())
      .then((data) => {
        if (data.users) setUsers(data.users);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Header />
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="text-ink/30 animate-spin" />
          <p className="font-sans text-ink/40">Discovering letter writers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <main className="max-w-4xl mx-auto px-6 pt-32">
        <div className="mb-10 border-b border-ink/10 pb-8">
          <Heading className="mb-3 text-5xl">Discover Writers</Heading>
          <Text className="text-lg">Find interesting people and send them a letter.</Text>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-20">
            <Users size={48} className="text-ink/15 mx-auto mb-4" />
            <p className="font-handwriting text-3xl text-ink/30 -rotate-1">No public writers yet...</p>
            <p className="font-sans text-sm text-ink/40 mt-4">
              Be the first! Enable public profile in your{" "}
              <Link href="/profile" className="text-stamp-red hover:underline">profile settings</Link>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {users.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-creamy/80 border border-ink/10 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-ink rounded-full flex items-center justify-center shadow-md">
                      <span className="font-serif text-xl text-creamy font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-serif text-xl text-ink font-bold">{user.name}</p>
                      {(user.city || user.country) && (
                        <div className="flex items-center gap-1 text-xs text-ink/50 font-sans">
                          <MapPin size={10} />
                          <span>{[user.city, user.country].filter(Boolean).join(", ")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {user.bio && (
                  <p className="font-sans text-sm text-ink/60 mb-4 line-clamp-3 leading-relaxed">
                    {user.bio}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-ink/40 font-sans">
                    <span>{user._count.sentLetters} sent</span>
                    <span>{user._count.receivedLetters} received</span>
                  </div>
                  <Link
                    href="/compose"
                    className="flex items-center gap-1.5 px-4 py-2 bg-ink text-creamy rounded-full text-xs font-sans font-semibold shadow-md hover:bg-ink/90 transition-all active:scale-95 opacity-0 group-hover:opacity-100"
                  >
                    <Pen size={12} />
                    Write Letter
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
