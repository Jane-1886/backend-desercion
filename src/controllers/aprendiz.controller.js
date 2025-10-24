// src/controllers/aprendiz.controller.js
import db from '../config/db.js';
import {
  getAllAprendices,
  getAprendizById,
  insertAprendiz,
  updateAprendiz,
  deleteAprendiz,
} from '../models/aprendiz.model.js';

// ---------- Helpers ----------
const pick = (...vals) => vals.find(v => v !== undefined && v !== null);

function normalizarAprendizRow(r) {
  return {
    id:        pick(r.ID_Aprendiz, r.Id_Aprendiz, r.id_aprendiz, r.aprendizId, r.id) ?? null,
    nombre:    pick(r.Nombre, r.Nombres, r.nombre, r.nombres, r.Primer_Nombre) ?? '',
    apellidos: pick(r.Apellidos, r.apellidos, r.Apellido, r.Segundo_Nombre) ?? '',
    documento: pick(r.Documento, r.Numero_Documento, r.documento, r.numero_documento) ?? '',
    email:     pick(r.Email, r.Correo, r.email, r.correo) ?? '',
    celular:   pick(r.Celular, r.Telefono, r.celular, r.telefono) ?? '',
    ficha:     pick(r.ID_Ficha, r.Id_Ficha, r.Ficha_ID, r.id_ficha, r.ficha) ?? null,
  };
}

// Intenta varias consultas (tabla/columna) hasta que una funcione
async function tryQueries(queries) {
  let lastErr;
  for (const q of queries) {
    try {
      const [rows] = await db.query(q.sql, q.params || []);
      return rows;
    } catch (e) {
      // Si es error por columna o tabla desconocida, probamos la siguiente
      if (e?.code === 'ER_BAD_FIELD_ERROR' || e?.code === 'ER_NO_SUCH_TABLE') {
        lastErr = e;
        continue;
      }
      // Otros errores se propagan
      throw e;
    }
  }
  if (lastErr) throw lastErr;
  return [];
}

/**
 * 📄 Obtener aprendices
 * - Si viene ?ficha=ID → lista solo los de esa ficha (probando diferentes esquemas)
 * - Si no viene → lista todos (usando tus modelos)
 */
export const obtenerAprendices = async (req, res) => {
  try {
    const hasFicha = Object.prototype.hasOwnProperty.call(req.query, 'ficha');

    if (hasFicha) {
      const ficha = Number(req.query.ficha);
      if (!Number.isFinite(ficha)) {
        return res.status(400).json({ mensaje: 'Parámetro ficha inválido' });
      }

      // Posibles tablas/columnas (ajusta el orden si ya sabes cuál es)
      const posiblesTablas = ['Aprendices', 'aprendices', 'Aprendiz', 'aprendiz'];
      const posiblesColumnas = ['ID_Ficha', 'Id_Ficha', 'Ficha_ID', 'id_ficha', 'ficha'];

      const queries = [];
      for (const t of posiblesTablas) {
        for (const c of posiblesColumnas) {
          queries.push({
            sql: `SELECT * FROM \`${t}\` WHERE \`${c}\` = ? ORDER BY 1 ASC`,
            params: [ficha],
          });
        }
      }

      const rows = await tryQueries(queries);
      const data = Array.isArray(rows) ? rows.map(normalizarAprendizRow) : [];
      return res.json(data);
    }

    // Sin filtro → usa el modelo y normaliza
    const all = await getAllAprendices();
    const list = Array.isArray(all) ? all.map(normalizarAprendizRow) : [];
    return res.json(list);
  } catch (error) {
    console.error('❌ obtenerAprendices:', {
      code: error?.code,
      errno: error?.errno,
      sqlState: error?.sqlState,
      sqlMessage: error?.sqlMessage,
      sql: error?.sql,
      message: error?.message,
    });
    return res.status(500).json({ mensaje: 'Error al obtener los aprendices' });
  }
};

/**
 * 🔍 Obtener un aprendiz por ID
 */
export const obtenerAprendizPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const raw = await getAprendizById(id);
    if (!raw) {
      return res.status(404).json({ mensaje: 'Aprendiz no encontrado' });
    }
    return res.json(normalizarAprendizRow(raw));
  } catch (error) {
    console.error('❌ obtenerAprendizPorId:', {
      code: error?.code, sqlMessage: error?.sqlMessage, message: error?.message
    });
    return res.status(500).json({ mensaje: 'Error al buscar el aprendiz' });
  }
};

/**
 * ➕ Crear un nuevo aprendiz
 * Body esperado (ajusta a tu esquema real):
 * { Nombre, Apellido, Estado }
 */
export const crearAprendiz = async (req, res) => {
  try {
    const { Nombre, Apellido, Estado } = req.body || {};
    if (!Nombre || !Apellido) {
      return res.status(400).json({ mensaje: 'Nombre y Apellido son obligatorios' });
    }
    const nuevoId = await insertAprendiz(Nombre, Apellido, Estado ?? 'ACTIVO');
    return res.status(201).json({ mensaje: 'Aprendiz creado', id: nuevoId });
  } catch (error) {
    console.error('❌ crearAprendiz:', {
      code: error?.code, sqlMessage: error?.sqlMessage, message: error?.message
    });
    return res.status(500).json({ mensaje: 'Error al crear el aprendiz' });
  }
};

/**
 * ✏️ Actualizar aprendiz por ID
 * Body esperado: { Nombre, Apellido, Estado }
 */
export const actualizarAprendiz = async (req, res) => {
  const { id } = req.params;
  try {
    const { Nombre, Apellido, Estado } = req.body || {};
    if (!Nombre && !Apellido && !Estado) {
      return res.status(400).json({ mensaje: 'No hay campos para actualizar' });
    }
    await updateAprendiz(id, Nombre ?? null, Apellido ?? null, Estado ?? null);
    return res.json({ mensaje: 'Aprendiz actualizado correctamente' });
  } catch (error) {
    console.error('❌ actualizarAprendiz:', {
      code: error?.code, sqlMessage: error?.sqlMessage, message: error?.message
    });
    return res.status(500).json({ mensaje: 'Error al actualizar el aprendiz' });
  }
};

/**
 * ❌ Eliminar aprendiz por ID
 */
export const eliminarAprendiz = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteAprendiz(id);
    return res.json({ mensaje: 'Aprendiz eliminado correctamente' });
  } catch (error) {
    console.error('❌ eliminarAprendiz:', {
      code: error?.code, sqlMessage: error?.sqlMessage, message: error?.message
    });
    return res.status(500).json({ mensaje: 'Error al eliminar el aprendiz' });
  }
};
