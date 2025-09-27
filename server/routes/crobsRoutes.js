const express = require('express');
const router = express.Router();
const CrobsController = require('../controllers/crobsController');

router.get('/crobsbyName', async (req, res) => {
    try {
        const name = req.query.name;
        const crobs = await CrobsController.getAllCrobsbyName(name);
        res.json({ success: true, data: crobs });
    } catch (error) {
        console.error('Backend-Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

router.get('/allcrobs', async (req, res) => {
    try {
        const crobs = await CrobsController.getAllCrobs();
        res.json({ success: true, data: crobs });
    } catch (error) {
        console.error('Backend-Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
})

module.exports = router;