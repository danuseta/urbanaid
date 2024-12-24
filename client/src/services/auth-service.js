import { config } from '../config';
const BASE_URL = 'https://urbanaid-server.up.railway.app/api';
const CLIENT_URL = 'https://urbanaid-client.vercel.app';

const AuthService = {
  async login(email, password) {
    try {
      const url = `${BASE_URL}/auth/login`;
      console.log('Full request details:', {
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { email, password }
      });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));
      
      const responseJson = await response.json();
      console.log('Response data:', responseJson);
      
      return responseJson;
    } catch (error) {
      console.error('Network or parsing error:', error);
      throw error;
    }
  },

  async register(userData) {
    try {
      const url = `${BASE_URL}/auth/register`;
      console.log('Register URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      return await response.json();
    } catch (error) {
      console.error('Register error:', error);
      throw new Error('Terjadi kesalahan saat registrasi. Silakan coba lagi.');
    }
  },

  async createAdmin(adminData) {
    try {
      const url = `${BASE_URL}/auth/admin/create`;
      console.log('Create admin URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(adminData),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Create admin error:', error);
      throw new Error('Terjadi kesalahan saat membuat admin. Silakan coba lagi.');
    }
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
    try {
      const responseJson = await response.json();

      if (response.status === 401 &&
          (responseJson.message?.toLowerCase().includes('expired') ||
           responseJson.message?.toLowerCase().includes('invalid token'))) {
        this.logout();
        throw new Error('Sesi anda telah berakhir, silakan login kembali');
      }

      return responseJson;
    } catch (error) {
      console.error('Handle response error:', error);
      throw error;
    }
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
    if (!user) return '/login';

    if (user.role === 'superadmin') {
      return '/admin/management';
    }

    return user.role === 'admin' ? '/admin' : '/pelaporan';
  },

  async updateProfile(userId, data) {
    try {
      const user = this.getUser();
      const endpoint = user.role === 'admin'
        ? `${BASE_URL}/auth/admin/profile/${userId}`
        : `${BASE_URL}/auth/profile/${userId}`;
      
      console.log('Update profile URL:', endpoint);

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
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error('Terjadi kesalahan saat memperbarui profil. Silakan coba lagi.');
    }
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
    try {
      const url = `${BASE_URL}/auth/reset-password`;
      console.log('Reset password URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama, email, newPassword }),
      });
    
      return await response.json();
    } catch (error) {
      console.error('Reset password error:', error);
      throw new Error('Terjadi kesalahan saat reset password. Silakan coba lagi.');
    }
  }
};

export default AuthService;