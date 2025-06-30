const express = require('express');
const router = express.Router();
const PagoController = require('../controllers/PagoController');

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
