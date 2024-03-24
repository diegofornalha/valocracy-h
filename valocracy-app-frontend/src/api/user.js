import { api } from "./api";

//register a user in the system with a email verification code
export const userValidateRegistryCode = async (data) => {
  console.log("userValidateRegistryCode", data);

  if (!data?.username) throw Error("username not found");
  if (!data?.email) throw Error("email not found");
  if (!data?.validation?.id) throw Error("validation code not fond");
  if (!data?.validation?.code) throw Error("email_validation not found");

  const result = await api.post(`/user`, data).catch((err) => err.response);
  if (result.status && result.status !== 200)
    throw result.data.message || "Erro desconhecido";

  if (result.data?.message) throw result.data.message;

  return result.data.content;
};

//get user data
export const getUser = async () => {
  console.log("getUser");

  return await api.get(`/user`).then((e) => e.data.content);
};

export const getIsUsernameUnique = async (username) => {
  const result = await api
    .get(`/user/is_unique/username/${username}`)
    .catch((err) => err.response);
  if (result.status && result.status !== 200)
    throw result.data.message || "Erro desconhecido";

  if (result.data?.message) throw result.data.message;

  return result.data.content;
};

//check if an email is unique
export const getIsEmailUnique = async (email) => {
  const result = await api
    .get(`/user/is_unique/email/${email}`)
    .catch((err) => err.response);
  console.log(result);
  if (result.status && result.status !== 200)
    throw result.data.message || "Erro desconhecido";

  if (result.data?.message) throw result.data.message;

  return result.data.content;
};

//check if an email is unique
export const fetchAll = async () => {
  const result = await api
    .get(`/user/all`)
    .catch((err) => err.response);

  if (result.status && result.status !== 200)
    throw result.data.message || "Erro desconhecido";

  if (result.data?.message) throw result.data.message;

  return result.data.content;
};

const userApi = {
  fetchAll
}

export default userApi;