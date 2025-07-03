
import express from 'express';
import {
  obtenerPlanes,
  obtenerPlanPorId,
  crearPlan,
  actualizarPlan,
  eliminarPlan
} from '../controllers/planSeguimiento.controller.js';

import verificarToken from '../middlewares/authMiddleware.js';
import autorizarRoles from '../middlewares/autorizarRol.js';

const router = express.Router();

/**
 * ✅ Rutas protegidas para roles 1 y 2
 */

// GET - Todos los planes de seguimiento
router.get('/', verificarToken, autorizarRoles(1, 2), obtenerPlanes);

// GET - Plan por ID
router.get('/:id', verificarToken, autorizarRoles(1, 2), obtenerPlanPorId);

// POST - Crear nuevo plan
router.post('/', verificarToken, autorizarRoles(1, 2), crearPlan);

// PUT - Actualizar plan existente
router.put('/:id', verificarToken, autorizarRoles(1, 2), actualizarPlan);

// DELETE - Eliminar plan
router.delete('/:id', verificarToken, autorizarRoles(1, 2), eliminarPlan);

export default router;
