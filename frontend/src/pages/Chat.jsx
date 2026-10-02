import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { chatService } from '../services/chat.service';
import { userService } from '../services/user.service';
import Container from '../components/container/container';
import BackButton from '../components/BackButton';

function Chat() {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.userData);

  const [conversations, setConversations] = useState([]);
  const [activeFriend, setActiveFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load conversations list
  const loadConversations = async () => {
    try {
      const data = await chatService.getConversations();
      if (Array.isArray(data)) {
        setConversations(data);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  };

  // Load active chat messages
  const loadMessages = async (targetId) => {
    if (!targetId) return;
    try {
      const data = await chatService.getMessages(targetId);
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadConversations();
      setLoading(false);
    };
    init();
  }, []);

  // When friendId changes in route
  useEffect(() => {
    if (friendId) {
      loadMessages(friendId);
      // Find friend info
      const conv = conversations.find((c) => c.friend?._id === friendId);
      if (conv?.friend) {
        setActiveFriend(conv.friend);
      } else {
        // Fetch user profile if not in conversations yet
        userService.getMyProfile().then((data) => {
          const match = data?.friends?.find((f) => f._id === friendId);
          if (match) setActiveFriend(match);
        });
      }
    } else {
      setActiveFriend(null);
      setMessages([]);
    }
  }, [friendId, conversations]);

  // Real-time live polling every 2.5 seconds
  useEffect(() => {
    if (!friendId) return;
    const interval = setInterval(() => {
      loadMessages(friendId);
      loadConversations();
    }, 2500);
    return () => clearInterval(interval);
  }, [friendId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !friendId || sending) return;

    const text = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const newMsg = await chatService.sendMessage(friendId, text);
      if (newMsg && !newMsg.message) {
        setMessages((prev) => [...prev, newMsg]);
        loadConversations();
      }
    } catch (err) {
      alert(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="py-6 min-h-[calc(100vh-140px)] flex flex-col">
      <Container>
        <div className="max-w-6xl mx-auto mb-4 flex items-center justify-between">
          <BackButton fallback="/dashboard" label="Back to Dashboard" />
          <div className="text-xs text-indigo-300 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Encrypted Chat
          </div>
        </div>

        {/* ── Main Chat Container ── */}
        <div className="max-w-6xl mx-auto w-full h-[650px] bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl flex overflow-hidden">
          {/* ── Left Sidebar (Conversations) ── */}
          <div className="w-full sm:w-80 border-r border-white/10 flex flex-col bg-black/20">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>💬</span> Messages
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-white/5">
              {loading ? (
                <div className="p-6 text-center text-gray-500 text-xs">Loading conversations…</div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs space-y-2">
                  <p>No connections yet.</p>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="text-indigo-400 hover:underline text-xs"
                  >
                    Find friends in Dashboard →
                  </button>
                </div>
              ) : (
                conversations.map(({ friend, lastMessage, unreadCount }) => (
                  <button
                    key={friend._id}
                    onClick={() => navigate(`/chat/${friend._id}`)}
                    className={`w-full p-4 flex items-center gap-3 text-left transition-all ${
                      friend._id === friendId
                        ? 'bg-indigo-600/20 border-l-4 border-indigo-500'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                      {friend.name?.[0]?.toUpperCase() || 'U'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-white truncate">{friend.name}</span>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-pink-500 text-[10px] font-bold text-white">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate">
                        {lastMessage?.text || 'Start conversation…'}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ── Right Chat Pane ── */}
          <div className="flex-1 flex flex-col bg-black/10">
            {activeFriend ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-white text-sm">
                      {activeFriend.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{activeFriend.name}</h3>
                      <p className="text-[10px] text-gray-400">{activeFriend.email}</p>
                    </div>
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 text-xs">
                      <div className="text-4xl mb-2">👋</div>
                      <p>Say hello to {activeFriend.name}!</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender?._id === currentUser?.id || msg.sender === currentUser?.id;
                      return (
                        <div
                          key={msg._id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-md sm:max-w-lg px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              isMe
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none shadow-md'
                                : 'bg-white/10 backdrop-blur-md text-gray-100 rounded-bl-none border border-white/10'
                            }`}
                          >
                            {msg.text}
                          </div>
                          <span className="text-[10px] text-gray-500 mt-1 px-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Box */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 sm:p-4 border-t border-white/10 bg-white/5 flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder={`Message ${activeFriend.name}…`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || sending}
                    className="px-5 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-md disabled:opacity-40"
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
                <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-3xl mb-4">
                  💬
                </div>
                <h3 className="text-base font-bold text-white mb-1">Your Direct Messages</h3>
                <p className="text-xs text-gray-400 max-w-xs">
                  Select a connected friend from the left sidebar to start a real-time conversation.
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Chat;
