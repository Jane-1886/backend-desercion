
// src/models/usuario.model.js
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

  // ✅ ahora recibe más campos
<<<<<<< HEAD
  static async crear({ Nombre_Usuario, Contraseña, ID_Rol, Email, Tipo_Documento = null, Numero_Documento = null, Celular = null }) {
    const sql = `
      INSERT INTO Usuarios (Nombre_Usuario, Contraseña, ID_Rol, Email, Tipo_Documento, Numero_Documento, Celular)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [resultado] = await db.query(sql, [Nombre_Usuario, Contraseña, ID_Rol, Email, Tipo_Documento, Numero_Documento, Celular]);
    return resultado.insertId;
  }

  static async actualizar(id, { Nombre_Usuario, Contraseña, ID_Rol, Email, Tipo_Documento = null, Numero_Documento = null, Celular = null }) {
    const sql = `
      UPDATE Usuarios
      SET Nombre_Usuario = ?, Contraseña = ?, ID_Rol = ?, Email = ?, Tipo_Documento = ?, Numero_Documento = ?, Celular = ?
      WHERE ID_Usuario = ?
    `;
    const [resultado] = await db.query(sql, [Nombre_Usuario, Contraseña, ID_Rol, Email, Tipo_Documento, Numero_Documento, Celular, id]);
=======
  static async crear({ Nombre_Usuario, Contrasena, ID_Rol, Email, Tipo_Documento = null, Numero_Documento = null, Celular = null }) {
    const sql = `
      INSERT INTO Usuarios (Nombre_Usuario, Contrasena, ID_Rol, Email, Tipo_Documento, Numero_Documento, Celular)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [resultado] = await db.query(sql, [Nombre_Usuario, Contrasena, ID_Rol, Email, Tipo_Documento, Numero_Documento, Celular]);
    return resultado.insertId;
  }

  static async actualizar(id, { Nombre_Usuario, Contrasena, ID_Rol, Email, Tipo_Documento = null, Numero_Documento = null, Celular = null }) {
    const sql = `
      UPDATE Usuarios
      SET Nombre_Usuario = ?, Contrasena = ?, ID_Rol = ?, Email = ?, Tipo_Documento = ?, Numero_Documento = ?, Celular = ?
      WHERE ID_Usuario = ?
    `;
    const [resultado] = await db.query(sql, [Nombre_Usuario, Contrasena, ID_Rol, Email, Tipo_Documento, Numero_Documento, Celular, id]);
>>>>>>> 63a8aa6 (Inicialización del repositorio backend: estructura Node/Express, controladores y conexión MySQL)
    return resultado.affectedRows;
  }

  static async eliminar(id) {
    const [resultado] = await db.query('DELETE FROM Usuarios WHERE ID_Usuario = ?', [id]);
    return resultado.affectedRows;
  }
}

export default Usuario;
