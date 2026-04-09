"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ClipboardList, User, Calendar, Info } from "lucide-react";

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    api.auditoria.getAll().then(setLogs).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <ClipboardList className="text-red-700" size={32} />
        <div>
          <h1 className="text-2xl font-bold text-[#002e5f]">Historial de Auditoría</h1>
          <p className="text-slate-500 text-sm">Registro de todas las acciones realizadas en el sistema.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-widest text-slate-600">
            <tr>
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Acción</th>
              <th className="px-6 py-4">Entidad</th>
              <th className="px-6 py-4">Detalle</th>
              <th className="px-6 py-4">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log: any) => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-xs">
                      {log.usuario.charAt(0)}
                    </div>
                    <span className="font-semibold text-slate-700">{log.usuario}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase",
                    log.accion === 'CREACION' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>
                    {log.accion}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium text-sm">{log.entidad}</td>
                <td className="px-6 py-4 text-slate-500 text-sm italic">"{log.detalle}"</td>
                <td className="px-6 py-4 text-slate-400 text-xs">
                  {new Date(log.fecha).toLocaleString('es-PE')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}