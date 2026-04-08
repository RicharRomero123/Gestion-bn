"use client";

import React, { useState, useMemo } from "react";
import { Abono } from "@/lib/types";
import { obtenerInfoSemaforo, cn } from "@/lib/utils";
import { 
  User, Users, Calendar, CheckCircle2, XCircle, 
  Pencil, Trash2, History, ChevronLeft, ChevronRight, Gavel, Clock, DollarSign 
} from "lucide-react";

interface TablaAbonosProps {
  data: Abono[];
  onUpdateStatus: (id: number, field: string, value: any) => void;
  onEdit: (item: Abono) => void;
  onDelete: (id: number) => void;
}

export const TablaAbonos = ({ data, onUpdateStatus, onEdit, onDelete }: TablaAbonosProps) => {
  // Ordenar por ID descendente para ver lo más nuevo primero
  const sortedData = useMemo(() => [...data].sort((a: any, b: any) => b.id - a.id), [data]);
  
  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;
  const totalPaginas = Math.ceil(sortedData.length / itemsPorPagina);
  const dataPaginada = sortedData.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200">
            <th className="p-5">Participantes</th>
            <th className="p-5">Desglose Económico (S/)</th>
            <th className="p-5 text-center">Plazos Legales</th>
            <th className="p-5 text-center">Gestión de Intereses</th>
            <th className="p-5 text-center">Constancia</th>
            <th className="p-5 text-center">Estado Final</th>
            <th className="p-5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-[11px] divide-y divide-slate-100">
          {dataPaginada.map((item: Abono) => {
            const semaforo = obtenerInfoSemaforo(item);
            const tieneInteres = (item.interesesLegales || 0) > 0;
            const total = (item.importeReclamado || 0) + (item.interesesLegales || 0) + (item.costas || 0);

            return (
              <tr key={item.id} className="hover:bg-blue-50/20 transition-colors group">
                {/* 1. PARTICIPANTES */}
                <td className="p-5 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-800 uppercase">
                    <User size={14} className="text-blue-500" /> {item.solicitante}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 uppercase text-[9px]">
                    <Users size={12} /> {item.cliente}
                  </div>
                </td>

                {/* 2. MONTOS DETALLADOS (Principal, Interés, Costas y Total) */}
                <td className="p-5">
                  <div className="space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-100 w-fit min-w-[140px] shadow-sm">
                    <div className="flex justify-between gap-4 text-[9px]">
                      <span className="text-slate-400 font-bold uppercase">Principal:</span>
                      <span className="font-bold text-slate-700">{(item.importeReclamado || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-[9px]">
                      <span className="text-slate-400 font-bold uppercase">Interés:</span>
                      <span className={cn("font-bold", tieneInteres ? "text-amber-600" : "text-slate-400")}>
                        {(item.interesesLegales || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 text-[9px]">
                      <span className="text-slate-400 font-bold uppercase">Costas:</span>
                      <span className="font-bold text-slate-700">{(item.costas || 0).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-slate-200 mt-1 pt-1 flex justify-between gap-4">
                      <span className="text-blue-700 font-black text-[9px] uppercase">TOTAL:</span>
                      <span className="font-black text-blue-800">S/ {total.toFixed(2)}</span>
                    </div>
                  </div>
                </td>

                {/* 3. PLAZOS (FECHA INGRESO Y VENCIMIENTO) */}
                <td className="p-5 text-center font-mono text-[10px]">
                  <div className="text-slate-400 uppercase tracking-tighter flex items-center justify-center gap-1">
                    <Calendar size={10} /> ING: {item.fechaIngreso}
                  </div>
                  <div className={cn(
                    "font-black uppercase mt-1 px-2 py-0.5 rounded inline-block",
                    semaforo.critico ? "text-red-700 bg-red-50" : "text-slate-700 bg-slate-100"
                  )}>
                    VENCE: {item.fechaVencimiento}
                  </div>
                </td>

                {/* 4. GESTIÓN DE INTERESES (INCLUYE FECHA DE ACTUALIZACIÓN) */}
                <td className="p-5">
                  {tieneInteres ? (
                    <div className="flex flex-col gap-2 min-w-[150px]">
                      <div className="space-y-1">
                        <select 
                          value={item.notaAbonoInteres || "PENDIENTE"}
                          onChange={(e) => onUpdateStatus(item.id!, 'notaAbonoInteres', e.target.value)}
                          className={cn(
                            "w-full border rounded-lg p-1.5 font-black text-[9px] outline-none uppercase cursor-pointer shadow-sm transition-colors",
                            item.notaAbonoInteres === "ATENDIDO" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"
                          )}
                        >
                          <option value="PENDIENTE">PENDIENTE</option>
                          <option value="ATENDIDO">ATENDIDO</option>
                        </select>
                        {item.fechaUpdateIntereses && (
                          <div className="text-[8px] text-amber-600 font-black flex items-center justify-center gap-1 uppercase">
                            <Clock size={10} /> Liquidado: {item.fechaUpdateIntereses}
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => onUpdateStatus(item.id!, 'enviadoLegalInteres', !item.enviadoLegalInteres)}
                        className={cn(
                          "w-full flex items-center justify-center gap-2 py-1.5 rounded-lg font-black text-[9px] uppercase border transition-all active:scale-95 shadow-sm",
                          item.enviadoLegalInteres 
                            ? "bg-red-50 text-red-600 border-red-200" 
                            : "bg-slate-50 text-slate-400 border-slate-200"
                        )}
                      >
                        <Gavel size={12} />
                        {item.enviadoLegalInteres ? "EN LEGAL: SÍ" : "EN LEGAL: NO"}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-slate-300 italic text-[9px] uppercase font-bold tracking-tighter">
                      Abono Principal Directo
                    </div>
                  )}
                </td>

                {/* 5. CONSTANCIA DE ENTREGA (INCLUYE FECHA DE ENTREGA) */}
                <td className="p-5 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <button 
                      onClick={() => onUpdateStatus(item.id!, 'constanciaEntregada', !item.constanciaEntregada)}
                      className={cn(
                        "p-3 rounded-xl border transition-all shadow-sm active:scale-90",
                        item.constanciaEntregada ? "bg-green-600 text-white border-green-700" : "bg-white text-slate-200 border-slate-200"
                      )}
                    >
                      <CheckCircle2 size={20} />
                    </button>
                    {item.fechaEntregaConstancia && (
                      <div className="text-[8px] text-green-600 font-black flex items-center gap-1 uppercase">
                        <History size={10} /> RECIBIDO: {item.fechaEntregaConstancia}
                      </div>
                    )}
                  </div>
                </td>

                {/* 6. ESTADO FINAL */}
                <td className="p-5 text-center">
                  <div className={cn("inline-flex px-3 py-2 rounded-lg text-[9px] font-black uppercase border shadow-sm transition-all", semaforo.color)}>
                    {semaforo.label}
                  </div>
                </td>

                {/* 7. ACCIONES */}
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(item)} className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600" title="Editar"><Pencil size={15} /></button>
                    <button onClick={() => onDelete(item.id!)} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600" title="Eliminar"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Footer de Paginación */}
      <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <DollarSign size={12} /> Gestión Financiera Banco de la Nación
        </span>
        <div className="flex gap-2">
          <button disabled={paginaActual === 1} onClick={() => setPaginaActual(p => p - 1)} className="p-2 border rounded-lg bg-white hover:bg-slate-50 disabled:opacity-30 shadow-sm"><ChevronLeft size={16} /></button>
          <div className="text-[10px] font-black px-4 py-2 border rounded-lg bg-white text-slate-700">PÁG. {paginaActual} / {totalPaginas}</div>
          <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(p => p + 1)} className="p-2 border rounded-lg bg-white hover:bg-slate-50 disabled:opacity-30 shadow-sm"><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
};