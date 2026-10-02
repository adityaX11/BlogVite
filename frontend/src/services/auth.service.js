import { apiService, BASE_API_URL } from './api.js';

export const authService = {
  /* ── Local JWT ──────────────────────────────────────── */
  signup: (data) => apiService.post('/auth/signup', data),
  login:  (data) => apiService.post('/auth/login',  data),
  logout: ()     => apiService.post('/auth/logout',  {}),
  refresh: ()    => apiService.post('/auth/refresh', {}),
  getMe:  ()     => apiService.get('/auth/me'),
  updateProfile: (data) => apiService.put('/auth/profile', data),

  /* ── OAuth — redirect browser to backend ───────────── */
  loginWithGoogle:   () => { window.location.href = `${BASE_API_URL}/auth/google`; },
  loginWithFacebook: () => { window.location.href = `${BASE_API_URL}/auth/facebook`; },
};
