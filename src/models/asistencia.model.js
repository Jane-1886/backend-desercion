
// Importamos la conexión a la base de datos
import db from '../config/db.js';

/**
 * Modelo para la tabla 'Asistencia'
 * Permite realizar operaciones CRUD sobre los registros semanales de asistencia de los aprendices.
 */
class Asistencia {
  // Obtener todos los registros de asistencia
  static async obtenerTodas() {
    const [filas] = await db.query('SELECT * FROM Asistencia');
    return filas;
  }

  // Obtener asistencia por ID
  static async obtenerPorId(id) {
    const [filas] = await db.query('SELECT * FROM Asistencia WHERE ID_Asistencia = ?', [id]);
    return filas[0];
  }

  // Crear nuevo registro de asistencia
  static async crear({ idAprendiz, lunes, martes, miercoles, jueves, viernes }) {
    const sql = `
      INSERT INTO Asistencia (ID_Aprendiz, Lunes, Martes, Miércoles, Jueves, Viernes)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [resultado] = await db.query(sql, [idAprendiz, lunes, martes, miercoles, jueves, viernes]);
    return resultado.insertId;
  }

  // Actualizar asistencia
  static async actualizar(id, { idAprendiz, lunes, martes, miercoles, jueves, viernes }) {
    const sql = `
      UPDATE Asistencia
      SET ID_Aprendiz = ?, Lunes = ?, Martes = ?, Miércoles = ?, Jueves = ?, Viernes = ?
      WHERE ID_Asistencia = ?
    `;
    const [resultado] = await db.query(sql, [idAprendiz, lunes, martes, miercoles, jueves, viernes, id]);
    return resultado.affectedRows;
  }

  // Eliminar asistencia
  static async eliminar(id) {
    const [resultado] = await db.query('DELETE FROM Asistencia WHERE ID_Asistencia = ?', [id]);
    return resultado.affectedRows;
  }
}

export default Asistencia;
