const BASE_URL = 'https://urbanaid-server.up.railway.app/api';

const RiwayatService = {
  async getRiwayatByUser() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/riwayat/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || 'Terjadi kesalahan saat mengambil riwayat laporan');
      }

      return responseJson.data;
    } catch (error) {
      throw error;
    }
  },

  async getAllRiwayat() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/riwayat`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || 'Terjadi kesalahan saat mengambil riwayat laporan');
      }

      return responseJson.data;
    } catch (error) {
      throw error;
    }
  },

  async getRiwayatById(id) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/riwayat/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || 'Terjadi kesalahan saat mengambil riwayat laporan');
      }

      return responseJson.data;
    } catch (error) {
      throw error;
    }
  },
  async getAdminRiwayat() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      const response = await fetch(`${BASE_URL}/riwayat/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengambil data riwayat');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching admin riwayat:', error);
      throw error;
    }
  },

  async getDetailRiwayat(id) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      const response = await fetch(`${BASE_URL}/riwayat/detail/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengambil detail riwayat');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching riwayat detail:', error);
      throw error;
    }
  }
};

export default RiwayatService;