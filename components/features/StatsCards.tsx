"use client";

import React from "react";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FilePlus2, 
  Banknote, 
  Coins, 
  HelpCircle 
} from "lucide-react";

interface Props {
  stats: any;
  type: "INDECOPI" | "ABONOS";
}

export const StatsCards = ({ stats, type }: Props) => {
  const s = stats || {
    total: 0,
    ingresadosHoy: 0,
    criticos: 0,
    vencidos: 0,
    pendientesConstancia: 0,
    completados: 0,
    montoTotalAcumulado: 0
  };

  const cards = type === "INDECOPI" 
    ? [
        { 
          label: "Ingresados Hoy", 
          value: s.ingresadosHoy, 
          icon: FilePlus2, 
          color: "text-green-600", 
          bgColor: "bg-green-50",
          border: "border-l-green-600",
          description: "Expedientes registrados en la fecha actual."
        },
        { 
          label: "Alertas Críticas", 
          value: s.criticos, 
          icon: AlertCircle, 
          color: "text-amber-600", 
          bgColor: "bg-amber-50",
          border: "border-l-amber-600",
          description: "Documentos que vencen hoy o mañana (plazo de 48h)."
        },
        { 
          label: "Vencidos", 
          value: s.vencidos, 
          icon: Clock, 
          color: "text-red-600", 
          bgColor: "bg-red-50",
          border: "border-l-red-600",
          description: "Registros que ya superaron el plazo legal de 3 días."
        },
        { 
          label: "Total Histórico", 
          value: s.total, 
          icon: CheckCircle2, 
          color: "text-blue-600", 
          bgColor: "bg-blue-50",
          border: "border-l-blue-600",
          description: "Total acumulado de registros en la base de datos."
        },
      ]
    : [
        { 
          label: "Ingresados Hoy", 
          value: s.ingresadosHoy, 
          icon: FilePlus2, 
          color: "text-green-600", 
          bgColor: "bg-green-50",
          border: "border-l-green-600",
          description: "Abonos registrados durante el día de hoy."
        },
        { 
          label: "Pendientes Constancia", 
          value: s.pendientesConstancia, 
          icon: AlertCircle, 
          color: "text-amber-600", 
          bgColor: "bg-amber-50",
          border: "border-l-amber-600",
          description: "Abonos realizados que aún no tienen constancia de entrega."
        },
        { 
          label: "Vencidos (Sin Constancia)", 
          value: s.vencidos, 
          icon: Clock, 
          color: "text-red-600", 
          bgColor: "bg-red-50",
          border: "border-l-red-600",
          description: "Abonos fuera de plazo sin constancia firmada."
        },
        { 
          label: "Monto Total", 
          value: `S/ ${s.montoTotalAcumulado?.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, 
          icon: Coins, 
          color: "text-blue-600", 
          bgColor: "bg-blue-50",
          border: "border-l-blue-600",
          description: "Suma total de importes, intereses y costas del historial."
        },
      ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <div 
          key={i} 
          className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 ${card.border} transition-all hover:shadow-md group relative`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                  {card.label}
                </p>
                {/* Icono de información con descripción nativa (tooltip) */}
                <div className="relative group/info">
                  <HelpCircle 
                    size={12} 
                    className="text-slate-300 cursor-help hover:text-slate-500 transition-colors" 
                  />
                  {/* Tooltip personalizado CSS */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/info:block w-40 p-2 bg-slate-800 text-white text-[9px] font-bold rounded-lg shadow-xl z-10 text-center leading-tight">
                    {card.description}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
                  </div>
                </div>
              </div>
              
              <p className={`text-2xl font-black tabular-nums ${card.color}`}>
                {card.value}
              </p>
            </div>

            <div className={`p-3 rounded-xl ${card.bgColor} ${card.color} group-hover:scale-110 transition-transform`}>
              <card.icon size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};