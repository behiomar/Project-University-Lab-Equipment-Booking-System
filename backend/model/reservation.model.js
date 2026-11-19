const query = require('../utils/query');

// First active reservation that overlaps the requested range, or undefined.
// Two ranges overlap when existing.start < new.end AND existing.end > new.start.
// excludeId lets an update ignore the reservation being edited.
exports.findConflict = async (equipmentId, start, end, excludeId = 0) => {
  const rows = await query(
    `SELECT id FROM reservations
     WHERE equipment_id = ? AND status = 'active' AND id <> ?
       AND start_date < ? AND end_date > ?
     LIMIT 1`,
    [equipmentId, excludeId, end, start]
  );
  return rows[0];
};

exports.create = async (userId, equipmentId, start, end) => {
  const result = await query(
    `INSERT INTO reservations (user_id, equipment_id, start_date, end_date)
     VALUES (?, ?, ?, ?)`,
    [userId, equipmentId, start, end]
  );
  return result.insertId;
};

exports.findById = async (id) => {
  const rows = await query('SELECT * FROM reservations WHERE id = ?', [id]);
  return rows[0];
};

// "My Active Reservations" for one user
exports.findActiveByUser = (userId) =>
  query(
    `SELECT r.*, e.name AS equipment_name
     FROM reservations r
     LEFT JOIN equipment e ON e.id = r.equipment_id
     WHERE r.user_id = ? AND r.status = 'active'
     ORDER BY r.start_date`,
    [userId]
  );

// Every reservation of every user
exports.findAll = () =>
  query(
    `SELECT r.*, e.name AS equipment_name
     FROM reservations r
     LEFT JOIN equipment e ON e.id = r.equipment_id
     ORDER BY r.start_date DESC`
  );

exports.updateDates = (id, start, end) =>
  query('UPDATE reservations SET start_date = ?, end_date = ? WHERE id = ?', [start, end, id]);

exports.remove = (id) =>
  query('DELETE FROM reservations WHERE id = ?', [id]);