const dashboardService = require('../services/dashboardServices');

class DashboardController {
  // Obtener todos los datos del dashboard
  async getDashboardData(req, res) {
    try {
      const dashboardData = await dashboardService.getDashboardData();
      res.json(dashboardData);
    } catch (error) {
      console.error('Error en dashboardController.getDashboardData:', error);
      res.status(500).json({
        message: 'Error al obtener datos del dashboard',
        error: error.message
      });
    }
  }
  
  // Obtener solo pedidos por estado
  async getPedidosPorEstado(req, res) {
    try {
      const estadoCards = await dashboardService.getPedidosPorEstado();
      res.json(estadoCards);
    } catch (error) {
      console.error('Error en dashboardController.getPedidosPorEstado:', error);
      res.status(500).json({
        message: 'Error al obtener pedidos por estado',
        error: error.message
      });
    }
  }
  
  // Obtener solo datos de repartidores
  async getPedidosPorRepartidor(req, res) {
    try {
      const datosRepartidores = await dashboardService.getPedidosPorRepartidor();
      res.json(datosRepartidores);
    } catch (error) {
      console.error('Error en dashboardController.getPedidosPorRepartidor:', error);
      res.status(500).json({
        message: 'Error al obtener pedidos por repartidor',
        error: error.message
      });
    }
  }
  
  // Obtener solo distribución de servicios
  async getDistribucionServicios(req, res) {
    try {
      const serviciosData = await dashboardService.getDistribucionServicios();
      res.json(serviciosData);
    } catch (error) {
      console.error('Error en dashboardController.getDistribucionServicios:', error);
      res.status(500).json({
        message: 'Error al obtener distribución de servicios',
        error: error.message
      });
    }
  }
}

module.exports = new DashboardController();