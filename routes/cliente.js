const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/ClienteController');
const { authenticateToken, requireCliente } = require('../middleware/auth');

// Middleware de autenticación para todas las rutas de cliente
router.use(authenticateToken);
router.use(requireCliente);

// Dashboard y vistas principales
router.get('/dashboard', ClienteController.dashboard);
router.get('/perfil', ClienteController.perfil);
router.put('/perfil', ClienteController.actualizarPerfil);

// Gestión de membresías del cliente
router.get('/membresias', ClienteController.misMembresias);

// Gestión de pagos del cliente
router.get('/pagos', ClienteController.misPagos);
router.get('/pagos/crear', ClienteController.mostrarFormularioPago);
router.post('/pagos', ClienteController.crearPago);

module.exports = router; 