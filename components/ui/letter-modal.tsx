"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface LetterModalProps {
    isOpen: boolean;
    onClose: () => void;
    senderName: string;
    fromLocation: string;
    content: string;
}

export function LetterModal({ isOpen, onClose, senderName, fromLocation, content }: LetterModalProps) {
    const [step, setStep] = useState<"envelope" | "opening" | "reading">("envelope");

    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setStep("envelope");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-ink/30 backdrop-blur-md"
            >
                <button onClick={onClose} className="absolute top-6 right-6 text-creamy hover:text-white bg-ink/20 hover:bg-ink/40 p-2 rounded-full transition-colors z-50">
                    <X size={24} />
                </button>

                {/* The Stage */}
                <div className="relative w-full max-w-3xl aspect-[3/4] sm:aspect-auto sm:h-[85vh] flex items-center justify-center perspective-[1000px]">

                    {/* The Envelope - Tap to Open */}
                    {step === "envelope" && (
                        <motion.div
                            initial={{ scale: 0.9, y: 30, rotateX: 10, opacity: 0 }}
                            animate={{ scale: 1, y: 0, rotateX: 0, opacity: 1 }}
                            exit={{ scale: 1.05, opacity: 0, transition: { duration: 0.3 } }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="relative w-full max-w-md aspect-[3/2] bg-[#F4F7F9] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-sm cursor-pointer border border-ink/5 flex items-center justify-center flex-col group overflow-hidden"
                            onClick={() => {
                                setStep("opening");
                                setTimeout(() => setStep("reading"), 400); // Wait for transition
                            }}
                        >
                            {/* Back of envelope flaps */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#FAFAFA] border-t border-ink/5" style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }} />
                            <div className="absolute inset-y-0 left-0 w-1/2 bg-[#F0F3F5] border-r border-ink/5" style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }} />
                            <div className="absolute inset-y-0 right-0 w-1/2 bg-[#F0F3F5] border-l border-ink/5" style={{ clipPath: "polygon(100% 0, 0 50%, 100% 100%)" }} />

                            {/* Top Flap (over everything) */}
                            <div
                                className="absolute top-0 inset-x-0 h-[60%] bg-[#FCFCFC] border-b border-ink/10 shadow-sm z-10 flex items-end justify-center pb-6 group-hover:-translate-y-1 transition-transform duration-500 ease-out origin-top"
                                style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                            >
                                {/* Wax Seal */}
                                <div className="w-14 h-14 bg-stamp-red rounded-full shadow-lg flex items-center justify-center translate-y-7 shrink-0 border border-stamp-red/80 relative before:absolute before:inset-2 before:border before:border-creamy/30 before:rounded-full">
                                    <span className="font-serif text-creamy text-2xl drop-shadow-sm">{senderName.charAt(0)}</span>
                                </div>
                            </div>

                            <p className="absolute bottom-8 font-serif italic text-lg text-ink/40 z-20 group-hover:text-ink/60 transition-colors">Tap to break seal</p>
                        </motion.div>
                    )}

                    {/* The Paper sliding out */}
                    {step === "reading" && (
                        <motion.div
                            initial={{ y: "10%", scale: 0.96, opacity: 0, rotateX: -5 }}
                            animate={{ y: 0, scale: 1, opacity: 1, rotateX: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 120, delay: 0.1 }}
                            className="w-full h-full bg-creamy shadow-2xl rounded-sm p-8 sm:p-16 overflow-y-auto border border-ink/5 relative"
                        >
                            {/* Noise overlay for paper texture */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.75\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\"/%3E%3C/svg%3E')" }}></div>

                            <div className="relative z-10 max-w-xl mx-auto h-full flex flex-col">
                                {/* Header */}
                                <div className="flex justify-between items-end border-b border-ink/10 pb-8 mb-10">
                                    <div>
                                        <p className="text-xs font-sans uppercase tracking-widest text-ink/40 mb-2">From</p>
                                        <p className="font-handwriting text-5xl text-ink leading-none">{senderName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-sans text-sm text-ink/50 bg-ink/5 px-3 py-1 rounded-full border border-ink/5">{fromLocation}</p>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="flex-1 font-serif text-xl sm:text-2xl leading-[2] sm:leading-[2.2] text-ink/90 whitespace-pre-wrap">
                                    {content}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
