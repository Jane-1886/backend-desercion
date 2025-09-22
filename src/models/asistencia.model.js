
// src/models/asistencia.model.js
import db from '../config/db.js';

class Asistencia {
  static async obtenerTodas() {
    const [rows] = await db.query('SELECT * FROM asistencia');
    return rows;
  }

  static async obtenerPorId(id) {
    const [rows] = await db.query('SELECT * FROM asistencia WHERE ID_Asistencia = ?', [id]);
    return rows[0];
  }

  // ✅ ahora sí devolvemos fechas reales
  static async obtenerPorAprendiz(idAprendiz) {
    const [rows] = await db.query(
      `SELECT 
         a.ID_Asistencia,
         a.ID_Aprendiz,
         a.Lunes, a.Martes, a.Miércoles, a.Jueves, a.Viernes,
         a.Fecha, a.Fecha_Semana
       FROM asistencia a
       WHERE a.ID_Aprendiz = ?
       ORDER BY a.Fecha_Semana IS NULL, a.Fecha_Semana ASC, a.ID_Asistencia ASC`,
      [idAprendiz]
    );
    return rows;
  }

  static async crear({ idAprendiz, Lunes, Martes, Miércoles, Jueves, Viernes, Fecha = null, Fecha_Semana = null }) {
    const sql = `
      INSERT INTO asistencia (ID_Aprendiz, Lunes, Martes, Miércoles, Jueves, Viernes, Fecha, Fecha_Semana)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [r] = await db.query(sql, [idAprendiz, Lunes, Martes, Miércoles, Jueves, Viernes, Fecha, Fecha_Semana]);
    return r.insertId;
  }

  static async actualizar(id, { idAprendiz, Lunes, Martes, Miércoles, Jueves, Viernes, Fecha = null, Fecha_Semana = null }) {
    const sql = `
      UPDATE asistencia
      SET ID_Aprendiz = ?, Lunes = ?, Martes = ?, Miércoles = ?, Jueves = ?, Viernes = ?, Fecha = ?, Fecha_Semana = ?
      WHERE ID_Asistencia = ?
    `;
    const [r] = await db.query(sql, [idAprendiz, Lunes, Martes, Miércoles, Jueves, Viernes, Fecha, Fecha_Semana, id]);
    return r.affectedRows;
  }

  static async eliminar(id) {
    const [r] = await db.query('DELETE FROM asistencia WHERE ID_Asistencia = ?', [id]);
    return r.affectedRows;
  }
}

export default Asistencia;
