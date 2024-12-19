import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import Loading from '../../components/common/Loading';

const TentangKami = {
  developers: [
    {
      name: 'Andreas Pujo Santoso',
      position: 'Frontend Developer',
      university: 'Universitas Lampung',
      image: '/images/profile/andreas.jpg',
      imagePosition: 'center top'
    },
    {
      name: 'Chiboy Cristian Sibarani',
      position: 'Frontend Developer',
      university: 'Universitas Negeri Surabaya',
      image: '/images/profile/ciboy.png',
      imagePosition: 'center top'
    },
    {
      name: 'Muhammad Danu Seta Wiardana',
      position: 'Backend Developer & Project Manager',
      university: 'Universitas Lampung',
      image: '/images/profile/danu.jpg',
      imagePosition: 'center top'
    },
    {
      name: 'Savana Putra Aditama',
      position: 'Backend Developer',
      university: 'Universitas Negeri Surabaya',
      image: '/images/profile/savana.jpg',
      imagePosition: 'center top'
    }
  ],

  contacts: [
    {
      icon: 'location_on',
      title: 'Alamat',
      content: 'Jakarta, Indonesia'
    },
    {
      icon: 'email',
      title: 'Email',
      content: 'contact@urbanaid.id'
    },
    {
      icon: 'phone',
      title: 'Telepon',
      content: '+628 1234 5678'
    },
    {
      icon: 'schedule',
      title: 'Jam Kerja',
      content: 'Senin - Jumat: 08.00 - 17.00 WIB'
    }
  ],

  async init() {
    try {
      const app = document.getElementById('app');
      app.innerHTML = this.render();

      AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
      });

      this.initTilt();
    } catch (error) {
      console.error('Error initializing about page:', error);
    }
  },

  initTilt() {
    const cards = document.querySelectorAll('.tilt-card');
    VanillaTilt.init(cards, {
      max: 8,
      speed: 400,
      scale: 1.03,
      glare: true,
      'max-glare': 0.3,
      transition: true,
      easing: 'cubic-bezier(.03,.98,.52,.99)'
    });
  },

  createDeveloperCards() {
    return this.developers.map((dev, index) => `
            <div class="relative group h-full" data-aos="zoom-in-up" data-aos-delay="${index * 150}">
                <div class="absolute -inset-0.5 bg-gradient-to-r from-[#00899B] to-[#002F35] rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                <div class="relative bg-white rounded-2xl p-8 h-full flex flex-col tilt-card">
                    <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-[#00899B] to-[#002F35] rounded-lg rotate-45"></div>
                    <div class="relative flex items-center justify-center mt-2 mb-6">
                        ${dev.image
    ? `<div class="w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#00899B]/20">
                                <img 
                                    src="${dev.image}" 
                                    alt="${dev.name}" 
                                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    style="object-position: ${dev.imagePosition || 'center center'}"
                                    onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                                >
                                <span class="material-icons-round hidden" style="font-size: 128px; color: #00899B; filter: drop-shadow(0 4px 6px rgba(0, 137, 155, 0.2))">account_circle</span>
                               </div>`
    : `<div class="w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#00899B]/20 flex items-center justify-center">
                                <span class="material-icons-round" style="font-size: 128px; color: #00899B; filter: drop-shadow(0 4px 6px rgba(0, 137, 155, 0.2))">account_circle</span>
                               </div>`
}
                    </div>
                    <div class="space-y-3 text-center flex-grow flex flex-col justify-center">
                        <h3 class="font-bold text-xl text-gray-900">${dev.name}</h3>
                        <div class="h-0.5 w-12 mx-auto bg-gradient-to-r from-[#00899B] to-[#002F35]"></div>
                        <p class="text-[#00899B] font-semibold">${dev.position}</p>
                        <p class="text-gray-600 text-sm">${dev.university}</p>
                    </div>
                </div>
            </div>
        `).join('');
  },


  createContactItems() {
    return this.contacts.map((contact, index) => `
            <div class="group" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="relative p-6 rounded-2xl transition-all duration-500 hover:bg-gradient-to-br hover:from-white hover:to-gray-50">
                    <div class="flex items-start gap-4">
                        <div class="relative">
                            <div class="absolute inset-0 bg-[#00899B]/20 rounded-xl blur-lg transform group-hover:scale-110 transition duration-500"></div>
                            <div class="relative bg-white p-3 rounded-xl shadow-lg group-hover:shadow-xl transition duration-500">
                                <span class="material-icons-round text-3xl text-[#00899B]">${contact.icon}</span>
                            </div>
                        </div>
                        <div class="flex-1 pt-1">
                            <h3 class="font-bold text-gray-900 mb-2 group-hover:text-[#00899B] transition duration-300">${contact.title}</h3>
                            <p class="text-gray-700 group-hover:translate-x-1 transition duration-300">${contact.content}</p>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
  },

  render() {
    return `
            ${Navbar()}
            <main class="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
                <div class="absolute top-0 left-0 w-full h-screen overflow-hidden pointer-events-none">
                    <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00899B]/10 rounded-full blur-3xl"></div>
                    <div class="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#002F35]/5 rounded-full blur-3xl"></div>
                </div>

                <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                    <div class="text-center mb-16 md:mb-24" data-aos="fade-down">
                        <div class="inline-block">
                            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00899B] to-[#002F35] mb-6">
                                Apa Itu UrbanAid?
                            </h1>
                            <div class="h-1.5 w-32 mx-auto bg-gradient-to-r from-[#00899B] to-[#002F35] rounded-full"></div>
                        </div>
                    </div>
                    
                    <div class="relative max-w-7xl mx-auto mb-24" data-aos="fade-up">
                        <div class="absolute inset-0 bg-gradient-to-r from-[#00899B]/20 to-[#002F35]/20 rounded-3xl blur-2xl transform -rotate-1"></div>
                        <div class="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-xl">
                            <div class="absolute -top-6 -left-6 w-12 h-12 bg-[#00899B] rounded-full flex items-center justify-center shadow-lg">
                                <span class="material-icons-round text-white text-2xl">lightbulb</span>
                            </div>
                            <p class="text-gray-700 sm:text-lg mb-8 leading-relaxed text-justify">
                                UrbanAid adalah sebuah aplikasi berbasis teknologi yang dirancang untuk menjadi solusi praktis dalam menangani pelaporan kerusakan infrastruktur. Dengan UrbanAid, pengguna dapat dengan mudah melaporkan kondisi infrastruktur yang rusak, seperti jalan berlubang, lampu jalan yang mati, atau jembatan yang rusak, secara real-time.
                            </p>
                            <p class="text-gray-700 sm:text-lg leading-relaxed text-justify">
                                UrbanAid hadir untuk menjawab kebutuhan akan sistem pelaporan yang efisien, mendukung perbaikan infrastruktur lebih cepat, dan menciptakan lingkungan yang aman serta nyaman bagi masyarakat. Dengan UrbanAid, setiap warga dapat berkontribusi dalam menjaga kualitas infrastruktur di lingkungan mereka.
                            </p>
                        </div>
                    </div>

                    <div class="mb-24">
                        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16" data-aos="fade-up">
                            <span class="relative inline-block mb-8">
                                Tim Pengembang
                                <div class="absolute -bottom-4 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00899B] to-[#002F35] rounded-full"></div>
                            </span>
                        </h2>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                            ${this.createDeveloperCards()}
                        </div>
                    </div>

                    <div>
                        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16" data-aos="fade-up">
                            <span class="relative inline-block">
                                Hubungi Kami
                                <div class="absolute -bottom-4 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00899B] to-[#002F35] rounded-full"></div>
                            </span>
                        </h2>
                        <div class="relative max-w-7xl mx-auto" data-aos="fade-up">
                            <div class="absolute inset-0 bg-gradient-to-r from-[#00899B]/10 to-[#002F35]/10 rounded-3xl blur-2xl transform rotate-1"></div>
                            <div class="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-xl">
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    ${this.createContactItems()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            ${Footer()}
        `;
  },

  cleanup() {
    Loading.hide();
  }
};

export default TentangKami;