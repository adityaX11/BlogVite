import { apiService } from './api';

export const userService = {
  getMyProfile: () => apiService.get('/users/profile'),
  discoverUsers: (search = '') => apiService.get(`/users/discover${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  sendConnectRequest: (targetUserId) => apiService.post(`/users/connect/${targetUserId}`, {}),
  respondRequest: (requestId, action) => apiService.put(`/users/request/${requestId}`, { action }),
  unfriend: (friendId) => apiService.del(`/users/unfriend/${friendId}`),
};
