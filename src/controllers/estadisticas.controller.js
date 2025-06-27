
import db from '../config/db.js';

// 🔹 Aprendices por ficha
export const estadisticaAprendicesPorFicha = async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT 
        f.ID_Ficha, 
        f.Nombre_Ficha, 
        COUNT(f.ID_Aprendiz) AS total_aprendices
      FROM fichas_de_formacion f
      GROUP BY f.ID_Ficha, f.Nombre_Ficha
    `);
    res.json(result);
  } catch (error) {
    console.error('❌ Error al obtener aprendices por ficha:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener estadísticas', error });
  }
};

// 🔹 Alertas por mes
export const estadisticaAlertasPorMes = async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT DATE_FORMAT(Fecha_Alerta, '%Y-%m') AS mes, COUNT(*) AS total_alertas
      FROM alertas
      GROUP BY mes
      ORDER BY mes
    `);
    res.json(result);
  } catch (error) {
    console.error('❌ Error al obtener alertas por mes:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener estadísticas', error });
  }
};

// 🔹 Total de aprendices
export const estadisticaTotalAprendices = async (req, res) => {
  try {
    const [result] = await db.query(`SELECT COUNT(*) AS total FROM aprendices`);
    res.json(result[0]);
  } catch (error) {
    console.error('❌ Error al contar aprendices:', error.message);
    res.status(500).json({ mensaje: 'Error al contar aprendices', error });
  }
};

// 🔹 Fichas activas e inactivas
export const estadisticaEstadoFichas = async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT Estado, COUNT(*) AS total
      FROM fichas_de_formacion
      GROUP BY Estado
    `);
    res.json(result);
  } catch (error) {
    console.error('❌ Error al obtener estado de fichas:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener estadísticas', error });
  }
};

// 🔹 Top 3 aprendices con más inasistencias
export const estadisticaTopInasistencias = async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT a.ID_Aprendiz, ap.Nombre, ap.Apellido,
      (
        (Lunes IN ('No asistió', 'No justificada')) +
        (Martes IN ('No asistió', 'No justificada')) +
        (Miércoles IN ('No asistió', 'No justificada')) +
        (Jueves IN ('No asistió', 'No justificada')) +
        (Viernes IN ('No asistió', 'No justificada'))
      ) AS total_inasistencias
      FROM asistencia a
      JOIN aprendices ap ON a.ID_Aprendiz = ap.ID_Aprendiz
      ORDER BY total_inasistencias DESC
      LIMIT 3
    `);
    res.json(result);
  } catch (error) {
    console.error('❌ Error al obtener top inasistencias:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener estadísticas', error });
  }
  
};

// 🔹 Resumen combinado de todas las estadísticas
export const estadisticaResumenGeneral = async (req, res) => {
  try {
    const [
      [totalAprendices],
      estadoFichas,
      aprendicesPorFicha,
      alertasPorMes,
      topInasistencias
    ] = await Promise.all([
      db.query('SELECT COUNT(*) AS total FROM aprendices'),
      db.query(`SELECT Estado, COUNT(*) AS total FROM fichas_de_formacion GROUP BY Estado`),
      db.query(`
        SELECT 
          f.ID_Ficha, f.Nombre_Ficha, COUNT(f.ID_Aprendiz) AS total_aprendices
        FROM fichas_de_formacion f
        GROUP BY f.ID_Ficha, f.Nombre_Ficha
      `),
      db.query(`
        SELECT DATE_FORMAT(Fecha_Alerta, '%Y-%m') AS mes, COUNT(*) AS total_alertas
        FROM alertas
        GROUP BY mes
        ORDER BY mes
      `),
      db.query(`
        SELECT a.ID_Aprendiz, ap.Nombre, ap.Apellido,
        (
          (Lunes IN ('No asistió', 'No justificada')) +
          (Martes IN ('No asistió', 'No justificada')) +
          (Miércoles IN ('No asistió', 'No justificada')) +
          (Jueves IN ('No asistió', 'No justificada')) +
          (Viernes IN ('No asistió', 'No justificada'))
        ) AS total_inasistencias
        FROM asistencia a
        JOIN aprendices ap ON a.ID_Aprendiz = ap.ID_Aprendiz
        ORDER BY total_inasistencias DESC
        LIMIT 3
      `)
    ]);

    res.json({
      totalAprendices: totalAprendices[0]?.total || 0,
      estadoFichas,
      aprendicesPorFicha,
      alertasPorMes,
      topInasistencias
    });
  } catch (error) {
    console.error('❌ Error al obtener resumen general:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener resumen', error });
  }
};
