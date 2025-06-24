
import db from '../config/db.js';

/**
 * 📄 Obtener todos los aprendices
 */
export const getAllAprendices = async () => {
  const [rows] = await db.query('SELECT * FROM Aprendices');
  return rows;
};

/**
 * ➕ Insertar un nuevo aprendiz
 * @param {string} Nombre 
 * @param {string} Apellido 
 * @param {string} Estado 
 */
export const insertAprendiz = async (Nombre, Apellido, Estado) => {
  const query = 'INSERT INTO Aprendices (Nombre, Apellido, Estado) VALUES (?, ?, ?)';
  const [result] = await db.query(query, [Nombre, Apellido, Estado]);
  return result.insertId;
};

/**
 * 🔍 Buscar aprendiz por ID
 * @param {number} id 
 */
export const getAprendizById = async (id) => {
  const [rows] = await db.query('SELECT * FROM Aprendices WHERE ID_Aprendiz = ?', [id]);
  return rows[0];
};

/**
 * ✏️ Actualizar aprendiz por ID
 * @param {number} id 
 * @param {string} Nombre 
 * @param {string} Apellido 
 * @param {string} Estado 
 */
export const updateAprendiz = async (id, Nombre, Apellido, Estado) => {
  const query = 'UPDATE Aprendices SET Nombre = ?, Apellido = ?, Estado = ? WHERE ID_Aprendiz = ?';
  await db.query(query, [Nombre, Apellido, Estado, id]);
};

/**
 * ❌ Eliminar aprendiz por ID
 * @param {number} id 
 */
export const deleteAprendiz = async (id) => {
  const query = 'DELETE FROM Aprendices WHERE ID_Aprendiz = ?';
  await db.query(query, [id]);
};
