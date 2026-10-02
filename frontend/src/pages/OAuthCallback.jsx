import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { authService } from '../services/auth.service';
import { apiService } from '../services/api';

/**
 * OAuthCallback — handles the redirect from backend after OAuth sign-in.
 * Backend redirects here with ?token=<accessToken>
 */
export default function OAuthCallback() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState('Completing sign-in…');
  const [error, setError]   = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = params.get('token');
    const err   = params.get('error');

    if (err) {
      setError('OAuth sign-in failed. Please try again.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (!token) {
      setError('No authentication token received.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    // Set token first, then fetch user
    apiService.setToken(token);

    authService.getMe().then((res) => {
      if (res.user) {
        dispatch(login({ userData: res.user, accessToken: token }));
        setStatus('Success! Redirecting…');
        setTimeout(() => navigate('/'), 500);
      } else {
        setError('Could not load user profile. Please try again.');
        apiService.clearToken();
        setTimeout(() => navigate('/login'), 3000);
      }
    });
  }, [dispatch, navigate, params]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-black">
      <div className="text-center space-y-4 p-10 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        {error ? (
          <>
            <div className="text-4xl">❌</div>
            <p className="text-red-400 font-semibold">{error}</p>
            <p className="text-gray-400 text-sm">Redirecting to login…</p>
          </>
        ) : (
          <>
            {/* Spinner */}
            <div className="w-12 h-12 mx-auto border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-white font-semibold text-lg">{status}</p>
            <p className="text-gray-400 text-sm">Please wait a moment</p>
          </>
        )}
      </div>
    </div>
  );
}
