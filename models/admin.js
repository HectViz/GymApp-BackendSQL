const { pool } = require('../config/db');

class Admin {
  // OBTENER TODOS
  static async findAll() {
    try {
      const [rows] = await pool.execute('SELECT id, nombre, email, created_at FROM admin ORDER BY nombre');
      return rows;
    } catch (error) {
      throw new Error(`Error obteniendo administradores: ${error.message}`);
    }
  }

  // OBTENER POR ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM admin WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error obteniendo administrador: ${error.message}`);
    }
  }

  // OBTENER POR EMAIL
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute('SELECT * FROM admin WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error obteniendo administrador por email: ${error.message}`);
    }
  }

  // CREAR NUEVO
  static async create(adminData) {
    try {
      const { nombre, email, password } = adminData;
      const [result] = await pool.execute(
        'INSERT INTO admin (nombre, email, password) VALUES (?, ?, ?)',
        [nombre, email, password]
      );
      return { id: result.insertId, nombre, email };
    } catch (error) {
      throw new Error(`Error creando administrador: ${error.message}`);
    }
  }

  // ACTUALIZAR
  static async update(id, adminData) {
    try {
      const { nombre, email, password } = adminData;
      const [result] = await pool.execute(
        'UPDATE admin SET nombre = ?, email = ?, password = ? WHERE id = ?',
        [nombre, email, password, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error actualizando administrador: ${error.message}`);
    }
  }

  // ELIMINAR
  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM admin WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error eliminando administrador: ${error.message}`);
    }
  }
}

module.exports = Admin; 