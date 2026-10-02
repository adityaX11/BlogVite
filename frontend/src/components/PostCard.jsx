import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import appwriteService from '../appwrite/config.js';

function PostCard({
  $id,
  _id,
  slug,
  title,
  featuredImage,
  featureImg,
  userId,
  author,
  excerpt,
}) {
  const postId = slug || $id || _id;
  const userData = useSelector((state) => state.auth.userData);
  const [imageFailed, setImageFailed] = useState(false);

  // Determine image source (MongoDB URL or Appwrite preview URL)
  let imageUrl = '';
  if (typeof featuredImage === 'object' && featuredImage?.url) {
    imageUrl = featuredImage.url;
  } else if (typeof featuredImage === 'string' && (featuredImage.startsWith('http') || featuredImage.startsWith('/'))) {
    imageUrl = featuredImage;
  } else {
    const fileId = featuredImage || featureImg;
    if (fileId) {
      imageUrl = appwriteService.getFilePreview(fileId);
    }
  }

  const authorName = author?.name || (typeof author === 'string' ? author : '');

  return (
    <Link to={`/post/${postId}`}>
      <div className="group h-full flex flex-col bg-white/10 hover:bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-indigo-400/40 transition-all duration-300 shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
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
        <h2 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
          {title}
        </h2>
        {excerpt && (
          <p className="text-gray-400 text-xs line-clamp-2 mb-3">
            {excerpt}
          </p>
        )}
        <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
          <span>{authorName || 'BlogVite Author'}</span>
          <span className="text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
            Read →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
