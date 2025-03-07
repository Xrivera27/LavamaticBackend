const { Op } = require('sequelize');
const Pedido = require('../models/pedidos');
const Usuario = require('../models/User');
const Estado = require('../models/estados');
const PedidoServicio = require('../models/pedidoServicio');
const Servicio = require('../models/Servicio');
const pedidoRepository = require('../repositories/pedidoRepository');

class DashboardService {
  // Obtener conteo de pedidos por estado
  async getPedidosPorEstado() {
    try {
      const estados = await Estado.findAll();
      
      // Preparar arreglo para guardar los resultados
      const resultados = [];
      
      // Para cada estado, contar los pedidos activos
      for (const estado of estados) {
        const count = await Pedido.count({
          where: {
            id_estado: estado.id_estado
          }
        });
        
        // Determinar la clase CSS y el icono según el estado
        let clase = 'status-default';
        let icono = 'fas fa-box';
        
        // Esta lógica asume que tienes estos estados en tu sistema
        switch (estado.nombre_estado) {
          case 'En Espera':
            clase = 'status-waiting';
            icono = 'fas fa-clock';
            break;
          case 'En Camino':
            clase = 'status-shipping';
            icono = 'fas fa-truck';
            break;
          case 'Listo para recoger':
            clase = 'status-ready';
            icono = 'fas fa-box';
            break;
          case 'Entregado':
            clase = 'status-delivered';
            icono = 'fas fa-check-circle';
            break;
        }
        
        resultados.push({
          id: estado.id_estado,
          nombre: estado.nombre_estado,
          total: count,
          clase: clase,
          icono: icono,
          colorNumero: '#1976D2'
        });
      }
      
      // Ordenar resultados: "Entregado" debe ir al final, el resto por ID
      resultados.sort((a, b) => {
        if (a.nombre === 'Entregado') return 1;
        if (b.nombre === 'Entregado') return -1;
        return a.id - b.id;
      });
      
      return resultados;
    } catch (error) {
      console.error('Error al obtener pedidos por estado:', error);
      throw error;
    }
  }

  // Obtener datos de pedidos entregados por repartidor
 // Obtener datos de pedidos por repartidor
async getPedidosPorRepartidor() {
    try {
      // Objeto para almacenar datos consolidados
      const datosConsolidados = {};
      
      // PASO 1: Obtener todos los pedidos agrupados por repartidor
      const [pedidosAgrupados] = await Pedido.sequelize.query(`
        SELECT 
          p.id_repartidor,
          u.nombre AS nombre_repartidor,
          COUNT(p.id_pedido) AS total_pedidos
        FROM 
          pedidos p
        JOIN 
          repartidores r ON p.id_repartidor = r.id_repartidor
        JOIN 
          usuarios u ON r.id_usuario = u.id_usuario
        WHERE 
          p.id_repartidor IS NOT NULL
        GROUP BY 
          p.id_repartidor, u.nombre
      `);
      
      // PASO 2: Procesar resultados
      if (pedidosAgrupados && pedidosAgrupados.length > 0) {
        pedidosAgrupados.forEach(row => {
          const nombreRepartidor = row.nombre_repartidor || 'Repartidor';
          const totalPedidos = parseInt(row.total_pedidos) || 0;
          datosConsolidados[nombreRepartidor] = totalPedidos;
        });
      }
      
      // PASO 3: Convertir datos a formato de gráfico
      let datosRepartidores = Object.keys(datosConsolidados).map(nombre => ({
        name: nombre,
        pedidos: datosConsolidados[nombre]
      }));
      
      // Si no hay datos, devolver mensaje informativo
      if (datosRepartidores.length === 0) {
        return [{ name: 'Sin datos disponibles', pedidos: 0 }];
      }
      
      // Ordenar por número de pedidos (descendente)
      return datosRepartidores.sort((a, b) => b.pedidos - a.pedidos);
      
    } catch (error) {
      console.error('Error al obtener pedidos por repartidor:', error);
      return [{ name: 'Error al cargar datos', pedidos: 0 }];
    }
  }

  // Obtener distribución de servicios por categoría
  async getDistribucionServicios() {
    try {
      // Consultar todos los pedido_servicio con sus servicios asociados
      const pedidoServicios = await PedidoServicio.findAll({
        include: [
          {
            model: Servicio,
            as: 'servicio',
            attributes: ['categoria']
          },
          {
            model: Pedido,
            as: 'pedido',
            attributes: []
          }
        ]
      });

      // Agrupar por categoría
      const categorias = {};
      let totalServicios = 0;

      pedidoServicios.forEach(ps => {
        if (!ps.servicio) return;
        
        const categoria = ps.servicio.categoria || 'Otros';
        const cantidad = ps.cantidad || 1;
        
        totalServicios += cantidad;
        
        if (!categorias[categoria]) {
          categorias[categoria] = 0;
        }
        
        categorias[categoria] += cantidad;
      });

      // Asignar colores a las categorías - Categorías estándar
      const coloresCategorias = {
        'Básica': '#4361ee',
        'Premium': '#f72585',
        'Secado': '#7209b7',
        'Comida rápida': '#f1c40f',
        'Mercado': '#e74c3c',
        'Farmacia': '#3498db',
        'Otros': '#2ecc71'
      };

      // Formatear datos para el gráfico de pie
      const datosServicios = Object.keys(categorias).map(categoria => {
        const porcentaje = Math.round((categorias[categoria] / totalServicios) * 100);
        return {
          name: categoria,
          value: porcentaje,
          color: coloresCategorias[categoria] || '#95a5a6'
        };
      });

      // Si no hay datos, crear datos de ejemplo
      if (datosServicios.length === 0) {
        return {
          datosServicios: [
            { name: 'Básica', value: 60, color: '#4361ee' },
            { name: 'Premium', value: 30, color: '#f72585' },
            { name: 'Secado', value: 10, color: '#7209b7' }
          ],
          serviciosLegend: [
            { nombre: 'Básica', color: '#4361ee' },
            { nombre: 'Premium', color: '#f72585' },
            { nombre: 'Secado', color: '#7209b7' }
          ]
        };
      }

      // Crear leyenda de servicios
      const serviciosLegend = datosServicios.map(servicio => ({
        nombre: servicio.name,
        color: servicio.color
      }));

      return {
        datosServicios,
        serviciosLegend
      };
    } catch (error) {
      console.error('Error al obtener distribución de servicios:', error);
      throw error;
    }
  }

  // Obtener todos los datos del dashboard
  async getDashboardData() {
    try {
      const [estadoCards, repartidoresData, serviciosData] = await Promise.all([
        this.getPedidosPorEstado(),
        this.getPedidosPorRepartidor(),
        this.getDistribucionServicios()
      ]);

      return {
        estadoCards,
        datosRepartidores: repartidoresData,
        datosServicios: serviciosData.datosServicios,
        serviciosLegend: serviciosData.serviciosLegend
      };
    } catch (error) {
      console.error('Error al obtener datos del dashboard:', error);
      throw error;
    }
  }
}

module.exports = new DashboardService();