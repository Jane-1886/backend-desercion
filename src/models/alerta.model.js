
// Importamos la conexión a la base de datos
import db from '../config/db.js';

/**
 * Modelo de la tabla 'Alertas'
 * Permite realizar operaciones CRUD sobre alertas asociadas a aprendices.
 */
class Alerta {
  // Obtener todas las alertas
  static async obtenerTodas() {
    const [filas] = await db.query('SELECT * FROM Alertas');
    return filas;
  }

  // Obtener alerta por ID
  static async obtenerPorId(id) {
    const [filas] = await db.query('SELECT * FROM Alertas WHERE ID_Alerta = ?', [id]);
    return filas[0];
  }

  // Modelo de Alerta
static async obtenerPorAprendiz(idAprendiz) {
  const sql = `SELECT * FROM Alertas WHERE ID_Aprendiz = ?`;
  const [rows] = await db.query(sql, [idAprendiz]);
  return [rows]; // importante devolver en array doble para mantener compatibilidad
}

  // Crear nueva alerta
  static async crear({ idAprendiz, estado }) {
    const sql = `
      INSERT INTO Alertas (ID_Aprendiz, Estado)
      VALUES (?, ?)
    `;
    const [resultado] = await db.query(sql, [idAprendiz, estado]);
    return resultado.insertId;
  }

  // Actualizar alerta
  static async actualizar(id, { idAprendiz, estado }) {
    const sql = `
      UPDATE Alertas
      SET ID_Aprendiz = ?, Estado = ?
      WHERE ID_Alerta = ?
    `;
    const [resultado] = await db.query(sql, [idAprendiz, estado, id]);
    return resultado.affectedRows;
  }

  // Eliminar alerta
  static async eliminar(id) {
    const [resultado] = await db.query('DELETE FROM Alertas WHERE ID_Alerta = ?', [id]);
    return resultado.affectedRows;
  }
}



export default Alerta;
