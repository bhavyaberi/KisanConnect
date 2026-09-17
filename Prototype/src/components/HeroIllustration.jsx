// A self-contained illustrated farm scene for the hero background — rolling
// fields, crop rows, a sun, birds, and a small farmer figure. Built as
// inline SVG (not an external photo) so it renders identically offline,
// in the zipped project, and with zero network dependency.
export default function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 1600 820"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sky */}
      <rect width="1600" height="820" fill="#dff2c9" />
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff4c2" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff4c2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a9c97a" />
          <stop offset="100%" stopColor="#8fb85f" />
        </linearGradient>
        <linearGradient id="hillMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fa84a" />
          <stop offset="100%" stopColor="#6b9339" />
        </linearGradient>
        <linearGradient id="hillNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#588032" />
          <stop offset="100%" stopColor="#456623" />
        </linearGradient>
      </defs>

      {/* Sun */}
      <circle cx="1300" cy="150" r="220" fill="url(#sunGlow)" />
      <circle cx="1300" cy="150" r="70" fill="#ffe587" />

      {/* Birds */}
      <path d="M180 120 q14 -16 28 0 q14 -16 28 0" stroke="#4d6b32" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M260 170 q10 -12 20 0 q10 -12 20 0" stroke="#4d6b32" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M340 110 q10 -12 20 0 q10 -12 20 0" stroke="#4d6b32" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* Far hill */}
      <path d="M0 420 Q 250 350 500 410 T 1000 400 T 1600 420 V820 H0 Z" fill="url(#hillFar)" />

      {/* Mid hill with terraced crop rows */}
      <path d="M0 520 Q 300 440 650 500 T 1600 500 V820 H0 Z" fill="url(#hillMid)" />
      {Array.from({ length: 7 }).map((_, i) => (
        <path
          key={i}
          d={`M0 ${560 + i * 24} Q 400 ${520 + i * 24} 800 ${560 + i * 24} T 1600 ${560 + i * 24}`}
          stroke="#accf6f"
          strokeOpacity="0.35"
          strokeWidth="3"
          fill="none"
        />
      ))}

      {/* Near hill (foreground) */}
      <path d="M0 660 Q 350 600 700 650 T 1600 640 V820 H0 Z" fill="url(#hillNear)" />

      {/* Crop rows in the foreground field, small bush clusters suggesting
          tomato/vegetable rows referenced throughout the problem statement */}
      {Array.from({ length: 5 }).map((_, row) => (
        <g key={row} opacity={0.9 - row * 0.08}>
          {Array.from({ length: 14 }).map((_, i) => (
            <circle
              key={i}
              cx={40 + i * 60 + (row % 2 === 0 ? 0 : 30)}
              cy={700 + row * 26}
              r={9 - row}
              fill={row % 2 === 0 ? "#3f6b22" : "#4d7a2a"}
            />
          ))}
        </g>
      ))}

      {/* Simple farmer figure with a basket, bottom-left */}
      <g transform="translate(120,600)">
        <ellipse cx="30" cy="118" rx="22" ry="6" fill="#2f4a1a" opacity="0.3" />
        <rect x="20" y="60" width="20" height="45" rx="8" fill="#e0863a" />
        <circle cx="30" cy="45" r="14" fill="#f4c896" />
        <path d="M16 42 q14 -18 28 0" fill="#3a2a1a" />
        <rect x="10" y="85" width="14" height="35" rx="5" fill="#3a5a24" />
        <rect x="36" y="85" width="14" height="35" rx="5" fill="#3a5a24" />
        <circle cx="55" cy="95" r="12" fill="none" stroke="#7a4a20" strokeWidth="3" />
      </g>
    </svg>
  );
}
