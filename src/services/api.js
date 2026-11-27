// ─── Centralised API helper for StyleAura Admin ────────────────────────────
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'https://demo-backend-re6k.onrender.com'
).replace(/\/$/, '');

/* ── Token helpers ───────────────────────────────────────────────────────── */
export const getAuthToken = () => {
  try {
    return localStorage.getItem('styleaura_auth_token');
  } catch {
    return null;
  }
};

export const setAuthToken = (token) => {
  try {
    if (token) localStorage.setItem('styleaura_auth_token', token);
    else localStorage.removeItem('styleaura_auth_token');
  } catch (e) {
    console.error('Failed to update auth token', e);
  }
};

/* ── Generic request wrapper (auto-attaches Bearer token) ────────────── */
export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      `Request failed with status ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }

  return data;
}

/* ── Product API ─────────────────────────────────────────────────────── */
export const productsApi = {
  getAll: () => apiRequest('/api/products'),

  create: (product) =>
    apiRequest('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }),

  update: (id, product) =>
    apiRequest(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    }),

  delete: (id) =>
    apiRequest(`/api/products/${id}`, { method: 'DELETE' }),
};

/* ── Category API ────────────────────────────────────────────────────── */
export const categoriesApi = {
  getAll: () => apiRequest('/api/categories'),

  create: (category) =>
    apiRequest('/api/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    }),

  update: (id, category) =>
    apiRequest(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    }),

  delete: (id) =>
    apiRequest(`/api/categories/${id}`, { method: 'DELETE' }),
};

/* ── Orders API ──────────────────────────────────────────────────────── */
export const ordersApi = {
  getAll: () => apiRequest('/api/orders'),

  adminGetAll: () => apiRequest('/api/admin/orders'),

  updateStatus: (id, status) =>
    apiRequest(`/api/admin/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

/* ── Users API (admin) ───────────────────────────────────────────────── */
export const usersApi = {
  adminGetAll: () => apiRequest('/api/admin/users'),
};

/* ── Auth API ────────────────────────────────────────────────────────── */
export const authApi = {
  login: (email, password) =>
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), password }),
    }),
};
