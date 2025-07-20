const Pago = require('../models/Pago');
const Cliente = require('../models/Cliente');

class PagoController {
  // GET /pagos - LISTAR TODOS
  async listar(req, res) {
    try {
      const pagos = await Pago.findAll();
      res.render('pagos/listar', { pagos });
    } catch (error) {
      console.error('Error listando pagos:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }

  // GET /pagos/:id - OBTENER UNO
  async obtenerUno(req, res) {
    try {
      const id = parseInt(req.params.id);
      const pago = await Pago.findById(id);

      if (!pago) {
        return res.status(404).render('error', { 
          message: 'Pago no encontrado',
          error: { status: 404, stack: 'El pago solicitado no existe' }
        });
      }

      res.render('pagos/detalle', { pago });
    } catch (error) {
      console.error('Error obteniendo pago:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }

  // GET /pagos/crear - MENU DE CREACION
  async mostrarFormularioCrear(req, res) {
    try {
      const clientes = await Cliente.findAll();
      res.render('pagos/crear', { clientes });
    } catch (error) {
      console.error('Error obteniendo clientes para formulario:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }

  // POST /pagos - CREAR UNO
  async agregar(req, res) {
    try {
      const { clienteId, fechaPago, monto, metodoPago = 'Efectivo', numero_confirmacion } = req.body;
      
      // Validación básica
      if (!clienteId || !fechaPago || !monto || !numero_confirmacion) {
        return res.status(400).json({ 
          error: 'Todos los campos son requeridos, incluyendo el número de confirmación' 
        });
      }

      // Verificar que el número de confirmación no exista
      const existeConfirmacion = await Pago.checkNumeroConfirmacion(numero_confirmacion);
      if (existeConfirmacion) {
        return res.status(400).json({ 
          error: 'El número de confirmación ya existe' 
        });
      }

      const nuevoPago = await Pago.create({ 
        clienteId: parseInt(clienteId), 
        fechaPago, 
        monto: parseFloat(monto), 
        metodoPago,
        numero_confirmacion
      });
      
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(201).json({ 
          mensaje: 'Pago creado exitosamente',
          pago: nuevoPago
        });
      }
      
      res.redirect('/pagos');
    } catch (error) {
      console.error('Error creando pago:', error);
      
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(500).json({ 
          error: 'Error interno del servidor' 
        });
      }
      
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }

  // GET /pagos/:id/editar - MENU DE EDICION
  async mostrarFormularioEditar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const [pago, clientes] = await Promise.all([
        Pago.findById(id),
        Cliente.findAll()
      ]);

      if (!pago) {
        return res.status(404).render('error', { 
          message: 'Pago no encontrado',
          error: { status: 404, stack: 'El pago solicitado no existe' }
        });
      }

      res.render('pagos/editar', { pago, clientes });
    } catch (error) {
      console.error('Error obteniendo pago para editar:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }

  // PUT /pagos/:id - ACTUALIZAR UNO
  async actualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { clienteId, fechaPago, monto, metodoPago, numero_confirmacion } = req.body;

      // Validación básica
      if (!clienteId || !fechaPago || !monto || !metodoPago || !numero_confirmacion) {
        return res.status(400).json({ 
          error: 'Todos los campos son requeridos, incluyendo el número de confirmación' 
        });
      }

      const actualizado = await Pago.update(id, { 
        clienteId: parseInt(clienteId), 
        fechaPago, 
        monto: parseFloat(monto), 
        metodoPago,
        numero_confirmacion
      });

      if (!actualizado) {
        return res.status(404).json({ 
          error: 'Pago no encontrado' 
        });
      }

      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.json({ 
          mensaje: 'Pago actualizado exitosamente' 
        });
      }
      
      res.redirect('/pagos');
    } catch (error) {
      console.error('Error actualizando pago:', error);
      
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(500).json({ 
          error: 'Error interno del servidor' 
        });
      }
      
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }

  // DELETE /pagos/:id - ELIMINAR UNO
  async eliminar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const eliminado = await Pago.delete(id);

      if (!eliminado) {
        return res.status(404).json({ 
          error: 'Pago no encontrado' 
        });
      }

      res.json({ mensaje: 'Pago eliminado exitosamente' });
    } catch (error) {
      console.error('Error eliminando pago:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  // GET /pagos/estadisticas - OBTENER ESTADISTICAS DE PAGO
  async obtenerEstadisticas(req, res) {
    try {
      const estadisticas = await Pago.getEstadisticas();
      res.render('pagos/estadisticas', { estadisticas });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }
}

module.exports = new PagoController();
