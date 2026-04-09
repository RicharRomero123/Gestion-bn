"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie"; // 🍪 Importación vital
import { Lock, User, AlertCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Llamada a la API
      const data = await api.auth.login(username, password);

      // 2. Guardar en Cookies (Dura 1 día por seguridad)
      // Usamos 'secure: true' para que solo viaje por HTTPS (estándar bancario)
      Cookies.set("token", data.token, { expires: 1, secure: true, sameSite: 'strict' });
      Cookies.set("rol", data.rol, { expires: 1 });
      Cookies.set("usuario", username, { expires: 1 });

      // Opcional: Mantener en localStorage si otros componentes antiguos lo requieren
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", username);

      // 3. Redirección al Dashboard
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Credenciales incorrectas o error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-100 overflow-hidden relative">
        
        {/* Línea decorativa superior roja (Estilo BN) */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#CC0000]"></div>

        {/* LOGO Y CABECERA */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-slate-50 p-4 rounded-full mb-4 shadow-inner">
            <Image 
              src="/assets/ic_bn2.png" 
              alt="Logo Banco de la Nación" 
              width={80} 
              height={80} 
              priority
            />
          </div>
          <h1 className="text-2xl font-extrabold text-[#333333] tracking-tight">
            Gestión Canales Virtuales
          </h1>
          <p className="text-slate-500 text-sm mt-1">Portal Administrativo Interno</p>
        </div>

        {/* MENSAJE DE ERROR DINÁMICO */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 text-[#CC0000] p-4 rounded-xl text-sm border border-red-100 animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={20} className="shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* FORMULARIO DE ACCESO */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
              Usuario de Red
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#CC0000] transition-colors" size={20} />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#CC0000]/20 focus:border-[#CC0000] outline-none transition-all text-slate-700 font-medium"
                placeholder="Ej: mquispe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
              Contraseña
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#CC0000] transition-colors" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#CC0000]/20 focus:border-[#CC0000] outline-none transition-all text-slate-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#CC0000] hover:bg-[#A30000] active:scale-[0.98] text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Autenticando...</span>
              </>
            ) : (
              "Ingresar al Portal"
            )}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.1em]">
            © 2026 Banco de la Nación - Perú <br/> 
            Sistemas de Canales Virtuales e Indecopi
          </p>
        </div>
      </div>
    </div>
  );
}