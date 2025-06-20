
// Importamos el modelo
import PlanSeguimiento from '../models/planSeguimiento.model.js';

/**
 * Controlador para manejar operaciones CRUD de la tabla 'Planes_Seguimiento'
 */

// Obtener todos los planes
export const obtenerPlanes = async (req, res) => {
  try {
    const datos = await PlanSeguimiento.obtenerTodos();
    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener planes', error });
  }
};

// Obtener plan por ID
export const obtenerPlanPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const plan = await PlanSeguimiento.obtenerPorId(id);
    if (plan) {
      res.json(plan);
    } else {
      res.status(404).json({ mensaje: 'Plan no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar el plan', error });
  }
};

// Crear nuevo plan de seguimiento
export const crearPlan = async (req, res) => {
  const { idAprendiz, tipo, fechaInicio, fechaFin, estado, descripcion } = req.body;
  try {
    const id = await PlanSeguimiento.crear({ idAprendiz, tipo, fechaInicio, fechaFin, estado, descripcion });
    res.status(201).json({ mensaje: 'Plan creado correctamente', id });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el plan', error });
  }
};

// Actualizar plan
export const actualizarPlan = async (req, res) => {
  const { id } = req.params;
  const { idAprendiz, tipo, fechaInicio, fechaFin, estado, descripcion } = req.body;
  try {
    const filas = await PlanSeguimiento.actualizar(id, { idAprendiz, tipo, fechaInicio, fechaFin, estado, descripcion });
    if (filas > 0) {
      res.json({ mensaje: 'Plan actualizado correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Plan no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el plan', error });
  }
};

// Eliminar plan
export const eliminarPlan = async (req, res) => {
  const { id } = req.params;
  try {
    const filas = await PlanSeguimiento.eliminar(id);
    if (filas > 0) {
      res.json({ mensaje: 'Plan eliminado correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Plan no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el plan', error });
  }
};
