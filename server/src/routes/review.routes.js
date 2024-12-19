const reviewController = require('../controllers/review-controller');

const routes = [
  {
    method: 'POST',
    path: '/api/reviews',
    options: {
      auth: 'jwt',
      payload: {
        parse: true,
        allow: ['application/json']
      },
      handler: reviewController.createReview
    }
  },
  {
    method: 'GET',
    path: '/api/reviews/laporan/{id}',
    options: {
      auth: 'jwt',
      handler: reviewController.getReviewsByLaporanId
    }
  }
];

module.exports = routes;