
// Importar Express y el controlador
import express from 'express';
import {
  obtenerEstadosUsuarios,
  obtenerEstadoPorId,
  crearEstadoUsuario,
  actualizarEstadoUsuario,
  eliminarEstadoUsuario
} from '../controllers/estadoUsuario.controller.js';

const router = express.Router();

/**
 * Rutas para el CRUD de 'Activar_Desactivar_Usuarios'
 */

// GET - Todos los estados
router.get('/', obtenerEstadosUsuarios);

// GET - Estado por ID de usuario
router.get('/:id', obtenerEstadoPorId);

// POST - Crear estado (activación inicial)
router.post('/', crearEstadoUsuario);

// PUT - Actualizar estado (activar/desactivar)
router.put('/:id', actualizarEstadoUsuario);

// DELETE - Eliminar estado
router.delete('/:id', eliminarEstadoUsuario);

export default router;
