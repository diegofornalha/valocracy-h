import { api } from "./api";

//email verification code
export const validateCodeRequestLogin = async (data) => {
  if (!data?.id) throw new Error("id not found");
  if (!data?.code) throw new Error("code not found");
  if (!data?.login_format) throw new Error("login format not found");
  if (!data?.user_credential) throw new Error("user credential not found");

  const result = await api.post(`/auth`, data).catch((err) => err.response);

  if (result.status && result.status !== 200)
    throw result.data.message || "Erro desconhecido";

  if (result.data?.message) throw result.data.message;

  return result.data.content;
};

export const validateCodeRequestSignUp = async (data) => {
  if (!data?.email) throw new Error("email address not found");
  if (!data?.username) throw new Error("username not found");
  if (!data?.validation.id) throw new Error("code Id not found");
  if (!data?.validation.code) throw new Error("validation code not found");
  if (!data?.validation.validation_type)
    throw new Error("validation type not found");

  const result = await api.post(`/user`, data).catch((err) => err.response);

  if (result.status && result.status !== 200)
    throw result.data.message || "Erro desconhecido";

  if (result.data?.message) throw result.data.message;

  return result.data.content;
};

export const sendRegistryEmailValidationCodeRequest = async (
  email,
  username
) => {
  const data = {
    email,
    username,
  };
  const result = await api
    .post(`registry/send_email_validation_code`, data)
    .catch((err) => err.response);

  if (result.status && result.status !== 200)
    throw result.data.message || "Erro desconhecido";

  if (result.data?.message) throw result.data.message;

  return result.data.content;
};

export const sendEmailValidationCodeRequest = async (data) => {
  const result = await api
    .post(`/auth/send_email_login_code`, data)
    .catch((err) => err.response);
  if (result.status && result.status !== 200)
    throw result.data.message || "Erro desconhecido";

  if (result.data?.message) throw result.data.message;

  return result.data.content;
};

export const isJWTValid = async () => {
  const result = await api
    .get(`/auth/validate_jwt`)
    .catch((err) => err.response);
  if (result.status && result.status !== 200) return false;

  return true;
};
