"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList, Banknote } from "lucide-react";

export default function HomePage() {
  const [saludo, setSaludo] = useState("");

  useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 6 && hora < 12) setSaludo("¡Buenos días!");
    else if (hora >= 12 && hora < 19) setSaludo("¡Buenas tardes!");
    else setSaludo("¡Buenas noches!");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-12">
      {/* SECCIÓN DE BIENVENIDA DINÁMICA */}
      <div className="text-center space-y-2">
        <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic">
          {saludo}
        </h2>
        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]">
          Bienvenido al Sistema de Gestión
        </p>
      </div>

      {/* BOTONES DIRECTOS (SIN DESCRIPCIONES) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-6">
        
        <Link href="/indecopi" className="group">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-500/50 transition-all flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="bg-red-50 text-red-700 p-4 rounded-2xl group-hover:bg-red-700 group-hover:text-white transition-colors">
                <ClipboardList size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Indecopi</h3>
            </div>
            <ArrowRight size={24} className="text-slate-300 group-hover:text-red-700 group-hover:translate-x-2 transition-all" />
          </div>
        </Link>

        <Link href="/abonos" className="group">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Banknote size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Abonos</h3>
            </div>
            <ArrowRight size={24} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all" />
          </div>
        </Link>

      </div>
    </div>
  );
}