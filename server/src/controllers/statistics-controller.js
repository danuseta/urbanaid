const StatisticsModel = require('../models/statisticsModel');

const statisticsController = {
  async getReportStatistics(request, h) {
    try {
      const statistics = await StatisticsModel.getReportStatistics();

      return h.response({
        status: 'success',
        data: statistics
      }).code(200);
    } catch (error) {
      console.error('Error in getReportStatistics:', error);

      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil data statistik'
      }).code(500);
    }
  },

  async getReviews(request, h) {
    try {
      const reviews = await StatisticsModel.getReviews();

      return h.response({
        status: 'success',
        data: reviews
      }).code(200);
    } catch (error) {
      console.error('Error in getReviews:', error);

      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil data review'
      }).code(500);
    }
  },

  async getUserStatistics(request, h) {
    try {
      const { userId } = request.params;

      if (!userId) {
        return h.response({
          status: 'fail',
          message: 'User ID diperlukan'
        }).code(400);
      }

      const statistics = await StatisticsModel.getUserStatistics(userId);

      return h.response({
        status: 'success',
        data: statistics
      }).code(200);
    } catch (error) {
      console.error('Error in getUserStatistics:', error);

      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil data statistik pengguna'
      }).code(500);
    }
  },
  async getDashboardData(request, h) {
    try {
      const [
        dashboardStats,
        monthlyStats,
        infraTypes,
        recentUsers,
        todayReports
      ] = await Promise.all([
        StatisticsModel.getDashboardStatistics(),
        StatisticsModel.getMonthlyStatistics(),
        StatisticsModel.getInfrastructureTypes(),
        StatisticsModel.getRecentUsers(),
        StatisticsModel.getTodayReports()
      ]);

      return h.response({
        status: 'success',
        data: {
          dashboard: dashboardStats,
          monthly: monthlyStats,
          infraTypes: infraTypes,
          recentUsers: recentUsers.slice(0, 5),
          todayReports: todayReports
        }
      }).code(200);
    } catch (error) {
      console.error('Error in getDashboardData:', error);
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil data dashboard'
      }).code(500);
    }
  }
};

module.exports = statisticsController;