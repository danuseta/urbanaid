import UrlParser from '../../utils/url-parser.js';
import { Navbar } from '../../components/common/Navbar.js';
import { Footer } from '../../components/common/Footer.js';
import ReviewService from '../../services/review-service';
import Loading from '../../components/common/Loading.js';

const DetailLaporan = {
  data: null,
  currentRating: 0,
  userReview: null,
  isSubmitting: false,
  map: null,

  async getData(hashedId) {
    try {
      if (!hashedId) {
        throw new Error('ID tidak valid');
      }
  
      if (!window.riwayatData) {
        console.log('Fetching riwayat data...');
        const { default: RiwayatService } = await import('../../services/riwayat-service');
        window.riwayatData = await RiwayatService.getRiwayatByUser();
      }
  
      const searchId = String(hashedId);
      const report = window.riwayatData.find((r) => String(r.id) === searchId);
  
      if (!report) {
        throw new Error(`Laporan dengan ID ${searchId} tidak ditemukan`);
      }
  
      this.data = {
        id: report.id,
        judul: report.judul,
        jenisInfrastruktur: report.jenis_infrastruktur,
        deskripsi: report.deskripsi,
        tanggalKejadian: report.tanggal_kejadian,
        tanggalPengajuan: report.created_at,
        tanggalSelesai: report.tanggal_selesai,
        alamat: report.alamat,
        status: report.status,
        keterangan: report.keterangan_laporan,
        buktiLampiran: report.bukti_lampiran,
        latitude: report.latitude,
        longitude: report.longitude
      };
  
      await this.checkUserReview();
      return this.data;
    } catch (error) {
      console.error('Error getting report data:', error);
      throw error;
    }
  },

  async checkUserReview() {
    try {
      const reviews = await ReviewService.getReviewsByLaporanId(this.data.id);
      const userData = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
      this.userReview = reviews.find((review) => review.user_id === userData.id);
    } catch (error) {
      console.error('Error checking user review:', error);
    }
  },

  cleanupMap() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  },

  initMap() {
    if (this.data?.latitude && this.data?.longitude) {
      this.cleanupMap();

      const mapContainer = document.getElementById('detailMap');
      if (mapContainer && typeof L !== 'undefined') {
        this.map = L.map('detailMap').setView([this.data.latitude, this.data.longitude], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        L.marker([this.data.latitude, this.data.longitude])
          .addTo(this.map)
          .bindPopup(`<div class="p-2">${this.data.alamat}</div>`)
          .openPopup();

        setTimeout(() => {
          this.map.invalidateSize();
        }, 100);
      }
    }
  },

  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return date.toLocaleDateString('id-ID', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  },

  getStatusIcon(status) {
    switch (status.toLowerCase()) {
    case 'diterima':
      return 'check_circle';
    case 'ditolak':
      return 'cancel';
    default:
      return 'info';
    }
  },

  getStatusClass(status) {
    switch (status.toLowerCase()) {
    case 'diterima':
      return {
        bg: 'bg-emerald-100',
        text: 'text-emerald-800'
      };
    case 'ditolak':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800'
      };
    }
  },

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  },

  getImagePath(imagePath) {
    if (!imagePath) return '/images/placeholder.jpg';
    return imagePath;
  },

  setRating(rating) {
    this.currentRating = rating;
    document.querySelectorAll('[data-rating]').forEach((btn, index) => {
      const star = btn.querySelector('.material-icons-round');
      if (star) {
        star.classList.toggle('text-yellow-400', index < rating);
        star.classList.toggle('text-gray-300', index >= rating);
      }
    });
  },

  async submitFeedback(event) {
    event.preventDefault();
    if (this.isSubmitting) return false;

    try {
      this.isSubmitting = true;

      Swal.fire({
        title: 'Mengirim ulasan...',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });

      const feedbackText = document.getElementById('feedback').value;

      if (!this.currentRating) {
        throw new Error('Silakan berikan rating terlebih dahulu');
      }

      await ReviewService.createReview({
        laporan_id: this.data.id,
        rating: this.currentRating,
        review_text: feedbackText
      });

      window.riwayatData = null;

      await Swal.fire({
        icon: 'success',
        title: 'Terima Kasih!',
        text: 'Ulasan Anda telah berhasil dikirim',
        confirmButtonColor: '#00899B'
      });

      const currentUrl = window.location.hash;
      await this.init();

      const reviewSection = document.querySelector('[data-aos="fade-up"][data-aos-delay="600"]');
      if (reviewSection) {
        reviewSection.scrollIntoView({ behavior: 'smooth' });
      }

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message || 'Terjadi kesalahan saat mengirim ulasan',
        confirmButtonColor: '#00899B'
      });
    } finally {
      this.isSubmitting = false;
    }
    return false;
  },

  renderExistingReview() {
    return `
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Ulasan Anda</h3>
            <div class="bg-gray-50/80 rounded-lg p-4">
                <div class="flex items-center mb-2">
                    <div class="flex">
                        ${[1, 2, 3, 4, 5].map((num) => `
                            <span class="material-icons-round text-2xl ${num <= this.userReview.rating ? 'text-yellow-400' : 'text-gray-300'}">
                                star
                            </span>
                        `).join('')}
                    </div>
                    <span class="ml-2 text-sm text-gray-600">
                        ${this.userReview.created_at ? this.formatDate(this.userReview.created_at) : ''}
                    </span>
                </div>
                <p class="text-base text-gray-700 whitespace-pre-line">${this.userReview.review_text}</p>
            </div>
        `;
  },

  renderReviewForm() {
    return `
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Feedback Laporan</h3>
            <form onsubmit="return DetailLaporan.submitFeedback(event)" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Berikan Rating</label>
                    <div class="flex space-x-2">
                        ${[1, 2, 3, 4, 5].map((num) => `
                            <button type="button"
                                onclick="DetailLaporan.setRating(${num})"
                                class="p-1 hover:scale-110 transition-transform duration-200 focus:outline-none"
                                data-rating="${num}">
                                <span class="material-icons-round text-2xl text-gray-300">
                                    star
                                </span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div>
                    <label for="feedback" class="block text-sm font-medium text-gray-700 mb-2">
                        Ulasan
                    </label>
                    <textarea
                        id="feedback"
                        name="feedback"
                        rows="4"
                        class="w-full px-4 py-2 text-base text-gray-900 border-2 border-gray-200 rounded-lg focus:border-[#00899B] focus:ring-2 focus:ring-[#00899B] transition-colors duration-200 resize-none bg-white/80 backdrop-blur-sm"
                        placeholder="Berikan ulasan Anda terkait penanganan laporan ini..."
                    ></textarea>
                </div>

                <div class="flex justify-end">
                    <button
                        type="submit"
                        class="flex items-center justify-center min-h-[44px] gap-2 px-6 py-2 bg-gradient-to-r from-[#00899B] to-[#002F35] text-white text-base font-semibold rounded-lg hover:shadow-lg transition-shadow"
                    >
                        <span class="material-icons-round">send</span>
                        Kirim Ulasan
                    </button>
                </div>
            </form>
        `;
  },

  render() {
    if (!this.data) {
      return `
                ${Navbar()}
                <div class="flex items-center justify-center min-h-screen bg-gray-50">
                    <div class="text-center">
                        <div class="inline-block w-8 h-8 border-4 border-[#00899B] border-t-transparent rounded-full animate-spin"></div>
                        <p class="mt-4 text-base text-gray-600">Memuat detail laporan...</p>
                    </div>
                </div>
                ${Footer()}
            `;
    }

    const statusClass = this.getStatusClass(this.data.status);

    return `
            ${Navbar()}
            <div class="min-h-screen bg-gray-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 text-center md:mt-4 lg:mt-6" data-aos="fade-up">Detail Laporan</h1>
                    
                    <div class="group relative" data-aos="fade-up" data-aos-delay="100">
                        <div class="absolute inset-0 bg-gradient-to-r from-[#00899B]/20 to-[#002F35]/20 rounded-3xl blur-2xl transform -rotate-1"></div>
                        <div class="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
                            <div class="relative h-96 bg-gray-100 flex items-center justify-center">
                                <button 
                                    onclick="window.App.navigateTo('/pelaporan/riwayat')"
                                    class="absolute top-4 left-4 z-10 flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg text-gray-600 hover:text-gray-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#00899B] focus:ring-offset-2"
                                    aria-label="Kembali ke halaman riwayat"
                                >
                                    <span class="material-icons-round text-xl">arrow_back</span>
                                </button>
         
                                <img 
                                    src="${this.getImagePath(this.data.buktiLampiran)}"
                                    alt="Bukti lampiran"
                                    onerror="this.src='/images/placeholder.jpg'"
                                    class="lazyload h-full w-auto max-w-full object-contain"
                                    loading="lazy"
                                >
                                <div class="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm text-white p-4">
                                    <div class="flex items-center">
                                        <span class="material-icons-round mr-2 text-xl">photo</span>
                                        <span class="text-base">Bukti Lampiran</span>
                                    </div>
                                </div>
                            </div>
         
                            <div class="p-8 md:p-10">
                                <div class="mb-6" data-aos="fade-up" data-aos-delay="200">
                                    <div class="text-sm font-medium text-gray-500">ID Laporan</div>
                                    <div class="mt-1 text-xl font-semibold text-gray-900">
                                        UAID-24${String(this.data.id).padStart(2, '0')}
                                    </div>
                                </div>
         
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="space-y-6" data-aos="fade-up" data-aos-delay="300">
                                        <div>
                                            <div class="text-sm font-medium text-gray-500">Judul Laporan</div>
                                            <div class="mt-1 text-base text-gray-900">${this.data.judul}</div>
                                        </div>
         
                                        <div>
                                            <div class="text-sm font-medium text-gray-500">Jenis Infrastruktur</div>
                                            <div class="mt-1 text-base text-gray-900">${this.data.jenisInfrastruktur}</div>
                                        </div>
         
                                        <div>
                                            <div class="text-sm font-medium text-gray-500">Status</div>
                                            <div class="mt-1">
                                                <div class="inline-flex items-center">
                                                    <span class="material-icons-round text-xl ${statusClass.text} mr-2">
                                                        ${this.getStatusIcon(this.data.status)}
                                                    </span>
                                                    <span class="${statusClass.bg} ${statusClass.text} px-4 py-1 rounded-full text-sm font-semibold">
                                                    ${this.capitalizeFirstLetter(this.data.status)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
         
<div class="space-y-6" data-aos="fade-up" data-aos-delay="400">
                                        <div>
                                            <div class="text-sm font-medium text-gray-500">Tanggal Kejadian</div>
                                            <div class="mt-1 text-base text-gray-900">
                                                ${this.formatDate(this.data.tanggalKejadian)}
                                            </div>
                                        </div>

                                        <div>
                                            <div class="text-sm font-medium text-gray-500">Tanggal Pengajuan</div>
                                            <div class="mt-1 text-base text-gray-900">
                                                ${this.formatDate(this.data.tanggalPengajuan)}
                                            </div>
                                        </div>
         
                                        <div>
                                            <div class="text-sm font-medium text-gray-500">Tanggal Penyelesaian</div>
                                            <div class="mt-1 text-base text-gray-900">
                                                ${this.data.tanggalSelesai ? this.formatDate(this.data.tanggalSelesai) : '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
         
                                <div class="mt-6 space-y-6" data-aos="fade-up" data-aos-delay="500">
                                    <div>
                                        <div class="text-sm font-medium text-gray-500">Alamat</div>
                                        <div class="mt-1 text-base text-gray-900">${this.data.alamat}</div>
                                    </div>

                                    ${this.data.latitude && this.data.longitude ? `
                                      <div>
                                          <div class="text-sm font-medium text-gray-500 mb-2">Lokasi pada Peta</div>
                                          <div class="relative w-full h-[400px] rounded-xl overflow-hidden shadow-md" id="detailMap"></div>
                                          <div class="mt-2 flex flex-col space-y-1">
                                              <a href="https://www.google.com/maps?q=${this.data.latitude},${this.data.longitude}" 
                                                 target="_blank" 
                                                 class="inline-flex items-center text-blue-600 hover:text-blue-800 text-base">
                                                  <span class="material-icons-round text-base mr-1">map</span>
                                                  Google Maps
                                              </a>
                                              <a href="https://www.openstreetmap.org/?mlat=${this.data.latitude}&mlon=${this.data.longitude}&zoom=15" 
                                                 target="_blank" 
                                                 class="inline-flex items-center text-blue-600 hover:text-blue-800 text-base">
                                                  <span class="material-icons-round text-base mr-1">open_in_new</span>
                                                  OpenStreetMap
                                              </a>
                                          </div>
                                      </div>
                                  ` : ''}

                                    <div>
                                        <div class="text-sm font-medium text-gray-500">Deskripsi</div>
                                        <div class="mt-1 text-base text-gray-900 whitespace-pre-line">${this.data.deskripsi}</div>
                                    </div>
         
                                    <div>
                                        <div class="text-sm font-medium text-gray-500">Keterangan Laporan</div>
                                        <div class="mt-1 text-base text-gray-900">${this.data.keterangan || '-'}</div>
                                    </div>
                                </div>
         
                                ${this.data.status === 'diterima' || this.data.status === 'ditolak' ?
    this.userReview ?
      `<div class="mt-8 relative" data-aos="fade-up" data-aos-delay="600">
                                            <div class="absolute inset-0 bg-gradient-to-r from-[#00899B]/10 to-[#002F35]/10 rounded-xl blur-xl transform -rotate-1"></div>
                                            <div class="relative bg-white/60 backdrop-blur-sm rounded-xl p-6">
                                                ${this.renderExistingReview()}
                                            </div>
                                        </div>` :
      `<div class="mt-8 relative" data-aos="fade-up" data-aos-delay="600">
                                            <div class="absolute inset-0 bg-gradient-to-r from-[#00899B]/10 to-[#002F35]/10 rounded-xl blur-xl transform -rotate-1"></div>
                                            <div class="relative bg-white/60 backdrop-blur-sm rounded-xl p-6">
                                                ${this.renderReviewForm()}
                                            </div>
                                        </div>`
    : ''
}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ${Footer()}
        `;
  },

  async init() {
    try {
      window.scrollTo(0, 0);

      const hashedId = UrlParser.getDetailId();
      console.log('Parsed hashed ID:', hashedId);

      if (!hashedId) {
        throw new Error('ID Laporan tidak ditemukan');
      }

      await this.getData(hashedId);

      const mainContainer = document.querySelector('#app');
      if (mainContainer) {
        mainContainer.innerHTML = this.render();

        AOS.init({
          duration: 1000,
          once: true,
          offset: 50,
          delay: 100
        });

        setTimeout(() => {
          this.initMap();
        }, 300);
      } else {
        throw new Error('Container #app tidak ditemukan');
      }

      window.DetailLaporan = this;
    } catch (error) {
      console.error('Error initializing detail page:', error);
      const errorMessage = error.message || 'Terjadi kesalahan saat memuat detail laporan';

      const mainContainer = document.querySelector('#app');
      if (mainContainer) {
        mainContainer.innerHTML = `
                    ${Navbar()}
                    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                        <div class="text-center p-4">
                            <span class="material-icons-round text-red-500 text-4xl mb-4">error</span>
                            <h2 class="text-xl font-bold text-gray-800 mb-2">Error!</h2>
                            <p class="text-gray-600 mb-4">${errorMessage}</p>
                            <button 
                                onclick="window.App.navigateTo('/pelaporan/riwayat')"
                                class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#00899B] to-[#002F35] text-white rounded-lg hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00899B]"
                            >
                                <span class="material-icons-round mr-2">arrow_back</span>
                                Kembali ke Riwayat
                            </button>
                        </div>
                    </div>
                    ${Footer()}
                `;
      }
    }
  },

  cleanup() {
    this.cleanupMap();
    this.data = null;
    this.currentRating = 0;
    this.userReview = null;
    this.isSubmitting = false;
    window.riwayatData = null;
    window.DetailLaporan = null;
    AOS.refresh();
    Loading.hide();
  }
};

export default DetailLaporan;