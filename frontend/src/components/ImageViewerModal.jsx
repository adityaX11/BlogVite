import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

function ImageViewerModal({
  isOpen,
  onClose,
  imageUrl,
  title = '',
  caption = '',
  author = null,
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Close on Escape key & handle body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
    };
  }, [isOpen, onClose]);

  // Handle Mouse Wheel Zoom (scroll up to zoom in, scroll down to zoom out)
  const handleWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    setZoomLevel((prev) => {
      const next = Math.round((prev + delta) * 100) / 100;
      return Math.min(Math.max(next, 0.4), 3.5);
    });
  };

  // Zoom button handlers
  const zoomIn = (e) => {
    e?.stopPropagation();
    setZoomLevel((prev) => Math.min(Math.round((prev + 0.25) * 100) / 100, 3.5));
  };

  const zoomOut = (e) => {
    e?.stopPropagation();
    setZoomLevel((prev) => Math.max(Math.round((prev - 0.25) * 100) / 100, 0.4));
  };

  const resetZoom = (e) => {
    e?.stopPropagation();
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  // Drag to pan when zoomed
  const handleMouseDown = (e) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch pan support for mobile/tablets
  const touchStartRef = useRef({ x: 0, y: 0 });
  const handleTouchStart = (e) => {
    if (e.touches.length === 1 && zoomLevel > 1) {
      setIsDragging(true);
      touchStartRef.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || zoomLevel <= 1 || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - touchStartRef.current.x,
      y: e.touches[0].clientY - touchStartRef.current.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (!isOpen || !imageUrl) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-2xl flex flex-col justify-between select-none animate-fade-in"
      onClick={onClose}
    >
      {/* ── Top Bar ── */}
      <div
        className="w-full px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 border-b border-white/10 bg-black/60 backdrop-blur-md z-20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Story Info */}
        <div className="flex items-center gap-3 truncate max-w-lg">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
            title="Return to story"
          >
            <span>←</span>
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="truncate">
            <h3 className="text-xs sm:text-sm font-bold text-white truncate">
              {title || 'Story Photo'}
            </h3>
            {caption && (
              <p className="text-[11px] text-[#F2C7C7] truncate font-light">
                📷 {caption}
              </p>
            )}
          </div>
        </div>

        {/* Top-Right Quick Utilities */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all inline-flex items-center gap-1"
            title="Open raw image"
          >
            <span>Original</span>
            <span>↗</span>
          </a>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-red-500/20 text-white hover:text-red-300 transition-all cursor-pointer"
            title="Close viewer (Esc)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Main Viewport Canvas (Scroll wheel to zoom, drag to pan) ── */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`flex-1 flex items-center justify-center overflow-hidden relative p-4 ${
          zoomLevel > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Soft Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#F2C7C7]/15 via-transparent to-[#D5F3D8]/15 rounded-3xl blur-3xl pointer-events-none" />

        {/* Image Display */}
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
            transition: isDragging ? 'none' : 'transform 0.18s ease-out',
          }}
          className="relative max-w-full max-h-full flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            if (zoomLevel === 1) zoomIn();
          }}
        >
          <img
            src={imageUrl}
            alt={title || 'Posted Image'}
            draggable={false}
            className="max-h-[68vh] sm:max-h-[74vh] w-auto max-w-[95vw] sm:max-w-[88vw] object-contain rounded-2xl shadow-2xl border border-white/20 select-none pointer-events-auto"
          />
        </div>
      </div>

      {/* ── Bottom Floating Control Dock (PROMINENT BACK BUTTON & ZOOM BAR) ── */}
      <div
        className="w-full p-4 sm:p-5 flex flex-col items-center gap-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Central Floating Action Dock */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2 px-3 sm:px-4 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-black/80">
          {/* Main Prominent Back Button */}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-gray-900 bg-gradient-to-r from-[#F2C7C7] via-white to-[#D5F3D8] hover:opacity-95 shadow-lg shadow-[#F2C7C7]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            title="Return to story (Esc)"
          >
            <span className="text-base font-black">←</span>
            <span>Back to Story</span>
          </button>

          <span className="w-px h-6 bg-white/20" />

          {/* Zoom Out Button */}
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoomLevel <= 0.4}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center text-sm font-bold transition-all disabled:opacity-40 cursor-pointer"
            title="Zoom Out (or scroll down)"
          >
            −
          </button>

          {/* Zoom Percentage */}
          <button
            type="button"
            onClick={resetZoom}
            className="text-xs font-mono font-bold text-[#D5F3D8] px-2 hover:underline cursor-pointer"
            title="Click to reset zoom"
          >
            {Math.round(zoomLevel * 100)}%
          </button>

          {/* Zoom In Button */}
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoomLevel >= 3.5}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center text-sm font-bold transition-all disabled:opacity-40 cursor-pointer"
            title="Zoom In (or scroll up)"
          >
            +
          </button>

          {/* Reset Button (only shown when zoomed) */}
          {zoomLevel !== 1 && (
            <button
              type="button"
              onClick={resetZoom}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
              title="Reset to 100%"
            >
              ↺ Reset
            </button>
          )}
        </div>

        {/* Scroll hint under dock */}
        <p className="text-[11px] text-gray-400 font-light text-center hidden sm:block">
          Scroll mouse wheel to zoom in/out • Drag to pan • Click outside or Esc to exit
        </p>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default ImageViewerModal;
