import { apiService } from './api';

export const chatService = {
  getConversations: () => apiService.get('/chat/conversations'),
  getMessages: (friendId) => apiService.get(`/chat/${friendId}`),
  sendMessage: (recipientId, text) => apiService.post('/chat/send', { recipientId, text }),
};
