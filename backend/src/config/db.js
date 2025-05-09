require('dotenv').config();

const mysql = require('mysql2/promise');

console.log('DB Config: Reading environment variables...');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '*** (password is set)' : '*** (password not set)');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB Config: Creating connection pool...');


const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smanet_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection()
  .then(connection => {
    console.log('DB Config: Database connection pool created and tested successfully!');
    connection.release();
  })
  .catch(error => {
    console.error('DB Config: Failed to create or test database connection pool!', error);
  });


module.exports = pool;