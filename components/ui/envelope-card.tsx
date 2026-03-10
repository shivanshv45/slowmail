import { cn } from "@/lib/utils";
import { Clock, MapPin } from "lucide-react";

interface EnvelopeCardProps {
    senderName: string;
    fromLocation: string;
    eta?: string;
    status: "delivered" | "in_transit" | "opened";
    onClick?: () => void;
    className?: string;
}

export function EnvelopeCard({ senderName, fromLocation, eta, status, onClick, className }: EnvelopeCardProps) {
    const isOpened = status === "opened";

    return (
        <button
            onClick={onClick}
            disabled={status === "in_transit"}
            className={cn(
                "relative w-full aspect-[3/2] rounded-md transition-all duration-300 text-left group border",
                isOpened
                    ? "bg-parchment shadow-sm border-ink/5 opacity-80"
                    : "bg-[#FAFAFA] shadow-md hover:shadow-xl hover:-translate-y-1 border-ink/10",
                status === "in_transit" ? "opacity-60 cursor-not-allowed saturate-50" : "cursor-pointer",
                className
            )}
        >
            {/* Front flap drawing (pure CSS) */}
            {!isOpened && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,0 L50,50 L100,0" fill="none" stroke="var(--ink)" strokeWidth="2" />
                    <path d="M0,100 L50,50 L100,100" fill="none" stroke="var(--ink)" strokeWidth="1" />
                </svg>
            )}

            {/* Stamp (tactile design) */}
            <div className="absolute top-4 right-4 w-11 h-12 bg-[#F8F8F8] border border-ink/10 flex flex-col items-center justify-center rotate-3 shadow-sm z-20 p-1">
                <div className="w-full h-full border border-ink/10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-stamp-red opacity-80 mix-blend-multiply" />
                    {/* Stamp subtle cancellation mark */}
                    <div className="absolute -inset-2 border-t-2 border-ink/40 -rotate-12 rounded-full" />
                    <div className="absolute -inset-2 border-b-2 border-ink/30 rotate-12 rounded-[100%]" />
                </div>
            </div>

            {/* Sender Info (Bottom left, hand written style) */}
            <div className="absolute bottom-5 left-5 z-20">
                <p className="font-handwriting text-3xl text-ink leading-none mb-1.5">{senderName}</p>
                <div className="flex items-center gap-1.5 text-ink/50 font-sans text-xs uppercase tracking-wider font-semibold">
                    <MapPin size={10} />
                    <span>From {fromLocation}</span>
                </div>
            </div>

            {/* Status Badges */}
            <div className="absolute top-4 left-4 z-20">
                {status === "in_transit" && (
                    <div className="flex items-center gap-1.5 bg-ink/5 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-ink/70 border border-ink/10 shadow-sm">
                        <Clock size={12} className="animate-pulse" />
                        <span>Arriving in {eta}</span>
                    </div>
                )}
                {status === "delivered" && (
                    <div className="flex items-center gap-1.5 bg-creamy px-3 py-1.5 rounded-full text-xs font-bold text-stamp-red border border-stamp-red/20 shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-stamp-red animate-pulse" />
                        <span>New Letter</span>
                    </div>
                )}
            </div>
        </button>
    );
}
