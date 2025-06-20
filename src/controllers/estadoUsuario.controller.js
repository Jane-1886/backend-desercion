
// Importamos el modelo
import EstadoUsuario from '../models/estadoUsuario.model.js';

/**
 * Controlador para manejar operaciones CRUD de la tabla 'Activar_Desactivar_Usuarios'
 */

// Obtener todos los estados
export const obtenerEstadosUsuarios = async (req, res) => {
  try {
    const datos = await EstadoUsuario.obtenerTodos();
    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener estados de usuarios', error });
  }
};

// Obtener estado por ID de usuario
export const obtenerEstadoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const estado = await EstadoUsuario.obtenerPorId(id);
    if (estado) {
      res.json(estado);
    } else {
      res.status(404).json({ mensaje: 'Estado no encontrado para el usuario' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener estado', error });
  }
};

// Crear nuevo estado (activación/desactivación inicial)
export const crearEstadoUsuario = async (req, res) => {
  const { idUsuario, estado } = req.body;
  try {
    const id = await EstadoUsuario.crear({ idUsuario, estado });
    res.status(201).json({ mensaje: 'Estado creado correctamente', id });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear estado', error });
  }
};

// Actualizar estado del usuario
export const actualizarEstadoUsuario = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const filas = await EstadoUsuario.actualizar(id, estado);
    if (filas > 0) {
      res.json({ mensaje: 'Estado actualizado correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Usuario no encontrado para actualizar estado' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar estado', error });
  }
};

// Eliminar estado de usuario
export const eliminarEstadoUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const filas = await EstadoUsuario.eliminar(id);
    if (filas > 0) {
      res.json({ mensaje: 'Estado eliminado correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Usuario no encontrado para eliminar estado' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar estado', error });
  }
};
