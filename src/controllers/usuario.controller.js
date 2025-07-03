
// Importamos el modelo de Usuario
import Usuario from '../models/usuario.model.js';
import bcrypt from 'bcryptjs';

/**
 * Controlador para manejar las peticiones relacionadas con la tabla 'Usuarios'
 */

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.obtenerTodos();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los usuarios', error });
  }
};

// Obtener un solo usuario por ID
export const obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.obtenerPorId(id);
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el usuario', error });
  }
};

// Crear un nuevo usuario
export const crearUsuario = async (req, res) => {
  const { nombre, contrasena, idRol, email } = req.body;
  try {
    // 🔐 Cifrar la contraseña antes de guardar
    const hash = await bcrypt.hash(contrasena, 10);

    const id = await Usuario.crear({
      Nombre_Usuario: nombre,
      Contraseña: hash,
      ID_Rol: idRol,
      Email: email
    });

    res.status(201).json({ mensaje: 'Usuario creado correctamente', id });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el usuario', error });
  }
};

// Actualizar un usuario existente
export const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, contrasena, idRol, email } = req.body;
  try {
    // 🔐 Cifrar la nueva contraseña antes de actualizar
    const hash = await bcrypt.hash(contrasena, 10);

    const filasAfectadas = await Usuario.actualizar(id, {
      Nombre_Usuario: nombre,
      Contraseña: hash,
      ID_Rol: idRol,
      Email: email
    });

    if (filasAfectadas > 0) {
      res.json({ mensaje: 'Usuario actualizado correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el usuario', error });
  }
};

// Eliminar un usuario por ID
export const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const filasAfectadas = await Usuario.eliminar(id);
    if (filasAfectadas > 0) {
      res.json({ mensaje: 'Usuario eliminado correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el usuario', error });
  }
};
// Cambiar estado del usuario (activar/desactivar)
export const cambiarEstadoUsuario = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; // Se espera "Activo" o "Inactivo"

  try {
    const sql = 'UPDATE Usuarios SET Estado = ? WHERE ID_Usuario = ?';
    const [resultado] = await db.query(sql, [estado, id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ mensaje: `Usuario actualizado a estado ${estado}` });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al cambiar estado del usuario', error });
  }
};

