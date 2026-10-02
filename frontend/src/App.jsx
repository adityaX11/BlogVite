import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, logout } from './store/authSlice';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { authService } from './services/auth.service';
import { apiService } from './services/api';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = apiService.getToken();
    if (token) {
      authService
        .getMe()
        .then((res) => {
          if (res?.user) {
            dispatch(login({ userData: res.user, accessToken: token }));
          } else {
            dispatch(logout());
          }
        })
        .catch(() => dispatch(logout()))
        .finally(() => setLoading(false));
    } else {
      // Check if refresh cookie exists by pinging refresh endpoint
      authService
        .refresh()
        .then((res) => {
          if (res?.accessToken) {
            apiService.setToken(res.accessToken);
            return authService.getMe().then((meRes) => {
              if (meRes?.user) {
                dispatch(login({ userData: meRes.user, accessToken: res.accessToken }));
              }
            });
          } else {
            dispatch(logout());
          }
        })
        .catch(() => dispatch(logout()))
        .finally(() => setLoading(false));
    }

    const handleExpired = () => dispatch(logout());
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070514]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a0720] via-[#050312] to-black text-gray-100">
      <Header />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
