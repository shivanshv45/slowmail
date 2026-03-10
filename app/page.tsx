import { Header } from "@/components/ui/header";
import { Heading, Text, Note } from "@/components/ui/typography";
import Link from "next/link";
import { Pen, Mail } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <Header />

      {/* Abstract floating shapes for "Digital Nostalgia" vibe */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-creamy rotate-12 rounded-2xl shadow-[0_10px_40px_-10px_rgba(45,42,38,0.1)] border border-ink/5 -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-48 bg-parchment -rotate-6 rounded-xl shadow-[0_20px_50px_-15px_rgba(45,42,38,0.15)] border border-ink/5 -z-10" />
      <div className="absolute top-1/2 right-1/3 w-40 h-56 bg-white rotate-3 rounded-lg shadow-xl shadow-ink/5 border border-ink/5 -z-10 hidden md:block" />

      <main className="flex flex-col items-center text-center max-w-3xl px-6 relative z-10 mt-16">
        <Note className="mb-6 text-stamp-red">Slower, intentional communication.</Note>
        <Heading className="mb-8 text-5xl md:text-7xl">
          Bring the soul of postal mail to the digital age
        </Heading>
        <Text className="mb-14 text-lg md:text-xl max-w-lg mx-auto">
          Write letters that take time to travel. Feel the anticipation of real mail, sealed and delivered specifically for you.
        </Text>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          <Link
            href="/compose"
            className="flex items-center gap-2 px-8 py-4 bg-ink text-creamy rounded-full text-lg shadow-xl shadow-ink/20 hover:scale-[1.02] hover:bg-ink/90 transition-all active:scale-95"
          >
            <Pen size={18} />
            Write a Letter
          </Link>
          <Link
            href="/inbox"
            className="flex items-center gap-2 px-8 py-4 bg-creamy text-ink border border-ink/10 rounded-full text-lg shadow-md hover:bg-parchment transition-all active:scale-95"
          >
            <Mail size={18} />
            Open Inbox
          </Link>
        </div>
      </main>
    </div>
  );
}
