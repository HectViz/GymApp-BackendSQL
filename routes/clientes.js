// routes/clientes.js

const express = require('express');
const router = express.Router();
const ClientesController = require('../controllers/ClientesController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);
router.use(requireAdmin);

// Rutas para vistas
router.get('/', ClientesController.listar);
router.get('/crear', ClientesController.mostrarFormularioCrear);
router.get('/:id', ClientesController.obtenerUno);
router.get('/:id/editar', ClientesController.mostrarFormularioEditar);

// Rutas para la API
router.post('/', ClientesController.agregar);
router.put('/:id', ClientesController.actualizar);
router.delete('/:id', ClientesController.eliminar);

module.exports = router;
