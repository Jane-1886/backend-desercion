
import db from '../src/config/db.js';

export const getAllAprendices = async () => {
  const [rows] = await db.query('SELECT * FROM Aprendices');
  return rows;
};

export const insertAprendiz = async (Nombre, Apellido, Estado) => {
  const query = 'INSERT INTO Aprendices (Nombre, Apellido, Estado) VALUES (?, ?, ?)';
  const [result] = await db.query(query, [Nombre, Apellido, Estado]);
  return result;
};

export const getAprendizById = async (id) => {
  const [rows] = await db.query('SELECT * FROM Aprendices WHERE ID_Aprendiz = ?', [id]);
  return rows[0];
};

export const updateAprendiz = async (id, Nombre, Apellido, Estado) => {
  const query = 'UPDATE Aprendices SET Nombre = ?, Apellido = ?, Estado = ? WHERE ID_Aprendiz = ?';
  await db.query(query, [Nombre, Apellido, Estado, id]);
};

export const deleteAprendiz = async (id) => {
  const query = 'DELETE FROM Aprendices WHERE ID_Aprendiz = ?';
  await db.query(query, [id]);
};
