const db = require('../config/database');
const dbUtils = require('../utils/db-utils');
const https = require('https');

const ReportModel = {
  geocodeAddress(address) {
    return new Promise((resolve, reject) => {
      const encodedAddress = encodeURIComponent(address);
      const options = {
        hostname: 'nominatim.openstreetmap.org',
        path: `/search?format=json&q=${encodedAddress}&limit=1`,
        method: 'GET',
        headers: {
          'User-Agent': 'UrbanAID/1.0'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const parseData = JSON.parse(data);
            if (parseData.length > 0) {
              resolve({
                latitude: parseFloat(parseData[0].lat),
                longitude: parseFloat(parseData[0].lon)
              });
            } else {
              resolve(null);
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  },

  async createReport(reportData) {
    const nextId = await dbUtils.getNextAvailableId('laporan_masuk');
    const {
      judul,
      jenis_infrastruktur,
      tanggal_kejadian,
      deskripsi,
      alamat,
      bukti_lampiran,
      user_id
    } = reportData;

    let latitude = null;
    let longitude = null;
    try {
      const geocodeResult = await this.geocodeAddress(alamat);
      if (geocodeResult) {
        latitude = geocodeResult.latitude;
        longitude = geocodeResult.longitude;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }

    const query = {
      text: `INSERT INTO laporan_masuk 
             (id, judul, jenis_infrastruktur, tanggal_kejadian, deskripsi, alamat, bukti_lampiran, user_id, latitude, longitude) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
             RETURNING *`,
      values: [
        nextId,
        judul,
        jenis_infrastruktur,
        tanggal_kejadian,
        deskripsi,
        alamat,
        bukti_lampiran,
        user_id,
        latitude,
        longitude
      ]
    };

    try {
      const result = await db.query(query);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async updateReport(reportData) {
    const {
      id,
      judul,
      jenis_infrastruktur,
      tanggal_kejadian,
      deskripsi,
      alamat,
      bukti_lampiran
    } = reportData;

    let latitude = null;
    let longitude = null;
    try {
      const geocodeResult = await this.geocodeAddress(alamat);
      if (geocodeResult) {
        latitude = geocodeResult.latitude;
        longitude = geocodeResult.longitude;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }

    const query = {
      text: `UPDATE laporan_masuk 
             SET judul = $1, 
                 jenis_infrastruktur = $2, 
                 tanggal_kejadian = $3, 
                 deskripsi = $4, 
                 alamat = $5, 
                 bukti_lampiran = $6,
                 latitude = $7,
                 longitude = $8 
             WHERE id = $9 
             RETURNING *`,
      values: [
        judul,
        jenis_infrastruktur,
        tanggal_kejadian,
        deskripsi,
        alamat,
        bukti_lampiran,
        latitude,
        longitude,
        id
      ]
    };

    try {
      const result = await db.query(query);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getReportsNearLocation(latitude, longitude, radius = 10) {
    const query = {
      text: `
        SELECT *, 
        (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * 
        cos(radians(longitude) - radians($2)) + 
        sin(radians($1)) * sin(radians(latitude)))) AS distance 
        FROM laporan_masuk
        WHERE latitude IS NOT NULL AND longitude IS NOT NULL
        HAVING distance < $3
        ORDER BY distance
      `,
      values: [latitude, longitude, radius]
    };

    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
  async getIncomingReports() {
    try {
      const query = `
            SELECT 
                lm.id,
                lm.judul,
                lm.jenis_infrastruktur,
                lm.tanggal_kejadian,
                lm.deskripsi,
                lm.alamat,
                lm.status,
                lm.created_at,
                u.nama as nama_pelapor
            FROM laporan_masuk lm
            JOIN users u ON lm.user_id = u.id
            WHERE lm.status = 'pending'
            ORDER BY lm.created_at DESC
        `;

      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error in getIncomingReports:', error);
      throw error;
    }
  },

  async getReportDetail(id) {
    try {
      if (!id) {
        throw new Error('ID is required');
      }

      const query = `
          SELECT 
              lm.id,
              lm.judul,
              lm.jenis_infrastruktur,
              lm.tanggal_kejadian,
              lm.deskripsi,
              lm.alamat,
              lm.bukti_lampiran,
              lm.status,
              lm.created_at,
              lm.latitude,  
              lm.longitude,
              u.nama as nama_pelapor
          FROM laporan_masuk lm
          JOIN users u ON lm.user_id = u.id
          WHERE lm.id = $1
      `;

      const result = await db.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error('Report not found');
      }
      return result.rows[0];
    } catch (error) {
      console.error('Error in getReportDetail:', error);
      throw error;
    }
  },

  async getReportsByUserId(userId) {
    try {
      const query = {
        text: `
              SELECT 
                  lm.id,
                  lm.judul,
                  lm.jenis_infrastruktur,
                  lm.tanggal_kejadian,
                  lm.deskripsi,
                  lm.alamat,
                  lm.bukti_lampiran,
                  lm.status,
                  lm.created_at,
                  lm.latitude,
                  lm.longitude,
                  u.nama as nama_pelapor
              FROM laporan_masuk lm
              JOIN users u ON lm.user_id = u.id
              WHERE lm.user_id = $1 
              ORDER BY lm.created_at DESC
          `,
        values: [userId]
      };

      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error in getReportsByUserId:', error);
      throw error;
    }
  },

  async deleteReport(id) {
    try {
      const query = {
        text: 'DELETE FROM laporan_masuk WHERE id = $1 RETURNING *',
        values: [id]
      };

      const result = await db.query(query);

      if (result.rows.length === 0) {
        throw new Error('Laporan tidak ditemukan');
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getAllReports() {
    try {
      const query = `
        SELECT 
            lm.id,
            lm.judul,
            lm.jenis_infrastruktur,
            lm.tanggal_kejadian,
            lm.deskripsi,
            lm.alamat,
            lm.status,
            lm.created_at,
            u.nama as nama_pelapor
        FROM laporan_masuk lm
        JOIN users u ON lm.user_id = u.id
        ORDER BY lm.created_at DESC
    `;

      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error in getAllReports:', error);
      throw error;
    }
  }



};

module.exports = ReportModel;