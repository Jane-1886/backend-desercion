
// Importamos el modelo
import Ficha from '../models/ficha.model.js';

/**
 * 🎓 Controlador para manejar el CRUD de la tabla 'Fichas_de_Formacion'
 */

/**
 * 📄 Obtener todas las fichas
 * @route GET /api/fichas
 */
export const obtenerFichas = async (req, res) => {
  try {
    const datos = await Ficha.obtenerTodas();
    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener fichas', error });
  }
};

/**
 * 🔍 Obtener ficha por ID
 * @route GET /api/fichas/:id
 * @param {number} id - ID de la ficha a consultar
 */
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

/**
 * ➕ Crear ficha
 * @route POST /api/fichas
 * @body {string} nombreFicha
 * @body {string} descripcion
 * @body {string} tipoPrograma
 * @body {string} fechaInicio
 * @body {string} fechaFin
 * @body {string} estado
 * @body {number} idAprendiz
 */
export const crearFicha = async (req, res) => {
  const { nombreFicha, descripcion, tipoPrograma, fechaInicio, fechaFin, estado, idAprendiz } = req.body;
  try {
    const id = await Ficha.crear({ nombreFicha, descripcion, tipoPrograma, fechaInicio, fechaFin, estado, idAprendiz });
    res.status(201).json({ mensaje: 'Ficha creada correctamente', id });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear ficha', error });
  }
};

/**
 * ✏️ Actualizar ficha
 * @route PUT /api/fichas/:id
 * @param {number} id - ID de la ficha a actualizar
 */
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

/**
 * ❌ Eliminar ficha
 * @route DELETE /api/fichas/:id
 * @param {number} id - ID de la ficha a eliminar
 */
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
