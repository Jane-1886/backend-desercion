
// Importamos Express y el controlador
import express from 'express';
import {
  obtenerAsistencias,
  obtenerAsistenciaPorId,
  crearAsistencia,
  actualizarAsistencia,
  eliminarAsistencia
} from '../controllers/asistencia.controller.js';

const router = express.Router();

/**
 * Rutas para manejar CRUD de la tabla 'Asistencia'
 */

// GET - Obtener todas las asistencias
router.get('/', obtenerAsistencias);

// GET - Obtener una asistencia por ID
router.get('/:id', obtenerAsistenciaPorId);

// POST - Crear una nueva asistencia
router.post('/', crearAsistencia);

// PUT - Actualizar una asistencia existente
router.put('/:id', actualizarAsistencia);

// DELETE - Eliminar una asistencia
router.delete('/:id', eliminarAsistencia);

export default router;
