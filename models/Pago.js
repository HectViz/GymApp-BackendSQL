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

  // CREAR NUEVO
  static async create(pagoData) {
    try {
      const { clienteId, fechaPago, monto, metodoPago = 'Efectivo' } = pagoData;
      const [result] = await pool.execute(
        'INSERT INTO pagos (clienteId, fechaPago, monto, metodoPago) VALUES (?, ?, ?, ?)',
        [clienteId, fechaPago, monto, metodoPago]
      );
      return { id: result.insertId, clienteId, fechaPago, monto, metodoPago };
    } catch (error) {
      throw new Error(`Error creando pago: ${error.message}`);
    }
  }

  // ACTUALIZAR
  static async update(id, pagoData) {
    try {
      const { clienteId, fechaPago, monto, metodoPago } = pagoData;
      const [result] = await pool.execute(
        'UPDATE pagos SET clienteId = ?, fechaPago = ?, monto = ?, metodoPago = ? WHERE id = ?',
        [clienteId, fechaPago, monto, metodoPago, id]
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

  // OBTENER PAGO POR CLIENTE
  static async findByClienteId(clienteId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM pagos WHERE clienteId = ? ORDER BY fechaPago DESC',
        [clienteId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo pagos del cliente: ${error.message}`);
    }
  }

  // OBTENER ESTADISTICAS DE PAGO
  static async getStats() {
    try {
      const [totalResult] = await pool.execute('SELECT SUM(monto) as total FROM pagos');
      const [monthlyResult] = await pool.execute(`
        SELECT SUM(monto) as totalMensual 
        FROM pagos 
        WHERE MONTH(fechaPago) = MONTH(CURDATE()) AND YEAR(fechaPago) = YEAR(CURDATE())
      `);
      const [methodResult] = await pool.execute(`
        SELECT metodoPago, COUNT(*) as cantidad, SUM(monto) as total
        FROM pagos 
        GROUP BY metodoPago
      `);

      return {
        total: totalResult[0].total || 0,
        totalMensual: monthlyResult[0].totalMensual || 0,
        porMetodo: methodResult
      };
    } catch (error) {
      throw new Error(`Error obteniendo estadísticas: ${error.message}`);
    }
  }
}

module.exports = Pago; 