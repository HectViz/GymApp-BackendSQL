const Membresia = require('../models/Membresia');
const Cliente = require('../models/Cliente');

class MembresiasController {
  // GET /membresias - LISTAR TODOS
  async listar(req, res) {
    try {
      const membresias = await Membresia.findAll();
      res.render('membresias/listar', { membresias });
    } catch (error) {
      console.error('Error listando membresías:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }

  // GET /membresias/:id - OBTENER UNA
  async obtenerUno(req, res) {
    try {
      const id = parseInt(req.params.id);
      const membresia = await Membresia.findById(id);

      if (!membresia) {
        return res.status(404).render('error', { 
          message: 'Membresía no encontrada',
          error: { status: 404, stack: 'La membresía solicitada no existe' }
        });
      }

      res.render('membresias/detalle', { membresia });
    } catch (error) {
      console.error('Error obteniendo membresía:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }

  // GET /membresias/crear - MENU DE CREACION
  async mostrarFormularioCrear(req, res) {
    try {
      const clientes = await Cliente.findAll();
      res.render('membresias/crear', { clientes });
    } catch (error) {
      console.error('Error obteniendo clientes para formulario:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }

  // POST /membresias - CREAR UNA
  async agregar(req, res) {
    try {
      const { clienteId, tipo, fechaInicio, fechaVencimiento, estado = 'Activa' } = req.body;
      
      // Validación básica
      if (!clienteId || !tipo || !fechaInicio || !fechaVencimiento) {
        return res.status(400).json({ 
          error: 'Todos los campos son requeridos' 
        });
      }

      const nuevaMembresia = await Membresia.create({ 
        clienteId: parseInt(clienteId), 
        tipo, 
        fechaInicio, 
        fechaVencimiento, 
        estado 
      });
      
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(201).json({ 
          mensaje: 'Membresía creada exitosamente',
          membresia: nuevaMembresia
        });
      }
      
      res.redirect('/membresias');
    } catch (error) {
      console.error('Error creando membresía:', error);
      
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

  // GET /membresias/:id/editar - MENU DE EDICION
  async mostrarFormularioEditar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const [membresia, clientes] = await Promise.all([
        Membresia.findById(id),
        Cliente.findAll()
      ]);

      if (!membresia) {
        return res.status(404).render('error', { 
          message: 'Membresía no encontrada',
          error: { status: 404, stack: 'La membresía solicitada no existe' }
        });
      }

      res.render('membresias/editar', { membresia, clientes });
    } catch (error) {
      console.error('Error obteniendo membresía para editar:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }

  // PUT /membresias/:id - ACTUALIZAR UNA
  async actualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { clienteId, tipo, fechaInicio, fechaVencimiento, estado } = req.body;

      // Validación básica
      if (!clienteId || !tipo || !fechaInicio || !fechaVencimiento || !estado) {
        return res.status(400).json({ 
          error: 'Todos los campos son requeridos' 
        });
      }

      const actualizada = await Membresia.update(id, { 
        clienteId: parseInt(clienteId), 
        tipo, 
        fechaInicio, 
        fechaVencimiento, 
        estado 
      });

      if (!actualizada) {
        return res.status(404).json({ 
          error: 'Membresía no encontrada' 
        });
      }

      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.json({ 
          mensaje: 'Membresía actualizada exitosamente' 
        });
      }
      
      res.redirect('/membresias');
    } catch (error) {
      console.error('Error actualizando membresía:', error);
      
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

  // DELETE /membresias/:id - ELIMINAR UNA
  async eliminar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const eliminada = await Membresia.delete(id);

      if (!eliminada) {
        return res.status(404).json({ 
          error: 'Membresía no encontrada' 
        });
      }

      res.json({ mensaje: 'Membresía eliminada exitosamente' });
    } catch (error) {
      console.error('Error eliminando membresía:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  // GET /membresias/activas - OBTENER ACTIVAS
  async obtenerActivas(req, res) {
    try {
      const membresias = await Membresia.findActive();
      res.render('membresias/activas', { membresias });
    } catch (error) {
      console.error('Error obteniendo membresías activas:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }
}

module.exports = new MembresiasController();
