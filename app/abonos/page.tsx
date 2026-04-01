"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, Plus, Filter, FileSpreadsheet } from "lucide-react";
import { TablaAbonos } from "@/components/features/TablaAbonos";
import { StatsCards } from "@/components/features/StatsCards";
import { FormularioAbono } from "@/components/features/FormularioAbono";
import { api } from "@/lib/api";
import { Abono } from "@/lib/types";
import { filtrarAbonos } from "@/lib/utils";
import { exportarAExcel } from "@/lib/excelUtils";

export default function AbonosPage() {
  const [data, setData] = useState<Abono[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Abono | null>(null);

  const [busqueda, setBusqueda] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");

  const fetchData = useCallback(async () => {
    try {
      const [list, s] = await Promise.all([api.abonos.getAll(), api.abonos.getStats()]);
      setData(list);
      setStats(s);
    } catch (error) { console.error(error); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const dataFiltrada = useMemo(() => 
    filtrarAbonos(data, busqueda, fechaInicio, fechaFin, filtroEstado), 
  [data, busqueda, fechaInicio, fechaFin, filtroEstado]);

  const handleSave = async (payload: Abono) => {
    payload.id ? await api.abonos.update(payload.id, payload) : await api.abonos.create(payload);
    setShowModal(false);
    fetchData();
  };

  return (
    <div className="space-y-8">
      {/* 1. PRIORIDAD: ESTADÍSTICAS */}
      <StatsCards stats={stats} type="ABONOS" />

      {/* 2. ACCIONES Y FILTROS */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <h2 className="text-xl font-black uppercase tracking-tight">Panel de Abonos</h2>
          <div className="flex gap-3">
            <button onClick={() => exportarAExcel(dataFiltrada, "ABONOS")} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
              <FileSpreadsheet size={16} /> Excel
            </button>
            <button onClick={() => { setEditingItem(null); setShowModal(true); }} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-black transition-all shadow-lg shadow-slate-200">
              <Plus size={16} /> Registrar Abono
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="BUSCAR CLIENTE..." className="w-full pl-11 h-12 bg-slate-50 rounded-xl text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-slate-200 transition-all" onChange={e => setBusqueda(e.target.value)} />
          </div>
          <div className="md:col-span-3">
            <select className="w-full h-12 bg-slate-50 rounded-xl text-xs font-bold uppercase px-4 outline-none cursor-pointer" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
              <option value="TODOS">TODOS LOS ESTADOS</option>
              <option value="VENCIDO">VENCIDOS</option>
              <option value="ATENDIDO">ATENDIDOS</option>
            </select>
          </div>
          <div className="md:col-span-4 flex gap-2">
            <input type="date" className="flex-1 h-12 bg-slate-50 rounded-xl text-[10px] font-bold px-3 outline-none" onChange={e => setFechaInicio(e.target.value)} />
            <input type="date" className="flex-1 h-12 bg-slate-50 rounded-xl text-[10px] font-bold px-3 outline-none" onChange={e => setFechaFin(e.target.value)} />
          </div>
        </div>
      </div>

      {/* 3. TABLA */}
      <TablaAbonos 
        data={dataFiltrada} 
        onUpdateStatus={(id, f, v) => handleSave({...data.find(i => i.id === id), [f]: v} as Abono)} 
        onDelete={async (id) => { if(confirm("¿Eliminar?")) { await api.abonos.delete(id); fetchData(); } }}
        onEdit={(i) => { setEditingItem(i); setShowModal(true); }}
      />

      {showModal && <FormularioAbono initialData={editingItem} onSave={handleSave} onClose={() => setShowModal(false)} />}
    </div>
  );
}