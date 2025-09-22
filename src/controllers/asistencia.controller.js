// src/controllers/asistencia.controller.js
import Asistencia from '../models/asistencia.model.js';
import db from '../config/db.js';

// ------------------------------
// GET: todas las asistencias
// ------------------------------
export const obtenerAsistencias = async (req, res) => {
  try {
    const datos = await Asistencia.obtenerTodas();
    res.json(datos);
  } catch (error) {
    console.error('❌ Error al obtener asistencias:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// ------------------------------
// GET: una asistencia por ID
// ------------------------------
export const obtenerAsistenciaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const asistencia = await Asistencia.obtenerPorId(id);
    if (!asistencia) {
      return res.status(404).json({ mensaje: 'Asistencia no encontrada' });
    }
    res.json(asistencia);
  } catch (error) {
    console.error('❌ Error al obtener asistencia:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// ------------------------------
// POST: crear asistencia
// body: { idAprendiz, Lunes, Martes, Miércoles, Jueves, Viernes, Fecha_Semana? }
// ------------------------------
export const crearAsistencia = async (req, res) => {
  try {
    const { idAprendiz, Lunes, Martes, Miércoles, Jueves, Viernes, Fecha, Fecha_Semana } = req.body;
    const id = await Asistencia.crear({ idAprendiz, Lunes, Martes, Miércoles, Jueves, Viernes, Fecha, Fecha_Semana });
    res.status(201).json({ mensaje: 'Asistencia registrada correctamente', id });
  } catch (error) {
    console.error('❌ Error al crear asistencia:', error.message);
    res.status(500).json({ mensaje: 'Error al registrar asistencia' });
  }
};

// ------------------------------
// PUT: actualizar asistencia
// params: :idAsistencia
// ------------------------------
export const actualizarAsistencia = async (req, res) => {
  const { id } = req.params;
  const { idAprendiz, Lunes, Martes, Miércoles, Jueves, Viernes, Fecha, Fecha_Semana } = req.body;
  try {
    const filas = await Asistencia.actualizar(id, { idAprendiz, Lunes, Martes, Miércoles, Jueves, Viernes, Fecha, Fecha_Semana });
    if (filas > 0) res.json({ mensaje: 'Asistencia actualizada correctamente' });
    else res.status(404).json({ mensaje: 'Asistencia no encontrada' });
  } catch (error) {
    console.error('❌ Error al actualizar asistencia:', error.message);
    res.status(500).json({ mensaje: 'Error al actualizar asistencia' });
  }
};
// ------------------------------
// DELETE: eliminar asistencia
// params: :idAsistencia
// ------------------------------
export const eliminarAsistencia = async (req, res) => {
  const { idAsistencia } = req.params;
  try {
    const filas = await Asistencia.eliminar(idAsistencia);
    if (filas > 0) {
      res.json({ mensaje: 'Asistencia eliminada correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Asistencia no encontrada' });
    }
  } catch (error) {
    console.error('❌ Error al eliminar asistencia:', error);
    res.status(500).json({ mensaje: 'Error al eliminar asistencia' });
  }
};

// ------------------------------
// GET: historial por aprendiz
// params: /por-aprendiz/:id
// Devuelve todas las filas de asistencia de ese aprendiz (para tu modal)
// ------------------------------
export const obtenerAsistenciasPorAprendiz = async (req, res) => {
  const { id } = req.params; // id = ID_Aprendiz
  try {
    // Si tu modelo ya tiene este método, úsalo:
    if (typeof Asistencia.obtenerPorAprendiz === 'function') {
      const filas = await Asistencia.obtenerPorAprendiz(id);
      return res.json(filas);
    }

    // Si no, consulta directa defensiva (ajusta nombres de tabla/columnas a tu schema real)
    const [filas] = await db.query(
      `
      SELECT 
        a.ID_Asistencia,
        a.ID_Aprendiz,
        a.Lunes, a.Martes, a.Miércoles, a.Jueves, a.Viernes,
        a.Fecha_Semana, a.Fecha
      FROM asistencia a
      WHERE a.ID_Aprendiz = ?
      ORDER BY a.ID_Asistencia ASC
      `,
      [id]
    );

    res.json(filas);
  } catch (error) {
    console.error('❌ Error al obtener asistencias por aprendiz:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};
