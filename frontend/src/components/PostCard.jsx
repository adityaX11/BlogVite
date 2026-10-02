import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ImageViewerModal from './ImageViewerModal';

function PostCard({
  _id,
  slug,
  title,
  featuredImage,
  author,
  excerpt,
  createdAt,
}) {
  const postId = slug || _id;
  const [imageFailed, setImageFailed] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const navigate = useNavigate();

  let imageUrl = '';
  let caption = '';
  if (typeof featuredImage === 'object' && featuredImage?.url) {
    imageUrl = featuredImage.url;
    caption = featuredImage.caption || '';
  } else if (
    typeof featuredImage === 'string' &&
    (featuredImage.startsWith('http') || featuredImage.startsWith('/'))
  ) {
    imageUrl = featuredImage;
  }

  const authorName =
    author?.name || (typeof author === 'string' ? author : 'BlogVite Author');
  const authorAvatar = typeof author === 'object' ? author?.avatar : null;
  const authorId =
    typeof author === 'object'
      ? author?._id || author?.username || author?.id
      : null;

  const handleAuthorClick = (e) => {
    if (authorId) {
      e.preventDefault();
      e.stopPropagation();
      navigate(`/profile/${authorId}`);
    }
  };

  return (
    <>
      <Link to={`/post/${postId}`} className="block h-full group">
        <div className="h-full flex flex-col bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-xl rounded-3xl p-4 border border-white/10 hover:border-[#F2C7C7]/40 transition-all duration-300 shadow-xl hover:shadow-[#F2C7C7]/5 hover:-translate-y-1">
          {/* Thumbnail Image */}
          <div className="w-full h-44 overflow-hidden rounded-2xl mb-4 bg-black/40 relative">
            {imageUrl && !imageFailed ? (
              <>
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={() => setImageFailed(true)}
                />
                {/* Quick view button on thumbnail */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowImageModal(true);
                  }}
                  className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/70 hover:bg-black/90 text-white text-[10px] font-bold border border-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-md hover:scale-105 flex items-center gap-1"
                  title="Expand full photo"
                >
                  <span>🔍</span>
                  <span>Photo</span>
                </button>
              </>
            ) : (
              <div className="flex w-full h-full items-center justify-center text-4xl bg-gradient-to-br from-[#F2C7C7]/20 to-[#D5F3D8]/20 text-[#F2C7C7]">
                ✍️
              </div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-[#F2C7C7] transition-colors">
            {title}
          </h2>

          {/* Excerpt */}
          {excerpt ? (
            <p className="text-gray-400 text-xs line-clamp-2 mb-4 leading-relaxed font-light">
              {excerpt}
            </p>
          ) : null}

          {/* Footer Meta */}
          <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
            <div
              onClick={handleAuthorClick}
              className="flex items-center gap-2 hover:text-[#F2C7C7] transition-colors cursor-pointer"
              title={authorId ? `View ${authorName}'s profile` : ''}
            >
              {authorAvatar ? (
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-6 h-6 rounded-full object-cover border border-white/20 shadow"
                />
              ) : (
                <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#F2C7C7] to-[#D5F3D8] text-gray-900 text-[10px] font-black flex items-center justify-center shadow">
                  {authorName[0]?.toUpperCase() || 'U'}
                </span>
              )}
              <span className="truncate max-w-[120px] font-medium text-gray-300 hover:text-white">
                {authorName}
              </span>
            </div>
            <span className="text-[#D5F3D8] font-bold group-hover:translate-x-1 transition-transform">
              Read →
            </span>
          </div>
        </div>
      </Link>

      {/* Full Image Viewer with Back Button */}
      {imageUrl && (
        <ImageViewerModal
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
          imageUrl={imageUrl}
          title={title}
          caption={caption}
          author={typeof author === 'object' ? author : { name: authorName }}
        />
      )}
    </>
  );
}

export default PostCard;
