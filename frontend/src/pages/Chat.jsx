import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

  const chatContainerRef = useRef(null);
  const isUserScrolledUpRef = useRef(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasNewMessagesBelow, setHasNewMessagesBelow] = useState(false);

  // Scroll only the chat message container (never whole window)
  const scrollToBottom = (smooth = true) => {
    const el = chatContainerRef.current;
    if (!el) return;
    if (smooth) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    } else {
      el.scrollTop = el.scrollHeight;
    }
    setIsAtBottom(true);
    isUserScrolledUpRef.current = false;
    setHasNewMessagesBelow(false);
  };

  const handleScroll = () => {
    const el = chatContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = distanceFromBottom < 80;
    setIsAtBottom(atBottom);
    isUserScrolledUpRef.current = !atBottom;
    if (atBottom) {
      setHasNewMessagesBelow(false);
    }
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

  // Load active chat messages without resetting scroll if unchanged
  const loadMessages = async (targetId) => {
    if (!targetId) return;
    try {
      const data = await chatService.getMessages(targetId);
      if (Array.isArray(data)) {
        setMessages((prev) => {
          // If no new messages, keep same reference to avoid useless re-renders
          if (
            prev.length === data.length &&
            prev[prev.length - 1]?._id === data[data.length - 1]?._id
          ) {
            return prev;
          }

          // If new messages arrived while user is reading older messages
          if (data.length > prev.length && isUserScrolledUpRef.current) {
            setHasNewMessagesBelow(true);
          }
          return data;
        });
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
      const conv = conversations.find((c) => c.friend?._id === friendId);
      if (conv?.friend) {
        setActiveFriend(conv.friend);
      } else {
        userService.getMyProfile().then((data) => {
          const match = data?.friends?.find((f) => f._id === friendId);
          if (match) setActiveFriend(match);
        });
      }
      // Reset scroll state on new chat
      isUserScrolledUpRef.current = false;
      setIsAtBottom(true);
      setHasNewMessagesBelow(false);
      setTimeout(() => scrollToBottom(false), 50);
    } else {
      setActiveFriend(null);
      setMessages([]);
    }
  }, [friendId, conversations]);

  // Real-time live polling: active messages every 3s, conversations every 15s
  useEffect(() => {
    if (!friendId) return;
    const msgInterval = setInterval(() => {
      loadMessages(friendId);
    }, 3000);
    const convInterval = setInterval(() => {
      loadConversations();
    }, 15000);
    return () => {
      clearInterval(msgInterval);
      clearInterval(convInterval);
    };
  }, [friendId]);

  // Only auto-scroll down if user was already at the bottom
  useEffect(() => {
    if (messages.length === 0) return;
    if (!isUserScrolledUpRef.current) {
      scrollToBottom(true);
    }
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
        // User just sent a message: scroll to bottom
        isUserScrolledUpRef.current = false;
        setTimeout(() => scrollToBottom(true), 50);
      }
    } catch (err) {
      alert(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="py-4 sm:py-6 min-h-[calc(100vh-140px)] flex flex-col">
      <Container>
        <div className="max-w-6xl mx-auto mb-4 flex items-center justify-between">
          <BackButton fallback="/dashboard" label="Dashboard" />
          <div className="text-xs text-[#D5F3D8] font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D5F3D8] animate-pulse" />
            Live Encrypted Chat
          </div>
        </div>

        {/* ── Main Chat Shell (Fully Responsive) ── */}
        <div className="max-w-6xl mx-auto w-full h-[600px] sm:h-[650px] bg-white/[0.04] backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl flex overflow-hidden">
          {/* ── Left Sidebar (Conversations List) ──
              On mobile: shown only when NO active friendId selected
              On tablet/desktop: always shown on the left */}
          <div
            className={`w-full sm:w-80 border-r border-white/10 flex flex-col bg-black/20 ${
              friendId ? 'hidden sm:flex' : 'flex'
            }`}
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>💬</span> Messages
              </h2>
              <Link
                to="/dashboard"
                className="text-[11px] text-[#F2C7C7] hover:underline"
              >
                + Find Writers
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-white/5">
              {loading ? (
                <div className="p-6 text-center text-gray-500 text-xs">Loading conversations…</div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs space-y-3">
                  <div className="text-3xl">🤝</div>
                  <p className="font-light">No chat connections yet.</p>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-[#F2C7C7] to-[#D5F3D8] text-gray-900 font-bold text-xs shadow-md"
                  >
                    Connect with Writers →
                  </button>
                </div>
              ) : (
                conversations.map(({ friend, lastMessage, unreadCount }) => (
                  <button
                    key={friend._id}
                    onClick={() => navigate(`/chat/${friend._id}`)}
                    className={`w-full p-4 flex items-center gap-3 text-left transition-all ${
                      friend._id === friendId
                        ? 'bg-[#F2C7C7]/15 border-l-4 border-[#F2C7C7]'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {friend.avatar ? (
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-11 h-11 rounded-2xl object-cover flex-shrink-0 border border-white/10 shadow"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#F2C7C7] to-[#D5F3D8] text-gray-900 flex items-center justify-center font-black text-sm flex-shrink-0 shadow">
                        {friend.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-white truncate">{friend.name}</span>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-[#F2C7C7] text-[10px] font-bold text-gray-900">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate font-light">
                        {lastMessage?.text || 'Start conversation…'}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ── Right Chat Pane ──
              On mobile: shown only when a friendId IS selected
              On tablet/desktop: always shown on the right */}
          <div
            className={`flex-1 flex flex-col bg-black/10 ${
              !friendId ? 'hidden sm:flex' : 'flex'
            }`}
          >
            {activeFriend ? (
              <>
                {/* Header */}
                <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                  <div className="flex items-center gap-3">
                    {/* Back to conversations button on mobile */}
                    <button
                      onClick={() => navigate('/chat')}
                      className="sm:hidden p-1.5 rounded-xl bg-white/5 text-gray-300 hover:text-white mr-1"
                      title="Back to conversations"
                    >
                      ←
                    </button>

                    {activeFriend.avatar ? (
                      <img
                        src={activeFriend.avatar}
                        alt={activeFriend.name}
                        className="w-10 h-10 rounded-2xl object-cover border border-white/10 shadow"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F2C7C7] to-[#D5F3D8] text-gray-900 flex items-center justify-center font-black text-sm shadow">
                        {activeFriend.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}

                    <div>
                      <Link
                        to={`/profile/${activeFriend._id}`}
                        className="text-sm font-bold text-white hover:text-[#F2C7C7] transition-colors block"
                        title="View Profile"
                      >
                        {activeFriend.name}
                      </Link>
                      {activeFriend.username && (
                        <p className="text-[11px] text-[#D5F3D8] font-mono">@{activeFriend.username}</p>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/profile/${activeFriend._id}`}
                    className="text-xs text-[#D5F3D8] hover:underline font-semibold hidden sm:inline"
                  >
                    View Profile ↗
                  </Link>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 relative flex flex-col min-h-0 overflow-hidden">
                  <div
                    ref={chatContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
                  >
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
                              className={`max-w-[85%] sm:max-w-md md:max-w-lg px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                isMe
                                  ? 'bg-gradient-to-r from-[#F2C7C7] to-[#D5F3D8] text-gray-900 font-medium rounded-br-none shadow-md'
                                  : 'bg-white/10 backdrop-blur-md text-gray-100 rounded-bl-none border border-white/10'
                              }`}
                            >
                              {msg.text}
                            </div>
                            <span className="text-[10px] text-gray-500 mt-1 px-1 font-mono">
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Floating Jump to Bottom Button */}
                  {!isAtBottom && (
                    <button
                      type="button"
                      onClick={() => scrollToBottom(true)}
                      className="absolute bottom-3 right-4 z-10 py-1.5 px-3 rounded-full bg-gray-900/90 hover:bg-gray-800 text-white border border-white/20 shadow-2xl flex items-center gap-1.5 text-xs font-medium transition-all backdrop-blur-md cursor-pointer hover:scale-105"
                      title="Scroll to latest messages"
                    >
                      <span>↓ Latest</span>
                      {hasNewMessagesBelow && (
                        <span className="w-2 h-2 rounded-full bg-[#F2C7C7] animate-ping" />
                      )}
                    </button>
                  )}
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
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F2C7C7]"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || sending}
                    className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-bold text-gray-900 bg-gradient-to-r from-[#F2C7C7] via-white to-[#D5F3D8] hover:opacity-90 transition-all shadow-md disabled:opacity-40 whitespace-nowrap text-xs sm:text-sm"
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
                <div className="w-16 h-16 rounded-3xl bg-[#F2C7C7]/10 border border-[#F2C7C7]/20 flex items-center justify-center text-3xl mb-4">
                  💬
                </div>
                <h3 className="text-base font-bold text-white mb-1">Your Direct Messages</h3>
                <p className="text-xs text-gray-400 max-w-xs font-light">
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
