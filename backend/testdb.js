const pool = require('./utils/db');

pool.query('SELECT COUNT(*) AS total FROM equipment')
  .then(([rows]) => { console.log('DB OK, equipment rows:', rows[0].total); process.exit(0); })
  .catch((err) => { console.error('DB ERROR:', err.message); process.exit(1); });