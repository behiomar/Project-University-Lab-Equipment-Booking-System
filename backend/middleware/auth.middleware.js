const jwt = require('jsonwebtoken');

// Reads the header "Authorization: Bearer <token>", verifies it, and sets
// req.user = { id, role } so the controllers can use req.user.id / req.user.role.
// The token must be signed with the same JWT_SECRET (see .env) by Student 1's login.
exports.authenticate = (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Adjust these field names if Student 1's token uses other ones (e.g. userId).
    req.user = { id: Number(payload.id), role: payload.role || 'student' };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Use after authenticate on routes only admins may call.
exports.requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admins only' });
  }
  next();
};