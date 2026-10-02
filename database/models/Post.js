import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],   // Rich HTML from TinyMCE
    },
    excerpt: {
      type: String,
      default: '',
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    featuredImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },   // Cloudinary public_id for deletion
      caption: { type: String, default: '' },
      width: { type: Number },
      height: { type: Number },
    },
    tags: [{ type: String, lowercase: true, trim: true }],
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

/* ─── Auto-generate excerpt from content ─────────────────── */
postSchema.pre('save', function (next) {
  if (!this.excerpt && this.content) {
    // Strip HTML tags and take first 200 chars
    const plain = this.content.replace(/<[^>]+>/g, '').trim();
    this.excerpt = plain.slice(0, 200) + (plain.length > 200 ? '…' : '');
  }
  next();
});

/* ─── Indexes ────────────────────────────────────────────── */
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ slug: 1 });
postSchema.index({ author: 1 });
postSchema.index({ tags: 1 });

export default mongoose.model('Post', postSchema);
