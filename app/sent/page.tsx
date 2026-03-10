"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/ui/header";
import { Heading, Text } from "@/components/ui/typography";
import { Loader2, Clock, MapPin, CheckCircle, Mail } from "lucide-react";
import { motion } from "framer-motion";

interface Letter {
  id: string;
  content: string;
  senderCity: string;
  receiverCity: string;
  senderName: string;
  status: string;
  dispatchedAt: string;
  deliveryEta: string;
  stationeryStyle: string;
  receiver: {
    name: string;
    city: string;
    country: string;
  };
}

export default function SentPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSent = useCallback(async () => {
    try {
      const res = await fetch("/api/letters/sent");
      const data = await res.json();
      if (data.letters) setLetters(data.letters);
    } catch (err) {
      console.error("Failed to fetch sent letters:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSent();
  }, [fetchSent]);

  // Poll for status updates
  useEffect(() => {
    const interval = setInterval(fetchSent, 30000);
    return () => clearInterval(interval);
  }, [fetchSent]);

  function formatEta(eta: string): string {
    const etaDate = new Date(eta);
    const now = Date.now();
    const remaining = etaDate.getTime() - now;
    if (remaining <= 0) return "Delivered";

    const totalMinutes = Math.floor(remaining / (60 * 1000));
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  function getProgress(dispatched: string, eta: string): number {
    const start = new Date(dispatched).getTime();
    const end = new Date(eta).getTime();
    const now = Date.now();
    if (now >= end) return 100;
    if (now <= start) return 0;
    return Math.round(((now - start) / (end - start)) * 100);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Header />
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="text-ink/30 animate-spin" />
          <p className="font-sans text-ink/40">Loading your outbox...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <main className="max-w-4xl mx-auto px-6 pt-32">
        <div className="mb-12 border-b border-ink/10 pb-8">
          <Heading className="mb-3 text-5xl">Sent Letters</Heading>
          <Text className="text-lg">Track your letters as they travel the world.</Text>
        </div>

        {letters.length === 0 ? (
          <div className="text-center py-20">
            <Mail size={48} className="text-ink/15 mx-auto mb-4" />
            <p className="font-handwriting text-3xl text-ink/30 -rotate-1">No letters sent yet...</p>
            <p className="font-sans text-sm text-ink/40 mt-4">Write your first letter and watch it travel!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {letters.map((letter, i) => {
              const progress = getProgress(letter.dispatchedAt, letter.deliveryEta);
              const isDelivered = letter.status === "DELIVERED" || letter.status === "OPENED" || progress >= 100;
              const etaText = formatEta(letter.deliveryEta);

              return (
                <motion.div
                  key={letter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-creamy/80 border border-ink/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-ink/5 rounded-xl flex items-center justify-center">
                        <span className="font-serif text-lg text-ink font-bold">
                          {letter.receiver?.name?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="font-serif text-lg text-ink font-semibold">
                          To: {letter.receiver?.name || "Unknown"}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-ink/50 font-sans">
                          <MapPin size={10} />
                          <span>{letter.senderCity} → {letter.receiverCity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isDelivered ? (
                        <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-green-200">
                          <CheckCircle size={12} />
                          <span>{letter.status === "OPENED" ? "Opened" : "Delivered"}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-ink/5 px-3 py-1.5 rounded-full text-xs font-semibold text-ink/70 border border-ink/10">
                          <Clock size={12} className="animate-pulse" />
                          <span>ETA: {etaText}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Transit progress bar */}
                  {!isDelivered && (
                    <div className="relative">
                      <div className="w-full h-2 bg-ink/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-stamp-red/60 rounded-full"
                        />
                      </div>
                      {/* Envelope icon on progress */}
                      <motion.div
                        initial={{ left: 0 }}
                        animate={{ left: `${Math.min(progress, 95)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute -top-2 transform -translate-x-1/2"
                      >
                        <div className="w-6 h-4 bg-parchment border border-ink/20 rounded-sm shadow-sm" />
                      </motion.div>
                    </div>
                  )}

                  {/* Preview */}
                  <p className="font-serif text-sm text-ink/50 mt-4 line-clamp-2 italic">
                    &ldquo;{letter.content.substring(0, 120)}{letter.content.length > 120 ? "..." : ""}&rdquo;
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
