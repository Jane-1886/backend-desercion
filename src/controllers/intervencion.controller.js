
// Importamos el modelo
import Intervencion from '../models/intervencion.model.js';

/**
 * Controlador para manejar las intervenciones
 */

// Obtener todas las intervenciones
export const obtenerIntervenciones = async (req, res) => {
  try {
    const datos = await Intervencion.obtenerTodas();
    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las intervenciones', error });
  }
};

// Obtener intervención por ID
export const obtenerIntervencionPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const intervencion = await Intervencion.obtenerPorId(id);
    if (intervencion) {
      res.json(intervencion);
    } else {
      res.status(404).json({ mensaje: 'Intervención no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la intervención', error });
  }
};

// Crear nueva intervención
export const crearIntervencion = async (req, res) => {
  const { idAprendiz, tipo, descripcion, resultado } = req.body;
  try {
    const id = await Intervencion.crear({ idAprendiz, tipo, descripcion, resultado });
    res.status(201).json({ mensaje: 'Intervención registrada correctamente', id });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar la intervención', error });
  }
};

// Actualizar intervención existente
export const actualizarIntervencion = async (req, res) => {
  const { id } = req.params;
  const { idAprendiz, tipo, descripcion, resultado } = req.body;
  try {
    const filas = await Intervencion.actualizar(id, { idAprendiz, tipo, descripcion, resultado });
    if (filas > 0) {
      res.json({ mensaje: 'Intervención actualizada correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Intervención no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar la intervención', error });
  }
};

// Eliminar intervención
export const eliminarIntervencion = async (req, res) => {
  const { id } = req.params;
  try {
    const filas = await Intervencion.eliminar(id);
    if (filas > 0) {
      res.json({ mensaje: 'Intervención eliminada correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Intervención no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la intervención', error });
  }
};
