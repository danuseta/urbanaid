// report-service.js
import ApiService from './api-service';

class ReportService extends ApiService {
  static async createReport(formData) {
    try {
      return this.fetchWithAuth('/reports', {
        method: 'POST',
        body: formData // FormData tidak perlu Content-Type, akan diatur otomatis
      });
    } catch (error) {
      if (error.message.includes('413')) {
        throw new Error('Ukuran file terlalu besar. Maksimal 8MB');
      }
      throw error;
    }
  }

  static async getUserReports() {
    return this.fetchWithAuth('/reports/user');
  }

  static async getAllReports() {
    return this.fetchWithAuth('/reports');
  }

  static async getReportById(id) {
    return this.fetchWithAuth(`/reports/${id}`);
  }

  static async updateReport(id, formData) {
    return this.fetchWithAuth(`/reports/${id}`, {
      method: 'PUT',
      body: formData
    });
  }

  static async deleteReport(id) {
    return this.fetchWithAuth(`/reports/${id}`, {
      method: 'DELETE'
    });
  }

  static async getIncomingReports() {
    return this.fetchWithAuth('/reports/incoming');
  }

  static async getReportDetail(id) {
    if (!id) {
      throw new Error('ID is required');
    }
    return this.fetchWithAuth(`/reports/detail/${id}`);
  }

  static async acceptReport(id, keterangan) {
    return this.fetchWithAuth(`/reports/${id}/accept`, {
      method: 'POST',
      body: JSON.stringify({ keterangan })
    });
  }

  static async rejectReport(id, keterangan) {
    return this.fetchWithAuth(`/reports/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ keterangan })
    });
  }
}

export default ReportService;