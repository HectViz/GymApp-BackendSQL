const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gymapp',
  port: 3306
};

// SEA CREA LA POOL DE CONEXIONES
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
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        telefono VARCHAR(20) NOT NULL,
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

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS pagos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        clienteId INT NOT NULL,
        fechaPago DATE NOT NULL,
        monto DECIMAL(10,2) NOT NULL,
        metodoPago ENUM('Efectivo', 'Tarjeta', 'Transferencia') DEFAULT 'Efectivo',
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

module.exports = {
  pool,
  testConnection,
  initDatabase
}; 