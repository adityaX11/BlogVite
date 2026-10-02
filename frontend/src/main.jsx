import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store.js';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Protected from './components/AuthLayout.jsx';
import Signup from './pages/Signup.jsx';
import AllPosts from './pages/AllPosts.jsx';
import AddPost from './pages/AddPost.jsx';
import EditPost from './pages/EditPost.jsx';
import Post from './pages/Post.jsx';
import OAuthCallback from './pages/OAuthCallback.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Chat from './pages/Chat.jsx';
import News from './pages/News.jsx';
import UserProfile from './pages/UserProfile.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // ── Public Routes (accessible without login) ──
      { path: '/',                element: <Home /> },
      { path: '/login',           element: <Protected authentication={false}><Login /></Protected> },
      { path: '/signup',          element: <Protected authentication={false}><Signup /></Protected> },
      { path: '/oauth-callback',  element: <OAuthCallback /> },

      // ── Protected Routes (ONLY logged-in users can access) ──
      { path: '/all-posts',       element: <Protected authentication><AllPosts /></Protected> },
      { path: '/post/:slug',      element: <Protected authentication><Post /></Protected> },
      { path: '/add-post',        element: <Protected authentication><AddPost /></Protected> },
      { path: '/edit-post/:slug', element: <Protected authentication><EditPost /></Protected> },
      { path: '/dashboard',       element: <Protected authentication><Dashboard /></Protected> },
      { path: '/profile/:identifier', element: <Protected authentication><UserProfile /></Protected> },
      { path: '/chat',            element: <Protected authentication><Chat /></Protected> },
      { path: '/chat/:friendId',  element: <Protected authentication><Chat /></Protected> },
      { path: '/news',            element: <Protected authentication><News /></Protected> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);