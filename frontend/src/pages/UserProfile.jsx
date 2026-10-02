import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/user.service';
import Container from '../components/container/container';
import BackButton from '../components/BackButton';
import PostCard from '../components/PostCard';

function UserProfile() {
  const { identifier } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await userService.getUserProfile(identifier);
      if (data && data.user) {
        setProfile(data);
      } else {
        setError('User not found');
      }
    } catch (err) {
      setError(err?.message || 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (identifier) {
      loadProfile();
    }
  }, [identifier]);

  const handleConnect = async () => {
    if (!profile?.user?._id) return;
    setConnecting(true);
    try {
      await userService.sendConnectRequest(profile.user._id);
      setActionMsg('Connection request sent!');
      loadProfile();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to send request');
    } finally {
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#F2C7C7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center p-8 bg-white/5 rounded-3xl border border-white/10 max-w-md">
          <div className="text-5xl mb-3">👤</div>
          <h2 className="text-xl font-bold text-white mb-2">Creator Not Found</h2>
          <p className="text-xs text-gray-400 mb-6">
            The profile you are looking for does not exist or may have changed their username.
          </p>
          <BackButton fallback="/all-posts" label="Back to Stories" />
        </div>
      </div>
    );
  }

  const { user, connectionStatus, isSelf, posts = [] } = profile;

  return (
    <div className="py-8 sm:py-10 min-h-screen">
      <Container>
        {/* ── Top Navigation Bar ── */}
        <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
          <BackButton fallback="/all-posts" label="Back" />
          {actionMsg && (
            <div className="px-4 py-1.5 rounded-full bg-[#D5F3D8]/20 text-[#D5F3D8] border border-[#D5F3D8]/30 text-xs font-semibold">
              {actionMsg}
            </div>
          )}
        </div>

        {/* ── Profile Header Card ── */}
        <div className="max-w-5xl mx-auto bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl mb-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar (Uploaded Photo or Gradient Initial) */}
            <div className="relative flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-2 border-white/20 shadow-xl shadow-[#F2C7C7]/10"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-[#F2C7C7] via-white to-[#D5F3D8] flex items-center justify-center text-4xl sm:text-5xl font-black text-gray-900 shadow-xl shadow-[#F2C7C7]/20">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {user.name}
                </h1>
                {user.username && (
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#F2C7C7]/15 text-[#F2C7C7] border border-[#F2C7C7]/30">
                    @{user.username}
                  </span>
                )}
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-300 max-w-xl leading-relaxed font-light">
                {user.bio || 'This creator has not written a bio yet.'}
              </p>

              {/* Stats & Joined Date */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-400 pt-1">
                <span>📚 <strong className="text-white">{user.postCount || posts.length}</strong> Stories</span>
                <span>•</span>
                <span>👥 <strong className="text-white">{user.friendCount || 0}</strong> Connections</span>
                {user.createdAt && (
                  <>
                    <span>•</span>
                    <span>Joined {new Date(user.createdAt).toLocaleDateString([], { month: 'short', year: 'numeric' })}</span>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                {isSelf ? (
                  <Link
                    to="/dashboard"
                    className="px-5 py-2 rounded-full text-xs font-bold text-gray-900 bg-gradient-to-r from-[#F2C7C7] via-white to-[#D5F3D8] hover:opacity-95 shadow-md shadow-[#F2C7C7]/20 transition-all hover:scale-105"
                  >
                    ⚙️ Edit Your Profile
                  </Link>
                ) : connectionStatus === 'connected' ? (
                  <>
                    <button
                      onClick={() => navigate(`/chat/${user._id}`)}
                      className="px-5 py-2 rounded-full text-xs font-bold text-gray-900 bg-gradient-to-r from-[#F2C7C7] to-[#D5F3D8] hover:opacity-95 shadow-md transition-all hover:scale-105"
                    >
                      💬 Send Direct Message
                    </button>
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#D5F3D8]/15 text-[#D5F3D8] border border-[#D5F3D8]/30">
                      Connected Friends ✓
                    </span>
                  </>
                ) : connectionStatus === 'requested' ? (
                  <span className="px-4 py-2 rounded-full text-xs font-semibold bg-[#F2C7C7]/15 text-[#F2C7C7] border border-[#F2C7C7]/30">
                    Connection Request Pending ⏳
                  </span>
                ) : connectionStatus === 'pending_response' ? (
                  <Link
                    to="/dashboard"
                    className="px-5 py-2 rounded-full text-xs font-bold text-gray-900 bg-[#D5F3D8] shadow-md hover:opacity-90"
                  >
                    Respond to Request in Dashboard →
                  </Link>
                ) : (
                  <button
                    onClick={handleConnect}
                    disabled={connecting}
                    className="px-6 py-2 rounded-full text-xs font-bold text-gray-900 bg-gradient-to-r from-[#F2C7C7] via-white to-[#D5F3D8] hover:opacity-95 shadow-md shadow-[#F2C7C7]/20 transition-all hover:scale-105 disabled:opacity-50"
                  >
                    {connecting ? 'Sending…' : `+ Connect with ${user.name.split(' ')[0]}`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── User's Published Stories ── */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              Published Stories by {user.name} ({posts.length})
            </h2>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16 bg-white/[0.03] rounded-3xl border border-white/10 backdrop-blur-xl">
              <div className="text-4xl mb-2">📝</div>
              <h3 className="text-white font-bold text-base">No stories published yet</h3>
              <p className="text-gray-400 text-xs mt-1">
                {user.name} hasn't posted any stories yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div key={post._id || post.slug} className="h-full">
                  <PostCard {...post} />
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default UserProfile;
