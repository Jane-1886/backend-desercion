
// Importar Express y el controlador
import express from 'express';
import {
  obtenerPlanes,
  obtenerPlanPorId,
  crearPlan,
  actualizarPlan,
  eliminarPlan
} from '../controllers/planSeguimiento.controller.js';

const router = express.Router();

/**
 * Rutas para CRUD de la tabla 'Planes_Seguimiento'
 */

// GET - Todos los planes
router.get('/', obtenerPlanes);

// GET - Plan por ID
router.get('/:id', obtenerPlanPorId);

// POST - Crear nuevo plan
router.post('/', crearPlan);

// PUT - Actualizar plan
router.put('/:id', actualizarPlan);

// DELETE - Eliminar plan
router.delete('/:id', eliminarPlan);

export default router;
