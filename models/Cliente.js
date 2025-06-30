const { pool } = require('../config/db');

class Cliente {
  // OBTENER TODOS
  static async findAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM clientes ORDER BY nombre');
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo clientes: ${error.message}`);
    }
  }

  // OBTENER POR ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM clientes WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error obteniendo cliente: ${error.message}`);
    }
  }

  // CREAR NUEVO
  static async create(clienteData) {
    try {
      const { nombre, email, telefono } = clienteData;
      const [result] = await pool.execute(
        'INSERT INTO clientes (nombre, email, telefono) VALUES (?, ?, ?)',
        [nombre, email, telefono]
      );
      return { id: result.insertId, nombre, email, telefono };
    } catch (error) {
      throw new Error(`Error creando cliente: ${error.message}`);
    }
  }

  // ACTUALIZAR
  static async update(id, clienteData) {
    try {
      const { nombre, email, telefono } = clienteData;
      const [result] = await pool.execute(
        'UPDATE clientes SET nombre = ?, email = ?, telefono = ? WHERE id = ?',
        [nombre, email, telefono, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error actualizando cliente: ${error.message}`);
    }
  }

  // ELIMINAR
  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM clientes WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error eliminando cliente: ${error.message}`);
    }
  }

  // OBTENER TODO
  static async findByIdWithRelations(id) {
    try {
      const [clienteRows] = await pool.execute('SELECT * FROM clientes WHERE id = ?', [id]);
      if (clienteRows.length === 0) return null;

      const cliente = clienteRows[0];
      
      // OBTENER MEMBRESIA
      const [membresiasRows] = await pool.execute(
        'SELECT * FROM membresias WHERE clienteId = ? ORDER BY fechaInicio DESC',
        [id]
      );

      // OBTENER PAGOS
      const [pagosRows] = await pool.execute(
        'SELECT * FROM pagos WHERE clienteId = ? ORDER BY fechaPago DESC',
        [id]
      );

      return {
        ...cliente,
        membresias: membresiasRows,
        pagos: pagosRows
      };
    } catch (error) {
      throw new Error(`Error obteniendo cliente con relaciones: ${error.message}`);
    }
  }
}

module.exports = Cliente; 