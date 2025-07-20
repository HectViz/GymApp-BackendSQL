const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const ClientesController = require('../controllers/ClientesController');
const MembresiasController = require('../controllers/MembresiasController');
const PagoController = require('../controllers/PagoController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Middleware de autenticación para todas las rutas de admin
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard y vistas principales
router.get('/dashboard', AdminController.dashboard);
router.get('/estadisticas', AdminController.estadisticas);

// Gestión de clientes
router.get('/clientes', (req, res) => {
    res.redirect('/clientes');
});

router.get('/clientes/crear', ClientesController.mostrarFormularioCrear);
router.get('/clientes/:id', ClientesController.obtenerUno);
router.get('/clientes/:id/editar', ClientesController.mostrarFormularioEditar);
router.post('/clientes', ClientesController.agregar);
router.put('/clientes/:id', ClientesController.actualizar);
router.delete('/clientes/:id', ClientesController.eliminar);

// Gestión de membresías
router.get('/membresias', (req, res) => {
    res.redirect('/membresias');
});

router.get('/membresias/crear', MembresiasController.mostrarFormularioCrear);
router.get('/membresias/:id', MembresiasController.obtenerUno);
router.get('/membresias/:id/editar', MembresiasController.mostrarFormularioEditar);
router.post('/membresias', MembresiasController.agregar);
router.put('/membresias/:id', MembresiasController.actualizar);
router.delete('/membresias/:id', MembresiasController.eliminar);

// Gestión de pagos
router.get('/pagos', (req, res) => {
    res.redirect('/pagos');
});

router.get('/pagos/crear', PagoController.mostrarFormularioCrear);
router.get('/pagos/:id', PagoController.obtenerUno);
router.get('/pagos/:id/editar', PagoController.mostrarFormularioEditar);
router.post('/pagos', PagoController.agregar);
router.put('/pagos/:id', PagoController.actualizar);
router.delete('/pagos/:id', PagoController.eliminar);

module.exports = router; 