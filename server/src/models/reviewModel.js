const db = require('../config/database');
const dbUtils = require('../utils/db-utils');

const reviewModel = {
  async getNextAvailableId() {
    try {
      const query = `
                SELECT i AS next_id
                FROM generate_series(1, (SELECT COALESCE(MAX(id), 0) + 1 FROM reviews)) i
                WHERE i NOT IN (SELECT id FROM reviews)
                ORDER BY i
                LIMIT 1
            `;
      const result = await db.query(query);
      return result.rows[0].next_id;
    } catch (error) {
      console.error('Error getting next available ID:', error);
      throw error;
    }
  },

  async createReview({ laporan_id, user_id, rating, review_text }) {
    try {
      const nextId = await dbUtils.getNextAvailableId('reviews');

      const query = {
        text: `INSERT INTO reviews (id, laporan_id, user_id, rating, review_text) 
                   VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        values: [nextId, laporan_id, user_id, rating, review_text]
      };
      const result = await db.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error in createReview:', error);
      throw error;
    }
  },

  async getReviewByLaporanId(laporan_id) {
    try {
      const query = {
        text: `SELECT r.*, u.nama as user_name 
                       FROM reviews r 
                       JOIN users u ON r.user_id = u.id 
                       WHERE r.laporan_id = $1`,
        values: [laporan_id]
      };
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error in getReviewByLaporanId:', error);
      throw error;
    }
  },

  async checkExistingReview(laporan_id, user_id) {
    try {
      const query = {
        text: 'SELECT * FROM reviews WHERE laporan_id = $1 AND user_id = $2',
        values: [laporan_id, user_id]
      };
      const result = await db.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error in checkExistingReview:', error);
      throw error;
    }
  }
};

module.exports = reviewModel;