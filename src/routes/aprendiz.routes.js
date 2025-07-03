
import express from 'express';
import {
  obtenerAprendices,
  obtenerAprendizPorId,
  crearAprendiz,
  actualizarAprendiz,
  eliminarAprendiz
} from '../controllers/aprendiz.controller.js';

import verificarToken from '../middlewares/authMiddleware.js';
import autorizarRoles from '../middlewares/autorizarRol.js';

const router = express.Router();

/**
 * ✅ Rutas protegidas para el rol 3 (Administrador)
 */

// GET - Ver todos los aprendices
router.get('/', verificarToken, autorizarRoles(3), obtenerAprendices);

// GET - Ver un aprendiz por ID
router.get('/:id', verificarToken, autorizarRoles(3), obtenerAprendizPorId);

// POST - Crear nuevo aprendiz
router.post('/', verificarToken, autorizarRoles(3), crearAprendiz);

// PUT - Actualizar aprendiz
router.put('/:id', verificarToken, autorizarRoles(3), actualizarAprendiz);

// DELETE - Eliminar aprendiz
router.delete('/:id', verificarToken, autorizarRoles(3), eliminarAprendiz);

export default router;
