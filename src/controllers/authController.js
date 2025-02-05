// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');
const userService = require('../services/userService');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido en variables de entorno');
}
class AuthController {
 async login(req, res) {
   try {
     const { email, password } = req.body;

     const user = await userService.getUserByEmail(email);
     if (!user) {
       return res.status(401).json({ error: 'Credenciales inválidas' });
     }

     if (!user.activo) {
       return res.status(401).json({ error: 'Usuario desactivado' });
     }

     const validPassword = await bcrypt.compare(password, user.password);
     if (!validPassword) {
       return res.status(401).json({ error: 'Credenciales inválidas' });
     }

     const token = jwt.sign({
       id: user.id_usuario,
       role: user.id_rol
     }, JWT_SECRET, { expiresIn: '24h' });

     const { password: _, ...userWithoutPassword } = user.toJSON();
     
     res.json({
       user: userWithoutPassword,
       token
     });
   } catch (error) {
     res.status(500).json({ error: 'Error en login' });
   }
 }

 async resetPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await userService.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ error: 'Email no encontrado' });
      }

      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      
      await userService.updateUser(user.id_usuario, { password: hashedPassword });
      await emailService.sendPasswordReset(email, tempPassword);

      res.json({ message: 'Contraseña temporal enviada al correo' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Error al restablecer contraseña' });
    }
  }
}

module.exports = new AuthController();