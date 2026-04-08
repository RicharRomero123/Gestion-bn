import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { 
  addBusinessDays, 
  format, 
  parseISO, 
  differenceInDays, 
  isWithinInterval, 
  startOfDay, 
  endOfDay 
} from "date-fns";
import { ReclamoIndecopi, Abono, EstadoSemaforo } from "./types";

/**
 * Utilidad para combinar clases de Tailwind sin conflictos de cascada.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calcula la fecha de vencimiento sumando 3 días hábiles.
 */
export const calcularVencimiento = (fechaRec: string): string => {
  const fecha = addBusinessDays(parseISO(fechaRec), 3);
  return format(fecha, "yyyy-MM-dd");
};

/**
 * LÓGICA DEL SEMÁFORO (Cerebro Visual)
 * Implementa la lógica estricta para Indecopi y Abonos (Con/Sin Interés).
 */
export const obtenerInfoSemaforo = (item: any): EstadoSemaforo => {
  // 1. REGLA DE TRIPLE CHECK (Para Indecopi)
  const esIndecopiAtendido = 
    item.estadoInforme === "ENVIADO" && 
    item.solicitudRealizada === true && 
    (item.estadoNotificacion === "ENVIADO CON COMPROBANTE" || 
     item.estadoNotificacion === "ENVIADO SIN COMPROBANTE");

  // 2. REGLA ESTRICTA PARA ABONOS (Actualizada con Secuencia Legal)
  const tieneInteres = (item.interesesLegales || 0) > 0;
  let esAbonoAtendido = false;

  if (tieneInteres) {
    // SECUENCIA OBLIGATORIA SI HAY INTERÉS: Nota Atendida + Enviado Legal + Constancia
    esAbonoAtendido = 
      item.notaAbonoInteres === "ATENDIDO" && 
      item.enviadoLegalInteres === true && 
      item.constanciaEntregada === true;
  } else {
    // FLUJO DIRECTO: Solo requiere la Constancia
    esAbonoAtendido = item.constanciaEntregada === true;
  }

  if (esIndecopiAtendido || esAbonoAtendido) {
    return { 
      label: "ATENDIDO / ARCHIVADO", 
      color: "bg-green-50 text-green-700 border border-green-200", 
      critico: false 
    };
  }

  // 3. LÓGICA POR TIEMPO (Si no está atendido)
  const hoy = startOfDay(new Date());
  const vencimiento = parseISO(item.fechaVencimiento);
  const diasRestantes = differenceInDays(vencimiento, hoy);

  if (diasRestantes < 0) {
    return { 
      label: "VENCIDO / FUERA DE PLAZO", 
      color: "bg-red-50 text-red-700 border border-red-200 font-bold", 
      critico: true 
    };
  }

  if (diasRestantes <= 1) {
    return { 
      label: "URGENTE / CRÍTICO", 
      color: "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse font-bold", 
      critico: true 
    };
  }

  return { 
    label: "DENTRO DE PLAZO", 
    color: "bg-blue-50 text-blue-700 border border-blue-200", 
    critico: false 
  };
};

/**
 * FILTRO PARA INDECOPI
 */
export const filtrarPorRangoYBusqueda = (
  data: ReclamoIndecopi[], 
  busqueda: string, 
  fechaInicio: string, 
  fechaFin: string,
  filtroEstado: string
): ReclamoIndecopi[] => {
  const hoy = startOfDay(new Date());

  return data.filter((item) => {
    const term = busqueda.toLowerCase();
    const vencimiento = parseISO(item.fechaVencimiento);
    const diasRestantes = differenceInDays(vencimiento, hoy);

    const esAtendido = 
      item.estadoInforme === "ENVIADO" && 
      item.solicitudRealizada && 
      (item.estadoNotificacion === "ENVIADO CON COMPROBANTE" || 
       item.estadoNotificacion === "ENVIADO SIN COMPROBANTE");

    let estadoActual = "DENTRO_PLAZO";
    if (esAtendido) {
      estadoActual = "ATENDIDO";
    } else if (diasRestantes < 0) {
      estadoActual = "VENCIDO";
    } else if (diasRestantes <= 1) {
      estadoActual = "CRITICO";
    }

    const coincideBusqueda = 
      item.nroExpediente?.toLowerCase().includes(term) || 
      item.solicitadoPor.toLowerCase().includes(term) || 
      item.datosCliente.toLowerCase().includes(term);

    const coincideEstado = filtroEstado === "TODOS" || estadoActual === filtroEstado;

    let coincideFecha = true;
    if (fechaInicio && fechaFin) {
      const fechaItem = parseISO(item.fechaRecepcion);
      coincideFecha = isWithinInterval(fechaItem, {
        start: startOfDay(parseISO(fechaInicio)),
        end: endOfDay(parseISO(fechaFin)),
      });
    }

    return coincideBusqueda && coincideEstado && coincideFecha;
  });
};

/**
 * FILTRO PARA ABONOS (Actualizado con secuencia de Nota + Legal)
 */
export const filtrarAbonos = (
  data: Abono[], 
  busqueda: string, 
  fechaInicio: string, 
  fechaFin: string,
  filtroEstado: string
): Abono[] => {
  const hoy = startOfDay(new Date());

  return data.filter((item) => {
    const term = busqueda.toLowerCase();
    const vencimiento = parseISO(item.fechaVencimiento);
    const diasRestantes = differenceInDays(vencimiento, hoy);

    // Lógica dual para el filtro de "Atendidos"
    const tieneInteres = (item.interesesLegales || 0) > 0;
    const esAtendido = tieneInteres 
      ? (item.notaAbonoInteres === "ATENDIDO" && item.enviadoLegalInteres && item.constanciaEntregada)
      : item.constanciaEntregada;

    let estadoActual = "DENTRO_PLAZO";
    if (esAtendido) {
      estadoActual = "ATENDIDO";
    } else if (diasRestantes < 0) {
      estadoActual = "VENCIDO";
    } else if (diasRestantes <= 1) {
      estadoActual = "CRITICO";
    }

    const coincideBusqueda = 
      item.solicitante.toLowerCase().includes(term) || 
      item.cliente.toLowerCase().includes(term);

    const coincideEstado = filtroEstado === "TODOS" || estadoActual === filtroEstado;

    let coincideFecha = true;
    if (fechaInicio && fechaFin) {
      const fechaItem = parseISO(item.fechaIngreso);
      coincideFecha = isWithinInterval(fechaItem, {
        start: startOfDay(parseISO(fechaInicio)),
        end: endOfDay(parseISO(fechaFin)),
      });
    }

    return coincideBusqueda && coincideEstado && coincideFecha;
  });
};