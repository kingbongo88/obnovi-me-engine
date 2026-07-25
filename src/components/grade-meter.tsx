// Three-segment horizontal grade meter — the site's signature component.
// Segments fill left→right based on grade: B (1), A (2), A+ (3).

import { useEffect, useState } from "react";

const LABELS = { "A+": "Odlično", A: "Vrlo dobro", B: "Dobro" } as const;

export type MeterGrade = "A+" | "A" | "B";

export function GradeMeter({
  grade,
  size = "md",
  showLabel = true,
  className = "",
}: {
  grade: MeterGrade;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}) {
  const filled = grade === "A+" ? 3 : grade === "A" ? 2 : 1;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const h = size === "sm" ? "h-1.5" : size === "lg" ? "h-2.5" : "h-2";
  const gap = size === "sm" ? "gap-1" : "gap-1.5";

  return (
    <div className={className}>
      <div className={`flex items-center ${gap}`} aria-label={`Stanje ${LABELS[grade]}`}>
        {[1, 2, 3].map((i) => {
          const active = i <= filled;
          return (
            <span
              key={i}
              className={`flex-1 ${h} rounded-full overflow-hidden bg-[color:var(--border)]`}
            >
              <span
                className="block h-full rounded-full bg-[color:var(--accent-brand)] origin-left transition-transform duration-500 ease-out"
                style={{
                  transform: `scaleX(${active && mounted ? 1 : 0})`,
                  transitionDelay: `${i * 90}ms`,
                }}
              />
            </span>
          );
        })}
      </div>
      {showLabel && (
        <div className="mt-1.5 flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
          <span className={filled >= 1 ? "text-foreground font-medium" : ""}>Dobro</span>
          <span className={filled >= 2 ? "text-foreground font-medium" : ""}>Vrlo dobro</span>
          <span className={filled >= 3 ? "text-foreground font-medium" : ""}>Odlično</span>
        </div>
      )}
    </div>
  );
}
