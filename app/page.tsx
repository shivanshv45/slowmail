import { Header } from "@/components/ui/header";
import { Note } from "@/components/ui/typography";
import Link from "next/link";
import { Pen, Mail } from "lucide-react";
import { FloatingPapers } from "@/components/ui/floating-papers";
import { HeroEnvelope } from "@/components/ui/hero-envelope";

export default function Home() {
  return (
    <div className="h-screen min-h-[700px] w-full bg-[#FAF7F2] relative overflow-hidden font-sans">
      <FloatingPapers />

      {/* Thin Pill Header as in Image 2 */}
      <div className="w-full max-w-4xl mx-auto pt-8 px-4 relative z-50">
        <Header className="static mx-auto w-full px-8 py-2.5 bg-[#FAF8F5]/90 backdrop-blur-md border border-[#EBE5D9] rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)]" />
      </div>

      <main className="max-w-[1200px] mx-auto mt-12 md:mt-16 px-6 relative z-10 flex flex-col items-center">
        {/* Top Centered Section */}
        <div className="text-center mb-6 w-full relative z-20">
          <Note className="mb-4 text-[#C15C4C] font-handwriting text-2xl rotate-[-1deg]">Slower, intentional communication.</Note>
          <h1 className="text-5xl md:text-[68px] lg:text-[72px] font-serif text-[#2C2A25] tracking-tight leading-[1.05] max-w-[950px] mx-auto">
            Bring the soul of <span className="italic font-light">postal</span> mail<br />to the digital age
          </h1>
        </div>

        {/* Bottom Split Layout - Tight positioning matching Image 2 */}
        <div className="relative w-full max-w-[1100px] h-[360px] mx-auto mt-6 md:mt-10 pointer-events-none flex items-center">

          {/* Left: 3D Envelope directly adjacent to text */}
          <div className="absolute left-[-2%] md:left-[2%] lg:left-[5%] top-[45%] -translate-y-1/2 z-20 scale-90 md:scale-[1.10]">
            <HeroEnvelope />
          </div>

          {/* Right: Pitch & Buttons */}
          <div className="absolute right-[0%] md:right-[5%] lg:right-[10%] top-[50%] md:top-[45%] -translate-y-1/2 md:-translate-y-[55%] flex flex-col items-start z-10 pointer-events-auto w-[420px]">
            <p className="text-[#3A352F] text-[17px] leading-[1.7] mb-8 font-medium">
              Write letters that take time to travel. Feel the anticipation
              of real mail, sealed and delivered specifically for you.
            </p>

            <div className="flex flex-row items-center gap-4">
              <Link
                href="/compose"
                className="flex items-center gap-2.5 px-6 py-3.5 bg-[#3F362F] text-[#F3EFE6] rounded-2xl font-medium text-[15px] shadow-[0_15px_25px_-5px_rgba(63,54,47,0.3)] hover:bg-[#2A231E] transition-all"
              >
                <Pen size={16} className="opacity-80" />
                Write a Letter
              </Link>
              <Link
                href="/inbox"
                className="flex items-center gap-2.5 px-6 py-3.5 bg-[#EFEBE4] text-[#3F362F] rounded-2xl font-semibold text-[15px] border border-[#E3DCD0] shadow-sm hover:bg-[#E5DECD] transition-all"
              >
                <Mail size={16} className="opacity-80" />
                Open Inbox
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
