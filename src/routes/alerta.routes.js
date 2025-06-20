
// Importar Express y el controlador de alertas
import express from 'express';
import {
  obtenerAlertas,
  obtenerAlertaPorId,
  crearAlerta,
  actualizarAlerta,
  eliminarAlerta
} from '../controllers/alerta.controller.js';

const router = express.Router();

/**
 * Rutas para CRUD de la tabla 'Alertas'
 */

// GET - Obtener todas las alertas
router.get('/', obtenerAlertas);

// GET - Obtener alerta por ID
router.get('/:id', obtenerAlertaPorId);

// POST - Crear nueva alerta
router.post('/', crearAlerta);

// PUT - Actualizar una alerta existente
router.put('/:id', actualizarAlerta);

// DELETE - Eliminar una alerta
router.delete('/:id', eliminarAlerta);

export default router;
