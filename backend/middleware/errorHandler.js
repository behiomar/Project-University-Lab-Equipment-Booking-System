const multer = require('multer');

module.exports = (err, req, res, next) => {
  console.error('API ERROR:', err.message);

  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Image is too large (max 20MB)'
        : err.message;
    return res.status(400).json({ message });
  }

  if (err) {
    return res.status(400).json({ message: err.message || 'Something went wrong' });
  }
  next();
};