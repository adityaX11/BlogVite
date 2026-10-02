import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { postService } from "../services/post.service";
import BackButton from "../components/BackButton";
import Container from "../components/container/container";
import ImageViewerModal from "../components/ImageViewerModal";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

function Post() {
  const [post, setPost] = useState(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (!slug) return;

    postService
      .getPost(slug)
      .then((mongoPost) => {
        if (mongoPost && !mongoPost.error && mongoPost._id) {
          setPost(mongoPost);
        } else {
          navigate("/all-posts");
        }
      })
      .catch(() => {
        navigate("/all-posts");
      });
  }, [slug, navigate]);

  const isAuthor = Boolean(
    post && userData && (post.author?._id === userData.id || post.author === userData.id)
  );

  const deletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      await postService.deletePost(post.slug);
      navigate("/all-posts");
    } catch (err) {
      alert("Failed to delete post: " + err.message);
    }
  };

  if (!post) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#F2C7C7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const imageUrl = post.featuredImage?.url || "";
  const authorId = post.author?._id || post.author?.username || post.author;

  return (
    <div className="py-6 sm:py-10 min-h-screen">
      <Container>
        {/* ── Top Bar ── */}
        <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
          <BackButton fallback="/all-posts" label="All Stories" />
          {isAuthor && (
            <div className="flex gap-2">
              <Link
                to={`/edit-post/${post.slug}`}
                className="px-4 py-1.5 rounded-full text-xs font-bold text-gray-900 bg-gradient-to-r from-[#F2C7C7] via-white to-[#D5F3D8] hover:opacity-95 shadow-md shadow-[#F2C7C7]/20 transition-all hover:scale-105"
              >
                ✏️ Edit Story
              </Link>
              <button
                onClick={deletePost}
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-red-300 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 transition-all"
              >
                🗑 Delete
              </button>
            </div>
          )}
        </div>

        {/* ── Article Content ── */}
        <article className="max-w-4xl mx-auto bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-5 sm:p-10 border border-white/10 shadow-2xl text-white">
          {/* Header Image with Zoom/Lightbox capability & Back button in Viewer */}
          {imageUrl && !imageFailed ? (
            <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden mb-8 relative shadow-xl bg-black/40 border border-white/10 group">
              <div
                className="h-64 sm:h-96 md:h-[420px] w-full cursor-pointer relative overflow-hidden"
                onClick={() => setLightboxOpen(true)}
                title="Click to open full image viewer"
              >
                <img
                  src={imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={() => setImageFailed(true)}
                />

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* View Image Badge Overlay */}
                <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full text-xs font-bold bg-black/70 backdrop-blur-md text-white border border-white/20 shadow-lg flex items-center gap-1.5 group-hover:scale-105 transition-all">
                  <span>🔍</span>
                  <span>Click to Expand Full Image</span>
                </div>
              </div>

              {post.featuredImage?.caption && (
                <div className="bg-black/60 backdrop-blur-sm px-4 py-2.5 text-xs text-gray-300 border-t border-white/10 flex items-center justify-between">
                  <span>📷 {post.featuredImage.caption}</span>
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="text-[#D5F3D8] hover:underline font-semibold text-[11px]"
                  >
                    View High-Res ↗
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {/* Title & Metadata */}
          <header className="mb-8 border-b border-white/10 pb-6">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
              {/* Clickable Author Profile Link */}
              {post.author?.name && (
                <Link
                  to={`/profile/${authorId}`}
                  className="flex items-center gap-2 group/author hover:text-[#F2C7C7] transition-colors"
                  title="View author profile"
                >
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-8 h-8 rounded-full object-cover border border-white/20 shadow"
                    />
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F2C7C7] to-[#D5F3D8] flex items-center justify-center font-black text-gray-900 text-xs shadow">
                      {post.author.name[0].toUpperCase()}
                    </span>
                  )}
                  <span className="text-gray-200 font-semibold group-hover/author:text-[#F2C7C7]">
                    {post.author.name}
                  </span>
                  {post.author.username && (
                    <span className="text-xs text-[#F2C7C7] font-mono">
                      @{post.author.username}
                    </span>
                  )}
                </Link>
              )}

              {post.createdAt && (
                <span>• {new Date(post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              )}

              {post.views !== undefined && (
                <span className="text-[#D5F3D8] font-medium">• 👁 {post.views} views</span>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F2C7C7]/15 text-[#F2C7C7] border border-[#F2C7C7]/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Post Body Content */}
          {post.content ? (
            <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed text-base sm:text-lg space-y-4">
              {parse(post.content)}
            </div>
          ) : (
            <p className="text-gray-400 italic text-sm font-light">
              This author published this image and title as a quick thought note.
            </p>
          )}
        </article>

        {/* ── Fullscreen Lightbox Modal for Image (with prominent Back button) ── */}
        <ImageViewerModal
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          imageUrl={imageUrl}
          title={post.title}
          caption={post.featuredImage?.caption}
          author={post.author}
        />
      </Container>
    </div>
  );
}

export default Post;
