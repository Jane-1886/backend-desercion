
// Importamos el modelo
import Asistencia from '../models/asistencia.model.js';

/**
 * Controlador para manejar operaciones CRUD de la tabla 'Asistencia'
 */

// Obtener todos los registros de asistencia
export const obtenerAsistencias = async (req, res) => {
  try {
    const datos = await Asistencia.obtenerTodas();
    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener asistencias', error });
  }
};

// Obtener asistencia por ID
export const obtenerAsistenciaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const asistencia = await Asistencia.obtenerPorId(id);
    if (asistencia) {
      res.json(asistencia);
    } else {
      res.status(404).json({ mensaje: 'Asistencia no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar la asistencia', error });
  }
};

// Crear nueva asistencia
export const crearAsistencia = async (req, res) => {
  const { idAprendiz, lunes, martes, miercoles, jueves, viernes } = req.body;
  try {
    const id = await Asistencia.crear({ idAprendiz, lunes, martes, miercoles, jueves, viernes });
    res.status(201).json({ mensaje: 'Asistencia registrada correctamente', id });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar la asistencia', error });
  }
};

// Actualizar una asistencia
export const actualizarAsistencia = async (req, res) => {
  const { id } = req.params;
  const { idAprendiz, lunes, martes, miercoles, jueves, viernes } = req.body;
  try {
    const filas = await Asistencia.actualizar(id, { idAprendiz, lunes, martes, miercoles, jueves, viernes });
    if (filas > 0) {
      res.json({ mensaje: 'Asistencia actualizada correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Asistencia no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar la asistencia', error });
  }
};

// Eliminar una asistencia
export const eliminarAsistencia = async (req, res) => {
  const { id } = req.params;
  try {
    const filas = await Asistencia.eliminar(id);
    if (filas > 0) {
      res.json({ mensaje: 'Asistencia eliminada correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Asistencia no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la asistencia', error });
  }
};
