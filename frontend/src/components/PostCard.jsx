import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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

  let imageUrl = '';
  if (typeof featuredImage === 'object' && featuredImage?.url) {
    imageUrl = featuredImage.url;
  } else if (typeof featuredImage === 'string' && (featuredImage.startsWith('http') || featuredImage.startsWith('/'))) {
    imageUrl = featuredImage;
  }

  const authorName = author?.name || (typeof author === 'string' ? author : 'BlogVite Author');

  return (
    <Link to={`/post/${postId}`} className="block h-full">
      <div className="group h-full flex flex-col bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-indigo-400/40 transition-all duration-300 shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
        {/* Thumbnail */}
        <div className="w-full h-44 overflow-hidden rounded-xl mb-4 bg-indigo-950/40 relative">
          {imageUrl && !imageFailed ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex w-full h-full items-center justify-center text-4xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 text-indigo-300">
              ✍️
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
          {title}
        </h2>

        {/* Excerpt */}
        {excerpt ? (
          <p className="text-gray-400 text-xs line-clamp-2 mb-4 leading-relaxed">
            {excerpt}
          </p>
        ) : null}

        {/* Footer Meta */}
        <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-600/70 text-[10px] font-bold text-white flex items-center justify-center">
              {authorName[0]?.toUpperCase() || 'U'}
            </span>
            <span className="truncate max-w-[120px]">{authorName}</span>
          </div>
          <span className="text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
            Read →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
