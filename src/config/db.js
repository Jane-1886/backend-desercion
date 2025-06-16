// Importar mysql2 para conectarse a la base de datos
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar variables de entorno (.env)
dotenv.config();

// Crear un pool de conexión a MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

export default db;
