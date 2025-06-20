
// Importamos Express y el middleware
import express from 'express';
import verificarToken from '../middlewares/authMiddleware.js';

// Importamos los controladores de aprendices
import {
  obtenerAprendices,
  obtenerAprendizPorId,
  crearAprendiz,
  actualizarAprendiz,
  eliminarAprendiz
} from '../controllers/aprendiz.controller.js';

// Inicializamos el router
const router = express.Router();

/**
 * Rutas protegidas para el CRUD de 'Aprendices'
 * Todas requieren un token válido en el header Authorization
 */

// Obtener todos los aprendices
router.get('/', verificarToken, obtenerAprendices);

// Obtener aprendiz por ID
router.get('/:id', verificarToken, obtenerAprendizPorId);

// Crear nuevo aprendiz
router.post('/', verificarToken, crearAprendiz);

// Actualizar aprendiz existente
router.put('/:id', verificarToken, actualizarAprendiz);

// Eliminar aprendiz
router.delete('/:id', verificarToken, eliminarAprendiz);

// Exportamos el router
export default router;
