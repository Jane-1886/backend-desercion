
import express from 'express';
import {
  obtenerAprendices,
  obtenerAprendizPorId,
  crearAprendiz,
  actualizarAprendiz,
  eliminarAprendiz
} from '../controllers/aprendiz.controller.js';

const router = express.Router();

/**
 * 📄 Obtener todos los aprendices
 * @route GET /api/aprendices
 * @description Retorna una lista de todos los aprendices registrados
 */
router.get('/', obtenerAprendices);

/**
 * 🔍 Obtener aprendiz por ID
 * @route GET /api/aprendices/:id
 * @param {number} id - ID del aprendiz a consultar
 * @description Busca un aprendiz específico por su ID
 */
router.get('/:id', obtenerAprendizPorId);

/**
 * ➕ Crear nuevo aprendiz
 * @route POST /api/aprendices
 * @body {string} Nombre - Nombre del aprendiz
 * @body {string} Apellido - Apellido del aprendiz
 * @body {string} Estado - Estado del aprendiz (Activo/Inactivo)
 * @description Crea un nuevo registro de aprendiz
 */
router.post('/', crearAprendiz);

/**
 * ✏️ Actualizar aprendiz
 * @route PUT /api/aprendices/:id
 * @param {number} id - ID del aprendiz a actualizar
 * @body {string} Nombre - Nombre actualizado
 * @body {string} Apellido - Apellido actualizado
 * @body {string} Estado - Estado actualizado
 * @description Actualiza la información de un aprendiz existente
 */
router.put('/:id', actualizarAprendiz);

/**
 * ❌ Eliminar aprendiz
 * @route DELETE /api/aprendices/:id
 * @param {number} id - ID del aprendiz a eliminar
 * @description Elimina un aprendiz del sistema
 */
router.delete('/:id', eliminarAprendiz);

export default router;
