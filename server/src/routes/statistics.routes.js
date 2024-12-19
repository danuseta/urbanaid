const statisticsController = require('../controllers/statistics-controller');

const routes = [
  {
    method: 'GET',
    path: '/api/statistics/reports',
    handler: statisticsController.getReportStatistics,
    options: {
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/api/statistics/reviews',
    handler: statisticsController.getReviews,
    options: {
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/api/statistics/user/{userId}',
    handler: statisticsController.getUserStatistics,
    options: {
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/api/statistics/dashboard',
    handler: statisticsController.getDashboardData,
    options: {
      auth: false
    }
  }
];

module.exports = routes;