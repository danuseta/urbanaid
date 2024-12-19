import UrlParser from './utils/url-parser.js';
import routes from './routes/routes.js';

const App = {
  init() {
    window.App = this;
    this.routes = routes;
    this.page = null;
    this.currentPath = window.location.pathname;

    window.addEventListener('popstate', (e) => {
      e.preventDefault();
      this.renderPage();
    });

    this.renderPage();

    return this;
  },

  async navigateTo(path) {
    if (window.location.pathname !== path) {
      window.history.pushState(null, null, path);
      await this.renderPage();
    }
  },

  _checkAuth(url) {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const publicRoutes = ['/', '/artikel', '/tentang-kami'];

    if (publicRoutes.some((route) => url === route)) {
      return true;
    }

    const protectedRoutes = ['/pelaporan', '/pelaporan/beranda', '/pelaporan/laporanaktif', '/pelaporan/riwayat', '/pelaporan/profile'];
    const adminRoutes = ['/admin', '/admin/laporan', '/admin/riwayat', '/admin/users', '/admin/admins'];

    if (adminRoutes.some((route) => url.startsWith(route))) {
      if (!token || (user?.role !== 'admin' && user?.role !== 'superadmin')) {
        this.navigateTo('/');
        return false;
      }
      return true;
    }

    if (protectedRoutes.some((route) => url.startsWith(route))) {
      if (!token) {
        this.navigateTo('/login');
        return false;
      }
      return true;
    }

    if ((url === '/login' || url === '/register') && token) {
      const path = user?.role === 'admin' || user?.role === 'superadmin' ? '/admin' : '/';
      this.navigateTo(path);
      return false;
    }

    return true;
  },

  async renderPage() {
    try {
      const url = window.location.pathname;

      if (!this._checkAuth(url)) {
        return;
      }

      const page = this._getPage(url);

      if (!page) {
        throw new Error('Page not found');
      }

      if (this.page && this.page.cleanup) {
        const navbars = document.querySelectorAll('app-navbar');
        navbars.forEach((navbar) => {
          if (navbar.disconnectedCallback) {
            navbar.disconnectedCallback();
          }
        });
        await this.page.cleanup();
      }

      this.page = page;

      if (this.page.init) {
        await this.page.init();
      }

      this.currentPath = url;

    } catch (error) {
      console.error('Error rendering page:', error);
      this._handleError(error);
    }
  },

  _getPage(url) {
    url = url === '/' ? url : url.replace(/\/$/, '');

    if (this.routes[url]) {
      return this.routes[url];
    }

    const urlParts = url.split('/').filter(Boolean);

    for (const [route, handler] of Object.entries(this.routes)) {
      const routeParts = route.split('/').filter(Boolean);

      if (routeParts.length !== urlParts.length) continue;

      const matches = routeParts.every((part, index) => {
        if (part.startsWith(':')) return true;
        return part === urlParts[index];
      });

      if (matches) return handler;
    }

    return this.routes['/'];
  },

  _handleError(error) {
    console.error('Error:', error);

    const appContainer = document.querySelector('#app');
    if (appContainer) {
      appContainer.innerHTML = `
                <div class="min-h-screen flex items-center justify-center">
                    <div class="text-center">
                        <h1 class="text-2xl font-bold text-gray-800 mb-4">Oops! Terjadi Kesalahan</h1>
                        <p class="text-gray-600 mb-4">${error.message || 'Gagal memuat halaman'}</p>
                        <button onclick="window.location.reload()" 
                                class="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors">
                            Muat Ulang
                        </button>
                    </div>
                </div>
            `;
    }
  }
};

export default App;