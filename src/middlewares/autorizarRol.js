export const autorizarRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    const usuario = req.usuario; // este lo añade el middleware de token

    if (!usuario || !rolesPermitidos.includes(usuario.ID_Rol)) {
      return res.status(403).json({ mensaje: 'Acceso denegado: no tienes permisos suficientes.' });
    }

    next(); // todo bien, sigue al siguiente middleware o controlador
  };
};


export default autorizarRoles;
