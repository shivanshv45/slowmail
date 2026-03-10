"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, Clock, Heart, Feather } from "lucide-react";

const SLIDES = [
  {
    icon: Mail,
    title: "Letters once traveled across oceans and continents",
    body: "They carried stories, emotions, and memories. Each one was crafted with care, sealed with intention, and delivered with anticipation.",
    accent: "The journey was part of the message.",
  },
  {
    icon: Clock,
    title: "We brought that experience back",
    body: "In SlowMail, your letters travel with realistic delays. A letter to someone across the world might take days to arrive — just like real mail.",
    accent: "Because good things are worth waiting for.",
  },
  {
    icon: Heart,
    title: "Every letter is a crafted object",
    body: "Write on beautiful paper, seal your envelope, and send it on its journey. When it arrives, the recipient breaks the seal and unfolds your words.",
    accent: "No chat bubbles. No read receipts. Just letters.",
  },
  {
    icon: Feather,
    title: "Write with intention",
    body: "You can send up to 3 letters per day. This limit exists to make each letter more meaningful — quality over quantity.",
    accent: "Take a breath. What do you really want to say?",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);

  const isLastSlide = currentSlide === SLIDES.length - 1;

  async function handleComplete() {
    setLoading(true);
    try {
      await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onboarded: true }),
      });
      router.push("/inbox");
      router.refresh();
    } catch {
      router.push("/inbox");
    }
  }

  function handleNext() {
    if (isLastSlide) {
      handleComplete();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  }

  const slide = SLIDES[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative floating papers */}
      <motion.div
        animate={{ rotate: [6, 8, 6], y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[10%] w-40 h-56 bg-creamy rounded-lg shadow-lg border border-ink/5 -z-10 opacity-40"
      />
      <motion.div
        animate={{ rotate: [-3, -5, -3], y: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-[10%] w-48 h-32 bg-parchment rounded-xl shadow-xl border border-ink/5 -z-10 opacity-40"
      />

      <div className="w-full max-w-lg text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Icon */}
            <div className="w-20 h-20 bg-stamp-red/10 border border-stamp-red/20 rounded-2xl flex items-center justify-center mb-8">
              <Icon size={32} className="text-stamp-red" />
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl text-ink leading-snug tracking-tight mb-6 max-w-md">
              {slide.title}
            </h1>

            {/* Body */}
            <p className="font-sans text-lg text-ink/70 leading-relaxed mb-6 max-w-sm">
              {slide.body}
            </p>

            {/* Accent */}
            <p className="font-handwriting text-2xl text-stamp-red/70 -rotate-1">
              {slide.accent}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-14 flex flex-col items-center gap-6">
          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentSlide
                    ? "bg-ink w-8"
                    : i < currentSlide
                    ? "bg-ink/40"
                    : "bg-ink/15"
                }`}
              />
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={handleNext}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 bg-ink text-creamy rounded-full font-sans font-semibold tracking-wide shadow-xl shadow-ink/20 hover:bg-ink/90 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-creamy/30 border-t-creamy rounded-full animate-spin" />
            ) : isLastSlide ? (
              <>
                Open Your Desk
                <ArrowRight size={18} />
              </>
            ) : (
              <>
                Continue
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Skip */}
          {!isLastSlide && (
            <button
              onClick={handleComplete}
              className="text-sm text-ink/40 hover:text-ink/60 font-sans transition-colors"
            >
              Skip introduction
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
