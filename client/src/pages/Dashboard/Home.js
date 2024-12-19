import { Navbar } from '../../components/common/Navbar.js';
import { Footer } from '../../components/common/Footer.js';
import StatisticService from '../../services/statistic-service.js';
import { CountUp } from 'countup.js';
import Loading from '../../components/common/Loading.js';
import SkeletonLoading from '../../components/common/SkeletonLoading.js';

const HomePage = {
  stats: {
    total: 0,
    completed: 0,
    pending: 0
  },

  testimonials: [],

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  },

  async init() {
    try {
      Loading.show();

      this.renderWithSkeleton();

      this.scrollToTop();

      await Promise.all([
        this.loadSvgSprites(),
        this.loadData()
      ]);

      this.render();
      this.attachEventListeners();
      this.initCounterAnimation();

      AOS.init({
        duration: 500,
        once: true,
        offset: 100
      });

      this.initTilt();
    } catch (error) {
      console.error('Error initializing home page:', error);
    } finally {
      Loading.hide();
    }
  },

  renderWithSkeleton() {
    const content = `
            ${Navbar()}
            <main class="min-h-screen">
            <section class="hero-section relative overflow-hidden">
                ${SkeletonLoading.heroSkeleton()}
            </section>
                            <section class="bg-white py-12 md:py-16 lg:py-20">
                    ${SkeletonLoading.articleSkeleton()}
                </section>
                <section class="py-12 md:py-16 lg:py-20">
                    ${SkeletonLoading.articleSkeleton()}
                </section>
                <section class="stats-section py-16 md:py-20">
                    <div class="container mx-auto px-4">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            ${Array(3).fill(SkeletonLoading.profileSkeleton()).join('')}
                        </div>
                    </div>
                </section>
                ${this.createProcessSection()}
                <section class="bg-gray-50 py-16 md:py-20">
                    <div class="container mx-auto px-4">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            ${Array(3).fill(SkeletonLoading.reportSkeleton()).join('')}
                        </div>
                    </div>
                </section>
            </main>
            ${Footer()}
        `;

    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = content;
    }
  },

  initTilt() {
    const isMobile = window.innerWidth < 768;
    let tiltInstances = [];

    const initTiltElement = (elements, options) => {
      if (!isMobile && elements.length > 0) {  
        const instances = VanillaTilt.init(elements, options);
        tiltInstances = [...tiltInstances, ...(Array.isArray(instances) ? instances : [instances])];
      }
    };

    initTiltElement(document.querySelectorAll('.stats-card.tilt-card'), {
      max: 15,
      speed: 400,
      scale: 1.05,
      glare: true,
      'max-glare': 0.3,
      perspective: 800,
      transition: true,
      'full-page-listening': true,
      gyroscope: false,
      easing: 'cubic-bezier(.03,.98,.52,.99)'
    });

    const heroImage = document.querySelector('.hero-section .tilt-card');
    if (heroImage) {
      initTiltElement([heroImage], {
        max: 10,
        speed: 1000,
        scale: 1.03,
        glare: true,
        'max-glare': 0.5,
        perspective: 1000,
        transition: true,
        gyroscope: false,
        easing: 'cubic-bezier(.03,.98,.52,.99)'
      });
    }

    initTiltElement(document.querySelectorAll('.process-steps-desktop .tilt-card'), {
      max: 20,
      speed: 200,
      scale: 1.05,
      glare: true,
      'max-glare': 0.3,
      perspective: 1000,
      transition: true,
      gyroscope: false,
      easing: 'cubic-bezier(.03,.98,.52,.99)'
    });

    initTiltElement(document.querySelectorAll('.testimonial-card.tilt-card'), {
      max: 15,
      speed: 300,
      scale: 1.03,
      glare: true,
      'max-glare': 0.4,
      perspective: 1000,
      transition: true,
      gyroscope: false,
      easing: 'cubic-bezier(.03,.98,.52,.99)'
    });

    const infraCard = document.querySelector('.infrastructure-card.tilt-card');
    if (infraCard) {
      initTiltElement([infraCard], {
        max: 8,
        speed: 800,
        scale: 1.02,
        glare: true,
        'max-glare': 0.3,
        perspective: 2000,
        transition: true,
        gyroscope: false,
        easing: 'cubic-bezier(.03,.98,.52,.99)'
      });
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newIsMobile = window.innerWidth < 768;
        if (newIsMobile !== isMobile) {
          tiltInstances.forEach(instance => {
            if (instance && instance.destroy) {
              instance.destroy();
            }
          });
          tiltInstances = [];
          
          if (!newIsMobile) {
            this.initTilt();
          }
        }
      }, 250);
    });
  },


  async loadData() {
    try {
      const statsResponse = await StatisticService.getReportStatistics();
      if (statsResponse.status === 'success') {
        this.stats = statsResponse.data;
      }
      const reviewsResponse = await StatisticService.getReviews();
      if (reviewsResponse.status === 'success') {
        this.testimonials = reviewsResponse.data.map((review) => ({
          name: review.user_name,
          rating: review.rating,
          text: review.review_text
        }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      throw error;
    }
  },

  loadSvgSprites() {
    const svgUrl = '/images/decorative-elements.svg';
    fetch(svgUrl)
      .then((response) => response.text())
      .then((svgContent) => {
        const div = document.createElement('div');
        div.style.display = 'none';
        div.innerHTML = svgContent;
        document.body.appendChild(div);
      })
      .catch((error) => console.error('Error loading SVG sprites:', error));
  },

  render() {
    const content = `
            ${Navbar()}
            <main class="min-h-screen">
                ${this.createHeroSection()}
                ${this.createIntroSection()}
                ${this.createInfrastructureSection()}
                ${this.createStatsSection()}
                ${this.createProcessSection()}
                ${this.createTestimonialsSection()}
            </main>
            ${Footer()}
        `;

    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = content;
    }
  },

  createHeroSection() {
    const isLoggedIn = localStorage.getItem('token') !== null;

    return `
            <section class="hero-section relative overflow-hidden">
                <div class="decorative-element bottom-[20%] -left-5 w-32 h-32 decoration-teal opacity-20">
                    <svg class="w-full h-full"><use href="#flower"/></svg>
                </div>
                <div class="hidden md:block decorative-element top-[30%] right-[10%] w-16 h-16 decoration-teal rotate-45 animate-float">
                    <svg class="w-full h-full"><use href="#dots"/></svg>
                </div>
    
                <div class="container mx-auto px-4">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div class="w-full md:w-1/2 md:order-2" data-aos="fade-left">
                            <div class="relative tilt-card">
                                <picture>
                                    <source 
                                        media="(min-width: 1200px)" 
                                        srcset="images/hero/optimized/hero-section-large.webp"
                                        type="image/webp"
                                    />
                                    <source 
                                        media="(min-width: 800px)" 
                                        srcset="images/hero/optimized/hero-section-medium.webp"
                                        type="image/webp"
                                    />
                                    <img 
                                        src="images/hero/optimized/hero-section-small.webp" 
                                        alt="Urban Infrastructure Hero" 
                                        class="lazyload hero-image w-full h-auto"
                                        loading="lazy"
                                        onerror="this.onerror=null; this.src='/images/hero/hero-section.png';"
                                    />
                                </picture>
                            </div>
                        </div>
                        <div class="w-full md:w-1/2 text-center md:text-left md:order-1" data-aos="fade-right">
                            <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                                Welcome to <span class="text-teal-700">UrbanAid</span>
                            </h1>
                            <p class="text-gray-700 text-base sm:text-lg mb-6 md:mb-8 leading-relaxed text-justify md:mr-4">
                                Dengan UrbanAid, Anda memiliki kekuatan untuk melaporkan kerusakan infrastruktur secara langsung, dan membantu menciptakan lingkungan yang lebih aman dan nyaman bagi semua orang.
                            </p>
                            ${!isLoggedIn ? `
                                <div class="flex flex-row justify-center md:justify-start space-x-4" data-aos="fade-up" data-aos-delay="200">
                                    <button onclick="window.location.href='/login'" class="gradient-border-button px-4 sm:px-6 py-2 text-sm sm:text-base">
                                        Masuk
                                    </button>
                                    <button onclick="window.location.href='/register'" class="gradient-button text-white px-4 sm:px-6 py-2 text-sm sm:text-base">
                                        Daftar
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </section>
        `;
  },

  createIntroSection() {
    return `
            <section class="bg-white py-12 md:py-16 lg:py-20 relative overflow-hidden">
                <div class="decorative-element top-20 -right-5 w-24 h-24 decoration-teal rotate-12 animate-float">
                    <svg class="w-full h-full"><use href="#curved-line"/></svg>
                </div>
                <div class="hidden md:block decorative-element bottom-[30%] -left-15 w-24 h-24 decoration-teal opacity-20 animate-pulse">
                    <svg class="w-full h-full"><use href="#sparkle"/></svg>
                </div>
    
                <div class="container mx-auto px-4 relative z-10">
                    <div class="max-w-6xl mx-auto" data-aos="fade-up">
                        <h2 class="section-title">
                            Pelaporan Infrastruktur
                        </h2>
                        <p class="text-gray-700 text-base sm:text-lg leading-relaxed text-justify">
                            UrbanAid merupakan solusi inovatif untuk mengatasi fragmentasi pengelolaan pengaduan pelayanan publik di Indonesia. 
                            Saat ini, sistem pengaduan di berbagai organisasi pemerintahan masih terpisah-pisah, 
                            tidak terkoordinasi dengan baik, dan berpotensi menimbulkan duplikasi atau terabaikannya laporan masyarakat. 
                            Platform ini bertujuan menciptakan saluran pengaduan nasional terpadu yang memungkinkan warga melaporkan kerusakan infrastruktur secara langsung, 
                            efisien, dan transparan, guna mewujudkan tata kelola pemerintahan yang lebih baik dan responsif terhadap kebutuhan masyarakat.
                        </p>
                    </div>
                </div>
            </section>
        `;
  },


  createInfrastructureSection() {
    // console.log('Creating infrastructure section...');

    // const logWindowSize = () => {
    //     console.log(`Current window width: ${window.innerWidth}px`);
    //     if (window.innerWidth >= 1200) {
    //         console.log('Using large image (width >= 1200px)');
    //     } else if (window.innerWidth >= 800) {
    //         console.log('Using medium image (800px <= width < 1200px)');
    //     } else {
    //         console.log('Using small image (width < 800px)');
    //     }
    // };

    // logWindowSize();

    // window.addEventListener('resize', logWindowSize);

    return `
            <section class="py-12 md:py-16 lg:py-20 relative overflow-hidden">
                <div class="container mx-auto px-4 relative z-10">
                    <div class="relative" data-aos="fade-up">
                        <div class="absolute inset-0 bg-gradient-to-r from-[#00899B]/20 to-[#002F35]/20 rounded-3xl blur-2xl transform -rotate-1"></div>
                        <div class="infrastructure-card tilt-card relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-xl">
                            <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-center">
                                Infrastruktur: Pondasi Kehidupan Modern
                            </h2>
                            <div class="mb-6">
                                <picture>
                                    <source 
                                        media="(min-width: 1200px)" 
                                        srcset="images/optimized/infra-large.webp"
                                        type="image/webp"
                                    />
                                    <source 
                                        media="(min-width: 800px)" 
                                        srcset="images/optimized/infra-medium.webp"
                                        type="image/webp"
                                    />
                                    <img 
                                        src="images/optimized/infra-small.webp" 
                                        alt="Infrastruktur Modern"
                                        class="lazyload w-full max-w-2xl mx-auto rounded-lg shadow-md"
                                        loading="lazy"
                                        onerror="console.error('× WebP failed, falling back to JPEG'); this.onerror=null; this.src='images/infra.jpeg'; console.log('Using fallback JPEG image');"
                                    />
                                </picture>
                            </div>
                            <div class="space-y-4 mb-8">
                                <p class="text-gray-700 text-base sm:text-lg text-justify leading-relaxed">
                                    Infrastruktur yang berkualitas adalah kunci pembangunan berkelanjutan, meningkatkan kualitas hidup, dan mendorong pertumbuhan ekonomi masyarakat.
                                    Dengan adanya infrastruktur yang baik, mobilitas masyarakat menjadi lebih mudah, kegiatan ekonomi berjalan lancar, dan pelayanan publik dapat diberikan secara optimal.
                                </p>
                            </div>
                            <div class="text-center" data-aos="fade-up" data-aos-delay="200">
                                <button
                                    class="gradient-button text-white px-4 sm:px-6 py-2 text-sm sm:text-base"
                                    onclick="window.location.href='/artikel';">
                                    Pelajari Selengkapnya
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
  },

  createStatsSection() {
    return `
            <section class="stats-section py-16 md:py-20 relative overflow-hidden">
                <div class="container mx-auto px-4 relative z-10">
                    <h2 class="section-title text-white mb-12" data-aos="fade-up">
                        Jumlah Laporan
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 max-w-7xl mx-auto">
                        <div class="relative isolate" data-aos="fade-up" data-aos-delay="0">
                            <div class="stats-card text-center tilt-card bg-white rounded-xl p-8 hover:z-10">
                                <div class="text-3xl md:text-4xl font-bold text-teal-800 mb-4">
                                    <span class="counter" data-target="${this.stats.total}">0</span>
                                </div>
                                <div class="text-lg font-semibold text-teal-800 mb-2">
                                    Total Laporan
                                </div>
                                <p class="text-gray-700">
                                    Total laporan yang telah diterima
                                </p>
                            </div>
                        </div>
    
                        <div class="relative isolate" data-aos="fade-up" data-aos-delay="200">
                            <div class="stats-card text-center tilt-card bg-white rounded-xl p-8 hover:z-10">
                                <div class="text-3xl md:text-4xl font-bold text-teal-800 mb-4">
                                    <span class="counter" data-target="${this.stats.completed}">0</span>
                                </div>
                                <div class="text-lg font-semibold text-teal-800 mb-2">
                                    Laporan Selesai
                                </div>
                                <p class="text-gray-700">
                                    Laporan telah ditindaklanjuti
                                </p>
                            </div>
                        </div>
    
                        <div class="relative isolate" data-aos="fade-up" data-aos-delay="400">
                            <div class="stats-card text-center tilt-card bg-white rounded-xl p-8 hover:z-10">
                                <div class="text-3xl md:text-4xl font-bold text-teal-800 mb-4">
                                    <span class="counter" data-target="${this.stats.pending}">0</span>
                                </div>
                                <div class="text-lg font-semibold text-teal-800 mb-2">
                                    Laporan Pending
                                </div>
                                <p class="text-gray-700">
                                    Laporan menunggu verifikasi
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
  },

  createProcessSection() {
    return `
           <section class="py-16 md:py-20 relative overflow-hidden">
    <div class="decorative-element top-10 -right-5 w-28 h-28 decoration-teal rotate-45 opacity-20">
        <svg class="w-full h-full"><use href="#sparkle"/></svg>
    </div>
    <div class="decorative-element bottom-[20%] -left-10 w-32 h-32 decoration-teal opacity-15">
        <svg class="w-full h-full"><use href="#flower"/></svg>
    </div>
    <div class="container mx-auto px-4 relative z-10">
        <h2 class="section-title" data-aos="fade-up">
            Alur Pelaporan
        </h2>

        <!-- Mobile Process Steps -->
        <div class="block md:hidden process-steps-mobile">
            <div class="flex flex-col items-center" data-aos="fade-up">
                <span class="material-icons-round process-icon mb-4" style="font-size: 44px">edit_note</span>
                <h3 class="text-lg font-bold mb-3">Tulis Laporan</h3>
                <p class="text-gray-700 text-md text-center px-4 mb-4">
                    Laporkan keluhan atau aspirasi anda dengan jelas dan lengkap
                </p>
                <div class="process-vertical-line"></div>
            </div>
            
            <div class="flex flex-col items-center" data-aos="fade-up" data-aos-delay="100">
                <span class="material-icons-round process-icon mb-4" style="font-size: 44px" >track_changes</span>
                <h3 class="text-lg font-bold mb-3">Proses Tindak Lanjut</h3>
                <p class="text-md text-gray-700 text-center px-4 mb-4">
                    Kami menindaklanjuti dan membalas laporan Anda
                </p>
                <div class="process-vertical-line"></div>
            </div>

            <div class="flex flex-col items-center" data-aos="fade-up" data-aos-delay="200">
                <span class="material-icons-round process-icon mb-4" style="font-size: 44px">task_alt</span>
                <h3 class="text-lg font-bold mb-3">Selesai</h3>
                <p class="text-md text-gray-700 text-center px-4 mb-4">
                    Laporan ditindaklanjuti
                </p>
                <div class="process-vertical-line"></div>
            </div>

            <div class="flex flex-col items-center" data-aos="fade-up" data-aos-delay="300">
                <span class="material-icons-round process-icon mb-4"style="font-size: 44px" >rate_review</span>
                <h3 class="text-lg font-bold mb-3">Beri Tanggapan</h3>
                <p class="text-md text-gray-700 text-center px-4 mb-4">
                    Anda dapat menanggapi hasil laporan
                </p>
            </div>
        </div>

        <!-- Desktop Process Steps -->
        <div class="process-steps-desktop hidden md:block max-w-4xl mx-auto">
            <div class="grid grid-cols-4 gap-8 text-center relative">
                <div class="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00899B] to-[#002F35] -z-10"></div>
                
                <div class="bg-white p-6 rounded-xl" data-aos="fade-up">
                    <span class="material-icons-round mb-4 bg-gradient-to-r from-[#00899B] to-[#002F35] bg-clip-text text-transparent" style="font-size: 44px">edit_note</span>
                    <h3 class="text-xl font-bold mb-3">Tulis Laporan</h3>
                    <p class="text-lg text-gray-700">
                        Laporkan keluhan atau aspirasi anda dengan jelas dan lengkap
                    </p>
                </div>

                <div class="bg-white p-6 rounded-xl" data-aos="fade-up" data-aos-delay="100">
                    <span class="material-icons-round text-4xl mb-4 bg-gradient-to-r from-[#00899B] to-[#002F35] bg-clip-text text-transparent" style="font-size: 44px">track_changes</span>
                    <h3 class="text-xl font-bold mb-3">Proses Tindak Lanjut</h3>
                    <p class="text-lg text-gray-700">
                        Kami menindaklanjuti dan membalas laporan Anda
                    </p>
                </div>

                <div class="bg-white p-6 rounded-xl" data-aos="fade-up" data-aos-delay="200">
                    <span class="material-icons-round text-4xl mb-4 bg-gradient-to-r from-[#00899B] to-[#002F35] bg-clip-text text-transparent" style="font-size: 44px">task_alt</span>
                    <h3 class="text-xl font-bold mb-3">Selesai</h3>
                    <p class="text-lg text-gray-700">
                        Laporan ditindaklanjuti
                    </p>
                </div>

                <div class="bg-white p-6 rounded-xl" data-aos="fade-up" data-aos-delay="300">
                    <span class="material-icons-round text-4xl mb-4 bg-gradient-to-r from-[#00899B] to-[#002F35] bg-clip-text text-transparent" style="font-size: 44px">rate_review</span>
                    <h3 class="text-xl font-bold mb-3">Beri Tanggapan</h3>
                    <p class="text-lg text-gray-700">
                        Anda dapat menanggapi hasil laporan
                    </p>
                </div>
            </div>
        </div>

        <div class="text-center mt-10" data-aos="fade-up" data-aos-delay="400">
            <button id="reportButton" class="gradient-button text-white px-6 py-2">
                Lapor Sekarang
            </button>
        </div>
    </div>
</section>
        `;
  },


  createTestimonialsSection() {
    const testimonialCards = this.testimonials.length > 0
      ? this.testimonials.map((testimonial, index) => `
                <div class="relative" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="absolute inset-0 bg-gradient-to-r from-[#00899B]/20 to-[#002F35]/20 rounded-3xl blur-2xl transform -rotate-1"></div>
                    <div class="testimonial-card flex flex-col h-full tilt-card relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl">
                        <div class="flex-grow mb-6">
                            <p class="text-gray-700">${testimonial.text}</p>
                        </div>
                        
                        <!-- Profile section -->
                        <div class="flex items-center mt-auto">
                            <div class="min-w-[44px] min-h-[44px] flex items-center justify-center">
                                <span class="material-icons-round" style="font-size: 48px; color: #00899B;">account_circle</span>
                            </div>
                            <div class="ml-3">
                                <h4 class="testimonial-name text-lg font-semibold">${testimonial.name}</h4>
                                <div class="flex text-yellow-400 gap-0.5">
                                    ${Array(testimonial.rating).fill('<span class="material-icons-round">star</span>').join('')}
                                    ${Array(5 - testimonial.rating).fill('<span class="material-icons-round">star_outline</span>').join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')
      : `
                <div class="col-span-3 relative" data-aos="fade-up">
                    <div class="absolute inset-0 bg-gradient-to-r from-[#00899B]/20 to-[#002F35]/20 rounded-3xl blur-2xl transform -rotate-1"></div>
                    <div class="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl text-center">
                        <div class="min-w-[44px] min-h-[44px] flex items-center justify-center mx-auto">
                            <span class="material-icons-round" style="font-size: 48px;">rate_review</span>
                        </div>
                        <p class="text-lg">Belum ada ulasan</p>
                    </div>
                </div>`;

    return `
            <section class="bg-gray-50 py-16 md:py-20 relative overflow-hidden">
                <div class="container mx-auto px-4 relative z-10">
                    <h2 class="section-title" data-aos="fade-up">
                        Apa Kata Mereka
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        ${testimonialCards}
                    </div>
                </div>
            </section>
        `;
  },

  initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');

    const options = {
      duration: 2.5,
      useGrouping: true,
      useEasing: true,
      separator: ',',
      decimal: '.',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target'));

          const countUp = new CountUp(counter, target, options);

          if (!countUp.error) {
            countUp.start();
          } else {
            console.error(countUp.error);
          }

          observer.unobserve(counter);
        }
      });
    }, {
      threshold: 0.1
    });

    counters.forEach((counter) => observer.observe(counter));
  },

  attachEventListeners() {
    const reportButton = document.getElementById('reportButton');
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

    window.addEventListener('load', () => window.scrollTo(0, 0));
    window.addEventListener('popstate', () => window.scrollTo(0, 0));
  },


  cleanup() {
    const reportButton = document.getElementById('reportButton');
    if (reportButton) {
      reportButton.removeEventListener('click', () => {});
    }
    Loading.hide();
  }
};

export default HomePage;