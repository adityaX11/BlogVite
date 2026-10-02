import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import appwriteService from '../appwrite/config';   // ← Appwrite (kept during transition)
import Container from '../components/container/container';
import PostCard from '../components/PostCard';
import ThreePostCards from '../components/ThreePostCards';

function Home() {
  const [posts, setPosts]         = useState([]);
  const [view3D, setView3D]       = useState(true);   // toggle between 3D & grid
  const [loading, setLoading]     = useState(true);
  const isLoggedIn = useSelector((state) => state.auth.status);

  useEffect(() => {
    appwriteService.getPosts([]).then((result) => {
      if (result) setPosts(result.documents);
    }).finally(() => setLoading(false));
  }, []);

  /* ── Glassmorphism header strip above the 3D scene ─── */
  const Header3D = () => (
    <div
      style={{
        position: 'fixed', top: '70px', left: 0, right: 0, zIndex: 10,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: '16px', padding: '12px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '50px',
          padding: '8px 20px',
          display: 'flex', gap: '12px', alignItems: 'center',
          pointerEvents: 'auto',
        }}
      >
        <span style={{ color: '#a5b4fc', fontSize: '13px', fontWeight: 600 }}>
          ✨ {posts.length} post{posts.length !== 1 ? 's' : ''} floating in space
        </span>
        <button
          onClick={() => setView3D(v => !v)}
          style={{
            background: view3D ? '#6366f1' : 'rgba(255,255,255,0.1)',
            color: '#fff', border: 'none', borderRadius: '20px',
            padding: '5px 14px', fontSize: '12px', fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {view3D ? '⊞ Grid View' : '✦ 3D View'}
        </button>
      </div>
    </div>
  );

  /* ── Loading ─── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 to-black">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-indigo-300 font-semibold text-lg">Loading posts…</p>
        </div>
      </div>
    );
  }

  /* ── No posts / not logged in ─── */
  if (posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-black">
        <div className="text-center space-y-6 p-12 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl max-w-md mx-4">
          <div className="text-6xl">📝</div>
          <h1 className="text-2xl font-bold text-white">
            {isLoggedIn ? 'No posts yet' : 'Sign in to read posts'}
          </h1>
          <p className="text-gray-400">
            {isLoggedIn
              ? 'Be the first to publish something amazing!'
              : 'Create an account or sign in to start reading and writing.'}
          </p>
          {!isLoggedIn && (
            <a href="/login"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-full transition-all">
              Sign In
            </a>
          )}
        </div>
      </div>
    );
  }

  /* ── 3D floating cards view ─── */
  if (view3D) {
    return (
      <>
        <Header3D />
        <ThreePostCards posts={posts} visible={true} />
      </>
    );
  }

  /* ── Traditional grid view ─── */
  return (
    <div className="w-full py-8 min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black">
      <Header3D />
      <Container>
        <div className="flex flex-wrap gap-6 pt-20">
          {posts.map((post) => (
            <div className="p-2 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4" key={post.$id}>
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;
