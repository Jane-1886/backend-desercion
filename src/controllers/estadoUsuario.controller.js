
// Importamos el modelo
import EstadoUsuario from '../models/estadoUsuario.model.js';

/**
 * Controlador para manejar operaciones CRUD de la tabla 'Activar_Desactivar_Usuarios'
 */

// Obtener todos los estados
export const obtenerEstadosUsuarios = async (req, res) => {
  try {
    const datos = await EstadoUsuario.obtenerTodos();
    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener estados de usuarios', error });
  }
};

// Obtener estado por ID de usuario
export const obtenerEstadoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const estado = await EstadoUsuario.obtenerPorId(id);
    if (estado) {
      res.json(estado);
    } else {
      res.status(404).json({ mensaje: 'Estado no encontrado para el usuario' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener estado', error });
  }
};

// Crear nuevo estado (activación/desactivación inicial)
export const crearEstadoUsuario = async (req, res) => {
  const { idUsuario, estado } = req.body;
  try {
    const id = await EstadoUsuario.crear({ idUsuario, estado });
    res.status(201).json({ mensaje: 'Estado creado correctamente', id });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear estado', error });
  }
};

// Actualizar estado del usuario
export const actualizarEstadoUsuario = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const filas = await EstadoUsuario.actualizar(id, estado);
    if (filas > 0) {
      res.json({ mensaje: 'Estado actualizado correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Usuario no encontrado para actualizar estado' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar estado', error });
  }
};

// Eliminar estado de usuario
export const eliminarEstadoUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const filas = await EstadoUsuario.eliminar(id);
    if (filas > 0) {
      res.json({ mensaje: 'Estado eliminado correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Usuario no encontrado para eliminar estado' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar estado', error });
  }
};


/**
 * Cambia el estado de un usuario (Activo ↔ Inactivo)
 */
// PATCH /api/usuarios/:id/estado  body { estado, motivo?, observacion? }
export const cambiarEstadoUsuario = async (req, res) => {
  const { id } = req.params;
  const { estado, motivo, observacion } = req.body || {};

  const toUpper = (s) => String(s || '').trim().toUpperCase();
  const ESTADO = toUpper(estado);
  if (!['ACTIVO', 'INACTIVO'].includes(ESTADO)) {
    return res.status(400).json({ mensaje: 'Estado no válido. Usa "ACTIVO" o "INACTIVO".' });
  }
  const activo = ESTADO === 'ACTIVO' ? 1 : 0;

  try {
    if (ESTADO === 'INACTIVO') {
      // ⬇️ Desactivación: persiste motivo/observación/fecha (y opcionalmente quién lo hizo)
      const [r1] = await db.query(
        `UPDATE Usuarios
           SET Estado = ?, Activo = ? , 
               Motivo_Baja = ?, Observacion_Baja = ?, Fecha_Baja = CURRENT_TIMESTAMP,
               Baja_Por = ?
         WHERE ID_Usuario = ?`,
        [ESTADO, activo, motivo || null, observacion || null, req.user?.id || null, id]
      );
      if (r1.affectedRows === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
      return res.json({ mensaje: `Usuario ${id} actualizado a INACTIVO.`, estado: ESTADO, activo });
    } else {
      // ⬇️ Reactivación: por defecto limpiamos campos de baja (opcional)
      const [r2] = await db.query(
        `UPDATE Usuarios
           SET Estado = ?, Activo = ?, 
               Motivo_Baja = NULL, Observacion_Baja = NULL, Fecha_Baja = NULL, Baja_Por = NULL
         WHERE ID_Usuario = ?`,
        [ESTADO, activo, id]
      );
      if (r2.affectedRows === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
      return res.json({ mensaje: `Usuario ${id} actualizado a ACTIVO.`, estado: ESTADO, activo });
    }
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al cambiar estado del usuario', error: error.message });
  }
};
