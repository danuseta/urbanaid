const reviewModel = require('../models/reviewModel');

const reviewController = {
  async createReview(request, h) {
    try {
      console.log('Received payload:', request.payload);
      console.log('Auth credentials:', request.auth.credentials);

      const { laporan_id, rating, review_text } = request.payload;
      const user_id = request.auth.credentials.id;

      if (!laporan_id || !rating || !review_text) {
        return h.response({
          status: 'fail',
          message: 'Data tidak lengkap'
        }).code(400);
      }

      if (rating < 1 || rating > 5) {
        return h.response({
          status: 'fail',
          message: 'Rating harus antara 1-5'
        }).code(400);
      }

      const existingReview = await reviewModel.checkExistingReview(laporan_id, user_id);
      if (existingReview) {
        return h.response({
          status: 'fail',
          message: 'Anda sudah memberikan review untuk laporan ini'
        }).code(400);
      }

      const review = await reviewModel.createReview({
        laporan_id,
        user_id,
        rating,
        review_text
      });

      return h.response({
        status: 'success',
        message: 'Review berhasil ditambahkan',
        data: review
      }).code(201);
    } catch (error) {
      console.error('Error in createReview:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
        error: error.message
      }).code(500);
    }
  },

  async getReviewsByLaporanId(request, h) {
    try {
      const { id: laporan_id } = request.params;

      const reviews = await reviewModel.getReviewByLaporanId(laporan_id);

      return h.response({
        status: 'success',
        data: reviews
      });
    } catch (error) {
      console.error('Error in getReviewsByLaporanId:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server'
      }).code(500);
    }
  }
};

module.exports = reviewController;