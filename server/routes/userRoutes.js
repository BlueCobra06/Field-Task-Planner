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

router.get('/tasks', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await pool.query(
            `SELECT * FROM tasks WHERE user_id = $1`,
            [userId]
        );

        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Fehler beim Abrufen der Aufgaben:', error);
        res.status(500).json({ success: false, message: 'Serverfehler' });
    }
});

router.post('/tasks/create', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { text } = req.body;
        const result = await pool.query('INSERT INTO tasks (user_id, tasks) VALUES ($1, $2) RETURNING *', [userId, text]);

        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Fehler beim Erstellen der Aufgabe:', error);
        res.status(500).json({ success: false, message: 'Serverfehler' });
    }
});

router.delete('/tasks/delete/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Aufgabe nicht gefunden' });
        }

        res.json({ success: true, data: result.rows });
    } catch(error) {
        console.log(error);
    }
});

router.patch('/tasks/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const { completed } = req.body;

        const result = await pool.query(
            'UPDATE tasks SET completed = $1 WHERE id = $2 AND user_id = $3 RETURNING *', 
            [completed, id, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Aufgabe nicht gefunden' });
        }   

        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Aufgabe:', error);
        res.status(500).json({ success: false, message: 'Serverfehler' });
    }
});

module.exports = router;