
// Importamos la conexión a la base de datos
import db from '../config/db.js';

/**
 * Modelo para la tabla 'Planes_Seguimiento'
 * Administra planes de acompañamiento asignados a los aprendices.
 */
class PlanSeguimiento {
  // Obtener todos los planes
  static async obtenerTodos() {
    const [filas] = await db.query('SELECT * FROM Planes_Seguimiento');
    return filas;
  }

  // Obtener un plan por ID
  static async obtenerPorId(id) {
    const [filas] = await db.query('SELECT * FROM Planes_Seguimiento WHERE ID_Plan = ?', [id]);
    return filas[0];
  }

  // Crear un nuevo plan
  static async crear({ idAprendiz, tipo, fechaInicio, fechaFin, estado, descripcion }) {
    const sql = `
      INSERT INTO Planes_Seguimiento
      (ID_Aprendiz, Tipo_Seguimiento, Fecha_Inicio, Fecha_Fin, Estado, Descripcion)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [resultado] = await db.query(sql, [
      idAprendiz,
      tipo,
      fechaInicio,
      fechaFin,
      estado,
      descripcion
    ]);
    return resultado.insertId;
  }

  // Actualizar plan de seguimiento
  static async actualizar(id, { idAprendiz, tipo, fechaInicio, fechaFin, estado, descripcion }) {
    const sql = `
      UPDATE Planes_Seguimiento
      SET ID_Aprendiz = ?, Tipo_Seguimiento = ?, Fecha_Inicio = ?, Fecha_Fin = ?, Estado = ?, Descripcion = ?
      WHERE ID_Plan = ?
    `;
    const [resultado] = await db.query(sql, [
      idAprendiz,
      tipo,
      fechaInicio,
      fechaFin,
      estado,
      descripcion,
      id
    ]);
    return resultado.affectedRows;
  }

  // Eliminar plan de seguimiento
  static async eliminar(id) {
    const [resultado] = await db.query('DELETE FROM Planes_Seguimiento WHERE ID_Plan = ?', [id]);
    return resultado.affectedRows;
  }
}

export default PlanSeguimiento;
