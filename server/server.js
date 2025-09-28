const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const crabsRoutes = require('./routes/crobsRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/crobs', crabsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.listen(port, () => {
    console.log(`Server läuft auf: https://localhost:${port}`);
});

module.exports = app;