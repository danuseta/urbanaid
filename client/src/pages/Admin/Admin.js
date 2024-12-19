import Sidebar from '../../components/admin/Sidebar.js';
import AdminHeader from '../../components/admin/AdminHeader.js';
import Loading from '../../components/common/Loading.js';
import StatisticService from '../../services/statistic-service.js';
import '../../styles/admin.css';

const AdminPage = {
  async init() {
    try {
      Loading.show();
      this.render();
      await this.loadDashboardData();
      Sidebar.afterRender();
      Loading.hide();
    } catch (error) {
      console.error('Error in AdminPage init:', error);
      Loading.hide();
    }
  },

  async loadDashboardData() {
    try {
      const dashboardData = await StatisticService.getDashboardData();
      this.updateDashboardStats(dashboardData.stats);
      this.updateCharts(dashboardData);
      this.updateUsersTable(dashboardData.recentUsers);
      this.updateTodayReportsTable(dashboardData.todayReports);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  },

  updateDashboardStats(stats) {
    const elements = {
      total: document.getElementById('total-reports'),
      pending: document.getElementById('pending-reports'),
      accepted: document.getElementById('accepted-reports'),
      rejected: document.getElementById('rejected-reports')
    };

    Object.keys(elements).forEach((key) => {
      if (elements[key]) elements[key].textContent = stats[key];
    });
  },

  updateUsersTable(users) {
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = users.map((user, index) => `
            <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
                <td class="px-4 py-3 text-sm">${user.name}</td>
                <td class="px-4 py-3 text-sm">${user.email}</td>
                <td class="px-4 py-3 text-sm">${user.joinDate}</td>
                <td class="px-4 py-3 text-sm text-center">${user.totalReports}</td>
            </tr>
        `).join('');
  },

  updateCharts(data) {
    if (!this.chartInstances) {
      this.chartInstances = {};
    }

    const charts = [
      {
        id: 'totalReportsChart',
        type: 'line',
        data: {
          labels: data.monthlyData.map((item) => item.month),
          datasets: [{
            label: 'Total Laporan',
            data: data.monthlyData.map((item) => item.count),
            borderColor: '#00899B',
            backgroundColor: 'rgba(0, 137, 155, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#00899B',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#00899B'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                boxWidth: 10,
                padding: 10,
                font: { size: 10 }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: { size: 10 }
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                borderDash: [2, 2]
              },
              ticks: {
                font: { size: 10 }
              }
            }
          }
        }
      },
      {
        id: 'infraTypeChart',
        type: 'doughnut',
        data: {
          labels: data.infraTypes.map((item) => item.label),
          datasets: [{
            data: data.infraTypes.map((item) => item.value),
            backgroundColor: ['#00899B', '#004d57', '#002F35', '#00b3cc', '#006b77'],
            borderWidth: 1,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 10,
                padding: 10,
                font: { size: 10 }
              }
            }
          },
          cutout: '60%'
        }
      },
      {
        id: 'acceptedReportsChart',
        type: 'bar',
        data: {
          labels: data.monthlyData.map((item) => item.month),
          datasets: [{
            label: 'Laporan Diterima',
            data: data.monthlyData.map((item) => item.accepted_count || 0),
            backgroundColor: '#00899B',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                boxWidth: 10,
                padding: 10,
                font: { size: 10 }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: { size: 10 }
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                borderDash: [2, 2]
              },
              ticks: {
                font: { size: 10 }
              }
            }
          }
        }
      },
      {
        id: 'rejectedReportsChart',
        type: 'bar',
        data: {
          labels: data.monthlyData.map((item) => item.month),
          datasets: [{
            label: 'Laporan Ditolak',
            data: data.monthlyData.map((item) => item.rejected_count || 0),
            backgroundColor: '#EF4444',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                boxWidth: 10,
                padding: 10,
                font: { size: 10 }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: { size: 10 }
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                borderDash: [2, 2]
              },
              ticks: {
                font: { size: 10 }
              }
            }
          }
        }
      }
    ];

    charts.forEach((chartConfig) => {
      const ctx = document.getElementById(chartConfig.id)?.getContext('2d');
      if (ctx) {
        if (this.chartInstances[chartConfig.id]) {
          this.chartInstances[chartConfig.id].destroy();
        }

        this.chartInstances[chartConfig.id] = new Chart(ctx, {
          type: chartConfig.type,
          data: chartConfig.data,
          options: chartConfig.options
        });
      }
    });
  },

  updateTodayReportsTable(reports) {
    const tableBody = document.getElementById('today-reports-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = reports.map((report, index) => `
            <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
                <td class="px-4 py-3 text-sm">${report.judul}</td>
                <td class="px-4 py-3 text-sm">${report.jenis_infrastruktur}</td>
                <td class="px-4 py-3 text-sm">${report.pelapor}</td>
                <td class="px-4 py-3 text-sm">
                    ${new Date(report.created_at).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  })}
                </td>
            </tr>
        `).join('');

    if (reports.length === 0) {
      tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="px-4 py-3 text-sm text-center text-white-700">
                        Belum ada laporan masuk hari ini
                    </td>
                </tr>
            `;
    }
  },

  render() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
            <div class="min-h-screen bg-gray-100">
                ${Sidebar.render()}
                ${AdminHeader.render()}
                
                <main class="lg:ml-64 p-4 lg:p-8">
                    <!-- Stats Grid -->
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
                        <div class="bg-gradient-to-r from-[#00899B] to-[#002F35] p-4 lg:p-6 rounded-lg shadow text-white text-center">
                            <h3 class="text-xs lg:text-sm font-medium mb-2">Total Laporan</h3>
                            <div class="text-xl lg:text-3xl font-bold" id="total-reports">-</div>
                        </div>
                        <div class="bg-gradient-to-r from-[#00899B] to-[#002F35] p-4 lg:p-6 rounded-lg shadow text-white text-center">
                            <h3 class="text-xs lg:text-sm font-medium mb-2">Laporan Pending</h3>
                            <div class="text-xl lg:text-3xl font-bold" id="pending-reports">-</div>
                        </div>
                        <div class="bg-gradient-to-r from-[#00899B] to-[#002F35] p-4 lg:p-6 rounded-lg shadow text-white text-center">
                            <h3 class="text-xs lg:text-sm font-medium mb-2">Laporan Diterima</h3>
                            <div class="text-xl lg:text-3xl font-bold" id="accepted-reports">-</div>
                        </div>
                        <div class="bg-gradient-to-r from-[#00899B] to-[#002F35] p-4 lg:p-6 rounded-lg shadow text-white text-center">
                            <h3 class="text-xs lg:text-sm font-medium mb-2">Laporan Ditolak</h3>
                            <div class="text-xl lg:text-3xl font-bold" id="rejected-reports">-</div>
                        </div>
                    </div>

                    <!-- Charts Grid -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
                        <div class="bg-white rounded-lg shadow p-4 lg:p-6">
                            <h3 class="text-sm lg:text-lg font-semibold mb-4 text-[#002F35]">Trend Total Laporan</h3>
                            <div class="h-48 lg:h-64">
                                <canvas id="totalReportsChart"></canvas>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg shadow p-4 lg:p-6">
                            <h3 class="text-sm lg:text-lg font-semibold mb-4 text-[#002F35]">Jenis Infrastruktur</h3>
                            <div class="h-48 lg:h-64">
                                <canvas id="infraTypeChart"></canvas>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg shadow p-4 lg:p-6">
                            <h3 class="text-sm lg:text-lg font-semibold mb-4 text-[#002F35]">Laporan Diterima</h3>
                            <div class="h-48 lg:h-64">
                                <canvas id="acceptedReportsChart"></canvas>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg shadow p-4 lg:p-6">
                            <h3 class="text-sm lg:text-lg font-semibold mb-4 text-[#002F35]">Laporan Ditolak</h3>
                            <div class="h-48 lg:h-64">
                                <canvas id="rejectedReportsChart"></canvas>
                            </div>
                        </div>
                    </div>

 <!-- Table Grid Section -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-[#002F35]">Daftar Pengguna Terbaru</h3>
        </div>
        <div class="overflow-x-auto px-6 pb-6">
            <table class="min-w-full">
                <thead>
                    <tr class="bg-gray-50">
                        <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-white-700 uppercase tracking-wider">
                            Nama
                        </th>
                        <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-white-700 uppercase tracking-wider">
                            Email
                        </th>
                        <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-white-700 uppercase tracking-wider">
                            Tanggal Bergabung
                        </th>
                        <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-white-700 uppercase tracking-wider">
                            Total Laporan
                        </th>
                    </tr>
                </thead>
                <tbody id="users-table-body" class="bg-white divide-y divide-gray-200">
                    <!-- Data -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- Today's Reports Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-[#002F35]">Laporan Masuk Hari Ini</h3>
        </div>
        <div class="overflow-x-auto px-6 pb-6">
            <table class="min-w-full">
                <thead>
                    <tr class="bg-gray-50">
                        <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-white-700 uppercase tracking-wider">
                            Judul
                        </th>
                        <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-white-700 uppercase tracking-wider">
                            Jenis
                        </th>
                        <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-white-700 uppercase tracking-wider">
                            Pelapor
                        </th>
                        <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-white-700 uppercase tracking-wider">
                            Waktu
                        </th>
                    </tr>
                </thead>
                <tbody id="today-reports-table-body" class="bg-white divide-y divide-gray-200">
                    <!-- Data will be populated here -->
                </tbody>
            </table>
        </div>
    </div>
</div>
                </main>
            </div>
        `;

    Sidebar.afterRender();
    AdminHeader.afterRender();
  },

  cleanup() {
    Loading.hide();
  }
};

export default AdminPage;