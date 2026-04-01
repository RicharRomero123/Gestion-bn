"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.includes(path);

  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50/50">
        <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-6">
          
          <header className="flex items-center justify-between border-b border-slate-200 pb-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-red-700 p-2 rounded-lg group-hover:scale-105 transition-transform shadow-md">
                <ShieldCheck size={26} className="text-white" />
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tighter text-slate-900">
                BN / <span className="text-red-700">GESTIÓN</span>
              </h1>
            </Link>

            <nav className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
              <Link href="/indecopi" className={cn(
                "px-6 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all",
                isActive("/indecopi") ? "bg-white shadow-sm text-red-700" : "text-slate-500 hover:text-slate-700"
              )}>Indecopi</Link>
              <Link href="/abonos" className={cn(
                "px-6 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all",
                isActive("/abonos") ? "bg-white shadow-sm text-red-700" : "text-slate-500 hover:text-slate-700"
              )}>Abonos</Link>
            </nav>
          </header>

          <main className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}