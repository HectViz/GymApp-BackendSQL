const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// MIDDLEWARE PARA AUTENTICAR TOKEN JWT OJO
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).render('access-denied', { 
      error: { message: 'No has iniciado sesión' }
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).render('access-denied', { 
        error: { message: 'Sesión expirada o inválida' }
      });
    }

    req.user = decoded;
    next();
  });
};

// MIDDLEWARE PARA VERIFICAR ADMIN
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).render('access-denied', { 
      error: { message: 'No has iniciado sesión' }
    });
  }

  if (req.user.tipo !== 'admin') {
    return res.status(403).render('access-denied', { 
      error: { message: 'Acceso denegado. Se requieren permisos de administrador.' }
    });
  }

  next();
};

// MIDDLEWARE PARA VERIFICAR CLIENTE
const requireCliente = (req, res, next) => {
  if (!req.user) {
    return res.status(401).render('access-denied', { 
      error: { message: 'No has iniciado sesión' }
    });
  }

  if (req.user.tipo !== 'cliente') {
    return res.status(403).render('access-denied', { 
      error: { message: 'Acceso denegado. Esta área es solo para clientes.' }
    });
  }

  next();
};

// MIDDLEWARE PARA IDENTIFICAR LA PROPIEDAD DEL RECURSO OJO
const requireOwnership = (req, res, next) => {
  if (!req.user) {
    return res.status(401).render('access-denied', { 
      error: { message: 'No has iniciado sesión' }
    });
  }

  // PARA Q LOS ADMINS PUEDAN VER TODO
  if (req.user.tipo === 'admin') {
    return next();
  }

  // PARA Q LOS CLIENTES SOLO ACCEDAN A SUS PROPIOS DATOS
  if (req.user.tipo === 'cliente') {
    const resourceId = parseInt(req.params.id);
    if (resourceId !== req.user.id) {
      return res.status(403).render('access-denied', { 
        error: { message: 'Solo puedes acceder a tus propios datos.' }
      });
    }
  }

  next();
};

// GENERAR JWT
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
  });
};

// PASSWORD HASH
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// PASSWORD COMPARAR
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireCliente,
  requireOwnership,
  generateToken,
  hashPassword,
  comparePassword
}; 