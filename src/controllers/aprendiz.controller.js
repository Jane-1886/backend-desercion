
import {
  getAllAprendices,
  getAprendizById,
  insertAprendiz,
  updateAprendiz,
  deleteAprendiz
} from '../models/aprendiz.model.js';

/**
 * 📄 Obtener todos los aprendices
 */
export const obtenerAprendices = async (req, res) => {
  try {
    const aprendices = await getAllAprendices();
    res.json(aprendices);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los aprendices', error });
  }
};

/**
 * 🔍 Obtener un aprendiz por ID
 * @param {Object} req - Petición HTTP
 * @param {Object} res - Respuesta HTTP
 */
export const obtenerAprendizPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const aprendiz = await getAprendizById(id);
    if (!aprendiz) {
      return res.status(404).json({ mensaje: 'Aprendiz no encontrado' });
    }
    res.json(aprendiz);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar el aprendiz', error });
  }
};

/**
 * ➕ Crear un nuevo aprendiz
 * @param {Object} req.body - Debe contener Nombre, Apellido y Estado
 */
export const crearAprendiz = async (req, res) => {
  const { Nombre, Apellido, Estado } = req.body;
  try {
    const nuevoId = await insertAprendiz(Nombre, Apellido, Estado);
    res.status(201).json({ mensaje: 'Aprendiz creado', id: nuevoId });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el aprendiz', error });
  }
};

/**
 * ✏️ Actualizar aprendiz por ID
 * @param {Object} req - Contiene ID en params y nuevos datos en body
 */
export const actualizarAprendiz = async (req, res) => {
  const { id } = req.params;
  const { Nombre, Apellido, Estado } = req.body;
  try {
    await updateAprendiz(id, Nombre, Apellido, Estado);
    res.json({ mensaje: 'Aprendiz actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el aprendiz', error });
  }
};

/**
 * ❌ Eliminar aprendiz por ID
 * @param {Object} req - Contiene ID en params
 */
export const eliminarAprendiz = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteAprendiz(id);
    res.json({ mensaje: 'Aprendiz eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el aprendiz', error });
  }
};
