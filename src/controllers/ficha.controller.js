
// Importamos el modelo
import Ficha from '../models/ficha.model.js';

/**
 * Controlador para manejar el CRUD de la tabla 'Fichas_de_Formacion'
 */

// Obtener todas las fichas
export const obtenerFichas = async (req, res) => {
  try {
    const datos = await Ficha.obtenerTodas();
    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener fichas', error });
  }
};

// Obtener ficha por ID
export const obtenerFichaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const ficha = await Ficha.obtenerPorId(id);
    if (ficha) {
      res.json(ficha);
    } else {
      res.status(404).json({ mensaje: 'Ficha no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar ficha', error });
  }
};

// Crear ficha
export const crearFicha = async (req, res) => {
  const { nombreFicha, descripcion, tipoPrograma, fechaInicio, fechaFin, estado, idAprendiz } = req.body;
  try {
    const id = await Ficha.crear({ nombreFicha, descripcion, tipoPrograma, fechaInicio, fechaFin, estado, idAprendiz });
    res.status(201).json({ mensaje: 'Ficha creada correctamente', id });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear ficha', error });
  }
};

// Actualizar ficha
export const actualizarFicha = async (req, res) => {
  const { id } = req.params;
  const { nombreFicha, descripcion, tipoPrograma, fechaInicio, fechaFin, estado, idAprendiz } = req.body;
  try {
    const filas = await Ficha.actualizar(id, { nombreFicha, descripcion, tipoPrograma, fechaInicio, fechaFin, estado, idAprendiz });
    if (filas > 0) {
      res.json({ mensaje: 'Ficha actualizada correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Ficha no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar ficha', error });
  }
};

// Eliminar ficha
export const eliminarFicha = async (req, res) => {
  const { id } = req.params;
  try {
    const filas = await Ficha.eliminar(id);
    if (filas > 0) {
      res.json({ mensaje: 'Ficha eliminada correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Ficha no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar ficha', error });
  }
};
