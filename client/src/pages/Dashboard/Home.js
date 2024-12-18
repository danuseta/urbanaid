import { Navbar } from '../../components/common/Navbar.js';
import { Footer } from '../../components/common/Footer.js';
import StatisticService from '../../services/statistic-service.js';

const HomePage = {
    stats: {
        active: 0,
        completed: 0,
        pending: 0
    },
    
    testimonials: [],

    async init() {
        try {
            this.render(); 
            await Promise.all([
                this.loadSvgSprites(),
                this.loadData()
            ]); 
            this.render(); 
            this.attachEventListeners();
        } catch (error) {
            console.error('Error initializing home page:', error);
        }
    },

    async loadData() {
        try {
            const statsResponse = await StatisticService.getReportStatistics();
            if (statsResponse.status === 'success') {
                this.stats = statsResponse.data;
            }

            const reviewsResponse = await StatisticService.getReviews();
            if (reviewsResponse.status === 'success') {
                this.testimonials = reviewsResponse.data.map(review => ({
                    name: review.user_name,
                    rating: review.rating,
                    text: review.review_text
                }));
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    },

    loadSvgSprites() {
        const svgUrl = '/images/decorative-elements.svg';
        fetch(svgUrl)
            .then(response => response.text())
            .then(svgContent => {
                const div = document.createElement('div');
                div.style.display = 'none';
                div.innerHTML = svgContent;
                document.body.appendChild(div);
            })
            .catch(error => console.error('Error loading SVG sprites:', error));
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
                        <div class="w-full md:w-1/2 md:order-2">
                            <div class="relative">
                                <img src="/images/hero-section1.png" alt="Urban Infrastructure Hero" class="hero-image rounded-2xl">
                            </div>
                        </div>
                        <div class="w-full md:w-1/2 text-center md:text-left md:order-1">
                            <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                                Welcome to <span class="text-teal-600">UrbanAid</span>
                            </h1>
                            <p class="text-base sm:text-lg mb-6 md:mb-8 leading-relaxed">
                                Dengan UrbanAid, Anda memiliki kekuatan untuk melaporkan kerusakan infrastruktur secara langsung, dan membantu menciptakan lingkungan yang lebih aman dan nyaman bagi semua orang.
                            </p>
                            ${!isLoggedIn ? `
                                <div class="flex flex-row justify-center md:justify-start space-x-4">
                                    <button onclick="window.location.href='#/login'" class="gradient-border-button px-4 sm:px-6 py-2 text-sm sm:text-base">
                                        Masuk
                                    </button>
                                    <button onclick="window.location.href='#/register'" class="gradient-button text-white px-4 sm:px-6 py-2 text-sm sm:text-base">
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
                    <div class="max-w-6xl mx-auto">
                        <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12">
                            Pelaporan Infrastruktur
                        </h2>
                        <p class="text-base sm:text-lg leading-relaxed text-center">
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
        return `
            <section class="py-12 md:py-16 lg:py-20 relative overflow-hidden">
                <div class="decorative-element bottom-[10%] right-[5%] w-24 h-24 decoration-teal animate-float">
                    <svg class="w-full h-full"><use href="#sparkle"/></svg>
                </div>
                <div class="hidden md:block decorative-element top-[30%] left-[10%] w-20 h-20 decoration-teal rotate-45">
                    <svg class="w-full h-full"><use href="#dots"/></svg>
                </div>
    
                <div class="container mx-auto px-4 relative z-10">
                    <div class="infrastructure-card">
                        <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-center">
                            Infrastruktur: Pondasi Kehidupan Modern
                        </h2>
                        <div class="mb-6">
                            <img src="/images/infra.jpeg" 
                                alt="Infrastruktur Modern"
                                class="w-full max-w-2xl mx-auto rounded-lg shadow-md">
                        </div>
                        <div class="space-y-4 mb-8">
                            <p class="text-base sm:text-lg text-center leading-relaxed">
                                Infrastruktur yang berkualitas adalah kunci pembangunan berkelanjutan, meningkatkan kualitas hidup, dan mendorong pertumbuhan ekonomi masyarakat. 
                                Dengan adanya infrastruktur yang baik, mobilitas masyarakat menjadi lebih mudah, kegiatan ekonomi berjalan lancar, dan pelayanan publik dapat diberikan secara optimal.
                            </p>
                        </div>
                        <div class="text-center">
                            <button 
                                class="gradient-button text-white px-4 sm:px-6 py-2 text-sm sm:text-base" 
                                onclick="window.location.href='#/artikel';">
                                Pelajari Selengkapnya
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    createStatsSection() {
        return `
            <section class="stats-section py-16 md:py-20 relative overflow-hidden">
                <div class="hidden md:block decorative-element -top-19 right-[5%] w-32 h-32 decoration-white opacity-20 animate-float">
                    <svg class="w-full h-full"><use href="#dots"/></svg>
                </div>
                <div class="decorative-element bottom-[10%] -left-5 w-28 h-28 decoration-white animate-float">
                    <svg class="w-full h-full"><use href="#curved-line"/></svg>
                </div>
                <div class="decorative-element bottom-[30%] left-[10%] w-16 h-16 decoration-white rotate-45">
                    <svg class="w-full h-full"><use href="#sparkle"/></svg>
                </div>

                <div class="container mx-auto px-4 relative z-10">
                    <h2 class="section-title text-white mb-12">
                        Jumlah Laporan
                    </h2>
                    <div class="stats-grid">
                        <div class="stats-card text-center">
                            <div class="text-3xl md:text-4xl font-bold text-teal-800 mb-4">
                                ${this.stats.active}
                            </div>
                            <div class="text-lg font-semibold text-teal-800 mb-2">
                                Laporan Aktif
                            </div>
                            <p class="text-gray-600">
                                Laporan dalam proses penanganan
                            </p>
                        </div>

                        <div class="stats-card text-center">
                            <div class="text-3xl md:text-4xl font-bold text-teal-800 mb-4">
                                ${this.stats.completed}
                            </div>
                            <div class="text-lg font-semibold text-teal-800 mb-2">
                                Laporan Selesai
                            </div>
                            <p class="text-gray-600">
                                Laporan telah ditindaklanjuti
                            </p>
                        </div>

                        <div class="stats-card text-center">
                            <div class="text-3xl md:text-4xl font-bold text-teal-800 mb-4">
                                ${this.stats.pending}
                            </div>
                            <div class="text-lg font-semibold text-teal-800 mb-2">
                                Laporan Pending
                            </div>
                            <p class="text-gray-600">
                                Laporan menunggu verifikasi
                            </p>
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
                    <h2 class="section-title">
                        Alur Pelaporan
                    </h2>
    
                    <!-- Mobile Process Steps -->
                    <div class="block md:hidden process-steps-mobile">
                        <div class="flex flex-col items-center">
                            <span class="material-icons-round process-icon mb-4">edit_note</span>
                            <h3 class="text-xl font-bold mb-3">Tulis Laporan</h3>
                            <p class="text-lg text-gray-600 text-center px-4 mb-4">
                                Laporkan keluhan atau aspirasi anda dengan jelas dan lengkap
                            </p>
                            <div class="process-vertical-line"></div>
                        </div>
                        
                        <div class="flex flex-col items-center">
                            <span class="material-icons-round process-icon mb-4">track_changes</span>
                            <h3 class="text-xl font-bold mb-3">Proses Tindak Lanjut</h3>
                            <p class="text-lg text-gray-600 text-center px-4 mb-4">
                                Kami menindaklanjuti dan membalas laporan Anda
                            </p>
                            <div class="process-vertical-line"></div>
                        </div>
    
                        <div class="flex flex-col items-center">
                            <span class="material-icons-round process-icon mb-4">task_alt</span>
                            <h3 class="text-xl font-bold mb-3">Selesai</h3>
                            <p class="text-lg text-gray-600 text-center px-4 mb-4">
                                Laporan ditindaklanjuti
                            </p>
                            <div class="process-vertical-line"></div>
                        </div>
    
                        <div class="flex flex-col items-center">
                            <span class="material-icons-round process-icon mb-4">rate_review</span>
                            <h3 class="text-xl font-bold mb-3">Beri Tanggapan</h3>
                            <p class="text-lg text-gray-600 text-center px-4 mb-4">
                                Anda dapat menanggapi hasil laporan
                            </p>
                        </div>
                    </div>
    
                    <!-- Desktop Process Steps -->
                    <div class="process-steps-desktop hidden md:block max-w-4xl mx-auto">
                        <div class="grid grid-cols-4 gap-8 text-center relative">
                            <div class="absolute top-12 left-0 right-0 h-0.5 gradient-background -z-0"></div>
                            
                            <div class="process-step-container bg-white">
                                <span class="material-icons-round process-icon mb-4">edit_note</span>
                                <h3 class="text-xl font-bold mb-3">Tulis Laporan</h3>
                                <p class="text-lg text-gray-600">
                                    Laporkan keluhan atau aspirasi anda dengan jelas dan lengkap
                                </p>
                            </div>
    
                            <div class="process-step-container bg-white">
                                <span class="material-icons-round process-icon mb-4">track_changes</span>
                                <h3 class="text-xl font-bold mb-3">Proses Tindak Lanjut</h3>
                                <p class="text-lg text-gray-600">
                                    Kami menindaklanjuti dan membalas laporan Anda
                                </p>
                            </div>
    
                            <div class="process-step-container bg-white">
                                <span class="material-icons-round process-icon mb-4">task_alt</span>
                                <h3 class="text-xl font-bold mb-3">Selesai</h3>
                                <p class="text-lg text-gray-600">
                                    Laporan ditindaklanjuti
                                </p>
                            </div>
    
                            <div class="process-step-container bg-white">
                                <span class="material-icons-round process-icon mb-4">rate_review</span>
                                <h3 class="text-xl font-bold mb-3">Beri Tanggapan</h3>
                                <p class="text-lg text-gray-600">
                                    Anda dapat menanggapi hasil laporan
                                </p>
                            </div>
                        </div>
                    </div>
    
                    <div class="text-center mt-12">
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
            ? this.testimonials.map(testimonial => `
                <div class="testimonial-card flex flex-col h-full">
                    <div class="flex-grow mb-6">
                        <p class="testimonial-text">${testimonial.text}</p>
                    </div>
                    
                    <!-- Profile section -->
                    <div class="flex items-center mt-auto">
                        <!-- Container dengan minimum 44x44 untuk aksesibilitas -->
                        <div class="min-w-[44px] min-h-[44px] flex items-center justify-center">
                            <!-- Icon dengan ukuran yang proporsional -->
                            <span class="material-icons-round" style="font-size: 48px; color: #4B5563;">account_circle</span>
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
            `).join('')
            : `<div class="col-span-3 text-center text-gray-500">
                    <div class="min-w-[44px] min-h-[44px] flex items-center justify-center mx-auto">
                        <span class="material-icons-round" style="font-size: 48px;">rate_review</span>
                    </div>
                    <p class="text-lg">Belum ada ulasan</p>
               </div>`;
    
        return `
            <section class="bg-gray-50 py-16 md:py-20 relative overflow-hidden">
                <div class="container mx-auto px-4 relative z-10">
                    <h2 class="section-title">
                        Apa Kata Mereka
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        ${testimonialCards}
                    </div>
                </div>
            </section>
        `;
    },

    attachEventListeners() {
        const reportButton = document.getElementById('reportButton');
        if (reportButton) {
            reportButton.addEventListener('click', () => {
                const token = localStorage.getItem('token');
                
                if (token) {
                    window.location.href = '#/pelaporan';
                } else {
                    window.location.href = '#/register';
                }
            });
        }
    },
    

    cleanup() {
        const reportButton = document.getElementById('reportButton');
        if (reportButton) {
            reportButton.removeEventListener('click', () => {});
        }
    }
};

export default HomePage;