"use client";

import React, { useState } from "react";
import "./globals.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string) => pathname.includes(path);

  const navLinks = [
    { href: "/indecopi", label: "Indecopi" },
    { href: "/abonos", label: "Abonos" },
  ];

  return (
    <html lang="es">
      <body className="min-h-screen bg-[#f4f2ed]">
        <header className="bg-white border-b border-[#e2ddd5] sticky top-0 z-50">
      
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex items-center justify-between min-h-[70px]">
            
            {/* Branding: Banco de la Nación / Canales Virtuales */}
            <Link href="/" className="flex items-center gap-4 py-3 group">
              <div className="shrink-0">
                <Image
                  src="/assets/ic_bn2.png" // Asegúrate de que este es el archivo correcto (ic_bn2.png)
                  alt="Logo Banco de la Nación"
                  // TAMAÑO AUMENTADO DE 60 A 80
                  width={80} 
                  height={80} 
                  priority
                  className="object-contain"
                />
              </div>
              
              <div className="flex flex-col justify-center">
                <h1 
                  className="text-[18px] md:text-[22px] font-bold text-[#002e5f] leading-none tracking-tight"
                  style={{ fontFamily: "'Barlow', sans-serif" }}
                >
                  Banco de la Nación
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[3px] text-red-700">
                    Canales Virtuales
                  </span>
                </div>
              </div>
            </Link>

            {/* Navegación Desktop */}
            <nav className="hidden md:flex items-stretch h-[70px]">
              {navLinks.map(({ href, label }, i) => (
                <React.Fragment key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center px-6 text-[11px] font-bold tracking-[1.5px] uppercase transition-all relative",
                      isActive(href)
                        ? "text-red-700 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-red-700"
                        : "text-[#6b6660] hover:text-slate-900"
                    )}
                  >
                    {label}
                  </Link>
                  {i < navLinks.length - 1 && <div className="w-px bg-[#ede9e3] my-[22px]" />}
                </React.Fragment>
              ))}
            </nav>

            {/* Botón Menú Móvil */}
            <button 
              className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* Menú Móvil Desplegable */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-[#e2ddd5] py-2 shadow-xl animate-in slide-in-from-top duration-300">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "block px-8 py-5 text-[12px] font-bold uppercase tracking-[1.5px] border-b border-slate-50 last:border-0",
                    isActive(href) ? "text-red-700 bg-red-50/50" : "text-[#6b6660]"
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Contenedor de Contenido Principal */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6 md:py-8">
          <main className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </main>
        </div>

        {/* Footer simple opcional para cerrar el diseño */}
        <footer className="max-w-[1600px] mx-auto px-8 py-8 border-t border-[#e2ddd5] flex flex-col md:flex-row justify-between items-center gap-4 text-[#9e9891]">
          <span className="text-[10px] font-bold uppercase tracking-[2px]">
            © 2026 Banco de la Nación - Perú
          </span>
          <span className="text-[9px] font-medium uppercase tracking-[1px]">
            Área de Canales Virtuales - Gestión Administrativa
          </span>
        </footer>
      </body>
    </html>
  );
}