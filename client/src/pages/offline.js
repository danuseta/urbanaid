import { Navbar } from '../components/common/Navbar.js';
import { Footer } from '../components/common/Footer.js';
import Swal from 'sweetalert2';

const createOfflineUI = () => {
  const navbar = Navbar();
  const footer = Footer();

  const template = `
    <div class="min-h-screen flex flex-col">
      ${navbar}
      <div class="flex-grow flex items-center justify-center p-4">
        <div class="bg-white/90 backdrop-blur-sm rounded-lg p-8 max-w-md w-full text-center shadow-xl border border-gray-200">
          <div class="text-6xl mb-4 text-[#00899B]">
            <i class="material-icons-round">wifi_off</i>
          </div>
          <h1 class="text-2xl font-bold mb-4 text-[#002F35]">Anda Sedang Offline</h1>
          <p class="text-gray-600 mb-6">Koneksi internet Anda terputus. Beberapa fitur mungkin tidak tersedia.</p>
          <button 
            id="retry-connection-btn"
            class="px-6 py-2 bg-[#00899B] text-white rounded-lg hover:bg-[#007A8A] transition-colors">
            Coba Lagi
          </button>
        </div>
      </div>
      ${footer}
    </div>
  `;

  const parser = new DOMParser();
  const doc = parser.parseFromString(template, 'text/html');
  const offlineElement = doc.body.firstChild;

  const retryBtn = offlineElement.querySelector('#retry-connection-btn');
  retryBtn.addEventListener('click', () => {
    if (navigator.onLine) {
      window.location.reload();
    } else {
      Swal.fire({
        title: 'Offline',
        text: 'Koneksi internet masih terputus. Mohon periksa koneksi Anda.',
        icon: 'warning',
        iconColor: '#00899B',
        confirmButtonText: 'OK',
        confirmButtonColor: '#00899B',
        customClass: {
          popup: 'swal2-popup',
          title: 'swal2-title',
          htmlContainer: 'swal2-html-container',
          confirmButton: 'swal2-confirm'
        }
      });
    }
  });

  return offlineElement;
};

const handleOffline = () => {
  const app = document.getElementById('app');
  if (!app) return;

  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'warning',
    title: 'Internet Terputus',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    customClass: {
      popup: 'swal2-toast',
      title: 'swal2-toast-title',
    }
  });

  const originalContent = app.innerHTML;

  app.innerHTML = '';
  app.appendChild(createOfflineUI());

  const handleOnline = () => {
    if (navigator.onLine) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Internet Terhubung',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
        customClass: {
          popup: 'swal2-toast',
          title: 'swal2-toast-title',
        }
      });

      setTimeout(() => {
        app.innerHTML = originalContent;

        Swal.fire({
          title: 'Tersambung Kembali',
          text: 'Koneksi internet telah pulih.',
          icon: 'success',
          iconColor: '#00899B',
          confirmButtonText: 'OK',
          confirmButtonColor: '#00899B',
          customClass: {
            popup: 'swal2-popup',
            title: 'swal2-title',
            htmlContainer: 'swal2-html-container',
            confirmButton: 'swal2-confirm'
          }
        });

        window.removeEventListener('online', handleOnline);
      }, 3000);
    }
  };

  window.addEventListener('online', handleOnline);
};

const checkOfflineStatus = () => {
  if (!navigator.onLine) {
    handleOffline();
  }
};

window.addEventListener('load', checkOfflineStatus);
window.addEventListener('offline', handleOffline);

export default handleOffline;
