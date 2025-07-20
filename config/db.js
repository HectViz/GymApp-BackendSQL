const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gymapp',
  port: process.env.DB_PORT || 3306
};

// SE CREA LA POOL DE CONEXIONES
const pool = mysql.createPool(dbConfig);

// SE TESTEA LA CONEXION CON ESTA FUNCION
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a MySQL establecida correctamente');
    connection.release();
  } catch (error) {
    console.error('❌ Error conectando a MySQL:', error.message);
  }
}

// SE INICIALIZAN LAS TABLAS
async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // TABLA DE CLIENTES CON AUTENTICACION
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        telefono VARCHAR(20) NOT NULL,
        password VARCHAR(255) NOT NULL,
        rol ENUM('usuario', 'admin') DEFAULT 'usuario',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // TABLA DE ADMINS
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS membresias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        clienteId INT NOT NULL,
        tipo ENUM('Mensual', 'Trimestral', 'Semestral', 'Anual') NOT NULL,
        fechaInicio DATE NOT NULL,
        fechaVencimiento DATE NOT NULL,
        estado ENUM('Activa', 'Vencida', 'Cancelada') DEFAULT 'Activa',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (clienteId) REFERENCES clientes(id) ON DELETE CASCADE
      )
    `);

    // TABLA DE PAGOS
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS pagos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        clienteId INT NOT NULL,
        fechaPago DATE NOT NULL,
        monto DECIMAL(10,2) NOT NULL,
        metodoPago ENUM('Efectivo', 'Tarjeta', 'Transferencia') DEFAULT 'Efectivo',
        numero_confirmacion VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (clienteId) REFERENCES clientes(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Tablas creadas/verificadas correctamente');
    connection.release();
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error.message);
  }
}

// DEFAULT ADMIN CREACION POR DEFECTO OJO
async function createDefaultAdmin() {
  try {
    const bcrypt = require('bcrypt');
    const connection = await pool.getConnection();
    
    // IF ADMIN EXISTS OJO
    const [admins] = await connection.execute('SELECT * FROM admin LIMIT 1');
    
    if (admins.length === 0) {
      const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || 'admin123', 10);
      
      await connection.execute(`
        INSERT INTO admin (nombre, email, password) 
        VALUES (?, ?, ?)
      `, ['Administrador', process.env.DEFAULT_ADMIN_EMAIL || 'admin@gymapp.com', hashedPassword]);
      
      console.log('✅ Usuario administrador creado por defecto');
    }
    
    connection.release();
  } catch (error) {
    console.error('❌ Error creando admin por defecto:', error.message);
  }
}

module.exports = {
  pool,
  testConnection,
  initDatabase,
  createDefaultAdmin
}; 