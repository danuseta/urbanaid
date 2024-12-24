// auth-service.js
import ApiService from './api-service';

const CLIENT_URL = 'https://urbanaid-client.vercel.app';

class AuthService extends ApiService {
  static async login(email, password) {
    try {
      const response = await fetch(`${this.BASE_URL}/auth/login`, {
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
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async register(userData) {
    return fetch(`${this.BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    }).then(response => response.json());
  }

  static async createAdmin(adminData) {
    return this.fetchWithAuth('/auth/admin/create', {
      method: 'POST',
      body: JSON.stringify(adminData)
    });
  }

  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('remember_token');
    window.history.replaceState({}, document.title, '/login');
    window.location.href = '/login';
  }

  static getToken() {
    return localStorage.getItem('token');
  }

  static getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  static isAuthenticated() {
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
  }

  static isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  }

  static isSuperAdmin() {
    const user = this.getUser();
    return user && user.role === 'superadmin';
  }

  static hasAdminAccess() {
    const user = this.getUser();
    return user && (user.role === 'admin' || user.role === 'superadmin');
  }

  static getRedirectUrl() {
    const user = this.getUser();
    if (!user) return `${CLIENT_URL}/login`;

    if (user.role === 'superadmin') {
      return `${CLIENT_URL}/admin/management`;
    }

    return user.role === 'admin'
      ? `${CLIENT_URL}/admin`
      : `${CLIENT_URL}/pelaporan`;
  }

  static async updateProfile(userId, data) {
    const user = this.getUser();
    const endpoint = user.role === 'admin'
      ? `/auth/admin/profile/${userId}`
      : `/auth/profile/${userId}`;

    const responseJson = await this.fetchWithAuth(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });

    if (responseJson.data) {
      const currentUser = this.getUser();
      const updatedUser = {
        ...currentUser,
        ...(user.role === 'admin' ? responseJson.data.admin : responseJson.data.user)
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return responseJson;
  }

  static async resetPassword(nama, email, newPassword) {
    return fetch(`${this.BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nama, email, newPassword }),
    }).then(response => response.json());
  }

  // Tambahkan BASE_URL sebagai static property
  static BASE_URL = 'https://urbanaid-server.up.railway.app/api';
}

export default AuthService;