const { pool } = require('../config/db');

class Pago {
  // OBTENER TODOS
  static async findAll() {
    try {
      const [rows] = await pool.execute(`
        SELECT p.*, c.nombre as clienteNombre 
        FROM pagos p 
        JOIN clientes c ON p.clienteId = c.id 
        ORDER BY p.fechaPago DESC
      `);
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo pagos: ${error.message}`);
    }
  }

  // OBTENER POR ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(`
        SELECT p.*, c.nombre as clienteNombre 
        FROM pagos p 
        JOIN clientes c ON p.clienteId = c.id 
        WHERE p.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error obteniendo pago: ${error.message}`);
    }
  }

  // OBTENER POR CLIENTE
  static async findByClienteId(clienteId) {
    try {
      const [rows] = await pool.execute(`
        SELECT p.*, c.nombre as clienteNombre 
        FROM pagos p 
        JOIN clientes c ON p.clienteId = c.id 
        WHERE p.clienteId = ? 
        ORDER BY p.fechaPago DESC
      `, [clienteId]);
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo pagos del cliente: ${error.message}`);
    }
  }

  // CREAR NUEVO
  static async create(pagoData) {
    try {
      const { clienteId, fechaPago, monto, metodoPago, numero_confirmacion } = pagoData;
      const [result] = await pool.execute(
        'INSERT INTO pagos (clienteId, fechaPago, monto, metodoPago, numero_confirmacion) VALUES (?, ?, ?, ?, ?)',
        [clienteId, fechaPago, monto, metodoPago, numero_confirmacion]
      );
      return { id: result.insertId, clienteId, fechaPago, monto, metodoPago, numero_confirmacion };
    } catch (error) {
      throw new Error(`Error creando pago: ${error.message}`);
    }
  }

  // ACTUALIZAR
  static async update(id, pagoData) {
    try {
      const { clienteId, fechaPago, monto, metodoPago, numero_confirmacion } = pagoData;
      const [result] = await pool.execute(
        'UPDATE pagos SET clienteId = ?, fechaPago = ?, monto = ?, metodoPago = ?, numero_confirmacion = ? WHERE id = ?',
        [clienteId, fechaPago, monto, metodoPago, numero_confirmacion, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error actualizando pago: ${error.message}`);
    }
  }

  // ELIMINAR
  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM pagos WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error eliminando pago: ${error.message}`);
    }
  }

  // OBTENER ESTADÍSTICAS
  static async getEstadisticas() {
    try {
      const [totalResult] = await pool.execute('SELECT COUNT(*) as total FROM pagos');
      const [montoTotalResult] = await pool.execute('SELECT SUM(monto) as total FROM pagos');
      const [promedioResult] = await pool.execute('SELECT AVG(monto) as promedio FROM pagos');
      
      const [metodosResult] = await pool.execute(`
        SELECT metodoPago, COUNT(*) as cantidad, SUM(monto) as total
        FROM pagos 
        GROUP BY metodoPago
      `);

      return {
        total: totalResult[0].total,
        montoTotal: montoTotalResult[0].total || 0,
        promedio: promedioResult[0].promedio || 0,
        porMetodo: metodosResult
      };
    } catch (error) {
      throw new Error(`Error obteniendo estadísticas: ${error.message}`);
    }
  }

  // VERIFICAR SI NUMERO DE CONFIRMACION EXISTE
  static async checkNumeroConfirmacion(numero_confirmacion) {
    try {
      const [rows] = await pool.execute('SELECT id FROM pagos WHERE numero_confirmacion = ?', [numero_confirmacion]);
      return rows.length > 0;
    } catch (error) {
      throw new Error(`Error verificando número de confirmación: ${error.message}`);
    }
  }
}

module.exports = Pago; 