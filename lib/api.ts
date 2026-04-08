// URL HARDCODEADA DE NGROK
const BASE_URL = "https://reformative-pseudocubical-lino.ngrok-free.dev/api";

// Headers necesarios para saltar la advertencia de ngrok y definir JSON
const HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true"
};

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
      fetch(`${BASE_URL}/reclamos`, { headers: HEADERS }).then(handleResponse),
    
    getStats: (): Promise<ReclamoStats> => 
      fetch(`${BASE_URL}/stats/reclamos`, { headers: HEADERS }).then(handleResponse),
    
    create: (data: ReclamoIndecopi): Promise<ReclamoIndecopi> => 
      fetch(`${BASE_URL}/reclamos`, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(data)
      }).then(handleResponse),

    update: (id: number, data: ReclamoIndecopi): Promise<ReclamoIndecopi> => 
      fetch(`${BASE_URL}/reclamos/${id}`, {
        method: "PUT",
        headers: HEADERS,
        body: JSON.stringify(data)
      }).then(handleResponse),

    delete: (id: number) => 
      fetch(`${BASE_URL}/reclamos/${id}`, { 
        method: "DELETE",
        headers: { "ngrok-skip-browser-warning": "true" } // Solo el bypass para delete
      }).then(handleResponse),
  },

  abonos: {
    getAll: (): Promise<Abono[]> => 
      fetch(`${BASE_URL}/abonos`, { headers: HEADERS }).then(handleResponse),
    
    getStats: (): Promise<AbonoStats> => 
      fetch(`${BASE_URL}/stats/abonos`, { headers: HEADERS }).then(handleResponse),
    
    create: (data: Abono): Promise<Abono> => 
      fetch(`${BASE_URL}/abonos`, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(data)
      }).then(handleResponse),

    update: (id: number, data: Abono): Promise<Abono> => 
      fetch(`${BASE_URL}/abonos/${id}`, {
        method: "PUT",
        headers: HEADERS,
        body: JSON.stringify(data)
      }).then(handleResponse),

    delete: (id: number) => 
      fetch(`${BASE_URL}/abonos/${id}`, { 
        method: "DELETE",
        headers: { "ngrok-skip-browser-warning": "true" } 
      }).then(handleResponse),
  }
};