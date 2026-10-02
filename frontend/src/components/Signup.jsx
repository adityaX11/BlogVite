import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { login as authLogin } from '../store/authSlice';
import { authService as newAuth } from '../services/auth.service';

function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    const errParam = searchParams.get('error');
    if (errParam === 'facebook_not_configured') {
      setError('Facebook sign up is not configured yet. Please configure FACEBOOK_APP_ID & FACEBOOK_APP_SECRET in backend/.env');
    } else if (errParam === 'google_not_configured') {
      setError('Google sign up is not configured yet. Please configure GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET in backend/.env');
    } else if (errParam === 'oauth') {
      setError('Social authentication was cancelled or failed. Please try again.');
    }
  }, [searchParams]);

  const create = async (data) => {
    setError('');
    setLoading(true);
    try {
      const res = await newAuth.signup({
        name: data.name,
        username: data.username ? data.username.toLowerCase().trim() : undefined,
        email: data.email,
        password: data.password,
      });

      if (res && res.accessToken && res.user) {
        dispatch(authLogin({ userData: res.user, accessToken: res.accessToken }));
        navigate('/');
        return;
      }

      if (res?.message) {
        throw new Error(res.message);
      }
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    newAuth.loginWithGoogle();
  };

  const handleFacebookLogin = () => {
    newAuth.loginWithFacebook();
  };

  return (
    <div className="flex items-center justify-center w-full min-h-[85vh] px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="bg-white/8 backdrop-blur-2xl border border-white/15 rounded-3xl p-8 shadow-2xl shadow-[#F2C7C7]/10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-[#F2C7C7] via-white to-[#D5F3D8] flex items-center justify-center text-2xl shadow-md">
              ✨
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Create your account</h2>
            <p className="text-gray-400 text-xs mt-1">
              Already have an account?{' '}
              <Link to="/login" className="text-[#F2C7C7] hover:underline font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-2.5 mb-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-2.5 px-4 rounded-xl hover:bg-gray-100 transition-all shadow-md text-xs sm:text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>

            <button
              onClick={handleFacebookLogin}
              className="w-full flex items-center justify-center gap-3 bg-[#1877f2] text-white font-semibold py-2.5 px-4 rounded-xl hover:bg-[#166fe5] transition-all shadow-md text-xs sm:text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Sign up with Facebook
            </button>
          </div>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-[11px] text-gray-400 bg-transparent">or sign up with email</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(create)} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Aditya Kumar"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F2C7C7]"
                {...register('name', { required: true })}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Unique Username <span className="text-[#D5F3D8] text-[10px]">(Optional — auto-generated if blank)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 font-mono text-xs">@</span>
                <input
                  type="text"
                  placeholder="aditya_11"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-7 pr-4 py-2.5 text-sm font-mono text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F2C7C7]"
                  {...register('username')}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F2C7C7]"
                {...register('email', { required: true })}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F2C7C7]"
                {...register('password', { required: true, minLength: 6 })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-gray-900 bg-gradient-to-r from-[#F2C7C7] via-white to-[#D5F3D8] hover:opacity-95 transition-all shadow-md shadow-[#F2C7C7]/20 disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Complete Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;