const db = require('../config/database');
const dbUtils = require('../utils/db-utils');

const RiwayatModel = {
  async getRiwayatByUserId(userId) {
    const query = {
      text: `SELECT * FROM riwayat_laporan 
                   WHERE user_id = $1 
                   ORDER BY created_at DESC`,
      values: [userId]
    };

    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async createRiwayat(data) {
    const nextId = await dbUtils.getNextAvailableId('riwayat_laporan');
    const { judul, jenis_infrastruktur, deskripsi, tanggal_kejadian, tanggal_selesai, alamat, status, keterangan_laporan, bukti_lampiran, user_id } = data;

    const query = {
      text: `INSERT INTO riwayat_laporan 
                 (id, judul, jenis_infrastruktur, deskripsi, tanggal_kejadian, tanggal_selesai, alamat, status, keterangan_laporan, bukti_lampiran, user_id) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
                 RETURNING *`,
      values: [nextId, judul, jenis_infrastruktur, deskripsi, tanggal_kejadian, tanggal_selesai, alamat, status, keterangan_laporan, bukti_lampiran, user_id]
    };

    try {
      const result = await db.query(query);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getAllRiwayat() {
    try {
      const result = await db.query('SELECT * FROM riwayat_laporan ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async getRiwayatById(id) {
    const query = {
      text: 'SELECT * FROM riwayat_laporan WHERE id = $1',
      values: [id]
    };

    try {
      const result = await db.query(query);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  transferToRiwayat: async function (reportId, status, keterangan) {
    const client = await db.connect();

    try {
      await client.query('BEGIN');

      const getLaporanQuery = {
        text: 'SELECT * FROM laporan_masuk WHERE id = $1',
        values: [reportId]
      };
      const laporanResult = await client.query(getLaporanQuery);
      const laporan = laporanResult.rows[0];

      if (!laporan) {
        throw new Error('Laporan tidak ditemukan');
      }

      const nextRiwayatId = await dbUtils.getNextAvailableId('riwayat_laporan');

      const insertRiwayatQuery = {
        text: `INSERT INTO riwayat_laporan (
                    id, judul, jenis_infrastruktur, deskripsi, 
                    tanggal_kejadian, tanggal_selesai, alamat, 
                    status, keterangan_laporan, bukti_lampiran, 
                    user_id, latitude, longitude
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
                RETURNING *`,
        values: [
          nextRiwayatId,
          laporan.judul,
          laporan.jenis_infrastruktur,
          laporan.deskripsi,
          laporan.tanggal_kejadian,
          new Date(),
          laporan.alamat,
          status,
          keterangan,
          laporan.bukti_lampiran,
          laporan.user_id,
          laporan.latitude,
          laporan.longitude
        ]
      };

      const riwayatResult = await client.query(insertRiwayatQuery);

      const deleteLaporanQuery = {
        text: 'DELETE FROM laporan_masuk WHERE id = $1',
        values: [reportId]
      };
      await client.query(deleteLaporanQuery);

      await client.query('COMMIT');
      return riwayatResult.rows[0];

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  getRiwayatWithUserDetails: async function (id) {
    const query = {
      text: `
                SELECT 
                    r.*,
                    u.nama as nama_pelapor,
                    u.email as email_pelapor
                FROM riwayat_laporan r
                JOIN users u ON r.user_id = u.id
                WHERE r.id = $1
            `,
      values: [id]
    };

    try {
      const result = await db.query(query);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  getLatestRiwayat: async function (limit = 5) {
    const query = {
      text: `
                SELECT 
                    r.*,
                    u.nama as nama_pelapor
                FROM riwayat_laporan r
                JOIN users u ON r.user_id = u.id
                ORDER BY r.tanggal_selesai DESC
                LIMIT $1
            `,
      values: [limit]
    };

    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
  getAllRiwayatWithUserDetails: async function () {
    const query = {
      text: `
                SELECT 
                    r.*,
                    u.nama as nama_pelapor,
                    u.email as email_pelapor
                FROM riwayat_laporan r
                JOIN users u ON r.user_id = u.id
                ORDER BY r.created_at DESC
            `
    };

    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  getDetailRiwayatWithUser: async function (id) {
    const query = {
      text: `
                SELECT 
                    r.*,
                    u.nama as nama_pelapor,
                    u.email as email_pelapor
                FROM riwayat_laporan r
                JOIN users u ON r.user_id = u.id
                WHERE r.id = $1
            `,
      values: [id]
    };

    try {
      const result = await db.query(query);
      if (result.rows.length === 0) {
        throw new Error('Riwayat tidak ditemukan');
      }
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

};

module.exports = RiwayatModel;