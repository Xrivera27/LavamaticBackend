// src/controllers/ReporteController.js
const ReporteService = require('../services/ReporteService');

class ReporteController {
  async getPedidosReport(req, res) {
    try {
      const { startDate, endDate, repartidor, estado } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ 
          success: false, 
          message: 'Las fechas de inicio y fin son requeridas' 
        });
      }
      
      const reporte = await ReporteService.getPedidosReport(
        startDate, 
        endDate, 
        repartidor || null, 
        estado || null
      );
      
      return res.status(200).json(reporte.data);
    } catch (error) {
      console.error('Error en ReporteController.getPedidosReport:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al generar el reporte de pedidos',
        error: error.message 
      });
    }
  }
  
  async getRepartidoresReport(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ 
          success: false, 
          message: 'Las fechas de inicio y fin son requeridas' 
        });
      }
      
      const reporte = await ReporteService.getRepartidoresReport(startDate, endDate);
      
      return res.status(200).json(reporte.data);
    } catch (error) {
      console.error('Error en ReporteController.getRepartidoresReport:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al generar el reporte de repartidores',
        error: error.message 
      });
    }
  }
  
  async getClientesReport(req, res) {
    try {
      const { startDate, endDate, cliente } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ 
          success: false, 
          message: 'Las fechas de inicio y fin son requeridas' 
        });
      }
      
      const reporte = await ReporteService.getClientesReport(
        startDate, 
        endDate, 
        cliente || null
      );
      
      return res.status(200).json(reporte.data);
    } catch (error) {
      console.error('Error en ReporteController.getClientesReport:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al generar el reporte de clientes',
        error: error.message 
      });
    }
  }
  
  async getEquiposReport(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ 
          success: false, 
          message: 'Las fechas de inicio y fin son requeridas' 
        });
      }
      
      const reporte = await ReporteService.getEquiposReport(startDate, endDate);
      
      return res.status(200).json(reporte.data);
    } catch (error) {
      console.error('Error en ReporteController.getEquiposReport:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al generar el reporte de equipos',
        error: error.message 
      });
    }
  }
  
  async getServiciosReport(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ 
          success: false, 
          message: 'Las fechas de inicio y fin son requeridas' 
        });
      }
      
      const reporte = await ReporteService.getServiciosReport(startDate, endDate);
      
      return res.status(200).json(reporte.data);
    } catch (error) {
      console.error('Error en ReporteController.getServiciosReport:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al generar el reporte de servicios',
        error: error.message 
      });
    }
  }

  async getAllRepartidores(req, res) {
    try {
      // Aquí está el error - cambiamos ReporteRepository por ReporteService
      const repartidores = await ReporteService.getAllRepartidores();
      return res.status(200).json(repartidores);
    } catch (error) {
      console.error('Error en ReporteController.getAllRepartidores:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener los repartidores',
        error: error.message 
      });
    }
  }
  
  async getAllEstados(req, res) {
    try {
      // Aquí está el error - cambiamos ReporteRepository por ReporteService
      const estados = await ReporteService.getAllEstados();
      return res.status(200).json(estados);
    } catch (error) {
      console.error('Error en ReporteController.getAllEstados:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener los estados',
        error: error.message 
      });
    }
  }
  
  async getAllClientes(req, res) {
    try {
      // Aquí está el error - cambiamos ReporteRepository por ReporteService
      const clientes = await ReporteService.getAllClientes();
      return res.status(200).json(clientes);
    } catch (error) {
      console.error('Error en ReporteController.getAllClientes:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al obtener los clientes',
        error: error.message 
      });
    }
  }
}

module.exports = new ReporteController();