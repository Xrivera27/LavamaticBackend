
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;

async function startServer() {
 try {
   await sequelize.authenticate();
   await sequelize.sync({ force: false, logging: false });
   
   app.listen(PORT, () => {
     console.log(`Servidor en puerto ${PORT}`);
   });
 } catch (error) {
   console.error('Error al iniciar servidor:', error);
 }
}

startServer();