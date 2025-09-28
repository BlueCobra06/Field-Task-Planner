const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authenticateToken = require('../models/auth');

router.post('/crobs', authenticateToken, async (req, res) => {
    try {
        const { selectedFruitIds } = req.body;
        const userId = req.user.userId;

        await pool.query('DELETE FROM selected WHERE user_id=$1', [userId]);

        if (selectedFruitIds && selectedFruitIds.length > 0) {
            for (const fruitId of selectedFruitIds) {
                await pool.query('INSERT INTO selected (user_id, crop_id) VALUES ($1, $2)', [userId, fruitId]);
            }
        }

        res.json({ success: true, message: 'Crobs erfolgreich zugewiesen' });
    } catch (error) {
        console.error('Fehler beim Speichern der Crobs:', error);
        res.status(500).json({ success: false, message: 'Serverfehler' });
    }
});

router.get('/crobs', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await pool.query(
            `SELECT c.* 
             FROM crobs c
             JOIN selected s ON c.id = s.crop_id
             WHERE s.user_id = $1`,
            [userId]
        );

        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Fehler beim Abrufen der Crobs:', error);
        res.status(500).json({ success: false, message: 'Serverfehler' });
    }
});

module.exports = router;