const Cliente = require('../models/Cliente');
const Membresia = require('../models/Membresia');
const Pago = require('../models/Pago');
const { pool } = require('../config/db');

class ClienteController {
  // GET DASHBOARD DEL CLIENTE
  async dashboard(req, res) {
    try {
      const clienteId = req.user.id;
      
      // INFO DEL CLIENTE
      const cliente = await Cliente.findById(clienteId);
      
      // MEMBRESIAS ACTIVAS
      const [membresiasActivas] = await pool.execute(`
        SELECT * FROM membresias 
        WHERE clienteId = ? AND estado = 'Activa'
        ORDER BY fechaVencimiento ASC
      `, [clienteId]);

      // ULTIMOS PAGOS
      const [ultimosPagos] = await pool.execute(`
        SELECT * FROM pagos 
        WHERE clienteId = ? 
        ORDER BY fechaPago DESC 
        LIMIT 5
      `, [clienteId]);

      // ESTADISTICAS DEL CLIENTE
      const [totalPagos] = await pool.execute(`
        SELECT COUNT(*) as total, SUM(monto) as montoTotal 
        FROM pagos 
        WHERE clienteId = ?
      `, [clienteId]);

      res.render('cliente/dashboard', {
        cliente,
        membresiasActivas,
        ultimosPagos,
        stats: {
          totalPagos: totalPagos[0].total,
          montoTotal: totalPagos[0].montoTotal || 0,
          membresiasActivas: membresiasActivas.length
        }
      });
    } catch (error) {
      console.error('Error en dashboard cliente:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }

  // GET PERFIL DEL CLIENTE
  async perfil(req, res) {
    try {
      const clienteId = req.user.id;
      const cliente = await Cliente.findById(clienteId);
      
      res.render('cliente/perfil', { cliente });
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }

  // GET MEMBRESIAS DEL CLIENTE
  async misMembresias(req, res) {
    try {
      const clienteId = req.user.id;
      
      const [membresias] = await pool.execute(`
        SELECT * FROM membresias 
        WHERE clienteId = ? 
        ORDER BY fechaInicio DESC
      `, [clienteId]);

      res.render('cliente/membresias', { membresias });
    } catch (error) {
      console.error('Error obteniendo membresías:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }

  // GET PAGOS DEL CLIENTE
  async misPagos(req, res) {
    try {
      const clienteId = req.user.id;
      const pagos = await Pago.findByClienteId(clienteId);
      
      res.render('cliente/pagos', { pagos });
    } catch (error) {
      console.error('Error obteniendo pagos:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }

  // GET FORMULARIO PARA INGRESAR PAGO
  mostrarFormularioPago(req, res) {
    res.render('cliente/crear-pago');
  }

  // POST CREAR PAGO NUEVO
  async crearPago(req, res) {
    try {
      const clienteId = req.user.id;
      const { fechaPago, monto, metodoPago, numero_confirmacion } = req.body;

      // VALIDAR OJO
      if (!fechaPago || !monto || !metodoPago || !numero_confirmacion) {
        return res.render('cliente/crear-pago', { 
          error: 'Todos los campos son requeridos' 
        });
      }

      // NUMERO DE CONFIRMACION OBLIGATORIO (inspirado en el terna de la uvm ojo)
      const existeConfirmacion = await Pago.checkNumeroConfirmacion(numero_confirmacion);
      if (existeConfirmacion) {
        return res.render('cliente/crear-pago', { 
          error: 'El número de confirmación ya existe' 
        });
      }

      // CREAR EL PAGO
      await Pago.create({
        clienteId,
        fechaPago,
        monto: parseFloat(monto),
        metodoPago,
        numero_confirmacion
      });

      res.redirect('/cliente/pagos');
    } catch (error) {
      console.error('Error creando pago:', error);
      res.render('cliente/crear-pago', { 
        error: 'Error interno del servidor' 
      });
    }
  }

  // ACTUALIZAR PERFIL
  async actualizarPerfil(req, res) {
    try {
      const clienteId = req.user.id;
      const { nombre, email, telefono } = req.body;

      // VALIDARR
      if (!nombre || !email || !telefono) {
        return res.status(400).json({ 
          error: 'Todos los campos son requeridos' 
        });
      }

      // MOSCA SI EL EMAIL YA EXISTE O NO
      const existingUser = await Cliente.findByEmail(email);
      if (existingUser && existingUser.id !== clienteId) {
        return res.status(400).json({ 
          error: 'El email ya está en uso' 
        });
      }

      // ACTUALIZAR PERFIL
      await Cliente.update(clienteId, { nombre, email, telefono });

      res.json({ mensaje: 'Perfil actualizado exitosamente' });
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }
}

module.exports = new ClienteController(); 