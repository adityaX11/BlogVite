import React from 'react';
import { useNavigate } from 'react-router-dom';

function BackButton({ fallback = '/', label = 'Back', className = '' }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      onClick={handleBack}
      type="button"
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all duration-200 hover:-translate-x-0.5 shadow-sm group ${className}`}
    >
      <svg
        className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>
      <span>{label}</span>
    </button>
  );
}

export default BackButton;
