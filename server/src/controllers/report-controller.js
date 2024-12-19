const ReportModel = require('../models/reportModel');
const StorageService = require('../services/storage');
const RiwayatModel = require('../models/riwayatModel');

const ReportController = {
  async createReport(request, h) {
    try {
      const { payload } = request;
      let fileUrl = '';

      if (payload.bukti_lampiran) {
        fileUrl = await StorageService.uploadFile(payload.bukti_lampiran);
      }

      const reportData = {
        judul: payload.judul,
        jenis_infrastruktur: payload.jenis_infrastruktur,
        tanggal_kejadian: new Date(payload.tanggal_kejadian),
        deskripsi: payload.deskripsi,
        alamat: payload.alamat,
        bukti_lampiran: fileUrl,
        user_id: request.auth.credentials.id
      };

      const report = await ReportModel.createReport(reportData);

      return h.response({
        status: 'success',
        message: 'Laporan berhasil dibuat',
        data: report
      }).code(201);
    } catch (error) {
      console.error('Error creating report:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan saat membuat laporan'
      }).code(500);
    }
  },

  async getReports(request, h) {
    try {
      const reports = await ReportModel.getAllReports();
      return h.response({
        status: 'success',
        data: reports
      }).code(200);
    } catch (error) {
      console.error('Error getting reports:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil laporan'
      }).code(500);
    }
  },

  async getReportsByUser(request, h) {
    try {
      const userId = request.auth.credentials.id;
      const reports = await ReportModel.getReportsByUserId(userId);
      return h.response({
        status: 'success',
        data: reports
      }).code(200);
    } catch (error) {
      console.error('Error getting user reports:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil laporan'
      }).code(500);
    }
  },

  async getReportById(request, h) {
    try {
      const { id } = request.params;
      const report = await ReportModel.getReportById(id);

      if (!report) {
        return h.response({
          status: 'fail',
          message: 'Laporan tidak ditemukan'
        }).code(404);
      }

      return h.response({
        status: 'success',
        data: report
      }).code(200);
    } catch (error) {
      console.error('Error getting report:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil laporan'
      }).code(500);
    }
  },

  async updateReport(request, h) {
    try {
      const { payload } = request;
      let fileUrl = payload.bukti_lampiran;

      if (payload.bukti_lampiran && typeof payload.bukti_lampiran !== 'string') {
        fileUrl = await StorageService.uploadFile(payload.bukti_lampiran);
      }

      const reportData = {
        id: request.params.id,
        judul: payload.judul,
        jenis_infrastruktur: payload.jenis_infrastruktur,
        tanggal_kejadian: new Date(payload.tanggal_kejadian),
        deskripsi: payload.deskripsi,
        alamat: payload.alamat,
        bukti_lampiran: fileUrl
      };

      const updatedReport = await ReportModel.updateReport(reportData);

      return h.response({
        status: 'success',
        message: 'Laporan berhasil diperbarui',
        data: updatedReport
      }).code(200);
    } catch (error) {
      console.error('Error updating report:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan saat memperbarui laporan'
      }).code(500);
    }
  },
  async deleteReport(request, h) {
    try {
      const { id } = request.params;
      const deletedReport = await ReportModel.deleteReport(id);

      return h.response({
        status: 'success',
        message: 'Laporan berhasil dihapus',
        data: deletedReport
      }).code(200);
    } catch (error) {
      console.error('Error deleting report:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan saat menghapus laporan'
      }).code(500);
    }
  },
  async getNearbyReports(request, h) {
    try {
      const { latitude, longitude, radius } = request.query;

      if (!latitude || !longitude) {
        return h.response({
          status: 'fail',
          message: 'Latitude dan longitude diperlukan'
        }).code(400);
      }

      const reports = await ReportModel.getReportsNearLocation(
        parseFloat(latitude),
        parseFloat(longitude),
        radius ? parseFloat(radius) : 10
      );

      return h.response({
        status: 'success',
        data: reports
      }).code(200);
    } catch (error) {
      console.error('Error getting nearby reports:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil laporan terdekat'
      }).code(500);
    }
  },
  async getIncomingReports(request, h) {
    try {
      const reports = await ReportModel.getIncomingReports();

      return h.response({
        status: 'success',
        data: reports
      }).code(200);
    } catch (error) {
      console.error('Error getting incoming reports:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil data laporan masuk'
      }).code(500);
    }
  },

  async getReportDetail(request, h) {
    try {
      const { id } = request.params;
      const report = await ReportModel.getReportDetail(id);

      if (!report) {
        return h.response({
          status: 'fail',
          message: 'Laporan tidak ditemukan'
        }).code(404);
      }

      return h.response({
        status: 'success',
        data: report
      }).code(200);
    } catch (error) {
      console.error('Error getting report detail:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil detail laporan'
      }).code(500);
    }
  },

  async acceptReport(request, h) {
    try {
      const { id } = request.params;
      const { keterangan } = request.payload;

      const report = await ReportModel.getReportDetail(id);
      if (!report) {
        return h.response({
          status: 'fail',
          message: 'Laporan tidak ditemukan'
        }).code(404);
      }

      const riwayat = await RiwayatModel.transferToRiwayat(id, 'diterima', keterangan);

      return h.response({
        status: 'success',
        message: 'Laporan berhasil diterima',
        data: riwayat
      }).code(200);
    } catch (error) {
      console.error('Error accepting report:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan saat memproses laporan'
      }).code(500);
    }
  },

  async rejectReport(request, h) {
    try {
      const { id } = request.params;
      const { keterangan } = request.payload;

      const report = await ReportModel.getReportDetail(id);
      if (!report) {
        return h.response({
          status: 'fail',
          message: 'Laporan tidak ditemukan'
        }).code(404);
      }

      const riwayat = await RiwayatModel.transferToRiwayat(id, 'ditolak', keterangan);

      return h.response({
        status: 'success',
        message: 'Laporan berhasil ditolak',
        data: riwayat
      }).code(200);
    } catch (error) {
      console.error('Error rejecting report:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan saat memproses laporan'
      }).code(500);
    }
  }
};

module.exports = ReportController;