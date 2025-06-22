
// Importamos el modelo
import Notificacion from '../models/notificacion.model.js';

/**
 * Controlador para manejar operaciones CRUD de la tabla 'Notificaciones'
 */

// Obtener todas las notificaciones
export const obtenerNotificaciones = async (req, res) => {
  try {
    const datos = await Notificacion.obtenerTodas();
    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener notificaciones', error });
  }
};

// Obtener notificación por ID
export const obtenerNotificacionPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const notificacion = await Notificacion.obtenerPorId(id);
    if (notificacion) {
      res.json(notificacion);
    } else {
      res.status(404).json({ mensaje: 'Notificación no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar la notificación', error });
  }
};

// Crear nueva notificación
export const crearNotificacion = async (req, res) => {
  const { tipo, estado, hora, descripcion } = req.body;
  try {
    const id = await Notificacion.crear({ tipo, estado, hora, descripcion });
    res.status(201).json({ mensaje: 'Notificación registrada correctamente', id });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear la notificación', error });
  }
};

// Actualizar una notificación
export const actualizarNotificacion = async (req, res) => {
  const { id } = req.params;
  const { tipo, estado, hora, descripcion } = req.body;
  try {
    const filas = await Notificacion.actualizar(id, { tipo, estado, hora, descripcion });
    if (filas > 0) {
      res.json({ mensaje: 'Notificación actualizada correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Notificación no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar la notificación', error });
  }
};

// Eliminar una notificación
export const eliminarNotificacion = async (req, res) => {
  const { id } = req.params;
  try {
    const filas = await Notificacion.eliminar(id);
    if (filas > 0) {
      res.json({ mensaje: 'Notificación eliminada correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Notificación no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la notificación', error });
  }
};



// Crear nueva notificación
export const registrarNotificacion = async (req, res) => {
  try {
    const { tipo, estado, hora, descripcion } = req.body;

    if (!tipo || !estado || !hora || !descripcion) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }

    const nuevaId = await Notificacion.crear({ tipo, estado, hora, descripcion });
    res.status(201).json({ mensaje: 'Notificación registrada', id: nuevaId });

  } catch (error) {
    console.error('Error al registrar notificación:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// Listar todas las notificaciones
export const listarNotificaciones = async (req, res) => {
  try {
    const notificaciones = await Notificacion.obtenerTodas();
    res.status(200).json(notificaciones);
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ mensaje: 'Error al obtener notificaciones' });
  }
};

