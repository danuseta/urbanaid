import Sidebar from '../../components/admin/Sidebar.js';
import Loading from '../../components/common/Loading.js';
import RiwayatService from '../../services/riwayat-service.js';
import UrlParser from '../../utils/url-parser.js';
import '../../styles/admin.css';

const DetailRiwayat = {
  reportId: null,
  map: null,

  async init() {
    try {
      this.reportId = UrlParser.getRiwayatDetailId();
      console.log('Got riwayat ID from URL:', this.reportId);

      if (!this.reportId) {
        throw new Error('Invalid report ID');
      }

      await this.render();
      Sidebar.afterRender();
      await this.loadReportDetails();
      this.initializeImageModal();
    } catch (error) {
      console.error('Error in DetailRiwayat init:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal memuat detail riwayat'
      });
    }
  },

  cleanupMap() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  },

  initMap(latitude, longitude, address) {
    this.cleanupMap();

    const mapContainer = document.getElementById('reportMap');
    if (mapContainer && typeof L !== 'undefined') {
      this.map = L.map('reportMap').setView([latitude, longitude], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      L.marker([latitude, longitude])
        .addTo(this.map)
        .bindPopup(`<div class="p-2">${address}</div>`)
        .openPopup();

      setTimeout(() => {
        this.map.invalidateSize();
      }, 100);
    }
  },

  async loadReportDetails() {
    try {
      Loading.show();
      if (!this.reportId) {
        throw new Error('Report ID is missing');
      }
      console.log('Loading riwayat details for ID:', this.reportId);
      const report = await RiwayatService.getDetailRiwayat(this.reportId);

      const formattedReport = {
        id: report.id,
        judul: report.judul,
        jenisInfrastruktur: report.jenis_infrastruktur,
        deskripsi: report.deskripsi,
        tanggalKejadian: new Date(report.tanggal_kejadian).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        tanggalSelesai: new Date(report.tanggal_selesai).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        alamat: report.alamat,
        status: report.status.charAt(0).toUpperCase() + report.status.slice(1),
        namaPelapor: report.nama_pelapor,
        keteranganLaporan: report.keterangan_laporan,
        buktiLampiran: {
          url: report.bukti_lampiran,
          caption: 'Bukti Lampiran Laporan'
        },
        latitude: report.latitude,
        longitude: report.longitude
      };

      this.renderReportDetails(formattedReport);
    } catch (error) {
      console.error('Error loading report details:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Gagal memuat detail riwayat'
      });
    } finally {
      Loading.hide();
    }
  },

  renderReportDetails(report) {
    const detailContainer = document.getElementById('report-detail-container');
    if (!detailContainer) return;

    detailContainer.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-4 lg:p-6">
        <!-- Header -->
        <div class="flex items-center gap-4 mb-6 pb-4 border-b">
          <a href="/admin/riwayat" 
             class="inline-flex items-center justify-center p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <span class="material-icons-round">arrow_back</span>
          </a>
          <div>
            <h1 class="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
              ${report.judul}
            </h1>
            <p class="text-gray-600 text-sm lg:text-base">
              ID Laporan: #${report.id}
            </p>
          </div>
        </div>

        <!-- Information Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div class="h-full">
            <h2 class="text-sm uppercase text-gray-500 font-medium mb-2">Detail Laporan</h2>
            <div class="bg-gray-50 rounded-lg p-4 h-[calc(100%-2rem)]">
              <div class="flex flex-col h-full justify-between">
                <div>
                  <div class="mb-4">
                    <label class="text-sm text-gray-500">Status</label>
                    <p class="mt-1">
                      <span class="px-3 py-1 rounded-full text-sm ${
  report.status === 'Diterima' ? 'bg-green-100 text-green-800' :
    'bg-red-100 text-red-800'
}">
                        ${report.status}
                      </span>
                    </p>
                  </div>
                  <div class="mb-4">
                    <label class="text-sm text-gray-500">Jenis Infrastruktur</label>
                    <p class="text-gray-800 font-medium">${report.jenisInfrastruktur}</p>
                  </div>
                  <div class="mb-4">
                    <label class="text-sm text-gray-500">Deskripsi</label>
                    <p class="text-gray-800">${report.deskripsi}</p>
                  </div>
                  <div class="mb-4">
                    <label class="text-sm text-gray-500">Alamat</label>
                    <p class="text-gray-800">${report.alamat}</p>
                  </div>
                  <div class="mb-4">
                    <label class="text-sm text-gray-500">Tanggal Kejadian</label>
                    <p class="text-gray-800">${report.tanggalKejadian}</p>
                  </div>
                  <div class="mb-4">
                    <label class="text-sm text-gray-500">Tanggal Selesai</label>
                    <p class="text-gray-800">${report.tanggalSelesai}</p>
                  </div>
                  <div class="mb-4">
                    <label class="text-sm text-gray-500">Keterangan Laporan</label>
                    <div class="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div class="flex items-start space-x-3">
                        <span class="material-icons-round text-blue-500 mt-0.5">info</span>
                        <div>
                          <h4 class="font-semibold text-blue-900 mb-1">Catatan Admin:</h4>
                          <p class="text-blue-800 whitespace-pre-line">${report.keteranganLaporan}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Map Section -->
                  <div class="mb-4">
                    <label class="text-sm text-gray-500">Lokasi pada Peta</label>
                    ${report.latitude && report.longitude ? `
                      <div id="reportMap" class="h-80 mt-2 rounded-lg"></div>
                      <div class="mt-2 flex flex-col space-y-2">
                        <a href="https://www.google.com/maps?q=${report.latitude},${report.longitude}" 
                           target="_blank" 
                           class="inline-flex items-center text-blue-600 hover:text-blue-800">
                          <span class="material-icons-round text-sm mr-1">map</span>
                          Google Maps
                        </a>
                        <a href="https://www.openstreetmap.org/?mlat=${report.latitude}&mlon=${report.longitude}&zoom=15" 
                           target="_blank" 
                           class="inline-flex items-center text-blue-600 hover:text-blue-800">
                          <span class="material-icons-round text-sm mr-1">open_in_new</span>
                          OpenStreetMap
                        </a>
                      </div>
                    ` : `
                      <div class="mt-2 p-4 bg-gray-100 rounded-lg text-center text-gray-600">
                        <span class="material-icons-round text-2xl mb-2">location_off</span>
                        <p>Lokasi tidak tersedia di peta</p>
                      </div>
                    `}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bukti Lampiran -->
          <div class="h-full">
            <h2 class="text-sm uppercase text-gray-500 font-medium mb-2">Bukti Lampiran</h2>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="relative h-full min-h-[600px] group">
                <img src="${report.buktiLampiran.url}"
                     alt="Bukti lampiran"
                     class="absolute inset-0 w-full h-full object-contain rounded-lg"
                     onerror="this.src='https://via.placeholder.com/400x300?text=Bukti+Lampiran+Tidak+Tersedia'">
                <button onclick="showImageModal('${report.buktiLampiran.url}')" 
                        class="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="material-icons-round">fullscreen</span>
                </button>
              </div>
              <p class="text-sm text-gray-600 text-center mt-4">${report.buktiLampiran.caption}</p>
            </div>
          </div>

        <div id="imageModal" class="fixed inset-0 bg-black/90 hidden z-50">
            <div class="fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/30 p-2 rounded-lg backdrop-blur-sm z-[60]">
                <button onclick="zoomIn()" 
                        class="p-2 text-white hover:text-gray-300 bg-black/50 rounded-lg flex items-center gap-1">
                    <span class="material-icons-round">zoom_in</span>
                    <span class="text-sm">Zoom In</span>
                </button>
                <button onclick="zoomOut()" 
                        class="p-2 text-white hover:text-gray-300 bg-black/50 rounded-lg flex items-center gap-1">
                    <span class="material-icons-round">zoom_out</span>
                    <span class="text-sm">Zoom Out</span>
                </button>
                <button id="panButton"
                        onclick="togglePanMode()" 
                        class="p-2 text-white hover:text-gray-300 bg-black/50 rounded-lg flex items-center gap-1">
                    <span class="material-icons-round">pan_tool</span>
                    <span class="text-sm">Pan</span>
                </button>
                <button onclick="resetTransform()" 
                        class="p-2 text-white hover:text-gray-300 bg-black/50 rounded-lg flex items-center gap-1">
                    <span class="material-icons-round">restart_alt</span>
                    <span class="text-sm">Reset</span>
                </button>
                <button onclick="closeImageModal()" 
                        class="p-2 text-white hover:text-gray-300 bg-black/50 rounded-lg flex items-center gap-1">
                    <span class="material-icons-round">close</span>
                    <span class="text-sm">Close</span>
                </button>
            </div>

            <div id="imageContainer" class="fixed inset-0 overflow-auto flex items-center justify-center">
                <img id="modalImage" 
                     src="" 
                     alt="Full size image" 
                     class="transform origin-center transition-transform duration-200 select-none max-w-none"
                     draggable="false">
            </div>
        </div>
        </div>
      </div>
    `;

    if (report.latitude && report.longitude) {
      this.initMap(report.latitude, report.longitude, report.alamat);
    }
  },

  render() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      <div class="min-h-screen bg-gray-100">
        ${Sidebar.render()}
        
        <main class="lg:ml-64 p-4 lg:p-8">
          <div id="report-detail-container">
          </div>
        </main>
      </div>
    `;
  },

  initializeImageModal() {
    const mapContainer = document.getElementById('reportMap');
    let currentZoom = 1;
    const zoomStep = 0.2;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;

    window.showImageModal = (imageUrl) => {
      const modal = document.getElementById('imageModal');
      const modalImage = document.getElementById('modalImage');
      const imageContainer = document.getElementById('imageContainer');

      modal.classList.remove('hidden');
      modalImage.src = imageUrl;

      modalImage.onload = () => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const imageAspect = modalImage.naturalWidth / modalImage.naturalHeight;
        const viewportAspect = viewportWidth / viewportHeight;

        if (imageAspect > viewportAspect) {
          const scale = (viewportWidth * 0.9) / modalImage.naturalWidth;
          modalImage.style.width = `${viewportWidth * 0.9}px`;
          modalImage.style.height = 'auto';
        } else {
          const scale = (viewportHeight * 0.9) / modalImage.naturalHeight;
          modalImage.style.height = `${viewportHeight * 0.9}px`;
          modalImage.style.width = 'auto';
        }
      };

      document.body.style.overflow = 'hidden';

      if (mapContainer) {
        mapContainer.style.opacity = '0.3';
        mapContainer.style.transition = 'opacity 0.3s ease';
      }

      currentZoom = 1;
      translateX = 0;
      translateY = 0;
      updateImageTransform();
    };

    window.closeImageModal = () => {
      const modal = document.getElementById('imageModal');
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';

      if (mapContainer) {
        mapContainer.style.opacity = '1';
      }

      currentZoom = 1;
      translateX = 0;
      translateY = 0;
      updateImageTransform();
    };

    const updateImageTransform = () => {
      const modalImage = document.getElementById('modalImage');
      if (modalImage) {
        modalImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
      }
    };

    window.togglePanMode = () => {
      const imageContainer = document.getElementById('imageContainer');
      const panButton = document.getElementById('panButton');
      const isPanning = imageContainer.style.cursor === 'grab';

      if (isPanning) {
        imageContainer.style.cursor = 'default';
        panButton.classList.remove('bg-blue-500');
        panButton.classList.add('bg-black/50');
      } else {
        imageContainer.style.cursor = 'grab';
        panButton.classList.remove('bg-black/50');
        panButton.classList.add('bg-blue-500');
      }
    };

    window.zoomIn = () => {
      currentZoom += zoomStep;
      updateImageTransform();
    };

    window.zoomOut = () => {
      if (currentZoom > zoomStep) {
        currentZoom -= zoomStep;
        updateImageTransform();
      }
    };

    window.resetTransform = () => {
      currentZoom = 1;
      translateX = 0;
      translateY = 0;
      updateImageTransform();

      const imageContainer = document.getElementById('imageContainer');
      const panButton = document.getElementById('panButton');
      imageContainer.style.cursor = 'default';
      panButton.classList.remove('bg-blue-500');
      panButton.classList.add('bg-black/50');
    };

    const imageContainer = document.getElementById('imageContainer');
    if (imageContainer) {
      imageContainer.addEventListener('mousedown', (e) => {
        if (e.target.id === 'modalImage') {
          isDragging = true;
          startX = e.clientX - translateX;
          startY = e.clientY - translateY;
          imageContainer.style.cursor = 'grabbing';
        }
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateImageTransform();
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
        imageContainer.style.cursor = 'grab';
      });

      imageContainer.addEventListener('dragstart', (e) => {
        e.preventDefault();
      });
    }

    const modal = document.getElementById('imageModal');
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeImageModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (modal && !modal.classList.contains('hidden')) {
        switch (e.key) {
        case 'Escape':
          closeImageModal();
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
        case '_':
          zoomOut();
          break;
        case 'ArrowLeft':
          translateX += 50;
          updateImageTransform();
          break;
        case 'ArrowRight':
          translateX -= 50;
          updateImageTransform();
          break;
        case 'ArrowUp':
          translateY += 50;
          updateImageTransform();
          break;
        case 'ArrowDown':
          translateY -= 50;
          updateImageTransform();
          break;
        }
      }
    });

    modal?.addEventListener('wheel', (e) => {
      if (!modal.classList.contains('hidden')) {
        e.preventDefault();
        if (e.deltaY < 0) {
          zoomIn();
        } else {
          zoomOut();
        }
      }
    });
  },

  cleanup() {
    this.cleanupMap();
    Loading.hide();
  }
};

export default DetailRiwayat;