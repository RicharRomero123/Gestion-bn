"use client";

import React, { useState } from "react";
import { ReclamoIndecopi } from "@/lib/types";
import { obtenerInfoSemaforo, cn } from "@/lib/utils";
import { ESTADOS_ENVIO } from "@/lib/constants";
import { 
  User, Users, Calendar, Clock, Pencil, Trash2, 
  CheckCircle2, XCircle, Hash, History, ChevronLeft, ChevronRight 
} from "lucide-react";
import { format, parseISO } from "date-fns";

export const TablaReclamos = ({ data, onUpdateStatus, onEdit, onDelete }: any) => {
  // Lógica de Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;
  const totalPaginas = Math.ceil(data.length / itemsPorPagina);
  const dataPaginada = data.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  const formatearAuditoria = (fecha?: string | null) => {
    if (!fecha) return null;
    return format(parseISO(fecha), "dd/MM/yyyy HH:mm");
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200">
              <th className="p-5">Expediente / Participantes</th>
              <th className="p-5">Plazos</th>
              <th className="p-5">Gestión Informe</th>
              <th className="p-5 text-center">Solicitud Notif.</th>
              <th className="p-5">Gestión Notificación</th>
              <th className="p-5 text-center">Estado General</th>
              <th className="p-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-[11px] divide-y divide-slate-100">
            {dataPaginada.map((item: ReclamoIndecopi) => {
              const semaforo = obtenerInfoSemaforo(item);
              return (
                <tr key={item.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="p-5 space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 font-mono font-black text-[9px]">
                      <Hash size={10} /> {item.nroExpediente}
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-blue-500" />
                      <span className="font-bold text-slate-800 uppercase">{item.solicitadoPor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-slate-400" />
                      <span className="text-slate-600 uppercase">{item.datosCliente}</span>
                    </div>
                  </td>

                  <td className="p-5">
                    <div className="font-bold text-slate-700 text-[10px] mb-1">{item.canal}</div>
                    <div className="space-y-1 font-mono text-[10px]">
                      <div className="text-slate-400 uppercase">REC: {item.fechaRecepcion}</div>
                      <div className="text-red-600 font-bold uppercase">VENCE: {item.fechaVencimiento}</div>
                    </div>
                  </td>

                  <td className="p-5 space-y-1">
                    <select 
                      value={item.estadoInforme}
                      onChange={(e) => onUpdateStatus(item.id, 'estadoInforme', e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 font-bold outline-none text-[10px]"
                    >
                      {ESTADOS_ENVIO.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                    {item.fechaUpdateInforme && (
                      <div className="flex items-center gap-1 text-[8px] text-slate-400 italic">
                        <History size={10} /> {formatearAuditoria(item.fechaUpdateInforme)}
                      </div>
                    )}
                  </td>

                  <td className="p-5 text-center">
                    <button 
                      onClick={() => onUpdateStatus(item.id, 'solicitudRealizada', !item.solicitudRealizada)}
                      className={cn(
                        "inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold uppercase text-[9px] border transition-all",
                        item.solicitudRealizada ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50 text-slate-400 border-slate-200"
                      )}
                    >
                      {item.solicitudRealizada ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {item.solicitudRealizada ? "SÍ" : "NO"}
                    </button>
                  </td>

                  <td className="p-5 space-y-1">
                    <select 
                      value={item.estadoNotificacion}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "ENVIADO" && !item.solicitudRealizada) {
                          alert("⚠️ BLOQUEO: No se puede enviar Notificación sin Solicitud previa.");
                          return;
                        }
                        onUpdateStatus(item.id, 'estadoNotificacion', val);
                      }}
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 font-bold outline-none text-[10px]"
                    >
                      {ESTADOS_ENVIO.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                    {item.fechaUpdateNotificacion && (
                      <div className="flex items-center gap-1 text-[8px] text-slate-400 italic">
                        <History size={10} /> {formatearAuditoria(item.fechaUpdateNotificacion)}
                      </div>
                    )}
                  </td>

                  <td className="p-5 text-center font-black">
                    <div className={cn("inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[9px] uppercase border shadow-sm", semaforo.color)}>
                      {semaforo.label}
                    </div>
                  </td>

                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit(item)} className="p-2 hover:bg-blue-50 rounded text-slate-400 hover:text-blue-600"><Pencil size={15} /></button>
                      <button onClick={() => onDelete(item.id)} className="p-2 hover:bg-red-50 rounded text-slate-400 hover:text-red-600"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Paginador */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Total: {data.length} registros</span>
          <div className="flex gap-2">
            <button 
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual(prev => prev - 1)}
              className="p-2 border rounded-lg bg-white hover:bg-slate-50 disabled:opacity-30"
            ><ChevronLeft size={16} /></button>
            <span className="flex items-center text-[10px] font-black px-4">Página {paginaActual} de {totalPaginas}</span>
            <button 
              disabled={paginaActual === totalPaginas}
              onClick={() => setPaginaActual(prev => prev + 1)}
              className="p-2 border rounded-lg bg-white hover:bg-slate-50 disabled:opacity-30"
            ><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};