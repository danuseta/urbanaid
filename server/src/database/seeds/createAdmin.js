require('dotenv').config({ path: '.env' });
const bcrypt = require('bcrypt');
const pool = require('../../config/database');

async function seedAdmin() {
  // Validasi environment variables
  const requiredEnvVars = [
    'ADMIN_NAME',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD'
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

    const checkQuery = 'SELECT * FROM admins WHERE email = $1';
    const existingAdmin = await client.query(checkQuery, [process.env.ADMIN_EMAIL]);

    if (existingAdmin.rows.length === 0) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        saltRounds
      );

      const insertQuery = `
        INSERT INTO admins (nama, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, nama, email, role`;
      const values = [
        process.env.ADMIN_NAME,
        process.env.ADMIN_EMAIL,
        hashedPassword,
        'admin'
      ];

      const result = await client.query(insertQuery, values);
      console.log('Admin berhasil dibuat:', {
        id: result.rows[0].id,
        nama: result.rows[0].nama,
        email: result.rows[0].email,
        role: result.rows[0].role
      });
    } else {
      console.log('Admin dengan email tersebut sudah ada');
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating admin:', error);
    throw error;
  } finally {
    client.release();
  }
}

seedAdmin()
  .then(() => {
    console.log('Seed selesai dijalankan');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script error:', error.message);
    process.exit(1);
  });
