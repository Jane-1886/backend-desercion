// src/routes/usuario.routes.js
import { Router } from 'express';
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  cambiarEstadoUsuario,
  obtenerUsuarioPorEmail,
  listarInstructores,           // 👈 nuevo
  listarInstructoresActivos,    // 👈 nuevo
  listarInstructoresInactivos,  // 👈 nuevo
} from '../controllers/usuario.controller.js';

import verificarToken from '../middlewares/authMiddleware.js';
import autorizarRoles from '../middlewares/autorizarRol.js';

const router = Router();

// Debug
router.get('/ping', (req, res) => res.json({ ok: true, where: 'usuarios' }));

// Buscar por email
router.get('/by-email/:email', verificarToken, autorizarRoles(1, 2, 3), obtenerUsuarioPorEmail);

// 🔽 Listados de instructores (rol=Instructor)
// GET /api/usuarios/instructores?estado=ACTIVO|INACTIVO (opcional)
router.get('/instructores', verificarToken, autorizarRoles(1, 2, 3), listarInstructores);
// Atajos:
router.get('/instructores/activos', verificarToken, autorizarRoles(1, 2, 3), listarInstructoresActivos);
router.get('/instructores/inactivos', verificarToken, autorizarRoles(1, 2, 3), listarInstructoresInactivos);

// LISTAR
router.get('/', verificarToken, autorizarRoles(1, 2, 3), obtenerUsuarios);

// OBTENER por ID
router.get('/:id', verificarToken, autorizarRoles(1, 2, 3), obtenerUsuarioPorId);

// CREAR
router.post('/', crearUsuario);

// ACTUALIZAR
router.put('/:id', verificarToken, autorizarRoles(1, 2, 3), actualizarUsuario);

// ELIMINAR
router.delete('/:id', verificarToken, autorizarRoles(1, 2, 3), eliminarUsuario);

// CAMBIAR ESTADO (activar/desactivar) — solo rol 3
router.patch('/:id/estado', verificarToken, autorizarRoles(3), cambiarEstadoUsuario);

export default router;
