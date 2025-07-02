import express from 'express';
import {
  obtenerAsistencias,
  obtenerAsistenciaPorId,
  crearAsistencia,
  actualizarAsistencia,
  eliminarAsistencia
} from '../controllers/asistencia.controller.js';

import verificarToken from '../middlewares/authMiddleware.js';
import autorizarRoles from '../middlewares/autorizarRol.js';


const router = express.Router();

/**
 * Rutas protegidas para el rol Instructor (ID: 1)
 */

// GET - Obtener todas las asistencias de un aprendiz
router.get('/:idAprendiz', verificarToken, autorizarRoles(1), obtenerAsistencias);

// POST - Crear una nueva asistencia
router.post('/', verificarToken, autorizarRoles(1), crearAsistencia);

// PUT - Actualizar una asistencia
router.put('/:idAsistencia', verificarToken, autorizarRoles(1), actualizarAsistencia);

// DELETE - Eliminar asistencia
router.delete('/:idAsistencia', verificarToken, autorizarRoles(1), eliminarAsistencia);

// (Opcional) Consultar una asistencia específica
router.get('/una/:id', verificarToken, autorizarRoles(1), obtenerAsistenciaPorId);

export default router;
