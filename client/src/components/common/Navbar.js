class NavbarComponent extends HTMLElement {
  constructor() {
    super();
    this.handleLogout = this.handleLogout.bind(this);
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    this.toggleUserMenu = this.toggleUserMenu.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleLogout() {
    Swal.fire({
      title: 'Logout',
      text: 'Apakah anda yakin ingin keluar?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#00899B',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Keluar!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('remember_token');
        Swal.fire({
          title: 'Berhasil!',
          text: 'Anda telah berhasil keluar',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          window.history.pushState(null, null, '/');
          window.location.reload();
        });
      }
    });
  }

  handleNavigation(e) {
    if (e.target.tagName === 'A' && !e.target.getAttribute('href').startsWith('http')) {
      e.preventDefault();
      const url = e.target.getAttribute('href').replace('#', '');
      window.history.pushState(null, null, url);
      const app = window.App;
      if (app) {
        app.renderPage();
      }
      this.toggleMobileMenu(null, true);
    }
  }

  toggleMobileMenu(event, forceClose = false) {

    if (event) {
      event.stopPropagation();
    }

    const mobileMenu = this.querySelector('#mobile-menu');
    if (!mobileMenu) {
      return;
    }

    const menuIcon = this.querySelector('#mobile-menu-button .material-icons-round');
    const overlay = this.querySelector('#mobile-menu-overlay');

    // console.log('Elements found:', {
    //   mobileMenu: mobileMenu?.id,
    //   menuIcon: menuIcon?.textContent,
    //   overlay: overlay?.id
    // });

    if (forceClose || !mobileMenu.classList.contains('hidden')) {
      document.body.style.overflow = '';

      mobileMenu.style.transform = 'translateY(10px)';
      mobileMenu.style.opacity = '0';
      if (overlay) overlay.style.opacity = '0';

      setTimeout(() => {
        mobileMenu.classList.add('hidden');
        if (overlay) overlay.classList.add('hidden');
      }, 200);

      if (menuIcon) menuIcon.textContent = 'menu';
    } else {
      document.body.style.overflow = 'hidden';

      mobileMenu.classList.remove('hidden');
      if (overlay) overlay.classList.remove('hidden');

      mobileMenu.offsetHeight;

      requestAnimationFrame(() => {
        mobileMenu.style.transform = 'translateY(0)';
        mobileMenu.style.opacity = '1';
        if (overlay) overlay.style.opacity = '1';
      });

      if (menuIcon) menuIcon.textContent = 'close';
    }
  }

  toggleUserMenu(event) {
    event.stopPropagation();

    const userMenu = this.querySelector('#user-menu');
    if (!userMenu) {
      return;
    }

    const expandIcon = this.querySelector('#expand-icon');

    if (userMenu.classList.contains('hidden')) {
      userMenu.classList.remove('hidden');
      requestAnimationFrame(() => {
        userMenu.classList.remove('opacity-0', '-translate-y-2');
        userMenu.classList.add('opacity-100', 'translate-y-0');
      });
      if (expandIcon) expandIcon.style.transform = 'rotate(180deg)';
    } else {
      userMenu.classList.add('opacity-0', '-translate-y-2');
      userMenu.classList.remove('opacity-100', 'translate-y-0');
      setTimeout(() => {
        userMenu.classList.add('hidden');
      }, 200);
      if (expandIcon) expandIcon.style.transform = 'rotate(0deg)';
    }
  }

  handleClickOutside(event) {
    const mobileMenu = this.querySelector('#mobile-menu');
    const mobileMenuButton = this.querySelector('#mobile-menu-button');
    const userMenu = this.querySelector('#user-menu');
    const userMenuButton = this.querySelector('#user-menu-button');

    if (mobileMenu && !mobileMenu.classList.contains('hidden') &&
        !mobileMenu.contains(event.target) &&
        !mobileMenuButton?.contains(event.target)) {
      this.toggleMobileMenu(null, true);
    }

    if (userMenu && !userMenu.classList.contains('hidden') &&
        !userMenu.contains(event.target) &&
        !userMenuButton?.contains(event.target)) {
      this.toggleUserMenu({ stopPropagation: () => {} });
    }
  }

  getNavbarContent() {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const isLoggedIn = token !== null;
    let userData = null;

    if (isLoggedIn && userString) {
      try {
        userData = JSON.parse(userString);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    const isAdmin = userData?.role === 'admin' || userData?.role === 'superadmin';
    const mainMenuLink = isAdmin ? '/admin' : (isLoggedIn ? '/pelaporan' : '/login');
    const mainMenuText = isAdmin ? 'Laporan' : 'Pelaporan';
    const mainMenuIcon = isAdmin ? 'assignment' : 'campaign';

    return `
      <nav class="bg-gradient-to-r from-[#00899B] to-[#002F35] text-white fixed w-full z-50 top-0">
        <!-- Mobile navbar -->
               <div class="block md:hidden">
          <div class="px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
              <img src="/images/logo1.jpeg" alt="UrbanAid Logo" class="w-10 h-10 rounded-full">
              <span class="ml-3 text-lg font-bold text-white">UrbanAid</span>
            </div>
            <button id="mobile-menu-button" 
                    class="text-white p-2 rounded-lg hover:bg-[#00899B]/30 focus:outline-none transition-colors duration-200">
              <span class="material-icons-round text-2xl transition-transform duration-200">menu</span>
            </button>
          </div>

          <div id="mobile-menu-overlay" 
               class="fixed inset-0 bg-black/50 hidden opacity-0 transition-opacity duration-200 ease-in-out z-40"
               style="margin-top: 64px;"></div>
          
          <!-- Mobile Menu -->
          <div id="mobile-menu" 
               class="fixed left-0 right-0 top-[64px] bottom-0 bg-[#00899B] shadow-lg transition-all duration-200 ease-in-out hidden opacity-0 z-50 overflow-y-auto">
            <div class="py-4 flex flex-col h-full">
              <div class="flex-1">
                ${!isAdmin ? `
                  <a href="/" class="flex items-center px-4 py-3 text-white hover:bg-[#00899B]/20 transition-colors duration-200">
                    <span class="material-icons-round mr-3">home</span>
                    <span>Beranda</span>
                  </a>
                  <a href="/artikel" class="flex items-center px-4 py-3 text-white hover:bg-[#00899B]/20 transition-colors duration-200">
                    <span class="material-icons-round mr-3">article</span>
                    <span>Artikel</span>
                  </a>
                ` : ''}
                
                <a href="${mainMenuLink}" class="flex items-center px-4 py-3 text-white hover:bg-[#00899B]/20 transition-colors duration-200">
                  <span class="material-icons-round mr-3">${mainMenuIcon}</span>
                  <span>${mainMenuText}</span>
                </a>
                
                ${!isAdmin ? `
                  <a href="/tentang-kami" class="flex items-center px-4 py-3 text-white hover:bg-[#00899B]/20 transition-colors duration-200">
                    <span class="material-icons-round mr-3">groups</span>
                    <span>Tentang Kami</span>
                  </a>
                ` : ''}
              </div>

              ${isLoggedIn ? `
                <!-- User Profile Section -->
                <div class="px-4 py-4 border-t border-[#00899B]/20">
                  <div class="flex items-center space-x-3 mb-4 bg-[#00899B]/20 p-3 rounded-lg">
                    <span class="material-icons-round text-white text-2xl">account_circle</span>
                    <div>
                      <p class="text-white font-medium">${userData?.nama || 'User'}</p>
                      <p class="text-gray-300 text-sm">User</p>
                    </div>
                  </div>
                  <button id="mobile-logout-btn" 
                          class="flex items-center w-full px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-200">
                    <span class="material-icons-round mr-2">logout</span>
                    <span>Logout</span>
                  </button>
                </div>
              ` : `
                <div class="px-4 py-4 border-t border-[#00899B]/20">
                  <a href="/login" class="flex items-center px-4 py-3 text-white hover:bg-[#00899B]/20 rounded-lg transition-colors duration-200">
                    <span class="material-icons-round mr-3">login</span>
                    <span>Login</span>
                  </a>
                </div>
              `}
            </div>
          </div>
        </div>

        <!-- Desktop navbar -->
        <div class="hidden md:block">
          <div class="container mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <img src="/images/logo.png" alt="UrbanAid Logo" class="w-12 h-12 rounded-full">
                <span class="ml-4 text-xl font-bold text-white">UrbanAid</span>
              </div>
              <div class="flex items-center space-x-6">
                ${!isAdmin ? `
                  <a href="/" class="text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-colors duration-200">Beranda</a>
                  <a href="/artikel" class="text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-colors duration-200">Artikel</a>
                ` : ''}
                <a href="${mainMenuLink}" class="text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-colors duration-200">${mainMenuText}</a>
                ${!isAdmin ? `
                  <a href="/tentang-kami" class="text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-colors duration-200">Tentang Kami</a>
                ` : ''}
                ${isLoggedIn ? `
                  <div class="relative">
                      <button id="user-menu-button" 
                              class="gradient-border-button px-4 py-2 rounded-full bg-white text-[#002F35] inline-flex items-center">
                        <span class="flex items-center">
                          <span class="material-icons-round mr-2">account_circle</span>
                          ${userData?.nama || 'User'}
                          <span class="material-icons-round text-lg ml-1 transition-transform duration-200" style="margin-top: -1px;" id="expand-icon">expand_more</span>
                        </span>
                      </button>
                    <div id="user-menu" 
                         class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 hidden opacity-0 -translate-y-2 transition-all duration-200">
                      <button id="desktop-logout-btn"
                              class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200">
                        <span class="material-icons-round mr-2">logout</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                ` : `
                  <a href="/login" class="gradient-border-button px-4 py-2 rounded-full bg-white text-[#002F35] hover:bg-gray-100 transition-colors duration-200">
                    Masuk
                  </a>
                `}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div class="h-16 md:h-20"></div>
    `;
  }

  attachEventListeners() {
    const mobileMenuButton = this.querySelector('#mobile-menu-button');
    const mobileLogoutBtn = this.querySelector('#mobile-logout-btn');
    const desktopLogoutBtn = this.querySelector('#desktop-logout-btn');
    const userMenuButton = this.querySelector('#user-menu-button');
    const overlay = this.querySelector('#mobile-menu-overlay');

    // console.log('Elements found:', {
    //   mobileMenuButton: mobileMenuButton?.id,
    //   mobileLogoutBtn: mobileLogoutBtn?.id,
    //   desktopLogoutBtn: desktopLogoutBtn?.id,
    //   userMenuButton: userMenuButton?.id,
    //   overlay: overlay?.id
    // });

    if (mobileMenuButton) {
      mobileMenuButton.addEventListener('click', (e) => {
        this.toggleMobileMenu(e);
      });
    }

    if (overlay) {
      overlay.addEventListener('click', (e) => this.toggleMobileMenu(e, true));
    }

    if (mobileLogoutBtn) {
      mobileLogoutBtn.addEventListener('click', this.handleLogout);
    }

    if (desktopLogoutBtn) {
      desktopLogoutBtn.addEventListener('click', this.handleLogout);
    }

    if (userMenuButton) {
      userMenuButton.addEventListener('click', this.toggleUserMenu);
    }

    this.addEventListener('click', this.handleNavigation);
    document.addEventListener('click', this.handleClickOutside);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.toggleMobileMenu(null, true);
        const userMenu = this.querySelector('#user-menu');
        if (userMenu && !userMenu.classList.contains('hidden')) {
          this.toggleUserMenu({ stopPropagation: () => {} });
        }
      }
    });
  }

  connectedCallback() {
    this.innerHTML = this.getNavbarContent();
    this.attachEventListeners();
  }

  disconnectedCallback() {
    const mobileMenuButton = this.querySelector('#mobile-menu-button');
    const mobileLogoutBtn = this.querySelector('#mobile-logout-btn');
    const desktopLogoutBtn = this.querySelector('#desktop-logout-btn');
    const userMenuButton = this.querySelector('#user-menu-button');
    const overlay = this.querySelector('#mobile-menu-overlay');

    if (mobileMenuButton) {
      mobileMenuButton.removeEventListener('click', this.toggleMobileMenu);
    }
    if (mobileLogoutBtn) {
      mobileLogoutBtn.removeEventListener('click', this.handleLogout);
    }
    if (desktopLogoutBtn) {
      desktopLogoutBtn.removeEventListener('click', this.handleLogout);
    }
    if (userMenuButton) {
      userMenuButton.removeEventListener('click', this.toggleUserMenu);
    }
    if (overlay) {
      overlay.removeEventListener('click', this.toggleMobileMenu);
    }

    this.removeEventListener('click', this.handleNavigation);
    document.removeEventListener('click', this.handleClickOutside);
    document.removeEventListener('keydown', this._handleEscapeKey);
  }
}

if (!customElements.get('app-navbar')) {
  customElements.define('app-navbar', NavbarComponent);
}

export const Navbar = () => {
  const navbar = document.createElement('app-navbar');
  return navbar.outerHTML;
};