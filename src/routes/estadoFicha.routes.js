
// Importar Express y el controlador
import express from 'express';
import {
  obtenerEstadosFichas,
  obtenerEstadoFichaPorId,
  crearEstadoFicha,
  actualizarEstadoFicha,
  eliminarEstadoFicha,
  cambiarEstadoFicha 
} from '../controllers/estadoFicha.controller.js';

const router = express.Router();

/**
 * Rutas para CRUD de la tabla 'Activar_Desactivar_Fichas'
 */

// GET - Todas las fichas
router.get('/', obtenerEstadosFichas);

// GET - Estado por ID de ficha
router.get('/:id', obtenerEstadoFichaPorId);

// POST - Crear nuevo estado
router.post('/', crearEstadoFicha);

// PUT - Actualizar estado
router.put('/:id', actualizarEstadoFicha);

// DELETE - Eliminar estado
router.delete('/:id', eliminarEstadoFicha);

//Patch cambiar el estado de la ficha activo-inactivo
router.patch('/:id', cambiarEstadoFicha);


export default router;
