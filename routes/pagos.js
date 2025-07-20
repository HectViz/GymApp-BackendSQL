const express = require('express');
const router = express.Router();
const PagoController = require('../controllers/PagoController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);
router.use(requireAdmin);

// Rutas para vistas
router.get('/', PagoController.listar);
router.get('/crear', PagoController.mostrarFormularioCrear);
router.get('/estadisticas', PagoController.obtenerEstadisticas);
router.get('/:id', PagoController.obtenerUno);
router.get('/:id/editar', PagoController.mostrarFormularioEditar);

// Rutas para la API
router.post('/', PagoController.agregar);
router.put('/:id', PagoController.actualizar);
router.delete('/:id', PagoController.eliminar);

module.exports = router;
