import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      default: null,      // null for OAuth-only users
      minlength: [6, 'Password must be at least 6 characters'],
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      maxlength: [300, 'Bio cannot exceed 300 characters'],
    },
    provider: {
      type: String,
      enum: ['local', 'google', 'facebook'],
      default: 'local',
    },
    providerId: {
      type: String,
      default: null,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    friendRequests: [
      {
        from: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
  },
  { timestamps: true }
);

/* ─── Auto-generate username if not provided ────────────── */
userSchema.pre('save', async function (next) {
  if (!this.username) {
    const base = (this.email ? this.email.split('@')[0] : (this.name || 'user'))
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '');
    let candidate = base || 'user';
    let suffix = Math.floor(100 + Math.random() * 900);
    let finalUsername = `${candidate}_${suffix}`;
    while (await mongoose.models.User.findOne({ username: finalUsername })) {
      suffix = Math.floor(100 + Math.random() * 900);
      finalUsername = `${candidate}_${suffix}`;
    }
    this.username = finalUsername;
  }

  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/* ─── Instance methods ───────────────────────────────────── */
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.toPublic = function () {
  return {
    id: this._id,
    name: this.name,
    username: this.username || '',
    email: this.email,
    avatar: this.avatar,
    bio: this.bio,
    provider: this.provider,
    friends: this.friends || [],
    friendRequests: this.friendRequests || [],
    createdAt: this.createdAt,
  };
};

export default mongoose.model('User', userSchema);
