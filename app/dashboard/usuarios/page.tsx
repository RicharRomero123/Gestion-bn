"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { UserPlus, Trash2, ShieldCheck } from "lucide-react";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [form, setForm] = useState({ username: "", password: "", nombreCompleto: "", rolId: 2 });

  const loadUsers = () => api.usuarios.getAll().then(setUsuarios);

  useEffect(() => { loadUsers(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.usuarios.create({
        ...form,
        roles: [{ id: form.rolId }] // Estructura que pide tu Backend
      });
      alert("Usuario creado exitosamente");
      setForm({ username: "", password: "", nombreCompleto: "", rolId: 2 });
      loadUsers();
    } catch (err) { alert("Error al crear usuario"); }
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que desea eliminar este acceso?")) {
      await api.usuarios.delete(id);
      loadUsers();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* FORMULARIO DE CREACIÓN */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
        <h2 className="text-lg font-bold text-[#002e5f] mb-6 flex items-center gap-2">
          <UserPlus className="text-red-700" /> Nuevo Usuario
        </h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <input 
            className="w-full p-3 bg-slate-50 border rounded-xl" 
            placeholder="Username" 
            value={form.username}
            onChange={e => setForm({...form, username: e.target.value})}
          />
          <input 
            type="password"
            className="w-full p-3 bg-slate-50 border rounded-xl" 
            placeholder="Contraseña" 
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
          />
          <input 
            className="w-full p-3 bg-slate-50 border rounded-xl" 
            placeholder="Nombre Completo" 
            value={form.nombreCompleto}
            onChange={e => setForm({...form, nombreCompleto: e.target.value})}
          />
          <select 
            className="w-full p-3 bg-slate-50 border rounded-xl"
            value={form.rolId}
            onChange={e => setForm({...form, rolId: Number(e.target.value)})}
          >
            <option value={2}>OPERADOR</option>
            <option value={1}>ADMINISTRADOR</option>
          </select>
          <button className="w-full bg-[#002e5f] text-white py-3 rounded-xl font-bold hover:bg-[#001e3d]">
            Registrar Usuario
          </button>
        </form>
      </div>

      {/* LISTADO DE USUARIOS */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Rol</th>
              <th className="px-6 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {usuarios.map((u: any) => (
              <tr key={u.id} className="text-sm">
                <td className="px-6 py-4 font-medium">{u.nombreCompleto}</td>
                <td className="px-6 py-4 text-slate-500">{u.username}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1 text-blue-700 font-bold">
                    <ShieldCheck size={14} /> {u.roles[0]?.nombre}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}