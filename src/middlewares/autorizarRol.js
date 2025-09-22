// src/middlewares/autorizarRol.js
// Acepta uno o varios roles, p.ej. autorizarRoles(1, 2, 3)
const autorizarRoles = (...rolesPermitidos) => {
  const permitidos = rolesPermitidos.map(String); // normaliza a string
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ mensaje: "No autenticado." });
    }
    // Ajusta estos alias al campo real de tu payload de login:
    const rol =
      req.usuario.ID_Rol ??
      req.usuario.idRol ??
      req.usuario.rol ??
      req.usuario.role ??
      req.usuario.roleId;

    if (rol == null) {
      return res.status(403).json({ mensaje: "Acceso denegado: rol no presente en el token." });
    }
    if (!permitidos.includes(String(rol))) {
      return res.status(403).json({ mensaje: "Acceso denegado: permisos insuficientes." });
    }
    next();
  };
};

export default autorizarRoles;
