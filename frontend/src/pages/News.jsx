import React, { useState, useEffect } from 'react';
import { newsService } from '../services/news.service';
import Container from '../components/container/container';
import BackButton from '../components/BackButton';

const categories = [
  { id: 'all', label: 'All Feeds', icon: '🇮🇳' },
  { id: 'sport', label: 'Team India Cricket', icon: '🏏' },
  { id: 'technology', label: 'Technology', icon: '💻' },
  { id: 'ai', label: 'Artificial Intelligence', icon: '🤖' },
  { id: 'business', label: 'Business & Markets', icon: '📈' },
  { id: 'entertainment', label: 'Cinema & OTT', icon: '🎬' },
];

const regions = [
  { id: 'all', label: 'All (Indian & World)' },
  { id: 'india', label: '🇮🇳 India Focus' },
  { id: 'world', label: '🌍 World Highlights' },
];

function News() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [articles, setArticles] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNews(selectedCategory, selectedRegion);
  }, [selectedCategory, selectedRegion]);

  // Live countdown timer for the 2-hour refresh
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const loadNews = async (cat, reg) => {
    setLoading(true);
    try {
      const data = await newsService.getNews(cat, reg);
      if (data?.articles) {
        setArticles(data.articles);
        if (data.lastUpdated) setLastUpdated(data.lastUpdated);
        if (data.secondsRemaining) setCountdown(data.secondsRemaining);
      }
    } catch (err) {
      console.error('Failed to load news:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    setRefreshing(true);
    loadNews(selectedCategory, selectedRegion);
  };

  const formatCountdown = (secs) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hours}h ${mins}m ${s}s`;
  };

  return (
    <div className="py-6 sm:py-10 min-h-screen">
      <Container>
        {/* ── Top Header Bar ── */}
        <div className="max-w-7xl mx-auto mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BackButton fallback="/" label="Home" />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D5F3D8] animate-pulse" />
                <span className="text-xs font-bold text-[#D5F3D8] uppercase tracking-wider">
                  India Pulse & Live Cricket
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                India Radar & Global Insights
              </h1>
              <p className="text-xs text-[#F2C7C7] mt-0.5 font-light">
                Real-time Team India cricket coverage, Indian tech, AI, markets & cinema
              </p>
            </div>
          </div>

          {/* Real-time Indicator & 2-Hour Countdown */}
          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="px-3.5 py-1.5 rounded-full bg-[#D5F3D8]/10 border border-[#D5F3D8]/30 text-xs font-semibold text-[#D5F3D8] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Team India Cricket</span>
              {countdown > 0 && (
                <span className="font-mono text-[11px] text-gray-300 ml-1">
                  • 2h cycle ({formatCountdown(countdown)})
                </span>
              )}
            </div>

            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="p-1.5 px-3 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 border border-white/10 transition-all hover:text-white cursor-pointer"
              title="Fetch fresh live feed"
            >
              {refreshing ? '↻ Syncing…' : '↻ Refresh Feed'}
            </button>
          </div>
        </div>

        {/* ── Category Filters ── */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-2 mb-3 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#F2C7C7] to-[#D5F3D8] text-gray-900 shadow-md scale-105 font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 hover:border-[#F2C7C7]/40'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* ── Region Filters (India vs World) ── */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-4 mb-6 sm:mb-8 text-xs scrollbar-none">
          <span className="text-gray-400 text-xs mr-1 font-light">Region:</span>
          {regions.map((reg) => (
            <button
              key={reg.id}
              onClick={() => setSelectedRegion(reg.id)}
              className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${
                selectedRegion === reg.id
                  ? 'bg-white/20 text-white font-bold border border-white/30'
                  : 'text-gray-400 hover:text-white bg-white/5 border border-white/5'
              }`}
            >
              {reg.label}
            </button>
          ))}
        </div>

        {/* ── News Cards Grid ── */}
        {loading ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#F2C7C7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <div className="text-4xl mb-2">📰</div>
            <h3 className="text-white font-bold text-lg">No news found for this filter</h3>
            <p className="text-gray-400 text-xs mt-1">Try switching categories or region.</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {articles.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-white/10 hover:border-[#F2C7C7]/50 transition-all duration-300 shadow-xl hover:shadow-[#F2C7C7]/10 hover:-translate-y-1"
              >
                {/* Thumbnail Image & Badges */}
                <div className="w-full h-44 sm:h-48 rounded-2xl overflow-hidden mb-4 bg-black/40 relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Region Badge (India 🇮🇳 vs World 🌍) */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider bg-black/75 backdrop-blur-md text-[#D5F3D8] border border-[#D5F3D8]/30 shadow">
                    {item.region || 'India 🇮🇳'}
                  </span>

                  {/* Live Cricket Badge */}
                  {item.isLive && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600/90 text-white shadow-md flex items-center gap-1 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      LIVE
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-[#F2C7C7] transition-colors leading-snug">
                  {item.title}
                </h2>

                {/* Short Description */}
                <p className="text-xs text-gray-400 line-clamp-3 mb-4 leading-relaxed font-light flex-1">
                  {item.description}
                </p>

                {/* Footer: Publisher / Source & Original Link */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-gray-400 truncate max-w-[170px]">
                    <span className="text-[10px] text-gray-500">Source:</span>
                    <span className="font-semibold text-gray-200 truncate">{item.source}</span>
                  </div>

                  {/* Read full article button */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold text-gray-900 bg-gradient-to-r from-[#F2C7C7] to-[#D5F3D8] hover:opacity-90 shadow-sm transition-all hover:scale-105 whitespace-nowrap"
                  >
                    <span>Read Full</span>
                    <span>↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default News;
