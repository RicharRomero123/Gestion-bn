/**
 * ESTADOS ESPECÍFICOS PARA INDECOPI
 * Separamos Informe de Notificación para un control total del flujo.
 */
export type EstadoInformeIndecopi = "PENDIENTE" | "ENVIADO";

export type EstadoNotificacionIndecopi = 
  | "NO ENVIADO" 
  | "ENVIADO CON COMPROBANTE" 
  | "ENVIADO SIN COMPROBANTE";

/**
 * INTERFAZ PARA EL SEMÁFORO (UI)
 */
export interface EstadoSemaforo {
  label: string;
  color: string;
  critico: boolean;
}

/**
 * MODELO: RECLAMOS INDECOPI
 * Mapea la entidad del Banco de la Nación.
 */
export interface ReclamoIndecopi {
  id?: number;              // OPCIONAL: Permite crear nuevos sin ID inicial
  nroExpediente: string;    // Identificador del caso
  solicitadoPor: string;    // Abogado asignado
  datosCliente: string;     // Nombre / DNI
  canal: string;            // Libro Reclamos, Web, etc.
  fechaRecepcion: string;   // Formato YYYY-MM-DD
  fechaVencimiento: string; // Calculado (3 días hábiles)
  solicitudRealizada: boolean;
  
  // Gestión de Informe
  estadoInforme: EstadoInformeIndecopi;
  fechaUpdateInforme?: string | null;
  
  // Gestión de Notificación (Flujo de 3 estados)
  estadoNotificacion: EstadoNotificacionIndecopi;
  fechaUpdateNotificacion?: string | null;
}

/**
 * MODELO: GESTIÓN DE ABONOS
 */
export interface Abono {
  id?: number;
  solicitante: string;
  cliente: string;
  importeReclamado: number;
  interesesLegales: number;
  costas: number;
  
  // FECHAS DE PROCESO
  fechaIngreso: string;
  fechaVencimiento: string;
  fechaUpdateIntereses?: string | null; // <--- ESTA ES LA QUE TE DABA ERROR
  
  // ESTADOS DE GESTIÓN
  constanciaEntregada: boolean;
  fechaEntregaConstancia?: string | null;
  
  // FLUJO ESPECÍFICO DE INTERÉS
  notaAbonoInteres: "PENDIENTE" | "ATENDIDO";
  enviadoLegalInteres: boolean;
}

/**
 * DTOs DE ESTADÍSTICAS (Dashboard)
 */
export interface ReclamoStats {
  total: number;
  ingresadosHoy: number;
  criticos: number;
  vencidos: number;
  completados: number;
}

export interface AbonoStats {
  total: number;
  ingresadosHoy: number;
  pendientesConstancia: number;
  vencidos: number;
  montoTotalAcumulado: number;
}
export type EstadoNotaAbono = "PENDIENTE" | "ATENDIDO" | "NO ATENDIDO";
export type GenericStats = ReclamoStats | AbonoStats | null;