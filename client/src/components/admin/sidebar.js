const Sidebar = {
  render() {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const isSuperAdmin = user.role === 'superadmin';
    const isAdmin = user.role === 'admin';

    const currentPath = window.location.pathname;

    return `
            <aside id="sidebar" class="fixed inset-y-0 left-0 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-gradient-to-t from-[#00899B] to-[#002F35] bg-opacity-90 z-40">
                <div class="px-4 py-8 flex flex-col h-full">
                    <div class="flex items-center justify-between mb-8">
                        <h1 class="text-xl lg:text-2xl font-bold text-white">Admin Panel</h1>
                        <button id="closeMenuBtn" class="lg:hidden text-white p-2">
                            <span class="material-icons-round">close</span>
                        </button>
                    </div>
                    
                    <nav class="flex flex-col space-y-2 flex-grow" id="sidebarNav">
                        <a href="/admin" 
                           class="nav-item text-white py-3 hover:bg-[#00899B] rounded-lg px-4 flex items-center ${currentPath === '/admin' ? 'bg-[#00899B]' : ''}">
                            <span class="material-icons-round mr-3">dashboard</span>
                            <span class="nav-text text-sm lg:text-base">Dashboard</span>
                        </a>
                        
                        <a href="/admin/laporan" 
                           class="nav-item text-white py-3 hover:bg-[#00899B] rounded-lg px-4 flex items-center ${currentPath === '/admin/laporan' ? 'bg-[#00899B]' : ''}">
                            <span class="material-icons-round mr-3">inbox</span>
                            <span class="nav-text text-sm lg:text-base">Laporan Masuk</span>
                        </a>
                        
                        <a href="/admin/riwayat" 
                           class="nav-item text-white py-3 hover:bg-[#00899B] rounded-lg px-4 flex items-center ${currentPath === '/admin/riwayat' ? 'bg-[#00899B]' : ''}">
                            <span class="material-icons-round mr-3">history</span>
                            <span class="nav-text text-sm lg:text-base">Riwayat</span>
                        </a>

                        ${isAdmin ? `
                            <a href="/admin/profile" 
                               class="nav-item text-white py-3 hover:bg-[#00899B] rounded-lg px-4 flex items-center ${currentPath === '/admin/profile' ? 'bg-[#00899B]' : ''}">
                                <span class="material-icons-round mr-3">person</span>
                                <span class="nav-text text-sm lg:text-base">Profile</span>
                            </a>
                        ` : ''}

                        ${isSuperAdmin ? `
                            <a href="/admin/users" 
                               class="nav-item text-white py-3 hover:bg-[#00899B] rounded-lg px-4 flex items-center ${currentPath === '/admin/users' ? 'bg-[#00899B]' : ''}">
                                <span class="material-icons-round mr-3">group</span>
                                <span class="nav-text text-sm lg:text-base">Management User</span>
                            </a>
                            
                            <a href="/admin/admins" 
                               class="nav-item text-white py-3 hover:bg-[#00899B] rounded-lg px-4 flex items-center ${currentPath === '/admin/admins' ? 'bg-[#00899B]' : ''}">
                                <span class="material-icons-round mr-3">admin_panel_settings</span>
                                <span class="nav-text text-sm lg:text-base">Management Admin</span>
                            </a>
                        ` : ''}
                    </nav>

                    <div class="mt-auto pt-4 text-center text-white text-sm opacity-70">
                        &copy; ${new Date().getFullYear()} UrbanAID
                    </div>
                </div>
            </aside>

            <div id="sidebarOverlay" class="fixed inset-0 pointer-events-none transition-opacity duration-300 ease-in-out lg:hidden"></div>
        `;
  },

  afterRender() {
    const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    const toggleSidebar = () => {
      if (sidebar && overlay) {
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('opacity-0');
        overlay.classList.toggle('pointer-events-none');
      }
    };

    sidebarCollapseBtn?.addEventListener('click', toggleSidebar);

    closeMenuBtn?.addEventListener('click', toggleSidebar);

    overlay?.addEventListener('click', toggleSidebar);

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item) => {
      item.addEventListener('click', () => {
        if (window.innerWidth < 1024) {
          toggleSidebar();
        }
      });
    });
  }
};

export default Sidebar;
