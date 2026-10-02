import React, { useState, useEffect } from 'react';
import Container from '../container/container';
import Logo from '../Logo';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LogoutBtn from './LogoutBtn';
import { useSelector } from 'react-redux';

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile dropdown whenever the route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    {
      name: 'Home',
      slug: '/',
      icon: '🏠',
      active: true,
    },
    {
      name: 'Explore Stories',
      slug: '/all-posts',
      icon: '📚',
      active: authStatus,
    },
    {
      name: 'Write Article',
      slug: '/add-post',
      icon: '✍️',
      active: authStatus,
    },
    {
      name: 'Global News 🌐',
      slug: '/news',
      icon: '🌐',
      active: authStatus,
    },
    {
      name: 'Chat 💬',
      slug: '/chat',
      icon: '💬',
      active: authStatus,
    },
    {
      name: 'Login',
      slug: '/login',
      icon: '🔑',
      active: !authStatus,
    },
    {
      name: 'Sign Up',
      slug: '/signup',
      icon: '✨',
      active: !authStatus,
      highlight: true,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#070517]/90 backdrop-blur-2xl border-b border-white/10 py-3 transition-all">
      <Container>
        <nav className="flex items-center justify-between">
          {/* ── Brand Logo ── */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <Logo />
          </Link>

          {/* ── Desktop Navigation Links (Visible on md and above) ── */}
          <ul className="hidden md:flex items-center gap-2 lg:gap-3">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.slug}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`px-3.5 py-1.5 text-xs lg:text-sm font-semibold rounded-full transition-all duration-200 ${
                      item.highlight
                        ? 'bg-gradient-to-r from-[#F2C7C7] via-white to-[#D5F3D8] text-gray-900 font-bold shadow-md shadow-[#F2C7C7]/20 hover:scale-105'
                        : location.pathname === item.slug
                        ? 'text-white bg-white/10 border border-white/15'
                        : 'text-gray-300 hover:text-[#F2C7C7] hover:bg-white/5'
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}

            {/* Desktop User Dashboard / Profile Badge */}
            {authStatus && (
              <li className="flex items-center gap-2.5 ml-2 pl-3 border-l border-white/15">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs font-semibold text-white group hover:border-[#D5F3D8]/40 shadow-sm"
                  title="Open Dashboard"
                >
                  {userData?.avatar ? (
                    <img
                      src={userData.avatar}
                      alt={userData.name}
                      className="w-6 h-6 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#F2C7C7] to-[#D5F3D8] text-gray-900 flex items-center justify-center text-[11px] font-black shadow">
                      {userData?.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  )}
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-white group-hover:text-[#D5F3D8] font-bold text-xs truncate max-w-[100px]">
                      {userData?.name?.split(' ')[0] || 'Dashboard'}
                    </span>
                    {userData?.username && (
                      <span className="text-[10px] text-[#F2C7C7] font-mono mt-0.5 truncate max-w-[100px]">
                        @{userData.username}
                      </span>
                    )}
                  </div>
                </Link>
                <LogoutBtn />
              </li>
            )}
          </ul>

          {/* ── Mobile Action Icons & Hamburger Button (Visible on mobile/tablet) ── */}
          <div className="flex md:hidden items-center gap-2">
            {authStatus && (
              <Link
                to="/dashboard"
                className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border border-white/20 shadow-sm"
                title="Profile"
              >
                {userData?.avatar ? (
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="w-full h-full bg-gradient-to-tr from-[#F2C7C7] to-[#D5F3D8] text-gray-900 flex items-center justify-center text-xs font-black">
                    {userData?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                )}
              </Link>
            )}

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-200 hover:text-white hover:bg-white/10 focus:outline-none transition-all"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* ── Mobile Dropdown Drawer (Smooth, fluid on any device) ── */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-white/10 animate-fade-in">
            <div className="flex flex-col space-y-1.5 pb-2">
              {navItems.map((item) =>
                item.active ? (
                  <button
                    key={item.slug}
                    onClick={() => {
                      navigate(item.slug);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl text-left text-sm font-semibold transition-all ${
                      item.highlight
                        ? 'bg-gradient-to-r from-[#F2C7C7] via-white to-[#D5F3D8] text-gray-900 font-bold shadow-md'
                        : location.pathname === item.slug
                        ? 'bg-white/10 text-white border border-white/15'
                        : 'text-gray-300 hover:bg-white/5 hover:text-[#F2C7C7]'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                ) : null
              )}

              {/* Mobile Profile & Logout */}
              {authStatus && (
                <div className="pt-2 mt-2 border-t border-white/10 flex flex-col space-y-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-sm font-semibold border border-white/10"
                  >
                    <span className="text-base">👤</span>
                    <div className="flex-1 truncate">
                      <span className="block truncate">{userData?.name || 'Dashboard'}</span>
                      {userData?.username && (
                        <span className="text-xs text-[#F2C7C7] font-mono">@{userData.username}</span>
                      )}
                    </div>
                  </Link>

                  <div className="px-4 py-1">
                    <LogoutBtn />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}

export default Header;
