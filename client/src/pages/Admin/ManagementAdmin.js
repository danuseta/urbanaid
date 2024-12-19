import Sidebar from '../../components/admin/Sidebar.js';
import AdminHeader from '../../components/admin/AdminHeader.js';
import Loading from '../../components/common/Loading.js';
import AuthService from '../../services/auth-service.js';
import Swal from 'sweetalert2';
import '../../styles/admin.css';

const BASE_URL = 'https://urbanaid-server.up.railway.app/api';

const ManagementAdmin = {
  admins: [],
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
      await this.loadAdmins();
      Sidebar.afterRender();
      this.initializeEventListeners();
    } catch (error) {
      this.showErrorAlert('Gagal memuat halaman', error);
    }
  },

  async loadAdmins(page = 1, search = '') {
    try {
      Loading.show();
      const response = await fetch(
        `${BASE_URL}/superadmin/admins?page=${page}&limit=${this.limit}&search=${search}`, {
          headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`,
            'Content-Type': 'application/json'
          }
        });

      const result = await response.json();

      if (result.status === 'fail') {
        throw new Error(result.message);
      }

      this.admins = result.data.data;
      this.currentPage = result.data.page;
      this.totalPages = result.data.totalPages;

      this.updateAdminsTable();
      this.updatePagination();
    } catch (error) {
      this.showErrorAlert('Gagal memuat data admin', error);
    } finally {
      Loading.hide();
    }
  },

  updateAdminsTable() {
    const tbody = document.querySelector('#admins-table tbody');
    if (!tbody) return;

    if (!Array.isArray(this.admins) || this.admins.length === 0) {
      tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                        Tidak ada data admin
                    </td>
                </tr>
            `;
      return;
    }

    tbody.innerHTML = this.admins.map((admin) => `
    <tr class="border-b border-gray-200 hover:bg-gray-50">
        <td class="px-6 py-4 text-[#002F35] whitespace-nowrap text-center">
            ${admin.last_login ? (() => {
    const date = new Date(admin.last_login);
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${hours}:${minutes}, ${day} ${month} ${year}`;
  })() : '-'}
        </td>
        <td class="px-6 py-4 text-[#002F35] whitespace-nowrap text-center">${admin.nama || '-'}</td>
        <td class="px-6 py-4 text-[#002F35] whitespace-nowrap text-center">${admin.email || '-'}</td>
        <td class="px-6 py-4 text-[#002F35] whitespace-nowrap text-center">${admin.role || '-'}</td>
        <td class="px-6 py-4 text-[#002F35] whitespace-nowrap">
            <div class="flex space-x-2 justify-center">
                ${admin.role !== 'superadmin' ? `
                    <button 
                        class="edit-admin inline-flex items-center justify-center p-2 min-w-[44px] min-h-[44px] bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                        data-id="${admin.id}"
                        title="Edit Admin">
                        <span class="material-icons-round text-base">edit</span>
                    </button>
                    <button 
                        class="delete-admin inline-flex items-center justify-center p-2 min-w-[44px] min-h-[44px] bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        data-id="${admin.id}"
                        title="Hapus Admin">
                        <span class="material-icons-round text-base">delete</span>
                    </button>
                ` : ''}
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

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.loadAdmins(1, e.target.value);
      });
    }

    const addButton = document.getElementById('addAdminBtn');
    if (addButton) {
      addButton.addEventListener('click', () => {
        this.showAddAdminModal();
      });
    }

    const tbody = document.querySelector('#admins-table tbody');
    if (tbody) {
      tbody.addEventListener('click', async (e) => {
        const button = e.target.closest('button');
        if (!button) return;


        if (button.classList.contains('edit-admin')) {
          const adminId = parseInt(button.dataset.id);
          const admin = this.admins.find((a) => a.id === adminId);
          if (admin) {
            console.log('Found admin:', admin);
            await this.showEditAdminModal(admin);
          }
        } else if (button.classList.contains('delete-admin')) {
          const adminId = button.dataset.id;
          await this.confirmDeleteAdmin(adminId);
        }
      });
    }

    const pagination = document.querySelector('.pagination-controls');
    if (pagination) {
      pagination.addEventListener('click', (e) => {
        const pageButton = e.target.closest('button[data-page]');
        if (pageButton) {
          const page = parseInt(pageButton.dataset.page);
          const searchTerm = searchInput?.value || '';
          this.loadAdmins(page, searchTerm);
        }
      });
    }
  },

  async showEditAdminModal(admin) {

    try {
      const { value: formValues } = await Swal.fire({
        title: 'Edit Admin',
        html: `
                    <div class="mb-3">
                        <input id="swal-input-name" 
                               class="w-full max-w-xs px-3 py-2 text-sm border rounded" 
                               placeholder="Nama Lengkap" 
                               value="${admin.nama || ''}"
                               required>
                    </div>
                    <div class="mb-3">
                        <input id="swal-input-email" 
                               class="w-full max-w-xs px-3 py-2 text-sm border rounded" 
                               type="email" 
                               placeholder="Email" 
                               value="${admin.email || ''}"
                               required>
                    </div>
                    <div class="mb-3">
                        <input id="swal-input-password" 
                               class="w-full max-w-xs px-3 py-2 text-sm border rounded" 
                               type="password" 
                               placeholder="Password Baru (opsional)">
                    </div>
                    <div class="mb-3">
                        <select id="swal-input-role" class="w-full max-w-xs px-3 py-2 text-sm border rounded">
                            <option value="admin" ${admin.role === 'admin' ? 'selected' : ''}>Admin</option>
                        </select>
                    </div>
                `,
        width: '300px',
        customClass: {
          container: 'mobile-friendly-modal',
          popup: 'rounded-lg',
          input: 'text-sm',
        },
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal',
        focusConfirm: false,
        preConfirm: () => {
          const nama = document.getElementById('swal-input-name').value;
          const email = document.getElementById('swal-input-email').value;
          const password = document.getElementById('swal-input-password').value;
          const role = document.getElementById('swal-input-role').value;

          if (!nama || !email) {
            Swal.showValidationMessage('Nama dan email wajib diisi');
            return false;
          }

          const updateData = { nama, email, role };
          if (password) {
            updateData.password = password;
          }

          return updateData;
        }
      });

      if (formValues) {
        await this.updateAdmin(admin.id, formValues);
      }
    } catch (error) {
      console.error('Error in showEditAdminModal:', error);
      this.showErrorAlert('Error showing edit modal', error);
    }
  },

  async showAddAdminModal() {
    try {
      const { value: formValues } = await Swal.fire({
        title: 'Tambah Admin Baru',
        html: `
          <div class="mb-3">
            <input id="swal-input-name" 
                   class="w-full max-w-xs px-3 py-2 text-sm border rounded" 
                   placeholder="Nama Lengkap"
                   required>
          </div>
          <div class="mb-3">
            <input id="swal-input-email" 
                   class="w-full max-w-xs px-3 py-2 text-sm border rounded" 
                   type="email" 
                   placeholder="Email"
                   required>
          </div>
          <div class="mb-3">
            <input id="swal-input-password" 
                   class="w-full max-w-xs px-3 py-2 text-sm border rounded" 
                   type="password" 
                   placeholder="Password"
                   required>
          </div>
          <div class="mb-3">
            <select id="swal-input-role" class="w-full max-w-xs px-3 py-2 text-sm border rounded">
              <option value="admin">Admin</option>
            </select>
          </div>
        `,
        width: '300px',
        customClass: {
          container: 'mobile-friendly-modal',
          popup: 'rounded-lg',
          input: 'text-sm',
        },
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal',
        focusConfirm: false,
        preConfirm: () => {
          const nama = document.getElementById('swal-input-name').value;
          const email = document.getElementById('swal-input-email').value;
          const password = document.getElementById('swal-input-password').value;
          const role = document.getElementById('swal-input-role').value;

          if (!nama || !email || !password) {
            Swal.showValidationMessage('Semua field harus diisi');
            return false;
          }

          return { nama, email, password, role };
        }
      });

      if (formValues) {
        await this.addAdmin(formValues);
      }
    } catch (error) {
      console.error('Error in showAddAdminModal:', error);
      this.showErrorAlert('Error menampilkan modal tambah admin', error);
    }
  },

  async addAdmin(adminData) {
    try {
      Loading.show();
      const response = await fetch(`${BASE_URL}/superadmin/admins`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal menambahkan admin');
      }

      await this.loadAdmins(this.currentPage);
      this.showSuccessAlert('Admin berhasil ditambahkan');
    } catch (error) {
      this.showErrorAlert('Gagal menambahkan admin', error);
    } finally {
      Loading.hide();
    }
  },

  async updateAdmin(adminId, adminData) {
    try {
      Loading.show();
      const response = await fetch(`${BASE_URL}/superadmin/admins/${adminId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal memperbarui admin');
      }

      await this.loadAdmins(this.currentPage);
      this.showSuccessAlert('Admin berhasil diperbarui');
    } catch (error) {
      this.showErrorAlert('Gagal memperbarui admin', error);
    } finally {
      Loading.hide();
    }
  },

  async confirmDeleteAdmin(adminId) {
    const result = await Swal.fire({
      title: 'Konfirmasi Hapus',
      text: 'Apakah Anda yakin ingin menghapus admin ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      await this.deleteAdmin(adminId);
    }
  },

  async deleteAdmin(adminId) {
    try {
      Loading.show();
      const response = await fetch(`${BASE_URL}/superadmin/admins/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal menghapus admin');
      }

      await this.loadAdmins(this.currentPage);
      this.showSuccessAlert('Admin berhasil dihapus');
    } catch (error) {
      this.showErrorAlert('Gagal menghapus admin', error);
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
                            <h1 class="text-xl lg:text-2xl font-bold text-[#002F35]">Manajemen Admin</h1>
                            <button 
                                id="addAdminBtn" 
                                class="px-4 py-2 bg-[#002F35] text-white rounded-lg hover:bg-opacity-90 transition-colors">
                                Tambah Admin
                            </button>
                        </div>

                        <!-- Filters Section -->
                        <div class="p-6 border-b">
                            <div class="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                                <div class="relative">
                                    <input type="text" 
                                           id="searchInput"
                                           placeholder="Cari admin..." 
                                           class="pl-10 pr-4 py-2 border rounded-lg w-full lg:w-64">
                                    <span class="material-icons-round absolute left-3 top-2.5 text-gray-400">search</span>
                                </div>
                            </div>
                        </div>

                        <!-- Table Section -->
                        <div class="overflow-x-auto p-6">
<table id="admins-table" class="w-full table-auto">
    <thead class="bg-gray-50">
        <tr class="text-center text-sm font-medium text-[#002F35] border-b">
            <th class="px-6 py-4 whitespace-nowrap text-center">Last Login</th>
            <th class="px-6 py-4 whitespace-nowrap text-center">Nama</th>
            <th class="px-6 py-4 whitespace-nowrap text-center">Email</th>
            <th class="px-6 py-4 whitespace-nowrap text-center">Role</th>
            <th class="px-6 py-4 whitespace-nowrap text-center">Aksi</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>
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

export default ManagementAdmin;