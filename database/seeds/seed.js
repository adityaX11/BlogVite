/**
 * database/seeds/seed.js
 *
 * Run:  node database/seeds/seed.js
 * Clear: node database/seeds/seed.js --clear
 *
 * Seeds the database with sample users and blog posts.
 * Uses MONGO_URI from backend/.env
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load backend .env (where MONGO_URI lives)
const envPath = join(__dirname, '../../backend/.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.warn('⚠  backend/.env not found — set MONGO_URI manually');
  dotenv.config();
}

// Import models
const { default: User } = await import('../models/User.js');
const { default: Post } = await import('../models/Post.js');

/* ─── Sample Data ─────────────────────────────────────── */
const sampleUsers = [
  {
    name: 'Aditya Kumar',
    email: 'aditya@blogvite.dev',
    password: 'password123',
    bio: 'Founder & lead developer of BlogVite. Passionate about React and MongoDB.',
    provider: 'local',
  },
  {
    name: 'Priya Sharma',
    email: 'priya@blogvite.dev',
    password: 'password123',
    bio: 'Full-stack developer. Loves writing about JavaScript.',
    provider: 'local',
  },
];

const samplePosts = (authorId) => [
  {
    title: 'Getting Started with React 19',
    slug: 'getting-started-react-19',
    content: `<h2>Welcome to React 19</h2><p>React 19 brings exciting new features including the React Compiler, Server Actions, and much more. In this post we'll explore what's new and how to upgrade your existing projects.</p><p>The biggest change is the introduction of <strong>automatic memoization</strong> via the React Compiler, which means you no longer need to manually wrap components in <code>useMemo</code> or <code>useCallback</code>.</p>`,
    excerpt: 'React 19 brings exciting new features including the React Compiler, Server Actions, and much more.',
    tags: ['react', 'javascript', 'frontend'],
    status: 'active',
    author: authorId,
    views: 142,
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200',
      publicId: '',
      caption: 'React 19 — The future of frontend development',
    },
  },
  {
    title: 'MongoDB Atlas Free Tier: Complete Setup Guide',
    slug: 'mongodb-atlas-free-tier-guide',
    content: `<h2>MongoDB Atlas Free Tier</h2><p>MongoDB Atlas offers a generous free tier (M0) with 512MB of storage — more than enough for a blog platform. Here's how to set it up in under 10 minutes.</p><h3>Step 1: Create Account</h3><p>Go to mongodb.com/atlas and sign up with your Google account...</p>`,
    excerpt: 'MongoDB Atlas offers a generous free tier (M0) with 512MB of storage. Set it up in under 10 minutes.',
    tags: ['mongodb', 'database', 'backend'],
    status: 'active',
    author: authorId,
    views: 89,
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200',
      publicId: '',
      caption: 'MongoDB Atlas dashboard',
    },
  },
  {
    title: 'Three.js 3D Web Experiences: A Beginner Guide',
    slug: 'threejs-3d-web-experiences-beginner',
    content: `<h2>Why Three.js?</h2><p>Three.js makes it possible to render stunning 3D graphics right in the browser using WebGL. Combined with React Three Fiber, you can build interactive 3D scenes as easily as writing React components.</p><p>In this guide, we'll build floating 3D cards — just like the ones on our home page!</p>`,
    excerpt: 'Three.js makes it possible to render stunning 3D graphics right in the browser. Combined with React Three Fiber, build interactive scenes.',
    tags: ['threejs', 'webgl', '3d', 'react'],
    status: 'active',
    author: authorId,
    views: 234,
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
      publicId: '',
      caption: '3D web graphics with Three.js',
    },
  },
  {
    title: 'JWT vs Session Authentication: Which Should You Use?',
    slug: 'jwt-vs-session-authentication',
    content: `<h2>The Great Auth Debate</h2><p>JWT (JSON Web Tokens) and session-based authentication both solve the same problem — keeping users logged in — but they do it differently. Here's an honest comparison.</p><h3>JWT Pros</h3><ul><li>Stateless — great for distributed systems</li><li>Works across domains (CORS-friendly)</li><li>Contains user info (no DB lookup needed)</li></ul>`,
    excerpt: 'JWT and session-based auth both solve the same problem but differently. Here\'s an honest comparison to help you choose.',
    tags: ['security', 'jwt', 'authentication', 'backend'],
    status: 'active',
    author: authorId,
    views: 312,
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200',
      publicId: '',
      caption: 'Security and authentication concepts',
    },
  },
];

/* ─── Main ────────────────────────────────────────────── */
async function seed() {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error('❌  MONGO_URI not found. Set it in backend/.env');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI, { dbName: 'blogvite' });
  console.log('✅  Connected to MongoDB');

  const isClear = process.argv.includes('--clear');

  if (isClear) {
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('🗑   Cleared all users and posts');
    await mongoose.disconnect();
    return;
  }

  // Create users
  console.log('\n📝  Seeding users...');
  const createdUsers = [];
  for (const u of sampleUsers) {
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      console.log(`   ⏭  Skipped (already exists): ${u.email}`);
      createdUsers.push(exists);
    } else {
      const user = await User.create(u);
      console.log(`   ✅  Created user: ${user.name} <${user.email}>`);
      createdUsers.push(user);
    }
  }

  // Create posts under first user
  console.log('\n📄  Seeding posts...');
  const authorId = createdUsers[0]._id;
  for (const p of samplePosts(authorId)) {
    const exists = await Post.findOne({ slug: p.slug });
    if (exists) {
      console.log(`   ⏭  Skipped (already exists): ${p.slug}`);
    } else {
      const post = await Post.create(p);
      console.log(`   ✅  Created post: "${post.title}"`);
    }
  }

  console.log('\n🎉  Seeding complete!\n');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});
