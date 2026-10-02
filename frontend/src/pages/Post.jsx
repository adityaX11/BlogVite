import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { postService } from "../services/post.service";
import Button from "../components/Button";
import Container from "../components/container/container";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

function Post() {
  const [post, setPost] = useState(null);
  const [isMongo, setIsMongo] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (!slug) return;

    // 1. Try MongoDB backend first
    postService.getPost(slug)
      .then((mongoPost) => {
        if (mongoPost && !mongoPost.error && mongoPost._id) {
          setPost(mongoPost);
          setIsMongo(true);
        } else {
          // 2. Fall back to Appwrite
          fetchAppwritePost();
        }
      })
      .catch(() => {
        fetchAppwritePost();
      });

    function fetchAppwritePost() {
      appwriteService.getPost(slug).then((appwriteDoc) => {
        if (appwriteDoc) {
          setPost(appwriteDoc);
          setIsMongo(false);
        } else {
          navigate("/");
        }
      });
    }
  }, [slug, navigate]);

  // Check if current logged-in user is the author
  const isAuthor = Boolean(
    post && userData && (
      (isMongo && (post.author?._id === userData.id || post.author === userData.id)) ||
      (!isMongo && post.userId === userData.$id)
    )
  );

  const deletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    if (isMongo) {
      await postService.deletePost(post.slug);
      navigate("/");
    } else {
      const status = await appwriteService.deletePost(post.$id);
      if (status) {
        const imageId = post.featureImg || post.featuredImage;
        if (imageId) appwriteService.deleteFile(imageId);
        navigate("/");
      }
    }
  };

  if (!post) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Resolve image URL
  let imageUrl = "";
  if (isMongo) {
    imageUrl = post.featuredImage?.url || "";
  } else {
    const fileId = post.featureImg || post.featuredImage;
    if (fileId) imageUrl = appwriteService.getFilePreview(fileId);
  }

  return (
    <div className="py-12 min-h-screen">
      <Container>
        <article className="max-w-4xl mx-auto bg-white/5 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl text-white">
          {/* Header Image */}
          {imageUrl && !imageFailed ? (
            <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden mb-8 relative shadow-lg">
              <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={() => setImageFailed(true)}
              />
              {post.featuredImage?.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm px-4 py-2 text-xs text-gray-300">
                  {post.featuredImage.caption}
                </div>
              )}
            </div>
          ) : null}

          {/* Action buttons if Author */}
          {isAuthor && (
            <div className="flex justify-end gap-3 mb-6">
              <Link to={`/edit-post/${post.slug || post.$id}`}>
                <Button bgColor="bg-indigo-600 hover:bg-indigo-500">Edit Post</Button>
              </Link>
              <Button bgColor="bg-red-600 hover:bg-red-500" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}

          {/* Title & Metadata */}
          <header className="mb-8 border-b border-white/10 pb-6">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              {post.author?.name && (
                <span className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                    {post.author.name[0].toUpperCase()}
                  </span>
                  {post.author.name}
                </span>
              )}
              {post.createdAt && (
                <span>• {new Date(post.createdAt).toLocaleDateString()}</span>
              )}
              {post.views !== undefined && (
                <span>• 👁 {post.views} views</span>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Post Content */}
          <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed text-base sm:text-lg space-y-4">
            {parse(post.content || "")}
          </div>
        </article>
      </Container>
    </div>
  );
}

export default Post;
