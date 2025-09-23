
// models/notificacion.model.js
// Importamos la conexión a la base de datos
import db from '../config/db.js';

const TABLA = 'Notificaciones'; // respeta el nombre real de tu tabla

class Notificacion {
  // Obtener todas las notificaciones (devuelve alias amigables)
  static async obtenerTodas() {
    const sql = `
      SELECT
        ID_Notificacion   AS id,
        Tipo_Solicitud    AS tipo,
        Fecha_Solicitud   AS fecha,
        Estado            AS estado,
        Hora_Solicitud    AS hora,
        Descripcion       AS descripcion
      FROM ${TABLA}
      ORDER BY Fecha_Solicitud DESC
    `;
    const [filas] = await db.query(sql);
    return filas;
  }

  // Obtener notificación por ID (con alias)
  static async obtenerPorId(id) {
    const sql = `
      SELECT
        ID_Notificacion   AS id,
        Tipo_Solicitud    AS tipo,
        Fecha_Solicitud   AS fecha,
        Estado            AS estado,
        Hora_Solicitud    AS hora,
        Descripcion       AS descripcion
      FROM ${TABLA}
      WHERE ID_Notificacion = ?
      LIMIT 1
    `;
    const [filas] = await db.query(sql, [id]);
    return filas[0];
  }

  // Crear nueva notificación
  // Recibe { tipo, estado='Pendiente', hora, descripcion }
  static async crear({ tipo, estado = 'Pendiente', hora, descripcion }) {
    const sql = `
      INSERT INTO ${TABLA}
      (Tipo_Solicitud, Estado, Hora_Solicitud, Descripcion, Fecha_Solicitud)
      VALUES (?, ?, ?, ?, NOW())
    `;
    const [resultado] = await db.query(sql, [tipo, estado, hora, descripcion]);
    return resultado.insertId;
  }

  // Actualizar una notificación (actualización parcial)
  // Recibe por ejemplo { estado: 'Atendida' } o cualquier combinación
  static async actualizar(id, campos) {
    // Mapeo de claves cortas -> columnas reales
    const mapa = {
      tipo:        'Tipo_Solicitud',
      estado:      'Estado',
      hora:        'Hora_Solicitud',
      descripcion: 'Descripcion',
      // Si algún día quieres permitir cambiar la fecha:
      // fecha:    'Fecha_Solicitud',
    };

    const sets = [];
    const valores = [];
    for (const [k, v] of Object.entries(campos || {})) {
      if (typeof v === 'undefined') continue;
      const columna = mapa[k];
      if (!columna) continue; // ignora claves desconocidas
      sets.push(`${columna} = ?`);
      valores.push(v);
    }

    if (sets.length === 0) {
      // Nada que actualizar
      return 0;
    }

    const sql = `
      UPDATE ${TABLA}
      SET ${sets.join(', ')}
      WHERE ID_Notificacion = ?
    `;
    valores.push(id);

    const [resultado] = await db.query(sql, valores);
    return resultado.affectedRows;
  }

  // Eliminar notificación
  static async eliminar(id) {
    const sql = `DELETE FROM ${TABLA} WHERE ID_Notificacion = ?`;
    const [resultado] = await db.query(sql, [id]);
    return resultado.affectedRows;
  }
}

export default Notificacion;
