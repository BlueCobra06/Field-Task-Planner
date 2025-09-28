const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Alle Felder sind erforderlich' 
            });
        }

        const existingUser = await pool.query(
            'SELECT id FROM benutzer WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'E-Mail bereits registriert'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await pool.query(
            'INSERT INTO benutzer (firstname, lastname, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, firstname, lastname, email',
            [firstname, lastname, email, hashedPassword]
        );

        const newUser = result.rows[0];

        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            success: true,
            message: 'Benutzer erfolgreich registriert',
            user: {
                id: newUser.id,
                email: newUser.email,
                firstName: newUser.firstname,
                lastName: newUser.lastname
            },
            token
        });
    } catch (error) {
        console.error('Fehler bei der Registrierung:', error);
        res.status(500).json({
            success: false,
            message: 'Serverfehler bei der Registrierung'
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            'SELECT id, firstname, lastname, email, password_hash FROM crobs.benutzer WHERE email=$1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Ungültige E-Mail oder Passwort'
            });
        }

        const user = result.rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Ungültige E-Mail oder Passwort'
            });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            message: 'Erfolgreich eingeloggt',
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
            },
            token
        });
    } catch (error) {
        console.error('Fehler beim Login:', error);
        res.status(500).json({
            success: false,
            message: 'Serverfehler beim Login'
        });
    }
});


module.exports = router;