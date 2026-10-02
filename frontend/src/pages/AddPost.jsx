import React from 'react';
import PostForm from '../components/post-form/PostForm';
import Container from '../components/container/container';
import BackButton from '../components/BackButton';

function AddPost() {
  return (
    <div className="py-10 min-h-screen">
      <Container>
        <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackButton fallback="/" label="Back to Home" />
            <h1 className="text-2xl font-bold text-white">Create New Story</h1>
          </div>
          <p className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            💡 Only Title is required to publish!
          </p>
        </div>
        <PostForm />
      </Container>
    </div>
  );
}

export default AddPost;
