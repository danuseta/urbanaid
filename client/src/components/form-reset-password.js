import AuthService from '../services/auth-service';

class FormResetPassword extends HTMLElement {
  constructor() {
    super();
    this.isTogglingPassword = false;
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="backdrop-blur-sm bg-white/30 p-6 sm:p-8 rounded-lg shadow-lg max-w-sm sm:max-w-md w-full border border-white/50">
        <div class="flex items-center mb-6">
          <a href="/login" 
             class="text-white hover:text-[#00899B] transition-colors duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
             aria-label="Kembali ke login">
            <i class="material-icons-round">arrow_back</i>
          </a>
          
          <h1 tabindex=0 class="text-xl sm:text-2xl font-bold text-center flex-1 text-white tracking-wider">
            Reset Password <span class="text-[#00899B]">UrbanAid</span>
          </h1>
        </div>

        <p class="text-white text-sm mb-6 text-center">
          Masukkan data diri Anda untuk mengatur ulang password.
        </p>
        
        <form class="space-y-6">
          <!-- Nama -->
          <div class="relative">
            <input 
              type="text" 
              id="nama" 
              name="nama" 
              class="peer w-full font-medium py-3 bg-transparent text-white focus:outline-none border-b-2 border-white focus:border-[#00899B] placeholder:text-white placeholder-transparent placeholder:font-medium pr-10 tracking-wide" 
              placeholder="Nama Lengkap"
              required>
            <span class="absolute inset-y-0 right-3 flex items-center text-white">
              <i class="material-icons-round">person</i>
            </span>
            <label 
              for="nama" 
              class="absolute left-0 -top-3.5 text-white text-sm transition-all tracking-wider
              peer-placeholder-shown:text-base peer-placeholder-shown:text-white peer-placeholder-shown:top-3 peer-placeholder-shown:font-medium peer-placeholder-shown:tracking-wide
              peer-focus:-top-3.5 peer-focus:text-[#002F35] peer-focus:text-sm peer-focus:font-bold peer-focus:tracking-wider">
              Nama Lengkap
            </label>
          </div>

          <!-- Email -->
          <div class="relative">
            <input 
              type="email" 
              id="email" 
              name="email" 
              class="peer w-full font-medium py-3 bg-transparent text-white focus:outline-none border-b-2 border-white focus:border-[#00899B] placeholder:text-white placeholder-transparent placeholder:font-medium pr-10 tracking-wide" 
              placeholder="Email"
              required>
            <span class="absolute inset-y-0 right-3 flex items-center text-white">
              <i class="material-icons-round">mail</i>
            </span>
            <label 
              for="email" 
              class="absolute left-0 -top-3.5 text-white text-sm transition-all tracking-wider
              peer-placeholder-shown:text-base peer-placeholder-shown:text-white peer-placeholder-shown:top-3 peer-placeholder-shown:font-medium peer-placeholder-shown:tracking-wide
              peer-focus:-top-3.5 peer-focus:text-[#002F35] peer-focus:text-sm peer-focus:font-bold peer-focus:tracking-wider">
              Email
            </label>
          </div>

          <!-- Password Baru -->
          <div class="relative">
            <input 
              type="password" 
              id="password" 
              name="password" 
              class="peer w-full font-medium py-3 bg-transparent text-white focus:outline-none border-b-2 border-white focus:border-[#00899B] placeholder:text-white placeholder-transparent placeholder:font-medium pr-10 tracking-wide" 
              placeholder="Password Baru"
              required>
            <button 
              type="button" 
              id="togglePassword" 
              class="absolute inset-y-0 right-3 flex items-center text-white">
              <i class="material-icons-round">visibility</i>
            </button>
            <label 
              for="password" 
              class="absolute left-0 -top-3.5 text-white text-sm transition-all tracking-wider
              peer-placeholder-shown:text-base peer-placeholder-shown:text-white peer-placeholder-shown:top-3 peer-placeholder-shown:font-medium peer-placeholder-shown:tracking-wide
              peer-focus:-top-3.5 peer-focus:text-[#002F35] peer-focus:text-sm peer-focus:font-bold peer-focus:tracking-wider">
              Password Baru
            </label>
          </div>

          <button 
            type="submit" 
            class="w-full py-3 font-semibold text-white rounded-2xl gradient-button">
            Reset Password
          </button>
        </form>
      </div>
    `;

    this.attachTogglePassword();
    this.attachFormValidation();
  }

  validateName(name) {
    if (!name) return 'Nama lengkap harus diisi';
    if (name.length < 3) return 'Nama lengkap minimal 3 karakter';
    if (!/^[a-zA-Z\s]*$/.test(name)) return 'Nama lengkap hanya boleh berisi huruf';
    return null;
  }

  validateEmail(email) {
    if (!email) return 'Email harus diisi';
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) return 'Format email tidak valid';
    return null;
  }

  validatePassword(password) {
    if (!password) return 'Password harus diisi';
    if (password.length < 6) return 'Password minimal 6 karakter';
    if (!/[A-Z]/.test(password)) return 'Password harus mengandung huruf besar';
    if (!/[a-z]/.test(password)) return 'Password harus mengandung huruf kecil';
    if (!/[0-9]/.test(password)) return 'Password harus mengandung angka';
    return null;
  }

  attachFormValidation() {
    const form = this.querySelector('form');
    const namaInput = this.querySelector('#nama');
    const emailInput = this.querySelector('#email');
    const passwordInput = this.querySelector('#password');

    namaInput.addEventListener('input', () => {
      const error = this.validateName(namaInput.value.trim());
      if (error) {
        namaInput.classList.add('border-red-500');
      } else {
        namaInput.classList.remove('border-red-500');
      }
    });

    emailInput.addEventListener('input', () => {
      const error = this.validateEmail(emailInput.value.trim());
      if (error) {
        emailInput.classList.add('border-red-500');
      } else {
        emailInput.classList.remove('border-red-500');
      }
    });

    passwordInput.addEventListener('input', () => {
      const error = this.validatePassword(passwordInput.value);
      if (error) {
        passwordInput.classList.add('border-red-500');
      } else {
        passwordInput.classList.remove('border-red-500');
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameError = this.validateName(namaInput.value.trim());
      if (nameError) {
        Swal.fire({
          title: 'Format Nama Salah',
          text: nameError,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        return;
      }

      const emailError = this.validateEmail(emailInput.value.trim());
      if (emailError) {
        Swal.fire({
          title: 'Format Email Salah',
          text: emailError,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        return;
      }

      const passwordError = this.validatePassword(passwordInput.value);
      if (passwordError) {
        Swal.fire({
          title: 'Format Password Salah',
          text: passwordError,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        return;
      }

      try {
        Swal.fire({
          title: 'Memproses',
          text: 'Mohon tunggu...',
          allowOutsideClick: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          }
        });

        const response = await AuthService.resetPassword(
          namaInput.value.trim(),
          emailInput.value.trim(),
          passwordInput.value
        );

        if (response.status === 'success') {
          await Swal.fire({
            title: 'Berhasil!',
            text: 'Password berhasil diubah. Silakan login dengan password baru.',
            icon: 'success',
            confirmButtonText: 'Ok'
          });

          form.reset();
          window.location.href = '/login';
        } else {
          throw new Error(response.message || 'Data tidak ditemukan atau tidak sesuai');
        }
      } catch (error) {
        console.error('Reset Password Error:', error);
        await Swal.fire({
          title: 'Gagal!',
          text: error.message || 'Terjadi kesalahan, silakan coba lagi.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  attachTogglePassword() {
    const passwordInput = this.querySelector('#password');
    const togglePassword = this.querySelector('#togglePassword');
    const toggleIcon = togglePassword.querySelector('i');

    togglePassword.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      this.isTogglingPassword = true;
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      toggleIcon.textContent = isPassword ? 'visibility_off' : 'visibility';

      setTimeout(() => {
        this.isTogglingPassword = false;
      }, 100);
    });
  }
}

customElements.define('form-reset-password', FormResetPassword);