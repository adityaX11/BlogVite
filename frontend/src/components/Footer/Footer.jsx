import React from 'react';
import Logo from '../Logo';

function Footer() {
  return (
    <footer className="relative z-20 mt-auto bg-black/40 backdrop-blur-2xl border-t border-white/10 text-gray-400 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          {/* ── Brand Logo ── */}
          <div className="flex items-center gap-3">
            <Logo width="120px" showText={true} />
            <span className="hidden sm:inline text-xs text-gray-500">•</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#D5F3D8]">
              v1.2.0
            </span>
          </div>

          {/* ── Thought / Inspiration ── */}
          <div className="text-xs italic text-[#F2C7C7]/90 font-light max-w-md">
            "Where ideas bloom softly, and creative voices connect quietly."
          </div>

          {/* ── Copyright ── */}
          <div className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} BlogVite. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;