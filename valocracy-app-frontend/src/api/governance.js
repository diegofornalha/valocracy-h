import { api } from "./api";

//list proposals
const getProposals = async () => {
  const result = await api
    .get(`/governance/proposal`)
    .catch((err) => err.response);

  if (result.status && result.status !== 200)
    throw result.data.message || "Erro desconhecido";

  if (result.data?.message) throw result.data.message;

  return result.data.content;
};

const getProposalById = async (id) => {
  const result = await api
    .get(`/governance/proposal/${id}`)
    .catch((err) => err.response);

  if (result.status && result.status !== 200)
    throw result.data.message || "Erro Desconhecido";

  if (result.data?.message) throw result.data.message;

  return result.data.content;
};

const fetchMyShare = async () => {
  const result = await api
    .get(`/governance/my_power`)
    .catch((err) => err.response);

  if (result.status && result.status !== 200)
    throw result.data.message || "Erro desconhecido";

  return result.data.content;
};

const proposalVote = async (proposalId, vote) => {
  const result = await api
    .post("/governance/proposal/vote", {
      answer: vote,
      proposal_id: proposalId,
    })
    .catch((err) => err.response);

  if (result.status && result.status !== 200) {
    throw result.data.message || "Erro Desconhecido";
  }
  return result.data.content;
};

const getProposalVotes = async (proposalId) => {
  const result = await api
    .get(`/governance/proposal/${proposalId}/votes`)
    .catch((err) => err.response);

  if (result.status && result.status !== 200) {
    throw result.data.message || "Erro Desconhecido";
  }

  return result.data.content;
};

const governanceApi = {
  getProposals,
  getProposalById,
  fetchMyShare,
  proposalVote,
  getProposalVotes,
};

export default governanceApi;
