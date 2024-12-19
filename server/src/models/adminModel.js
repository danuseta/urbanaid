const pool = require('../config/database');
const dbUtils = require('../utils/db-utils');

class AdminModel {
  static async findByEmail(email) {
    try {
      console.log('Finding admin by email:', email);
      const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
      console.log('Admin found:', result.rowCount > 0);
      return result.rows[0];
    } catch (err) {
      console.error('Error finding admin by email:', err);
      throw err;
    }
  }

  static async updateLastLogin(id) {
    const query = `
      UPDATE admins 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE id = $1
      RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM admins WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create({ nama, email, password, role }) {
    const nextId = await dbUtils.getNextAvailableId('admins');
    const query = `
      INSERT INTO admins (id, nama, email, password, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nama, email, role`;
    const result = await pool.query(query, [nextId, nama, email, password, role]);
    return result.rows[0];
  }

  static async getAllAdmins() {
    const query = 'SELECT id, nama, email, role, created_at, last_login FROM admins WHERE role = $1';
    const result = await pool.query(query, ['admin']);
    return result.rows;
  }

  static async delete(id) {
    const query = 'DELETE FROM admins WHERE id = $1 AND role = $2 RETURNING *';
    const result = await pool.query(query, [id, 'admin']);
    return result.rows[0];
  }

  static async update(id, { nama, email, password }) {
    try {
      let query;
      let params;

      if (!email) {
        throw new Error('Email is required');
      }

      console.log('Updating admin with data:', { nama, email, hasPassword: !!password });

      if (password) {
        query = `
          UPDATE admins 
          SET nama = $1, email = $2, password = $3
          WHERE id = $4
          RETURNING id, nama, email, role`;
        params = [nama, email, password, id];
      } else {
        query = `
          UPDATE admins 
          SET nama = $1, email = $2
          WHERE id = $3
          RETURNING id, nama, email, role`;
        params = [nama, email, id];
      }

      const result = await pool.query(query, params);

      if (result.rows.length === 0) {
        throw new Error('Admin not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error in AdminModel.update:', error);
      throw error;
    }
  }


}

module.exports = AdminModel;