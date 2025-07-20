const Cliente = require('../models/Cliente');
const Membresia = require('../models/Membresia');
const Pago = require('../models/Pago');
const { pool } = require('../config/db');

class AdminController {
  // GET /admin/dashboard - Dashboard principal del admin
  async dashboard(req, res) {
    try {
      // Obtener estadísticas generales
      const [clientesCount] = await pool.execute('SELECT COUNT(*) as total FROM clientes');
      const [membresiasCount] = await pool.execute('SELECT COUNT(*) as total FROM membresias WHERE estado = "Activa"');
      const [pagosStats] = await pool.execute('SELECT SUM(monto) as total FROM pagos');
      const [pagosCount] = await pool.execute('SELECT COUNT(*) as total FROM pagos');

      // Obtener últimos clientes registrados
      const [ultimosClientes] = await pool.execute(`
        SELECT id, nombre, email, created_at 
        FROM clientes 
        ORDER BY created_at DESC 
        LIMIT 5
      `);

      // Obtener últimos pagos
      const [ultimosPagos] = await pool.execute(`
        SELECT p.*, c.nombre as clienteNombre 
        FROM pagos p 
        JOIN clientes c ON p.clienteId = c.id 
        ORDER BY p.created_at DESC 
        LIMIT 5
      `);

      res.render('admin/dashboard', {
        user: req.user,
        stats: {
          clientes: clientesCount[0].total,
          membresiasActivas: membresiasCount[0].total,
          totalPagos: pagosStats[0].total || 0,
          pagosCount: pagosCount[0].total
        },
        ultimosClientes,
        ultimosPagos
      });
    } catch (error) {
      console.error('Error en dashboard admin:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }

  // GET /admin/clientes - Listar todos los clientes
  async listarClientes(req, res) {
    try {
      const clientes = await Cliente.findAll();
      res.render('admin/clientes', { clientes });
    } catch (error) {
      console.error('Error listando clientes:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }

  // GET /admin/membresias - Listar todas las membresías
  async listarMembresias(req, res) {
    try {
      const membresias = await Membresia.findAll();
      res.render('admin/membresias', { membresias });
    } catch (error) {
      console.error('Error listando membresías:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }

  // GET /admin/pagos - Listar todos los pagos
  async listarPagos(req, res) {
    try {
      const pagos = await Pago.findAll();
      res.render('admin/pagos', { pagos });
    } catch (error) {
      console.error('Error listando pagos:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }

  // GET /admin/estadisticas - Estadísticas detalladas
  async estadisticas(req, res) {
    try {
      const [clientesPorMes] = await pool.execute(`
        SELECT DATE_FORMAT(created_at, '%Y-%m') as mes, COUNT(*) as total
        FROM clientes 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY mes DESC
      `);

      const [pagosPorMes] = await pool.execute(`
        SELECT DATE_FORMAT(fechaPago, '%Y-%m') as mes, SUM(monto) as total
        FROM pagos 
        WHERE fechaPago >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(fechaPago, '%Y-%m')
        ORDER BY mes DESC
      `);

      const [membresiasPorTipo] = await pool.execute(`
        SELECT tipo, COUNT(*) as total
        FROM membresias 
        WHERE estado = 'Activa'
        GROUP BY tipo
      `);

      const [pagosPorMetodo] = await pool.execute(`
        SELECT metodoPago, COUNT(*) as cantidad, SUM(monto) as total
        FROM pagos 
        GROUP BY metodoPago
      `);

      res.render('admin/estadisticas', {
        clientesPorMes,
        pagosPorMes,
        membresiasPorTipo,
        pagosPorMetodo
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }
}

module.exports = new AdminController(); 