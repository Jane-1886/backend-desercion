
// Importar dependencias
import express from 'express';
import {
  obtenerAlertas,
  obtenerAlertaPorId,
  crearAlerta,
  actualizarAlerta,
  eliminarAlerta
} from '../controllers/alerta.controller.js';

import verificarToken from '../middlewares/authMiddleware.js'; // Verifica token JWT
import autorizarRoles from '../middlewares/autorizarRol.js';   // Autoriza acceso por rol

const router = express.Router();

/**
 * ✅ Rutas protegidas por roles:
 * Instructor (1) y Coordinador (2) pueden consultar, crear, editar o eliminar alertas.
 */

// GET - Listar todas las alertas
router.get('/', verificarToken, autorizarRoles(1, 2), obtenerAlertas);

// GET - Obtener una alerta específica por ID
router.get('/:id', verificarToken, autorizarRoles(1, 2), obtenerAlertaPorId);

// POST - Crear nueva alerta
router.post('/', verificarToken, autorizarRoles(1, 2), crearAlerta);

// PUT - Editar alerta existente
router.put('/:id', verificarToken, autorizarRoles(1, 2), actualizarAlerta);

// DELETE - Eliminar alerta
router.delete('/:id', verificarToken, autorizarRoles(1, 2), eliminarAlerta);

export default router;
