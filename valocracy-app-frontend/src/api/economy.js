import { api } from "./api";

export const fetchMyShare = async () => {
    const result = await api.get(`/economy/my_share`).catch((err) => err.response);
  
    if (result.status && result.status !== 200)
      throw result.data.message || "Erro desconhecido";
  
    if (result.data?.message) throw result.data.message;
  
    return result.data.content;
};

export const fetchTreasuryBalance = async () => {
    const result = await api.get(`/economy/treasury_balance`).catch((err) => err.response);
  
    if (result.status && result.status !== 200)
      throw result.data.message || "Erro desconhecido";
  
    if (result.data?.message) throw result.data.message;
  
    return result.data.content;
};


export const claimEffort = async (effortId) => {
    const result = await api.post(`/economy/claim/effort`, { effort_id: effortId }).catch((err) => err.response);
 
    if (result.status && result.status !== 200)
      throw result.data.message || "Erro desconhecido";

    if (result.data?.message) throw result.data.message;
  
    return result.data.content;
};


export const claimAllEfforts = async () => {
    const result = await api.post(`/economy/claim`, {}).catch((err) => err.response);
 
    if (result.status && result.status !== 200)
      throw result.data.message || "Erro desconhecido";

    if (result.data?.message) throw result.data.message;
  
    return result.data.content;
};

const economyApi = {
  fetchMyShare,
  fetchTreasuryBalance,
  claimEffort,
  claimAllEfforts
}

export default economyApi;