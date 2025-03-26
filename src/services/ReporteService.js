// src/services/ReporteService.js
const ReporteRepository = require('../repositories/ReporteRepository');
const Reporte = require('../models/Reporte');

class ReporteService {
  async getPedidosReport(startDate, endDate, repartidorId, estadoId) {
    try {
      const data = await ReporteRepository.getPedidosReport(startDate, endDate, repartidorId, estadoId);
      return new Reporte(data);
    } catch (error) {
      console.error('Error en ReporteService.getPedidosReport:', error);
      throw error;
    }
  }
  
  async getRepartidoresReport(startDate, endDate) {
    try {
      const data = await ReporteRepository.getRepartidoresReport(startDate, endDate);
      return new Reporte(data);
    } catch (error) {
      console.error('Error en ReporteService.getRepartidoresReport:', error);
      throw error;
    }
  }
  
  async getClientesReport(startDate, endDate, clienteId) {
    try {
      const data = await ReporteRepository.getClientesReport(startDate, endDate, clienteId);
      return new Reporte(data);
    } catch (error) {
      console.error('Error en ReporteService.getClientesReport:', error);
      throw error;
    }
  }
  
  async getEquiposReport(startDate, endDate) {
    try {
      const data = await ReporteRepository.getEquiposReport(startDate, endDate);
      return new Reporte(data);
    } catch (error) {
      console.error('Error en ReporteService.getEquiposReport:', error);
      throw error;
    }
  }
  
  async getServiciosReport(startDate, endDate) {
    try {
      const data = await ReporteRepository.getServiciosReport(startDate, endDate);
      return new Reporte(data);
    } catch (error) {
      console.error('Error en ReporteService.getServiciosReport:', error);
      throw error;
    }
  }

  async getAllRepartidores() {
    try {
      return await ReporteRepository.getAllRepartidores();
    } catch (error) {
      console.error('Error en ReporteService.getAllRepartidores:', error);
      throw error;
    }
  }
  
  async getAllEstados() {
    try {
      return await ReporteRepository.getAllEstados();
    } catch (error) {
      console.error('Error en ReporteService.getAllEstados:', error);
      throw error;
    }
  }
  
  async getAllClientes() {
    try {
      return await ReporteRepository.getAllClientes();
    } catch (error) {
      console.error('Error en ReporteService.getAllClientes:', error);
      throw error;
    }
  }
}

module.exports = new ReporteService();