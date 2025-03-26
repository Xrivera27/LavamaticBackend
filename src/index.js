const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const sequelize = require('./config/database');
const routes = require('./routes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["https://lavamatic.netlify.app", "https://frontendmovil.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"]
  }
});

// Middleware global
app.use(cors({
  origin: ['https://lavamatic.netlify.app', 'https://frontendmovil.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api', routes);

// Configuración de Socket.io
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  
  // Cuando un administrador se conecta a la página de pedidos
  socket.on('admin-connected', () => {
    socket.join('admins');
    console.log('Administrador conectado:', socket.id);
    
    // Enviar confirmación al cliente
    socket.emit('admin-confirmed', { message: 'Te has unido como administrador' });
  });
  
  // Manejar desconexiones
  socket.on('disconnect', (reason) => {
    console.log('Cliente desconectado:', socket.id, 'Razón:', reason);
  });
  
  // Manejar errores
  socket.on('error', (error) => {
    console.error('Error de socket:', error);
  });
});

// Hacer que io sea accesible desde otros archivos
app.set('io', io);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a base de datos establecida correctamente');
    
    await sequelize.sync({ force: false, logging: false });
    console.log('Modelos sincronizados con la base de datos');
    
    // Cambiar app.listen por server.listen
    server.listen(PORT, () => {
      console.log(`Servidor Express ejecutándose en puerto ${PORT}`);
      console.log(`Servidor WebSocket iniciado y escuchando`);
      console.log(`URL completa: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar servidor:', error);
    console.error(error.stack);
    process.exit(1); // Salir con código de error si no podemos iniciar el servidor
  }
}

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
  console.error(error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
});

startServer();