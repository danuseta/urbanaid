const db = require('../config/database');

const superAdminModel = {
  async getAllAdmins(page = 1, limit = 10, search = '') {
    try {
      let query = `
            SELECT id, nama, email, role, created_at, last_login 
            FROM admins 
            WHERE 1=1
            `;

      const values = [];

      if (search) {
        query += ' AND (nama ILIKE $1 OR email ILIKE $1)';
        values.push(`%${search}%`);
      }

      const countResult = await db.query(
        `SELECT COUNT(*) FROM (${query}) as count_query`,
        values
      );
      const total = parseInt(countResult.rows[0].count);

      const offset = (page - 1) * limit;
      query += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
      values.push(limit, offset);

      const result = await db.query(query, values);

      return {
        data: result.rows,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      };

    } catch (error) {
      console.error('Error in getAllAdmins:', error);
      throw error;
    }
  },

  async getAdminById(id) {
    try {
      const query = `
                SELECT id, nama, email, role, created_at 
                FROM admins 
                WHERE id = $1
            `;
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in getAdminById:', error);
      throw error;
    }
  },

  async createAdmin(adminData) {
    const { nama, email, password, role = 'admin' } = adminData;

    try {
      const query = `
                INSERT INTO admins (nama, email, password, role)
                VALUES ($1, $2, $3, $4)
                RETURNING id, nama, email, role, created_at
            `;
      const result = await db.query(query, [nama, email, password, role]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in createAdmin:', error);
      throw error;
    }
  },

  async getUserAllReports(userId) {
    try {
      const activeLaporanQuery = `
                SELECT 
                    id,
                    judul,
                    jenis_infrastruktur,
                    deskripsi,
                    status,
                    tanggal_kejadian,
                    created_at,
                    'aktif' as jenis_laporan
                FROM laporan_masuk
                WHERE user_id = $1
            `;

      const riwayatLaporanQuery = `
                SELECT 
                    id,
                    judul,
                    jenis_infrastruktur,
                    deskripsi,
                    status,
                    tanggal_kejadian,
                    tanggal_selesai,
                    keterangan_laporan,
                    created_at,
                    'riwayat' as jenis_laporan
                FROM riwayat_laporan
                WHERE user_id = $1
            `;

      const query = `
                (${activeLaporanQuery})
                UNION ALL
                (${riwayatLaporanQuery})
                ORDER BY created_at DESC
            `;

      const result = await db.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error in getUserAllReports:', error);
      throw error;
    }
  },

  async updateAdmin(id, updateData) {
    const { nama, email, password, role } = updateData;

    try {
      let query;
      let values;

      if (password) {
        query = `
                    UPDATE admins 
                    SET nama = $1, email = $2, password = $3, role = $4
                    WHERE id = $5 
                    RETURNING id, nama, email, role, created_at
                `;
        values = [nama, email, password, role, id];
      } else {
        query = `
                    UPDATE admins 
                    SET nama = $1, email = $2, role = $3
                    WHERE id = $4
                    RETURNING id, nama, email, role, created_at
                `;
        values = [nama, email, role, id];
      }

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error in updateAdmin:', error);
      throw error;
    }
  },

  async deleteAdmin(id) {
    try {
      const query = `
                DELETE FROM admins 
                WHERE id = $1 AND role != 'superadmin'
                RETURNING id
            `;
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in deleteAdmin:', error);
      throw error;
    }
  },

  async getAllUsers(page = 1, limit = 10, search = '') {
    try {
      let query = `
                    SELECT 
                        u.id, 
                        u.nama, 
                        u.email, 
                        u.created_at,
                        (COUNT(DISTINCT r.id) + COUNT(DISTINCT l.id)) as total_laporan
                    FROM users u
                    LEFT JOIN riwayat_laporan r ON u.id = r.user_id
                    LEFT JOIN laporan_masuk l ON u.id = l.user_id
                    WHERE u.role = 'user'
            `;

      const values = [];

      if (search) {
        query += ' AND (u.nama ILIKE $1 OR u.email ILIKE $1)';
        values.push(`%${search}%`);
      }

      query += ' GROUP BY u.id';

      const countResult = await db.query(
        `SELECT COUNT(*) FROM (${query}) as count_query`,
        values
      );
      const total = parseInt(countResult.rows[0].count);

      const offset = (page - 1) * limit;
      query += ` ORDER BY u.created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
      values.push(limit, offset);

      const result = await db.query(query, values);

      return {
        data: result.rows,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      };

    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
  },

  async getUserById(id) {
    try {
      const query = `
                SELECT u.id, u.nama, u.email, u.created_at,
                       COUNT(DISTINCT r.id) as total_laporan
                FROM users u
                LEFT JOIN riwayat_laporan r ON u.id = r.user_id
                WHERE u.id = $1 AND u.role = 'user'
                GROUP BY u.id
            `;
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in getUserById:', error);
      throw error;
    }
  },

  async getUserReports(userId) {
    try {
      const query = `
            (
                SELECT 
                    id,
                    judul,
                    jenis_infrastruktur,
                    deskripsi,
                    status,
                    tanggal_kejadian,
                    NULL as tanggal_selesai,
                    NULL as keterangan_laporan,
                    created_at,
                    'aktif' as jenis_laporan
                FROM laporan_masuk 
                WHERE user_id = $1
            )
            UNION ALL
            (
                SELECT 
                    id,
                    judul,
                    jenis_infrastruktur,
                    deskripsi,
                    status,
                    tanggal_kejadian,
                    tanggal_selesai,
                    keterangan_laporan,
                    created_at,
                    'riwayat' as jenis_laporan
                FROM riwayat_laporan
                WHERE user_id = $1
            )
            ORDER BY created_at DESC
        `;
      const result = await db.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error in getUserReports:', error);
      throw error;
    }
  },

  async updateUser(id, updateData) {
    const { nama, email, password } = updateData;

    try {
      let query;
      let values;

      if (password) {
        query = `
                    UPDATE users 
                    SET nama = $1, email = $2, password = $3
                    WHERE id = $4 AND role = 'user'
                    RETURNING id, nama, email, created_at
                `;
        values = [nama, email, password, id];
      } else {
        query = `
                    UPDATE users 
                    SET nama = $1, email = $2
                    WHERE id = $3 AND role = 'user'
                    RETURNING id, nama, email, created_at
                `;
        values = [nama, email, id];
      }

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  },

  async deleteUser(id) {
    try {
      await db.query('BEGIN');

      await db.query('DELETE FROM laporan_masuk WHERE user_id = $1', [id]);
      await db.query('DELETE FROM riwayat_laporan WHERE user_id = $1', [id]);

      const query = `
                DELETE FROM users 
                WHERE id = $1 AND role = 'user'
                RETURNING id
            `;
      const result = await db.query(query, [id]);

      await db.query('COMMIT');

      return result.rows[0];
    } catch (error) {
      await db.query('ROLLBACK');
      console.error('Error in deleteUser:', error);
      throw error;
    }
  },

  async getUserStatistics() {
    try {
      const query = `
                SELECT 
                    (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
                    (SELECT COUNT(*) FROM laporan_masuk) as total_reports,
                    (SELECT COUNT(*) FROM laporan_masuk WHERE status = 'pending') as pending_reports,
                    (SELECT COUNT(*) FROM riwayat_laporan) as processed_reports
            `;
      const result = await db.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error in getUserStatistics:', error);
      throw error;
    }
  }
};

module.exports = superAdminModel;