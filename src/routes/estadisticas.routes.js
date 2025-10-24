import express from 'express';
import {
  estadisticaAprendicesPorFicha,
  estadisticaAlertasPorMes,
  estadisticaTotalAprendices,
  estadisticaEstadoFichas,
  estadisticaTopInasistencias,
  estadisticaResumenGeneral
} from '../controllers/estadisticas.controller.js';

import verificarToken from '../middlewares/authMiddleware.js';
import autorizarRoles from '../middlewares/autorizarRol.js';

const router = express.Router();

/**
 * ✅ Rutas protegidas para roles 1 (Instructor) y 2 (Coordinador)
 * - Permiten acceder a diferentes reportes estadísticos
 */

// 🔹 Total de aprendices
router.get('/total-aprendices', verificarToken, autorizarRoles(1, 2,3), estadisticaTotalAprendices);

// 🔹 Fichas activas e inactivas
router.get('/estado-fichas', verificarToken, autorizarRoles(1, 2,3), estadisticaEstadoFichas);

// 🔹 Aprendices por ficha
router.get('/aprendices-ficha', verificarToken, autorizarRoles(1, 2,3), estadisticaAprendicesPorFicha);

// 🔹 Alertas generadas por mes
router.get('/alertas-mes', verificarToken, autorizarRoles(1, 2,3), estadisticaAlertasPorMes);

// 🔹 Top 3 aprendices con más inasistencias
router.get('/top-inasistencias', verificarToken, autorizarRoles(1, 2,3), estadisticaTopInasistencias);

// 🔹 Resumen general institucional
router.get('/resumen', verificarToken, autorizarRoles(1, 2,3), estadisticaResumenGeneral);

export default router;
