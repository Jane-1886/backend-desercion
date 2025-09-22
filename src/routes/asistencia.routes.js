// src/routes/asistencia.routes.js
import express from 'express';
import {
  obtenerAsistencias,
  obtenerAsistenciaPorId,
  crearAsistencia,
  actualizarAsistencia,
  eliminarAsistencia,
  obtenerAsistenciasPorAprendiz,
} from '../controllers/asistencia.controller.js';

import verificarToken from '../middlewares/authMiddleware.js';
import autorizarRoles from '../middlewares/autorizarRol.js';

const router = express.Router();

/**
 * Permisos:
 * - Rol 1 (Instructor): ver, crear, editar, eliminar
 * - Rol 2 (Coordinador): solo ver (GET)
 */

// Específica: historial por aprendiz (para el modal del front)
router.get('/por-aprendiz/:id', verificarToken, autorizarRoles(1, 2, 3), obtenerAsistenciasPorAprendiz);

// Ver una asistencia por su ID (detalle de un registro)
router.get('/una/:id', verificarToken, autorizarRoles(1, 2, 3), obtenerAsistenciaPorId);

// Genérica: ver todas las asistencias (o filtrar por query si tu modelo lo admite)
router.get('/', verificarToken, autorizarRoles(1, 2, 3), obtenerAsistencias);

// Crear asistencia (solo rol 1)
router.post('/', verificarToken, autorizarRoles(1), crearAsistencia);

// Actualizar asistencia (solo rol 1)
router.put('/:idAsistencia', verificarToken, autorizarRoles(1), actualizarAsistencia);

// Eliminar asistencia (solo rol 1)
router.delete('/:idAsistencia', verificarToken, autorizarRoles(1), eliminarAsistencia);

export default router;
