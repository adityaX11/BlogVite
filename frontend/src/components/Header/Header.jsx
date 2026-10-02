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
      name: 'All Posts',
      slug: '/all-posts',
      active: authStatus,
    },
    {
      name: 'Add Post',
      slug: '/add-post',
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
    <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 py-3 transition-all">
      <Container>
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl group-hover:scale-110 transition-transform">✨</span>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                BlogVite
              </span>
            </Link>
          </div>

          <ul className="flex items-center gap-2 sm:gap-4">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.slug}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
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

            {authStatus && (
              <li className="flex items-center gap-3 ml-2">
                {userData?.name && (
                  <span className="hidden sm:inline text-xs text-gray-400">
                    Hi, <strong className="text-white">{userData.name.split(' ')[0]}</strong>
                  </span>
                )}
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
