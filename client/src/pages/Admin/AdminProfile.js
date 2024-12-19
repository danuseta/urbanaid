import Sidebar from '../../components/admin/Sidebar.js';
import AdminHeader from '../../components/admin/AdminHeader.js';
import AuthService from '../../services/auth-service.js';
import Loading from '../../components/common/Loading.js';

const AdminProfile = {
  init() {
    this.render();
  },

  render() {
    const app = document.getElementById('app');
    if (!app) return;

    const user = AuthService.getUser() || {};

    app.innerHTML = `
            <div class="min-h-screen bg-gray-100">
                ${Sidebar.render()}
                ${AdminHeader.render()}
                <main class="lg:ml-64 p-4 lg:p-8">
                    <div class="grid gap-8 md:grid-cols-2">
                        <!-- Current Profile -->
                        <div class="bg-white rounded-lg shadow p-6">
                            <h2 class="text-2xl font-bold mb-6">Current Profile</h2>
                            <div class="space-y-4">
                                <div class="flex items-center justify-center">
                                    <div class="rounded-full bg-gray-100 p-2 overflow-hidden">
                                        <span class="material-icons-round text-gray-400" style="font-size: 96px; border-radius: 50%;">
                                            account_circle
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-500">Name</label>
                                    <p class="text-lg font-medium">${user.nama || 'Not set'}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-500">Email</label>
                                    <p class="text-lg">${user.email || 'Not set'}</p>
                                </div>
                                <div>
                                    <label class="text-sm font-medium text-gray-500">Role</label>
                                    <p class="text-lg capitalize">${user.role || 'Not set'}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Edit Profile -->
                        <div class="bg-white rounded-lg shadow p-6">
                            <h2 class="text-2xl font-bold mb-6">Edit Profile</h2>
                            <form id="profileForm" class="space-y-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Name</label>
                                    <input type="text" name="name" value="${user.nama || ''}" 
                                           class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Current Password</label>
                                    <input type="password" name="currentPassword" 
                                           class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">New Password</label>
                                    <input type="password" name="newPassword" 
                                           class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
                                    <input type="password" name="confirmPassword" 
                                           class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                                </div>
                                
                                <button type="submit" 
                                        class="bg-[#00899B] text-white px-4 py-2 rounded-md hover:bg-[#007A8C]">
                                    Update Profile
                                </button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        `;

    Sidebar.afterRender();
    AdminHeader.afterRender();
    this.afterRender();
  },

  afterRender() {
    const form = document.getElementById('profileForm');

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const user = AuthService.getUser();

      const data = {
        nama: formData.get('name'),
        email: user.email
      };

      if (!data.nama) {
        alert('Nama tidak boleh kosong');
        return;
      }

      const currentPassword = formData.get('currentPassword');
      const newPassword = formData.get('newPassword');
      const confirmPassword = formData.get('confirmPassword');

      if (newPassword || currentPassword) {
        if (!currentPassword) {
          alert('Masukkan password saat ini untuk mengubah password');
          return;
        }
        if (!newPassword) {
          alert('Masukkan password baru');
          return;
        }
        if (newPassword !== confirmPassword) {
          alert('Password baru dan konfirmasi password tidak sama');
          return;
        }

        data.currentPassword = currentPassword;
        data.newPassword = newPassword;
      }

      try {
        const response = await AuthService.updateProfile(user.id, data);

        if (response.status === 'success') {
          alert('Profile berhasil diupdate');
          window.location.reload();
        } else {
          alert(response.message || 'Gagal mengupdate profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        alert(error.message || 'Gagal mengupdate profile');
      }
    });
  },

  cleanup() {
    Loading.hide();
  }
};

export default AdminProfile;