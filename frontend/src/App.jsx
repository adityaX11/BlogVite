import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, logout } from './store/authSlice';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import authService from './appwrite/auth';   // ← Appwrite kept during transition
import { apiService } from './services/api'; // ← New JWT service

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // 1. Check Appwrite session (existing auth — kept during transition)
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
          return;
        }

        // 2. Fall back to JWT — check if we have a stored access token
        const token = apiService.getToken();
        if (token) {
          // Try to get user from new backend
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include',
          })
            .then(r => r.json())
            .then(res => {
              if (res.user) dispatch(login({ userData: res.user, accessToken: token }));
              else dispatch(logout());
            })
            .catch(() => dispatch(logout()));
        } else {
          dispatch(logout());
        }
      })
      .catch(() => dispatch(logout()))
      .finally(() => setLoading(false));

    // Listen for session expiry events from api.js
    const handleExpired = () => dispatch(logout());
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, [dispatch]);

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-950 via-purple-950 to-black">
      {/* Glassmorphism Header */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* Main content — sits above 3D background */}
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}

export default App;
