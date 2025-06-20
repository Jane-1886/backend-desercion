
// Importar Express y el controlador de notificaciones
import express from 'express';
import {
  obtenerNotificaciones,
  obtenerNotificacionPorId,
  crearNotificacion,
  actualizarNotificacion,
  eliminarNotificacion
} from '../controllers/notificacion.controller.js';

const router = express.Router();

/**
 * Rutas para CRUD de la tabla 'Notificaciones'
 */

// GET - Todas las notificaciones
router.get('/', obtenerNotificaciones);

// GET - Notificación por ID
router.get('/:id', obtenerNotificacionPorId);

// POST - Crear nueva notificación
router.post('/', crearNotificacion);

// PUT - Actualizar notificación
router.put('/:id', actualizarNotificacion);

// DELETE - Eliminar notificación
router.delete('/:id', eliminarNotificacion);

export default router;
