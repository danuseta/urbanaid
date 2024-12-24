// superadmin-service.js
import ApiService from './api-service';

class SuperAdminService extends ApiService {
  static async getAllAdmins(page = 1, limit = 10, search = '') {
    try {
      return await this.fetchWithAuth(`/superadmin/admins?page=${page}&limit=${limit}&search=${search}`);
    } catch (error) {
      console.error('Error fetching admins:', error);
      return { data: [], total: 0 };
    }
  }

  static async getAdminById(id) {
    return this.fetchWithAuth(`/superadmin/admins/${id}`);
  }

  static async createAdmin(adminData) {
    return this.fetchWithAuth('/superadmin/admins', {
      method: 'POST',
      body: JSON.stringify(adminData)
    });
  }

  static async updateAdmin(id, updateData) {
    return this.fetchWithAuth(`/superadmin/admins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  static async deleteAdmin(id) {
    return this.fetchWithAuth(`/superadmin/admins/${id}`, {
      method: 'DELETE'
    });
  }

  static async getAllUsers(page = 1, limit = 10, search = '') {
    try {
      return await this.fetchWithAuth(`/superadmin/users?page=${page}&limit=${limit}&search=${search}`);
    } catch (error) {
      console.error('Error fetching users:', error);
      return { data: [], total: 0 };
    }
  }

  static async getUserById(id) {
    return this.fetchWithAuth(`/superadmin/users/${id}`);
  }

  static async updateUser(id, updateData) {
    return this.fetchWithAuth(`/superadmin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  static async deleteUser(id) {
    return this.fetchWithAuth(`/superadmin/users/${id}`, {
      method: 'DELETE'
    });
  }

  static async getSuperAdminStatistics() {
    try {
      return await this.fetchWithAuth('/superadmin/statistics');
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return {
        totalUsers: 0,
        totalReports: 0,
        pendingReports: 0,
        processedReports: 0
      };
    }
  }
}

export default SuperAdminService;