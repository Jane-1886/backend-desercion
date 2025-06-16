
import {
  getAllAprendices,
  insertAprendiz,
  getAprendizById,
  updateAprendiz,
  deleteAprendiz
} from '../models/aprendiz.model.js';

export const obtenerAprendices = async (req, res) => {
  try {
    const aprendices = await getAllAprendices();
    res.json(aprendices);
  } catch (error) {
    console.error('❌ Error al obtener aprendices:', error.message);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};
export const crearAprendiz = async (req, res) => {
  try {
    const { Nombre, Apellido, Estado } = req.body;
    await insertAprendiz(Nombre, Apellido, Estado);
    res.status(201).json({ mensaje: 'Aprendiz creado exitosamente' });
  } catch (error) {
    console.error('❌ Error al crear aprendiz:', error.message);
    res.status(500).json({ mensaje: 'Error al insertar el aprendiz' });
  }
};
export const obtenerAprendizPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const aprendiz = await getAprendizById(id);
    if (!aprendiz) {
      return res.status(404).json({ mensaje: 'Aprendiz no encontrado' });
    }
    res.json(aprendiz);
  } catch (error) {
    console.error('❌ Error al obtener aprendiz:', error.message);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

export const actualizarAprendiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, Apellido, Estado } = req.body;
    await updateAprendiz(id, Nombre, Apellido, Estado);
    res.json({ mensaje: 'Aprendiz actualizado correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar aprendiz:', error.message);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

export const eliminarAprendiz = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteAprendiz(id);
    res.json({ mensaje: 'Aprendiz eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar aprendiz:', error.message);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

