import AdminHeader from '../../components/admin/AdminHeader.js';
import Sidebar from '../../components/admin/Sidebar.js';
import Loading from '../../components/common/Loading.js';
import ReportService from '../../services/report-service.js';
import '../../styles/admin.css';
import { hashId } from '../../utils/hash-util.js';

const LaporanMasuk = {
  async init() {
    try {
      await this.render();
      await this.loadIncomingReports();
      Sidebar.afterRender();
      this.initializeEventListeners();
    } catch (error) {
      console.error('Error in LaporanMasuk init:', error);
    }
  },

  async loadIncomingReports() {
    try {
      Loading.show();
      const reports = await ReportService.getIncomingReports();

      if (reports) {
        const formattedReports = reports.map((report) => ({
          id: report.id,
          nama: report.nama_pelapor,
          judul: report.judul,
          deskripsi: report.deskripsi,
          jenis: report.jenis_infrastruktur,
          tanggal_kejadian: new Date(report.tanggal_kejadian).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }),
          created_at: new Date(report.created_at).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }),
          alamat: report.alamat,
          status: report.status
        }));

        this.updateReportsTable(formattedReports);
      }
    } catch (error) {
      console.error('Error loading incoming reports:', error);
      if (error.message.includes('Sesi anda telah berakhir')) {
        return;
      }
    } finally {
      Loading.hide();
    }
  },

  sortConfig: {
    key: null,
    direction: 'asc'
  },

  sortData(reports, key) {
    return [...reports].sort((a, b) => {
      if (this.sortConfig.key === key && this.sortConfig.direction === 'desc') {
        [a, b] = [b, a];
      }

      if (key === 'tanggal_kejadian' || key === 'created_at') {
        const dateA = new Date(a[key].split('/').reverse().join('-'));
        const dateB = new Date(b[key].split('/').reverse().join('-'));
        return dateA - dateB;
      }

      if (typeof a[key] === 'string') {
        return a[key].localeCompare(b[key]);
      }

      return a[key] - b[key];
    });
  },

  updateSort(key) {
    if (this.sortConfig.key === key) {
      this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortConfig.key = key;
      this.sortConfig.direction = 'asc';
    }
    this.loadIncomingReports();
  },

  updateReportsTable(reports) {
    const tbody = document.querySelector('#reports-table tbody');
    if (!tbody) return;

    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    let filteredReports = reports.filter((report) =>
      Object.values(report).some((value) =>
        value.toString().toLowerCase().includes(searchTerm)
      )
    );

    if (this.sortConfig.key) {
      filteredReports = this.sortData(filteredReports, this.sortConfig.key);
    }

    tbody.innerHTML = filteredReports.map((report) => `
            <tr class="border-b border-gray-200 hover:bg-gray-50">
                <td class="px-6 py-4 text-[#002F35] whitespace-nowrap">${report.id}</td>
                <td class="px-6 py-4 text-[#002F35] whitespace-nowrap">${report.nama}</td>
                <td class="px-6 py-4 text-[#002F35]">
                    <div class="max-w-[200px] line-clamp-1">${report.judul}</div>
                </td>
                <td class="px-6 py-4 text-[#002F35]">
                    <div class="max-w-[200px] line-clamp-1">${report.deskripsi}</div>
                </td>
                <td class="px-6 py-4 text-[#002F35] whitespace-nowrap">${report.jenis}</td>
                <td class="px-6 py-4 text-[#002F35] whitespace-nowrap">${report.tanggal_kejadian}</td>
                <td class="px-6 py-4 text-[#002F35] whitespace-nowrap">${report.created_at}</td>
                <td class="px-6 py-4 text-[#002F35]">
                    <div class="max-w-[200px] line-clamp-1">${report.alamat}</div>
                </td>
                <td class="px-6 py-4 text-[#002F35] whitespace-nowrap">
                    <span class="px-2 py-1 rounded-full text-xs bg-[#FEF3C7] text-[#92400E]">
                        ${report.status}
                    </span>
                </td>
                <td class="px-6 py-4 text-[#002F35] whitespace-nowrap">
<a href="/admin/laporan/${hashId(report.id)}" 
   class="inline-flex items-center justify-center p-3 min-w-[44x] min-h-[44x] bg-[#002F35] text-white rounded-lg hover:bg-opacity-90 transition-colors">
    <span class="material-icons-round text-lg">visibility</span>
</a>
                </td>
            </tr>
        `).join('');

    if (filteredReports.length === 0) {
      tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="px-6 py-4 text-center text-gray-500">
                        Tidak ada laporan yang ditemukan
                    </td>
                </tr>
            `;
    }
  },

  initializeEventListeners() {
    document.getElementById('searchInput')?.addEventListener('input', (e) => {
      this.loadIncomingReports();
    });
  },

  render() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
            <div class="min-h-screen bg-gray-100">
                ${Sidebar.render()}
                ${AdminHeader.render()}
                
                <main class="lg:ml-64 p-4 lg:p-8">
                    <div class="bg-white rounded-lg shadow-lg">
                        <!-- Header Section -->
                        <div class="p-6 border-b">
                            <h1 class="text-xl lg:text-2xl font-bold text-[#002F35]">Laporan Masuk</h1>
                        </div>

                        <!-- Filters Section -->
                        <div class="p-6 border-b">
                            <div class="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                                <div class="relative">
                                    <input type="text" 
                                           id="searchInput"
                                           placeholder="Cari laporan..." 
                                           class="pl-10 pr-4 py-2 border rounded-lg w-full lg:w-64">
                                    <span class="material-icons-round absolute left-3 top-2.5 text-gray-400">search</span>
                                </div>
                            </div>
                        </div>

                        <!-- Table Section -->
                        <div class="overflow-x-auto p-6">
                            <table id="reports-table" class="w-full table-auto">
    <thead class="bg-gray-50">
        <tr class="text-left text-sm font-medium text-[#002F35] border-b">
            <th class="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-[#00899B]" data-sort="id">
                ID
                <span class="material-icons-round text-sm align-middle ml-1">unfold_more</span>
            </th>
            <th class="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-[#00899B]" data-sort="nama">
                Nama
                <span class="material-icons-round text-sm align-middle ml-1">unfold_more</span>
            </th>
            <th class="px-6 py-4">
                Judul
            </th>
            <th class="px-6 py-4">
                Deskripsi
            </th>
            <th class="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-[#00899B]" data-sort="jenis">
                Jenis
                <span class="material-icons-round text-sm align-middle ml-1">unfold_more</span>
            </th>
            <th class="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-[#00899B]" data-sort="tanggal_kejadian">
                Tanggal Kejadian
                <span class="material-icons-round text-sm align-middle ml-1">unfold_more</span>
            </th>
            <th class="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-[#00899B]" data-sort="created_at">
                Tanggal Masuk
                <span class="material-icons-round text-sm align-middle ml-1">unfold_more</span>
            </th>
            <th class="px-6 py-4">
                Alamat
            </th>
            <th class="px-6 py-4">
                Status
            </th>
            <th class="px-6 py-4">
                Aksi
            </th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>
                        </div>

                        <!-- Pagination Section -->
                        <div class="p-6 border-t">
                            <div class="flex flex-col lg:flex-row items-center justify-between gap-4">
                                <div class="text-sm text-[#002F35]">
                                    Menampilkan 1-10 dari 100 laporan
                                </div>
                                <div class="flex gap-2">
                                    <button class="px-3 py-1 border rounded hover:bg-gray-50 text-sm text-[#002F35]">Previous</button>
                                    <button class="px-3 py-1 bg-[#002F35] text-white rounded hover:bg-opacity-90 text-sm">1</button>
                                    <button class="px-3 py-1 border rounded hover:bg-gray-50 text-sm text-[#002F35]">2</button>
                                    <button class="px-3 py-1 border rounded hover:bg-gray-50 text-sm text-[#002F35]">3</button>
                                    <button class="px-3 py-1 border rounded hover:bg-gray-50 text-sm text-[#002F35]">Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;

    Sidebar.afterRender();
    AdminHeader.afterRender();

    const headers = document.querySelectorAll('th[data-sort]');
    headers.forEach((header) => {
      header.addEventListener('click', () => {
        const key = header.getAttribute('data-sort');
        this.updateSort(key);

        headers.forEach((h) => {
          const icon = h.querySelector('.material-icons-round');
          if (h === header) {
            icon.textContent = this.sortConfig.direction === 'asc' ? 'arrow_upward' : 'arrow_downward';
          } else {
            icon.textContent = 'unfold_more';
          }
        });
      });
    });
  },

  cleanup() {
    Loading.hide();
  }
};

export default LaporanMasuk;