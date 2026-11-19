const Reservation = require('../model/reservation.model');

const validRange = (start, end) =>
  !isNaN(new Date(start)) && !isNaN(new Date(end)) && new Date(start) < new Date(end);

const fail = (res, err) => {
  console.error(err);
  res.status(500).json({ message: err.message });
};

// POST /api/reservations
exports.create = async (req, res) => {
  try {
    const { equipment_id, start_date, end_date } = req.body;
    if (!equipment_id || !validRange(start_date, end_date)) {
      return res.status(400).json({ message: 'Invalid equipment or date range' });
    }
    if (await Reservation.findConflict(equipment_id, start_date, end_date)) {
      return res.status(409).json({ message: 'Equipment already booked for these dates' });
    }
    const id = await Reservation.create(req.user.id, equipment_id, start_date, end_date);
    res.status(201).json({ id, equipment_id, start_date, end_date });
  } catch (err) {
    fail(res, err);
  }
};

// GET /api/reservations/mine
exports.getMine = async (req, res) => {
  try {
    res.json(await Reservation.findActiveByUser(req.user.id));
  } catch (err) {
    fail(res, err);
  }
};

// GET /api/reservations  (all users)
// When auth is enabled, restrict it to admins:
//   if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
exports.getAll = async (req, res) => {
  try {
    res.json(await Reservation.findAll());
  } catch (err) {
    fail(res, err);
  }
};

// GET /api/reservations/:id
exports.getOne = async (req, res) => {
  try {
    const r = await Reservation.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });
    res.json(r);
  } catch (err) {
    fail(res, err);
  }
};

// PUT /api/reservations/:id
exports.update = async (req, res) => {
  try {
    const r = await Reservation.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });
    if (r.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { start_date, end_date } = req.body;
    if (!validRange(start_date, end_date)) {
      return res.status(400).json({ message: 'Invalid date range' });
    }
    if (await Reservation.findConflict(r.equipment_id, start_date, end_date, r.id)) {
      return res.status(409).json({ message: 'Dates conflict with another booking' });
    }
    await Reservation.updateDates(r.id, start_date, end_date);
    res.json({ id: r.id, start_date, end_date });
  } catch (err) {
    fail(res, err);
  }
};

// DELETE /api/reservations/:id
exports.remove = async (req, res) => {
  try {
    const r = await Reservation.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });
    if (r.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await Reservation.remove(r.id);
    res.status(204).send();
  } catch (err) {
    fail(res, err);
  }
};