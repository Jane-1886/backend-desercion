
// Importamos el modelo
import EstadoFicha from '../models/estadoFicha.model.js';

/**
 * Controlador para el CRUD de la tabla 'Activar_Desactivar_Fichas'
 */

// Obtener todos los estados de fichas
export const obtenerEstadosFichas = async (req, res) => {
  try {
    const datos = await EstadoFicha.obtenerTodas();
    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener estados de fichas', error });
  }
};

// Obtener estado por ID de ficha
export const obtenerEstadoFichaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const estado = await EstadoFicha.obtenerPorId(id);
    if (estado) {
      res.json(estado);
    } else {
      res.status(404).json({ mensaje: 'Estado no encontrado para esta ficha' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar estado de ficha', error });
  }
};

// Crear estado de ficha
export const crearEstadoFicha = async (req, res) => {
  const { idFicha, estado } = req.body;
  try {
    const id = await EstadoFicha.crear({ idFicha, estado });
    res.status(201).json({ mensaje: 'Estado de ficha creado correctamente', id });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear estado de ficha', error });
  }
};

// Actualizar estado de ficha
export const actualizarEstadoFicha = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const filas = await EstadoFicha.actualizar(id, estado);
    if (filas > 0) {
      res.json({ mensaje: 'Estado de ficha actualizado correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Ficha no encontrada para actualizar estado' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar estado de ficha', error });
  }
};

// Eliminar estado de ficha
export const eliminarEstadoFicha = async (req, res) => {
  const { id } = req.params;
  try {
    const filas = await EstadoFicha.eliminar(id);
    if (filas > 0) {
      res.json({ mensaje: 'Estado de ficha eliminado correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Ficha no encontrada para eliminar estado' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar estado de ficha', error });
  }
};

