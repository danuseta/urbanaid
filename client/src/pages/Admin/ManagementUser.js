import Sidebar from '../../components/admin/Sidebar.js';
import AdminHeader from '../../components/admin/AdminHeader.js';
import Loading from '../../components/common/Loading.js';
import AuthService from '../../services/auth-service.js';
import Swal from 'sweetalert2';
import '../../styles/admin.css';

const BASE_URL = 'https://urbanaid-server.up.railway.app/api';

const ManagementUser = {
  users: [],
  currentPage: 1,
  totalPages: 1,
  limit: 10,

  async init() {
    try {
      if (!AuthService.isSuperAdmin()) {
        window.location.href = '/admin';
        return;
      }

      await this.render();
      await this.loadUsers();
      Sidebar.afterRender();
      this.initializeEventListeners();
    } catch (error) {
      this.showErrorAlert('Gagal memuat halaman', error);
    }
  },

  async loadUsers(page = 1, search = '') {
    try {
      Loading.show();
      const response = await fetch(
        `${BASE_URL}/superadmin/users?page=${page}&limit=${this.limit}&search=${search}`, {
          headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`,
            'Content-Type': 'application/json'
          }
        });

      const result = await response.json();

      if (result.status === 'fail') {
        throw new Error(result.message);
      }

      this.users = result.data.data;
      this.currentPage = result.data.page;
      this.totalPages = result.data.totalPages;

      this.updateUsersTable();
      this.updatePagination();
    } catch (error) {
      this.showErrorAlert('Gagal memuat data pengguna', error);
    } finally {
      Loading.hide();
    }
  },

  updateUsersTable() {
    const tbody = document.querySelector('#users-table tbody');
    if (!tbody) return;

    if (!Array.isArray(this.users) || this.users.length === 0) {
      tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                        Tidak ada data pengguna
                    </td>
                </tr>
            `;
      return;
    }

    tbody.innerHTML = this.users.map((user) => `
            <tr class="border-b border-gray-200 hover:bg-gray-50">
                <td class="px-6 py-4 text-[#002F35] whitespace-nowrap">${user.id || '-'}</td>
                <td class="px-6 py-4 text-[#002F35] whitespace-nowrap">${user.nama || '-'}</td>
                <td class="px-6 py-4 text-[#002F35] whitespace-nowrap">${user.email || '-'}</td>
                <td class="px-6 py-4 text-[#002F35] whitespace-nowrap">
                    ${user.total_laporan || 0} Laporan
                </td>
<td class="px-6 py-4 text-[#002F35] whitespace-nowrap">
  <div class="flex space-x-2 justify-center"> 
      <button 
          class="view-reports inline-flex items-center justify-center p-2 min-w-[44px] min-h-[44px] bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          data-id="${user.id}"
          title="Lihat Laporan">
          <span class="material-icons-round text-base">description</span>
      </button>
      <button 
          class="edit-user inline-flex items-center justify-center p-2 min-w-[44px] min-h-[44px] bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          data-id="${user.id}"
          title="Edit User">
          <span class="material-icons-round text-base">edit</span>
      </button>
      <button 
          class="delete-user inline-flex items-center justify-center p-2 min-w-[44px] min-h-[44px] bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          data-id="${user.id}"
          title="Hapus User">
          <span class="material-icons-round text-base">delete</span>
      </button>
  </div>
</td>
            </tr>
        `).join('');
  },

  updatePagination() {
    const paginationDiv = document.querySelector('.pagination-controls');
    if (!paginationDiv) return;

    let paginationHTML = `
            <button 
                class="px-3 py-1 border rounded hover:bg-gray-50 text-sm text-[#002F35] ${this.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}"
                ${this.currentPage === 1 ? 'disabled' : ''}
                data-page="${this.currentPage - 1}">
                Previous
            </button>
        `;

    for (let i = 1; i <= this.totalPages; i++) {
      paginationHTML += `
                <button 
                    class="px-3 py-1 ${this.currentPage === i ? 'bg-[#002F35] text-white' : 'border'} rounded hover:bg-opacity-90 text-sm"
                    data-page="${i}">
                    ${i}
                </button>
            `;
    }

    paginationHTML += `
            <button 
                class="px-3 py-1 border rounded hover:bg-gray-50 text-sm text-[#002F35] ${this.currentPage === this.totalPages ? 'opacity-50 cursor-not-allowed' : ''}"
                ${this.currentPage === this.totalPages ? 'disabled' : ''}
                data-page="${this.currentPage + 1}">
                Next
            </button>
        `;

    paginationDiv.innerHTML = paginationHTML;
  },

  initializeEventListeners() {
    document.getElementById('searchInput')?.addEventListener('input', (e) => {
      this.loadUsers(1, e.target.value);
    });

    document.querySelector('#users-table tbody')?.addEventListener('click', (e) => {
      const viewBtn = e.target.closest('.view-reports');
      const editBtn = e.target.closest('.edit-user');
      const deleteBtn = e.target.closest('.delete-user');

      if (viewBtn) {
        const userId = viewBtn.getAttribute('data-id');
        this.viewUserReports(userId);
      }

      if (editBtn) {
        const userId = editBtn.getAttribute('data-id');
        this.showEditUserModal(userId);
      }

      if (deleteBtn) {
        const userId = deleteBtn.getAttribute('data-id');
        this.confirmDeleteUser(userId);
      }
    });

    document.querySelector('.pagination-controls')?.addEventListener('click', (e) => {
      const pageButton = e.target.closest('button[data-page]');
      if (pageButton) {
        const page = parseInt(pageButton.getAttribute('data-page'));
        const searchTerm = document.getElementById('searchInput')?.value || '';
        this.loadUsers(page, searchTerm);
      }
    });
  },

  async viewUserReports(userId) {
    try {
      Loading.show();
      const response = await fetch(`${BASE_URL}/superadmin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Gagal memuat laporan pengguna');
      }

      const data = await response.json();
      const user = data.data.user;
      const reports = data.data.reports;

      const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };

      const getStatusBadgeClass = (status, jenisLaporan) => {
        if (jenisLaporan === 'aktif') {
          return status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800';
        } else {
          return status === 'diterima' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
        }
      };

      Swal.fire({
        title: `Laporan ${user.nama}`,
        html: `
                <div class="text-left">
                    ${reports.length > 0 ? reports.map((report) => `
                        <div class="mb-4 p-4 border rounded ${report.jenis_laporan === 'aktif' ? 'border-blue-200' : 'border-gray-200'}">
                            <div class="flex justify-between items-start">
                                <div class="font-bold">${report.judul}</div>
                                <span class="text-xs px-2 py-1 rounded ${report.jenis_laporan === 'aktif' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'}">
                                    ${report.jenis_laporan === 'aktif' ? 'Laporan Aktif' : 'Riwayat Laporan'}
                                </span>
                            </div>
                            <div class="text-sm text-gray-600">
                                <div class="mt-1">
                                    Status: <span class="px-2 py-1 rounded text-xs ${getStatusBadgeClass(report.status, report.jenis_laporan)}">
                                        ${report.status}
                                    </span>
                                </div>
                                <div class="mt-1">Jenis: ${report.jenis_infrastruktur}</div>
                                <div class="mt-1">Tanggal Kejadian: ${formatDate(report.tanggal_kejadian)}</div>
                                ${report.jenis_laporan === 'riwayat' ? `
                                    <div class="mt-1">Tanggal Selesai: ${formatDate(report.tanggal_selesai)}</div>
                                    <div class="mt-1">Keterangan: ${report.keterangan_laporan}</div>
                                ` : ''}
                            </div>
                            <div class="mt-2 text-sm border-t pt-2">${report.deskripsi}</div>
                        </div>
                    `).join('') : '<div class="text-center p-4">Tidak ada laporan</div>'}
                </div>
            `,
        width: '600px',
        confirmButtonText: 'Tutup',
        customClass: {
          htmlContainer: 'max-h-[70vh] overflow-y-auto'
        }
      });

    } catch (error) {
      this.showErrorAlert('Gagal memuat laporan', error);
    } finally {
      Loading.hide();
    }
  },

  async showEditUserModal(userId) {
    try {
      const user = this.users.find((u) => u.id === parseInt(userId));
      if (!user) {
        throw new Error('User not found');
      }

      const { value: formValues } = await Swal.fire({
        title: 'Edit Pengguna',
        html: `
                    <div class="mb-3">
                        <input id="swal-input-name" 
                               class="w-full max-w-xs px-3 py-2 text-sm border rounded" 
                               placeholder="Nama Lengkap" 
                               value="${user.nama || ''}"
                               required>
                    </div>
                    <div class="mb-3">
                        <input id="swal-input-email" 
                               class="w-full max-w-xs px-3 py-2 text-sm border rounded" 
                               type="email" 
                               placeholder="Email" 
                               value="${user.email || ''}"
                               required>
                    </div>
                    <div class="mb-3">
                        <input id="swal-input-password" 
                               class="w-full max-w-xs px-3 py-2 text-sm border rounded" 
                               type="password" 
                               placeholder="Password Baru (opsional)">
                    </div>
                `,
        width: '300px',
        customClass: {
          container: 'mobile-friendly-modal',
          popup: 'rounded-lg',
          input: 'text-sm',
        },
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal',
        preConfirm: () => {
          const nama = document.getElementById('swal-input-name').value;
          const email = document.getElementById('swal-input-email').value;
          const password = document.getElementById('swal-input-password').value;

          if (!nama || !email) {
            Swal.showValidationMessage('Nama dan email wajib diisi');
            return false;
          }

          const updateData = { nama, email };
          if (password) {
            updateData.password = password;
          }

          return updateData;
        }
      });

      if (formValues) {
        await this.updateUser(userId, formValues);
      }
    } catch (error) {
      this.showErrorAlert('Error showing edit modal', error);
    }
  },

  async updateUser(userId, userData) {
    try {
      Loading.show();
      const response = await fetch(`${BASE_URL}/superadmin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal memperbarui pengguna');
      }

      await this.loadUsers(this.currentPage);
      this.showSuccessAlert('Pengguna berhasil diperbarui');
    } catch (error) {
      this.showErrorAlert('Gagal memperbarui pengguna', error);
    } finally {
      Loading.hide();
    }
  },

  async confirmDeleteUser(userId) {
    const result = await Swal.fire({
      title: 'Konfirmasi Hapus',
      text: 'Apakah Anda yakin ingin menghapus pengguna ini? Semua laporan yang terkait akan ikut terhapus.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      await this.deleteUser(userId);
    }
  },

  async deleteUser(userId) {
    try {
      Loading.show();
      const response = await fetch(`${BASE_URL}/superadmin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal menghapus pengguna');
      }

      await this.loadUsers(this.currentPage);
      this.showSuccessAlert('Pengguna berhasil dihapus');
    } catch (error) {
      this.showErrorAlert('Gagal menghapus pengguna', error);
    } finally {
      Loading.hide();
    }
  },

  showSuccessAlert(message) {
    Swal.fire({
      icon: 'success',
      title: 'Sukses!',
      text: message,
      timer: 2000,
      timerProgressBar: true
    });
  },

  showErrorAlert(title, error) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: error.message || 'Terjadi kesalahan',
      confirmButtonText: 'OK'
    });
    console.error(error);
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
                        <div class="p-6 border-b flex justify-between items-center">
                            <h1 class="text-xl lg:text-2xl font-bold text-[#002F35]">Manajemen Pengguna</h1>
                        </div>

                        <!-- Filters Section -->
                        <div class="p-6 border-b">
                            <div class="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                                <div class="relative">
                                    <input type="text" 
                                           id="searchInput"
                                           placeholder="Cari pengguna..." 
                                           class="pl-10 pr-4 py-2 border rounded-lg w-full lg:w-64">
                                    <span class="material-icons-round absolute left-3 top-2.5 text-gray-400">search</span>
                                </div>
                            </div>
                        </div>

                        <!-- Table Section -->
                        <div class="overflow-x-auto p-6">
                            <table id="users-table" class="w-full table-auto">
                                <thead class="bg-gray-50">
                                    <tr class="text-center text-sm font-medium text-[#002F35] border-b">
                                        <th class="px-6 py-4 whitespace-nowrap">ID</th>
                                        <th class="px-6 py-4 whitespace-nowrap">Nama</th>
                                        <th class="px-6 py-4 whitespace-nowrap">Email</th>
                                        <th class="px-6 py-4 whitespace-nowrap">Total Laporan</th>
                                        <th class="px-6 py-4 whitespace-nowrap">Aksi</th>
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
                                    Showing page ${this.currentPage} of ${this.totalPages}
                                </div>
                                <div class="pagination-controls flex gap-2">
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;
  },

  cleanup() {
    Loading.hide();
  }
};

export default ManagementUser;