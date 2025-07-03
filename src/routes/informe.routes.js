
// Importar dependencias
import express from 'express';
import {
  generarInformePDF,
  generarInformePorFicha,
  generarInformePorAprendiz,
  obtenerResumenEstadisticas
} from '../controllers/informe.controller.js';

import verificarToken from '../middlewares/authMiddleware.js'; // Middleware de autenticación
import autorizarRoles from '../middlewares/autorizarRol.js';   // Middleware de control por roles

const router = express.Router();

/**
 * ✅ Rutas protegidas para roles:
 * - Rol 1 (Instructor) y Rol 2 (Coordinador) pueden acceder a los informes por ficha y aprendiz
 * - Solo Rol 1 puede acceder al PDF completo general y al resumen de estadísticas
 */

// 📄 Generar informe general en PDF (solo Instructor)
router.get('/pdf', verificarToken, autorizarRoles(1), generarInformePDF);

// 📊 Generar resumen de estadísticas institucionales (solo Instructor)
router.get('/estadisticas/resumen', verificarToken, autorizarRoles(1), obtenerResumenEstadisticas);

// 📘 Informe por ficha (Instructor y Coordinador)
router.get('/ficha/:id', verificarToken, autorizarRoles(1, 2), generarInformePorFicha);

// 👤 Informe por aprendiz (Instructor y Coordinador)
router.get('/aprendiz/:id', verificarToken, autorizarRoles(1, 2), generarInformePorAprendiz);

export default router;
