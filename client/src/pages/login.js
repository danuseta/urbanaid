import '../components/form-login.js';
import AuthService from '../services/auth-service';
import Loading from '../components/common/Loading.js';

const LoginPage = {
  render() {
    if (AuthService.isAuthenticated()) {
      const user = AuthService.getUser();
      window.location.href = (user.isAdmin || user.role === 'superadmin') ? '/admin' : '/pelaporan';
      return '';
    }

    return `
<div class="min-h-screen flex items-center justify-center bg-center px-4 sm:px-6 lg:px-8 relative">
    <div class="absolute inset-0">
        <picture>
            <source 
                media="(min-width: 1200px)" 
                srcset="images/hero/optimized/hero-section1-large.webp" 
                type="image/webp" 
            />
            <source 
                media="(min-width: 800px)" 
                srcset="images/hero/optimized/hero-section1-medium.webp" 
                type="image/webp" 
            />
            <img 
                src="images/hero/optimized/hero-section1-small.webp" 
                alt="Urban Infrastructure Hero" 
                class="w-full h-full object-cover" 
                loading="lazy" 
                onerror="this.onerror=null; this.src='/images/hero-section1.png';"
            />
        </picture>
        <div class="absolute inset-0 bg-black/50"></div>
    </div>
    <div class="relative z-10">
        <form-login></form-login>
    </div>
</div>

        `;
  },

  async init() {
    const app = document.getElementById('app');
    app.innerHTML = this.render();
  },

  cleanup() {
    Loading.hide();
  }
};
export default LoginPage;