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
 * ✅ Rutas protegidas:
 * - Rol 1: puede ver, crear, editar, eliminar
 * - Rol 2: solo puede ver (GET)
 */

// 🔍 GET - Ver todas las asistencias de un aprendiz (Instructor y Coordinador)
router.get('/:idAprendiz', verificarToken, autorizarRoles(1, 2), obtenerAsistencias);

// 🔍 GET - Ver una asistencia por ID (Instructor y Coordinador)
router.get('/una/:id', verificarToken, autorizarRoles(1, 2), obtenerAsistenciaPorId);

// ✅ POST - Registrar nueva asistencia (solo Instructor)
router.post('/', verificarToken, autorizarRoles(1), crearAsistencia);

// ✏️ PUT - Actualizar asistencia (solo Instructor)
router.put('/:idAsistencia', verificarToken, autorizarRoles(1), actualizarAsistencia);

// ❌ DELETE - Eliminar asistencia (solo Instructor)
router.delete('/:idAsistencia', verificarToken, autorizarRoles(1), eliminarAsistencia);

export default router;
