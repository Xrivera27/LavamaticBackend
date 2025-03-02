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

  async sendPedidoListo(email, pedidoDetalles) {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SendGrid API key no configurada');
      }
  
      // Formatear servicios en una lista HTML si existen
      const serviciosHTML = pedidoDetalles.servicios && pedidoDetalles.servicios.length 
        ? pedidoDetalles.servicios.map(servicio => 
            `<li>${servicio.nombre} - Cantidad: ${servicio.cantidad}</li>`
          ).join('')
        : '<li>No hay detalles disponibles</li>';
  
      const msg = {
        to: email,
        from: process.env.EMAIL_FROM || 'gerrivera244@gmail.com',
        subject: `¡Tu pedido #${pedidoDetalles.id} está listo para recoger! - Lavamatic`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>¡Tu pedido está listo para recoger!</h2>
            
            <h3>Detalles del Pedido</h3>
            <p><strong>Número de Pedido:</strong> ${pedidoDetalles.id}</p>
            
            <h4>Servicios:</h4>
            <ul>
              ${serviciosHTML}
            </ul>
            
            <h4>Dirección de recogida:</h4>
            <p>${'Nuestra tienda principal'}</p>
            
            <p>Puedes pasar a recoger tu pedido en nuestro horario de atención.</p>
            <p>Por favor trae el número de pedido o una identificación para recogerlo.</p>
            <br>
            <p>¡Gracias por confiar en nosotros!</p>
            <p>Saludos,<br>Equipo de Lavamatic</p>
          </div>
        `
      };
      
      console.log('Enviando email de pedido listo para recoger...', { to: email });
      const response = await sgMail.send(msg);
      console.log('Email de pedido listo para recoger enviado:', response);
      return response;
    } catch (error) {
      console.error('Error SendGrid (Pedido listo para recoger):', error.response?.body || error.message);
      throw error;
    }
  }


  async sendPedidoVolverEspera(email, pedidoDetalles) {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SendGrid API key no configurada');
      }
  
      // Formatear servicios en una lista HTML si existen
      const serviciosHTML = pedidoDetalles.servicios && pedidoDetalles.servicios.length 
        ? pedidoDetalles.servicios.map(servicio => 
            `<li>${servicio.nombre} - Cantidad: ${servicio.cantidad}</li>`
          ).join('')
        : '<li>No hay detalles disponibles</li>';
  
      const msg = {
        to: email,
        from: process.env.EMAIL_FROM || 'gerrivera244@gmail.com',
        subject: `Actualización importante sobre tu pedido #${pedidoDetalles.id} - Lavamatic`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Información sobre tu pedido</h2>
            
            <p>Estimado/a cliente:</p>
            
            <p>Le informamos que debido a ajustes internos en nuestro sistema, tu pedido #${pedidoDetalles.id} ha sido temporalmente colocado en estado de espera.</p>
            
            <h3>Detalles del Pedido</h3>
            <p><strong>Número de Pedido:</strong> ${pedidoDetalles.id}</p>
            
            <h4>Servicios:</h4>
            <ul>
              ${serviciosHTML}
            </ul>
            
            <p>Nuestro equipo está trabajando para procesar tu pedido lo antes posible. Agradecemos tu comprensión y paciencia.</p>
            
            <p>Si tienes alguna pregunta o inquietud, no dudes en contactarnos.</p>
            <br>
            <p>Lamentamos cualquier inconveniente que esto pueda causarte.</p>
            <p>Saludos cordiales,<br>Equipo de Lavamatic</p>
          </div>
        `
      };
      
      console.log('Enviando email de pedido vuelto a espera...', { to: email });
      const response = await sgMail.send(msg);
      console.log('Email de pedido vuelto a espera enviado:', response);
      return response;
    } catch (error) {
      console.error('Error SendGrid (Pedido vuelto a espera):', error.response?.body || error.message);
      throw error;
    }
  }

  async sendPedidoEntregadoAgradecimiento(email, pedidoDetalles) {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SendGrid API key no configurada');
      }
  
      // Formatear servicios en una lista HTML si existen
      const serviciosHTML = pedidoDetalles.servicios && pedidoDetalles.servicios.length 
        ? pedidoDetalles.servicios.map(servicio => 
            `<li>${servicio.nombre} - Cantidad: ${servicio.cantidad}</li>`
          ).join('')
        : '<li>No hay detalles disponibles</li>';
  
      const msg = {
        to: email,
        from: process.env.EMAIL_FROM || 'gerrivera244@gmail.com',
        subject: `¡Gracias por tu pedido #${pedidoDetalles.id}! - Lavamatic`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>¡Pedido Entregado con Éxito!</h2>
            
            <p>Estimado/a ${pedidoDetalles.nombreCliente || 'cliente'}:</p>
            
            <p>Queremos agradecerte por confiar en Lavamatic para el cuidado de tus prendas. Tu pedido #${pedidoDetalles.id} ha sido entregado exitosamente.</p>
            
            <h3>Resumen del Pedido</h3>
            <p><strong>Número de Pedido:</strong> ${pedidoDetalles.id}</p>
            <p><strong>Fecha de Entrega:</strong> ${new Date().toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}</p>
            
            <h4>Servicios:</h4>
            <ul>
              ${serviciosHTML}
            </ul>
            
            <p>Nos encantaría conocer tu opinión sobre nuestros servicios. Tu feedback es muy importante para nosotros y nos ayuda a mejorar constantemente.</p>
            
            <p>Si tienes alguna pregunta o sugerencia, no dudes en contactarnos.</p>
            <br>
            <p>¡Esperamos verte pronto nuevamente!</p>
            <p>Saludos cordiales,<br>Equipo de Lavamatic</p>
            
            <div style="margin-top: 30px; font-size: 12px; color: #666;">
              <p>Si deseas realizar otro pedido, visita nuestra plataforma o llámanos al [NÚMERO DE TELÉFONO].</p>
            </div>
          </div>
        `
      };
      
      console.log('Enviando email de agradecimiento por pedido entregado...', { to: email });
      const response = await sgMail.send(msg);
      console.log('Email de agradecimiento enviado:', response);
      return response;
    } catch (error) {
      console.error('Error SendGrid (Agradecimiento por pedido entregado):', error.response?.body || error.message);
      throw error;
    }
  }

  async sendEntregaRepartidorConfirmacion(email, pedidoDetalles) {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SendGrid API key no configurada');
      }
  
      // Formatear servicios en una lista HTML si existen
      const serviciosHTML = pedidoDetalles.servicios && pedidoDetalles.servicios.length 
        ? pedidoDetalles.servicios.map(servicio => 
            `<li>${servicio.nombre} - Cantidad: ${servicio.cantidad}</li>`
          ).join('')
        : '<li>No hay detalles disponibles</li>';
  
      const msg = {
        to: email,
        from: process.env.EMAIL_FROM || 'gerrivera244@gmail.com',
        subject: `¡Tu pedido #${pedidoDetalles.id} ha sido entregado! - Lavamatic`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>¡Entrega Completada!</h2>
            
            <p>Estimado/a ${pedidoDetalles.nombreCliente || 'cliente'}:</p>
            
            <p>Nos complace informarte que tu pedido #${pedidoDetalles.id} ha sido entregado correctamente por nuestro repartidor ${pedidoDetalles.nombreRepartidor || 'de Lavamatic'}.</p>
            
            <h3>Resumen del Pedido</h3>
            <p><strong>Número de Pedido:</strong> ${pedidoDetalles.id}</p>
            <p><strong>Fecha de Entrega:</strong> ${new Date().toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            
            <h4>Servicios realizados:</h4>
            <ul>
              ${serviciosHTML}
            </ul>
            
            <p>¡Gracias por confiar en Lavamatic! Esperamos que estés satisfecho/a con nuestro servicio.</p>
            
            <p>Si tienes alguna consulta o comentario sobre tu experiencia, no dudes en responder a este correo o contactarnos directamente.</p>
            <br>
            <p>¡Que tengas un excelente día!</p>
            <p>Saludos cordiales,<br>Equipo de Lavamatic</p>
          </div>
        `
      };
      
      console.log('Enviando email de confirmación de entrega por repartidor...', { to: email });
      const response = await sgMail.send(msg);
      console.log('Email de confirmación de entrega enviado:', response);
      return response;
    } catch (error) {
      console.error('Error SendGrid (Confirmación de entrega por repartidor):', error.response?.body || error.message);
      throw error;
    }
  }

}

module.exports = new EmailService();