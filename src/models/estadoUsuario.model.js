
// Importamos la conexión a la base de datos
import db from '../config/db.js';

/**
 * Modelo para la tabla 'Activar_Desactivar_Usuarios'
 * Administra el estado activo/inactivo de los usuarios del sistema.
 */
class EstadoUsuario {
  // Obtener todos los estados de usuarios
  static async obtenerTodos() {
    const [filas] = await db.query('SELECT * FROM Activar_Desactivar_Usuarios');
    return filas;
  }

  // Obtener estado de usuario por ID
  static async obtenerPorId(id) {
    const [filas] = await db.query('SELECT * FROM Activar_Desactivar_Usuarios WHERE ID_Usuario = ?', [id]);
    return filas[0];
  }

  // Crear nuevo estado (activar o desactivar un usuario)
  static async crear({ idUsuario, estado }) {
    const sql = `
      INSERT INTO Activar_Desactivar_Usuarios (ID_Usuario, Estado)
      VALUES (?, ?)
    `;
    const [resultado] = await db.query(sql, [idUsuario, estado]);
    return resultado.insertId;
  }

  // Actualizar estado del usuario
  static async actualizar(idUsuario, estado) {
    const sql = `
      UPDATE Activar_Desactivar_Usuarios
      SET Estado = ?, Fecha_Cambio = CURRENT_TIMESTAMP
      WHERE ID_Usuario = ?
    `;
    const [resultado] = await db.query(sql, [estado, idUsuario]);
    return resultado.affectedRows;
  }

  // Eliminar un registro de estado de usuario
  static async eliminar(idUsuario) {
    const [resultado] = await db.query('DELETE FROM Activar_Desactivar_Usuarios WHERE ID_Usuario = ?', [idUsuario]);
    return resultado.affectedRows;
  }
}

export default EstadoUsuario;
