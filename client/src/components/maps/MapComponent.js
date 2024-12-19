class MapComponent {
  constructor(containerElementId) {
    this.containerElementId = containerElementId;
    this.map = null;
    this.marker = null;
    this.onLocationSelect = null;
    this.isInitialized = false;

  const mapStyle = document.createElement('style');
  mapStyle.textContent = `
    #${this.containerElementId} {
      height: 400px !important;
      width: 100% !important;
      z-index: 1;
      background: #f3f4f6;
      border-radius: 0.5rem;
      overflow: hidden;
      position: relative;
    }
    
    .leaflet-container {
      height: 100% !important;
      width: 100% !important;
      background: #f3f4f6 !important;
    }
    
    .location-popup {
      font-size: 14px;
      line-height: 1.4;
    }
    
    .leaflet-control-zoom {
      border: none !important;
      margin: 1rem !important;
    }
    
    .leaflet-control-zoom a {
      background: white !important;
      border: 1px solid #e5e7eb !important;
      color: #374151 !important;
      width: 32px !important;
      height: 32px !important;
      line-height: 30px !important;
      border-radius: 8px !important;
      margin-bottom: 8px !important;
    }
    
    .leaflet-control-zoom a:hover {
      background: #f9fafb !important;
      color: #111827 !important;
    }
  `;
  document.head.appendChild(mapStyle);
  }


  async waitForLeaflet(maxAttempts = 10) {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      const checkLeaflet = () => {
        if (typeof L !== 'undefined') {
          resolve(true);
          return;
        }

        attempts++;
        if (attempts >= maxAttempts) {
          reject(new Error('Leaflet tidak dapat dimuat'));
          return;
        }

        setTimeout(checkLeaflet, 200);
      };

      checkLeaflet();
    });
  }

  async initializeMap(address = null) {
    try {
      await this.waitForLeaflet();

      const mapContainer = document.getElementById(this.containerElementId);
      if (!mapContainer) return null;

      if (this.isInitialized) {
        if (address) {
          const koordinat = await this.getCoordinatesFromAddress(address);
          if (koordinat) {
            this.updateMarker(koordinat.latitude, koordinat.longitude, address);
          }
        }
        return this.getMapState();
      }

      mapContainer.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-100 rounded-lg"><span class="material-icons-round animate-spin mr-2">sync</span>Memuat peta...</div>';

      let initialLat = -2.548926;
      let initialLng = 118.014863;
      let initialZoom = 5;

      if (address) {
        try {
          const koordinat = await this.getCoordinatesFromAddress(address);
          if (koordinat) {
            initialLat = koordinat.latitude;
            initialLng = koordinat.longitude;
            initialZoom = 15;
          }
        } catch (error) {
          console.error('Error getting coordinates:', error);
        }
      }

      mapContainer.innerHTML = '';

      this.map = L.map(this.containerElementId, {
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true,
        maxZoom: 18,
        preferCanvas: true
      }).setView([initialLat, initialLng], initialZoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
        minZoom: 4,
        tileSize: 256,
        keepBuffer: 2
      }).addTo(this.map);

      let clickTimeout;
      this.map.on('click', (e) => {
        if (clickTimeout) clearTimeout(clickTimeout);
        clickTimeout = setTimeout(() => {
          this.updateMarker(e.latlng.lat, e.latlng.lng);
          this.reverseGeocode(e.latlng.lat, e.latlng.lng);
        }, 300);
      });

      if (address) {
        this.updateMarker(initialLat, initialLng, address);
      }

      this.isInitialized = true;
      return this.getMapState();

    } catch (error) {
      console.error('Error initializing map:', error);
      const mapContainer = document.getElementById(this.containerElementId);
      if (mapContainer) {
        mapContainer.innerHTML = '<div class="flex items-center justify-center h-full bg-red-100 rounded-lg text-red-600"><span class="material-icons-round mr-2">error</span>Gagal memuat peta</div>';
      }
      return null;
    }
  }

  getMapState() {
    return {
      map: this.map,
      marker: this.marker,
      coordinates: this.marker ? {
        latitude: this.marker.getLatLng().lat,
        longitude: this.marker.getLatLng().lng
      } : null
    };
  }

  updateMarker(lat, lng, popupContent = 'Lokasi yang dipilih') {
    if (!this.map) return;

    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    this.marker = L.marker([lat, lng], {
      draggable: true,
      autoPan: true,
      riseOnHover: true,
      title: popupContent,
      alt: 'Marker lokasi'
    }).addTo(this.map);

    const popup = L.popup({
      maxWidth: 300,
      minWidth: 200,
      autoClose: false,
      closeOnClick: false,
      className: 'location-popup'
    }).setContent(popupContent);

    this.marker.bindPopup(popup).openPopup();

    this.map.flyTo([lat, lng], 15, {
      duration: 1,
      easeLinearity: 0.25
    });

    let dragTimeout;
    this.marker.on('dragend', async (e) => {
      if (dragTimeout) clearTimeout(dragTimeout);
      dragTimeout = setTimeout(async () => {
        const position = e.target.getLatLng();
        await this.reverseGeocode(position.lat, position.lng);
      }, 300);
    });

    if (this.onLocationSelect) {
      this.onLocationSelect({
        latitude: lat,
        longitude: lng,
        address: popupContent
      });
    }
  }

  async getCoordinatesFromAddress(address) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}, Indonesia&limit=1&accept-language=id`,
        {
          headers: {
            'User-Agent': 'UrbanAid App',
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data[0]) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Error in geocoding:', error);
      return null;
    }
  }

  async reverseGeocode(lat, lng) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=id`,
        {
          headers: {
            'User-Agent': 'UrbanAid App',
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.display_name) {
        if (this.marker) {
          const popup = this.marker.getPopup();
          if (popup) {
            popup.setContent(data.display_name);
            popup.update();
          } else {
            this.marker.bindPopup(data.display_name).openPopup();
          }
        }

        if (this.onLocationSelect) {
          this.onLocationSelect({
            latitude: lat,
            longitude: lng,
            address: data.display_name
          });
        }
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      if (this.marker) {
        this.marker.bindPopup('Tidak dapat mendapatkan alamat lokasi').openPopup();
      }
    }
  }

  setLocationSelectCallback(callback) {
    this.onLocationSelect = callback;
  }

  cleanup() {
    if (this.map) {
      this.map.off();
      this.map.eachLayer((layer) => {
        this.map.removeLayer(layer);
      });
      this.map.remove();
      this.map = null;
    }

    if (this.marker) {
      this.marker.off();
      this.marker = null;
    }

    this.onLocationSelect = null;
    this.isInitialized = false;

    const mapContainer = document.getElementById(this.containerElementId);
    if (mapContainer) {
      const newContainer = mapContainer.cloneNode(true);
      mapContainer.parentNode.replaceChild(newContainer, mapContainer);
    }
  }
}

export default MapComponent;