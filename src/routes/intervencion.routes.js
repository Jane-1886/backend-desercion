// Importar Express y el controlador
import express from 'express';
import {
  obtenerIntervenciones,
  obtenerIntervencionPorId,
  crearIntervencion,
  actualizarIntervencion,
  eliminarIntervencion
} from '../controllers/intervencion.controller.js';

import verificarToken from '../middlewares/authMiddleware.js';
import autorizarRoles from '../middlewares/autorizarRol.js';

const router = express.Router();

/**
 * ✅ Rutas protegidas para el CRUD de Intervenciones
 * Acceso permitido para roles: Instructor (1) y Coordinador (2)
 */

// GET - Todas las intervenciones
router.get('/', verificarToken, autorizarRoles(1, 2), obtenerIntervenciones);

// GET - Una intervención por ID
router.get('/:id', verificarToken, autorizarRoles(1, 2), obtenerIntervencionPorId);

// POST - Crear nueva intervención
router.post('/', verificarToken, autorizarRoles(1, 2), crearIntervencion);

// PUT - Actualizar intervención existente
router.put('/:id', verificarToken, autorizarRoles(1, 2), actualizarIntervencion);

// DELETE - Eliminar intervención
router.delete('/:id', verificarToken, autorizarRoles(1, 2), eliminarIntervencion);

export default router;
