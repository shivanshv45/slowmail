"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/ui/header";
import { Heading, Text } from "@/components/ui/typography";
import { EnvelopeCard } from "@/components/ui/envelope-card";
import { LetterModal } from "@/components/ui/letter-modal";
import { Loader2, RefreshCw } from "lucide-react";

interface Letter {
  id: string;
  content: string;
  senderCity: string;
  receiverCity: string;
  senderName: string;
  signOff: string;
  status: string;
  dispatchedAt: string;
  deliveryEta: string;
  deliveredAt: string | null;
  openedAt: string | null;
  stationeryStyle: string;
  sender: {
    name: string;
    city: string;
    country: string;
  };
}

export default function Inbox() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLetters = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/letters/inbox");
      const data = await res.json();
      if (data.letters) {
        setLetters(data.letters);
      }
    } catch (err) {
      console.error("Failed to fetch inbox:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchLetters();
  }, [fetchLetters]);

  // Poll every 30 seconds for new deliveries
  useEffect(() => {
    const interval = setInterval(() => fetchLetters(), 30000);
    return () => clearInterval(interval);
  }, [fetchLetters]);

  async function handleOpenLetter(letter: Letter) {
    if (letter.status === "DELIVERED") {
      // Mark as opened via API
      try {
        await fetch(`/api/letters/${letter.id}`, { method: "PATCH" });
        // Update local state
        setLetters((prev) =>
          prev.map((l) => (l.id === letter.id ? { ...l, status: "OPENED" } : l))
        );
      } catch (err) {
        console.error("Failed to mark letter as opened:", err);
      }
    }
    setSelectedLetter(letter);
  }

  function formatEta(eta: string): string {
    const etaDate = new Date(eta);
    const now = Date.now();
    const remaining = etaDate.getTime() - now;
    if (remaining <= 0) return "Arrived";

    const totalMinutes = Math.floor(remaining / (60 * 1000));
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Header />
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="text-ink/30 animate-spin" />
          <p className="font-sans text-ink/40">Checking your mailbox...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <main className="max-w-5xl mx-auto px-6 pt-32 relative z-10">
        <div className="mb-12 border-b border-ink/10 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Heading className="mb-3 text-5xl">Your Desk</Heading>
            <Text className="text-lg">
              {letters.length === 0
                ? "Your desk is empty. Write someone a letter!"
                : "Wait for the mailman. Some letters take a little longer to arrive."}
            </Text>
          </div>
          <button
            onClick={() => fetchLetters(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-creamy border border-ink/10 rounded-xl text-sm font-sans text-ink/60 hover:bg-white transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Check Mail
          </button>
        </div>

        {letters.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-handwriting text-3xl text-ink/30 -rotate-1">No letters yet...</p>
            <p className="font-sans text-sm text-ink/40 mt-4">Ask a friend to send you a letter, or write one yourself!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {letters.map((letter, i) => (
              <div
                key={letter.id}
                className="relative"
                style={{
                  transform: `rotate(${i % 2 === 0 ? -1 : 1.5}deg)`,
                  transition: "transform 0.3s ease",
                }}
              >
                <EnvelopeCard
                  senderName={letter.senderName || letter.sender?.name || "Unknown"}
                  fromLocation={letter.senderCity}
                  status={
                    letter.status === "DELIVERED"
                      ? "delivered"
                      : letter.status === "IN_TRANSIT"
                      ? "in_transit"
                      : "opened"
                  }
                  eta={letter.status === "IN_TRANSIT" ? formatEta(letter.deliveryEta) : undefined}
                  onClick={() => {
                    if (letter.status !== "IN_TRANSIT") {
                      handleOpenLetter(letter);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <LetterModal
        isOpen={!!selectedLetter}
        onClose={() => setSelectedLetter(null)}
        senderName={selectedLetter?.senderName || selectedLetter?.sender?.name || ""}
        fromLocation={selectedLetter?.senderCity || ""}
        content={selectedLetter?.content || ""}
      />
    </div>
  );
}
