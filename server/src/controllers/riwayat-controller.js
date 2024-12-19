const RiwayatModel = require('../models/riwayatModel');

const RiwayatController = {
  async getRiwayatByUser(request, h) {
    try {
      const userId = request.auth.credentials.id;
      const riwayat = await RiwayatModel.getRiwayatByUserId(userId);

      return h.response({
        status: 'success',
        data: riwayat
      }).code(200);
    } catch (error) {
      console.error('Error getting riwayat:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil riwayat laporan'
      }).code(500);
    }
  },

  async getAllRiwayat(request, h) {
    try {
      const riwayat = await RiwayatModel.getAllRiwayat();
      return h.response({
        status: 'success',
        data: riwayat
      }).code(200);
    } catch (error) {
      console.error('Error getting all riwayat:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil riwayat laporan'
      }).code(500);
    }
  },

  async getRiwayatById(request, h) {
    try {
      const { id } = request.params;
      const riwayat = await RiwayatModel.getRiwayatById(id);

      if (!riwayat) {
        return h.response({
          status: 'fail',
          message: 'Riwayat laporan tidak ditemukan'
        }).code(404);
      }

      return h.response({
        status: 'success',
        data: riwayat
      }).code(200);
    } catch (error) {
      console.error('Error getting riwayat by id:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil riwayat laporan'
      }).code(500);
    }
  },
  async getAdminRiwayat(request, h) {
    try {
      const riwayat = await RiwayatModel.getAllRiwayatWithUserDetails();
      return h.response({
        status: 'success',
        data: riwayat
      }).code(200);
    } catch (error) {
      console.error('Error getting admin riwayat:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil data riwayat'
      }).code(500);
    }
  },

  async getDetailRiwayat(request, h) {
    try {
      const { id } = request.params;
      const riwayat = await RiwayatModel.getDetailRiwayatWithUser(id);

      return h.response({
        status: 'success',
        data: riwayat
      }).code(200);
    } catch (error) {
      console.error('Error getting riwayat detail:', error);
      if (error.message === 'Riwayat tidak ditemukan') {
        return h.response({
          status: 'fail',
          message: 'Riwayat tidak ditemukan'
        }).code(404);
      }
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil detail riwayat'
      }).code(500);
    }
  }
};

module.exports = RiwayatController;