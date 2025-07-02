
import express from 'express';
import { generarInformePDF,generarInformePorFicha} from '../controllers/informe.controller.js';
import { generarInformePorAprendiz } from '../controllers/informe.controller.js';
import { obtenerResumenEstadisticas } from '../controllers/informe.controller.js';
import verificarToken from '../middlewares/authMiddleware.js'; // Importación por default
import { autorizarRoles } from '../middlewares/autorizarRol.js';

const router = express.Router();

// Ruta: GET /api/informes/pdfimplementa el nuevo codigo y devuelveme todo listo para pegar y remplazar codigo completo desde el principio 
router.get('/pdf', generarInformePDF);
router.get('/resumen-estadisticas', generarInformePDF);
router.get('/ficha/:id', generarInformePorFicha); 
export default router;
router.get('/aprendiz/:id', generarInformePorAprendiz);

// ✅ Solo accesibles para el rol Instructor (ID_Rol = 1)
router.get('/pdf', verificarToken, autorizarRoles(1), generarInformePDF);
router.get('/resumen-estadisticas', verificarToken, autorizarRoles(1), generarInformePDF);
router.get('/ficha/:id', verificarToken, autorizarRoles(1), generarInformePorFicha);
router.get('/aprendiz/:id', verificarToken, autorizarRoles(1), generarInformePorAprendiz);
router.get('/estadisticas/resumen', verificarToken, autorizarRoles(1), obtenerResumenEstadisticas);
