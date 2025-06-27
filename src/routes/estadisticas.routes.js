import express from 'express';
import {
  estadisticaAprendicesPorFicha,
  estadisticaAlertasPorMes,
  estadisticaTotalAprendices,
  estadisticaEstadoFichas,
  estadisticaTopInasistencias,
  estadisticaResumenGeneral
} from '../controllers/estadisticas.controller.js';

const router = express.Router();

// 🔹 Ruta: Aprendices por ficha
router.get('/aprendices-ficha', estadisticaAprendicesPorFicha);

// 🔹 Ruta: Alertas por mes
router.get('/alertas-mes', estadisticaAlertasPorMes);

// 🔹 Ruta: Total de aprendices
router.get('/total-aprendices', estadisticaTotalAprendices);

// 🔹 Ruta: Fichas activas e inactivas
router.get('/estado-fichas', estadisticaEstadoFichas);

// 🔹 Ruta: Top 3 aprendices con más inasistencias
router.get('/top-inasistencias', estadisticaTopInasistencias);

// 🔹 Ruta: Resumen general
router.get('/resumen', estadisticaResumenGeneral);

export default router;
