const BASE_URL = 'https://urbanaid-server.up.railway.app/api';
const CLIENT_URL = 'https://urbanaid-client.vercel.app';

const AuthService = {
  async login(email, password) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const responseJson = await response.json();

    if (response.ok) {
      localStorage.setItem('token', responseJson.data.token);
      localStorage.setItem('user', JSON.stringify(responseJson.data.user));
    }

    return responseJson;
  },

  async register(userData) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return response.json();
  },

  async createAdmin(adminData) {
    const response = await fetch(`${BASE_URL}/auth/admin/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      },
      body: JSON.stringify(adminData),
    });

    return this.handleResponse(response);
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('remember_token');
    window.history.replaceState({}, document.title, '/login');
    window.location.href = '/login';
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async handleResponse(response) {
    const responseJson = await response.json();

    if (response.status === 401 &&
        (responseJson.message?.toLowerCase().includes('expired') ||
         responseJson.message?.toLowerCase().includes('invalid token'))) {
      this.logout();
      throw new Error('Sesi anda telah berakhir, silakan login kembali');
    }

    return responseJson;
  },

  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();

    if (!token || !user) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;

      if (Date.now() >= expirationTime) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      this.logout();
      return false;
    }
  },

  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  },

  isSuperAdmin() {
    const user = this.getUser();
    return user && user.role === 'superadmin';
  },

  hasAdminAccess() {
    const user = this.getUser();
    return user && (user.role === 'admin' || user.role === 'superadmin');
  },

  getRedirectUrl() {
    const user = this.getUser();
    if (!user) return `${CLIENT_URL}/login`;

    if (user.role === 'superadmin') {
      return `${CLIENT_URL}/admin/management`;
    }

    return user.role === 'admin'
      ? `${CLIENT_URL}/admin`
      : `${CLIENT_URL}/pelaporan`;
  },

  async updateProfile(userId, data) {
    const user = this.getUser();
    const endpoint = user.role === 'admin'
      ? `${BASE_URL}/auth/admin/profile/${userId}`
      : `${BASE_URL}/auth/profile/${userId}`;

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      },
      body: JSON.stringify(data),
    });

    const responseJson = await this.handleResponse(response);

    if (response.ok) {
      const currentUser = this.getUser();
      const updatedUser = {
        ...currentUser,
        ...(user.role === 'admin' ? responseJson.data.admin : responseJson.data.user)
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return responseJson;
  },

  getHeaders() {
    if (!this.isAuthenticated()) {
      this.logout();
      throw new Error('Sesi anda telah berakhir, silakan login kembali');
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    };
  },

  async resetPassword(nama, email, newPassword) {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nama, email, newPassword }),
    });
  
    return response.json();
  }
};

export default AuthService;