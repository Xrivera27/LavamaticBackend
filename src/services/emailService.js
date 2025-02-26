// src/services/emailService.js
const sgMail = require('@sendgrid/mail');

class EmailService {
  constructor() {
    // Configuración de la API key desde variable de entorno
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY no está configurada');
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  }

  async sendPasswordReset(email, tempPassword) {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SendGrid API key no configurada');
      }

      const msg = {
        to: email,
        from: process.env.EMAIL_FROM || 'gerrivera244@gmail.com',
        subject: 'Recuperación de Contraseña - Lavamatic',
        text: `Tu contraseña temporal es: ${tempPassword}\nPor favor, cambia tu contraseña después de iniciar sesión.`
      };
      
      console.log('Enviando email de recuperación...', { to: email });
      const response = await sgMail.send(msg);
      console.log('Email de recuperación enviado:', response);
      return response;
    } catch (error) {
      console.error('Error SendGrid (Recuperación):', error.response?.body || error.message);
      throw error;
    }
  }

  async sendRegistrationConfirmation(email, nombre) {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SendGrid API key no configurada');
      }

      const msg = {
        to: email,
        from: process.env.EMAIL_FROM || 'gerrivera244@gmail.com',
        subject: 'Confirmación de Registro - Lavamatic',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>¡Bienvenido a Lavamatic, ${nombre}!</h2>
            <p>Tu cuenta ha sido creada exitosamente.</p>
            <p>Gracias por registrarte en nuestro servicio.</p>
            <p>Si no has solicitado esta cuenta, por favor ignora este correo.</p>
            <br>
            <p>Saludos,<br>Equipo de Lavamatic</p>
          </div>
        `
      };
      
      console.log('Enviando email de confirmación...', { to: email });
      const response = await sgMail.send(msg);
      console.log('Email de confirmación enviado:', response);
      return response;
    } catch (error) {
      console.error('Error SendGrid (Confirmación):', error.response?.body || error.message);
      throw error;
    }
  }

  async sendPedidoConfirmation(email, pedidoDetalles) {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SendGrid API key no configurada');
      }
  
      // Formatear servicios en una lista HTML
      const serviciosHTML = pedidoDetalles.servicios.map(servicio => 
        `<li>${servicio.nombre} - Cantidad: ${servicio.cantidad}</li>`
      ).join('');
  
      const msg = {
        to: email,
        from: process.env.EMAIL_FROM || 'gerrivera244@gmail.com',
        subject: `Confirmación de Pedido #${pedidoDetalles.id} - Lavamatic`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>¡Gracias por tu pedido, ${pedidoDetalles.nombreCliente}!</h2>
            <p>Hemos recibido tu pedido y lo estamos procesando.</p>
            
            <h3>Detalles del Pedido</h3>
            <p><strong>Número de Pedido:</strong> ${pedidoDetalles.id}</p>
            <p><strong>Fecha:</strong> ${pedidoDetalles.fecha}</p>
            <p><strong>Horario:</strong> ${pedidoDetalles.horario}</p>
            
            <h4>Servicios:</h4>
            <ul>
              ${serviciosHTML}
            </ul>
            
            <h4>Direcciones:</h4>
            <p><strong>Recogida:</strong> ${pedidoDetalles.direccionRecogida}</p>
            <p><strong>Entrega:</strong> ${pedidoDetalles.direccionEntrega}</p>
            
            <p>Puedes seguir el estado de tu pedido en nuestra plataforma.</p>
            <br>
            <p>Saludos,<br>Equipo de Lavamatic</p>
          </div>
        `
      };
      
      console.log('Enviando email de confirmación de pedido...', { to: email });
      const response = await sgMail.send(msg);
      console.log('Email de confirmación de pedido enviado:', response);
      return response;
    } catch (error) {
      console.error('Error SendGrid (Confirmación de Pedido):', error.response?.body || error.message);
      throw error;
    }
  }

  async sendRepartidorAsignado(email, pedidoDetalles) {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SendGrid API key no configurada');
      }
  
      // Formatear servicios en una lista HTML
      const serviciosHTML = pedidoDetalles.servicios.map(servicio => 
        `<li>${servicio.nombre} - Cantidad: ${servicio.cantidad}</li>`
      ).join('');
  
      const msg = {
        to: email,
        from: process.env.EMAIL_FROM || 'gerrivera244@gmail.com',
        subject: `Repartidor Asignado - Pedido #${pedidoDetalles.id}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>¡Tu pedido tiene repartidor asignado!</h2>
            
            <h3>Detalles del Pedido</h3>
            <p><strong>Número de Pedido:</strong> ${pedidoDetalles.id}</p>
            
            <h4>Información del Repartidor:</h4>
            <p><strong>Nombre:</strong> ${pedidoDetalles.nombreRepartidor}</p>
            <p><strong>Teléfono:</strong> ${pedidoDetalles.telefonoRepartidor}</p>
            
            <h4>Servicios:</h4>
            <ul>
              ${serviciosHTML}
            </ul>
            
            <h4>Direcciones:</h4>
            <p><strong>Recogida:</strong> ${pedidoDetalles.direccionRecogida}</p>
            <p><strong>Entrega:</strong> ${pedidoDetalles.direccionEntrega}</p>
            
            <p>Tu repartidor está listo para atender tu pedido.</p>
            <br>
            <p>Saludos,<br>Equipo de Lavamatic</p>
          </div>
        `
      };
      
      console.log('Enviando email de asignación de repartidor...', { to: email });
      const response = await sgMail.send(msg);
      console.log('Email de asignación de repartidor enviado:', response);
      return response;
    } catch (error) {
      console.error('Error SendGrid (Asignación de Repartidor):', error.response?.body || error.message);
      throw error;
    }
  }


}

module.exports = new EmailService();