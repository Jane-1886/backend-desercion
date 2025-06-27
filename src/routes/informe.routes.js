
import express from 'express';
import { generarInformePDF,generarInformePorFicha} from '../controllers/informe.controller.js';

const router = express.Router();

// Ruta: GET /api/informes/pdf
router.get('/pdf', generarInformePDF);
router.get('/resumen-estadisticas', generarInformePDF);
router.get('/ficha/:id', generarInformePorFicha); 
export default router;
