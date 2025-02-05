
const bcrypt = require('bcrypt');
const configUsuarioService = require('../services/configUsuarioService');

class ConfigUsuarioController {
  async getProfile(req, res) {
    try {
      const id_usuario = req.user.id;
      const user = await configUsuarioService.getUserById(id_usuario);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const { password, ...userProfile } = user.toJSON();
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener perfil' });
    }
  }

  async updateProfile(req, res) {
    try {
      const id_usuario = req.user.id;
      const updateData = {};
      const { nombre, email, telefono, direccion } = req.body;

      if (nombre) updateData.nombre = nombre;
      if (telefono) updateData.telefono = telefono;
      if (direccion) updateData.direccion = direccion;
      
      if (email) {
        const existingUser = await configUsuarioService.getUserByEmail(email);
        if (existingUser && existingUser.id_usuario !== id_usuario) {
          return res.status(400).json({ error: 'El email ya está registrado' });
        }
        updateData.email = email;
      }

      await configUsuarioService.updateUser(id_usuario, updateData);
      
      const updatedUser = await configUsuarioService.getUserById(id_usuario);
      const { password, ...userProfile } = updatedUser.toJSON();

      res.json({ 
        message: 'Perfil actualizado correctamente',
        user: userProfile
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar perfil' });
    }
  }

  async changePassword(req, res) {
    try {
      const id_usuario = req.user.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Se requieren ambas contraseñas' });
      }

      const user = await configUsuarioService.getUserById(id_usuario);
      const validPassword = await bcrypt.compare(currentPassword, user.password);
      
      if (!validPassword) {
        return res.status(400).json({ error: 'Contraseña actual incorrecta' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await configUsuarioService.updateUser(id_usuario, { password: hashedPassword });

      res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al cambiar contraseña' });
    }
  }

  async deactivateAccount(req, res) {
    try {
      const id_usuario = req.user.id;
      await configUsuarioService.softDelete(id_usuario);
      res.json({ 
        message: 'Cuenta desactivada correctamente',
        shouldLogout: true
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al desactivar cuenta' });
    }
  }
}

module.exports = new ConfigUsuarioController();