import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { postService } from '../services/post.service';
import Container from '../components/container/container';
import PostCard from '../components/PostCard';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (isLoggedIn) {
      postService
        .getPosts()
        .then((res) => {
          if (res?.posts) {
            setPosts(res.posts);
          }
        })
        .catch((err) => console.error('Error fetching posts:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070514]">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 mx-auto border-4 border-[#F2C7C7] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#D5F3D8] font-semibold text-base tracking-wide">
            Entering BlogVite…
          </p>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     NON-LOGGED-IN VIEW: Soft Aesthetic Landing Page
     (Guests strictly see this peaceful landing page)
     ══════════════════════════════════════════════════════════ */
  if (!isLoggedIn) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#070517] via-[#0d0924] to-[#070514] text-white">
        {/* Soft Background Glow Spheres */}
        <div className="absolute top-1/4 -left-32 w-80 sm:w-96 h-80 sm:h-96 bg-[#F2C7C7]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-32 w-80 sm:w-96 h-80 sm:h-96 bg-[#D5F3D8]/15 rounded-full blur-3xl pointer-events-none" />

        <Container>
          <div className="pt-12 sm:pt-20 pb-16 flex flex-col items-center text-center max-w-4xl mx-auto px-4 relative z-10">
            {/* Soft Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#D5F3D8] animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#F2C7C7] via-white to-[#D5F3D8]">
                A Peaceful Sanctuary for Writers & Readers
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.15] mb-6">
              Write Freely.{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F2C7C7] via-white to-[#D5F3D8]">
                Connect Quietly.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-gray-300 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-light">
              BlogVite is a modern publishing space built for comfort on any device.
              Publish articles with custom cover photos, discover writers with unique{' '}
              <span className="text-[#F2C7C7] font-mono">@usernames</span>, read 2-hour
              curated global news, and chat privately in real-time.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold text-gray-900 bg-gradient-to-r from-[#F2C7C7] via-white to-[#D5F3D8] hover:opacity-95 shadow-lg shadow-[#F2C7C7]/20 transition-all duration-300 hover:scale-105"
              >
                Create Account — Free ✨
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all duration-300 hover:border-[#D5F3D8]/50"
              >
                Sign In to Explore →
              </Link>
            </div>

            {/* Feature Showcase Grid (Responsive: 1 col on mobile, 2 col on tablet, 4 col on desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full text-left">
              {/* Feature 1 */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl hover:border-[#F2C7C7]/40 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-[#F2C7C7]/15 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  ✍️
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
                  Publish Your Stories
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  Upload custom cover images, write rich thoughts, and customize your articles anytime. Only a title is needed.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl hover:border-[#D5F3D8]/40 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-[#D5F3D8]/15 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  💬
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
                  Connect & Chat
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  Find thinkers by their unique{' '}
                  <span className="text-[#D5F3D8]">@username</span> or User ID,
                  view public profiles, and enjoy private 1-on-1 chats.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl hover:border-[#F2C7C7]/40 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-[#F2C7C7]/15 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  🌐
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
                  2-Hour News Pulse
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  Catch fresh radar stories across AI, Technology, Business,
                  Entertainment, and Sports refreshed every 2 hours.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl hover:border-[#D5F3D8]/40 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-[#D5F3D8]/15 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  📱
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
                  Responsive on Any Device
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  Designed from the ground up for phones, tablets, and desktop displays with smooth fluid navigation.
                </p>
              </div>
            </div>

            {/* Soft Access Banner */}
            <div className="mt-12 sm:mt-14 w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#F2C7C7]/10 via-white/5 to-[#D5F3D8]/10 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h4 className="text-base font-bold text-white">
                  Ready to share your voice?
                </h4>
                <p className="text-xs text-gray-400 mt-1 font-light">
                  Sign in or create an account to start reading articles, writing
                  stories, and connecting with friends.
                </p>
              </div>
              <Link
                to="/login"
                className="w-full sm:w-auto text-center px-6 py-2.5 rounded-full text-xs font-bold text-gray-900 bg-gradient-to-r from-[#F2C7C7] to-[#D5F3D8] hover:opacity-90 transition-all shadow-md shadow-[#F2C7C7]/20 whitespace-nowrap"
              >
                Sign In Now
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     LOGGED-IN VIEW: Clean Modern Community Feed
     (3D space removed for clean, smooth, responsive UX)
     ══════════════════════════════════════════════════════════ */

  // Empty state when logged in but no posts exist
  if (posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070514] px-4 py-12">
        <div className="text-center space-y-6 p-8 sm:p-12 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-2xl max-w-md mx-auto">
          <div className="text-5xl">✍️</div>
          <h1 className="text-2xl font-bold text-white">
            Welcome, {userData?.name || 'Creator'}!
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-light">
            No stories have been published yet. Be the first to share an idea,
            a tutorial, or an image story!
          </p>
          <Link
            to="/add-post"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-gray-900 bg-gradient-to-r from-[#F2C7C7] via-white to-[#D5F3D8] hover:opacity-95 shadow-md shadow-[#F2C7C7]/20 transition-all hover:scale-105"
          >
            <span>✍️</span>
            <span>Write the First Story</span>
          </Link>
        </div>
      </div>
    );
  }

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="w-full py-6 sm:py-10 min-h-screen bg-[#070514]">
      <Container>
        {/* ── Top Bar on Page Body ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#D5F3D8] animate-pulse" />
              <span className="text-xs font-semibold text-[#D5F3D8] uppercase tracking-wider">
                Community Feed
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Explore Stories & Ideas
            </h1>
            <p className="text-xs text-gray-400 mt-1 font-light">
              Welcome back, <span className="text-[#F2C7C7] font-semibold">{userData?.name?.split(' ')[0]}</span>! Browse articles from community writers.
            </p>
          </div>

          {/* Quick Write Story Button on Body */}
          <Link
            to="/add-post"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-gray-900 bg-gradient-to-r from-[#F2C7C7] via-white to-[#D5F3D8] hover:opacity-95 shadow-lg shadow-[#F2C7C7]/20 transition-all hover:scale-105 whitespace-nowrap self-stretch sm:self-auto justify-center"
          >
            <span>✍️</span>
            <span>Write Article</span>
          </Link>
        </div>

        {/* ── Featured Hero Story Card ── */}
        {featuredPost && (
          <div className="mb-10">
            <div className="group relative overflow-hidden rounded-3xl bg-white/[0.04] border border-white/10 hover:border-[#F2C7C7]/40 transition-all duration-300 shadow-2xl backdrop-blur-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-8 items-center">
                {/* Image */}
                <div className="lg:col-span-7 h-56 sm:h-72 md:h-80 rounded-2xl overflow-hidden bg-black/40 relative">
                  {featuredPost.featuredImage?.url ? (
                    <img
                      src={featuredPost.featuredImage.url}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-[#F2C7C7]/20 to-[#D5F3D8]/20 text-[#F2C7C7]">
                      ✍️
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/70 backdrop-blur-md text-[#D5F3D8] border border-[#D5F3D8]/30">
                    ⭐ Featured Story
                  </span>
                </div>

                {/* Content */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                  {/* Author Header */}
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/profile/${featuredPost.author?._id || featuredPost.author?.username || featuredPost.author}`}
                      className="flex items-center gap-2 group/author"
                    >
                      {featuredPost.author?.avatar ? (
                        <img
                          src={featuredPost.author.avatar}
                          alt={featuredPost.author.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F2C7C7] to-[#D5F3D8] text-gray-900 font-bold flex items-center justify-center text-xs shadow">
                          {featuredPost.author?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <span className="text-xs text-gray-300 font-medium group-hover/author:text-[#F2C7C7] transition-colors">
                        {featuredPost.author?.name || 'BlogVite Creator'}
                      </span>
                    </Link>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">
                      {new Date(featuredPost.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <Link to={`/post/${featuredPost.slug || featuredPost._id}`}>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white group-hover:text-[#F2C7C7] transition-colors line-clamp-2 leading-tight">
                      {featuredPost.title}
                    </h2>
                  </Link>

                  <p className="text-xs sm:text-sm text-gray-300 line-clamp-3 leading-relaxed font-light">
                    {featuredPost.excerpt || 'Click to dive into this story and explore full thoughts from the author.'}
                  </p>

                  {/* Tags */}
                  {featuredPost.tags && featuredPost.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {featuredPost.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F2C7C7]/15 text-[#F2C7C7] border border-[#F2C7C7]/30"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Read CTA */}
                  <div className="pt-2">
                    <Link
                      to={`/post/${featuredPost.slug || featuredPost._id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-gray-900 bg-gradient-to-r from-[#F2C7C7] via-white to-[#D5F3D8] hover:opacity-95 shadow-md shadow-[#F2C7C7]/20 transition-all hover:scale-105"
                    >
                      <span>Read Story</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Community Articles Grid ── */}
        {remainingPosts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Latest Community Articles ({remainingPosts.length})
              </h2>
              <Link
                to="/all-posts"
                className="text-xs font-bold text-[#D5F3D8] hover:underline"
              >
                View All Stories →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {remainingPosts.map((post) => (
                <div key={post._id || post.slug} className="h-full">
                  <PostCard {...post} />
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default Home;
