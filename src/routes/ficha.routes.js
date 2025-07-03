
// Importar dependencias
import express from 'express';
import {
  obtenerFichas,
  obtenerFichaPorId,
  crearFicha,
  actualizarFicha,
  eliminarFicha,
  cambiarEstadoFicha 
} from '../controllers/ficha.controller.js';

import verificarToken from '../middlewares/authMiddleware.js'; // Middleware de token
import autorizarRoles from '../middlewares/autorizarRol.js';   // Middleware por rol

const router = express.Router();

/**
 * ✅ Rutas protegidas por roles:
 * - Instructor (1) y Coordinador (2) pueden consultar, actualizar y eliminar fichas.
 * - Crear ficha queda habilitado también para ambos si lo decides.
 */

// GET - Ver todas las fichas
router.get('/', verificarToken, autorizarRoles(1, 2, 3), obtenerFichas);

// GET - Ver una ficha por ID
router.get('/:id', verificarToken, autorizarRoles(1, 2, 3), obtenerFichaPorId);

// POST - Crear nueva ficha
router.post('/', verificarToken, autorizarRoles(1, 2, 3), crearFicha);

// PUT - Actualizar ficha
router.put('/:id', verificarToken, autorizarRoles(1, 2, 3), actualizarFicha);

// DELETE - Eliminar ficha
router.delete('/:id', verificarToken, autorizarRoles(1, 2, 3), eliminarFicha);
// PATCH- activar desactivar  ficha
router.patch('/:id/estado', verificarToken, autorizarRoles(3), cambiarEstadoFicha);

export default router;
