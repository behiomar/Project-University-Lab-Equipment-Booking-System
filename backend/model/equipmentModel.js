const pool = require('../utils/db');

exports.findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM equipment ORDER BY id DESC');
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM equipment WHERE id = ?', [id]);
  return rows[0] || null;
};

exports.create = async ({ name, category, description, quantity, status, image }) => {
  const [result] = await pool.query(
    `INSERT INTO equipment (name, category, description, quantity, status, image)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, category, description, quantity, status, image]
  );
  return exports.findById(result.insertId);
};

exports.update = async (id, { name, category, description, quantity, status, image }) => {
  await pool.query(
    `UPDATE equipment
     SET name = ?, category = ?, description = ?, quantity = ?, status = ?, image = ?
     WHERE id = ?`,
    [name, category, description, quantity, status, image, id]
  );
  return exports.findById(id);
};

exports.remove = async (id) => {
  const [result] = await pool.query('DELETE FROM equipment WHERE id = ?', [id]);
  return result.affectedRows > 0;
};