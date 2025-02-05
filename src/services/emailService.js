// src/services/emailService.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

class EmailService {
  async sendPasswordReset(email, tempPassword) {
    try {
      const msg = {
        to: email,
        from: 'gerrivera244@gmail.com', 
        subject: 'Recuperación de Contraseña - Lavamatic',
        text: `Tu contraseña temporal es: ${tempPassword}\nPor favor, cambia tu contraseña después de iniciar sesión.`
      };

      console.log('Enviando email...', { to: email });
      const response = await sgMail.send(msg);
      console.log('Email enviado:', response);
      return response;
    } catch (error) {
      console.error('Error SendGrid:', error.response?.body);
      throw error;
    }
  }
}

module.exports = new EmailService();