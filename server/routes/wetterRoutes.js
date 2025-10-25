const express = require('express'); 
const router = express.Router();
const authenticateToken = require('../models/auth');
const pool = require('../config/database');

router.get('/data', authenticateToken, async (req, res) => {
    try {
        const ort = req.query.ort;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(ort)}`);
        const data = await response.json();

        if (data.length === 0) {
            return res.json({success: false, message:'Ort nicht gefunden'});
        }

        const lat = data[0].lat;
        const lon = data[0].lon;

        const wetterResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,precipitation_sum,weather_code`);
        const wetterData = await wetterResponse.json();
        
        res.json({success: true, data: wetterData});
    } catch (error) {
        console.log(error);
    }
});

router.get('/location', authenticateToken, async(req, res) => {
    try {
        const userID = req.user.userId;
        const result = await pool.query('SELECT location FROM crobs.benutzer where id = $1', [userID]);

        if (result.rows.length > 0) {
             res.json({ success: true, data: { location: result.rows[0].location } });
        } else {
            res.json({ success: false, message: 'Benutzer nicht gefunden'});
        }
    } catch(error) {
        res.status(500).json({success: false, message: 'Serverfehler'});
    }
});

router.put('/location', authenticateToken, async(req, res) => {
    try {
        const userID = req.user.userId;
        const { location } = req.body;

        const result = await pool.query('UPDATE crobs.benutzer SET location = $1 where id = $2  RETURNING id', [location, userID]);

        if (result.rows.length > 0) {
            res.json({ success: true, message: 'Location erfolgreich gespeichert' });
        } else {
            res.json({ success: false, message: 'Benutzer nicht gefunden' });
        }
    } catch(error) {
        res.status(500).json({success: false, message: 'Serverfehler'});
    }
});

module.exports = router;
