"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { LogOut, User } from "lucide-react";
import { useState } from "react";

export function Header({ className }: { className?: string }) {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const isLoggedIn = status === "authenticated";

  return (
    <header className={cn("fixed top-6 left-0 right-0 z-50 flex justify-center w-full px-4 pointer-events-none", className)}>
      <div className="flex items-center justify-between w-full max-w-[850px] px-6 py-3 bg-creamy/40 backdrop-blur-md border border-ink/10 rounded-full shadow-sm pointer-events-auto transition-all hover:bg-creamy/60">
        <Link href="/" className="font-serif text-xl font-bold tracking-tight text-ink">
          SlowMail
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6 font-sans text-sm font-medium text-ink/70">
          {isLoggedIn ? (
            <>
              <Link href="/compose" className="hover:text-ink transition-colors hidden sm:block">
                Compose
              </Link>
              <Link href="/inbox" className="hover:text-ink transition-colors">
                Inbox
              </Link>
              <Link href="/sent" className="hover:text-ink transition-colors hidden sm:block">
                Sent
              </Link>
              <Link href="/archive" className="hover:text-ink transition-colors hidden sm:block">
                Archive
              </Link>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-8 h-8 bg-ink text-creamy rounded-full flex items-center justify-center font-serif text-sm font-bold hover:bg-ink/90 transition-colors shadow-md"
                >
                  {session?.user?.name?.charAt(0)?.toUpperCase() || <User size={14} />}
                </button>

                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-12 w-56 bg-creamy/95 backdrop-blur-lg border border-ink/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-ink/10">
                        <p className="font-serif font-bold text-ink text-sm">{session?.user?.name}</p>
                        <p className="text-xs text-ink/50 font-sans truncate">{session?.user?.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/profile"
                          onClick={() => setShowMenu(false)}
                          className="flex items-center gap-2 px-3 py-2.5 text-sm text-ink/70 hover:bg-ink/5 rounded-xl transition-colors font-sans"
                        >
                          <User size={14} />
                          Profile
                        </Link>
                        <Link
                          href="/discover"
                          onClick={() => setShowMenu(false)}
                          className="flex items-center gap-2 px-3 py-2.5 text-sm text-ink/70 hover:bg-ink/5 rounded-xl transition-colors font-sans sm:hidden"
                        >
                          <User size={14} />
                          Discover
                        </Link>
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-stamp-red hover:bg-stamp-red/5 rounded-xl transition-colors font-sans"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-ink transition-colors">
                Log in
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 text-creamy bg-ink rounded-full hover:bg-ink/90 transition-transform active:scale-95 shadow-md"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
