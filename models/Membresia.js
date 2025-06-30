const { pool } = require('../config/db');

class Membresia {
  // OBTENER TODAS
  static async findAll() {
    try {
      const [rows] = await pool.execute(`
        SELECT m.*, c.nombre as clienteNombre 
        FROM membresias m 
        JOIN clientes c ON m.clienteId = c.id 
        ORDER BY m.fechaInicio DESC
      `);
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo membresías: ${error.message}`);
    }
  }

  // OBTENER UNA
  static async findById(id) {
    try {
      const [rows] = await pool.execute(`
        SELECT m.*, c.nombre as clienteNombre 
        FROM membresias m 
        JOIN clientes c ON m.clienteId = c.id 
        WHERE m.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error obteniendo membresía: ${error.message}`);
    }
  }

  // CREAR NUEVA
  static async create(membresiaData) {
    try {
      const { clienteId, tipo, fechaInicio, fechaVencimiento, estado = 'Activa' } = membresiaData;
      const [result] = await pool.execute(
        'INSERT INTO membresias (clienteId, tipo, fechaInicio, fechaVencimiento, estado) VALUES (?, ?, ?, ?, ?)',
        [clienteId, tipo, fechaInicio, fechaVencimiento, estado]
      );
      return { id: result.insertId, clienteId, tipo, fechaInicio, fechaVencimiento, estado };
    } catch (error) {
      throw new Error(`Error creando membresía: ${error.message}`);
    }
  }

  // ACTUALIZAR
  static async update(id, membresiaData) {
    try {
      const { clienteId, tipo, fechaInicio, fechaVencimiento, estado } = membresiaData;
      const [result] = await pool.execute(
        'UPDATE membresias SET clienteId = ?, tipo = ?, fechaInicio = ?, fechaVencimiento = ?, estado = ? WHERE id = ?',
        [clienteId, tipo, fechaInicio, fechaVencimiento, estado, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error actualizando membresía: ${error.message}`);
    }
  }

  // ELIMINAR
  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM membresias WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error eliminando membresía: ${error.message}`);
    }
  }

  // OBTENER TODO
  static async findByClienteId(clienteId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM membresias WHERE clienteId = ? ORDER BY fechaInicio DESC',
        [clienteId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo membresías del cliente: ${error.message}`);
    }
  }

  // OBTENER ACTIVAS
  static async findActive() {
    try {
      const [rows] = await pool.execute(`
        SELECT m.*, c.nombre as clienteNombre 
        FROM membresias m 
        JOIN clientes c ON m.clienteId = c.id 
        WHERE m.estado = 'Activa' AND m.fechaVencimiento >= CURDATE()
        ORDER BY m.fechaVencimiento ASC
      `);
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo membresías activas: ${error.message}`);
    }
  }
}

module.exports = Membresia; 