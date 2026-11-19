const db = require('./db');

// Lets the model use async/await with the callback-style mysql2 pool.
module.exports = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => (err ? reject(err) : resolve(results)));
  });