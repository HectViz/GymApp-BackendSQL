const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Rutas públicas de autenticación
router.get('/login', AuthController.mostrarLogin);
router.post('/login', AuthController.login);
router.get('/register', AuthController.mostrarRegistro);
router.post('/register', AuthController.register);
router.post('/logout', AuthController.logout);
router.get('/verify', AuthController.verifyToken);

module.exports = router; 