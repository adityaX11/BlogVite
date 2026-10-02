import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../services/post.service';
import Container from '../components/container/container';
import PostForm from '../components/post-form/PostForm';
import BackButton from '../components/BackButton';

function EditPost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;
    postService
      .getPost(slug)
      .then((data) => {
        if (data && !data.error && data._id) {
          setPost(data);
        } else {
          navigate('/');
        }
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return post ? (
    <div className="py-10 min-h-screen">
      <Container>
        <div className="max-w-6xl mx-auto mb-6 flex items-center gap-3">
          <BackButton fallback={`/post/${slug}`} label="Cancel & Back" />
          <h1 className="text-xl font-bold text-white">Editing: {post.title}</h1>
        </div>
        <PostForm post={post} />
      </Container>
    </div>
  ) : null;
}

export default EditPost;
