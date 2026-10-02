import React from 'react'
import PostForm from '../components/post-form/PostForm'

function AddPost() {
  return (
    <div className="min-h-screen flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-2xl">
        <PostForm />
      </div>
    </div>
  )
}


export default AddPost
