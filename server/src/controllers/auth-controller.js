const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const AdminModel = require('../models/adminModel');
const db = require('../config/database');

const AuthController = {
  register: async (request, h) => {
    const { nama, email, password } = request.payload;

    try {
      const existingUser = await UserModel.findByEmail(email);
      const existingAdmin = await AdminModel.findByEmail(email);

      if (existingUser || existingAdmin) {
        return h.response({
          status: 'fail',
          message: 'Email sudah terdaftar',
        }).code(400);
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await UserModel.create({
        nama,
        email,
        password: hashedPassword,
      });

      return h.response({
        status: 'success',
        message: 'User berhasil didaftarkan',
        data: {
          user: {
            id: user.id,
            nama: user.nama,
            email: user.email,
            role: user.role
          },
        },
      }).code(201);
    } catch (error) {
      console.error('Error in register:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      }).code(500);
    }
  },

  login: async (request, h) => {
    try {
      const { email, password, remember = false } = request.payload;
  
      if (!email || !password) {
        return h.response({
          status: 'fail',
          message: 'Email dan password harus diisi',
        }).code(400);
      }
  
      let user = await UserModel.findByEmail(email);
      let isAdmin = false;
  
      if (!user) {
        user = await AdminModel.findByEmail(email);
        if (user) isAdmin = true;
      }
  
      if (!user) {
        return h.response({
          status: 'fail',
          message: 'Email atau password salah',
        }).code(401);
      }
  
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return h.response({
          status: 'fail',
          message: 'Email atau password salah',
        }).code(401);
      }

      if (isAdmin) {
        await AdminModel.updateLastLogin(user.id);
      }
  
      // Generate token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
  
      return h.response({
        status: 'success',
        message: 'Login berhasil',
        data: {
          token,
          user: {
            id: user.id,
            nama: user.nama,
            email: user.email,
            role: user.role,
            isAdmin,
          },
        },
      }).code(200);
  
    } catch (error) {
      console.error('Login error:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      }).code(500);
    }
  },


  createAdmin: async (request, h) => {
    const { nama, email, password, role = 'admin' } = request.payload;
    const { credentials } = request.auth;

    try {
      if (credentials.role !== 'superadmin') {
        return h.response({
          status: 'fail',
          message: 'Unauthorized: Hanya superadmin yang dapat membuat akun admin',
        }).code(403);
      }

      const existingAdmin = await AdminModel.findByEmail(email);
      const existingUser = await UserModel.findByEmail(email);

      if (existingAdmin || existingUser) {
        return h.response({
          status: 'fail',
          message: 'Email sudah terdaftar',
        }).code(400);
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const admin = await AdminModel.create({
        nama,
        email,
        password: hashedPassword,
        role,
      });

      return h.response({
        status: 'success',
        message: 'Admin berhasil didaftarkan',
        data: {
          admin: {
            id: admin.id,
            nama: admin.nama,
            email: admin.email,
            role: admin.role
          },
        },
      }).code(201);
    } catch (error) {
      console.error('Error in createAdmin:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      }).code(500);
    }
  },

  resetPassword: async (request, h) => {
    const { nama, email, newPassword } = request.payload;

    if (!nama || !email || !newPassword) {
      return h.response({
        status: 'fail',
        message: 'Semua field harus diisi',
      }).code(400);
    }

    try {
      const user = await UserModel.findByEmail(email);

      if (!user || user.nama.toLowerCase() !== nama.toLowerCase()) {
        return h.response({
          status: 'fail',
          message: 'Data yang dimasukkan tidak sesuai atau pengguna tidak ditemukan',
        }).code(404);
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      await UserModel.updatePassword(user.id, hashedPassword);

      return h.response({
        status: 'success',
        message: 'Password berhasil diubah',
        data: {
          user: {
            id: user.id,
            nama: user.nama,
            email: user.email,
            role: user.role
          }
        }
      }).code(200);

    } catch (error) {
      console.error('Error in resetPassword:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      }).code(500);
    }
  },

  updateAdminProfile: async (request, h) => {
    try {
      const { id } = request.params;
      const { nama, email, currentPassword, newPassword } = request.payload;
      const { credentials } = request.auth;

      if (credentials.id !== parseInt(id)) {
        return h.response({
          status: 'fail',
          message: 'Unauthorized: Anda tidak memiliki akses',
        }).code(403);
      }

      const admin = await AdminModel.findById(id);
      if (!admin) {
        return h.response({
          status: 'fail',
          message: 'Admin tidak ditemukan',
        }).code(404);
      }

      const updateData = {
        nama: nama || admin.nama,
        email: email || admin.email,
      };

      if (newPassword) {
        if (!currentPassword) {
          return h.response({
            status: 'fail',
            message: 'Password saat ini diperlukan untuk mengubah password',
          }).code(400);
        }

        const isValidPassword = await bcrypt.compare(currentPassword, admin.password);
        if (!isValidPassword) {
          return h.response({
            status: 'fail',
            message: 'Password saat ini tidak sesuai',
          }).code(400);
        }

        const saltRounds = 10;
        updateData.password = await bcrypt.hash(newPassword, saltRounds);
      }

      const updatedAdmin = await AdminModel.update(id, updateData);

      return h.response({
        status: 'success',
        message: 'Profile berhasil diupdate',
        data: {
          admin: {
            id: updatedAdmin.id,
            nama: updatedAdmin.nama,
            email: updatedAdmin.email,
            role: updatedAdmin.role
          },
        },
      }).code(200);

    } catch (error) {
      console.error('Error in updateAdminProfile:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      }).code(500);
    }
  },

  deleteAdmin: async (request, h) => {
    const { id } = request.params;
    const { credentials } = request.auth;

    try {
      if (credentials.role !== 'superadmin') {
        return h.response({
          status: 'fail',
          message: 'Unauthorized: Hanya superadmin yang dapat menghapus admin',
        }).code(403);
      }

      const deletedAdmin = await AdminModel.delete(id);

      if (!deletedAdmin) {
        return h.response({
          status: 'fail',
          message: 'Admin tidak ditemukan',
        }).code(404);
      }

      return h.response({
        status: 'success',
        message: 'Admin berhasil dihapus',
      }).code(200);
    } catch (error) {
      console.error('Error in deleteAdmin:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      }).code(500);
    }
  },

  getAllAdmins: async (request, h) => {
    const { credentials } = request.auth;

    try {
      if (credentials.role !== 'superadmin') {
        return h.response({
          status: 'fail',
          message: 'Unauthorized: Hanya superadmin yang dapat melihat daftar admin',
        }).code(403);
      }

      const admins = await AdminModel.getAllAdmins();

      return h.response({
        status: 'success',
        data: {
          admins: admins.map((admin) => ({
            id: admin.id,
            nama: admin.nama,
            email: admin.email,
            role: admin.role,
            created_at: admin.created_at
          })),
        },
      }).code(200);
    } catch (error) {
      console.error('Error in getAllAdmins:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      }).code(500);
    }
  },

  updateProfile: async (request, h) => {
    try {
      const { id } = request.params;
      const { nama, email, currentPassword, newPassword } = request.payload;
      const { credentials } = request.auth;

      if (credentials.id !== parseInt(id)) {
        return h.response({
          status: 'fail',
          message: 'Unauthorized: Anda tidak memiliki akses',
        }).code(403);
      }

      const user = await UserModel.findById(id);
      if (!user) {
        return h.response({
          status: 'fail',
          message: 'User tidak ditemukan',
        }).code(404);
      }

      if (email && email !== user.email) {
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
          return h.response({
            status: 'fail',
            message: 'Email sudah digunakan',
          }).code(400);
        }
      }

      const updateData = {
        nama: nama || user.nama,
        email: email || user.email,
      };

      if (newPassword) {
        if (!currentPassword) {
          return h.response({
            status: 'fail',
            message: 'Password saat ini diperlukan untuk mengubah password',
          }).code(400);
        }

        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
          return h.response({
            status: 'fail',
            message: 'Password saat ini tidak sesuai',
          }).code(400);
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await UserModel.updatePassword(id, hashedPassword);
      }

      const updatedUser = await UserModel.update(id, updateData);

      return h.response({
        status: 'success',
        message: 'Profile berhasil diperbarui',
        data: {
          user: {
            id: updatedUser.id,
            nama: updatedUser.nama,
            email: updatedUser.email,
            role: updatedUser.role
          },
        },
      }).code(200);

    } catch (error) {
      console.error('Error in updateProfile:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      }).code(500);
    }
  },
};

module.exports = AuthController;