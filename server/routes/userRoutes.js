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

router.post('/crobs/delete', authenticateToken, async (req, res) => {
    try {
        const { fruitIdsToDelete } = req.body;
        const userId = req.user.userId;

        if (fruitIdsToDelete && fruitIdsToDelete.length > 0) {
            for (const fruitId of fruitIdsToDelete) {
                await pool.query('DELETE FROM selected WHERE user_id=$1 AND crop_id=$2', [userId, fruitId]);
            }
        }

        res.json({ success: true, message: 'Crobs erfolgreich entfernt' });
    } catch (error) {
        console.error('Fehler beim Entfernen der Crobs:', error);
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

router.get('/crobs/:cropId/details', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { cropId } = req.params;
        
        const result = await pool.query(
            `SELECT * FROM crop_details WHERE user_id = $1 AND crop_id = $2`,
            [userId, cropId]
        );

        res.json({ 
            success: true, 
            data: result.rows.length > 0 ? result.rows[0] : null 
        });
    } catch (error) {
        console.error('Fehler beim Abrufen der Details:', error);
        res.status(500).json({ success: false, message: 'Serverfehler' });
    }
});

router.post('/crobs/:cropId/details', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { cropId } = req.params;
        let { flaeche, standort, aussaatdatum, ernteerwartung, bewaesserung, duenger, notizen } = req.body;

        const toNullIfEmpty = (value) => value === '' || value === undefined ? null : value;

        flaeche = toNullIfEmpty(flaeche);
        standort = toNullIfEmpty(standort);
        aussaatdatum = toNullIfEmpty(aussaatdatum);
        ernteerwartung = toNullIfEmpty(ernteerwartung);
        bewaesserung = toNullIfEmpty(bewaesserung) || 'normal'; 
        duenger = toNullIfEmpty(duenger);
        notizen = toNullIfEmpty(notizen);

        const existing = await pool.query(
            `SELECT id FROM crop_details WHERE user_id = $1 AND crop_id = $2`,
            [userId, cropId]
        );

        if (existing.rows.length > 0) {
            await pool.query(
                `UPDATE crop_details 
                 SET flaeche = $1, standort = $2, aussaatdatum = $3, 
                     ernteerwartung = $4, bewaesserung = $5, duenger = $6, 
                     notizen = $7, updated_at = NOW()
                 WHERE user_id = $8 AND crop_id = $9`,
                [flaeche, standort, aussaatdatum, ernteerwartung, bewaesserung, duenger, notizen, userId, cropId]
            );
        } else {
            await pool.query(
                `INSERT INTO crop_details 
                 (user_id, crop_id, flaeche, standort, aussaatdatum, ernteerwartung, bewaesserung, duenger, notizen)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [userId, cropId, flaeche, standort, aussaatdatum, ernteerwartung, bewaesserung, duenger, notizen]
            );
        }

        res.json({ success: true, message: 'Details gespeichert' });
    } catch (error) {
        console.error('Fehler beim Speichern der Details:', error);
        res.status(500).json({ success: false, message: 'Serverfehler' });
    }
});

router.get('/tasks', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await pool.query(
            `SELECT * FROM tasks WHERE user_id = $1 ORDER by completed ASC, 
            Case
                when priority = 'hoch' then 1
                when priority = 'mittel' then 2
                when priority = 'niedrig' then 3
                else 4
            end ASC,
            due_date ASC`,
            
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
        const { text, dueDate } = req.body;
        const result = await pool.query('INSERT INTO tasks (user_id, tasks, due_date) VALUES ($1, $2, $3) RETURNING *', [userId, text, dueDate]);

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