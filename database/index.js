/**
 * database/index.js
 * Single entry point — backend imports models and DB connection from here.
 */
import connectDB from './config/db.js';

export { default as User } from './models/User.js';
export { default as Post } from './models/Post.js';
export { connectDB };
export default connectDB;
