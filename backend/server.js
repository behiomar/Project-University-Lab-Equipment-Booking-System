require('dotenv').config();
const express = require('express');
const cors = require('cors');

const pool = require('./utils/db');
const equipmentRoutes = require('./router/EquipmentRoutes');
const errorHandler = require('./middleware/errorHandler');
const { uploadDir } = require('./utils/upload');

const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.use('/uploads', express.static(uploadDir));
app.use('/api/equipment', equipmentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

pool
  .getConnection()
  .then((conn) => {
    conn.release();
    console.log('MySQL connected (equipment_db)');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error('MySQL connection error:', err.message));