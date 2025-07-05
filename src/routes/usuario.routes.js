// Importar dependencias
import express from 'express';
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  cambiarEstadoUsuario
} from '../controllers/usuario.controller.js';

import verificarToken from '../middlewares/authMiddleware.js'; // Middleware que valida el token JWT
import autorizarRoles from '../middlewares/autorizarRol.js';   // Middleware de control de acceso por rol

const router = express.Router();

/**
 * ✅ Rutas protegidas por roles:
 * - Instructor (1) y Coordinador (2) pueden consultar, actualizar y eliminar usuarios.
 * - Crear usuario no está protegido aquí porque es parte del registro general.
 */

// GET - Obtener lista de usuarios
router.get('/', verificarToken, autorizarRoles(1, 2, 3), obtenerUsuarios);

// GET - Obtener un usuario por su ID
router.get('/:id', verificarToken, autorizarRoles(1, 2, 3), obtenerUsuarioPorId);

// POST - Registrar nuevo usuario (deja sin protección o con rol específico si decides que solo el admin lo puede usar)
router.post('/', crearUsuario);

// PUT - Actualizar usuario
router.put('/:id', verificarToken, autorizarRoles(1, 2, 3), actualizarUsuario);

// DELETE - Eliminar usuario
router.delete('/:id', verificarToken, autorizarRoles(1, 2, 3), eliminarUsuario);


// PATCH- activar y desactivar usuarios
router.patch('/:id/estado', verificarToken, autorizarRoles(3), cambiarEstadoUsuario);
// routes/usuario.routes.js

router.get('/', verificarToken, autorizarRoles(3), obtenerUsuarios);



export default router;
