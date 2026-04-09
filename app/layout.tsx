"use client";

import React, { useState, useEffect } from "react";
import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Menu, X, LogOut, UserCircle, LogIn, ShieldCheck } from "lucide-react";
import Cookies from "js-cookie";
import { api } from "@/lib/api";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState(""); // 🛡️ Estado para el Rol

  // Verificar sesión cada vez que cambie la ruta
  useEffect(() => {
    const token = Cookies.get("token");
    const user = Cookies.get("usuario");
    const rol = Cookies.get("rol"); // Obtenemos el rol de la cookie
    
    if (token) {
      setIsLoggedIn(true);
      setUserName(user || "Usuario");
      setUserRole(rol || "");
    } else {
      setIsLoggedIn(false);
      setUserName("");
      setUserRole("");
    }
  }, [pathname]);

  const handleLogout = () => {
    api.auth.logout(); 
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => pathname.includes(path);

  // Definición de links con restricción de Rol
  const navLinks = [
    { href: "/indecopi", label: "Indecopi", adminOnly: false },
    { href: "/abonos", label: "Abonos", adminOnly: false },
    { href: "/dashboard/usuarios", label: "Usuarios", adminOnly: true }, // Solo Admin
    { href: "/dashboard/auditoria", label: "Auditoría", adminOnly: true }, // Solo Admin
  ];

  return (
    <html lang="es">
      <body className="min-h-screen bg-[#f4f2ed]">
        <header className="bg-white border-b border-[#e2ddd5] sticky top-0 z-50 shadow-sm">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex items-center justify-between min-h-[75px]">
            
            {/* Branding */}
            <Link href="/" className="flex items-center gap-4 py-3 group">
              <div className="shrink-0">
                <Image
                  src="/assets/ic_bn2.png"
                  alt="Logo Banco de la Nación"
                  width={70} 
                  height={70} 
                  priority
                  className="object-contain"
                />
              </div>
              <div className="hidden sm:flex flex-col justify-center">
                <h1 className="text-[18px] md:text-[20px] font-bold text-[#002e5f] leading-none tracking-tight">
                  Banco de la Nación
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black uppercase tracking-[3px] text-red-700">
                    Canales Virtuales
                  </span>
                </div>
              </div>
            </Link>

            {/* Navegación Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <nav className="flex items-stretch h-[75px]">
                {navLinks.map(({ href, label, adminOnly }, i) => {
                  // 🚦 FILTRO DE ROL: Si es adminOnly y no eres ADMIN, no se muestra
                  if (adminOnly && userRole !== "ROLE_ADMIN") return null;

                  return (
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
                      {i < navLinks.length - 1 && <div className="w-px bg-[#ede9e3] my-[25px]" />}
                    </React.Fragment>
                  );
                })}
              </nav>

              {/* Botones de Auth Desktop */}
              <div className="ml-6 flex items-center gap-3 pl-6 border-l border-[#ede9e3]">
                {isLoggedIn ? (
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2 text-[#002e5f]">
                        <UserCircle size={20} className="text-red-700" />
                        <span className="text-[12px] font-bold uppercase tracking-wider">{userName}</span>
                      </div>
                      {userRole === "ROLE_ADMIN" && (
                        <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest flex items-center gap-1">
                          <ShieldCheck size={10} /> Administrador
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all border border-slate-200"
                    >
                      <LogOut size={16} />
                      Salir
                    </button>
                  </div>
                ) : (
                  <Link 
                    href="/login"
                    className="flex items-center gap-2 bg-[#002e5f] hover:bg-[#001e3d] text-white px-5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all shadow-md shadow-blue-900/20"
                  >
                    <LogIn size={16} />
                    Ingresar
                  </Link>
                )}
              </div>
            </div>

            {/* Botón Menú Móvil */}
            <button 
              className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Menú Móvil Desplegable */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-[#e2ddd5] py-4 shadow-2xl animate-in slide-in-from-top duration-300">
              {isLoggedIn && (
                <div className="px-8 py-4 mb-2 border-b border-slate-50 bg-slate-50/50 flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <UserCircle size={24} className="text-red-700" />
                    <span className="text-sm font-bold text-[#002e5f] uppercase tracking-wider">{userName}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold ml-9">{userRole}</span>
                </div>
              )}
              {navLinks.map(({ href, label, adminOnly }) => {
                if (adminOnly && userRole !== "ROLE_ADMIN") return null;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "block px-8 py-4 text-[12px] font-bold uppercase tracking-[1.5px] transition-colors",
                      isActive(href) ? "text-red-700 bg-red-50/50" : "text-[#6b6660]"
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
              <div className="mt-4 px-8 pt-4 border-t border-slate-100">
                {isLoggedIn ? (
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-700 py-4 rounded-xl text-[12px] font-bold uppercase tracking-widest"
                  >
                    <LogOut size={18} />
                    Cerrar Sesión
                  </button>
                ) : (
                  <Link 
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-[#002e5f] text-white py-4 rounded-xl text-[12px] font-bold uppercase tracking-widest"
                  >
                    <LogIn size={18} />
                    Iniciar Sesión
                  </Link>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Contenedor de Contenido Principal */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6 md:py-10">
          <main className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </main>
        </div>

        {/* Footer simple */}
        <footer className="max-w-[1600px] mx-auto px-8 py-10 border-t border-[#e2ddd5] flex flex-col md:flex-row justify-between items-center gap-6 text-[#9e9891]">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#6b6660]">
              © 2026 Banco de la Nación - Perú
            </span>
            <span className="text-[9px] font-medium uppercase tracking-[1px] mt-1">
              Área de Canales Virtuales - Gestión Administrativa
            </span>
          </div>
          <div className="flex gap-6 opacity-30 grayscale">
            <Image src="/assets/ic_bn2.png" alt="BN Logo Gray" width={40} height={40} />
          </div>
        </footer>
      </body>
    </html>
  );
}