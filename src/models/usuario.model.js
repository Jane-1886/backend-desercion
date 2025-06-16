
// Importamos la conexión a la base de datos
import db from '../config/db.js';

class Usuario {
  static async obtenerTodos() {
    const [filas] = await db.query('SELECT * FROM Usuarios');
    return filas;
  }

  static async obtenerPorId(id) {
    const [filas] = await db.query('SELECT * FROM Usuarios WHERE ID_Usuario = ?', [id]);
    return filas[0];
  }

  static async crear({ nombre, contrasena, idRol, email }) {
    const sql = `
      INSERT INTO Usuarios (Nombre_Usuario, Contraseña, ID_Rol, Email)
      VALUES (?, ?, ?, ?)
    `;
    const [resultado] = await db.query(sql, [nombre, contrasena, idRol, email]);
    return resultado.insertId;
  }

  static async actualizar(id, { nombre, contrasena, idRol, email }) {
    const sql = `
      UPDATE Usuarios
      SET Nombre_Usuario = ?, Contraseña = ?, ID_Rol = ?, Email = ?
      WHERE ID_Usuario = ?
    `;
    const [resultado] = await db.query(sql, [nombre, contrasena, idRol, email, id]);
    return resultado.affectedRows;
  }

  static async eliminar(id) {
    const [resultado] = await db.query('DELETE FROM Usuarios WHERE ID_Usuario = ?', [id]);
    return resultado.affectedRows;
  }
}

export default Usuario;
