
import express from 'express';
import { login } from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * Ruta pública para autenticación
 */
router.post('/login', login);

export default router;
