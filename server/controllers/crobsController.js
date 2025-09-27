const pool = require('../config/database');

class CrobsController {
    static async getAllCrobsbyName(name) {
        const result = await pool.query('SELECT * FROM crobs Where name ILIKE $1', [`%${name}%`]);
        return result.rows;
    }
    static async getAllCrobs() {
        const result = await pool.query('SELECT * FROM crobs');
        return result.rows;
    }
}

module.exports = CrobsController;
