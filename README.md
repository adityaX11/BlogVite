# BlogVite ✨

> A modern, soft-aesthetic social blogging platform, creator network, and real-time news hub built with the MERN stack and Vite.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📖 What is BlogVite?

**BlogVite** is a full-featured publishing ecosystem and community hub designed for modern writers, journalists, readers, and tech enthusiasts. It bridges the gap between traditional long-form publishing, social creator networking, and live informational feeds. 

Crafted with a signature soft aesthetic (`#F2C7C7`, `#FFFFFF`, `#D5F3D8`) and modern glassmorphism, BlogVite provides a serene, clean, and distraction-free environment for sharing ideas, discovering curated news, and conversing in real-time.

---

## 🎯 What You Can Use BlogVite For

- **Publishing & Storytelling**: Write articles, tutorials, personal essays, or quick thoughts. Posting is flexible—only a title is required for quick captures, with full rich-text formatting and custom image uploads when you need depth.
- **Creator Portfolio & Identity**: Establish your digital identity with a unique `@username`, customized bio, and avatar. Showcase all your articles in an organized user profile.
- **Networking & Social Discovery**: Discover other creators, view their public profiles, send and accept friend connection requests, and grow your reader base.
- **Real-Time Direct Messaging**: Chat directly with your connected friends through a responsive, encrypted direct message interface featuring smart history scrolling.
- **Curated Live News Reader**: Stay informed with automatically refreshed regional and global news covering **Technology**, **Business**, **Entertainment**, **Sports** (with real-time Team India cricket updates), and **Artificial Intelligence**.
- **Media Showcase & Inspection**: Inspect article photography and user-uploaded media through an interactive full-screen viewer with zoom-in, zoom-out, and panning controls.

---

## 🚀 Key Features

### 1. Flexible Content Publishing
- **Easy First-Time Posting**: Only the **Title** is mandatory. Writers can publish a quick update or craft a full article with rich content.
- **Edit & Delete Control**: Authors can modify their published articles, update featured covers, or delete posts at any time.
- **Custom Image Uploads**: Cloudinary integration handles responsive image transformations and optimized delivery.
- **Interactive Image Viewer**: Click on any posted image to open a full-screen visualization modal with **Zoom In (+)**, **Zoom Out (-)**, **Reset**, and easy **Back / Close** navigation.

### 2. Multi-Provider Authentication
- **Native JWT Auth**: Secure authentication with short-lived access tokens and automated token refresh cookies.
- **Google OAuth 2.0**: One-click Sign In and Sign Up with Google.
- **Facebook OAuth 2.0**: One-click Sign In and Sign Up with Facebook.
- **Protected Access**: Enforces authorized access across writer tools, private dashboards, and chats while providing public browsing of featured posts.

### 3. Creator Profiles & Networking
- **Unique `@username`**: Auto-generated or custom usernames allow fast user search and clean shareable profile links (`/profile/:id`).
- **Profile Customization**: Upload profile photos (stored on Cloudinary), update bios, and showcase your published works.
- **Friend Connections**: Connect with other creators with Send, Accept, and Decline connection workflows.

### 4. Smart Real-Time Chat
- **Peer-to-Peer Messaging**: Real-time direct communication with connected friends.
- **Smart History Scrolling**: Unlike traditional chat windows that disrupt reading, BlogVite’s chat engine intelligently detects when you scroll up to inspect past messages and **never forces you down** during live polling.
- **Floating Latest Indicator**: A subtle, one-click `↓ Latest` button with an unread badge to instantly jump back to recent messages.

### 5. Curated Indian & Global News Hub
- **5 Major Categories**: Technology, Business, Entertainment, Sports, and AI.
- **Indian Regional Priority**: Sports section delivers real-time Team India and national sports news alongside global headlines.
- **2-Hour Auto Update**: Fresh news feeds are periodically polled and cached to deliver instant load times without rate limits.
- **Clean Article Cards**: Highlights source publisher, publish time, title, concise description, and direct link to the full story.

### 6. Soft & Modern User Interface
- **Soft Color Palette**: Styled using `#F2C7C7` (Soft Rose), `#FFFFFF` (Crisp White), and `#D5F3D8` (Soft Mint).
- **Responsive Layout**: Seamlessly adapts to smartphones, tablets, laptops, and ultra-wide screens with dynamic drawer navigation and collapsible sidebars.

---

## 🛠️ Tools & Technologies Used

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) | Declarative component UI library |
| **Build Tool** | [Vite 7](https://vite.dev/) | Ultra-fast HMR and production bundling |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first CSS styling engine |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) | Global authentication and application state |
| **Routing** | [React Router DOM v7](https://reactrouter.com/) | Client-side SPA routing and deep linking |
| **Backend Runtime** | [Node.js 22 (LTS)](https://nodejs.org/) | Server JavaScript execution environment |
| **Backend Framework** | [Express.js](https://expressjs.com/) | RESTful API routing, middleware, and static asset serving |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) | Cloud-hosted NoSQL document database |
| **ODM** | [Mongoose](https://mongoosejs.com/) | Schema modeling and validation |
| **Authentication** | [Passport.js](https://www.passportjs.org/) | OAuth 2.0 strategies for Google and Facebook |
| **Token Security** | [JSON Web Tokens (JWT)](https://jwt.io/) | Stateless access and refresh token management |
| **Image Storage** | [Cloudinary](https://cloudinary.com/) | Cloud media storage, compression, and delivery |
| **Security Headers** | [Helmet](https://helmetjs.github.io/) | HTTP security header configuration |
| **CORS** | [CORS](https://www.npmjs.com/package/cors) | Cross-Origin Resource Sharing control |
| **Hosting & Deploy** | [Render](https://render.com/) | All-in-One full-stack web service deployment |

---

## 📁 Project Architecture

```
BlogVite/
├── backend/                  # Express REST API Server
│   ├── config/               # Passport OAuth & DB configurations
│   ├── controllers/          # Business logic (auth, post, user, chat, news)
│   ├── middleware/           # Auth protection & validation middlewares
│   ├── routes/               # API route definitions
│   ├── utils/                # Cloudinary upload helpers
│   └── server.js             # Server entry point & SPA static host
├── database/                 # Mongoose schemas & DB connectors
│   ├── config/               # Database connection logic
│   ├── models/               # User, Post, Message schemas
│   └── index.js              # Database module exports
├── frontend/                 # React + Vite Frontend
│   ├── public/               # Favicon and static assets
│   ├── src/
│   │   ├── components/       # Header, Footer, PostCard, Modals, Viewer
│   │   ├── pages/            # Home, Login, Signup, Dashboard, Chat, News, Profile
│   │   ├── services/         # API, Auth, Post, Chat, News client services
│   │   ├── store/            # Redux store and slices
│   │   ├── App.jsx           # Root layout component
│   │   └── main.jsx          # App entrypoint
│   └── vite.config.js        # Vite & Tailwind configuration
├── render.yaml               # Render Cloud deployment blueprint
├── .node-version             # Node runtime lock (v22.14.0)
└── package.json              # Monorepo workspaces & build scripts
```

---

## 💻 Local Development Setup

### 1. Prerequisites
- **Node.js**: `v20.19.0` or `v22.0.0+`
- **npm**: `v9.0.0+`
- **MongoDB Atlas** database account
- **Cloudinary** account (free tier)

### 2. Clone Repository
```bash
git clone https://github.com/adityaX11/BlogVite.git
cd BlogVite
```

### 3. Install Dependencies
```bash
npm run install:all
```

### 4. Configure Environment Variables
Create a file named `.env` in the `backend/` folder:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OAuth (Optional for local dev)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

### 5. Start Development Servers
Run frontend and backend concurrently:
```bash
npm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`

---

## 🚢 Production Deployment (Render All-in-One)

BlogVite is configured for unified deployment on [Render](https://render.com/) where a single Web Service serves both the Express API and the compiled React frontend.

1. **Push your repository** to GitHub.
2. Log into **Render** &rarr; Click **New +** &rarr; **Blueprint** &rarr; Select `BlogVite`.
3. Set your environment variables in the Render dashboard.
4. Render builds the Vite client into `frontend/dist` and launches `node backend/server.js`.
5. Access your live app at `https://YOUR-APP-NAME.onrender.com`.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Aditya Kumar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<p align="center">
  Crafted with care by <b>Aditya Kumar</b> ✨
</p>
