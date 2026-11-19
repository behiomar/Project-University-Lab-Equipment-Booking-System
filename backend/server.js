require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Allow the Angular app (and anything else you list here) to call this API.
// For quick tests you can use app.use(cors()) to allow every origin.
app.use(cors({ origin: ['http://localhost:4200'] }));
app.use(express.json());

// Serves public/test.html at http://localhost:3000/test.html
app.use(express.static('public'));

// TEMPORARY fake login. Delete this block when Student 1's auth middleware is ready
// and enable `router.use(authenticate)` in the reservation router instead.
app.use((req, res, next) => {
  req.user = { id: 1, role: 'student' };
  next();
});

app.use('/api/reservations', require('./router/reservation.router'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));