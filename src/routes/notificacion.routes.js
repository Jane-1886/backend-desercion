
import express from 'express';
import {
  obtenerNotificaciones,
  obtenerNotificacionPorId,
  crearNotificacion,
  actualizarNotificacion,
  eliminarNotificacion
} from '../controllers/notificacion.controller.js';

import verificarToken from '../middlewares/authMiddleware.js';
import autorizarRoles from '../middlewares/autorizarRol.js';

const router = express.Router();

/**
 * ✅ Rutas protegidas para roles 1 (Instructor) y 2 (Coordinador)
 * - Ambos pueden ver, crear, actualizar y eliminar notificaciones
 */

// GET - Todas las notificaciones
router.get('/', verificarToken, autorizarRoles(1, 2), obtenerNotificaciones);

// GET - Notificación por ID
router.get('/:id', verificarToken, autorizarRoles(1, 2), obtenerNotificacionPorId);

// POST - Crear nueva notificación
router.post('/', verificarToken, autorizarRoles(1, 2), crearNotificacion);

// PUT - Actualizar notificación
router.put('/:id', verificarToken, autorizarRoles(1, 2), actualizarNotificacion);

// DELETE - Eliminar notificación
router.delete('/:id', verificarToken, autorizarRoles(1, 2), eliminarNotificacion);

export default router;
