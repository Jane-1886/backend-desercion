
// Importar Express y el controlador
import express from 'express';
import {
  obtenerIntervenciones,
  obtenerIntervencionPorId,
  crearIntervencion,
  actualizarIntervencion,
  eliminarIntervencion
} from '../controllers/intervencion.controller.js';

const router = express.Router();

/**
 * Rutas para el CRUD de Intervenciones
 */

// GET - Todas las intervenciones
router.get('/', obtenerIntervenciones);

// GET - Una intervención por ID
router.get('/:id', obtenerIntervencionPorId);

// POST - Crear nueva intervención
router.post('/', crearIntervencion);

// PUT - Actualizar intervención existente
router.put('/:id', actualizarIntervencion);

// DELETE - Eliminar intervención
router.delete('/:id', eliminarIntervencion);

export default router;
