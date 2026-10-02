/**
 * database/index.js
 * Single entry point — backend imports models from here.
 * This keeps all DB-related code isolated from the API layer.
 */
export { default as User } from './models/User.js';
export { default as Post } from './models/Post.js';
export { default as connectDB } from './config/db.js';
