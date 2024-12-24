const BASE_URL = 'https://urbanaid-server.up.railway.app/api';

class ApiService {
  static getHeaders(includeContentType = true) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token tidak ditemukan');
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }

  static handleError(error) {
    console.error('API Error:', error);
    
    if (error.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Sesi anda telah berakhir, silakan login kembali');
    }

    throw error;
  }

  static async fetchWithAuth(endpoint, options = {}) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: this.getHeaders(options.body instanceof FormData ? false : true)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Terjadi kesalahan pada server');
      }

      return response.json();
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export default ApiService;