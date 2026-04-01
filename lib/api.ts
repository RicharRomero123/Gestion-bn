const BASE_URL = "http://localhost:8080/api";

// Importamos los tipos para que TypeScript nos ayude a no cometer errores
import { ReclamoIndecopi, Abono, ReclamoStats, AbonoStats } from "./types";

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorBody = await response.json();
    throw errorBody; 
  }
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  reclamos: {
    getAll: (): Promise<ReclamoIndecopi[]> => 
      fetch(`${BASE_URL}/reclamos`).then(handleResponse),
    
    getStats: (): Promise<ReclamoStats> => 
      fetch(`${BASE_URL}/stats/reclamos`).then(handleResponse),
    
    create: (data: ReclamoIndecopi): Promise<ReclamoIndecopi> => 
      fetch(`${BASE_URL}/reclamos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(handleResponse),

    update: (id: number, data: ReclamoIndecopi): Promise<ReclamoIndecopi> => 
      fetch(`${BASE_URL}/reclamos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(handleResponse),

    delete: (id: number) => 
      fetch(`${BASE_URL}/reclamos/${id}`, { method: "DELETE" }).then(handleResponse),
  },

  abonos: {
    getAll: (): Promise<Abono[]> => 
      fetch(`${BASE_URL}/abonos`).then(handleResponse),
    
    getStats: (): Promise<AbonoStats> => 
      fetch(`${BASE_URL}/stats/abonos`).then(handleResponse),
    
    // Al crear, el Backend calculara el vencimiento inicial (3 dias habiles)
    create: (data: Abono): Promise<Abono> => 
      fetch(`${BASE_URL}/abonos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(handleResponse),

    /**
     * IMPORTANTE: Al usar este metodo 'update', si el objeto 'data' lleva
     * intereses nuevos, el Backend detectara el cambio y extendera
     * el plazo automaticamente a 3 dias habiles desde hoy.
     */
    update: (id: number, data: Abono): Promise<Abono> => 
      fetch(`${BASE_URL}/abonos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(handleResponse),

    delete: (id: number) => 
      fetch(`${BASE_URL}/abonos/${id}`, { method: "DELETE" }).then(handleResponse),
  }
};