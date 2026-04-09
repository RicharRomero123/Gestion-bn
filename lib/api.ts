import { ReclamoIndecopi, Abono, ReclamoStats, AbonoStats } from "./types";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * 🛡️ UTILIDAD: HEADERS DINÁMICOS
 */
const getHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  };

  if (typeof window !== "undefined") {
    const token = Cookies.get("token") || localStorage.getItem("token");
    const usuario = Cookies.get("usuario") || localStorage.getItem("usuario");

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    if (usuario) {
      headers["X-User-Operador"] = usuario;
    }
  }

  return headers;
};

/**
 * 🚦 MANEJADOR CENTRAL DE RESPUESTAS
 */
async function handleResponse(response: Response) {
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      Cookies.remove("token");
      Cookies.remove("usuario");
      Cookies.remove("rol");
      localStorage.clear();
      window.location.href = "/?error=session_expired";
    }
    throw { message: "SESION_EXPIRADA" };
  }

  if (response.status === 403) {
    throw { message: "No tienes permisos para realizar esta acción" };
  }

  if (response.status === 204) return null;

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Error desconocido" }));
    throw errorData;
  }

  return response.json();
}

/**
 * 🚀 EXPORTACIÓN DE SERVICIOS API
 */
export const api = {
  
  auth: {
    login: (username: string, password: string): Promise<{ token: string; rol: string }> =>
      fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }).then(handleResponse),

    logout: () => {
      Cookies.remove("token");
      Cookies.remove("usuario");
      Cookies.remove("rol");
      localStorage.clear();
      window.location.href = "/";
    }
  },

  // 👥 NUEVO: MÓDULO DE USUARIOS (Solo para ADMIN)
  usuarios: {
    getAll: (): Promise<any[]> =>
      fetch(`${BASE_URL}/usuarios`, { headers: getHeaders() }).then(handleResponse),

    create: (data: any): Promise<any> =>
      fetch(`${BASE_URL}/usuarios`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }).then(handleResponse),

    delete: (id: number) =>
      fetch(`${BASE_URL}/usuarios/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      }).then(handleResponse),
  },

  reclamos: {
    getAll: (): Promise<ReclamoIndecopi[]> =>
      fetch(`${BASE_URL}/reclamos`, { headers: getHeaders() }).then(handleResponse),

    getStats: (): Promise<ReclamoStats> =>
      fetch(`${BASE_URL}/stats/reclamos`, { headers: getHeaders() }).then(handleResponse),

    create: (data: ReclamoIndecopi): Promise<ReclamoIndecopi> =>
      fetch(`${BASE_URL}/reclamos`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }).then(handleResponse),

    update: (id: number, data: ReclamoIndecopi): Promise<ReclamoIndecopi> =>
      fetch(`${BASE_URL}/reclamos/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }).then(handleResponse),

    delete: (id: number) =>
      fetch(`${BASE_URL}/reclamos/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      }).then(handleResponse),
  },

  abonos: {
    getAll: (): Promise<Abono[]> =>
      fetch(`${BASE_URL}/abonos`, { headers: getHeaders() }).then(handleResponse),

    getStats: (): Promise<AbonoStats> =>
      fetch(`${BASE_URL}/stats/abonos`, { headers: getHeaders() }).then(handleResponse),

    create: (data: Abono): Promise<Abono> =>
      fetch(`${BASE_URL}/abonos`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }).then(handleResponse),

    update: (id: number, data: Abono): Promise<Abono> =>
      fetch(`${BASE_URL}/abonos/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }).then(handleResponse),

    delete: (id: number) =>
      fetch(`${BASE_URL}/abonos/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      }).then(handleResponse),
  },

  auditoria: {
    getAll: (): Promise<any[]> =>
      fetch(`${BASE_URL}/auditoria`, { headers: getHeaders() }).then(handleResponse),
  }
};