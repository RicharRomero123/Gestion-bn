"use client";

import React, { useState, useEffect } from "react";
import { calcularVencimiento } from "@/lib/utils";
import { CANALES_OPCIONES } from "@/lib/constants";
import { X, Save, FileText, UserCheck } from "lucide-react";
import { ReclamoIndecopi } from "@/lib/types";

interface Props {
  initialData?: ReclamoIndecopi | null;
  onSave: (data: ReclamoIndecopi) => void;
  onClose: () => void;
}

export const FormularioReclamo = ({ initialData, onSave, onClose }: Props) => {
  // Inicializamos con la fecha de hoy automáticamente
  const [form, setForm] = useState<ReclamoIndecopi>({
    nroExpediente: "",
    solicitadoPor: "",
    datosCliente: "",
    canal: CANALES_OPCIONES[0],
    fechaRecepcion: new Date().toISOString().split('T')[0],
    fechaVencimiento: "",
    solicitudRealizada: false,
    estadoInforme: "NO ENVIADO",
    estadoNotificacion: "NO ENVIADO"
  });

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculamos el vencimiento antes de enviar
    const fechaVenc = calcularVencimiento(form.fechaRecepcion);

    onSave({
      ...form,
      fechaVencimiento: fechaVenc,
      // Si estamos editando, mantenemos el ID. Si es nuevo, el backend lo genera.
      id: initialData?.id 
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        {/* HEADER DEL MODAL */}
        <div className="bg-slate-800 p-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <UserCheck size={18} className="text-red-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {initialData ? "Editar Seguimiento" : "Nuevo Seguimiento Administrativo"}
            </span>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 text-sm">
          
          <div className="space-y-5">
            {/* CAMPO: NÚMERO DE EXPEDIENTE (NUEVO Y OBLIGATORIO) */}
            <div className="bg-red-50/50 p-4 rounded-xl border border-red-100">
              <label className="text-[10px] font-black text-red-700 uppercase flex items-center gap-2 mb-1">
                <FileText size={12} /> Número de Expediente
              </label>
              <input 
                required 
                placeholder="EJ: EXP-2026-0001"
                value={form.nroExpediente} 
                className="w-full bg-transparent border-b border-red-200 py-1 outline-none focus:border-red-600 uppercase font-black text-lg placeholder:text-red-200" 
                onChange={e => setForm({...form, nroExpediente: e.target.value.toUpperCase()})} 
              />
            </div>

            {/* CAMPO: SOLICITADO POR */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase">Unidad Solicitante</label>
              <input 
                required 
                value={form.solicitadoPor} 
                className="w-full border-b border-slate-200 py-2 outline-none focus:border-blue-600 uppercase font-bold text-slate-700" 
                onChange={e => setForm({...form, solicitadoPor: e.target.value.toUpperCase()})} 
              />
            </div>

            {/* CAMPO: DATOS DEL CLIENTE */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase">Datos del Cliente (Nombre / DNI)</label>
              <input 
                required 
                value={form.datosCliente} 
                className="w-full border-b border-slate-200 py-2 outline-none focus:border-blue-600 uppercase font-bold text-slate-700" 
                onChange={e => setForm({...form, datosCliente: e.target.value.toUpperCase()})} 
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* CAMPO: CANAL */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase">Canal de Ingreso</label>
                <select 
                  className="w-full border-b border-slate-200 py-2 bg-transparent font-bold text-slate-700 cursor-pointer" 
                  value={form.canal}
                  onChange={e => setForm({...form, canal: e.target.value})}
                >
                  {CANALES_OPCIONES.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              {/* CAMPO: FECHA DE RECEPCIÓN (AUTOMÁTICA) */}
              <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">Fecha de Ingreso</label>
                <p className="font-mono font-black text-slate-700 text-sm">
                  {form.fechaRecepcion}
                </p>
                <span className="text-[8px] text-blue-600 font-bold uppercase">Sincronizado hoy</span>
              </div>
            </div>
          </div>

          {/* BOTÓN DE ACCIÓN */}
          <button 
            type="submit" 
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
          >
            <Save size={18} /> 
            {initialData ? "Guardar Cambios" : "Registrar en Base de Datos"}
          </button>
          
          <p className="text-center text-[9px] text-slate-400 font-medium">
            Al confirmar, se calculará automáticamente el plazo legal de 3 días hábiles.
          </p>
        </form>
      </div>
    </div>
  );
};