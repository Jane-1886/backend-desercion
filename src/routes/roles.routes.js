import express from 'express';
import {
  crearRol,
  obtenerRoles
} from '../controllers/roles.controller.js';

import verificarToken from '../middlewares/authMiddleware.js';
import autorizarRoles from '../middlewares/autorizarRol.js';

const router = express.Router();

// Crear rol (solo administrador)
router.post('/', verificarToken, autorizarRoles(3), crearRol);

// Ver roles existentes (solo administrador)
router.get('/', verificarToken, autorizarRoles(3), obtenerRoles);

export default router;
