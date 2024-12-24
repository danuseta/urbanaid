const BASE_URL = 'https://urbanaid-server.up.railway.app/api';
const CLIENT_URL = 'https://urbanaid-client.vercel.app';

const ReportService = {
  async createReport(formData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      console.log('Sending report with formData:', Object.fromEntries(formData));

      const response = await fetch(`${BASE_URL}/reports`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('Response status:', response.status);

      if (response.status === 413) {
        throw new Error('Ukuran file terlalu besar. Maksimal 8MB');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Terjadi kesalahan pada server');
      }

      const data = await response.json();
      console.log('Response data:', data);

      return data;
    } catch (error) {
      console.error('Error in createReport:', error);

      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error('Gagal terhubung ke server. Periksa koneksi internet Anda.');
      }

      throw error;
    }
  },

  async getUserReports() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/reports/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || 'Terjadi kesalahan saat mengambil laporan');
      }

      return responseJson.data;
    } catch (error) {
      throw error;
    }
  },

  async getAllReports() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/reports`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || 'Terjadi kesalahan saat mengambil laporan');
      }

      return responseJson.data;
    } catch (error) {
      throw error;
    }
  },

  async getReportById(id) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/reports/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || 'Terjadi kesalahan saat mengambil laporan');
      }

      return responseJson.data;
    } catch (error) {
      throw error;
    }
  },

  async updateReport(id, formData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/reports/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || 'Terjadi kesalahan saat memperbarui laporan');
      }

      return responseJson.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteReport(id) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/reports/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson.message || 'Terjadi kesalahan saat menghapus laporan');
      }

      return responseJson;
    } catch (error) {
      throw error;
    }
  },
  async getIncomingReports() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        throw new Error('Token tidak ditemukan');
      }

      const response = await fetch(`${BASE_URL}/reports/incoming`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Sesi anda telah berakhir, silahkan login kembali');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengambil data laporan masuk');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching incoming reports:', error);
      throw error;
    }
  },
  async getReportDetail(id) {
    try {
      if (!id) {
        throw new Error('ID is required');
      }

      const token = localStorage.getItem('token');
      console.log('Fetching report detail with ID:', id);

      const response = await fetch(`${BASE_URL}/reports/detail/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengambil detail laporan');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching report detail:', error);
      throw error;
    }
  },

  async acceptReport(id, keterangan) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      console.log('Making request with:', {
        url: `${BASE_URL}/reports/${id}/accept`,
        token: token,
        keterangan: keterangan
      });

      const response = await fetch(`${BASE_URL}/reports/${id}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ keterangan })
      });

      const responseData = await response.json();
      console.log('Response:', {
        status: response.status,
        data: responseData
      });

      if (!response.ok) {
        throw new Error(responseData.message || 'Gagal menerima laporan');
      }

      return responseData;
    } catch (error) {
      console.error('Error in acceptReport:', {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  },

  async rejectReport(id, keterangan) {
    try {
      let token;
      try {
        token = window.localStorage.getItem('token');
      } catch (e) {
        console.error('Error accessing localStorage:', e);
        throw new Error('Tidak dapat mengakses token. Silakan login kembali.');
      }

      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      console.log('Sending reject request with:', {
        id,
        keterangan,
        hasToken: !!token
      });

      const response = await fetch(`${BASE_URL}/reports/${id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ keterangan })
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Gagal menolak laporan');
      }

      return data;
    } catch (error) {
      console.error('Error in rejectReport:', error);
      throw new Error(error.message || 'Gagal menolak laporan. Silakan coba lagi.');
    }
  }
};

export default ReportService;