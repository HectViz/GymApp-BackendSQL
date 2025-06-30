const Cliente = require('../models/Cliente');

class ClientesController {
  // GET /clientes - TODOS
  async listar(req, res) {
    try {
      const clientes = await Cliente.findAll();
      res.render('clientes/listar', { clientes });
    } catch (error) {
      console.error('Error listando clientes:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }

  // GET /clientes/:id - OBTENER UNO
  async obtenerUno(req, res) {
    try {
      const id = parseInt(req.params.id);
      const cliente = await Cliente.findByIdWithRelations(id);

      if (!cliente) {
        return res.status(404).render('error', { 
          message: 'Cliente no encontrado',
          error: { status: 404, stack: 'El cliente solicitado no existe' }
        });
      }

      res.render('clientes/detalle', { cliente });
    } catch (error) {
      console.error('Error obteniendo cliente:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }

  // GET /clientes/crear - MENU DE CREACION
  mostrarFormularioCrear(req, res) {
    res.render('clientes/crear');
  }

  // POST /clientes - CREAR NUEVO
  async agregar(req, res) {
    try {
      const { nombre, email, telefono } = req.body;
      
      // Validación básica
      if (!nombre || !email || !telefono) {
        return res.status(400).json({ 
          error: 'Todos los campos son requeridos' 
        });
      }

      const nuevoCliente = await Cliente.create({ nombre, email, telefono });
      
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(201).json({ 
          mensaje: 'Cliente creado exitosamente',
          cliente: nuevoCliente
        });
      }
      
      res.redirect('/clientes');
    } catch (error) {
      console.error('Error creando cliente:', error);
      
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

  // GET /clientes/:id/editar - MENU DE EDICION
  async mostrarFormularioEditar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const cliente = await Cliente.findById(id);

      if (!cliente) {
        return res.status(404).render('error', { 
          message: 'Cliente no encontrado',
          error: { status: 404, stack: 'El cliente solicitado no existe' }
        });
      }

      res.render('clientes/editar', { cliente });
    } catch (error) {
      console.error('Error obteniendo cliente para editar:', error);
      res.status(500).render('error', { 
        message: 'Error interno del servidor',
        error: { status: 500, stack: error.message }
      });
    }
  }

  // PUT /clientes/:id - ACTUALIZAR UNO
  async actualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { nombre, email, telefono } = req.body;

      // Validación básica
      if (!nombre || !email || !telefono) {
        return res.status(400).json({ 
          error: 'Todos los campos son requeridos' 
        });
      }

      const actualizado = await Cliente.update(id, { nombre, email, telefono });

      if (!actualizado) {
        return res.status(404).json({ 
          error: 'Cliente no encontrado' 
        });
      }

      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.json({ 
          mensaje: 'Cliente actualizado exitosamente' 
        });
      }
      
      res.redirect('/clientes');
    } catch (error) {
      console.error('Error actualizando cliente:', error);
      
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

  // DELETE /clientes/:id - ELIMINAR UNO
  async eliminar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const eliminado = await Cliente.delete(id);

      if (!eliminado) {
        return res.status(404).json({ 
          error: 'Cliente no encontrado' 
        });
      }

      res.json({ mensaje: 'Cliente eliminado exitosamente' });
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }
}

module.exports = new ClientesController();
