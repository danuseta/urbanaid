const BASE_URL = 'https://urbanaid-server.up.railway.app/api';

const SuperAdminService = {
  async getAllAdmins(page = 1, limit = 10, search = '') {
    try {
      const response = await fetch(`${BASE_URL}/superadmin/admins?page=${page}&limit=${limit}&search=${search}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admins');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching admins:', error);
      return {
        data: [],
        total: 0
      };
    }
  },

  async getAdminById(id) {
    try {
      const response = await fetch(`${BASE_URL}/superadmin/admins/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admin');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching admin:', error);
      return null;
    }
  },

  async createAdmin(adminData) {
    try {
      const response = await fetch(`${BASE_URL}/superadmin/admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create admin');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  },

  async updateAdmin(id, updateData) {
    try {
      const response = await fetch(`${BASE_URL}/superadmin/admins/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update admin');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  },

  async deleteAdmin(id) {
    try {
      const response = await fetch(`${BASE_URL}/superadmin/admins/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete admin');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  },

  async getAllUsers(page = 1, limit = 10, search = '') {
    try {
      const response = await fetch(`${BASE_URL}/superadmin/users?page=${page}&limit=${limit}&search=${search}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        data: [],
        total: 0
      };
    }
  },

  async getUserById(id) {
    try {
      const response = await fetch(`${BASE_URL}/superadmin/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  async updateUser(id, updateData) {
    try {
      const response = await fetch(`${BASE_URL}/superadmin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async deleteUser(id) {
    try {
      const response = await fetch(`${BASE_URL}/superadmin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async getSuperAdminStatistics() {
    try {
      const response = await fetch(`${BASE_URL}/superadmin/statistics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      return await response.json();
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
};

export default SuperAdminService;