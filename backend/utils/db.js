require('dotenv').config();
const mysql = require('mysql2');

// A pool recovers from errors and reconnects automatically.
// dateStrings: true returns DATE columns as 'YYYY-MM-DD' text (no timezone shifts).
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'equipment_db',
  port: process.env.DB_PORT || 3306,
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 10
});

db.getConnection((err, conn) => {
  if (err) {
    console.error('DB connection error:', err.message);
  } else {
    console.log('MySQL connected');
    conn.release();
  }
});

module.exports = db;