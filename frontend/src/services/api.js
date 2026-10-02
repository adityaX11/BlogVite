/* ─────────────────────────────────────────────────────────
   Base API service — handles JWT, auto-refresh, and fetch
   ───────────────────────────────────────────────────────── */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  #accessToken = localStorage.getItem('accessToken') || null;

  /* ── Token management ─────────────────────────────────── */
  setToken(token) {
    this.#accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  clearToken() {
    this.#accessToken = null;
    localStorage.removeItem('accessToken');
  }

  getToken() {
    return this.#accessToken;
  }

  /* ── Core request method ──────────────────────────────── */
  async request(endpoint, options = {}, retry = true) {
    const headers = {
      ...(options.headers || {}),
    };

    // Only set Content-Type for non-FormData bodies
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.#accessToken) {
      headers['Authorization'] = `Bearer ${this.#accessToken}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',   // send httpOnly refreshToken cookie
      headers,
    });

    // Auto-refresh on token expired
    if (res.status === 401 && retry && endpoint !== '/auth/refresh') {
      const refreshed = await this.#refreshAccessToken();
      if (refreshed) {
        return this.request(endpoint, options, false); // retry once
      }
      // Refresh failed — user needs to log in again
      this.clearToken();
      window.dispatchEvent(new CustomEvent('auth:expired'));
      return { error: 'Session expired. Please log in again.', status: 401 };
    }

    // Handle empty responses
    const text = await res.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return { error: 'Invalid server response', status: res.status };
    }
  }

  /* ── Refresh access token silently ───────────────────── */
  async #refreshAccessToken() {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        const { accessToken } = await res.json();
        this.setToken(accessToken);
        return true;
      }
    } catch { /* network error */ }
    return false;
  }

  /* ── Convenience methods ──────────────────────────────── */
  get(endpoint, options)  { return this.request(endpoint, { ...options, method: 'GET' }); }
  post(endpoint, body, options) {
    const isForm = body instanceof FormData;
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: isForm ? body : JSON.stringify(body),
    });
  }
  put(endpoint, body, options) {
    const isForm = body instanceof FormData;
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: isForm ? body : JSON.stringify(body),
    });
  }
  del(endpoint, options) { return this.request(endpoint, { ...options, method: 'DELETE' }); }
}

export const apiService = new ApiService();
export const BASE_API_URL = BASE_URL;
