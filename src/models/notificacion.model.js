
// Importamos la conexión a la base de datos
import db from '../config/db.js';

/**
 * Modelo para la tabla 'Notificaciones'
 * Maneja las solicitudes de tipo administrativo que se registran en el sistema.
 */
class Notificacion {
  // Obtener todas las notificaciones
  static async obtenerTodas() {
    const [filas] = await db.query('SELECT * FROM Notificaciones');
    return filas;
  }

  // Obtener notificación por ID
  static async obtenerPorId(id) {
    const [filas] = await db.query('SELECT * FROM Notificaciones WHERE ID_Notificacion = ?', [id]);
    return filas[0];
  }

  // Crear nueva notificación
  static async crear({ tipo, estado, hora, descripcion }) {
    const sql = `
      INSERT INTO Notificaciones
      (Tipo_Solicitud, Estado, Hora_Solicitud, Descripcion)
      VALUES (?, ?, ?, ?)
    `;
    const [resultado] = await db.query(sql, [tipo, estado, hora, descripcion]);
    return resultado.insertId;
  }

  // Actualizar una notificación
  static async actualizar(id, { tipo, estado, hora, descripcion }) {
    const sql = `
      UPDATE Notificaciones
      SET Tipo_Solicitud = ?, Estado = ?, Hora_Solicitud = ?, Descripcion = ?
      WHERE ID_Notificacion = ?
    `;
    const [resultado] = await db.query(sql, [tipo, estado, hora, descripcion, id]);
    return resultado.affectedRows;
  }

  // Eliminar notificación
  static async eliminar(id) {
    const [resultado] = await db.query('DELETE FROM Notificaciones WHERE ID_Notificacion = ?', [id]);
    return resultado.affectedRows;
  }
}

export default Notificacion;
