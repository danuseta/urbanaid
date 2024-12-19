import AuthService from '../services/auth-service';
class FormRegister extends HTMLElement {
  constructor() {
    super();
    this.isTogglingPassword = false;
  }

  connectedCallback() {
    this.innerHTML = `
          <div class="backdrop-blur-sm bg-white/30 p-6 sm:p-8 rounded-lg shadow-lg max-w-sm sm:max-w-md w-full border border-white/50">
            <div class="flex items-center mb-6">
              <a href="/" 
                 class="text-white hover:text-[#00899B] transition-colors duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
                 aria-label="Kembali ke beranda">
                <i class="material-icons-round">arrow_back</i>
              </a>
              
              <h1 tabindex=0 class="text-xl sm:text-2xl font-bold text-center flex-1 text-white tracking-wider">
                Daftar Akun <span class="text-[#00899B]">UrbanAid</span>
              </h1>
            </div>
            
            <form class="space-y-6">
              <div class="relative">
                <input 
                  type="text" 
                  id="fullname" 
                  name="fullname" 
                  class="peer w-full font-medium py-3 bg-transparent text-white focus:outline-none border-b-2 border-white focus:border-[#00899B] placeholder:text-white placeholder-transparent placeholder:font-medium pr-10 tracking-wide" 
                  placeholder="Nama Lengkap">
                <span class="absolute inset-y-0 right-3 flex items-center text-white">
                  <i class="material-icons-round">person</i>
                </span>
                <label 
                  for="fullname" 
                  class="absolute left-0 -top-3.5 text-white text-sm transition-all tracking-wider
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-white peer-placeholder-shown:top-3 peer-placeholder-shown:font-medium peer-placeholder-shown:tracking-wide
                  peer-focus:-top-3.5 peer-focus:text-[#002F35] peer-focus:text-sm peer-focus:font-bold peer-focus:tracking-wider">
                  Nama Lengkap
                </label>
              </div>
  
              <div class="relative">
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  class="peer w-full font-medium py-3 bg-transparent text-white focus:outline-none border-b-2 border-white focus:border-[#00899B] placeholder:text-white placeholder-transparent placeholder:font-medium pr-10 tracking-wide" 
                  placeholder="Email">
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
  
              <div class="relative">
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  class="peer w-full font-medium py-3 bg-transparent text-white focus:outline-none border-b-2 border-white focus:border-[#00899B] placeholder:text-white placeholder-transparent placeholder:font-medium pr-10 tracking-wide" 
                  placeholder="Password">
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
                  Password
                </label>
              </div>
  
              <div class="flex items-start space-x-3 min-w-[44px] min-h-[44px]">
                <input 
                  type="checkbox" 
                  id="terms" 
                  class="h-5 w-5 text-[#00899B] focus:ring-[#00899B]">
                <label tabindex=0
                  for="terms" 
                  class="text-sm font-medium text-white leading-tight tracking-wide">
                  Saya menyetujui syarat dan ketentuan serta kebijakan privasi.
                </label>
              </div>
  
              <button 
                type="submit" 
                class="w-full py-3 font-semibold text-white rounded-2xl gradient-button">
                Daftar
              </button>
            </form>
            
            <p tabindex=0 class="mt-6 text-sm text-center font-medium text-white tracking-wide">
              Sudah punya akun? 
              <a href="/login" class="font-bold hover:underline inline-flex items-center justify-center min-w-[44px] min-h-[44px] p-2 text-[#002F35]">Login</a>
            </p>
          </div>
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
    const fullnameInput = this.querySelector('#fullname');
    const emailInput = this.querySelector('#email');
    const passwordInput = this.querySelector('#password');
    const termsCheckbox = this.querySelector('#terms');

    fullnameInput.addEventListener('input', () => {
      const error = this.validateName(fullnameInput.value.trim());
      if (error) {
        fullnameInput.classList.add('border-red-500');
      } else {
        fullnameInput.classList.remove('border-red-500');
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

    fullnameInput.addEventListener('blur', () => {
      const error = this.validateName(fullnameInput.value.trim());
      if (error) {
        Swal.fire({
          title: 'Format Nama Salah',
          text: error,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });

    emailInput.addEventListener('blur', () => {
      const error = this.validateEmail(emailInput.value.trim());
      if (error) {
        Swal.fire({
          title: 'Format Email Salah',
          text: error,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameError = this.validateName(fullnameInput.value.trim());
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

      if (!termsCheckbox.checked) {
        Swal.fire({
          title: 'Syarat dan Ketentuan',
          text: 'Anda harus menyetujui syarat dan ketentuan',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        return;
      }

      let loadingSwal;
      try {
        loadingSwal = Swal.fire({
          title: 'Memproses Pendaftaran',
          html: 'Mohon tunggu sebentar...',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const userData = {
          nama: fullnameInput.value.trim(),
          email: emailInput.value.trim(),
          password: passwordInput.value
        };

        const response = await AuthService.register(userData);

        if (loadingSwal) {
          loadingSwal.close();
        }

        if (response.status === 'success') {
          await Swal.fire({
            title: 'Berhasil!',
            text: 'Akun berhasil didaftarkan. Silakan login.',
            icon: 'success',
            confirmButtonText: 'Ok'
          });

          form.reset();
          window.location.href = '/login';
        } else {
          throw new Error(response.message || 'Terjadi kesalahan saat mendaftar');
        }
      } catch (error) {
        console.error('Registration Error:', error);

        if (loadingSwal) {
          loadingSwal.close();
        }

        await Swal.fire({
          title: 'Gagal!',
          text: error.message || 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.',
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

customElements.define('form-register', FormRegister);