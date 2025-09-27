const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../config/database');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM user WHERE email = $1', [email]);
        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!user || !isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Ungültige Anmeldedaten' });
        }

        const token = jwt.sign({
            userId: user.id,
            email: user.email
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            success: true,
            message: 'Anmeldung erfolgreich',
            token
        });
    } catch (error) {
        console.error('Login-Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;