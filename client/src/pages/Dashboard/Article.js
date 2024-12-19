import { Navbar } from '../../components/common/Navbar.js';
import { Footer } from '../../components/common/Footer.js';
import Loading from '../../components/common/Loading.js';

const ArticlePage = {
  article: {
    id: 1,
    title: 'Infrastruktur: Pondasi Kehidupan Modern',
    excerpt: 'Infrastruktur yang berkualitas adalah kunci pembangunan berkelanjutan, meningkatkan kualitas hidup, dan mendorong pertumbuhan ekonomi masyarakat.',
    image: '/images/infraTikel.png',
    category: 'Infrastruktur',
    content: {
      principles: [
        {
          title: 'Berkelanjutan (Sustainability)',
          description: 'Menekankan pentingnya memperhatikan dampak lingkungan melalui penggunaan teknologi ramah lingkungan, desain efisien, dan upaya meminimalkan jejak karbon.'
        },
        {
          title: 'Ketahanan (Resilience)',
          description: 'Infrastruktur mampu menghadapi berbagai risiko dengan desain fleksibel, sistem pemulihan cepat, dan antisipasi terhadap perubahan.'
        },
        {
          title: 'Aksesibilitas',
          description: 'Pentingnya infrastruktur yang mudah diakses semua kalangan, inklusif bagi penyandang disabilitas, dan memiliki konektivitas yang baik.'
        },
        {
          title: 'Efisiensi Biaya',
          description: 'Fokus pada perhitungan biaya total kepemilikan, memaksimalkan value for money, dan perencanaan perawatan berkala.'
        },
        {
          title: 'Inovasi Teknologi',
          description: 'Mendorong pemanfaatan teknologi mutakhir seperti digitalisasi, sistem cerdas, serta penerapan AI dan IoT.'
        },
        {
          title: 'Keberlanjutan Sosial',
          description: 'Memastikan infrastruktur tidak sekadar bangunan fisik, melainkan juga memperhatikan dampak sosial, melibatkan partisipasi masyarakat, menciptakan lapangan kerja, dan mendukung pengembangan ekonomi.'
        }
      ],
      categories: [
        {
          title: 'Infrastruktur Perkotaan',
          description: 'Jalan, jembatan, gedung pemerintahan, fasilitas umum yang mendukung aktivitas perkotaan.'
        },
        {
          title: 'Infrastruktur Lingkungan',
          description: 'Sistem drainase, pengolahan air bersih, pengelolaan sampah, dan infrastruktur ramah lingkungan.'
        },
        {
          title: 'Infrastruktur Sosial',
          description: 'Fasilitas kesehatan, pendidikan, ruang publik dan sarana sosial kemasyarakatan.'
        }
      ],
      participation: {
        title: 'Partisipasi Masyarakat dalam Infrastruktur',
        description: 'Masyarakat memiliki peran penting dalam pembangunan dan pemeliharaan infrastruktur.',
        sections: [
          {
            title: 'Edukasi dan Kesadaran',
            items: [
              'Mengikuti sosialisasi',
              'Berbagi pengetahuan',
              'Menjaga infrastruktur umum'
            ]
          },
          {
            title: 'Pelaporan dan Pengawasan',
            items: [
              'Melaporkan kerusakan infrastruktur',
              'Memberikan usulan perbaikan',
              'Mengawasi progres pembangunan'
            ]
          }
        ]
      }
    }
  },

  init() {
    try {
      this.render();
      this.scrollToTop();
      AOS.init({
        duration: 1000,
        once: true,
        offset: 100
      });
      this.initTilt();
    } catch (error) {
      console.error('Error initializing article page:', error);
    } finally {
      console.log('Hiding loading');
      Loading.hide();
    }
  },

  initTilt() {
    const cards = document.querySelectorAll('.tilt-card');
    VanillaTilt.init(cards, {
      max: 3,
      speed: 400,
      glare: true,
      'max-glare': 0.2
    });
  },

  createHeroSection() {
    return `
            <section class="relative py-8 md:py-12 pt-12 md:pt-20 bg-white overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#00899B]/10 to-transparent"></div>
                <div class="container mx-auto px-4">
                    <div class="flex flex-col md:flex-row gap-8" data-aos="fade-up">
                        <div class="w-full md:w-1/2 overflow-hidden rounded-lg group tilt-card">
                            <picture>
                                <source 
                                    media="(min-width: 1200px)" 
                                    srcset="images/optimized/infraTikel-large.webp"
                                    type="image/webp"
                                />
                                <source 
                                    media="(min-width: 800px)" 
                                    srcset="images/optimized/infraTikel-medium.webp"
                                    type="image/webp"
                                />
                                <img 
                                    src="images/optimized/infraTikel-small.webp" 
                                    alt="${this.article.title}"
                                    class="lazyload w-full h-[300px] md:h-[400px] object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                    onerror="this.onerror=null; this.src='${this.article.image}';"
                                />
                            </picture>
                        </div>
                        <div class="w-full md:w-1/2" data-aos="fade-left" data-aos-delay="200">
                            <h1 class="text-3xl md:text-4xl font-bold mb-4 relative">
                                ${this.article.title}
                                <span class="absolute -top-6 -left-6 text-8xl text-[#00899B]/10">''</span>
                            </h1>
                            <p class="text-gray-700 sm:text-lg mb-6">
                                ${this.article.excerpt}
                            </p>
                            <div class="flex items-center gap-2 text-sm text-gray-500">
                                <span class="material-icons-round text-[#00899B]">category</span>
                                ${this.article.category}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
  },

  createPrinciplesSection() {
    const principleCards = this.article.content.principles.map((principle, index) => `
            <div class="bg-gray-50 rounded-xl p-6 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg tilt-card"
                 data-aos="fade-up" 
                 data-aos-delay="${100 * index}">
                <div class="flex items-start gap-4">
                    <div class="w-12 h-12 flex items-center justify-center rounded-full bg-[#00899B]/10">
                        <span class="text-[#00899B] font-bold">${index + 1}</span>
                    </div>
                    <div>
                        <h3 class="text-xl font-semibold mb-3">
                            ${principle.title}
                        </h3>
                        <p class="text-gray-700">
                            ${principle.description}
                        </p>
                    </div>
                </div>
            </div>
        `).join('');

    return `
            <section class="py-16 bg-white relative overflow-hidden">
                <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div class="container mx-auto px-4 relative">
                    <h2 class="text-3xl font-bold text-center mb-12" data-aos="fade-up">
                        6 Prinsip Infrastruktur Berkualitas
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${principleCards}
                    </div>
                </div>
            </section>
        `;
  },

  createCategoriesSection() {
    const categoryCards = this.article.content.categories.map((category, index) => `
            <div class="bg-white/10 rounded-xl p-8 h-full transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
                 data-aos="zoom-in" 
                 data-aos-delay="${150 * index}">
                <div class="relative">
                    <div class="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-white/20 blur-lg"></div>
                    <h3 class="text-xl font-semibold mb-4 text-white relative">
                        ${category.title}
                    </h3>
                    <p class="text-white/90">
                        ${category.description}
                    </p>
                </div>
            </div>
        `).join('');

    return `
            <section class="py-16 bg-gradient-to-r from-[#00899B] to-[#002F35] relative overflow-hidden">
                <div class="absolute inset-0 bg-pattern-overlay opacity-10"></div>
                <div class="container mx-auto px-4 relative">
                    <h2 class="text-3xl font-bold text-center text-white mb-12" data-aos="fade-up">
                        Kategori Infrastruktur Utama
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        ${categoryCards}
                    </div>
                </div>
            </section>
        `;
  },

  createParticipationSection() {
    const { sections } = this.article.content.participation;
    const sectionCards = sections.map((section, index) => {
      const items = section.items.map((item) => `
                <div class="flex items-center gap-3 py-2 transition-all duration-300 hover:translate-x-2">
                    <span class="material-icons-round text-[#00899B]">check_circle</span>
                    <span class="text-gray-700">${item}</span>
                </div>
            `).join('');

      return `
                <div class="bg-gray-50 p-6 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg tilt-card"
                     data-aos="fade-up"
                     data-aos-delay="${200 * index}">
                    <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span class="material-icons-round text-[#00899B]">
                            ${section.title.includes('Edukasi') ? 'school' : 'visibility'}
                        </span>
                        ${section.title}
                    </h3>
                    <div class="space-y-3">
                        ${items}
                    </div>
                </div>
            `;
    }).join('');

    return `
            <section class="py-16 bg-white relative overflow-hidden">
                <div class="container mx-auto px-4">
                    <div class="text-center mb-12" data-aos="fade-up">
                        <h2 class="text-3xl font-bold mb-4">
                            ${this.article.content.participation.title}
                        </h2>
                        <p class="text-gray-700 max-w-2xl mx-auto">
                            ${this.article.content.participation.description}
                        </p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        ${sectionCards}
                    </div>
                    <div class="text-center mt-12" data-aos="zoom-in">
                        <button 
                            id="reportButtonArticle" 
                            class="inline-block px-6 py-2 text-white font-bold bg-gradient-to-r from-[#00899B] to-[#002F35] rounded-[17px] min-h-[44px] transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                            Lapor Sekarang
                        </button>
                    </div>
                </div>
            </section>
        `;
  },

  render() {
    const content = `
            ${Navbar()}
            <main class="min-h-screen">
                ${this.createHeroSection()}
                ${this.createPrinciplesSection()}
                ${this.createCategoriesSection()}
                ${this.createParticipationSection()}
            </main>
            ${Footer()}
        `;

    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = content;
    }

    this.attachEventListeners();
  },

  attachEventListeners() {
    const reportButton = document.getElementById('reportButtonArticle');
    if (reportButton) {
      reportButton.addEventListener('click', () => {
        const token = localStorage.getItem('token');
        if (token) {
          window.location.href = '/pelaporan';
        } else {
          window.location.href = '/register';
        }
      });
    }
  },

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  },

  cleanup() {
    const reportButton = document.getElementById('reportButtonArticle');
    if (reportButton) {
      reportButton.removeEventListener('click', () => {});
    }
    Loading.hide();
  }
};

export default ArticlePage;