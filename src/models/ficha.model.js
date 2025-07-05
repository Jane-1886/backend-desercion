
// Importamos la conexión a la base de datos
import db from '../config/db.js';

/**
 * Modelo para la tabla 'Fichas_de_Formacion'
 * Permite administrar programas de formación registrados.
 */
class Ficha {
  // Obtener todas las fichas
  static async obtenerTodas() {
    const [filas] = await db.query('SELECT * FROM Fichas_de_Formacion');
    return filas;
  }

  // Obtener ficha por ID
  static async obtenerPorId(id) {
    const [filas] = await db.query('SELECT * FROM Fichas_de_Formacion WHERE ID_Ficha = ?', [id]);
    return filas[0];
  }

  // Crear ficha de formación
  static async crear({ nombreFicha, descripcion, tipoPrograma, fechaInicio, fechaFin, estado, idAprendiz }) {
    const sql = `
      INSERT INTO Fichas_de_Formacion
      (Nombre_Ficha, Descripcion, Tipo_Programa, Fecha_Inicio, Fecha_Fin, Estado, ID_Aprendiz)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [resultado] = await db.query(sql, [
      nombreFicha,
      descripcion,
      tipoPrograma,
      fechaInicio,
      fechaFin,
      estado,
      idAprendiz
    ]);
    return resultado.insertId;
  }

  // Actualizar ficha
  static async actualizar(id, { nombreFicha, descripcion, tipoPrograma, fechaInicio, fechaFin, estado, idAprendiz }) {
    const sql = `
      UPDATE Fichas_de_Formacion
      SET Nombre_Ficha = ?, Descripcion = ?, Tipo_Programa = ?, Fecha_Inicio = ?, Fecha_Fin = ?, Estado = ?, ID_Aprendiz = ?
      WHERE ID_Ficha = ?
    `;
    const [resultado] = await db.query(sql, [
      nombreFicha,
      descripcion,
      tipoPrograma,
      fechaInicio,
      fechaFin,
      estado,
      idAprendiz,
      id
    ]);
    return resultado.affectedRows;
  }

  // Eliminar ficha
  static async eliminar(id) {
    const [resultado] = await db.query('DELETE FROM Fichas_de_Formacion WHERE ID_Ficha = ?', [id]);
    return resultado.affectedRows;
  }

// Cambiar el estado de una ficha (activar/inactivar)
static async cambiarEstado(idFicha, nuevoEstado) {
  const sql = `UPDATE Fichas_de_Formacion SET Estado = ? WHERE ID_Ficha = ?`;
  const [resultado] = await db.query(sql, [nuevoEstado, idFicha]);
  return resultado.affectedRows;
}
}

export default Ficha;
