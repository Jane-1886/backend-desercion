
import express from 'express';
import {
  obtenerAprendices,
  crearAprendiz,
  obtenerAprendizPorId,
  actualizarAprendiz,
  eliminarAprendiz
} from '../controllers/aprendiz.controller.js';



const router = express.Router();

// Consultar todos los aprendices
router.get('/', obtenerAprendices);

// Consultar uno por ID
router.get('/:id', obtenerAprendizPorId);

// Crear aprendiz
router.post('/', crearAprendiz);

// Actualizar aprendiz
router.put('/:id', actualizarAprendiz);

// Eliminar aprendiz
router.delete('/:id', eliminarAprendiz);



export default router;

