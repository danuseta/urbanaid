// review-service.js
import ApiService from './api-service';

class ReviewService extends ApiService {
  static async createReview(reviewData) {
    try {
      console.log('Sending review data:', reviewData);
      return await this.fetchWithAuth('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData)
      });
    } catch (error) {
      console.error('Error in createReview:', error);
      throw error;
    }
  }

  static async getReviewsByLaporanId(laporanId) {
    try {
      const result = await this.fetchWithAuth(`/reviews/laporan/${laporanId}`);
      return result.data;
    } catch (error) {
      console.error('Error in getReviewsByLaporanId:', error);
      throw error;
    }
  }
}

export default ReviewService;