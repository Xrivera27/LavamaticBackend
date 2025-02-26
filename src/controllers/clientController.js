const bcrypt = require('bcrypt');
const userService = require('../services/userService');
const emailService = require('../services/emailService');

class ClientController {
  async register(req, res) {
    try {
      const { nombre, email, password, telefono, direccion } = req.body;
      
      // Validar campos requeridos
      if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Datos incompletos' });
      }
      
      // Verificar si el email ya existe
      const existingUser = await userService.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email ya registrado' });
      }
      
      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Crear nuevo usuario
      const newUser = await userService.createUser({
        nombre,
        email,
        password: hashedPassword,
        telefono,
        direccion,
        id_rol: 2,
        activo: true
      });
      
      // Enviar email de confirmación (opcional, manejo de errores para no bloquear registro)
      try {
        await emailService.sendRegistrationConfirmation(email, nombre);
      } catch (emailError) {
        console.error('Error al enviar email de confirmación:', emailError);
        // No lanzamos error para no impedir el registro
      }
      
      // Remover password antes de enviar respuesta
      const { password: _, ...userWithoutPassword } = newUser.toJSON();
      
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ error: 'Error en registro' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await userService.updateUser(id, req.body);
      res.json({ message: 'Cliente actualizado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await userService.softDeleteUser(id);
      res.json({ message: 'Cliente desactivado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al desactivar' });
    }
  }

  async getAll(req, res) {
    try {
      const clients = await userService.getAllClients();
      
      // Excluir passwords
      const clientsData = clients.map(client => {
        const { password, ...userData } = client.toJSON();
        return userData;
      });
      
      res.json(clientsData);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener clientes' });
    }
  }
}

module.exports = new ClientController();