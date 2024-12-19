const AdminHeader = {
  formatDateTime() {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const now = new Date();
    const day = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const desktopFormat = `${day}, ${date} ${month} ${year} - ${hours}:${minutes}:${seconds}`;
    const mobileFormat = `${day}, ${date} ${month}`;

    return { desktopFormat, mobileFormat };
  },

  toggleUserDropdown(event) {
    if (event) event.stopPropagation();
    const userDropdown = document.getElementById('userDropdown');
    const notifDropdown = document.getElementById('notificationDropdown');

    if (notifDropdown && !notifDropdown.classList.contains('hidden')) {
      notifDropdown.classList.add('hidden');
    }

    userDropdown?.classList.toggle('hidden');
  },

  toggleNotificationDropdown(event) {
    if (event) event.stopPropagation();
    const notifDropdown = document.getElementById('notificationDropdown');
    const userDropdown = document.getElementById('userDropdown');

    if (userDropdown && !userDropdown.classList.contains('hidden')) {
      userDropdown.classList.add('hidden');
    }

    notifDropdown?.classList.toggle('hidden');
  },

  render() {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const roleDisplay = user.role === 'superadmin' ? 'Super Admin' : 'Admin';
    const { desktopFormat, mobileFormat } = this.formatDateTime();

    return `
              <header class="lg:ml-64 bg-white shadow-sm">
                  <div class="flex items-center justify-between px-4 py-3">
                      <div class="flex items-center space-x-4">
                          <!-- Menu button -->
                          <button id="sidebarCollapseBtn" 
                                  class="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors duration-200"
                                  aria-label="Toggle Sidebar">
                              <span class="material-icons-round">menu</span>
                          </button>
                          
                          <!-- DateTime Display -->
                          <div id="dateTimeDisplay" class="text-gray-600 font-medium">
                              <!-- Desktop DateTime -->
                              <span class="hidden lg:inline">${desktopFormat}</span>
                              <!-- Mobile DateTime -->
                              <span class="lg:hidden inline">${mobileFormat}</span>
                          </div>
                      </div>
                      
                      <div class="flex items-center space-x-3">
                          <!-- User Menu -->
                          <div class="relative">
                              <button id="userMenuBtn" 
                                      class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                  <span class="material-icons-round text-gray-600 text-2xl">account_circle</span>
                                  <span class="text-sm font-medium text-gray-700">${roleDisplay}</span>
                                  <span class="material-icons-round text-gray-400">expand_more</span>
                              </button>
                              
                              <!-- User Dropdown -->
                              <div id="userDropdown" 
                                   class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                                  ${user.role !== 'superadmin' ? `
                                      <a href="/admin/profile" 
                                         class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                                          <span class="material-icons-round mr-2 text-gray-400">person</span>
                                          Profile
                                      </a>
                                  ` : ''}
                                  <button id="logoutBtn" 
                                          class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200">
                                      <span class="material-icons-round mr-2">logout</span>
                                      Logout
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              </header>
          `;
  },

  afterRender() {
    const updateDateTime = () => {
      const dateTimeDisplay = document.getElementById('dateTimeDisplay');
      if (dateTimeDisplay) {
        const { desktopFormat, mobileFormat } = this.formatDateTime();
        const desktopSpan = dateTimeDisplay.querySelector('.lg\\:inline');
        const mobileSpan = dateTimeDisplay.querySelector('.lg\\:hidden');

        if (desktopSpan) desktopSpan.textContent = desktopFormat;
        if (mobileSpan) mobileSpan.textContent = mobileFormat;
      }
    };
    setInterval(updateDateTime, 1000);

    const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
    const userMenuBtn = document.getElementById('userMenuBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const profileLink = document.querySelector('a[href="/admin/profile"]');

    sidebarCollapseBtn?.addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      if (sidebar) {
        sidebar.classList.toggle('-translate-x-full');
      }
    });

    userMenuBtn?.addEventListener('click', this.toggleUserDropdown);

    document.addEventListener('click', (event) => {
      const userDropdown = document.getElementById('userDropdown');
      if (!event.target.closest('#userMenuBtn') && !event.target.closest('#userDropdown')) {
        userDropdown?.classList.add('hidden');
      }
    });

    profileLink?.addEventListener('click', (e) => {
      e.preventDefault();
      window.App.navigateTo('/admin/profile');
      document.getElementById('userDropdown').classList.add('hidden');
    });

    logoutBtn?.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.getElementById('userDropdown')?.classList.add('hidden');
      }
    });
  }
};

export default AdminHeader;