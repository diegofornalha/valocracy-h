import { api } from "./api";

export const fetchAll = async () => {
    const result = await api.get('/effort_nature/').catch((err) => err.response);
  
    if (result.status && result.status !== 200)
      throw result.data.message || "Erro desconhecido";
  
    if (result.data?.message) throw result.data.message;
  
    return result.data.content;
};

export const fetch = async (id) => {
    const result = await api.get(`/effort_nature/${id}`).catch((err) => err.response);
  
    if (result.status && result.status !== 200)
      throw result.data.message || "Erro desconhecido";
  
    if (result.data?.message) throw result.data.message;
  
    return result.data.content;
};

const effortNatureApi = {
    fetchAll,
    fetch
};

export default effortNatureApi;