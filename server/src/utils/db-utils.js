const db = require('../config/database');

const dbUtils = {
  async getNextAvailableId(tableName) {
    try {
      const query = `
        SELECT i AS next_id
        FROM generate_series(1, (SELECT COALESCE(MAX(id), 0) + 1 FROM ${tableName})) i
        WHERE i NOT IN (SELECT id FROM ${tableName})
        ORDER BY i
        LIMIT 1
      `;
      const result = await db.query(query);
      return result.rows[0].next_id;
    } catch (error) {
      console.error(`Error getting next available ID for ${tableName}:`, error);
      throw error;
    }
  }
};

module.exports = dbUtils;