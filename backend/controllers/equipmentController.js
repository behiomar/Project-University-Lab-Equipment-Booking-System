const Equipment = require('../model/equipmentModel');
const { deleteImage } = require('../utils/upload');

const isValidId = (id) => Number.isInteger(Number(id)) && Number(id) > 0;
const validStatus = ['Available', 'Unavailable'];

exports.getAll = async (req, res) => {
  try {
    res.json(await Equipment.findAll());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const item = await Equipment.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Equipment not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, category, description, quantity, status } = req.body;

    if (!name || !category || !description) {
      if (req.file) deleteImage(req.file.filename);
      return res
        .status(400)
        .json({ message: 'name, category and description are required' });
    }

    const qty = Number(quantity) || 0;
    if (qty < 0) {
      if (req.file) deleteImage(req.file.filename);
      return res.status(400).json({ message: 'quantity must be >= 0' });
    }

    const item = await Equipment.create({
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      quantity: qty,
      status: validStatus.includes(status) ? status : 'Available',
      image: req.file ? req.file.filename : null
    });

    res.status(201).json(item);
  } catch (err) {
    if (req.file) deleteImage(req.file.filename);
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      if (req.file) deleteImage(req.file.filename);
      return res.status(400).json({ message: 'Invalid id' });
    }

    const existing = await Equipment.findById(req.params.id);
    if (!existing) {
      if (req.file) deleteImage(req.file.filename);
      return res.status(404).json({ message: 'Equipment not found' });
    }

    const { name, category, description, quantity, status } = req.body;

    const updated = await Equipment.update(req.params.id, {
      name: name ?? existing.name,
      category: category ?? existing.category,
      description: description ?? existing.description,
      quantity: quantity !== undefined ? Number(quantity) : existing.quantity,
      status: validStatus.includes(status) ? status : existing.status,
      image: req.file ? req.file.filename : existing.image
    });

    if (req.file) deleteImage(existing.image);

    res.json(updated);
  } catch (err) {
    if (req.file) deleteImage(req.file.filename);
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const existing = await Equipment.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Equipment not found' });

    await Equipment.remove(req.params.id);
    deleteImage(existing.image);

    res.json({ message: 'Equipment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};