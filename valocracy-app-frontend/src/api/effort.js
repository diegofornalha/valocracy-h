import { api } from "./api";

export const create = async (data) => {
	const result = await api
		.post(`/effort/generate`, data)
		.catch((err) => err.response);

	if (result.status && result.status !== 200)
		throw result.data.message || "Erro desconhecido";

	if (result.data?.message) throw result.data.message;

	return result.data.content;
};

export const get = async (effor_id) => {
	const result = await api
		.get(`/effort/${effor_id}`)
		.catch((err) => err.response);

	if (result.status && result.status !== 200)
		throw result.data.message || "Erro desconhecido";

	if (result.data?.message) throw result.data.message;

	return result.data.content;
};

export const sharesOfEffort = async (effor_id) => {
	const result = await api
		.get(`/effort/shares/of_effort/${effor_id}`)
		.catch((err) => err.response);

	if (result.status && result.status !== 200)
		throw result.data.message || "Erro desconhecido";

	if (result.data?.message) throw result.data.message;

	return result.data.content;
};

export const update = async (data, id) => {
	const result = await api
		.put(`/effort/${id}`, data)
		.catch((err) => err.response);

	if (result.status && result.status !== 200)
		throw result.data.message || "Erro desconhecido";

	return result.data.message;
};

const effortApi = {
	create,
	update,
	get,
	sharesOfEffort
};

export default effortApi;
