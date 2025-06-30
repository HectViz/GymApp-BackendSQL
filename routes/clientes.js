// routes/clientes.js

const express = require('express');
const router = express.Router();
const ClientesController = require('../controllers/ClientesController');

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
