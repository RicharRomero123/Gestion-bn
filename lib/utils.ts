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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calcularVencimiento = (fechaRec: string): string => {
  const fecha = addBusinessDays(parseISO(fechaRec), 3);
  return format(fecha, "yyyy-MM-dd");
};

/**
 * Lógica del Semáforo con Regla de 3 Pasos para Indecopi
 */
export const obtenerInfoSemaforo = (item: any): EstadoSemaforo => {
  // 1. REGLA DE TRIPLE CHECK (Para Indecopi)
  const esIndecopiAtendido = 
    item.estadoInforme === "ENVIADO" && 
    item.solicitudRealizada === true && 
    item.estadoNotificacion === "ENVIADO";

  // REGLA PARA ABONOS
  const esAbonoAtendido = item.constanciaEntregada === true;

  if (esIndecopiAtendido || esAbonoAtendido) {
    return { 
      label: "ATENDIDO / LISTO", 
      color: "bg-green-50 text-green-700 border border-green-200", 
      critico: false 
    };
  }

  // 2. LÓGICA POR TIEMPO (Si no está atendido)
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

    // Estado interno para el filtro (Triple Check)
    let estadoActual = "DENTRO_PLAZO";
    const esAtendido = item.estadoInforme === "ENVIADO" && item.solicitudRealizada && item.estadoNotificacion === "ENVIADO";

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

    let estadoActual = "DENTRO_PLAZO";
    if (item.constanciaEntregada) {
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