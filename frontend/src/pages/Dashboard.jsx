import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/user.service';
import { postService } from '../services/post.service';
import { authService } from '../services/auth.service';
import { login as updateReduxUser } from '../store/authSlice';
import Container from '../components/container/container';
import BackButton from '../components/BackButton';
import Button from '../components/Button';

function Dashboard() {
  const currentUser = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'friends' | 'profile'
  const [profileData, setProfileData] = useState(null);
  const [discoverList, setDiscoverList] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  // Profile Edit form state
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await userService.getMyProfile();
      if (data) {
        setProfileData(data);
        setEditName(data.user?.name || '');
        setEditBio(data.user?.bio || '');
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDiscoverUsers = async (query = '') => {
    try {
      const users = await userService.discoverUsers(query);
      setDiscoverList(users || []);
    } catch (err) {
      console.error('Failed to discover users:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'friends') {
      loadDiscoverUsers(searchUser);
    }
  }, [activeTab]);

  const handleSendConnect = async (targetId) => {
    try {
      await userService.sendConnectRequest(targetId);
      setActionMsg('Connection request sent!');
      loadDiscoverUsers(searchUser);
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to send request');
    }
  };

  const handleRespondRequest = async (requestId, action) => {
    try {
      await userService.respondRequest(requestId, action);
      loadDashboard();
    } catch (err) {
      alert(err.message || 'Failed to update request');
    }
  };

  const handleUnfriend = async (friendId) => {
    if (!window.confirm('Are you sure you want to remove this connection?')) return;
    try {
      await userService.unfriend(friendId);
      loadDashboard();
    } catch (err) {
      alert(err.message || 'Failed to remove friend');
    }
  };

  const handleDeletePost = async (slug) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await postService.deletePost(slug);
      loadDashboard();
    } catch (err) {
      alert(err.message || 'Failed to delete post');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const res = await authService.updateProfile({ name: editName, bio: editBio });
      if (res?.user) {
        dispatch(updateReduxUser({ userData: res.user }));
        setActionMsg('Profile updated successfully!');
        loadDashboard();
        setTimeout(() => setActionMsg(''), 3000);
      }
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = profileData?.user || currentUser;
  const posts = profileData?.posts || [];
  const friends = profileData?.friends || [];
  const friendRequests = profileData?.friendRequests || [];

  return (
    <div className="py-10 min-h-screen">
      <Container>
        {/* ── Top Bar ── */}
        <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
          <BackButton fallback="/" label="Home" />
          {actionMsg && (
            <div className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold animate-fade-in">
              {actionMsg}
            </div>
          )}
        </div>

        {/* ── Profile Banner Card ── */}
        <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-4xl sm:text-5xl font-extrabold text-white shadow-lg shadow-indigo-900/40">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-black rounded-full" />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {user?.name}
              </h1>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
                {user?.bio || 'No bio yet. Tell the community about yourself in settings!'}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-3">
              <div className="text-center px-4 py-3 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-xl sm:text-2xl font-extrabold text-indigo-300">{posts.length}</div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400">Articles</div>
              </div>
              <div className="text-center px-4 py-3 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-xl sm:text-2xl font-extrabold text-purple-300">{friends.length}</div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400">Friends</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Navigation Tabs ── */}
        <div className="max-w-6xl mx-auto flex items-center gap-2 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'posts'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/40'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            📚 My Articles ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all relative ${
              activeTab === 'friends'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/40'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            👥 Friends & Chat ({friends.length})
            {friendRequests.filter(r => r.status === 'pending').length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-pink-500 text-[10px] text-white font-bold">
                {friendRequests.filter(r => r.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/40'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            ⚙️ Edit Profile
          </button>
        </div>

        {/* ── TAB 1: My Articles ── */}
        {activeTab === 'posts' && (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">Your Published Stories</h2>
              <Link to="/add-post">
                <Button bgColor="bg-indigo-600 hover:bg-indigo-500 text-xs py-2 px-4">
                  + Write Story
                </Button>
              </Link>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl">
                <div className="text-4xl mb-3">✍️</div>
                <h3 className="text-white font-bold text-lg">No stories published yet</h3>
                <p className="text-gray-400 text-xs mt-1 mb-4">Share your knowledge or creative thoughts with the community!</p>
                <Link to="/add-post">
                  <Button bgColor="bg-gradient-to-r from-indigo-600 to-purple-600 text-xs py-2 px-5">
                    Write Your First Post
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <div
                    key={post._id || post.slug}
                    className="flex flex-col bg-white/5 rounded-2xl border border-white/10 p-5 backdrop-blur-xl hover:border-indigo-400/40 transition-all shadow-lg"
                  >
                    {post.featuredImage?.url && (
                      <div className="w-full h-36 rounded-xl overflow-hidden mb-3 bg-black/40">
                        <img
                          src={post.featuredImage.url}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-bold text-white text-base mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-2 mb-4">
                      {post.excerpt || 'No description'}
                    </p>

                    <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-gray-500">👁 {post.views || 0} views</span>
                      <div className="flex gap-2">
                        <Link to={`/post/${post.slug}`}>
                          <button className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-xs">
                            View
                          </button>
                        </Link>
                        <Link to={`/edit-post/${post.slug}`}>
                          <button className="px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post.slug)}
                          className="px-2.5 py-1 rounded-lg bg-red-600/60 hover:bg-red-600 text-white text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: Friends & Social Connections ── */}
        {activeTab === 'friends' && (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Incoming Requests */}
            {friendRequests.filter(r => r.status === 'pending').length > 0 && (
              <div className="bg-pink-950/20 border border-pink-500/30 rounded-3xl p-6">
                <h3 className="text-base font-bold text-pink-300 mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-ping" />
                  Connection Requests Pending Your Approval
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {friendRequests
                    .filter(r => r.status === 'pending')
                    .map((req) => (
                      <div
                        key={req._id}
                        className="bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-white text-sm">
                            {req.from?.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{req.from?.name}</div>
                            <div className="text-[10px] text-gray-400">{req.from?.email}</div>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleRespondRequest(req._id, 'accept')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRespondRequest(req._id, 'reject')}
                            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-gray-300 text-xs rounded-lg"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Friends List */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Connected Friends ({friends.length})</h3>
                <Link to="/chat">
                  <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    💬 Open Real-time Chat →
                  </button>
                </Link>
              </div>

              {friends.length === 0 ? (
                <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/10 text-gray-400 text-sm">
                  You haven't connected with anyone yet. Search & connect below! 👇
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {friends.map((friend) => (
                    <div
                      key={friend._id}
                      className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-xl flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                          {friend.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="truncate">
                          <div className="text-sm font-bold text-white truncate">{friend.name}</div>
                          <div className="text-xs text-gray-400 truncate">{friend.email}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => navigate(`/chat/${friend._id}`)}
                          className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all"
                        >
                          Chat
                        </button>
                        <button
                          onClick={() => handleUnfriend(friend._id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-xs"
                          title="Remove connection"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Discover People / Search Users */}
            <div className="pt-4 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-3">Discover & Connect With Other Writers</h3>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search by name or email to add friends..."
                  value={searchUser}
                  onChange={(e) => {
                    setSearchUser(e.target.value);
                    loadDiscoverUsers(e.target.value);
                  }}
                  className="w-full sm:w-96 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {discoverList.map((target) => (
                  <div
                    key={target._id}
                    className="bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-10 h-10 rounded-xl bg-indigo-900/60 flex items-center justify-center font-bold text-indigo-300 text-sm flex-shrink-0">
                        {target.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-bold text-white truncate">{target.name}</div>
                        <div className="text-[11px] text-gray-400 truncate">{target.email}</div>
                      </div>
                    </div>

                    {target.connectionStatus === 'connected' ? (
                      <span className="text-xs text-emerald-400 font-semibold px-2 py-1 bg-emerald-500/10 rounded-lg">
                        Friends ✓
                      </span>
                    ) : target.connectionStatus === 'requested' ? (
                      <span className="text-xs text-amber-400 font-semibold px-2 py-1 bg-amber-500/10 rounded-lg">
                        Requested
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSendConnect(target._id)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex-shrink-0"
                      >
                        + Connect
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: Edit Profile ── */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6">Customize Your Profile</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-gray-500 cursor-not-allowed text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Bio / About You
                </label>
                <textarea
                  rows="4"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Share a short bio with your readers..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  maxLength={300}
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-900/40 disabled:opacity-50"
              >
                {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        )}
      </Container>
    </div>
  );
}

export default Dashboard;
