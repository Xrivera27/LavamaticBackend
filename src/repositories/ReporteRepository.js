// src/repositories/ReporteRepository.js
const sequelize = require('../config/database');
const Pedido = require('../models/pedidos');
const PedidoServicio = require('../models/pedidoServicio');
const Servicio = require('../models/Servicio');
const Estado = require('../models/estados');
const Repartidor = require('../models/repartidores');
const Usuario = require('../models/User');
const Equipo = require('../models/equipos');
const MantenimientoEquipo = require('../models/MantenimientoEquipo');
const ReservaEquipo = require('../models/ReservaEquipo');
const Horario = require('../models/horarios');
const { Op, QueryTypes } = require('sequelize');

class ReporteRepository {
  // Reporte de pedidos con filtro por fecha, repartidor y estado
  async getPedidosReport(startDate, endDate, repartidorId = null, estadoId = null) {
    try {
      let whereClause = {
        fecha_creacion: {
          [Op.between]: [startDate, endDate]
        }
      };
      
      if (repartidorId) {
        whereClause.id_repartidor = repartidorId;
      }
      
      if (estadoId) {
        whereClause.id_estado = estadoId;
      }
      
      // Realizar una consulta SQL directa para obtener los datos con joins explícitos
      const query = `
        SELECT 
          p.id_pedido,
          p.fecha_creacion,
          p.total,
          c.nombre AS nombre_cliente,
          CASE 
            WHEN p.id_repartidor IS NULL THEN 'Sin asignar'
            WHEN ru.nombre IS NULL THEN 'Desconocido'
            ELSE ru.nombre
          END AS nombre_repartidor,
          e.id_estado,
          e.nombre_estado
        FROM 
          pedidos p
        LEFT JOIN
          usuarios c ON p.id_cliente = c.id_usuario
        LEFT JOIN
          repartidores r ON p.id_repartidor = r.id_repartidor
        LEFT JOIN
          usuarios ru ON r.id_usuario = ru.id_usuario
        LEFT JOIN
          estados e ON p.id_estado = e.id_estado
        WHERE
          p.fecha_creacion BETWEEN :startDate AND :endDate
          ${repartidorId ? 'AND p.id_repartidor = :repartidorId' : ''}
          ${estadoId ? 'AND p.id_estado = :estadoId' : ''}
        ORDER BY
          p.fecha_creacion DESC
      `;
      
      const replacements = {
        startDate: startDate,
        endDate: endDate
      };
      
      if (repartidorId) {
        replacements.repartidorId = repartidorId;
      }
      
      if (estadoId) {
        replacements.estadoId = estadoId;
      }
      
      // CORRECCIÓN: No desestructurar el resultado con [results]
      const results = await sequelize.query(query, {
        replacements,
        type: QueryTypes.SELECT
      });
      
      // Con QueryTypes.SELECT, siempre devuelve un array, así que no necesitamos verificar
      return results.map(pedido => ({
        id_pedido: pedido.id_pedido,
        nombre_cliente: pedido.nombre_cliente || 'Desconocido',
        nombre_repartidor: pedido.nombre_repartidor || 'Sin asignar',
        nombre_estado: pedido.nombre_estado,
        id_estado: pedido.id_estado,
        fecha_creacion: pedido.fecha_creacion,
        total: pedido.total
      }));
    } catch (error) {
      console.error('Error en ReporteRepository.getPedidosReport:', error);
      throw error;
    }
  }
  
  // Reporte de desempeño de repartidores
  async getRepartidoresReport(startDate, endDate) {
    try {
      // Obtener todos los repartidores con usuarios activos
      const repartidores = await Repartidor.findAll({
        include: [
          {
            model: Usuario,
            as: 'user',
            attributes: ['nombre'],
            where: { activo: true } // Filtramos por usuarios activos
          }
        ]
      });
      
      const result = [];
      
      // Para cada repartidor, obtener sus métricas
      for (const repartidor of repartidores) {
        // Contar pedidos completados
        const pedidosCompletados = await Pedido.count({
          where: {
            id_repartidor: repartidor.id_repartidor,
            id_estado: 3, // Estado completado/entregado
            fecha_creacion: {
              [Op.between]: [startDate, endDate]
            }
          }
        });
        
        // Resto del código igual...
        const pedidosEnProceso = await Pedido.count({
          where: {
            id_repartidor: repartidor.id_repartidor,
            id_estado: 2, // Estado en proceso
            fecha_creacion: {
              [Op.between]: [startDate, endDate]
            }
          }
        });
        
        const totalPedidos = await Pedido.count({
          where: {
            id_repartidor: repartidor.id_repartidor,
            fecha_creacion: {
              [Op.between]: [startDate, endDate]
            }
          }
        });
        
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);
        const diffTime = Math.abs(endDateTime - startDateTime);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        
        const promedioDiario = totalPedidos / diffDays;
        
        result.push({
          id_repartidor: repartidor.id_repartidor,
          nombre: repartidor.user.nombre,
          pedidos_completados: pedidosCompletados,
          pedidos_en_proceso: pedidosEnProceso,
          total_pedidos: totalPedidos,
          promedio_diario: promedioDiario
        });
      }
      
      return result.sort((a, b) => b.total_pedidos - a.total_pedidos);
    } catch (error) {
      console.error('Error en ReporteRepository.getRepartidoresReport:', error);
      throw error;
    }
  }
  
  // Reporte de clientes
  async getClientesReport(startDate, endDate, clienteId = null) {
    try {
      let whereClause = { id_rol: 2 }; // Rol de cliente
      
      if (clienteId) {
        whereClause.id_usuario = clienteId;
      }
      
      // Obtener todos los clientes
      const clientes = await Usuario.findAll({
        where: whereClause,
        attributes: ['id_usuario', 'nombre'],
        order: [['nombre', 'ASC']]
      });
      
      const result = [];
      
      // Para cada cliente, obtener sus métricas
      for (const cliente of clientes) {
        // Contar total de pedidos
        const totalPedidos = await Pedido.count({
          where: {
            id_cliente: cliente.id_usuario,
            fecha_creacion: {
              [Op.between]: [startDate, endDate]
            }
          }
        });
        
        // Obtener gasto total
        const gastosResult = await Pedido.sum('total', {
          where: {
            id_cliente: cliente.id_usuario,
            fecha_creacion: {
              [Op.between]: [startDate, endDate]
            }
          }
        });
        
        const gastoTotal = gastosResult || 0;
        
        // Obtener servicios favoritos
        // Esto es más complejo y requiere una consulta cruda SQL
        const serviciosFavoritosQuery = `
          SELECT s.nombre
          FROM servicios s
          JOIN pedidos_servicios ps ON s.id_servicio = ps.id_servicio
          JOIN pedidos p ON ps.id_pedido = p.id_pedido
          WHERE p.id_cliente = :clienteId
            AND p.fecha_creacion BETWEEN :startDate AND :endDate
          GROUP BY s.id_servicio
          ORDER BY COUNT(ps.id_pedido_servicio) DESC
          LIMIT 1
        `;
        
        const serviciosFavoritosResult = await sequelize.query(
          serviciosFavoritosQuery,
          {
            replacements: {
              clienteId: cliente.id_usuario,
              startDate: startDate,
              endDate: endDate
            },
            type: QueryTypes.SELECT
          }
        );
        
        const serviciosFavoritos = serviciosFavoritosResult.length > 0 
          ? serviciosFavoritosResult[0].nombre 
          : 'Ninguno';
        
        result.push({
          id_usuario: cliente.id_usuario,
          nombre: cliente.nombre,
          total_pedidos: totalPedidos,
          servicios_favoritos: serviciosFavoritos,
          gasto_total: gastoTotal.toFixed(2)
        });
      }
      
      // Ordenar por gasto total descendente
      return result.sort((a, b) => parseFloat(b.gasto_total) - parseFloat(a.gasto_total));
    } catch (error) {
      console.error('Error en ReporteRepository.getClientesReport:', error);
      throw error;
    }
  }
  
  // Reporte de uso de equipos
  async getEquiposReport(startDate, endDate) {
    try {
      const equipos = await Equipo.findAll({
        where: { activo: true },
        attributes: ['id_equipo', 'nombre', 'cantidad_total', 'cantidad_mantenimiento'],
      });
      
      const result = [];
      
      for (const equipo of equipos) {
        // Total de usos en pedidos
        const totalUsos = await sequelize.query(`
          SELECT COUNT(*) as total_usos
          FROM pedidos_equipos pe
          JOIN pedidos p ON pe.id_pedido = p.id_pedido
          WHERE pe.id_equipo = :equipoId
            AND p.fecha_creacion BETWEEN :startDate AND :endDate
        `, {
          replacements: {
            equipoId: equipo.id_equipo,
            startDate: startDate,
            endDate: endDate
          },
          type: QueryTypes.SELECT
        });
        
        // Horas de uso en reservas - Corregido para PostgreSQL
        const horasUso = await sequelize.query(`
          SELECT COALESCE(SUM(re.cantidad * EXTRACT(EPOCH FROM (h.hora_fin - h.hora_inicio)) / 3600), 0) as horas_uso
          FROM reservas_equipos re
          JOIN horarios h ON re.id_horario = h.id_horario
          WHERE re.id_equipo = :equipoId
            AND re.fecha BETWEEN :startDate AND :endDate
        `, {
          replacements: {
            equipoId: equipo.id_equipo,
            startDate: startDate,
            endDate: endDate
          },
          type: QueryTypes.SELECT
        });
        
        // Mantenimientos realizados en el período
        const mantenimientos = await MantenimientoEquipo.count({
          where: {
            id_equipo: equipo.id_equipo,
            [Op.or]: [
              // Mantenimientos que comenzaron en el período
              {
                fecha_inicio: {
                  [Op.between]: [startDate, endDate]
                }
              },
              // Mantenimientos que terminaron en el período
              {
                fecha_fin: {
                  [Op.between]: [startDate, endDate]
                }
              },
              // Mantenimientos que abarcan todo el período
              {
                [Op.and]: [
                  {
                    fecha_inicio: {
                      [Op.lte]: startDate
                    }
                  },
                  {
                    fecha_fin: {
                      [Op.gte]: endDate
                    }
                  }
                ]
              }
            ]
          }
        });
        
        // Calcular disponibilidad en porcentaje
        // Si la cantidad_total es 0, establecer disponibilidad en 100% para evitar divisiones por cero
        const disponibilidad = equipo.cantidad_total > 0
          ? (((equipo.cantidad_total - equipo.cantidad_mantenimiento) / equipo.cantidad_total) * 100).toFixed(2)
          : 100;
        
        result.push({
          id_equipo: equipo.id_equipo,
          nombre: equipo.nombre,
          total_usos: parseInt(totalUsos[0].total_usos) || 0,
          horas_uso: parseFloat(horasUso[0].horas_uso) || 0,
          mantenimientos: mantenimientos,
          disponibilidad: disponibilidad
        });
      }
      
      // Ordenar por total de usos descendente
      return result.sort((a, b) => b.total_usos - a.total_usos);
    } catch (error) {
      console.error('Error en ReporteRepository.getEquiposReport:', error);
      throw error;
    }
  }
  
  // Reporte de servicios vendidos
  async getServiciosReport(startDate, endDate) {
    try {
      // Obtener total de servicios vendidos en el período
      const totalServiciosQuery = `
        SELECT COUNT(*) as total
        FROM pedidos_servicios ps
        JOIN pedidos p ON ps.id_pedido = p.id_pedido
        WHERE p.fecha_creacion BETWEEN :startDate AND :endDate
      `;
      
      const totalServiciosResult = await sequelize.query(
        totalServiciosQuery,
        {
          replacements: {
            startDate: startDate,
            endDate: endDate
          },
          type: QueryTypes.SELECT
        }
      );
      
      const totalServicios = totalServiciosResult[0].total || 1; // Evitar división por cero
      
      // Obtener todos los servicios
      const servicios = await Servicio.findAll({
        where: { activo: true },
        attributes: ['id_servicio', 'nombre']
      });
      
      const result = [];
      
      for (const servicio of servicios) {
        // Obtener datos de ventas de este servicio
        const datosServicioQuery = `
          SELECT 
            COALESCE(SUM(ps.cantidad), 0) as cantidad_vendida,
            COALESCE(SUM(ps.subtotal), 0) as ingresos,
            COUNT(ps.id_pedido_servicio) as ventas_totales
          FROM pedidos_servicios ps
          JOIN pedidos p ON ps.id_pedido = p.id_pedido
          WHERE ps.id_servicio = :servicioId
            AND p.fecha_creacion BETWEEN :startDate AND :endDate
        `;
        
        const datosServicio = await sequelize.query(
          datosServicioQuery,
          {
            replacements: {
              servicioId: servicio.id_servicio,
              startDate: startDate,
              endDate: endDate
            },
            type: QueryTypes.SELECT
          }
        );
        
        // Calcular popularidad (porcentaje del total de ventas)
        const ventasTotales = datosServicio[0].ventas_totales || 0;
        const popularidad = ((ventasTotales / totalServicios) * 100).toFixed(2);
        
        result.push({
          id_servicio: servicio.id_servicio,
          nombre: servicio.nombre,
          cantidad_vendida: datosServicio[0].cantidad_vendida || 0,
          ingresos: datosServicio[0].ingresos || 0,
          popularidad: popularidad
        });
      }
      
      // Ordenar por ingresos descendente
      return result.sort((a, b) => b.ingresos - a.ingresos);
    } catch (error) {
      console.error('Error en ReporteRepository.getServiciosReport:', error);
      throw error;
    }
  }
  
  // Obtener todos los repartidores para filtros
  async getAllRepartidores() {
    try {
      const repartidores = await Repartidor.findAll({
        include: [
          {
            model: Usuario,
            as: 'user',
            attributes: ['nombre'],
            where: { activo: true } // Filtramos usuarios activos, no repartidores
          }
        ],
        order: [[sequelize.col('user.nombre'), 'ASC']]
      });
      
      return repartidores.map(repartidor => ({
        id_repartidor: repartidor.id_repartidor,
        nombre: repartidor.user.nombre
      }));
    } catch (error) {
      console.error('Error en ReporteRepository.getAllRepartidores:', error);
      throw error;
    }
  }
  
  // Obtener todos los estados para filtros
  async getAllEstados() {
    try {
      return await Estado.findAll({
        attributes: ['id_estado', 'nombre_estado'],
        order: [['nombre_estado', 'ASC']]
      });
    } catch (error) {
      console.error('Error en ReporteRepository.getAllEstados:', error);
      throw error;
    }
  }
  
  // Obtener todos los clientes para filtros
  async getAllClientes() {
    try {
      return await Usuario.findAll({
        where: { id_rol: 2 }, // Rol de cliente
        attributes: ['id_usuario', 'nombre'],
        order: [['nombre', 'ASC']]
      });
    } catch (error) {
      console.error('Error en ReporteRepository.getAllClientes:', error);
      throw error;
    }
  }
}

module.exports = new ReporteRepository();