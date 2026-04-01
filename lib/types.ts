/**
 * ESTADOS DE GESTIÓN (Type Aliases para evitar errores de dedo)
 * Define los estados permitidos para el flujo de informes y notificaciones.
 */
export type EstadoGestion = "NO ENVIADO" | "PENDIENTE" | "ENVIADO";

/**
 * INTERFAZ PARA EL SEMÁFORO (UI)
 * Define la estructura visual que retornan las funciones de utilidad.
 */
export interface EstadoSemaforo {
  label: string;
  color: string;
  critico: boolean;
}

/**
 * MODELO: RECLAMOS INDECOPI
 * Mapea directamente con la entidad ReclamoIndecopi.java del Backend.
 */
export interface ReclamoIndecopi {
  id?: number;               // Generado por la base de datos
  nroExpediente: string;     // Identificador único del caso
  solicitadoPor: string;
  datosCliente: string;
  canal: string;
  fechaRecepcion: string;    // Formato YYYY-MM-DD
  fechaVencimiento: string;  // Formato YYYY-MM-DD (Calculado en Backend)
  solicitudRealizada: boolean;
  
  // Gestión de Informe
  estadoInforme: EstadoGestion;
  fechaUpdateInforme?: string | null;
  
  // Gestión de Notificación
  estadoNotificacion: EstadoGestion;
  fechaUpdateNotificacion?: string | null;
}

/**
 * MODELO: GESTIÓN DE ABONOS
 * Mapea directamente con la entidad Abono.java del Backend.
 */
export interface Abono {
  id?: number;
  solicitante: string;
  cliente: string;
  importeReclamado: number;
  interesesLegales: number;
  costas: number;
  fechaIngreso: string;            // Fecha en que entra el pedido
  fechaVencimiento: string;        // Fecha límite (Calculada en Backend)
  fechaUpdateIntereses?: string | null; // AUDITORÍA: Fecha en que se añadieron intereses
  constanciaEntregada: boolean;
  fechaEntregaConstancia?: string | null;
}

/**
 * DTOs DE ESTADÍSTICAS (PROVENIENTES DEL BACKEND)
 * Estas interfaces deben coincidir EXACTAMENTE con las clases Java del servidor.
 */

export interface ReclamoStats {
  total: number;
  ingresadosHoy: number;
  criticos: number;    // Casos a 1 día de vencer o venciendo hoy
  vencidos: number;    // Casos con fecha vencimiento pasada y sin completar
  completados: number; // Casos con estado "ENVIADO"
}

export interface AbonoStats {
  total: number;
  ingresadosHoy: number;
  pendientesConstancia: number; // constanciaEntregada = false
  vencidos: number;             // fechaVencimiento pasada + pendiente
  montoTotalAcumulado: number;  // Sumatoria total de S/ (Importe + Int + Costas)
}

/**
 * TIPO AUXILIAR PARA DASHBOARD
 * Permite manejar estados de carga y errores de forma genérica.
 */
export type GenericStats = ReclamoStats | AbonoStats | null;

