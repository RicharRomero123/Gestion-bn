"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Banknote, AlertCircle } from "lucide-react";
import { Abono } from "@/lib/types";

interface Props {
  initialData?: Abono | null;
  onSave: (data: Abono) => void;
  onClose: () => void;
}

export const FormularioAbono = ({ initialData, onSave, onClose }: Props) => {
  const hoy = new Date().toISOString().split('T')[0];
  
  const [form, setForm] = useState<Partial<Abono>>({
    solicitante: "",
    cliente: "",
    importeReclamado: 0,
    interesesLegales: 0,
    costas: 0,
    fechaIngreso: hoy,
    constanciaEntregada: false,
  });

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData });
    }
  }, [initialData]);

  const handleNumberChange = (field: string, value: string) => {
    const parsedValue = parseFloat(value);
    setForm((prev) => ({
      ...prev,
      [field]: isNaN(parsedValue) ? 0 : parsedValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // El backend recibira este objeto y aplicara la logica de los 3 dias habiles
    onSave(form as Abono);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        {/* CABECERA */}
        <div className="bg-slate-800 p-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Banknote size={20} className="text-green-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {initialData ? "Actualizacion de Abono Administrativo" : "Registro de Abono Administrativo"}
            </span>
          </div>
          <button onClick={onClose} className="hover:opacity-70 transition-opacity">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* CAMPOS DE IDENTIFICACION */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Unidad Solicitante</label>
              <input 
                required 
                value={form.solicitante}
                placeholder="EJ. AREA DE LEGALES"
                className="w-full border-b border-slate-200 py-2 outline-none focus:border-blue-600 font-bold uppercase text-sm placeholder:text-slate-200" 
                onChange={e => setForm({...form, solicitante: e.target.value.toUpperCase()})} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Cliente Beneficiario</label>
              <input 
                required 
                value={form.cliente}
                placeholder="NOMBRE COMPLETO"
                className="w-full border-b border-slate-200 py-2 outline-none focus:border-blue-600 font-bold uppercase text-sm placeholder:text-slate-200" 
                onChange={e => setForm({...form, cliente: e.target.value.toUpperCase()})} 
              />
            </div>
          </div>

          {/* CAMPOS FINANCIEROS */}
          <div className="grid grid-cols-3 gap-6 py-5 bg-slate-50 px-5 rounded-xl border border-slate-100">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase">Importe Principal</label>
              <input 
                type="number" 
                step="0.01" 
                value={form.importeReclamado === 0 ? "" : form.importeReclamado}
                className="w-full bg-transparent border-b border-slate-200 py-1 font-bold outline-none text-sm text-slate-700"
                onChange={e => handleNumberChange("importeReclamado", e.target.value)} 
              />
            </div>
            
            <div className="space-y-1 bg-amber-50/50 p-2 rounded border border-amber-100">
              <label className="text-[9px] font-black text-amber-600 uppercase text-center block">Intereses Legales</label>
              <input 
                type="number" 
                step="0.01" 
                value={form.interesesLegales === 0 ? "" : form.interesesLegales}
                className="w-full bg-transparent border-b border-amber-200 py-1 font-bold outline-none text-sm text-amber-800 text-center"
                onChange={e => handleNumberChange("interesesLegales", e.target.value)} 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase text-right block">Costas</label>
              <input 
                type="number" 
                step="0.01" 
                value={form.costas === 0 ? "" : form.costas}
                className="w-full bg-transparent border-b border-slate-200 py-1 font-bold outline-none text-sm text-slate-700 text-right"
                onChange={e => handleNumberChange("costas", e.target.value)} 
              />
            </div>
          </div>

          {/* PANEL INFORMATIVO DE PLAZOS */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-3">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-blue-900">
                   <AlertCircle size={14} />
                   <span className="text-[9px] font-black uppercase">Fecha de Registro</span>
                </div>
                <span className="font-mono font-bold text-blue-900 text-xs">{form.fechaIngreso}</span>
             </div>
             
             <p className="text-[9px] text-blue-700 font-medium leading-tight border-t border-blue-200 pt-2 italic">
               Nota: Si este caso no contaba con intereses e ingresa un monto ahora, el sistema extendera el plazo de gestion a 3 dias habiles a partir de la fecha de hoy de forma automatica.
             </p>
          </div>

          {/* BOTON SUBMIT */}
          <button 
            type="submit" 
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.15em] hover:bg-black shadow-lg transition-all active:scale-[0.98]"
          >
            <div className="flex items-center justify-center gap-2">
              <Save size={16} />
              {initialData ? "Actualizar y Recalcular Plazo" : "Registrar Abono en Sistema"}
            </div>
          </button>

        </form>
      </div>
    </div>
  );
};