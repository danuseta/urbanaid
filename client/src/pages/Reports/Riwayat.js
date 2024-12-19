import RiwayatService from '../../services/riwayat-service';
import { hashId } from '../../utils/hash-util';
import Loading from '../../components/common/Loading';

const RiwayatLaporan = {
  data: [],

  async init() {
    const mainContent = document.querySelector('.content-wrapper');
    if (mainContent) {
      this.data = await RiwayatService.getRiwayatByUser();
      window.riwayatData = this.data;

      mainContent.innerHTML = await this.render();
      window.RiwayatLaporan = this;
      this.initializeAOS();
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

  async render() {
    try {
      this.data = await RiwayatService.getRiwayatByUser();
      const acceptedReports = this.data.filter((report) => report.status === 'diterima');
      const rejectedReports = this.data.filter((report) => report.status === 'ditolak');

      const headerContent = `
                <h2 class="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900" data-aos="fade-up">
                    <span class="material-icons-round text-[#00899B] text-xl">dashboard</span>
                    Riwayat Laporan
                </h2>
            `;

      if (!this.data.length) {
        return `
                    <div class="max-w-7xl mx-auto px-4 py-6 pb-8">
                        <div class="w-full">
                            ${headerContent}
                            
                            <div class="text-center space-y-4" data-aos="fade-up">
                                <div class="max-w-sm mx-auto mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" class="w-full h-auto">
                                        <style>
                                            @keyframes float {
                                                0% { transform: translateY(0px); }
                                                50% { transform: translateY(-20px); }
                                                100% { transform: translateY(0px); }
                                            }
                                            .float { animation: float 3s ease-in-out infinite; }
                                        </style>
                                        <rect width="500" height="500" fill="white"/>
                                        <g class="float">
                                            <path d="M150 150h200v250H150z" fill="#00899B" opacity="0.1"/>
                                            <path d="M180 180h140v30H180z" fill="#00899B" opacity="0.2"/>
                                            <path d="M180 230h140v10H180z" fill="#002F35" opacity="0.1"/>
                                            <path d="M180 250h140v10H180z" fill="#002F35" opacity="0.1"/>
                                            <path d="M180 270h140v10H180z" fill="#002F35" opacity="0.1"/>
                                            <path d="M180 320h60v60h-60z" fill="#00899B"/>
                                            <path d="M195 335l15 15 15-15" stroke="white" stroke-width="3" fill="none"/>
                                        </g>
                                        <path d="M150 420h200M200 440h100" stroke="#E0E0E0" stroke-width="3"/>
                                    </svg>
                                </div>
                                <h3 class="text-xl font-semibold text-gray-800">Belum Ada Riwayat Laporan</h3>
                                <p class="text-gray-600 max-w-md mx-auto">
                                    Anda belum memiliki riwayat laporan. 
                                    Buat laporan baru untuk melaporkan permasalahan infrastruktur di sekitar Anda.
                                </p>
                                <button onclick="window.location.href='/pelaporan'" 
                                        class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#00899B] to-[#002F35] text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold">
                                    <span class="material-icons-round mr-2">add_circle</span>
                                    Buat Laporan Baru
                                </button>
                            </div>
                        </div>
                    </div>
                `;
      }

      return `
                <div class="max-w-7xl mx-auto px-4 py-8">
                    <div class="w-full">
                        ${headerContent}
                        
                        <div class="flex justify-end mb-8 mt-6" data-aos="fade-up" data-aos-delay="100">
                            <div class="relative inline-block w-64">
                                <select 
                                    onchange="RiwayatLaporan.filterReports(this.value)"
                                    class="block w-full bg-white border-2 border-gray-200 text-gray-900 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00899B] focus:border-[#00899B] appearance-none text-base"
                                >
                                    <option value="all">Semua Laporan (${this.data.length})</option>
                                    <option value="diterima">Diterima (${acceptedReports.length})</option>
                                    <option value="ditolak">Ditolak (${rejectedReports.length})</option>
                                </select>
                                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <span class="material-icons-round text-xl">expand_more</span>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-8">
                            ${this.data.map((report, index) => this.createReportCard(report, index)).join('')}
                        </div>
                    </div>
                </div>
            `;
    } catch (error) {
      console.error('Error fetching reports:', error);
      return `
                <div class="max-w-7xl mx-auto px-4 py-8 text-center">
                    <p class="text-base text-red-600" data-aos="fade-up">Gagal memuat data riwayat: ${error.message}</p>
                </div>
            `;
    }
  },

  createReportCard(report, index) {
    const statusIcon = this.getStatusIcon(report.status);
    const statusClass = this.getStatusClass(report.status);

    return `
            <div class="group relative" data-aos="fade-up" data-aos-delay="${index * 100}" data-status="${report.status}">
                <div class="absolute inset-0 bg-gradient-to-r from-[#00899B]/20 to-[#002F35]/20 rounded-3xl blur-2xl transform -rotate-1"></div>
                <div class="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 md:p-10 shadow-xl mb-6">
                    <div class="flex items-center mb-6">
                        <span class="material-icons-round text-xl ${statusClass.text} mr-2">${statusIcon}</span>
                        <span class="${statusClass.bg} ${statusClass.text} px-4 py-1 rounded-full text-sm font-semibold">
                            ${report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                    </div>
                    
                    <div class="relative flex flex-col md:flex-row md:gap-6">
                        <div class="flex-grow order-1 md:order-none">
                            <div class="space-y-4">
                                <h3 class="text-xl font-semibold text-gray-900">${report.judul}</h3>
                                
                                <div class="flex items-center text-gray-700">
                                    <span class="material-icons-round text-[#00899B] text-base mr-2">account_balance</span>
                                    <span class="text-base">${report.jenis_infrastruktur}</span>
                                </div>
                                
                                <div class="flex items-center text-gray-700">
                                    <span class="material-icons-round text-[#00899B] text-base mr-2">event</span>
                                    <span class="text-base">${this.formatDate(report.tanggal_kejadian)}</span>
                                </div>
                                
                                <div class="flex items-center text-gray-700 line-clamp-2">
                                    <span class="material-icons-round text-[#00899B] text-base mr-2">location_on</span>
                                    <span class="text-base line-clamp-2">${report.alamat}</span>
                                </div>
                                
                                <div class="text-gray-700 line-clamp-2">
                                    <span class="material-icons-round text-[#00899B] text-base mr-2 align-text-top">description</span>
                                    ${report.deskripsi}
                                </div>
                            </div>
                        </div>
                        
                        <div class="order-2 mt-6 md:mt-0 flex items-center">
                            <button onclick="RiwayatLaporan.showDetail('${report.id}')"
                                class="flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 bg-gradient-to-r from-[#00899B] to-[#002F35] text-white text-base font-semibold rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                            >
                                <span class="material-icons-round text-xl">visibility</span>
                                <span>Detail</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
  },

  formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  },

  getStatusIcon(status) {
    switch (status) {
    case 'diterima':
      return 'check_circle';
    case 'ditolak':
      return 'cancel';
    default:
      return 'info';
    }
  },

  getStatusClass(status) {
    switch (status) {
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

  showDetail(id) {
    try {
      if (!id) {
        console.error('No ID provided to showDetail');
        return;
      }

      const hashedId = hashId(id);
      if (!hashedId) {
        throw new Error('Failed to hash ID');
      }

      const url = `/pelaporan/riwayat/${hashedId}`;
      window.App.navigateTo(url);
    } catch (error) {
      console.error('Error in showDetail:', error);
    }
  },

  filterReports(status) {
    const cards = document.querySelectorAll('[data-status]');
    cards.forEach((card) => {
      if (!card.classList.contains('filter-btn')) {
        if (status === 'all' || card.dataset.status === status) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      }
    });
  },

  cleanup() {
    Loading.hide();
  }
};

window.RiwayatLaporan = RiwayatLaporan;

export default RiwayatLaporan;