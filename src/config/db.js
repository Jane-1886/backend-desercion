
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Crear pool de conexión
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

export default db;
