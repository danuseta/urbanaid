import { Navbar } from '../../components/common/Navbar.js';
import { Footer } from '../../components/common/Footer.js';
import LaporanAktif from '../Reports/LaporanAktif.js';
import Riwayat from '../Reports/Riwayat.js';
import Profile from '../Profile/Profile.js';
import ReportService from '../../services/report-service.js';
import Loading from '../../components/common/Loading.js';
import MapComponent from '../../components/maps/MapComponent.js';

const PelaporanPage = {
  formData: {
    judul: '',
    deskripsi: '',
    jenisInfrastruktur: '',
    tanggalKejadian: '',
    alamatKejadian: '',
    lampiran: null
  },

  infraInfo: {
    'perkotaan': 'Jalan, jembatan, gedung pemerintahan, fasilitas umum yang mendukung aktivitas perkotaan.',
    'lingkungan': 'Sistem drainase, pengolahan air bersih, pengelolaan sampah, dan infrastruktur ramah lingkungan.',
    'sosial': 'Fasilitas kesehatan, pendidikan, ruang publik dan sarana sosial kemasyarakatan.'
  },

  formatDate(dateString) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const date = new Date(`${dateString  }T00:00:00+07:00`);
    const dayName = days[date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${day} ${month} ${year}`;
  },

  async init() {
    try {
      Loading.show();

      await this.renderPage();
      this.initializeEventListeners();
      this.initializeAOS();

    } catch (error) {
      console.error('Error initializing page:', error);
    } finally {
      Loading.hide();
    }
  },


  initializeAOS() {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 50,
      delay: 100
    });
  },

  async renderPage() {
    const mainContainer = document.querySelector('#app');
    const currentPath = window.location.pathname;

    const navigationPills = `
            <div class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-2 sm:gap-3 mb-8 px-4" data-aos="fade-up" data-aos-duration="800">
                <a href="/pelaporan" class="w-full sm:w-auto px-6 py-3 rounded-2xl font-semibold cursor-pointer transition-all duration-300 text-center ${currentPath === '/pelaporan' || currentPath === '/pelaporan/' ? 'bg-gradient-to-r from-[#00899B] to-[#002F35] text-white' : 'bg-gray-100 text-gray-700'}">
                    Beranda
                </a>
                <a href="/pelaporan/laporanaktif" class="w-full sm:w-auto px-6 py-3 rounded-2xl font-semibold cursor-pointer transition-all duration-300 text-center ${currentPath === '/pelaporan/laporanaktif' ? 'bg-gradient-to-r from-[#00899B] to-[#002F35] text-white' : 'bg-gray-100 text-gray-700'}">
                    Laporan Aktif
                </a>
                <a href="/pelaporan/riwayat" class="w-full sm:w-auto px-6 py-3 rounded-2xl font-semibold cursor-pointer transition-all duration-300 text-center ${currentPath === '/pelaporan/riwayat' ? 'bg-gradient-to-r from-[#00899B] to-[#002F35] text-white' : 'bg-gray-100 text-gray-700'}">
                    Riwayat
                </a>
                <a href="/pelaporan/profile" class="w-full sm:w-auto px-6 py-3 rounded-2xl font-semibold cursor-pointer transition-all duration-300 text-center ${currentPath === '/pelaporan/profile' ? 'bg-gradient-to-r from-[#00899B] to-[#002F35] text-white' : 'bg-gray-100 text-gray-700'}">
                    Profile
                </a>
            </div>
        `;

    const headerContent = `
            <div class="text-center mb-8 mt-12 px-4" data-aos="fade-up" data-aos-duration="1000">
                <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-snug">Platform Digital untuk Pengaduan Masyarakat</h1>
                <p class="text-base lg:text-lg text-gray-600 leading-relaxed">Laporkan Permasalahan Anda Secara Langsung</p>
            </div>
        `;

    let pageContent = `
            ${Navbar()}
            <div class="w-full max-w-7xl mx-auto px-4 lg:px-8">
                ${headerContent}
                ${navigationPills}
                <div class="w-full">
        `;

    if (currentPath === '/pelaporan/laporanaktif') {
      pageContent += await LaporanAktif.render();
    } else if (currentPath === '/pelaporan/riwayat') {
      pageContent += await Riwayat.render();
    } else if (currentPath === '/pelaporan/profile') {
      pageContent += Profile.render();
    } else {
      pageContent += `
                <div class="relative max-w-3xl mx-auto mb-10" data-aos="fade-up" data-aos-duration="1200">
    <div class="absolute inset-0 bg-gradient-to-r from-[#00899B]/20 to-[#002F35]/20 rounded-3xl blur-2xl transform -rotate-1"></div>
    
    <div class="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 md:p-10 shadow-xl">
        <form id="laporan-form" class="w-full" novalidate>
            <h2 class="text-xl lg:text-2xl font-bold text-gray-900 mb-6 text-center">Sampaikan Laporan Anda</h2>
            
            <div class="mb-5" data-aos="fade-up" data-aos-delay="100">
                <label for="judul" class="block font-semibold mb-2 text-sm text-gray-700">Judul Laporan</label>
                <input type="text" id="judul" name="judul" placeholder="Masukkan Judul" 
                       class="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00899B] text-base text-gray-900 placeholder-gray-500">
            </div>
            
            <div class="mb-5" data-aos="fade-up" data-aos-delay="200">
                <label for="deskripsi" class="block font-semibold mb-2 text-sm text-gray-700">Deskripsi Laporan</label>
                <textarea id="deskripsi" name="deskripsi" placeholder="Masukkan Deskripsi" 
                          class="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00899B] text-base text-gray-900 placeholder-gray-500 min-h-[100px] resize-y"></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                <div class="relative" data-aos="fade-up" data-aos-delay="300">
                    <label for="jenisInfrastruktur" class="block font-semibold mb-2 text-sm text-gray-700">
                        Jenis Infrastruktur 
                        <button type="button" 
                                class="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-gradient-to-r from-[#00899B] to-[#002F35] text-white text-xs ml-2 cursor-pointer" 
                                id="infoIcon"
                                aria-label="Info infrastruktur">
                            i
                        </button>
                    </label>
                    <select id="jenisInfrastruktur" name="jenisInfrastruktur" 
                            class="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00899B] text-base text-gray-900 appearance-none">
                        <option value="">Pilih Jenis Infrastruktur</option>
                        <option value="Infrastruktur Perkotaan">Infrastruktur Perkotaan</option>
                        <option value="Infrastruktur Lingkungan">Infrastruktur Lingkungan</option>
                        <option value="Infrastruktur Sosial">Infrastruktur Sosial</option>
                    </select>
                    
                    <div id="infraInfo" 
                         class="hidden fixed md:absolute left-0 right-0 md:w-auto bg-white p-4 rounded-lg shadow-lg z-50 border border-gray-200 transition-opacity duration-200 opacity-0"
                         style="top: 100%; margin-top: 0.5rem;">
                        <div class="relative">
                            <div class="text-sm text-gray-600 max-w-sm"></div>
                            <button type="button"
                                    class="md:hidden absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700"
                                    id="closeInfraInfo">
                                <span class="material-icons-round">close</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div data-aos="fade-up" data-aos-delay="400">
                    <label for="tanggalKejadian" class="block font-semibold mb-2 text-sm text-gray-700">Tanggal Kejadian</label>
                    <input type="date" id="tanggalKejadian" name="tanggalKejadian"
                           class="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00899B] text-base text-gray-900 appearance-none">
                </div>
            </div>
            
<div class="mb-5" data-aos="fade-up" data-aos-delay="500">
    <label for="alamatKejadian" class="block font-semibold mb-2 text-sm text-gray-700">Alamat Kejadian</label>
    <div class="relative">
        <input type="text" 
               id="alamatKejadian" 
               name="alamatKejadian" 
               placeholder="Masukkan alamat kejadian" 
               autocomplete="off"
               class="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#00899B] text-base text-gray-900 placeholder-gray-500">
        <div id="alamatSuggestions" 
             class="hidden absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
        </div>
    </div>
</div>
            
            <div class="mb-5" data-aos="fade-up" data-aos-delay="600">
                <label class="block font-semibold mb-2 text-sm text-gray-700">Bukti Lampiran</label>
                <div class="border-2 border-dashed border-[#00899B] rounded-lg p-5 text-center cursor-pointer transition-all duration-300" id="dropZone">
                    <input type="file" id="fileInput" name="buktiLampiran" accept="image/*" class="hidden">
                    <div class="upload-content">
                        <div class="mb-3">
                            <span class="material-icons-round text-4xl text-[#00899B]">cloud_upload</span>
                        </div>
                        <div class="mb-3">
                            <p class="font-semibold text-gray-800 mb-1 text-base">Drag and drop files or</p>
                            <button type="button" class="text-[#00899B] font-semibold underline text-base hover:text-[#002F35] browse-button">Browse files</button>
                        </div>
                        <p class="text-sm text-gray-600">Supported formats: JPEG, PNG (Max 5MB)</p>
                    </div>
                </div>
            </div>
            
            <div class="text-center mt-6" data-aos="fade-up" data-aos-delay="700">
                <button type="submit" class="flex items-center justify-center gap-2 min-h-[44px] min-w-[200px] px-6 py-3 bg-gradient-to-r from-[#00899B] to-[#002F35] text-white text-base font-semibold rounded-2xl hover:shadow-lg transition-shadow mx-auto">
                    <span class="material-icons-round text-xl">send</span>
                    Lapor Sekarang
                </button>
            </div>
        </form>
    </div>
</div>
            `;
    }

    pageContent += `
                </div>
            </div>
            ${Footer()}
        `;

    mainContainer.innerHTML = pageContent;

    if (currentPath === '/pelaporan/profile') {
      await Profile.afterRender();
    }

    const dateInput = document.querySelector('#tanggalKejadian');
    if (dateInput) {
      const now = new Date();
      const jakartaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
      const year = jakartaTime.getFullYear();
      const month = String(jakartaTime.getMonth() + 1).padStart(2, '0');
      const day = String(jakartaTime.getDate()).padStart(2, '0');
      const today = `${year}-${month}-${day}`;

      dateInput.value = today;
      dateInput.max = today;
      dateInput.min = '2024-01-01';
    }
  },

  initializeEventListeners() {
    const form = document.querySelector('#laporan-form');
    const fileInput = document.querySelector('#fileInput');
    const dropZone = document.querySelector('#dropZone');
    const infraSelect = document.querySelector('#jenisInfrastruktur');
    const infoIcon = document.querySelector('#infoIcon');
    const infraInfo = document.querySelector('#infraInfo');
    const browseButton = document.querySelector('.browse-button');
    const alamatInput = document.querySelector('#alamatKejadian');
    let mapComponent = null;

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        // Validasi judul
        if (!form.judul.value.trim()) {
          Swal.fire({
            title: 'Peringatan!',
            text: 'Judul Wajib diisi',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#00899B'
          });
          form.judul.focus();
          return;
        }
    
        // Validasi deskripsi
        if (!form.deskripsi.value.trim()) {
          Swal.fire({
            title: 'Peringatan!',
            text: 'Deskripsi Wajib diisi',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#00899B'
          });
          form.deskripsi.focus();
          return;
        }
    
        // Validasi jenis infrastruktur
        if (!form.jenisInfrastruktur.value) {
          Swal.fire({
            title: 'Peringatan!',
            text: 'Jenis Infrastruktur Wajib dipilih',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#00899B'
          });
          form.jenisInfrastruktur.focus();
          return;
        }
    
        // Validasi alamat dan koordinat
        if (!this.formData.latitude || !this.formData.longitude) {
          Swal.fire({
            title: 'Peringatan!',
            text: 'Koordinat lokasi tidak lengkap. Silakan pilih lokasi dari suggestion atau peta.',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#00899B'
          });
          form.alamatKejadian.focus();
          return;
        }
    
        // Validasi lampiran
        if (!this.formData.lampiran) {
          Swal.fire({
            title: 'Peringatan!',
            text: 'Bukti Lampiran Wajib diunggah',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#00899B'
          });
          return;
        }
    
        try {
          Swal.fire({
            title: 'Mengirim laporan...',
            text: 'Mohon tunggu sebentar',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
    
          const formData = new FormData();
          formData.append('judul', form.judul.value.trim());
          formData.append('deskripsi', form.deskripsi.value.trim());
          formData.append('jenis_infrastruktur', form.jenisInfrastruktur.value);
          formData.append('tanggal_kejadian', form.tanggalKejadian.value);
          formData.append('alamat', this.formData.alamat);
          formData.append('latitude', this.formData.latitude);
          formData.append('longitude', this.formData.longitude);
          formData.append('bukti_lampiran', this.formData.lampiran);

            // Log data sebelum dikirim
  console.log('Sending form data:', {
    latitude: this.formData.latitude,
    longitude: this.formData.longitude,
    alamat: this.formData.alamat
  });

  // Log semua entries dari FormData
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }  

          const response = await ReportService.createReport(formData);

          Swal.close();

          if (response && response.status === 'success') {
            await Swal.fire({
              title: 'Berhasil!',
              text: 'Laporan Anda telah berhasil dikirim',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#00899B'
            });

            form.reset();
            const dateInput = document.querySelector('#tanggalKejadian');
            if (dateInput) {
              const now = new Date();
              const year = now.getFullYear();
              const month = String(now.getMonth() + 1).padStart(2, '0');
              const day = String(now.getDate()).padStart(2, '0');
              dateInput.value = `${year}-${month}-${day}`;
            }

            this.formData = {
              ...this.formData,
              lampiran: null,
              latitude: null,
              longitude: null,
              alamat: ''
            };

            this.renderFileUpload();

            if (mapComponent) {
              await mapComponent.initializeMap();
            }

            window.location.href = '/pelaporan/laporanaktif';
          } else {
            throw new Error(response?.message || 'Terjadi kesalahan saat mengirim laporan');
          }
        } catch (error) {
          console.error('Form submission error:', error);
          Swal.close();
          await Swal.fire({
            title: 'Error!',
            text: error.message || 'Terjadi kesalahan saat mengirim laporan. Silakan coba lagi.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#00899B'
          });
        }
      });
    }

    if (alamatInput) {
      const suggestionsContainer = document.getElementById('alamatSuggestions');
      const parentContainer = alamatInput.closest('.relative');
      let debounceTimer;

      const style = document.createElement('style');
      style.textContent = `
      /* Form dan Address Input */
      #laporan-form { position: relative; z-index: 10; }
      .address-input-wrapper { position: relative !important; z-index: 5 !important; }
      
      #alamatSuggestions {
        position: absolute !important;
        left: 0 !important;
        right: 0 !important;
        top: 100% !important;
        margin-top: 4px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 6 !important;
        max-height: 300px;
        overflow-y: auto;
      }
      
      .suggestion-item {
        padding: 0.75rem;
        cursor: pointer;
        border-bottom: 1px solid #e2e8f0;
        transition: background-color 0.2s ease;
      }
      
      .suggestion-item:hover { 
        background-color: #f3f4f6; 
      }
      
      .suggestion-item .text-sm {
        line-height: 1.5;
        padding: 0.25rem 0;
      }
      
      #infraInfo {
        position: absolute !important;
        z-index: 20 !important;
      }
      
      #locationMap, 
      .leaflet-container, 
      .map-container { 
        z-index: 1 !important; 
      }
      
      .relative[data-aos="fade-up"][data-aos-delay="300"] {
        position: relative;
        z-index: 15;
      }
    `;
      document.head.appendChild(style);

      if (parentContainer) {
        parentContainer.classList.add('address-input-wrapper');
      }

      // Tambahkan status indikator
      const statusIndicator = document.createElement('div');
      statusIndicator.className = 'text-sm mt-1 flex items-center gap-1';
      statusIndicator.innerHTML = `
        <span class="material-icons-round text-yellow-500 text-base">info</span>
        <span class="text-yellow-600">Pilih alamat dari suggestion atau tentukan di peta</span>
      `;
      parentContainer.appendChild(statusIndicator);

      const updateLocationStatus = (isValid = false, message = '') => {
        const icon = isValid ? 'check_circle' : 'info';
        const colorClass = isValid ? 'text-green-500' : 'text-yellow-500';
        const textColorClass = isValid ? 'text-green-600' : 'text-yellow-600';
        
        statusIndicator.innerHTML = `
          <span class="material-icons-round ${colorClass} text-base">${icon}</span>
          <span class="${textColorClass}">${message || 'Pilih alamat dari suggestion atau tentukan di peta'}</span>
        `;
        
        alamatInput.classList.remove('border-gray-200', 'border-yellow-400', 'border-green-400');
        alamatInput.classList.add(isValid ? 'border-green-400' : 'border-yellow-400');
      };

      const updateSuggestions = async (searchText) => {
        try {
          if (!searchText || searchText.length < 3) {
            suggestionsContainer.classList.add('hidden');
            return;
          }

          suggestionsContainer.classList.remove('hidden');
          suggestionsContainer.innerHTML = `
            <div class="suggestion-item">
              <div class="flex items-center justify-center p-2">
                <span class="material-icons-round animate-spin mr-2">sync</span>
                Mencari alamat...
              </div>
            </div>
          `;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}, Indonesia&limit=5&accept-language=id`,
            { headers: { 'User-Agent': 'UrbanAid App' } }
          );

          if (!response.ok) throw new Error('Network response was not ok');
          const suggestions = await response.json();

          if (suggestions && suggestions.length > 0) {
            suggestionsContainer.innerHTML = suggestions
              .map((place) => `
                <div class="suggestion-item hover:bg-gray-50 p-2 cursor-pointer" 
                     data-lat="${place.lat}" 
                     data-lon="${place.lon}"
                     data-address="${place.display_name}">
                  <div class="flex items-start">
                    <span class="material-icons-round text-gray-400 mr-2 text-base">location_on</span>
                    <span class="text-sm text-gray-700">${place.display_name}</span>
                  </div>
                </div>
              `)
              .join('');

            suggestionsContainer.querySelectorAll('.suggestion-item').forEach((item) => {
              item.addEventListener('click', () => {
                const lat = parseFloat(item.dataset.lat);
                const lon = parseFloat(item.dataset.lon);
                const address = item.dataset.address;

                alamatInput.value = address;
                suggestionsContainer.classList.add('hidden');

                if (mapComponent) {
                  mapComponent.updateMarker(lat, lon, address);
                }

                this.formData = {
                  ...this.formData,
                  latitude: lat,
                  longitude: lon,
                  alamat: address
                };

                // console.log('Location selected from suggestion:', this.formData);
                updateLocationStatus(true, 'Lokasi telah dipilih dari daftar alamat');
              });
            });
          } else {
            suggestionsContainer.innerHTML = `
              <div class="suggestion-item text-center text-gray-500 p-2">
                Lokasi tidak ditemukan
              </div>
            `;
          }
        } catch (error) {
          console.error('Error in updateSuggestions:', error);
          suggestionsContainer.innerHTML = `
            <div class="suggestion-item text-center text-red-500 p-2">
              Terjadi kesalahan saat mencari alamat
            </div>
          `;
        }
      };

      // Reset status saat input manual
      alamatInput.addEventListener('input', (e) => {
        const searchText = e.target.value.trim();
        if (!this.formData.latitude || !this.formData.longitude) {
          updateLocationStatus(false);
        }
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => updateSuggestions(searchText), 300);
      });

      alamatInput.addEventListener('focus', () => {
        const searchText = alamatInput.value.trim();
        if (searchText.length >= 3) {
          updateSuggestions(searchText);
        }
      });

      document.addEventListener('click', (e) => {
        if (!parentContainer.contains(e.target)) {
          suggestionsContainer.classList.add('hidden');
        }
      });

      const setupMap = async () => {
        if (!parentContainer) {
          console.error('Parent container not found');
          return;
        }
      
        // Buat container untuk map
        const mapContainer = document.createElement('div');
        mapContainer.className = 'mt-4';
        
        // Buat div loading
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'mapLoading';
        loadingDiv.className = 'mb-3';
        loadingDiv.innerHTML = `
          <div class="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
            <span class="material-icons-round animate-spin text-gray-600 mr-2">sync</span>
            <span class="text-sm text-gray-600">Memuat peta...</span>
          </div>
        `;
      
        mapContainer.innerHTML = `
  <div class="space-y-3">
    <div id="locationMap" class="w-full bg-gray-50 rounded-lg border-2 border-gray-200"></div>
    <div class="flex items-start space-x-2 text-sm text-gray-600">
      <span class="material-icons-round text-base mt-0.5">info</span>
      <p>Anda dapat mencari lokasi dengan memasukkan alamat atau klik langsung pada peta untuk menentukan lokasi yang tepat</p>
    </div>
  </div>
        `;
      
        // Tambahkan loading div ke awal mapContainer
        mapContainer.insertBefore(loadingDiv, mapContainer.firstChild);
        
        // Tambahkan map container ke DOM
        parentContainer.insertAdjacentElement('afterend', mapContainer);
      
        try {
          // Initialize map component
          mapComponent = new MapComponent('locationMap');
          mapComponent.setLocationSelectCallback((location) => {
            if (alamatInput) {
              alamatInput.value = location.address;
              // Pastikan nilai koordinat disimpan dengan benar
              this.formData = {
                ...this.formData,
                latitude: parseFloat(location.latitude),
                longitude: parseFloat(location.longitude),
                alamat: location.address
              };
              // console.log('Location selected from map:', this.formData);
              updateLocationStatus(true, 'Lokasi telah ditentukan pada peta');
            }
          });
      
          await mapComponent.initializeMap();
          loadingDiv.style.display = 'none';
      
        } catch (error) {
          console.error('Error initializing map:', error);
          loadingDiv.innerHTML = `
            <div class="flex items-center justify-center p-3 bg-red-50 rounded-lg text-red-600">
              <span class="material-icons-round mr-2">error</span>
              <span class="text-sm">Gagal memuat peta</span>
            </div>
          `;
        }
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(setupMap, 0));
      } else {
        setTimeout(setupMap, 0);
      }
    }

    if (fileInput && browseButton) {
      fileInput.addEventListener('change', this.handleFileChange.bind(this));
      browseButton.addEventListener('click', () => fileInput.click());
    }

    if (dropZone) {
      const handleDragEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };

      const handleDragStyle = (isDragging) => () => {
        dropZone.classList.toggle('border-[#002F35]', isDragging);
        dropZone.classList.toggle('bg-[#00899B]/5', isDragging);
      };

      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
        dropZone.addEventListener(eventName, handleDragEvent);
      });

      ['dragenter', 'dragover'].forEach((eventName) => {
        dropZone.addEventListener(eventName, handleDragStyle(true));
      });

      ['dragleave', 'drop'].forEach((eventName) => {
        dropZone.addEventListener(eventName, handleDragStyle(false));
      });

      dropZone.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files[0];
        if (fileInput && this.validateFile(file)) {
          fileInput.files = e.dataTransfer.files;
          this.handleFileChange({ target: fileInput });
        }
      });
    }

    if (infraSelect && infoIcon && infraInfo) {
      const showInfo = (selectedValue) => {
        if (selectedValue) {
          const infoText = this.infraInfo[selectedValue.toLowerCase().split(' ')[1]];
          if (infoText) {
            const infoContent = infraInfo.querySelector('div > div');
            if (infoContent) {
              infoContent.textContent = infoText;
            }

            if (window.innerWidth < 768) {
              infraInfo.style.position = 'fixed';
              infraInfo.style.top = '50%';
              infraInfo.style.left = '50%';
              infraInfo.style.transform = 'translate(-50%, -50%)';
              infraInfo.style.width = '90%';
              infraInfo.style.maxWidth = '400px';

              const backdrop = document.createElement('div');
              backdrop.id = 'infraBackdrop';
              backdrop.className = 'fixed inset-0 bg-black bg-opacity-50 z-40';
              document.body.appendChild(backdrop);
            }

            infraInfo.classList.remove('hidden');
            void infraInfo.offsetWidth;
            infraInfo.style.opacity = '1';
          }
        }
      };

      const hideInfo = () => {
        infraInfo.style.opacity = '0';
        setTimeout(() => {
          infraInfo.classList.add('hidden');
          if (window.innerWidth >= 768) {
            infraInfo.style.position = '';
            infraInfo.style.top = '';
            infraInfo.style.left = '';
            infraInfo.style.transform = '';
            infraInfo.style.width = '';
          }
          const backdrop = document.getElementById('infraBackdrop');
          if (backdrop) backdrop.remove();
        }, 200);
      };

      if (window.matchMedia('(min-width: 768px)').matches) {
        infoIcon.addEventListener('mouseenter', () => {
          const selectedValue = infraSelect.value;
          if (selectedValue) showInfo(selectedValue);
        });

        infoIcon.addEventListener('mouseleave', hideInfo);
      }

      infoIcon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const selectedValue = infraSelect.value;
        if (selectedValue) {
          showInfo(selectedValue);
        } else {
          Swal.fire({
            title: 'Peringatan!',
            text: 'Silakan pilih jenis infrastruktur terlebih dahulu',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#00899B'
          });
        }
      });

      document.addEventListener('click', (e) => {
        if (window.innerWidth < 768) {
          const backdrop = document.getElementById('infraBackdrop');
          if (backdrop && !infraInfo.contains(e.target) && !infoIcon.contains(e.target)) {
            hideInfo();
          }
        }
      });

      const closeButton = document.getElementById('closeInfraInfo');
      if (closeButton) {
        closeButton.addEventListener('click', (e) => {
          e.preventDefault();
          hideInfo();
        });
      }
    }

    const handleResize = () => {
      if (mapComponent && mapComponent.map) {
        mapComponent.map.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);

    if (infoIcon) {
      infoIcon.setAttribute('title', 'Klik untuk melihat info lengkap');
    }

    return () => {
      if (form) {
        form.removeEventListener('submit', this.handleSubmit);
      }

      if (fileInput) {
        fileInput.removeEventListener('change', this.handleFileChange);
      }

      if (dropZone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
          dropZone.removeEventListener(eventName, () => {});
        });
      }

      if (infraSelect) {
        infraSelect.removeEventListener('change', () => {});
      }

      if (infoIcon) {
        infoIcon.removeEventListener('mouseenter', () => {});
        infoIcon.removeEventListener('mouseleave', () => {});
        infoIcon.removeEventListener('click', () => {});
      }

      if (mapComponent) {
        mapComponent.cleanup();
      }

      window.removeEventListener('resize', handleResize);

      if (alamatInput) {
        alamatInput.removeEventListener('input', () => {});
        alamatInput.removeEventListener('focus', () => {});
      }

      const backdrop = document.getElementById('infraBackdrop');
      if (backdrop) {
        backdrop.remove();
      }

      if (this.addressDebounceTimer) {
        clearTimeout(this.addressDebounceTimer);
      }
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
      }

      mapComponent = null;
    };
  },

  validateFile(file) {
    const validTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      Swal.fire({
        title: 'File tidak valid!',
        text: 'File harus berformat JPEG atau PNG',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#00899B'
      });
      return false;
    }

    if (file.size > maxSize) {
      Swal.fire({
        title: 'File terlalu besar!',
        text: 'Ukuran file tidak boleh lebih dari 5MB',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#00899B'
      });
      return false;
    }

    return true;
  },

  handleFileChange(e) {
    const file = e.target.files[0];
    if (file && this.validateFile(file)) {
      this.formData.lampiran = file;
      this.updateFilePreview(file);
    }
  },

  updateFilePreview(file) {
    const uploadContent = document.querySelector('.upload-content');
    if (uploadContent) {
      uploadContent.innerHTML = `
                <div class="flex flex-col sm:flex-row justify-between items-center gap-3 p-3 bg-white rounded-lg">
                    <div class="flex items-center gap-3">
                        <img src="${URL.createObjectURL(file)}" 
                             alt="preview" 
                             class="w-10 h-10 object-cover rounded">
                        <div class="flex flex-col">
                            <p class="font-semibold text-[#002F35] mb-1 text-sm">${file.name}</p>
                            <p class="text-xs text-gray-600">${(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <button type="button" class="p-1 hover:bg-red-100 rounded transition-colors duration-200 remove-file">
                        <i class="material-icons-round text-gray-600">delete</i>
                    </button>
                </div>
            `;

      const removeButton = uploadContent.querySelector('.remove-file');
      if (removeButton) {
        removeButton.addEventListener('click', () => {
          this.formData.lampiran = null;
          this.renderFileUpload();
        });
      }
    }
  },

  renderFileUpload() {
    const uploadContent = document.querySelector('.upload-content');
    if (uploadContent) {
      uploadContent.innerHTML = `
                <div class="mb-3">
                    <span class="material-icons-round text-3xl text-[#00899B]">cloud_upload</span>
                </div>
                <div class="mb-3">
                    <p class="font-semibold text-[#002F35] mb-1 text-sm">Drag and drop files or</p>
                    <button type="button" class="text-[#00899B] font-semibold underline text-sm browse-button">Browse files</button>
                </div>
                <p class="text-xs text-gray-600">Supported formats: JPEG, PNG (Max 5MB)</p>
            `;

      const browseButton = uploadContent.querySelector('.browse-button');
      const fileInput = document.querySelector('#fileInput');
      if (browseButton && fileInput) {
        browseButton.addEventListener('click', () => fileInput.click());
      }
    }
  },

  async submitReport(formData) {
    try {
      const response = await ReportService.createReport(formData);
      if (response.status === 'success') {
        return true;
      } else {
        throw new Error(response.message || 'Terjadi kesalahan saat mengirim laporan');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      throw new Error(error.message || 'Terjadi kesalahan saat mengirim laporan');
    }
  },

  cleanup() {
    const form = document.querySelector('#laporan-form');
    const fileInput = document.querySelector('#fileInput');
    const dropZone = document.querySelector('#dropZone');
    const infraSelect = document.querySelector('#jenisInfrastruktur');
    const infoIcon = document.querySelector('#infoIcon');

    if (form) {
      form.removeEventListener('submit', this.handleSubmit);
    }

    if (fileInput) {
      fileInput.removeEventListener('change', this.handleFileChange);
    }

    if (dropZone) {
      dropZone.removeEventListener('dragover', () => {});
      dropZone.removeEventListener('dragleave', () => {});
      dropZone.removeEventListener('drop', () => {});
    }

    if (infraSelect) {
      infraSelect.removeEventListener('change', () => {});
    }

    if (infoIcon) {
      infoIcon.removeEventListener('mouseenter', () => {});
      infoIcon.removeEventListener('mouseleave', () => {});
    }

    AOS.refresh();
    Loading.hide();
  }
};

export default PelaporanPage;