const express = require('express');
const router = express.Router();
const MembresiasController = require('../controllers/MembresiasController');

// Rutas para vistas
router.get('/', MembresiasController.listar);
router.get('/crear', MembresiasController.mostrarFormularioCrear);
router.get('/activas', MembresiasController.obtenerActivas);
router.get('/:id', MembresiasController.obtenerUno);
router.get('/:id/editar', MembresiasController.mostrarFormularioEditar);

// Rutas para la API
router.post('/', MembresiasController.agregar);
router.put('/:id', MembresiasController.actualizar);
router.delete('/:id', MembresiasController.eliminar);

module.exports = router;
