const superAdminModel = require('../models/superAdminModel');
const bcrypt = require('bcrypt');

const superAdminController = {
  async getAllAdmins(request, h) {
    try {
      const { page = 1, limit = 10, search = '' } = request.query;

      const admins = await superAdminModel.getAllAdmins(page, limit, search);

      return h.response({
        status: 'success',
        data: admins
      }).code(200);
    } catch (error) {
      console.error('Error in getAllAdmins:', error);
      return h.response({
        status: 'fail',
        message: error.message || 'Gagal mengambil data admin'
      }).code(400);
    }
  },

  async getAdminById(request, h) {
    try {
      const { id } = request.params;
      const admin = await superAdminModel.getAdminById(id);

      if (!admin) {
        return h.response({
          status: 'fail',
          message: 'Admin tidak ditemukan'
        }).code(404);
      }

      return h.response({
        status: 'success',
        data: {
          admin
        }
      }).code(200);
    } catch (error) {
      console.error('Error in getAdminById:', error);
      return h.response({
        status: 'fail',
        message: error.message || 'Gagal mengambil data admin'
      }).code(400);
    }
  },

  async createAdmin(request, h) {
    try {
      const adminData = request.payload;

      if (!adminData.nama || !adminData.email || !adminData.password) {
        return h.response({
          status: 'fail',
          message: 'Nama, email, dan password wajib diisi'
        }).code(400);
      }

      if (adminData.role === 'superadmin') {
        return h.response({
          status: 'fail',
          message: 'Tidak dapat membuat akun superadmin baru'
        }).code(403);
      }

      adminData.password = await bcrypt.hash(adminData.password, 10);

      const admin = await superAdminModel.createAdmin(adminData);

      return h.response({
        status: 'success',
        message: 'Admin berhasil ditambahkan',
        data: {
          admin
        }
      }).code(201);
    } catch (error) {
      console.error('Error in createAdmin:', error);
      return h.response({
        status: 'fail',
        message: error.message || 'Gagal menambahkan admin'
      }).code(400);
    }
  },

  async updateAdmin(request, h) {
    try {
      const { id } = request.params;
      const updateData = request.payload;

      if (!updateData.nama || !updateData.email) {
        return h.response({
          status: 'fail',
          message: 'Nama dan email wajib diisi'
        }).code(400);
      }

      const existingAdmin = await superAdminModel.getAdminById(id);
      if (!existingAdmin) {
        return h.response({
          status: 'fail',
          message: 'Admin tidak ditemukan'
        }).code(404);
      }

      if (existingAdmin.role === 'superadmin' || updateData.role === 'superadmin') {
        return h.response({
          status: 'fail',
          message: 'Tidak dapat mengubah data superadmin'
        }).code(403);
      }

      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      const admin = await superAdminModel.updateAdmin(id, updateData);

      return h.response({
        status: 'success',
        message: 'Admin berhasil diperbarui',
        data: {
          admin
        }
      }).code(200);
    } catch (error) {
      console.error('Error in updateAdmin:', error);
      return h.response({
        status: 'fail',
        message: error.message || 'Gagal memperbarui admin'
      }).code(400);
    }
  },

  async deleteAdmin(request, h) {
    try {
      const { id } = request.params;

      const admin = await superAdminModel.getAdminById(id);
      if (!admin) {
        return h.response({
          status: 'fail',
          message: 'Admin tidak ditemukan'
        }).code(404);
      }

      if (admin.role === 'superadmin') {
        return h.response({
          status: 'fail',
          message: 'Tidak dapat menghapus akun superadmin'
        }).code(403);
      }

      await superAdminModel.deleteAdmin(id);

      return h.response({
        status: 'success',
        message: 'Admin berhasil dihapus'
      }).code(200);
    } catch (error) {
      console.error('Error in deleteAdmin:', error);
      return h.response({
        status: 'fail',
        message: error.message || 'Gagal menghapus admin'
      }).code(400);
    }
  },

  async getAllUsers(request, h) {
    try {
      const { page = 1, limit = 10, search = '' } = request.query;

      const users = await superAdminModel.getAllUsers(page, limit, search);

      return h.response({
        status: 'success',
        data: users
      }).code(200);
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      return h.response({
        status: 'fail',
        message: error.message || 'Gagal mengambil data pengguna'
      }).code(400);
    }
  },

  async getUserById(request, h) {
    try {
      const { id } = request.params;
      const user = await superAdminModel.getUserById(id);

      if (!user) {
        return h.response({
          status: 'fail',
          message: 'Pengguna tidak ditemukan'
        }).code(404);
      }

      const reports = await superAdminModel.getUserReports(id);

      return h.response({
        status: 'success',
        data: {
          user,
          reports
        }
      }).code(200);
    } catch (error) {
      console.error('Error in getUserById:', error);
      return h.response({
        status: 'fail',
        message: error.message || 'Gagal mengambil data pengguna'
      }).code(400);
    }
  },

  async updateUser(request, h) {
    try {
      const { id } = request.params;
      const updateData = request.payload;

      if (!updateData.nama || !updateData.email) {
        return h.response({
          status: 'fail',
          message: 'Nama dan email wajib diisi'
        }).code(400);
      }

      const existingUser = await superAdminModel.getUserById(id);
      if (!existingUser) {
        return h.response({
          status: 'fail',
          message: 'Pengguna tidak ditemukan'
        }).code(404);
      }

      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      const user = await superAdminModel.updateUser(id, updateData);

      return h.response({
        status: 'success',
        message: 'Pengguna berhasil diperbarui',
        data: {
          user
        }
      }).code(200);
    } catch (error) {
      console.error('Error in updateUser:', error);
      return h.response({
        status: 'fail',
        message: error.message || 'Gagal memperbarui pengguna'
      }).code(400);
    }
  },

  async deleteUser(request, h) {
    try {
      const { id } = request.params;

      const result = await superAdminModel.deleteUser(id);
      if (!result) {
        return h.response({
          status: 'fail',
          message: 'Pengguna tidak ditemukan'
        }).code(404);
      }

      return h.response({
        status: 'success',
        message: 'Pengguna berhasil dihapus'
      }).code(200);
    } catch (error) {
      console.error('Error in deleteUser:', error);
      return h.response({
        status: 'fail',
        message: error.message || 'Gagal menghapus pengguna'
      }).code(400);
    }
  },

  async getStatistics(request, h) {
    try {
      const statistics = await superAdminModel.getUserStatistics();
      return h.response({
        status: 'success',
        data: statistics
      }).code(200);
    } catch (error) {
      console.error('Error in getStatistics:', error);
      return h.response({
        status: 'fail',
        message: error.message || 'Gagal mengambil statistik'
      }).code(400);
    }
  }
};

module.exports = superAdminController;