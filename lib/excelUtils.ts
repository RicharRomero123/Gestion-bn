import * as XLSX from "xlsx";
import { format } from "date-fns";
import { Abono, ReclamoIndecopi } from "./types";
import { obtenerInfoSemaforo } from "./utils";

export const exportarAExcel = (data: any[], tipo: "INDECOPI" | "ABONOS") => {
  let dataParaExcel = [];

  if (tipo === "ABONOS") {
    dataParaExcel = data.map((item: Abono) => ({
      "SOLICITANTE": item.solicitante,
      "CLIENTE": item.cliente,
      "IMPORTE PRINCIPAL": `S/ ${item.importeReclamado.toFixed(2)}`,
      "INTERESES": `S/ ${item.interesesLegales.toFixed(2)}`,
      "COSTAS": `S/ ${item.costas.toFixed(2)}`,
      "TOTAL ACUMULADO": `S/ ${(item.importeReclamado + item.interesesLegales + item.costas).toFixed(2)}`,
      "FECHA INGRESO": item.fechaIngreso,
      "FECHA VENCIMIENTO": item.fechaVencimiento,
      "ESTADO": obtenerInfoSemaforo(item).label,
      "FECHA ENTREGA": item.fechaEntregaConstancia || "PENDIENTE"
    }));
  } else {
    dataParaExcel = data.map((item: ReclamoIndecopi) => ({
      "EXPEDIENTE": item.nroExpediente,
      "SOLICITADO POR": item.solicitadoPor,
      "CLIENTE": item.datosCliente,
      "CANAL": item.canal,
      "FECHA RECEPCIÓN": item.fechaRecepcion,
      "FECHA VENCIMIENTO": item.fechaVencimiento,
      "ESTADO INFORME": item.estadoInforme,
      "ESTADO NOTIFICACIÓN": item.estadoNotificacion,
      "ESTADO GENERAL": obtenerInfoSemaforo(item).label
    }));
  }

  // Creación del libro y la hoja
  const worksheet = XLSX.utils.json_to_sheet(dataParaExcel);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, tipo);

  // Ajuste automático de ancho de columnas
  const objectMaxLength: any[] = [];
  dataParaExcel.forEach((row: any) => {
    Object.keys(row).forEach((key, i) => {
      const value = row[key] ? row[key].toString() : "";
      objectMaxLength[i] = Math.max(objectMaxLength[i] || 0, value.length, key.length);
    });
  });
  worksheet["!cols"] = objectMaxLength.map(w => ({ width: w + 2 }));

  // Descarga del archivo con nombre dinámico
  const nombreArchivo = `REPORTE_${tipo}_${format(new Date(), "yyyyMMdd_HHmm")}.xlsx`;
  XLSX.writeFile(workbook, nombreArchivo);
};