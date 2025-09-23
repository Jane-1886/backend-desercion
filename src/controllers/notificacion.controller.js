
// controllers/notificacion.controller.js
// Importamos el modelo
import Notificacion from '../models/notificacion.model.js';

/**
 * Controlador CRUD para 'notificaciones'
 * - Usa el modelo existente: obtenerTodas, obtenerPorId, crear, actualizar, eliminar
 * - Crea con validación y estado por defecto
 * - Actualiza de forma parcial (merge con registro actual)
 */

// GET /api/notificaciones
export const obtenerNotificaciones = async (req, res) => {
  try {
    const datos = await Notificacion.obtenerTodas();
    res.json(datos);
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ mensaje: 'Error al obtener notificaciones' });
  }
};

// GET /api/notificaciones/:id
export const obtenerNotificacionPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const notificacion = await Notificacion.obtenerPorId(id);
    if (!notificacion) {
      return res.status(404).json({ mensaje: 'Notificación no encontrada' });
    }
    res.json(notificacion);
  } catch (error) {
    console.error('Error al buscar la notificación:', error);
    res.status(500).json({ mensaje: 'Error al buscar la notificación' });
  }
};

// POST /api/notificaciones
export const crearNotificacion = async (req, res) => {
  try {
    let { tipo, estado, hora, descripcion } = req.body;

    // Validaciones mínimas
    if (!tipo || !hora || !descripcion) {
      return res.status(400).json({ mensaje: 'tipo, hora y descripcion son obligatorios.' });
    }

    // Estado por defecto
    if (!estado) estado = 'Pendiente';

    // Si más adelante agregas idUsuarioSolicitante en BD:
    // const idUsuarioSolicitante = req?.usuario?.id; // si tu middleware lo adjunta
    // y actualizas el modelo para aceptar esa columna.

    const id = await Notificacion.crear({ tipo, estado, hora, descripcion });
    res.status(201).json({ mensaje: 'Notificación registrada correctamente', id });
  } catch (error) {
    console.error('Error al crear la notificación:', error);
    res.status(500).json({ mensaje: 'Error al crear la notificación' });
  }
};

// PATCH /api/notificaciones/:id  (actualización parcial)
export const actualizarNotificacion = async (req, res) => {
  const { id } = req.params;
  const { tipo, estado, hora, descripcion } = req.body;

  try {
    // Traemos el registro actual
    const actual = await Notificacion.obtenerPorId(id);
    if (!actual) {
      return res.status(404).json({ mensaje: 'Notificación no encontrada' });
    }

    // Merge: si no viene un campo, se conserva el actual
    const actualizado = {
      tipo:        typeof tipo        !== 'undefined' ? tipo        : actual.tipo,
      estado:      typeof estado      !== 'undefined' ? estado      : actual.estado,
      hora:        typeof hora        !== 'undefined' ? hora        : actual.hora,
      descripcion: typeof descripcion !== 'undefined' ? descripcion : actual.descripcion,
    };

    const filas = await Notificacion.actualizar(id, actualizado);
    if (filas > 0) {
      return res.json({ mensaje: 'Notificación actualizada correctamente' });
    }
    return res.status(404).json({ mensaje: 'Notificación no encontrada' });
  } catch (error) {
    console.error('Error al actualizar la notificación:', error);
    res.status(500).json({ mensaje: 'Error al actualizar la notificación' });
  }
};

// DELETE /api/notificaciones/:id
export const eliminarNotificacion = async (req, res) => {
  const { id } = req.params;
  try {
    const filas = await Notificacion.eliminar(id);
    if (filas > 0) {
      return res.json({ mensaje: 'Notificación eliminada correctamente' });
    }
    return res.status(404).json({ mensaje: 'Notificación no encontrada' });
  } catch (error) {
    console.error('Error al eliminar la notificación:', error);
    res.status(500).json({ mensaje: 'Error al eliminar la notificación' });
  }
};
