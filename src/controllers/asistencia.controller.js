// src/controllers/asistencia.controller.js
import Asistencia from '../models/asistencia.model.js';
import db from '../config/db.js';

/* -------------------------- Helpers -------------------------- */
/** Normaliza el body recibido para evitar problemas con acentos/variantes */
function normalizarPayloadAsistencia(body = {}) {
  const {
    idAprendiz,
    Lunes = 0,
    Martes = 0,
    Jueves = 0,
    Viernes = 0,
    // soportar "Miércoles" o "Miercoles"
    ['Miércoles']: MiercolesConAcento,
    Miercoles: MiercolesSinAcento,
    // soportar "Fecha_Semana" o "Fecha"
    Fecha_Semana,
    Fecha
  } = body;

  const Miercoles = typeof MiercolesConAcento !== 'undefined'
    ? MiercolesConAcento
    : (typeof MiercolesSinAcento !== 'undefined' ? MiercolesSinAcento : 0);

  // Usa Fecha_Semana si viene, de lo contrario cae a Fecha
  const fechaSemana = typeof Fecha_Semana !== 'undefined' ? Fecha_Semana : Fecha;

  return {
    idAprendiz,
    Lunes,
    Martes,
    Miercoles,   // clave sin acento para el modelo/BD
    Jueves,
    Viernes,
    Fecha_Semana: fechaSemana,
    // dejamos también Fecha por compatibilidad si el modelo la usa
    Fecha: Fecha
  };
}

/** Obtiene id desde params, aceptando :id o :idAsistencia */
function getIdFromParams(params = {}) {
  return params.idAsistencia ?? params.id;
}

/* ---------------------- Controladores CRUD --------------------- */

// GET: todas las asistencias
export const obtenerAsistencias = async (_req, res) => {
  try {
    const datos = await Asistencia.obtenerTodas();
    res.json(datos);
  } catch (error) {
    console.error('❌ Error al obtener asistencias:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// GET: una asistencia por ID
export const obtenerAsistenciaPorId = async (req, res) => {
  const id = getIdFromParams(req.params);
  if (!id) return res.status(400).json({ mensaje: 'Falta parámetro id' });

  try {
    const asistencia = await Asistencia.obtenerPorId(id);
    if (!asistencia) return res.status(404).json({ mensaje: 'Asistencia no encontrada' });
    res.json(asistencia);
  } catch (error) {
    console.error('❌ Error al obtener asistencia:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// POST: crear asistencia
// body puede traer: { idAprendiz, Lunes, Martes, Miércoles|Miercoles, Jueves, Viernes, Fecha_Semana|Fecha }
export const crearAsistencia = async (req, res) => {
  try {
    const data = normalizarPayloadAsistencia(req.body);

    if (!data.idAprendiz) {
      return res.status(400).json({ mensaje: 'idAprendiz es obligatorio' });
    }

    const id = await Asistencia.crear(data);
    res.status(201).json({ mensaje: 'Asistencia registrada correctamente', id });
  } catch (error) {
    console.error('❌ Error al crear asistencia:', error?.message || error);
    res.status(500).json({ mensaje: 'Error al registrar asistencia' });
  }
};

// PUT: actualizar asistencia (params: :id o :idAsistencia)
export const actualizarAsistencia = async (req, res) => {
  const id = getIdFromParams(req.params);
  if (!id) return res.status(400).json({ mensaje: 'Falta parámetro id' });

  try {
    const data = normalizarPayloadAsistencia(req.body);
    const filas = await Asistencia.actualizar(id, data);
    if (filas > 0) return res.json({ mensaje: 'Asistencia actualizada correctamente' });
    return res.status(404).json({ mensaje: 'Asistencia no encontrada' });
  } catch (error) {
    console.error('❌ Error al actualizar asistencia:', error?.message || error);
    res.status(500).json({ mensaje: 'Error al actualizar asistencia' });
  }
};

// DELETE: eliminar asistencia (params: :id o :idAsistencia)
export const eliminarAsistencia = async (req, res) => {
  const id = getIdFromParams(req.params);
  if (!id) return res.status(400).json({ mensaje: 'Falta parámetro id' });

  try {
    const filas = await Asistencia.eliminar(id);
    if (filas > 0) return res.json({ mensaje: 'Asistencia eliminada correctamente' });
    return res.status(404).json({ mensaje: 'Asistencia no encontrada' });
  } catch (error) {
    console.error('❌ Error al eliminar asistencia:', error);
    res.status(500).json({ mensaje: 'Error al eliminar asistencia' });
  }
};

/* --------------- Historial por aprendiz (para el modal) --------------- */
// GET: /por-aprendiz/:id  → devuelve todas las filas de asistencia del aprendiz
export const obtenerAsistenciasPorAprendiz = async (req, res) => {
  const { id } = req.params; // ID_Aprendiz
  if (!id) return res.status(400).json({ mensaje: 'Falta parámetro id' });

  try {
    // Si el modelo tiene un método dedicado, úsalo.
    if (typeof Asistencia.obtenerPorAprendiz === 'function') {
      const filas = await Asistencia.obtenerPorAprendiz(id);
      return res.json(filas);
    }

    // Consulta defensiva: maneja Miércoles/Miercoles y Fecha_Semana/Fecha
    const [filas] = await db.query(
      `
      SELECT 
        a.ID_Asistencia,
        a.ID_Aprendiz,
        COALESCE(a.Lunes, 0)      AS Lunes,
        COALESCE(a.Martes, 0)     AS Martes,
        COALESCE(a.\`Miércoles\`, a.Miercoles, 0) AS Miercoles,
        COALESCE(a.Jueves, 0)     AS Jueves,
        COALESCE(a.Viernes, 0)    AS Viernes,
        COALESCE(a.Fecha_Semana, a.Fecha) AS Fecha_Semana
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
