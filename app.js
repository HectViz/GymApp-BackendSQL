var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require('method-override');

// SE CONFIGURA LA BASE DE DATOS
const { testConnection, initDatabase, createDefaultAdmin } = require('./config/db');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var adminRouter = require('./routes/admin');
var clienteRouter = require('./routes/cliente');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method')); // SE AGREGA EL METHOD OVERRIDE PARA LA FUNCION DE LAS VISTAS
app.use(express.static(path.join(__dirname, 'public')));

// SE INICIALIZA LA BASE DE DATOS
async function initializeApp() {
  try {
    await testConnection();
    await initDatabase();
    await createDefaultAdmin();
    console.log('✅ Aplicación inicializada correctamente');
  } catch (error) {
    console.error('❌ Error inicializando la aplicación:', error);
  }
}

initializeApp();

// RUTAS PUBLICAS OJO
app.use('/', indexRouter);
app.use('/auth', authRouter);

// RUTAS PROTEGIDAS
app.use('/admin', adminRouter);
app.use('/cliente', clienteRouter);

// RUTAS ANTERIORES MANTENIENDO LA COMPATIBILIDAD
const clientesRouter = require('./routes/clientes');
app.use('/clientes', clientesRouter);
const membresiasRouter = require('./routes/membresias');
app.use('/membresias', membresiasRouter);
const pagosRouter = require('./routes/pagos');
app.use('/pagos', pagosRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;