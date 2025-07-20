const Cliente = require('../models/Cliente');
const Admin = require('../models/Admin');
const { generateToken, hashPassword, comparePassword } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

class AuthController {
  // GET FORMULARIO DE LOGIN
  mostrarLogin(req, res) {
    res.render('auth/login', { error: null });
  }

  // GET FORMULARIO DE REGISTRO
  mostrarRegistro(req, res) {
    res.render('auth/register', { error: null });
  }

  // POST PROCESADO DE LOGIN
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // VALIDAR OJO
      if (!email || !password) {
        return res.render('auth/login', { 
          error: 'Todos los campos son requeridos' 
        });
      }

      let user = null;
      let userType = null;

      // ADMIN FIRSTS
      user = await Admin.findByEmail(email);
      if (user) {
        userType = 'admin';
      } else {
        // CLIENTS LATER OJO
        user = await Cliente.findByEmail(email);
        if (user) {
          userType = 'cliente';
        }
      }

      // SI EL USUARIO EXISTE?
      if (!user) {
        return res.render('auth/login', { 
          error: 'Credenciales inválidas' 
        });
      }

      // VERIFICAR LA CONTRASEÑA
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.render('auth/login', { 
          error: 'Credenciales inválidas' 
        });
      }

      // GENERAR TOKEN
      const token = generateToken({
        id: user.id,
        email: user.email,
        rol: user.rol || 'usuario',
        tipo: userType
      });

      // GUARDAR TOKEN PARA Q NO LE SAQUE
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
      });

      // REDIRIGIR SEGUN SI ES ADMIN O CLIENTE
      if (userType === 'admin') {
        res.redirect('/admin/dashboard');
      } else {
        res.redirect('/cliente/dashboard');
      }

    } catch (error) {
      console.error('Error en login:', error);
      res.render('auth/login', { 
        error: 'Error interno del servidor' 
      });
    }
  }

  // POST PROCESAR EL REGISTRO
  async register(req, res) {
    try {
      const { nombre, email, telefono, password, confirmPassword } = req.body;

      // Validación básica
      if (!nombre || !email || !telefono || !password || !confirmPassword) {
        return res.render('auth/register', { 
          error: 'Todos los campos son requeridos' 
        });
      }

      // REGEX PARA EL EMAIL OJO
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.render('auth/register', { 
          error: 'Formato de email inválido' 
        });
      }

      // PARA QUE LAS 2 CONTRASEÑAS SEAN IGUALES
      if (password !== confirmPassword) {
        return res.render('auth/register', { 
          error: 'Las contraseñas no coinciden' 
        });
      }

      // CONTRASEÑA NO MENOR DE 6 CARACTERES
      if (password.length < 6) {
        return res.render('auth/register', { 
          error: 'La contraseña debe tener al menos 6 caracteres' 
        });
      }

      // PARA NO REPETIR EMAILS
      const existingUser = await Cliente.findByEmail(email);
      if (existingUser) {
        return res.render('auth/register', { 
          error: 'El email ya está registrado' 
        });
      }

      // PASSWORD HASH
      const hashedPassword = await hashPassword(password);

      // CREAR NUEVO CLIENTE
      const nuevoCliente = await Cliente.create({
        nombre,
        email,
        telefono,
        password: hashedPassword,
        rol: 'usuario'
      });

      // GENERAR TOKEN
      const token = generateToken({
        id: nuevoCliente.id,
        email: nuevoCliente.email,
        rol: 'usuario',
        tipo: 'cliente'
      });

      // GUARDAR TOKEN EN COOKIE
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
      });

      res.redirect('/cliente/dashboard');

    } catch (error) {
      console.error('Error en registro:', error);
      res.render('auth/register', { 
        error: 'Error interno del servidor' 
      });
    }
  }

  // POST CERRAR SESION
  logout(req, res) {
    res.clearCookie('token');
    res.redirect('/');
  }

  // GET VERIFICAR EL TOKEN
  verifyToken(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.json({ 
        user: {
          id: decoded.id,
          email: decoded.email,
          rol: decoded.rol,
          tipo: decoded.tipo
        }
      });
    } catch (error) {
      res.status(401).json({ error: 'Token inválido' });
    }
  }
}

module.exports = new AuthController(); 