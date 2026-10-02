import React from 'react';
import Container from '../container/container';
import Logo from '../Logo';
import { Link, useNavigate } from 'react-router-dom';
import LogoutBtn from './LogoutBtn';
import { useSelector } from 'react-redux';

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  const navItems = [
    {
      name: 'Home',
      slug: '/',
      active: true,
    },
    {
      name: 'Explore Stories',
      slug: '/all-posts',
      active: true,
    },
    {
      name: 'Write',
      slug: '/add-post',
      active: authStatus,
    },
    {
      name: 'Chat 💬',
      slug: '/chat',
      active: authStatus,
    },
    {
      name: 'Login',
      slug: '/login',
      active: !authStatus,
    },
    {
      name: 'Sign Up',
      slug: '/signup',
      active: !authStatus,
      highlight: true,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#070517]/80 backdrop-blur-xl border-b border-white/10 py-3 transition-all">
      <Container>
        <nav className="flex items-center justify-between">
          {/* ── Brand Logo ── */}
          <Link to="/" className="flex items-center gap-2 group">
            <Logo />
          </Link>

          {/* ── Navigation Links ── */}
          <ul className="flex items-center gap-2 sm:gap-3">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.slug}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 ${
                      item.highlight
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-900/40'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}

            {/* User Profile / Dashboard Avatar */}
            {authStatus && (
              <li className="flex items-center gap-3 ml-2 pl-3 border-l border-white/15">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-xs font-semibold text-white group"
                  title="Open Dashboard"
                >
                  <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[11px] font-bold text-white shadow">
                    {userData?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                  <span className="hidden md:inline group-hover:text-indigo-300">
                    {userData?.name?.split(' ')[0] || 'Profile'}
                  </span>
                </Link>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
