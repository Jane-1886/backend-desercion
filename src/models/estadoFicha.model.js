
// Importamos la conexión a la base de datos
import db from '../config/db.js';

/**
 * Modelo para la tabla 'Activar_Desactivar_Fichas'
 * Permite activar o desactivar fichas de formación existentes.
 */
class EstadoFicha {
  // Obtener todos los estados de fichas
  static async obtenerTodas() {
    const [filas] = await db.query('SELECT * FROM Activar_Desactivar_Fichas');
    return filas;
  }

  // Obtener estado por ID de ficha
  static async obtenerPorId(idFicha) {
    const [filas] = await db.query('SELECT * FROM Activar_Desactivar_Fichas WHERE ID_Ficha = ?', [idFicha]);
    return filas[0];
  }

  // Crear estado de ficha
  static async crear({ idFicha, estado }) {
    const sql = `
      INSERT INTO Activar_Desactivar_Fichas (ID_Ficha, Estado)
      VALUES (?, ?)
    `;
    const [resultado] = await db.query(sql, [idFicha, estado]);
    return resultado.insertId;
  }

  // Actualizar estado de ficha
  static async actualizar(idFicha, estado) {
    const sql = `
      UPDATE Activar_Desactivar_Fichas
      SET Estado = ?, Fecha_Cambio = CURRENT_TIMESTAMP
      WHERE ID_Ficha = ?
    `;
    const [resultado] = await db.query(sql, [estado, idFicha]);
    return resultado.affectedRows;
  }

  // Eliminar estado de ficha
  static async eliminar(idFicha) {
    const [resultado] = await db.query('DELETE FROM Activar_Desactivar_Fichas WHERE ID_Ficha = ?', [idFicha]);
    return resultado.affectedRows;
  }
}

export default EstadoFicha;
