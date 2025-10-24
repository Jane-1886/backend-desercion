// src/middlewares/autorizarRol.js
// Uso: autorizarRoles(1,2,3) o autorizarRoles([1,2,3])
const autorizarRoles = (...roles) => {
  const permitidos = roles.flat().map(n => Number(n)).filter(n => Number.isFinite(n));

  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ mensaje: "No autenticado." });
    }
    const rol = Number(req.usuario.rol);
    if (!Number.isFinite(rol)) {
      return res.status(403).json({ mensaje: "Acceso denegado: rol no presente o inválido en el token." });
    }
    if (!permitidos.includes(rol)) {
      return res.status(403).json({ mensaje: "Acceso denegado: permisos insuficientes." });
    }
    next();
  };
};

export default autorizarRoles;
