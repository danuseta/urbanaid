const pool = require('../config/database');
const dbUtils = require('../utils/db-utils');

class UserModel {
  static async findByEmail(email) {
    try {
      console.log('Finding user by email:', email);
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      console.log('User found:', result.rowCount > 0);
      return result.rows[0];
    } catch (err) {
      console.error('Error finding user by email:', err);
      throw err;
    }
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create({ nama, email, password }) {
    const nextId = await dbUtils.getNextAvailableId('users');
    const query = `
      INSERT INTO users (id, nama, email, password, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nama, email, role`;
    const result = await pool.query(query, [nextId, nama, email, password, 'user']);
    return result.rows[0];
  }

  static async getAllUsers() {
    const query = 'SELECT id, nama, email, role, created_at FROM users WHERE role = $1';
    const result = await pool.query(query, ['user']);
    return result.rows;
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 AND role = $2 RETURNING *';
    const result = await pool.query(query, [id, 'user']);
    return result.rows[0];
  }

  static async update(id, { nama, email }) {
    const query = `
      UPDATE users 
      SET nama = $1, email = $2
      WHERE id = $3 AND role = $4
      RETURNING id, nama, email, role`;
    const result = await pool.query(query, [nama, email, id, 'user']);
    return result.rows[0];
  }

  static async updatePassword(id, hashedPassword) {
    const query = `
      UPDATE users 
      SET password = $1
      WHERE id = $2 AND role = $3
      RETURNING id`;
    const result = await pool.query(query, [hashedPassword, id, 'user']);
    return result.rows[0];
  }
}

module.exports = UserModel;