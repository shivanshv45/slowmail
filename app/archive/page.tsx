"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/ui/header";
import { Heading, Text } from "@/components/ui/typography";
import { LetterModal } from "@/components/ui/letter-modal";
import { Loader2, Search, Calendar, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface Letter {
  id: string;
  content: string;
  senderCity: string;
  senderName: string;
  status: string;
  openedAt: string | null;
  dispatchedAt: string;
  stationeryStyle: string;
  sender: {
    name: string;
    city: string;
  };
}

export default function ArchivePage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  const fetchArchive = useCallback(async () => {
    try {
      const res = await fetch("/api/letters/inbox");
      const data = await res.json();
      if (data.letters) {
        // Archive only shows opened letters
        const opened = data.letters.filter((l: Letter) => l.status === "OPENED");
        setLetters(opened);
      }
    } catch (err) {
      console.error("Failed to fetch archive:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchive();
  }, [fetchArchive]);

  // Filter by search
  const filtered = letters.filter(
    (l) =>
      l.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.senderCity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by month/year
  const grouped = filtered.reduce<Record<string, Letter[]>>((acc, letter) => {
    const date = new Date(letter.openedAt || letter.dispatchedAt);
    const key = date.toLocaleString("default", { month: "long", year: "numeric" });
    if (!acc[key]) acc[key] = [];
    acc[key].push(letter);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Header />
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="text-ink/30 animate-spin" />
          <p className="font-sans text-ink/40">Opening your memory archive...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <main className="max-w-4xl mx-auto px-6 pt-32">
        <div className="mb-10 border-b border-ink/10 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Heading className="mb-3 text-5xl">Memory Archive</Heading>
            <Text className="text-lg">Your collection of received letters, preserved forever.</Text>
          </div>
          <div className="flex items-center gap-2 bg-creamy border border-ink/10 rounded-xl px-4 py-2.5">
            <Search size={16} className="text-ink/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search letters..."
              className="bg-transparent border-none outline-none font-sans text-sm text-ink placeholder:text-ink/30 w-48"
            />
          </div>
        </div>

        {letters.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={48} className="text-ink/15 mx-auto mb-4" />
            <p className="font-handwriting text-3xl text-ink/30 -rotate-1">No memories yet...</p>
            <p className="font-sans text-sm text-ink/40 mt-4">Open some letters and they&apos;ll appear here.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(grouped).map(([monthYear, monthLetters]) => (
              <div key={monthYear}>
                <div className="flex items-center gap-3 mb-6">
                  <Calendar size={16} className="text-ink/30" />
                  <h2 className="font-serif text-2xl text-ink/70">{monthYear}</h2>
                  <span className="text-xs font-sans text-ink/30 bg-ink/5 px-2 py-0.5 rounded-full">
                    {monthLetters.length} letter{monthLetters.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {monthLetters.map((letter, i) => (
                    <motion.button
                      key={letter.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => setSelectedLetter(letter)}
                      className="text-left bg-creamy/80 border border-ink/10 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-handwriting text-2xl text-ink group-hover:text-stamp-red transition-colors">
                            {letter.senderName}
                          </p>
                          <p className="text-xs text-ink/40 font-sans">From {letter.senderCity}</p>
                        </div>
                        <p className="text-xs text-ink/30 font-sans">
                          {letter.openedAt
                            ? new Date(letter.openedAt).toLocaleDateString()
                            : ""}
                        </p>
                      </div>
                      <p className="font-serif text-sm text-ink/60 line-clamp-3 italic leading-relaxed">
                        &ldquo;{letter.content.substring(0, 150)}{letter.content.length > 150 ? "..." : ""}&rdquo;
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <LetterModal
        isOpen={!!selectedLetter}
        onClose={() => setSelectedLetter(null)}
        senderName={selectedLetter?.senderName || ""}
        fromLocation={selectedLetter?.senderCity || ""}
        content={selectedLetter?.content || ""}
      />
    </div>
  );
}
