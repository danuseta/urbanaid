// riwayat-service.js
import ApiService from './api-service';

class RiwayatService extends ApiService {
  static async getRiwayatByUser() {
    return this.fetchWithAuth('/riwayat/user');
  }

  static async getAllRiwayat() {
    return this.fetchWithAuth('/riwayat');
  }

  static async getRiwayatById(id) {
    return this.fetchWithAuth(`/riwayat/${id}`);
  }

  static async getAdminRiwayat() {
    return this.fetchWithAuth('/riwayat/admin');
  }

  static async getDetailRiwayat(id) {
    return this.fetchWithAuth(`/riwayat/detail/${id}`);
  }
}

export default RiwayatService;