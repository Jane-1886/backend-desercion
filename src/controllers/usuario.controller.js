// src/controllers/usuario.controller.js
import Usuario from '../models/usuario.model.js';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';
import jwt from 'jsonwebtoken';

/** =========================
 *  Utilidades
 *  ========================= */
const SECRET_KEY = process.env.JWT_SECRET || 'mi_clave_secreta';

/** Normaliza el estado a ACTIVO | INACTIVO (acepta booleanos/0-1/strings) */
const normEstado = (raw) => {
  const v = String(raw ?? '').trim().toUpperCase();
  if (v === 'ACTIVO' || v === 'INACTIVO') return v;
  if (['1', 'TRUE', 'SI', 'SÍ', 'YES'].includes(v)) return 'ACTIVO';
  if (['0', 'FALSE', 'NO'].includes(v)) return 'INACTIVO';
  throw new Error('Estado no válido. Usa "ACTIVO" o "INACTIVO".');
};

/** =========================
 *  Controladores
 *  ========================= */

// LISTAR usuarios (con rol)
export const obtenerUsuarios = async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.ID_Usuario        AS id,
        u.Nombre_Usuario    AS nombre,
        u.Email             AS email,
        u.ID_Rol            AS idRol,
        r.Nombre_Rol        AS rolNombre,
        u.Estado            AS estado,
        CASE WHEN u.Estado = 'ACTIVO' THEN 1 ELSE 0 END AS activo
      FROM Usuarios u
      JOIN Roles r ON u.ID_Rol = r.ID_Rol
    `);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener los usuarios', error: error.message });
  }
};

// OBTENER por ID
export const obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.obtenerPorId(id); // si tu modelo ya hace el join/alias, perfecto
    if (usuario) return res.json(usuario);

    // Fallback directo
    const [rows] = await db.query(`
      SELECT 
        u.ID_Usuario        AS id,
        u.Nombre_Usuario    AS nombre,
        u.Email             AS email,
        u.ID_Rol            AS idRol,
        u.Estado            AS estado,
        CASE WHEN u.Estado = 'ACTIVO' THEN 1 ELSE 0 END AS activo
      FROM Usuarios u
      WHERE u.ID_Usuario = ?
    `, [id]);

    if (rows.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el usuario', error: error.message });
  }
};

// OBTENER por EMAIL (lo necesita tu front)
export const obtenerUsuarioPorEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT 
        u.ID_Usuario        AS id,
        u.Nombre_Usuario    AS nombre,
        u.Email             AS email,
        u.ID_Rol            AS idRol,
        r.Nombre_Rol        AS rolNombre,
        u.Estado            AS estado,
        CASE WHEN u.Estado = 'ACTIVO' THEN 1 ELSE 0 END AS activo
      FROM Usuarios u
      LEFT JOIN Roles r ON u.ID_Rol = r.ID_Rol
      WHERE u.Email = ?
    `, [email]);

    if (rows.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuario por email', error: error.message });
  }
};

// CREAR
export const crearUsuario = async (req, res) => {
<<<<<<< HEAD
  console.log('📥 Datos recibidos del frontend:', req.body);
  const { nombre, contrasena, idRol, email, tipoDocumento, numeroDocumento, celular, estado = 'ACTIVO' } = req.body;

  if (!nombre || !contrasena || !idRol || !email) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios (nombre, contrasena, idRol, email).' });
  }

  try {
    // Validaciones simples (email/documento únicos)
    const [dupDoc] = await db.query('SELECT 1 FROM Usuarios WHERE Numero_Documento = ? AND ? IS NOT NULL', [numeroDocumento, numeroDocumento]);
    if (dupDoc.length > 0) return res.status(409).json({ mensaje: 'El número de documento ya existe.' });

    const [dupEmail] = await db.query('SELECT 1 FROM Usuarios WHERE Email = ?', [email]);
    if (dupEmail.length > 0) return res.status(409).json({ mensaje: 'Este correo ya está registrado.' });

    const hash = await bcrypt.hash(contrasena, 10);
    const ESTADO = normEstado(estado);
    const activo = ESTADO === 'ACTIVO' ? 1 : 0;

    const id = await Usuario.crear({
      Nombre_Usuario: nombre,
      Contraseña: hash,
      ID_Rol: idRol,
=======
  try {
    console.log('📥 Datos recibidos del frontend:', req.body);

    let {
      nombre,
      contrasena,
      idRol,
      email,
      tipoDocumento = null,
      numeroDocumento = null,
      celular = null,
    } = req.body;

    // Validación básica
    if (!nombre || !contrasena || !idRol || !email) {
      return res.status(400).json({
        mensaje: 'Faltan datos obligatorios (nombre, contrasena, idRol, email).',
      });
    }

    // Normaliza
    nombre = String(nombre).trim();
    email = String(email).trim();
    const rolNum = Number.parseInt(idRol, 10);
    if (!Number.isInteger(rolNum) || rolNum <= 0) {
      return res.status(400).json({ mensaje: 'idRol inválido (entero > 0).' });
    }

    // Duplicados
    if (numeroDocumento) {
      const [dupDoc] = await db.query(
        'SELECT 1 FROM Usuarios WHERE Numero_Documento = ? LIMIT 1',
        [String(numeroDocumento).trim()]
      );
      if (dupDoc.length > 0) {
        return res.status(409).json({ mensaje: 'El número de documento ya existe.' });
      }
    }

    const [dupEmail] = await db.query(
      'SELECT 1 FROM Usuarios WHERE Email = ? LIMIT 1',
      [email]
    );
    if (dupEmail.length > 0) {
      return res.status(409).json({ mensaje: 'Este correo ya está registrado.' });
    }

    // Hash
    const hash = await bcrypt.hash(contrasena, 10);

    // Insert (coincide con tu modelo/tabla)
    const id = await Usuario.crear({
      Nombre_Usuario: nombre,
      Contrasena: hash,          // OJO: sin tilde
      ID_Rol: rolNum,
>>>>>>> 63a8aa6 (Inicialización del repositorio backend: estructura Node/Express, controladores y conexión MySQL)
      Email: email,
      Tipo_Documento: tipoDocumento || null,
      Numero_Documento: numeroDocumento || null,
      Celular: celular || null,
<<<<<<< HEAD
      Estado: ESTADO,
      Activo: activo
    });

    res.status(201).json({ mensaje: 'Usuario creado correctamente', id });
  } catch (error) {
    if (error?.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ mensaje: 'Este correo ya está registrado' });
    }
    console.error('❌ Error al crear el usuario:', error);
    res.status(500).json({ mensaje: 'Error al crear el usuario' });
=======
    });

    return res.status(201).json({ mensaje: 'Usuario creado correctamente', id });
  } catch (error) {
    if (error?.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ mensaje: 'Valor duplicado (nombre, email o documento).' });
    }
    console.error('❌ Error al crear el usuario:', {
      code: error?.code,
      errno: error?.errno,
      sqlState: error?.sqlState,
      sqlMessage: error?.sqlMessage,
      sql: error?.sql,
      message: error?.message,
    });
    return res.status(500).json({ mensaje: 'Error al crear el usuario' });
>>>>>>> 63a8aa6 (Inicialización del repositorio backend: estructura Node/Express, controladores y conexión MySQL)
  }
};

// ACTUALIZAR (solo campos enviados; hashea si viene contraseña)
export const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, contrasena, idRol, email, tipoDocumento, numeroDocumento, celular, estado } = req.body || {};

  try {
    const payload = {};

    if (nombre !== undefined) payload.Nombre_Usuario = nombre;
    if (email !== undefined)  payload.Email = email;
    if (idRol !== undefined)  payload.ID_Rol = idRol;
    if (tipoDocumento !== undefined) payload.Tipo_Documento = tipoDocumento || null;
    if (numeroDocumento !== undefined) payload.Numero_Documento = numeroDocumento || null;
    if (celular !== undefined) payload.Celular = celular || null;

    if (estado !== undefined) {
      const ESTADO = normEstado(estado);
      payload.Estado = ESTADO;
      payload.Activo = ESTADO === 'ACTIVO' ? 1 : 0;
    }

    if (contrasena !== undefined && String(contrasena).length > 0) {
      payload.Contraseña = await bcrypt.hash(contrasena, 10);
    }

    // Si no hay nada que actualizar:
    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ mensaje: 'No hay campos para actualizar.' });
    }

    const filasAfectadas = await Usuario.actualizar(id, payload);

    if (filasAfectadas > 0) res.json({ mensaje: 'Usuario actualizado correctamente' });
    else res.status(404).json({ mensaje: 'Usuario no encontrado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el usuario', error: error.message });
  }
};

// ELIMINAR
export const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const filasAfectadas = await Usuario.eliminar(id);
    if (filasAfectadas > 0) res.json({ mensaje: 'Usuario eliminado correctamente' });
    else res.status(404).json({ mensaje: 'Usuario no encontrado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el usuario', error: error.message });
  }
};

// CAMBIAR ESTADO (activar/desactivar) — PATCH /api/usuarios/:id/estado
export const cambiarEstadoUsuario = async (req, res) => {
  const { id } = req.params;
  const { estado, motivo, observacion } = req.body || {};

  let ESTADO;
  try {
    ESTADO = normEstado(estado); // ACTIVO | INACTIVO
  } catch (e) {
    return res.status(400).json({ mensaje: e.message });
  }

  const activo = ESTADO === 'ACTIVO' ? 1 : 0;

  try {
    // Actualiza estado/activo (si no tienes columna Activo, este update igual funcionará; si falla por columna inexistente, ejecutamos fallback)
    let r1;
    try {
      [r1] = await db.query(
        `UPDATE Usuarios SET Estado = ?, Activo = ? WHERE ID_Usuario = ?`,
        [ESTADO, activo, id]
      );
    } catch (e) {
      if (e?.code === 'ER_BAD_FIELD_ERROR') {
        // Fallback si no existe columna Activo
        [r1] = await db.query(
          `UPDATE Usuarios SET Estado = ? WHERE ID_Usuario = ?`,
          [ESTADO, id]
        );
      } else {
        throw e;
      }
    }

    if (r1.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    // (Opcional) Auditoría si tienes columnas:
    // await db.query(
    //   `UPDATE Usuarios
    //      SET Motivo_Baja = ?, Observacion_Baja = ?, Fecha_Baja = CURRENT_TIMESTAMP
    //    WHERE ID_Usuario = ?`,
    //   [motivo || null, observacion || null, id]
    // );

    res.json({ mensaje: `Usuario ${id} actualizado a ${ESTADO}.`, estado: ESTADO, activo });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al cambiar estado del usuario', error: error.message });
  }
};

// CARGAR INSTRUCTOR rápido (ID_Rol = 2)
export const cargarInstructor = async (req, res) => {
  const { nombre, email, contrasena } = req.body;

  if (!nombre || !email || !contrasena) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  try {
    const [existe] = await db.query('SELECT 1 FROM Usuarios WHERE Email = ?', [email]);
    if (existe.length > 0) {
      return res.status(409).json({ mensaje: 'Este correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await db.query(
      `INSERT INTO Usuarios (Nombre_Usuario, Email, Contraseña, ID_Rol, Estado, Activo)
       VALUES (?, ?, ?, 2, 'ACTIVO', 1)`,
      [nombre.trim(), email.trim(), hashedPassword]
    );

    res.status(201).json({ mensaje: 'Instructor registrado correctamente' });
  } catch (error) {
    console.error('❌ Error al registrar instructor:', error);
    res.status(500).json({ mensaje: 'Error interno al registrar el instructor', error: error.message });
  }
};

// LOGIN
export const loginUsuario = async (req, res) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios' });
  }

  try {
    const [resultado] = await db.query('SELECT * FROM Usuarios WHERE Email = ?', [email]);

    if (resultado.length === 0) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas (email)' });
    }
    const usuario = resultado[0];

    const contraseñaValida = await bcrypt.compare(contrasena, usuario.Contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas (contraseña)' });
    }

    // (Opcional) bloquear login si está INACTIVO:
    // if (usuario.Estado !== 'ACTIVO') {
    //   return res.status(403).json({ mensaje: 'Usuario inactivo' });
    // }

    const token = jwt.sign(
      {
        id: usuario.ID_Usuario,
        rol: usuario.ID_Rol,
        nombre: usuario.Nombre_Usuario,
        email: usuario.Email,
      },
      SECRET_KEY,
      { expiresIn: '4h' }
    );

    res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      nombre: usuario.Nombre_Usuario,
      idRol: usuario.ID_Rol, // 👈 corregido
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
};

// 👇 Configura aquí el ID de rol para INSTRUCTOR
const INSTRUCTOR_ROLE_ID = 1;

/** GET /api/usuarios/instructores?estado=ACTIVO|INACTIVO (opcional) */
export const listarInstructores = async (req, res) => {
  try {
    const estado = (req.query.estado || '').toString().toUpperCase();
    const hasEstado = estado === 'ACTIVO' || estado === 'INACTIVO';

    const params = [INSTRUCTOR_ROLE_ID];
    let whereEstado = '';
    if (hasEstado) {
      whereEstado = ' AND u.Estado = ? ';
      params.push(estado);
    }

    const [rows] = await db.query(
      `
      SELECT 
        u.ID_Usuario        AS id,
        u.Nombre_Usuario    AS nombre,
        u.Email             AS email,
        u.ID_Rol            AS idRol,
        r.Nombre_Rol        AS rolNombre,
        u.Estado            AS estado,
        CASE WHEN u.Estado = 'ACTIVO' THEN 1 ELSE 0 END AS activo
      FROM Usuarios u
      JOIN Roles r ON r.ID_Rol = u.ID_Rol
      WHERE u.ID_Rol = ? ${whereEstado}
      ORDER BY u.Nombre_Usuario ASC
      `,
      params
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar instructores', error: error.message });
  }
};

export const listarInstructoresInactivos = async (req, res) => {
  req.query.estado = 'INACTIVO';
  return listarInstructores(req, res);
};

export const listarInstructoresActivos = async (req, res) => {
  req.query.estado = 'ACTIVO';
  return listarInstructores(req, res);
};


