var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
  const token = req.cookies.token;
  let user = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = decoded;
    } catch (error) {
      // Token inválido, se limpia la cookie
      res.clearCookie('token');
    }
  }

  res.render('index', { 
    title: 'GymApp - Sistema de Gestión de Gimnasio',
    user: user
  });
});

module.exports = router;
