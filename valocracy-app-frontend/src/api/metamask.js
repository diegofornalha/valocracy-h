import { api } from "./api";

const create = async (address) => {
    console.log('metamask Addr');
    const result = await api.post(`/metamask/sync`, { address }).catch((err) => err.response);
  
    if (result.status && result.status !== 200)
      throw result.data.message || "Erro desconhecido";

    return result.data.message;
};

const walletRegistryInfo = async (address) => {
  const result = await api.post(`/metamask/is_owner`, { address }).catch((err) => err.response);

  if (result.status && result.status !== 200)
    throw result.data.message || "Erro desconhecido";

  return result.data.content;
};

const metamaskApi = {
    create,
    walletRegistryInfo
}

export default metamaskApi;