
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
 * Rutas para el CRUD de 'Fichas_de_Formacion'
 */

// GET - Todas las fichas
router.get('/', obtenerFichas);

// GET - Ficha por ID
router.get('/:id', obtenerFichaPorId);

// POST - Crear ficha
router.post('/', crearFicha);

// PUT - Actualizar ficha
router.put('/:id', actualizarFicha);

// DELETE - Eliminar ficha
router.delete('/:id', eliminarFicha);

export default router;
