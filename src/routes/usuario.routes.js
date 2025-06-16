
// Importamos Express y el enrutador
import express from 'express';
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} from '../controllers/usuario.controller.js'; // Importamos los controladores

const router = express.Router();

/**
 * Rutas para CRUD de la tabla 'Usuarios'
 */

// GET - Obtener todos los usuarios
router.get('/', obtenerUsuarios);

// GET - Obtener un usuario por ID
router.get('/:id', obtenerUsuarioPorId);

// POST - Crear un nuevo usuario
router.post('/', crearUsuario);

// PUT - Actualizar un usuario existente
router.put('/:id', actualizarUsuario);

// DELETE - Eliminar un usuario por ID
router.delete('/:id', eliminarUsuario);

export default router;
