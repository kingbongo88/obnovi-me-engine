// Flat-color iPhone silhouettes grouped by physical design generation.
// Reused across trade-in flow and shop grid fallbacks.

type Group = "A" | "B" | "C" | "D" | "E" | "Z";

function classify(name: string): Group {
  const n = name.toLowerCase();
  if (/\b17\b|\bair\b|17e/.test(n)) return "E";
  if (/\b15\b|\b16\b|16e/.test(n)) return "D";
  if (/\b13\b|\b14\b/.test(n)) return "C";
  if (/\b11\b|\b12\b/.test(n)) return "B";
  if (/\bxr\b|\bxs\b/.test(n)) return "A";
  return "Z"; // older home-button era (7, 8, SE 2020)
}

/** Front-facing outline silhouette; solid fill, no gloss. */
export function DeviceSilhouette({
  modelName,
  className,
}: {
  modelName: string;
  className?: string;
}) {
  const g = classify(modelName);
  const fill = "currentColor";

  // Common phone body path parameters
  const body = <rect x="18" y="6" width="44" height="88" rx="10" fill={fill} />;

  // Screen inset (subtle, using bg color)
  const screen = (
    <rect
      x="21"
      y="10"
      width="38"
      height="80"
      rx="7"
      className="fill-[color:var(--surface-2)]"
    />
  );

  let feature: React.ReactNode = null;

  if (g === "A") {
    // Wide notch
    feature = (
      <path
        d="M31 10 h18 a3 3 0 0 1 3 3 v3 a3 3 0 0 1 -3 3 h-18 a3 3 0 0 1 -3 -3 v-3 a3 3 0 0 1 3 -3 z"
        fill={fill}
      />
    );
  } else if (g === "B") {
    // Wide notch, slightly narrower
    feature = (
      <path
        d="M32 10 h16 a3 3 0 0 1 3 3 v3 a3 3 0 0 1 -3 3 h-16 a3 3 0 0 1 -3 -3 v-3 a3 3 0 0 1 3 -3 z"
        fill={fill}
      />
    );
  } else if (g === "C") {
    // Smaller notch (13/14 era)
    feature = (
      <path
        d="M34 10 h12 a2.5 2.5 0 0 1 2.5 2.5 v2 a2.5 2.5 0 0 1 -2.5 2.5 h-12 a2.5 2.5 0 0 1 -2.5 -2.5 v-2 a2.5 2.5 0 0 1 2.5 -2.5 z"
        fill={fill}
      />
    );
  } else if (g === "D" || g === "E") {
    // Dynamic Island pill
    feature = (
      <rect x="34" y="13" width="12" height="4.5" rx="2.25" fill={fill} />
    );
  } else {
    // Home-button era: with top speaker & home button
    feature = (
      <>
        <rect x="36" y="13" width="8" height="1.6" rx="0.8" fill={fill} />
        <circle cx="40" cy="88" r="3" fill="none" stroke={fill} strokeWidth="1.2" />
      </>
    );
  }

  return (
    <svg
      viewBox="0 0 80 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {body}
      {screen}
      {feature}
    </svg>
  );
}
