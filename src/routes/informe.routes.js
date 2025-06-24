
import express from 'express';
import { generarInformePDF } from '../controllers/informe.controller.js';

const router = express.Router();

// Ruta: GET /api/informes/pdf
router.get('/pdf', generarInformePDF);

export default router;
