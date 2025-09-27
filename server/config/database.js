const path = require('path');
const envPath = path.resolve(__dirname, '../config.env');
require('dotenv').config({path: envPath});
const { Pool } = require('pg');

const pool = new Pool({ 
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT,
});

pool.on('connect', async (client) => {
    try {
        await client.query('SET search_path TO crobs, public');
        console.log('Search path set to crobs schema');
    } catch (err) {
        console.error('Error setting search_path:', err);
    }
});

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('Database connection successful');
        
        const crobs = await client.query('SELECT COUNT(*) FROM crobs');
        console.log('Table accessible, rows:', crobs.rows[0].count);

        const user = await client.query('SELECT COUNT(*) FROM user');
        console.log('Table accessible, rows:', user.rows[0].count);
        
        client.release();
    } catch (err) {
        console.error('Database connection failed:', err.message);
    }
}

testConnection();

module.exports = pool;