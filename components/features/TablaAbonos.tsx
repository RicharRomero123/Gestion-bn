"use client";

import React, { useState } from "react";
import { Abono } from "@/lib/types";
import { obtenerInfoSemaforo, cn } from "@/lib/utils";
import { 
  User, Users, Calendar, CheckCircle2, XCircle, 
  Pencil, Trash2, History, ChevronLeft, ChevronRight 
} from "lucide-react";

interface TablaAbonosProps {
  data: Abono[];
  onUpdateStatus: (id: number, field: string, value: any) => void;
  onEdit: (item: Abono) => void;
  onDelete: (id: number) => void;
}

export const TablaAbonos = ({ data, onUpdateStatus, onEdit, onDelete }: TablaAbonosProps) => {
  // --- LÓGICA DE PAGINACIÓN ---
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;
  const totalPaginas = Math.ceil(data.length / itemsPorPagina);

  const dataPaginada = data.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200">
            <th className="p-5">Participantes</th>
            <th className="p-5">Detalle Financiero</th>
            <th className="p-5">Plazos Legales</th>
            <th className="p-5 text-center">Constancia de Entrega</th>
            <th className="p-5 text-center">Estado de Gestión</th>
            <th className="p-5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-[11px] divide-y divide-slate-100">
          {dataPaginada.map((item: Abono) => {
            const semaforo = obtenerInfoSemaforo(item as any); 
            
            return (
              <tr key={item.id} className="hover:bg-blue-50/20 transition-colors group">
                {/* 1. PARTICIPANTES */}
                <td className="p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-blue-500" />
                    <span className="font-bold text-slate-800 uppercase leading-none">{item.solicitante}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-slate-400" />
                    <span className="text-slate-600 uppercase leading-none">{item.cliente}</span>
                  </div>
                </td>

                {/* 2. DETALLE FINANCIERO */}
                <td className="p-5 space-y-1">
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span className="text-slate-400 uppercase font-bold text-[9px]">Importe Principal:</span>
                    <span className="font-bold text-slate-700">S/ {(item.importeReclamado || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[9px]">
                    <span className="text-slate-400 uppercase">Intereses Legales:</span>
                    <span className={cn("font-medium", item.interesesLegales && item.interesesLegales > 0 ? "text-blue-600 font-bold" : "text-slate-400")}>
                      S/ {(item.interesesLegales || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[9px]">
                    <span className="text-slate-400 uppercase">Costas Procesales:</span>
                    <span className="text-slate-600 font-medium">S/ {(item.costas || 0).toFixed(2)}</span>
                  </div>
                </td>

                {/* 3. PLAZOS */}
                <td className="p-5 font-mono text-[10px]">
                  <div className="text-slate-500 uppercase flex items-center gap-1">
                    <Calendar size={12} /> INGRESO: {item.fechaIngreso}
                  </div>
                  <div className={cn(
                    "font-black uppercase mt-1 px-2 py-0.5 rounded w-fit",
                    semaforo.critico ? "text-red-700 bg-red-50" : "text-slate-700 bg-slate-100"
                  )}>
                    LÍMITE: {item.fechaVencimiento}
                  </div>
                </td>

                {/* 4. CONSTANCIA */}
                <td className="p-5 text-center">
                  <button 
                    onClick={() => onUpdateStatus(item.id!, 'constanciaEntregada', !item.constanciaEntregada)}
                    className={cn(
                      "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-black uppercase text-[9px] border transition-all active:scale-95",
                      item.constanciaEntregada 
                        ? "bg-green-50 text-green-700 border-green-200" 
                        : "bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600"
                    )}
                  >
                    {item.constanciaEntregada ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {item.constanciaEntregada ? "ENTREGADO" : "PENDIENTE"}
                  </button>
                  {item.fechaEntregaConstancia && (
                    <div className="text-[8px] text-slate-400 mt-1 uppercase font-bold flex items-center justify-center gap-1">
                      <History size={10} /> RECIBIDO EL {item.fechaEntregaConstancia}
                    </div>
                  )}
                </td>

                {/* 5. ESTADO */}
                <td className="p-5 text-center">
                  <div className={cn("inline-flex px-3 py-2 rounded-lg text-[9px] font-black uppercase border", semaforo.color)}>
                    {semaforo.label}
                  </div>
                </td>

                {/* 6. ACCIONES */}
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(item)} 
                      title="Editar registro"
                      className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button 
                      onClick={() => onDelete(item.id!)} 
                      title="Eliminar registro"
                      className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* --- FOOTER CON PAGINACIÓN --- */}
      <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
        <div className="text-[10px] font-bold text-slate-500 uppercase">
          Mostrando {dataPaginada.length} de {data.length} registros financieros
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual(p => p - 1)}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="text-[11px] font-black px-4 text-slate-700">
            PÁGINA {paginaActual} DE {totalPaginas || 1}
          </div>

          <button 
            disabled={paginaActual === totalPaginas || totalPaginas === 0}
            onClick={() => setPaginaActual(p => p + 1)}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};