"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, Plus, FileSpreadsheet, Calendar, Filter } from "lucide-react";
import { TablaReclamos } from "@/components/features/TablaReclamos";
import { StatsCards } from "@/components/features/StatsCards";
import { FormularioReclamo } from "@/components/features/FormularioReclamo";
import { api } from "@/lib/api";
import { ReclamoIndecopi, ReclamoStats } from "@/lib/types";
import { filtrarPorRangoYBusqueda } from "@/lib/utils";
import { exportarAExcel } from "@/lib/excelUtils";

export default function IndecopiPage() {
  const [data, setData] = useState<ReclamoIndecopi[]>([]);
  const [stats, setStats] = useState<ReclamoStats | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ReclamoIndecopi | null>(null);

  // --- ESTADOS DE FILTROS ---
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [list, s]: [ReclamoIndecopi[], ReclamoStats] = await Promise.all([
        api.reclamos.getAll(),
        api.reclamos.getStats()
      ]);
      setData(list);
      setStats(s);
    } catch (e) {
      console.error("Error al cargar reclamos:", e);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Lógica de filtrado utilizando la función de utils.ts
  const dataFiltrada = useMemo(() => 
    filtrarPorRangoYBusqueda(data, busqueda, fechaInicio, fechaFin, filtroEstado), 
  [data, busqueda, fechaInicio, fechaFin, filtroEstado]);

  const handleSave = async (payload: ReclamoIndecopi) => {
    try {
      payload.id ? await api.reclamos.update(payload.id, payload) : await api.reclamos.create(payload);
      setShowModal(false);
      setEditingItem(null);
      fetchData();
    } catch (e) {
      alert("Error al procesar la solicitud en el servidor.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. KPI DE GESTIÓN (Prioridad Visual) */}
      <StatsCards stats={stats} type="INDECOPI" />

      {/* 2. TOOLBAR DE FILTROS Y ACCIONES */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col xl:flex-row gap-4 items-center">
          
          {/* BUSCADOR */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="BUSCAR POR EXPEDIENTE O CLIENTE..." 
              className="w-full pl-11 h-12 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-red-500/10 transition-all"
              onChange={e => setBusqueda(e.target.value)} 
            />
          </div>

          {/* SELECTOR DE ESTADO */}
          <div className="w-full xl:w-56 relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <select 
              className="w-full h-12 pl-10 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase outline-none cursor-pointer hover:bg-slate-100 transition-colors"
              value={filtroEstado}
              onChange={e => setFiltroEstado(e.target.value)}
            >
              <option value="TODOS">TODOS LOS ESTADOS</option>
              <option value="DENTRO_PLAZO">DENTRO DE PLAZO</option>
              <option value="CRITICO">URGENTE / CRÍTICO</option>
              <option value="VENCIDO">VENCIDO / ALERTA</option>
              <option value="ATENDIDO">ATENDIDO / LISTO</option>
            </select>
          </div>

          {/* RANGO DE FECHAS (Basado en Recepción) */}
          <div className="flex items-center gap-2 w-full xl:w-auto bg-slate-50 p-1.5 rounded-xl border border-slate-100">
             <div className="flex items-center gap-2 px-2 text-slate-400">
                <Calendar size={14} />
                <span className="text-[9px] font-black uppercase">Recepción</span>
             </div>
             <input 
              type="date" 
              className="h-9 bg-white rounded-lg text-[10px] font-bold px-2 border border-slate-200 outline-none focus:border-red-300" 
              onChange={e => setFechaInicio(e.target.value)} 
             />
             <input 
              type="date" 
              className="h-9 bg-white rounded-lg text-[10px] font-bold px-2 border border-slate-200 outline-none focus:border-red-300" 
              onChange={e => setFechaFin(e.target.value)} 
             />
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex gap-2 w-full xl:w-auto">
            <button 
              onClick={() => exportarAExcel(dataFiltrada, "INDECOPI")}
              className="flex-1 xl:flex-none h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-100"
            >
              <FileSpreadsheet size={18} />
              <span className="text-[10px] font-black uppercase italic">Excel</span>
            </button>

            <button 
              onClick={() => { setEditingItem(null); setShowModal(true); }}
              className="flex-1 xl:flex-none h-12 px-6 bg-red-700 hover:bg-red-800 text-white rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-red-100"
            >
              <Plus size={18} />
              <span className="text-[10px] font-black uppercase">Nuevo</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. TABLA DE DATOS CON TIPADO ESTRICTO */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <TablaReclamos 
          data={dataFiltrada} 
          onUpdateStatus={(id: number, f: string, v: any) => {
            const item = data.find(i => i.id === id);
            if(item) handleSave({...item, [f]: v} as ReclamoIndecopi);
          }}
          onDelete={async (id: number) => { 
            if(confirm("¿Desea eliminar este expediente permanentemente?")) { 
              await api.reclamos.delete(id); 
              fetchData(); 
            } 
          }}
          onEdit={(i: ReclamoIndecopi) => { 
            setEditingItem(i); 
            setShowModal(true); 
          }} 
        />
      </div>

      {/* MODALES */}
      {showModal && (
        <FormularioReclamo 
          initialData={editingItem} 
          onSave={handleSave} 
          onClose={() => { setShowModal(false); setEditingItem(null); }} 
        />
      )}
    </div>
  );
}