import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/user.service';
import { postService } from '../services/post.service';
import { authService } from '../services/auth.service';
import { login as updateReduxUser } from '../store/authSlice';
import Container from '../components/container/container';
import BackButton from '../components/BackButton';

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
  const [copiedId, setCopiedId] = useState(false);

  // Profile Edit form state
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');

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
        setEditUsername(data.user?.username || '');
        setEditBio(data.user?.bio || '');
        setAvatarPreview(data.user?.avatar || '');
        setAvatarFile(null);
        setRemoveAvatar(false);
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

  const handleCopyUserId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setRemoveAvatar(false);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview('');
    setRemoveAvatar(true);
  };

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
    setProfileError('');
    setIsUpdatingProfile(true);
    try {
      const formData = new FormData();
      formData.append('name', editName.trim());
      formData.append('username', editUsername.toLowerCase().trim());
      formData.append('bio', editBio.trim());

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      } else if (removeAvatar) {
        formData.append('removeAvatar', 'true');
      }

      const res = await authService.updateProfile(formData);
      if (res?.user) {
        dispatch(updateReduxUser({ userData: res.user }));
        setActionMsg('Profile & picture updated successfully!');
        loadDashboard();
        setTimeout(() => setActionMsg(''), 3000);
      }
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#F2C7C7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = profileData?.user || currentUser;
  const posts = profileData?.posts || [];
  const friends = profileData?.friends || [];
  const friendRequests = profileData?.friendRequests || [];

  return (
    <div className="py-6 sm:py-10 min-h-screen">
      <Container>
        {/* ── Top Bar ── */}
        <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
          <BackButton fallback="/" label="Home" />
          {actionMsg && (
            <div className="px-4 py-1.5 rounded-full bg-[#D5F3D8]/20 text-[#D5F3D8] border border-[#D5F3D8]/30 text-xs font-semibold animate-fade-in">
              {actionMsg}
            </div>
          )}
        </div>

        {/* ── Profile Banner Card ── */}
        <div className="max-w-6xl mx-auto bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-5 sm:p-8 border border-white/10 shadow-2xl mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* User Avatar */}
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white/20 shadow-lg shadow-[#F2C7C7]/20"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-[#F2C7C7] via-white to-[#D5F3D8] flex items-center justify-center text-4xl sm:text-5xl font-black text-gray-900 shadow-lg shadow-[#F2C7C7]/20">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#D5F3D8] border-2 border-black rounded-full shadow" />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {user?.name}
                </h1>
                {user?.username && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#F2C7C7]/15 text-[#F2C7C7] border border-[#F2C7C7]/30">
                    @{user.username}
                  </span>
                )}
                {/* Public profile link */}
                <Link
                  to={`/profile/${user?.username || user?._id || user?.id}`}
                  className="text-xs text-[#D5F3D8] hover:underline font-semibold ml-1"
                >
                  View Public Profile ↗
                </Link>
              </div>

              {/* User ID & Copy */}
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-gray-400">
                <span className="font-mono text-[11px] bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
                  ID: {user?.id || user?._id}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyUserId(user?.id || user?._id)}
                  className="text-[10px] text-[#D5F3D8] hover:underline font-semibold"
                >
                  {copiedId ? 'Copied! ✓' : 'Copy ID'}
                </button>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 max-w-xl font-light">
                {user?.bio || 'No bio yet. Tell other writers about yourself in Settings!'}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-3">
              <div className="text-center px-4 py-3 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-xl sm:text-2xl font-black text-[#F2C7C7]">{posts.length}</div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400">Articles</div>
              </div>
              <div className="text-center px-4 py-3 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-xl sm:text-2xl font-black text-[#D5F3D8]">{friends.length}</div>
                <div className="text-[10px] uppercase tracking-wider text-gray-400">Friends</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Navigation Tabs (Fully Responsive) ── */}
        <div className="max-w-6xl mx-auto flex items-center gap-2 mb-8 border-b border-white/10 pb-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'posts'
                ? 'bg-gradient-to-r from-[#F2C7C7] to-[#D5F3D8] text-gray-900 shadow-md scale-105'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            📚 My Articles ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all relative ${
              activeTab === 'friends'
                ? 'bg-gradient-to-r from-[#F2C7C7] to-[#D5F3D8] text-gray-900 shadow-md scale-105'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            👥 Friends & Chat ({friends.length})
            {friendRequests.filter((r) => r.status === 'pending').length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[#F2C7C7] text-gray-900 text-[10px] font-bold">
                {friendRequests.filter((r) => r.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-[#F2C7C7] to-[#D5F3D8] text-gray-900 shadow-md scale-105'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            ⚙️ Edit Profile & Picture
          </button>
        </div>

        {/* ── TAB 1: My Articles ── */}
        {activeTab === 'posts' && (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">Your Published Stories</h2>
              <Link to="/add-post">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-gray-900 bg-gradient-to-r from-[#F2C7C7] via-white to-[#D5F3D8] hover:opacity-95 shadow-md">
                  <span>✍️</span>
                  <span>Write Article</span>
                </span>
              </Link>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-16 bg-white/[0.03] rounded-3xl border border-white/10 backdrop-blur-xl">
                <div className="text-4xl mb-3">✍️</div>
                <h3 className="text-white font-bold text-lg">No stories published yet</h3>
                <p className="text-gray-400 text-xs mt-1 mb-4">
                  Share your knowledge or quick thoughts with the community! Only title is needed!
                </p>
                <Link to="/add-post">
                  <span className="inline-flex items-center gap-1 px-5 py-2.5 rounded-full text-xs font-bold text-gray-900 bg-gradient-to-r from-[#F2C7C7] to-[#D5F3D8]">
                    Write Your First Post
                  </span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <div
                    key={post._id || post.slug}
                    className="flex flex-col bg-white/[0.04] rounded-3xl border border-white/10 p-5 backdrop-blur-xl hover:border-[#F2C7C7]/40 transition-all shadow-lg"
                  >
                    {post.featuredImage?.url && (
                      <div className="w-full h-36 rounded-2xl overflow-hidden mb-3 bg-black/40">
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
                    <p className="text-gray-400 text-xs line-clamp-2 mb-4 font-light">
                      {post.excerpt || 'No description'}
                    </p>

                    <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-gray-500">👁 {post.views || 0} views</span>
                      <div className="flex gap-2">
                        <Link to={`/post/${post.slug}`}>
                          <button className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 text-xs">
                            View
                          </button>
                        </Link>
                        <Link to={`/edit-post/${post.slug}`}>
                          <button className="px-2.5 py-1 rounded-xl bg-[#D5F3D8]/20 hover:bg-[#D5F3D8]/30 text-[#D5F3D8] text-xs font-semibold">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post.slug)}
                          className="px-2.5 py-1 rounded-xl bg-red-600/30 hover:bg-red-600 text-red-200 text-xs"
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
            {friendRequests.filter((r) => r.status === 'pending').length > 0 && (
              <div className="bg-[#F2C7C7]/10 border border-[#F2C7C7]/30 rounded-3xl p-5 sm:p-6">
                <h3 className="text-base font-bold text-[#F2C7C7] mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F2C7C7] animate-ping" />
                  Connection Requests Pending Your Approval
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {friendRequests
                    .filter((r) => r.status === 'pending')
                    .map((req) => (
                      <div
                        key={req._id}
                        className="bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-3"
                      >
                        <Link
                          to={`/profile/${req.from?._id}`}
                          className="flex items-center gap-3 truncate group"
                        >
                          {req.from?.avatar ? (
                            <img
                              src={req.from.avatar}
                              alt={req.from.name}
                              className="w-10 h-10 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F2C7C7] to-[#D5F3D8] text-gray-900 flex items-center justify-center font-bold text-sm">
                              {req.from?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                          )}
                          <div className="truncate">
                            <div className="text-sm font-bold text-white group-hover:text-[#F2C7C7] truncate">
                              {req.from?.name}
                            </div>
                            {req.from?.username && (
                              <div className="text-[10px] text-[#D5F3D8] font-mono truncate">
                                @{req.from.username}
                              </div>
                            )}
                          </div>
                        </Link>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => handleRespondRequest(req._id, 'accept')}
                            className="px-2.5 py-1 bg-[#D5F3D8] text-gray-900 text-xs font-bold rounded-lg shadow-sm"
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
                  <button className="text-xs font-bold text-[#D5F3D8] hover:underline flex items-center gap-1">
                    💬 Open Real-time Chat →
                  </button>
                </Link>
              </div>

              {friends.length === 0 ? (
                <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/10 text-gray-400 text-sm">
                  You haven't connected with anyone yet. Search by username or user ID below! 👇
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {friends.map((friend) => (
                    <div
                      key={friend._id}
                      className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-xl flex items-center justify-between gap-3 hover:border-[#F2C7C7]/30 transition-all"
                    >
                      <Link
                        to={`/profile/${friend._id}`}
                        className="flex items-center gap-3 truncate group"
                      >
                        {friend.avatar ? (
                          <img
                            src={friend.avatar}
                            alt={friend.name}
                            className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F2C7C7] to-[#D5F3D8] text-gray-900 flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {friend.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                        )}
                        <div className="truncate">
                          <div className="text-sm font-bold text-white group-hover:text-[#F2C7C7] truncate">
                            {friend.name}
                          </div>
                          {friend.username && (
                            <div className="text-xs text-[#D5F3D8] font-mono truncate">
                              @{friend.username}
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => navigate(`/chat/${friend._id}`)}
                          className="px-3 py-1.5 bg-gradient-to-r from-[#F2C7C7] to-[#D5F3D8] text-gray-900 font-bold text-xs rounded-xl shadow-md transition-all hover:scale-105"
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

            {/* Discover People / Search by Username or User ID */}
            <div className="pt-4 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-2">Discover Writers</h3>
              <p className="text-xs text-gray-400 mb-4 font-light">
                Search directly by <strong className="text-[#F2C7C7]">@username</strong> or <strong className="text-[#D5F3D8]">User ID</strong> to view their profile and connect!
              </p>

              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Enter username (e.g. aditya_102) or 24-character User ID..."
                  value={searchUser}
                  onChange={(e) => {
                    setSearchUser(e.target.value);
                    loadDiscoverUsers(e.target.value);
                  }}
                  className="w-full sm:w-96 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F2C7C7]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {discoverList.map((target) => (
                  <div
                    key={target._id}
                    className="bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-3 hover:border-white/20 transition-all"
                  >
                    <Link
                      to={`/profile/${target._id}`}
                      className="flex items-center gap-3 truncate group"
                      title="View Profile"
                    >
                      {target.avatar ? (
                        <img
                          src={target.avatar}
                          alt={target.name}
                          className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {target.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className="truncate">
                        <div className="text-sm font-bold text-white group-hover:text-[#F2C7C7] truncate">
                          {target.name}
                        </div>
                        {target.username && (
                          <div className="text-xs text-[#D5F3D8] font-mono truncate">
                            @{target.username}
                          </div>
                        )}
                        <div className="text-[10px] text-gray-500 font-mono truncate">
                          ID: {target._id}
                        </div>
                      </div>
                    </Link>

                    {target.connectionStatus === 'connected' ? (
                      <span className="text-xs text-[#D5F3D8] font-semibold px-2 py-1 bg-[#D5F3D8]/10 rounded-lg whitespace-nowrap">
                        Friends ✓
                      </span>
                    ) : target.connectionStatus === 'requested' ? (
                      <span className="text-xs text-[#F2C7C7] font-semibold px-2 py-1 bg-[#F2C7C7]/10 rounded-lg whitespace-nowrap">
                        Requested
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSendConnect(target._id)}
                        className="px-3 py-1.5 bg-gradient-to-r from-[#F2C7C7] to-[#D5F3D8] text-gray-900 font-bold text-xs rounded-xl shadow-md transition-all hover:scale-105 flex-shrink-0"
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

        {/* ── TAB 3: Edit Profile (Avatar Picture, Username & Bio) ── */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2">Customize Your Profile</h2>
            <p className="text-xs text-gray-400 mb-6 font-light">
              Upload a profile photo and choose a unique username so writers recognize your articles.
            </p>

            {profileError && (
              <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {profileError}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Profile Picture Upload Section */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="relative">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#F2C7C7] to-[#D5F3D8] text-gray-900 flex items-center justify-center font-black text-2xl shadow-md">
                      {editName?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <label className="block text-xs font-bold text-white uppercase tracking-wider">
                    Profile Picture (Avatar)
                  </label>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <label className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-gray-900 bg-gradient-to-r from-[#F2C7C7] to-[#D5F3D8] hover:opacity-90 cursor-pointer shadow-sm">
                      📷 Upload Photo
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-300 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    JPG, PNG, WebP up to 8MB. Auto-optimized by Cloudinary.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#F2C7C7]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Unique Username <span className="text-[#F2C7C7] text-xs font-semibold">(Used for search & profile URL)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-400 font-mono">@</span>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="aditya_11"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-8 pr-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#F2C7C7]"
                    minLength={3}
                    maxLength={30}
                    required
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Only lowercase letters, numbers, and underscores (3-30 chars).
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Email Address (Private)
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-2.5 text-gray-500 cursor-not-allowed text-sm"
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
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#F2C7C7] text-sm font-light"
                  maxLength={300}
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full py-3.5 rounded-2xl font-bold text-gray-900 bg-gradient-to-r from-[#F2C7C7] via-white to-[#D5F3D8] hover:opacity-95 transition-all shadow-lg shadow-[#F2C7C7]/20 disabled:opacity-50"
              >
                {isUpdatingProfile ? 'Saving Changes to Cloudinary…' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        )}
      </Container>
    </div>
  );
}

export default Dashboard;
