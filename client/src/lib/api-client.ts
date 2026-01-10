const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  // Auth
  login: async (username: string, password?: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }
    return res.json();
  },

  logout: async () => {
    const res = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Logout failed');
    return res.json();
  },

  getUser: async () => {
    const res = await fetch(`${API_URL}/api/auth/user`, {
      credentials: 'include',
    });
    if (!res.ok) {
      if (res.status === 401) return null;
      throw new Error('Failed to get user');
    }
    return res.json();
  },

  // Roles
  getRoles: async () => {
    const res = await fetch(`${API_URL}/api/roles`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to get roles');
    return res.json();
  },

  createRole: async (data: { name: string; description?: string; permissions?: string[] }) => {
    const res = await fetch(`${API_URL}/api/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to create role');
    return res.json();
  },

  updateRole: async (id: number, data: { name?: string; description?: string; permissions?: string[] }) => {
    const res = await fetch(`${API_URL}/api/roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to update role');
    return res.json();
  },

  deleteRole: async (id: number) => {
    const res = await fetch(`${API_URL}/api/roles/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to delete role');
    return res.json();
  },

  claimRole: async (roleId: number) => {
    const res = await fetch(`${API_URL}/api/roles/${roleId}/claim`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to claim role');
    return res.json();
  },

  releaseRole: async (roleId: number) => {
    const res = await fetch(`${API_URL}/api/roles/${roleId}/release`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to release role');
    return res.json();
  },
};
