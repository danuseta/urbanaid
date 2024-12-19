class GeocodingService {
  static async getCoordinatesFromAddress(address) {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;

    try {
      const response = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'UrbanAid App'
        }
      });
      const data = await response.json();

      if (data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          displayName: data[0].display_name
        };
      } else {
        throw new Error('Alamat tidak ditemukan');
      }
    } catch (error) {
      console.error('Gagal mengambil koordinat:', error);
      return null;
    }
  }
}

export default GeocodingService;