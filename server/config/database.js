const { Pool } = require('pg');
require('dotenv').config({ path: './config.env' });

const pool = new Pool({ 
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT,
});

// Search Path setzen damit "crobs" gefunden wird
pool.on('connect', (client) => {
    client.query('SET search_path TO crobs, public');
});

// Debug - zeige die geladene Konfiguration
console.log('DB Config:', {
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
});

pool.connect()
    .then(() => console.log('Datenbankverbindung erfolgreich'))
    .catch(err => console.error('Datenbankverbindung fehlgeschlagen:', err));

module.exports = pool;