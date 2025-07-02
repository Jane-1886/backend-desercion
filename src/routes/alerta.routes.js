
// Importar Express y el controlador de alertas
import express from 'express';
import {
  obtenerAlertas,
  obtenerAlertaPorId,
  crearAlerta,
  actualizarAlerta,
  eliminarAlerta
} from '../controllers/alerta.controller.js';

import verificarToken from '../middlewares/authMiddleware.js';
import autorizarRol from '../middlewares/autorizarRol.js';


const router = express.Router();

/**
 * Rutas para CRUD de la tabla 'Alertas'
 */

// GET - Obtener todas las alertas
router.get('/', obtenerAlertas);

// GET - Obtener alerta por ID
router.get('/:id', obtenerAlertaPorId);

// POST - Crear nueva alerta
router.post('/', crearAlerta);

// PUT - Actualizar una alerta existente
router.put('/:id', actualizarAlerta);

// DELETE - Eliminar una alerta
router.delete('/:id', eliminarAlerta);

// ✅ Protegemos las rutas con rol Instructor (1)
router.get('/', verificarToken, autorizarRol(1), obtenerAlertas);
router.get('/:id', verificarToken, autorizarRol(1), obtenerAlertaPorId);
router.post('/', verificarToken, autorizarRol(1), crearAlerta);
router.put('/:id', verificarToken, autorizarRol(1), actualizarAlerta);
router.delete('/:id', verificarToken, autorizarRol(1), eliminarAlerta);


export default router;
