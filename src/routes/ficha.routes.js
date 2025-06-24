
// Importamos Express y el controlador de ficha
import express from 'express';
import {
  obtenerFichas,
  obtenerFichaPorId,
  crearFicha,
  actualizarFicha,
  eliminarFicha
} from '../controllers/ficha.controller.js';

const router = express.Router();

/**
 * 📚 Rutas para el CRUD de 'Fichas_de_Formacion'
 * Base: /api/fichas
 */

// ✅ Obtener todas las fichas
// GET /api/fichas
router.get('/', obtenerFichas);

// 🔍 Obtener ficha por ID
// GET /api/fichas/:id
router.get('/:id', obtenerFichaPorId);

// ➕ Crear ficha nueva
// POST /api/fichas
router.post('/', crearFicha);

// ✏️ Actualizar ficha existente
// PUT /api/fichas/:id
router.put('/:id', actualizarFicha);

// ❌ Eliminar ficha
// DELETE /api/fichas/:id
router.delete('/:id', eliminarFicha);

export default router;
