import React from 'react';
import { useDispatch } from 'react-redux';
import { authService as newAuth } from '../../services/auth.service.js';
import { logout } from '../../store/authSlice.js';

function LogoutBtn() {
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      await newAuth.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      dispatch(logout());
    }
  };

  return (
    <button
      className="px-4 py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-full transition-all duration-200 shadow-sm"
      onClick={logoutHandler}
    >
      Sign Out
    </button>
  );
}

export default LogoutBtn;
