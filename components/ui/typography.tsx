import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Heading({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <h1 className={cn("font-serif text-4xl leading-tight tracking-tight text-ink", className)}>
            {children}
        </h1>
    );
}

export function Text({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <p className={cn("font-sans text-base leading-relaxed text-ink/80", className)}>
            {children}
        </p>
    );
}

export function Note({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <span className={cn("font-handwriting text-2xl text-ink/70 -rotate-2 inline-block", className)}>
            {children}
        </span>
    );
}
