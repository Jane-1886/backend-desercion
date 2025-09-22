
// src/models/estadoFicha.model.js
// Importamos la conexión a la base de datos (mysql2/promise pool)
import db from '../config/db.js';

/**
 * Modelo para la tabla 'Activar_Desactivar_Fichas'
 * - ID_Ficha (PK lógico)
 * - Estado: 'Activo' | 'Inactivo'
 * - Fecha_Cambio: TIMESTAMP (se actualiza al cambiar estado)
 */
class EstadoFicha {
  // -------------------------
  // Utilidades internas
  // -------------------------
  static #TABLE = 'Activar_Desactivar_Fichas';
  static #ALLOWED = new Set(['Activo', 'Inactivo']);

  /**
   * Normaliza valores de entrada a 'Activo' | 'Inactivo'
   * Acepta: booleanos, 0/1, strings (activo/inactivo, activa/inactiva, a/i)
   */
  static #normalizarEstado(estado) {
    if (estado === true || estado === 1 || estado === '1') return 'Activo';
    if (estado === false || estado === 0 || estado === '0') return 'Inactivo';

    const s = String(estado || '').trim().toLowerCase();
    if (['activo', 'activa', 'a'].includes(s)) return 'Activo';
    if (['inactivo', 'inactiva', 'i'].includes(s)) return 'Inactivo';

    // Si ya viene con la forma correcta, respétala
    if (EstadoFicha.#ALLOWED.has(estado)) return estado;

    throw new Error('Estado no válido. Usa "Activo" o "Inactivo".');
  }

  static #mapRow(row) {
    return {
      idFicha: String(row.ID_Ficha),
      estado: row.Estado,
      fechaCambio: row.Fecha_Cambio ?? null,
    };
  }

  // -------------------------
  // Métodos públicos
  // -------------------------

  /** Obtener todos los registros (sin filtros) */
  static async obtenerTodas() {
    const [filas] = await db.query(`SELECT * FROM \`${EstadoFicha.#TABLE}\``);
    return filas.map(EstadoFicha.#mapRow);
  }

  /** Obtener estado por ID de ficha (ID_Ficha) */
  static async obtenerPorId(idFicha) {
    const [filas] = await db.query(
      `SELECT * FROM \`${EstadoFicha.#TABLE}\` WHERE ID_Ficha = ?`,
      [idFicha]
    );
    return filas[0] ? EstadoFicha.#mapRow(filas[0]) : null;
  }

  /** Crear registro de estado */
  static async crear({ idFicha, estado }) {
    const est = EstadoFicha.#normalizarEstado(estado);
    const sql = `
      INSERT INTO \`${EstadoFicha.#TABLE}\` (ID_Ficha, Estado, Fecha_Cambio)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `;
    const [res] = await db.query(sql, [idFicha, est]);
    return res.insertId; // ojo: si ID_Ficha no es AUTO_INCREMENT, insertId puede ser 0
  }

  /** Actualizar estado existente */
  static async actualizar(idFicha, estado) {
    const est = EstadoFicha.#normalizarEstado(estado);
    const sql = `
      UPDATE \`${EstadoFicha.#TABLE}\`
      SET Estado = ?, Fecha_Cambio = CURRENT_TIMESTAMP
      WHERE ID_Ficha = ?
    `;
    const [res] = await db.query(sql, [est, idFicha]);
    return res.affectedRows; // >0 si actualizó
  }

  /** Eliminar registro por ficha */
  static async eliminar(idFicha) {
    const [res] = await db.query(
      `DELETE FROM \`${EstadoFicha.#TABLE}\` WHERE ID_Ficha = ?`,
      [idFicha]
    );
    return res.affectedRows;
  }

  /** Listar por estado ('Activo' | 'Inactivo') */
  static async listarPorEstado(estado) {
    const est = EstadoFicha.#normalizarEstado(estado);
    const [filas] = await db.query(
      `SELECT * FROM \`${EstadoFicha.#TABLE}\` WHERE Estado = ?`,
      [est]
    );
    return filas.map(EstadoFicha.#mapRow);
  }

  /** Atajo: todas las inactivas */
  static async obtenerInactivas() {
    return EstadoFicha.listarPorEstado('Inactivo');
  }

  /** Atajo: todas las activas */
  static async obtenerActivas() {
    return EstadoFicha.listarPorEstado('Activo');
  }

  /**
   * UPSERT: si existe la fila, actualiza; si no, crea.
   * Devuelve { action: 'create'|'update', affectedRows, estado }
   */
  static async upsert(idFicha, estado) {
    const est = EstadoFicha.#normalizarEstado(estado);

    const actual = await EstadoFicha.obtenerPorId(idFicha);
    if (actual) {
      const affected = await EstadoFicha.actualizar(idFicha, est);
      return { action: 'update', affectedRows: affected, estado: est };
    }
    await EstadoFicha.crear({ idFicha, estado: est });
    return { action: 'create', affectedRows: 1, estado: est };
  }

  /**
   * Cambiar estado (alias claro para upsert)
   * Retorna lo mismo que upsert.
   */
  static async cambiarEstado(idFicha, estado) {
    return EstadoFicha.upsert(idFicha, estado);
  }

  /** Conteo por estado (útil para estadísticas rápidas) */
  static async contarPorEstado() {
    const [filas] = await db.query(
      `SELECT Estado, COUNT(*) AS total FROM \`${EstadoFicha.#TABLE}\` GROUP BY Estado`
    );
    // normaliza a objeto {Activo: n, Inactivo: n}
    const out = { Activo: 0, Inactivo: 0 };
    for (const r of filas) {
      if (EstadoFicha.#ALLOWED.has(r.Estado)) out[r.Estado] = Number(r.total) || 0;
    }
    return out;
  }
}

export default EstadoFicha;
