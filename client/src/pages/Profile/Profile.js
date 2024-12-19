import AuthService from '../../services/auth-service.js';
import StatisticService from '../../services/statistic-service.js';
import { CountUp } from 'countup.js';

const Profile = {
  render() {
    const user = AuthService.getUser();

    return `
            <div class="w-full px-4 md:px-6 lg:px-8 space-y-4 md:space-y-6 max-w-4xl mx-auto mb-6">
                <!-- Profile Card -->
                <div class="group relative" data-aos="fade-up">
                    <div class="absolute inset-0 bg-gradient-to-r from-[#00899B]/20 to-[#002F35]/20 rounded-3xl blur-2xl transform -rotate-1"></div>
                    <div class="relative bg-gradient-to-r from-[#00899B] to-[#002F35] rounded-lg shadow-lg p-4 md:p-6 lg:p-8">
                        <!-- Profile Info -->
                        <div class="flex flex-col items-center" data-aos="fade-up" data-aos-delay="100">
                            <div class="relative mb-3 md:mb-4">
                                <div class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 flex items-center justify-center">
                                    <span class="material-icons-round text-4xl md:text-[52px] text-white">account_circle</span>
                                </div>
                            </div>
                            <h2 class="text-xl md:text-2xl font-bold text-white mb-1">${user.nama}</h2>
                            <p class="text-sm md:text-base text-gray-200">${user.email}</p>
                        </div>

                        <!-- Stats -->
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-6 md:mt-8">
                            <div class="bg-white/10 rounded-lg p-3 md:p-4" data-aos="fade-up" data-aos-delay="200">
                                <p class="text-xl md:text-2xl font-bold text-white mb-2 text-center" id="total-reports">0</p>
                                <div class="flex items-center justify-center">
                                    <span class="material-icons-round text-sm md:text-base text-gray-200 mr-1">description</span>
                                    <p class="text-xs md:text-sm text-gray-200">Total Laporan</p>
                                </div>
                            </div>
                            <div class="bg-white/10 rounded-lg p-3 md:p-4" data-aos="fade-up" data-aos-delay="300">
                                <p class="text-xl md:text-2xl font-bold text-white mb-2 text-center" id="resolved-reports">0</p>
                                <div class="flex items-center justify-center">
                                    <span class="material-icons-round text-sm md:text-base text-gray-200 mr-1">check_circle</span>
                                    <p class="text-xs md:text-sm text-gray-200">Laporan Selesai</p>
                                </div>
                            </div>
                            <div class="bg-white/10 rounded-lg p-3 md:p-4" data-aos="fade-up" data-aos-delay="400">
                                <p class="text-xl md:text-2xl font-bold text-white mb-2 text-center" id="active-reports">0</p>
                                <div class="flex items-center justify-center">
                                    <span class="material-icons-round text-sm md:text-base text-gray-200 mr-1">schedule</span>
                                    <p class="text-xs md:text-sm text-gray-200">Laporan Aktif</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Edit Form -->
                <div class="group relative" data-aos="fade-up" data-aos-delay="500">
                    <div class="absolute inset-0 bg-gradient-to-r from-[#00899B]/20 to-[#002F35]/20 rounded-3xl blur-2xl transform -rotate-1"></div>
                    <div class="relative bg-white/80 backdrop-blur-xl rounded-lg shadow-lg">
                        <div class="p-4 md:p-6">
                            <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Pengaturan Profil</h3>
                            
                            <form id="editProfileForm" class="space-y-4 md:space-y-6">
                                <!-- Nama -->
                                <div class="form-group" data-aos="fade-up" data-aos-delay="600">
                                    <label for="name" class="block text-sm font-semibold text-gray-700 mb-1.5">Nama</label>
                                    <input type="text" id="name" name="name" value="${user.nama}"
                                           class="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-gray-900 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00899B] focus:border-[#00899B] placeholder-gray-400">
                                </div>

                                <!-- Email -->
                                <div class="form-group" data-aos="fade-up" data-aos-delay="700">
                                    <label for="email" class="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                                    <input type="email" id="email" name="email" value="${user.email}"
                                           class="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-gray-900 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00899B] focus:border-[#00899B] placeholder-gray-400">
                                </div>

                                <!-- Current Password -->
                                <div class="form-group" data-aos="fade-up" data-aos-delay="800">
                                    <label for="currentPassword" class="block text-sm font-semibold text-gray-700 mb-1.5">Password Saat Ini</label>
                                    <div class="relative">
                                        <input type="password" 
                                               id="currentPassword" 
                                               name="currentPassword" 
                                               placeholder="Masukkan password saat ini"
                                               class="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-gray-900 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00899B] focus:border-[#00899B] placeholder-gray-400 pr-10">
                                        <button type="button" 
                                                class="toggle-password absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer p-1">
                                            <span class="material-icons-round text-lg md:text-xl">visibility</span>
                                        </button>
                                    </div>
                                </div>

                                <!-- New Password -->
                                <div class="form-group" data-aos="fade-up" data-aos-delay="900">
                                    <label for="newPassword" class="block text-sm font-semibold text-gray-700 mb-1.5">Password Baru</label>
                                    <div class="relative">
                                        <input type="password" 
                                               id="newPassword" 
                                               name="newPassword" 
                                               placeholder="Masukkan password baru"
                                               class="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-gray-900 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00899B] focus:border-[#00899B] placeholder-gray-400 pr-10">
                                        <button type="button" 
                                                class="toggle-password absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer p-1">
                                            <span class="material-icons-round text-lg md:text-xl">visibility</span>
                                        </button>
                                    </div>
                                    <p class="mt-1.5 text-xs md:text-sm text-gray-500">
                                        Password harus memiliki minimal 8 karakter, huruf kapital, huruf kecil, angka, dan karakter khusus
                                    </p>
                                </div>

                                <!-- Confirm Password -->
                                <div class="form-group" data-aos="fade-up" data-aos-delay="1000">
                                    <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 mb-1.5">Konfirmasi Password</label>
                                    <div class="relative">
                                        <input type="password" 
                                               id="confirmPassword" 
                                               name="confirmPassword" 
                                               placeholder="Konfirmasi password baru"
                                               class="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base text-gray-900 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00899B] focus:border-[#00899B] placeholder-gray-400 pr-10">
                                        <button type="button" 
                                                class="toggle-password absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer p-1">
                                            <span class="material-icons-round text-lg md:text-xl">visibility</span>
                                        </button>
                                    </div>
                                </div>

                                <!-- Submit Button -->
                                <div class="flex justify-end pt-4" data-aos="fade-up" data-aos-delay="1100">
                                    <button type="submit" 
                                            class="flex items-center justify-center gap-2 min-h-[40px] md:min-h-[44px] px-4 md:px-6 py-2 bg-gradient-to-r from-[#00899B] to-[#002F35] text-white text-sm md:text-base font-semibold rounded-lg hover:shadow-lg transition-shadow">
                                        <span class="material-icons-round text-lg md:text-xl">save</span>
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
  },


  async afterRender() {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 50,
      delay: 100
    });
    await this._initializeStats();
    this._initializeForm();
    this._initializePasswordToggles();
  },

  async _initializeStats() {
    const user = AuthService.getUser();
    if (!user || !user.id) {
      console.log('No user data found');
      return;
    }

    try {
      const stats = await StatisticService.getUserStatistics(user.id);

      const totalElement = document.getElementById('total-reports');
      const resolvedElement = document.getElementById('resolved-reports');
      const activeElement = document.getElementById('active-reports');

      if (totalElement && resolvedElement && activeElement) {
        const options = {
          duration: 2,
          useEasing: true,
          useGrouping: true,
          separator: ',',
          decimal: '.'
        };

        const totalCount = new CountUp('total-reports', stats.totalReports || 0, options);
        const resolvedCount = new CountUp('resolved-reports', stats.resolved || 0, options);
        const activeCount = new CountUp('active-reports', stats.inProgress || 0, options);

        if (!totalCount.error) {
          totalCount.start();
        }
        if (!resolvedCount.error) {
          resolvedCount.start();
        }
        if (!activeCount.error) {
          activeCount.start();
        }
      }

    } catch (error) {
      console.error('Error updating stats:', error);
    }
  },

  _initializePasswordToggles() {

    const passwordInputs = document.querySelectorAll('input[type="password"]');
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach((button, index) => {
      const input = passwordInputs[index];
      const icon = button.querySelector('.material-icons-round');

      button.onclick = (e) => {
        e.preventDefault();

        if (input.type === 'password') {
          input.type = 'text';
          icon.textContent = 'visibility_off';
          console.log('Changed to text');
        } else {
          input.type = 'password';
          icon.textContent = 'visibility';
          console.log('Changed to password');
        }
      };
    });
  },

  _initializeForm() {
    const form = document.getElementById('editProfileForm');
    if (form) {
      form.addEventListener('submit', this.handleSubmit.bind(this));
    }
  },

  validateName(name) {
    if (!name) return 'Nama lengkap harus diisi';
    if (name.length < 3) return 'Nama lengkap minimal 3 karakter';
    if (!/^[a-zA-Z\s]*$/.test(name)) return 'Nama lengkap hanya boleh berisi huruf';
    return null;
  },

  validateEmail(email) {
    if (!email) return 'Email harus diisi';

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!email.includes('@')) return 'Email harus mengandung @';
    if (!email.includes('.')) return 'Email harus mengandung domain yang valid';

    if (!emailRegex.test(email)) {
      if (email.split('@').length > 2) return 'Email tidak boleh mengandung lebih dari satu @';
      if (email.endsWith('@')) return 'Email harus memiliki domain setelah @';
      if (email.startsWith('@')) return 'Email harus memiliki username sebelum @';
      if (!/^[a-zA-Z0-9._-]+/.test(email)) return 'Email hanya boleh mengandung huruf, angka, titik, underscore, dan dash';
      return 'Format email tidak valid';
    }

    const [, domain] = email.split('@');
    if (!domain) return 'Domain email tidak valid';
    if (!domain.includes('.')) return 'Domain email harus mengandung ekstensi yang valid';
    if (domain.startsWith('.') || domain.endsWith('.')) return 'Format domain email tidak valid';

    return null;
  },

  validatePassword(password) {
    const errors = [];

    if (!password) {
      errors.push('Password harus diisi');
      return errors;
    }

    if (password.length < 8) {
      errors.push('Password minimal 8 karakter');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password harus memiliki huruf kapital');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password harus memiliki huruf kecil');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password harus memiliki angka');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password harus memiliki karakter khusus');
    }

    return errors;
  },

  async handleSubmit(e) {
    e.preventDefault();
    console.log('Form submitted');
    const form = e.target;
    const user = AuthService.getUser();

    const formData = {
      nama: form.name.value.trim(),
      email: form.email.value.trim(),
      currentPassword: form.currentPassword.value,
      newPassword: form.newPassword.value
    };

    const nameError = this.validateName(formData.nama);
    if (nameError) {
      await Swal.fire({
        title: 'Format Nama Salah',
        text: nameError,
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#00899B'
      });
      return;
    }

    const emailError = this.validateEmail(formData.email);
    if (emailError) {
      await Swal.fire({
        title: 'Format Email Salah',
        text: emailError,
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#00899B'
      });
      return;
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        await Swal.fire({
          title: 'Password Saat Ini Diperlukan',
          text: 'Masukkan password saat ini untuk mengubah password',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#00899B'
        });
        return;
      }

      const passwordErrors = this.validatePassword(formData.newPassword);
      if (passwordErrors.length > 0) {
        const errorList = passwordErrors.map((error) => `<li class="mb-2">❌ ${error}</li>`).join('');
        await Swal.fire({
          title: 'Password Tidak Memenuhi Syarat',
          html: `<ul class="text-left mt-4">${errorList}</ul>`,
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#00899B'
        });
        return;
      }

      if (formData.newPassword !== form.confirmPassword.value) {
        await Swal.fire({
          title: 'Password Tidak Cocok',
          text: 'Password baru dan konfirmasi password harus sama',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#00899B'
        });
        return;
      }
    }

    const changes = [];
    if (formData.nama !== user.nama) changes.push('nama');
    if (formData.email !== user.email) changes.push('email');
    if (formData.newPassword) changes.push('password');

    if (changes.length === 0) {
      await Swal.fire({
        title: 'Tidak Ada Perubahan',
        text: 'Anda belum melakukan perubahan apapun',
        icon: 'info',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#00899B'
      });
      return;
    }

    try {
      const confirm = await Swal.fire({
        title: 'Konfirmasi Perubahan',
        text: `Anda yakin ingin mengubah ${changes.join(', ')}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#00899B',
        cancelButtonColor: '#6B7280'
      });

      if (!confirm.isConfirmed) {
        return;
      }

      Swal.fire({
        title: 'Memperbarui Profil',
        html: 'Mohon tunggu sebentar...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await AuthService.updateProfile(user.id, formData);

      if (response.status === 'success') {
        await Swal.fire({
          title: 'Berhasil!',
          text: 'Profil berhasil diperbarui',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#00899B'
        });

        form.currentPassword.value = '';
        form.newPassword.value = '';
        form.confirmPassword.value = '';

        const nameDisplay = document.querySelector('.text-2xl.font-bold.text-white');
        const emailDisplay = document.querySelector('.text-gray-200');
        if (nameDisplay) nameDisplay.textContent = formData.nama;
        if (emailDisplay) emailDisplay.textContent = formData.email;

      } else {
        throw new Error(response.message || 'Gagal memperbarui profil');
      }
    } catch (error) {
      console.error('Error updating profile:', error);

      await Swal.fire({
        title: 'Gagal!',
        text: error.message || 'Terjadi kesalahan saat memperbarui profil',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#00899B'
      });
    }
  },

  cleanup() {
    console.log('Cleaning up Profile component');
    const form = document.getElementById('editProfileForm');
    if (form) {
      form.removeEventListener('submit', this.handleSubmit);
    }

    document.querySelectorAll('.toggle-password').forEach((button) => {
      button.removeEventListener('click', () => {});
    });
  }
};

const ProfilePage = {
  ...Profile,
  init() {
    console.log('Initializing Profile page');
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.innerHTML = this.render();
      this.afterRender();
    }
    return this;
  },

  cleanup() {
    Profile.cleanup();
    AOS.refresh();
  }
};

export default ProfilePage;