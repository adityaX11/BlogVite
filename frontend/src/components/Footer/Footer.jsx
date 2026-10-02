import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

function Footer() {
  return (
    <footer className="relative z-20 mt-auto bg-black/40 backdrop-blur-2xl border-t border-white/10 text-gray-400 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* ── Brand & Description ── */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <Link to="/" className="inline-block group">
              <Logo />
            </Link>
            <p className="text-xs text-gray-400 max-w-sm">
              Next-generation blogging platform powered by React, MongoDB, Three.js & real-time social connections.
            </p>
          </div>

          {/* ── Navigation Links ── */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-gray-300">
            <Link to="/" className="hover:text-indigo-400 transition-colors">
              Home
            </Link>
            <Link to="/all-posts" className="hover:text-indigo-400 transition-colors">
              Explore Stories
            </Link>
            <Link to="/add-post" className="hover:text-indigo-400 transition-colors">
              Write an Article
            </Link>
            <Link to="/dashboard" className="hover:text-indigo-400 transition-colors">
              User Dashboard
            </Link>
          </div>

          {/* ── Social / Copyright ── */}
          <div className="flex flex-col items-center md:items-end text-xs text-gray-500 space-y-1">
            <div className="flex items-center gap-3 text-gray-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>MongoDB & Cloudinary Online</span>
            </div>
            <p>&copy; {new Date().getFullYear()} BlogVite. Built with passion & precision.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;