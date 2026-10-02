import React from 'react';

function Logo({ width = '140px', showText = true, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`} style={{ maxWidth: width }}>
      {/* ── Glowing Vector Icon ── */}
      <div className="relative flex-shrink-0 w-9 h-9 flex items-center justify-center">
        {/* Ambient glow behind icon */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Crisp SVG Icon */}
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-9 h-9 rounded-xl overflow-hidden shadow-inner"
        >
          {/* Glass background fill */}
          <rect width="36" height="36" rx="10" fill="#0c0a1f" />
          <rect width="36" height="36" rx="10" stroke="url(#border-grad)" strokeWidth="1.5" />

          {/* Stylized 'B' & 'V' / Quill Spark */}
          <path
            d="M10 9L18 27L26 9L21.5 9L18 18.5L14.5 9H10Z"
            fill="url(#logo-grad-primary)"
          />
          <path
            d="M18 19L23 27H19.5L18 23L16.5 27H13L18 19Z"
            fill="url(#logo-grad-accent)"
            opacity="0.9"
          />
          <circle cx="18" cy="8" r="2.2" fill="#38bdf8" />

          <defs>
            <linearGradient id="logo-grad-primary" x1="10" y1="9" x2="26" y2="27" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" />
              <stop offset="0.5" stopColor="#a855f7" />
              <stop offset="1" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="logo-grad-accent" x1="13" y1="19" x2="23" y2="27" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="1" stopColor="#818cf8" />
            </linearGradient>
            <linearGradient id="border-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818cf8" stopOpacity="0.6" />
              <stop offset="1" stopColor="#ec4899" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ── Brand Typography ── */}
      {showText && (
        <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-200 via-purple-100 to-pink-200 bg-clip-text text-transparent">
          Blog<span className="text-indigo-400">Vite</span>
        </span>
      )}
    </div>
  );
}

export default Logo;
