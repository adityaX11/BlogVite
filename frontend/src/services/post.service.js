import { apiService } from './api.js';

export const postService = {
  /* ── Public ─────────────────────────────────────────── */
  getPosts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiService.get(`/posts${q ? `?${q}` : ''}`);
  },
  getPost: (slug) => apiService.get(`/posts/${slug}`),

  /* ── Authenticated ───────────────────────────────────── */
  getMyPosts: () => apiService.get('/posts/my'),

  createPost: (data) => {
    // data must be a FormData object (includes file + fields)
    return apiService.post('/posts', data);
  },

  updatePost: (slug, data) => {
    // data must be a FormData object
    return apiService.put(`/posts/${slug}`, data);
  },

  deletePost: (slug) => apiService.del(`/posts/${slug}`),
};

/* ── Helper: build FormData for create/update ─────────── */
export const buildPostFormData = ({ title, slug, content, caption, status, tags, imageFile }) => {
  const fd = new FormData();
  if (title)   fd.append('title', title);
  if (slug)    fd.append('slug', slug);
  if (content) fd.append('content', content);
  if (caption) fd.append('caption', caption);
  if (status)  fd.append('status', status);
  if (tags)    fd.append('tags', JSON.stringify(tags));
  if (imageFile) fd.append('featuredImage', imageFile);
  return fd;
};
