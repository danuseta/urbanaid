// statistic-service.js
import ApiService from './api-service';

class StatisticService extends ApiService {
  static async getReportStatistics() {
    try {
      const result = await this.fetchWithAuth('/statistics/reports', {
        method: 'GET'
      });
      return result;
    } catch (error) {
      console.error('Error fetching report statistics:', error);
      return {
        total: 0,
        completed: 0,
        pending: 0
      };
    }
  }

  static async getReviews() {
    try {
      const result = await this.fetchWithAuth('/statistics/reviews');
      return result;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }

  static async getUserStatistics(userId) {
    try {
      const result = await this.fetchWithAuth(`/statistics/user/${userId}`);
      return {
        totalReports: result.data?.totalReports || 0,
        resolved: result.data?.resolved || 0,
        inProgress: result.data?.inProgress || 0
      };
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      return {
        totalReports: 0,
        resolved: 0,
        inProgress: 0
      };
    }
  }

  static async getDashboardData() {
    try {
      const result = await this.fetchWithAuth('/statistics/dashboard');
      return {
        stats: {
          total: result.data.dashboard.total_count || 0,
          pending: result.data.dashboard.pending_count || 0,
          accepted: result.data.dashboard.accepted_count || 0,
          rejected: result.data.dashboard.rejected_count || 0
        },
        monthlyData: result.data.monthly.map((item) => ({
          month: item.month_name.trim(),
          count: parseInt(item.count),
          accepted_count: parseInt(item.accepted_count) || 0,
          rejected_count: parseInt(item.rejected_count) || 0
        })),
        infraTypes: result.data.infraTypes.map((item) => ({
          label: item.jenis_infrastruktur,
          value: parseInt(item.count)
        })),
        recentUsers: result.data.recentUsers.map((user) => ({
          id: user.id,
          name: user.nama,
          email: user.email,
          joinDate: new Date(user.created_at).toLocaleDateString('id-ID'),
          totalReports: parseInt(user.total_reports)
        })),
        todayReports: result.data.todayReports || []
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return {
        stats: { total: 0, pending: 0, accepted: 0, rejected: 0 },
        monthlyData: [],
        infraTypes: [],
        recentUsers: [],
        todayReports: []
      };
    }
  }
}

export default StatisticService;