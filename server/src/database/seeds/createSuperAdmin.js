require('dotenv').config({ path: '.env' });
const bcrypt = require('bcrypt');
const pool = require('../../config/database');

async function createSuperAdmin() {
  // Validasi environment variables
  const requiredEnvVars = [
    'SUPER_ADMIN_NAME',
    'SUPER_ADMIN_EMAIL',
    'SUPER_ADMIN_PASSWORD'
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const checkQuery = 'SELECT * FROM admins WHERE role = $1';
    const existingSuperAdmin = await client.query(checkQuery, ['superadmin']);

    if (existingSuperAdmin.rows.length === 0) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        process.env.SUPER_ADMIN_PASSWORD,
        saltRounds
      );

      const insertQuery = `
        INSERT INTO admins (nama, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, nama, email, role`;

      const values = [
        process.env.SUPER_ADMIN_NAME,
        process.env.SUPER_ADMIN_EMAIL,
        hashedPassword,
        'superadmin'
      ];

      const result = await client.query(insertQuery, values);
      console.log('Superadmin berhasil dibuat:', {
        id: result.rows[0].id,
        nama: result.rows[0].nama,
        email: result.rows[0].email,
        role: result.rows[0].role
      });
    } else {
      console.log('Superadmin sudah ada');
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating superadmin:', error);
    throw error;
  } finally {
    client.release();
  }
}

createSuperAdmin()
  .then(() => {
    console.log('Script selesai dijalankan');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script error:', error.message);
    process.exit(1);
  });