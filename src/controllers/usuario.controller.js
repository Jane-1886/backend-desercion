
// Importamos el modelo de Usuario
import Usuario from '../models/usuario.model.js';

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
    const id = await Usuario.crear({ nombre, contrasena, idRol, email });
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
    const filasAfectadas = await Usuario.actualizar(id, { nombre, contrasena, idRol, email });
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
