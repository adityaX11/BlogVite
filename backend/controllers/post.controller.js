import { Post } from '../../../database/index.js';
import { deleteImage } from '../utils/cloudinary.js';

/* ════════════════════════════════════════════════════════════
   CREATE POST
════════════════════════════════════════════════════════════ */
export const createPost = async (req, res) => {
  const { title, slug, content, caption, status, tags } = req.body;
  if (!title || !slug || !content) {
    return res.status(400).json({ message: 'title, slug and content are required' });
  }
  try {
    const exists = await Post.findOne({ slug });
    if (exists) return res.status(409).json({ message: 'A post with this slug already exists' });

    const post = await Post.create({
      title,
      slug,
      content,
      status: status || 'active',
      tags: tags ? JSON.parse(tags) : [],
      author: req.user._id,
      featuredImage: req.file
        ? {
            url: req.file.path,
            publicId: req.file.filename,
            caption: caption || '',
            width: req.file.width,
            height: req.file.height,
          }
        : undefined,
    });

    await post.populate('author', 'name avatar');
    res.status(201).json(post);
  } catch (err) {
    // If image was uploaded but DB failed, clean Cloudinary
    if (req.file) await deleteImage(req.file.filename);
    res.status(500).json({ message: err.message });
  }
};

/* ════════════════════════════════════════════════════════════
   GET ALL POSTS (public)
════════════════════════════════════════════════════════════ */
export const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 12, tag, search } = req.query;
    const query = { status: 'active' };
    if (tag) query.tags = tag;
    if (search) query.$text = { $search: search };

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('author', 'name avatar')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean(),
      Post.countDocuments(query),
    ]);

    res.json({
      posts,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ════════════════════════════════════════════════════════════
   GET SINGLE POST
════════════════════════════════════════════════════════════ */
export const getPost = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug, status: 'active' },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name avatar bio');

    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ════════════════════════════════════════════════════════════
   GET MY POSTS (auth required)
════════════════════════════════════════════════════════════ */
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ posts, total: posts.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ════════════════════════════════════════════════════════════
   UPDATE POST
════════════════════════════════════════════════════════════ */
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      if (req.file) await deleteImage(req.file.filename);
      return res.status(403).json({ message: 'Forbidden — not your post' });
    }

    const { title, content, caption, status, tags } = req.body;
    if (title) post.title = title;
    if (content) { post.content = content; post.excerpt = ''; } // re-generate excerpt
    if (status) post.status = status;
    if (tags) post.tags = JSON.parse(tags);

    if (req.file) {
      // Delete old image from Cloudinary
      if (post.featuredImage?.publicId) await deleteImage(post.featuredImage.publicId);
      post.featuredImage = {
        url: req.file.path,
        publicId: req.file.filename,
        caption: caption || '',
      };
    }

    await post.save();
    await post.populate('author', 'name avatar');
    res.json(post);
  } catch (err) {
    if (req.file) await deleteImage(req.file.filename);
    res.status(500).json({ message: err.message });
  }
};

/* ════════════════════════════════════════════════════════════
   DELETE POST
════════════════════════════════════════════════════════════ */
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden — not your post' });
    }

    if (post.featuredImage?.publicId) await deleteImage(post.featuredImage.publicId);
    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
