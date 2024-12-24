class ReviewService {
  static BASE_URL = 'https://urbanaid-server.up.railway.app';
  
    static async createReview(reviewData) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token tidak ditemukan');
        }
  
        console.log('Sending review data:', reviewData);
  
        const response = await fetch(`${this.BASE_URL}/api/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(reviewData)
        });
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
        }
  
        const responseData = await response.json();
        return responseData;
      } catch (error) {
        console.error('Error in createReview:', error);
        throw error;
      }
    }
  
    static async getReviewsByLaporanId(laporanId) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token tidak ditemukan');
        }
  
        const response = await fetch(`${this.BASE_URL}/api/reviews/laporan/${laporanId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
        }
  
        const responseData = await response.json();
        return responseData.data;
      } catch (error) {
        console.error('Error in getReviewsByLaporanId:', error);
        throw error;
      }
    }
  }
  
  export default ReviewService;