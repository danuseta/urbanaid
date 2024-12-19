// Mock database and utils
jest.mock('../../src/config/database.js', () => ({
  query: jest.fn()
}));

jest.mock('../../src/utils/db-utils.js', () => ({
  getNextAvailableId: jest.fn()
}));

const db = require('../../src/config/database.js');
const dbUtils = require('../../src/utils/db-utils.js');
const reviewModel = require('../../src/models/reviewModel.js');

describe('reviewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createReview', () => {
    test('should create review successfully', async () => {
      const mockReviewData = {
        laporan_id: 1,
        user_id: 1,
        rating: 5,
        review_text: 'Great service!'
      };

      const mockNextId = 1;
      dbUtils.getNextAvailableId.mockResolvedValue(mockNextId);

      const mockDbResponse = {
        rows: [{
          id: mockNextId,
          ...mockReviewData,
          created_at: new Date()
        }]
      };
      db.query.mockResolvedValue(mockDbResponse);

      const result = await reviewModel.createReview(mockReviewData);

      expect(result).toEqual(mockDbResponse.rows[0]);
      expect(dbUtils.getNextAvailableId).toHaveBeenCalledWith('reviews');
      expect(db.query).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('INSERT INTO reviews'),
          values: expect.arrayContaining([
            mockNextId,
            mockReviewData.laporan_id,
            mockReviewData.user_id,
            mockReviewData.rating,
            mockReviewData.review_text
          ])
        })
      );
    });

    test('should handle error when creating review', async () => {
      const mockError = new Error('Database error');
      db.query.mockRejectedValue(mockError);

      await expect(reviewModel.createReview({
        laporan_id: 1,
        user_id: 1,
        rating: 5,
        review_text: 'Test'
      })).rejects.toThrow(mockError);
    });
  });

  describe('getReviewByLaporanId', () => {
    test('should get reviews successfully', async () => {
      const mockReviews = [
        { id: 1, user_name: 'User 1', rating: 5 },
        { id: 2, user_name: 'User 2', rating: 4 }
      ];

      db.query.mockResolvedValue({ rows: mockReviews });

      const result = await reviewModel.getReviewByLaporanId(1);

      expect(result).toEqual(mockReviews);
      expect(db.query).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('SELECT r.*, u.nama as user_name'),
          values: [1]
        })
      );
    });
  });

  describe('checkExistingReview', () => {
    test('should return existing review if found', async () => {
      const mockReview = {
        id: 1,
        laporan_id: 1,
        user_id: 1,
        rating: 5
      };

      db.query.mockResolvedValue({ rows: [mockReview] });

      const result = await reviewModel.checkExistingReview(1, 1);

      expect(result).toEqual(mockReview);
      expect(db.query).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('SELECT * FROM reviews'),
          values: [1, 1]
        })
      );
    });

    test('should return undefined if no review found', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await reviewModel.checkExistingReview(1, 1);

      expect(result).toBeUndefined();
    });
  });
});