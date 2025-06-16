
// Importamos la conexión a la base de datos
import db from '../config/db.js';

/**
 * Modelo para la tabla 'Intervenciones'
 */
class Intervencion {
  // Obtener todas las intervenciones
  static async obtenerTodas() {
    const [filas] = await db.query('SELECT * FROM Intervenciones');
    return filas;
  }

  // Obtener una intervención por ID
  static async obtenerPorId(id) {
    const [filas] = await db.query('SELECT * FROM Intervenciones WHERE ID_Intervencion = ?', [id]);
    return filas[0];
  }

  // Crear una nueva intervención
  static async crear({ idAprendiz, tipo, descripcion, resultado }) {
    const sql = `
      INSERT INTO Intervenciones (ID_Aprendiz, Tipo_Intervencion, Descripción, Resultado)
      VALUES (?, ?, ?, ?)
    `;
    const [resultadoQuery] = await db.query(sql, [idAprendiz, tipo, descripcion, resultado]);
    return resultadoQuery.insertId;
  }

  // Actualizar intervención
  static async actualizar(id, { idAprendiz, tipo, descripcion, resultado }) {
    const sql = `
      UPDATE Intervenciones
      SET ID_Aprendiz = ?, Tipo_Intervencion = ?, Descripción = ?, Resultado = ?
      WHERE ID_Intervencion = ?
    `;
    const [resultadoQuery] = await db.query(sql, [idAprendiz, tipo, descripcion, resultado, id]);
    return resultadoQuery.affectedRows;
  }

  // Eliminar intervención
  static async eliminar(id) {
    const [resultadoQuery] = await db.query('DELETE FROM Intervenciones WHERE ID_Intervencion = ?', [id]);
    return resultadoQuery.affectedRows;
  }
}

export default Intervencion;
