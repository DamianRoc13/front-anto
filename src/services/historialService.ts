import axios from "axios";

export async function fetchHistoriales() {
  const response = await axios.get("/api/historiales"); // Ajustar la ruta según tu API
  return response.data;
}
