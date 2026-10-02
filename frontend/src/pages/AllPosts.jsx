import React, { useEffect, useState } from "react";
import { postService } from "../services/post.service";
import Container from "../components/container/container";
import PostCard from "../components/PostCard";
import BackButton from "../components/BackButton";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (query = "") => {
    setLoading(true);
    try {
      const res = await postService.getPosts(query ? { search: query } : {});
      if (res?.posts) {
        setPosts(res.posts);
      }
    } catch (error) {
      console.error("All posts error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(search);
  };

  return (
    <div className="w-full py-10 min-h-screen">
      <Container>
        {/* ── Header Bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <BackButton fallback="/" label="Home" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              All Stories & Articles
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Box */}
            <form onSubmit={handleSearch} className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 pl-9 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F2C7C7] backdrop-blur-md"
              />
              <svg
                className="w-4 h-4 text-gray-400 absolute left-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>

            {/* Quick Write Story Button */}
            <a
              href="/add-post"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-gray-900 bg-gradient-to-r from-[#F2C7C7] via-white to-[#D5F3D8] hover:opacity-95 shadow-md shadow-[#F2C7C7]/20 transition-all hover:scale-105 whitespace-nowrap"
            >
              <span>✍️</span>
              <span>Write Article</span>
            </a>
          </div>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-white">No articles found</h3>
            <p className="text-gray-400 text-sm mt-1">Try another search keyword or publish your own!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post) => (
              <div key={post._id || post.slug} className="h-full">
                <PostCard {...post} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default AllPosts;
