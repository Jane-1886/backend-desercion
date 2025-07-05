
// Importar el modelo
import Asistencia from '../models/asistencia.model.js';

/**
 * Controlador para manejar el CRUD de la tabla 'Asistencia'
 */

// Obtener todas las asistencias
export const obtenerAsistencias = async (req, res) => {
  try {
    const datos = await Asistencia.obtenerTodas();
    res.json(datos);
  } catch (error) {
    console.error('❌ Error al obtener asistencias:', error.message);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// Obtener asistencia por ID
export const obtenerAsistenciaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const asistencia = await Asistencia.obtenerPorId(id);
    if (!asistencia) {
      return res.status(404).json({ mensaje: 'Asistencia no encontrada' });
    }
    res.json(asistencia);
  } catch (error) {
    console.error('❌ Error al obtener asistencia:', error.message);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// Crear nueva asistencia
export const crearAsistencia = async (req, res) => {
  try {
    const { idAprendiz, Lunes, Martes, Miércoles, Jueves, Viernes } = req.body;
    const id = await Asistencia.crear({ idAprendiz, Lunes, Martes, Miércoles, Jueves, Viernes });
    res.status(201).json({ mensaje: 'Asistencia registrada correctamente', id });
  } catch (error) {
    console.error('❌ Error al crear asistencia:', error.message);
    res.status(500).json({ mensaje: 'Error al registrar asistencia' });
  }
};

// Actualizar asistencia
export const actualizarAsistencia = async (req, res) => {
  const { id } = req.params;
  const { idAprendiz, Lunes, Martes, Miércoles, Jueves, Viernes } = req.body;
  try {
    const filas = await Asistencia.actualizar(id, { idAprendiz, Lunes, Martes, Miércoles, Jueves, Viernes });
    if (filas > 0) {
      res.json({ mensaje: 'Asistencia actualizada correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Asistencia no encontrada' });
    }
  } catch (error) {
    console.error('❌ Error al actualizar asistencia:', error.message);
    res.status(500).json({ mensaje: 'Error al actualizar asistencia' });
  }
};

// Eliminar asistencia
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
    console.error('❌ Error al eliminar asistencia:', error.message);
    res.status(500).json({ mensaje: 'Error al eliminar asistencia' });
  }
};
