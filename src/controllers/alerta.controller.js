
// Importamos el modelo
import Alerta from '../models/alerta.model.js';

/**
 * Controlador para manejar CRUD de la tabla 'Alertas'
 */

// Obtener todas las alertas
export const obtenerAlertas = async (req, res) => {
  try {
    const datos = await Alerta.obtenerTodas();
    res.json(datos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener alertas', error });
  }
};

// Obtener una alerta por ID
export const obtenerAlertaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const alerta = await Alerta.obtenerPorId(id);
    if (alerta) {
      res.json(alerta);
    } else {
      res.status(404).json({ mensaje: 'Alerta no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar la alerta', error });
  }
};

// Crear nueva alerta
export const crearAlerta = async (req, res) => {
  const { idAprendiz, estado } = req.body;
  try {
    const id = await Alerta.crear({ idAprendiz, estado });
    res.status(201).json({ mensaje: 'Alerta creada correctamente', id });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear la alerta', error });
  }
};

// Actualizar una alerta
export const actualizarAlerta = async (req, res) => {
  const { id } = req.params;
  const { idAprendiz, estado } = req.body;
  try {
    const filas = await Alerta.actualizar(id, { idAprendiz, estado });
    if (filas > 0) {
      res.json({ mensaje: 'Alerta actualizada correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Alerta no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar la alerta', error });
  }
};

// Eliminar una alerta
export const eliminarAlerta = async (req, res) => {
  const { id } = req.params;
  try {
    const filas = await Alerta.eliminar(id);
    if (filas > 0) {
      res.json({ mensaje: 'Alerta eliminada correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Alerta no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la alerta', error });
  }
};
