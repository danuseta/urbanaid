import './styles/main.css';
import './styles/responsive.css';
import './styles/elemen.css';
import './styles/swal.css';
import './styles/admin.css';
import swRegister from './utils/sw-register';
import App from './App';

const initApp = async () => {
  const loadingElement = document.getElementById('page-loading');
  
  try {
    if (loadingElement) loadingElement.classList.remove('hidden');

    const app = App.init();
    await app.renderPage();

    window.addEventListener('load', () => {
      swRegister().catch(console.error);
    });

    if (loadingElement) loadingElement.classList.add('hidden');

    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      if (loadingElement) loadingElement.classList.add('hidden');

      const errorContainer = document.createElement('div');
      errorContainer.className = 'fixed inset-x-0 top-4 flex items-center justify-center z-50';
      errorContainer.innerHTML = `
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong class="font-bold">Oops!</strong>
          <span class="block sm:inline"> Terjadi kesalahan. Silakan muat ulang halaman.</span>
        </div>
      `;
      document.body.appendChild(errorContainer);

      setTimeout(() => {
        errorContainer.remove();
      }, 5000);
    });

  } catch (error) {
    console.error('Failed to initialize app:', error);
    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = `
        <div class="min-h-screen flex items-center justify-center">
          <div class="text-center">
            <h1 class="text-2xl font-bold text-gray-800 mb-4">Oops! Terjadi Kesalahan</h1>
            <p class="text-gray-600 mb-4">Gagal memuat aplikasi. Silakan muat ulang halaman.</p>
            <button onclick="window.location.reload()" 
              class="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors">
              Muat Ulang
            </button>
          </div>
        </div>
      `;
    }
    if (loadingElement) loadingElement.classList.add('hidden');
  }
};

document.addEventListener('DOMContentLoaded', initApp);

window.addEventListener('popstate', () => {
  const app = App.init();
  app.renderPage();
});

export { initApp };