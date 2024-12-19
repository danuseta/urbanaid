import AdminHeader from '../../components/admin/AdminHeader.js';
import Sidebar from '../../components/admin/Sidebar.js';
import Loading from '../../components/common/Loading.js';
import RiwayatService from '../../services/riwayat-service.js';
import { hashId } from '../../utils/hash-util.js';
import '../../styles/admin.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const RiwayatAdmin = {
  reports: [],
  rawReports: [],
  sortConfig: {
    key: null,
    direction: 'asc'
  },

  pagination: {
    currentPage: 1,
    totalRows: 0,
    rowsPerPage: 10
  },

  async init() {
    try {
      await this.render();
      await this.loadReports();
      Sidebar.afterRender();
      this.initializeEventListeners();
    } catch (error) {
      console.error('Error in RiwayatAdmin init:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Terjadi kesalahan saat memuat halaman'
      });
    }
  },


  async loadReports() {
    try {
      Loading.show();
      this.rawReports = await RiwayatService.getAdminRiwayat();

      if (this.rawReports) {
        this.reports = this.rawReports.map((report) => ({
          created_at: new Date(report.created_at).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          nama_pelapor: report.nama_pelapor,
          judul: report.judul,
          jenis_infrastruktur: report.jenis_infrastruktur,
          deskripsi: report.deskripsi,
          tanggal_kejadian: new Date(report.tanggal_kejadian).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          tanggal_selesai: new Date(report.tanggal_selesai).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          alamat: report.alamat,
          status: report.status,
          keterangan_laporan: report.keterangan_laporan,
          bukti_lampiran: report.bukti_lampiran,
          latitude: report.latitude,
          longitude: report.longitude
        }));

        this.updateTableDisplay();
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message
      });
    } finally {
      Loading.hide();
    }
  },

  exportToPDF() {
    try {
      const doc = new jsPDF('landscape');

      doc.setFontSize(18);
      doc.text('Laporan Riwayat Infrastruktur', 15, 15);

      const tableData = this.rawReports.map((report) => [
        new Date(report.created_at).toLocaleDateString('id-ID'),
        report.nama_pelapor,
        report.judul,
        report.jenis_infrastruktur,
        report.deskripsi,
        new Date(report.tanggal_kejadian).toLocaleDateString('id-ID'),
        new Date(report.tanggal_selesai).toLocaleDateString('id-ID'),
        report.alamat,
        report.status,
        report.keterangan_laporan,
        report.bukti_lampiran,
        report.latitude,
        report.longitude
      ]);

      const columns = [
        'Tanggal Masuk',
        'Nama Pelapor',
        'Judul',
        'Jenis Infrastruktur',
        'Deskripsi',
        'Tanggal Kejadian',
        'Tanggal Selesai',
        'Alamat',
        'Status',
        'Keterangan',
        'Bukti Lampiran',
        'Latitude',
        'Longitude'
      ];

      doc.autoTable({
        head: [columns],
        body: tableData,
        startY: 25,
        styles: { fontSize: 8, cellPadding: 1 },
        columnStyles: {
          4: { cellWidth: 40 },
          7: { cellWidth: 40 },
          9: { cellWidth: 40 },
          10: {
            cellWidth: 40,
            textColor: [0, 0, 255],
            fontStyle: 'underline'
          }
        },
        didDrawCell: function (data) {
          if (data.column.index === 10 && data.cell.section === 'body') {
            const url = data.cell.raw;
            doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url });
          }
        }
      });

      doc.save('riwayat-laporan.pdf');

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'File PDF berhasil diunduh'
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal mengunduh file PDF'
      });
    }
  },

  exportToExcel() {
    try {
      const excelData = this.rawReports.map((report) => ({
        'Tanggal Masuk': new Date(report.created_at).toLocaleDateString('id-ID'),
        'Nama Pelapor': report.nama_pelapor,
        'Judul': report.judul,
        'Jenis Infrastruktur': report.jenis_infrastruktur,
        'Deskripsi': report.deskripsi.length > 20 ? `${report.deskripsi.substring(0, 20)  }...` : report.deskripsi,
        'Tanggal Kejadian': new Date(report.tanggal_kejadian).toLocaleDateString('id-ID'),
        'Tanggal Selesai': new Date(report.tanggal_selesai).toLocaleDateString('id-ID'),
        'Alamat': report.alamat.length > 20 ? `${report.alamat.substring(0, 20)  }...` : report.alamat,
        'Status': report.status,
        'Keterangan': report.keterangan_laporan,
        'Bukti Lampiran': report.bukti_lampiran,
        'Latitude': report.latitude,
        'Longitude': report.longitude
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);

      const columnWidths = [];
      excelData.forEach((report) => {
        Object.keys(report).forEach((key, index) => {
          const value = report[key] ? report[key].toString() : '';
          const length = value.length;
          columnWidths[index] = Math.max(columnWidths[index] || 0, length);
        });
      });

      const buktiLampiranIndex = Object.keys(excelData[0]).indexOf('Bukti Lampiran');
      columnWidths[buktiLampiranIndex] = 50;

      ws['!cols'] = columnWidths.map((width) => ({ wch: width + 5 }));

      const range = XLSX.utils.decode_range(ws['!ref']);
      const buktiLampiranCol = Object.keys(excelData[0]).indexOf('Bukti Lampiran');

      for (let row = range.s.r + 1; row <= range.e.r; row++) {
        const cell = XLSX.utils.encode_cell({ r: row, c: buktiLampiranCol });
        if (ws[cell] && ws[cell].v) {
          ws[cell].l = { Target: ws[cell].v };
        }
      }

      const deskripsiCol = Object.keys(excelData[0]).indexOf('Deskripsi');
      const alamatCol = Object.keys(excelData[0]).indexOf('Alamat');

      for (let row = range.s.r + 1; row <= range.e.r; row++) {
        const deskripsiCell = XLSX.utils.encode_cell({ r: row, c: deskripsiCol });
        const alamatCell = XLSX.utils.encode_cell({ r: row, c: alamatCol });

        if (ws[deskripsiCell]) {
          ws[deskripsiCell].s = { alignment: { wrapText: true } };
        }
        if (ws[alamatCell]) {
          ws[alamatCell].s = { alignment: { wrapText: true } };
        }
      }

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Riwayat Laporan');

      XLSX.writeFile(wb, 'riwayat-laporan.xlsx');

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'File Excel berhasil diunduh'
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal mengunduh file Excel'
      });
    }
  },

  sortData(reports, key) {
    return [...reports].sort((a, b) => {
      let comparison = 0;

      if (key.includes('tanggal') || key === 'created_at') {
        const parseDate = (dateStr) => {
          const parts = dateStr.split(' ');
          const months = {
            'Januari': '01', 'Februari': '02', 'Maret': '03',
            'April': '04', 'Mei': '05', 'Juni': '06',
            'Juli': '07', 'Agustus': '08', 'September': '09',
            'Oktober': '10', 'November': '11', 'Desember': '12'
          };
          const day = parts[0];
          const month = months[parts[1]];
          const year = parts[2];
          return new Date(`${year}-${month}-${day}`);
        };

        const dateA = parseDate(a[key]);
        const dateB = parseDate(b[key]);
        comparison = dateA - dateB;
      }
      else if (typeof a[key] === 'string') {
        comparison = a[key].localeCompare(b[key]);
      }

      return this.sortConfig.direction === 'desc' ? -comparison : comparison;
    });
  },

  updateSort(key) {
    if (this.sortConfig.key === key) {
      this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortConfig.key = key;
      this.sortConfig.direction = 'asc';
    }

    this.pagination.currentPage = 1;
    this.updateTableDisplay();
    this.updateSortIcons();
  },

  getFilteredReports() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter')?.value.toLowerCase();

    let filtered = this.reports;

    if (searchTerm) {
      filtered = filtered.filter((report) =>
        Object.values(report).some((value) =>
          value && value.toString().toLowerCase().includes(searchTerm)
        )
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((report) =>
        report.status.toLowerCase() === statusFilter
      );
    }

    if (this.sortConfig.key) {
      filtered = this.sortData(filtered, this.sortConfig.key);
    }

    return filtered;
  },

  getPaginatedData() {
    const filtered = this.getFilteredReports();
    const startIndex = (this.pagination.currentPage - 1) * this.pagination.rowsPerPage;
    const endIndex = startIndex + this.pagination.rowsPerPage;

    return filtered.slice(startIndex, endIndex);
  },

  updateTableDisplay() {
    const tbody = document.querySelector('#reports-table tbody');
    if (!tbody) return;

    const filteredData = this.getFilteredReports();
    this.pagination.totalRows = filteredData.length;
    const paginatedData = this.getPaginatedData();

    tbody.innerHTML = paginatedData.length === 0 ? `
            <tr>
                <td colspan="9" class="px-6 py-4 text-center text-gray-500">
                    Tidak ada riwayat laporan yang ditemukan
                </td>
            </tr>
        ` : paginatedData.map((report) => `
            <tr class="border-b border-gray-200 hover:bg-gray-50">
                <td class="px-6 py-4 text-[#002F35] whitespace-nowrap">${report.created_at}</td>
                <td class="px-6 py-4 text-[#002F35] whitespace-nowrap">${report.nama_pelapor}</td>
                <td class="px-6 py-4 text-[#002F35]">
                    <div class="max-w-[200px] line-clamp-1">${report.judul}</div>
                </td>
                <td class="px-6 py-4 text-[#002F35] whitespace-nowrap">${report.jenis_infrastruktur}</td>
                <td class="px-6 py-4 text-[#002F35] whitespace-nowrap">${report.tanggal_kejadian}</td>
                <td class="px-6 py-4 text-[#002F35] whitespace-nowrap">${report.tanggal_selesai}</td>
                <td class="px-6 py-4 text-[#002F35]">
                    <div class="max-w-[200px] line-clamp-1">${report.alamat}</div>
                </td>
                <td class="px-6 py-4 text-[#002F35] whitespace-nowrap">
                    <span class="px-2 py-1 rounded-full text-xs ${
  report.status === 'diterima' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
}">
                        ${report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                </td>
                <td class="px-6 py-4 text-[#002F35] whitespace-nowrap">
                    <a href="/admin/riwayat/${hashId(report.id)}" 
                       class="inline-flex items-center justify-center p-3 min-w-[44px] min-h-[44px] bg-[#002F35] text-white rounded-lg hover:bg-opacity-90 transition-colors">
                        <span class="material-icons-round text-lg">visibility</span>
                    </a>
                </td>
            </tr>
        `).join('');

    this.updatePagination();
    this.updateSortIcons();
  },

  updatePagination() {
    const totalPages = Math.ceil(this.pagination.totalRows / this.pagination.rowsPerPage);
    const startIndex = (this.pagination.currentPage - 1) * this.pagination.rowsPerPage;
    const endIndex = Math.min(startIndex + this.pagination.rowsPerPage, this.pagination.totalRows);

    const paginationInfo = document.querySelector('.pagination-info');
    if (paginationInfo) {
      paginationInfo.textContent = `Menampilkan ${startIndex + 1}-${endIndex} dari ${this.pagination.totalRows} laporan`;
    }

    const paginationButtons = document.querySelector('.pagination-buttons');
    if (paginationButtons) {
      const maxVisiblePages = 5;
      let startPage = Math.max(1, this.pagination.currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      let buttonsHTML = `
                <button class="px-3 py-1 border rounded hover:bg-gray-50 text-sm text-[#002F35] ${
  this.pagination.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
}" 
                ${this.pagination.currentPage === 1 ? 'disabled' : ''}
                data-action="prev">Previous</button>
            `;

      for (let i = startPage; i <= endPage; i++) {
        buttonsHTML += `
                    <button class="px-3 py-1 ${
  i === this.pagination.currentPage ? 'bg-[#002F35] text-white' : 'border'
} rounded hover:bg-opacity-90 text-sm" data-page="${i}">${i}</button>
                `;
      }

      buttonsHTML += `
                <button class="px-3 py-1 border rounded hover:bg-gray-50 text-sm text-[#002F35] ${
  this.pagination.currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
}"
                ${this.pagination.currentPage === totalPages ? 'disabled' : ''}
                data-action="next">Next</button>
            `;

      paginationButtons.innerHTML = buttonsHTML;
    }
  },

  updateSortIcons() {
    const headers = document.querySelectorAll('th[data-sort]');
    headers.forEach((header) => {
      const icon = header.querySelector('.material-icons-round');
      const key = header.getAttribute('data-sort');

      if (key === this.sortConfig.key) {
        icon.textContent = this.sortConfig.direction === 'asc' ? 'arrow_upward' : 'arrow_downward';
      } else {
        icon.textContent = 'unfold_more';
      }
    });
  },

  initializeEventListeners() {
    const sortHeaders = document.querySelectorAll('th[data-sort]');

    sortHeaders.forEach((header) => {
      header.addEventListener('click', (e) => {
        const key = header.getAttribute('data-sort');
        this.updateSort(key);
        e.stopPropagation();
      });
    });

    document.getElementById('searchInput')?.addEventListener('input', () => {
      this.pagination.currentPage = 1;
      this.updateTableDisplay();
    });

    document.getElementById('statusFilter')?.addEventListener('change', () => {
      this.pagination.currentPage = 1;
      this.updateTableDisplay();
    });

    document.getElementById('rowsPerPage')?.addEventListener('change', (e) => {
      this.pagination.rowsPerPage = parseInt(e.target.value);
      this.pagination.currentPage = 1;
      this.updateTableDisplay();
    });

    document.addEventListener('click', (e) => {
      const button = e.target.closest('button[data-page], button[data-action]');
      if (!button) return;

      if (button.dataset.page) {
        this.pagination.currentPage = parseInt(button.dataset.page);
      } else if (button.dataset.action === 'prev') {
        if (this.pagination.currentPage > 1) {
          this.pagination.currentPage--;
        }
      } else if (button.dataset.action === 'next') {
        const totalPages = Math.ceil(this.pagination.totalRows / this.pagination.rowsPerPage);
        if (this.pagination.currentPage < totalPages) {
          this.pagination.currentPage++;
        }
      }

      this.updateTableDisplay();
    });

    document.getElementById('exportPDF')?.addEventListener('click', () => {
      this.exportToPDF();
    });

    document.getElementById('exportExcel')?.addEventListener('click', () => {
      this.exportToExcel();
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
                            <h1 class="text-xl lg:text-2xl font-bold text-[#002F35]">Riwayat Laporan</h1>
                        </div>

                        <!-- Filters and Export Section -->
                        <div class="p-6 border-b">
                            <div class="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                                <div class="flex flex-col lg:flex-row gap-4 lg:items-center">
                                    <div class="relative">
                                        <input type="text" 
                                               id="searchInput"
                                               placeholder="Cari laporan..." 
                                               class="pl-10 pr-4 py-2 border rounded-lg w-full lg:w-64">
                                        <span class="material-icons-round absolute left-3 top-2.5 text-gray-400">search</span>
                                    </div>
                                    
                                    <select id="statusFilter" 
                                            class="border rounded-lg px-4 py-2">
                                        <option value="">Semua Status</option>
                                        <option value="diterima">Diterima</option>
                                        <option value="ditolak">Ditolak</option>
                                    </select>

                                    <select id="rowsPerPage"
                                            class="border rounded-lg px-4 py-2">
                                        <option value="10">10 Baris</option>
                                        <option value="25">25 Baris</option>
                                        <option value="9999">Semua</option>
                                    </select>
                                </div>
                                
                                <!-- Export Buttons -->
                                <div class="flex gap-4">
                                    <button id="exportPDF" 
                                            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                        <span class="material-icons-round align-middle mr-2">picture_as_pdf</span>
                                        Export PDF
                                    </button>
                                    <button id="exportExcel" 
                                            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                        <span class="material-icons-round align-middle mr-2">table_view</span>
                                        Export Excel
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Table Section -->
                        <div class="overflow-x-auto p-6">
                            <table id="reports-table" class="w-full table-auto">
                                <thead class="bg-gray-50 text-center">
    <tr class="text-center text-sm font-medium text-[#002F35] border-b">
        <th class="px-6 py-4 whitespace-nowrap text-center cursor-pointer hover:bg-[#00899B]" data-sort="created_at">
            Tanggal Masuk
            <span class="material-icons-round text-sm align-middle ml-1">unfold_more</span>
        </th>
        <th class="px-6 py-4 whitespace-nowrap text-center cursor-pointer hover:bg-[#00899B]" data-sort="nama_pelapor">
            Nama
            <span class="material-icons-round text-sm align-middle ml-1">unfold_more</span>
        </th>
        <th class="px-6 py-4 text-center">
            Judul
        </th>
        <th class="px-6 py-4 whitespace-nowrap text-center cursor-pointer hover:bg-[#00899B]" data-sort="jenis_infrastruktur">
            Jenis
            <span class="material-icons-round text-sm align-middle ml-1">unfold_more</span>
        </th>
        <th class="px-6 py-4 whitespace-nowrap text-center cursor-pointer hover:bg-[#00899B]" data-sort="tanggal_kejadian">
            Tanggal Kejadian
            <span class="material-icons-round text-sm align-middle ml-1">unfold_more</span>
        </th>
        <th class="px-6 py-4 whitespace-nowrap text-center cursor-pointer hover:bg-[#00899B]" data-sort="tanggal_selesai">
            Tanggal Selesai
            <span class="material-icons-round text-sm align-middle ml-1">unfold_more</span>
        </th>
        <th class="px-6 py-4 text-center">
            Alamat
        </th>
        <th class="px-6 py-4 whitespace-nowrap text-center cursor-pointer hover:bg-[#00899B]" data-sort="status">
            Status
            <span class="material-icons-round text-sm align-middle ml-1">unfold_more</span>
        </th>
        <th class="px-6 py-4 text-center">
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
                                <div class="pagination-info text-sm text-[#002F35]">
                                </div>
                                <div class="pagination-buttons flex gap-2">
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;

    const style = document.createElement('style');
    style.textContent = `
            th[data-sort] { 
                position: relative;
                cursor: pointer;
                user-select: none;
                transition: all 0.2s ease;
            }
            th[data-sort]:hover { 
                color: white;
            }
            .material-icons-round {
                transition: transform 0.2s ease;
            }
            th[data-sort] .material-icons-round {
                font-size: 18px;
                vertical-align: middle;
                margin-left: 4px;
            }
            @media (max-width: 768px) {
                th[data-sort] { 
                    padding: 8px 4px;
                }
                th[data-sort] .material-icons-round {
                    font-size: 16px;
                }
            }
        `;
    document.head.appendChild(style);

    AdminHeader.afterRender();
  },

  cleanup() {
    Loading.hide();
  }
};

export default RiwayatAdmin;