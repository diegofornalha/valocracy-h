import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const getValocracyDefHeader = () => {
  const token = localStorage.getItem("token-valocracy") || null;
  if (token) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  } else {
    return {
      "Content-Type": "application/json",
    };
  }
};

export const api = axios.create({
  baseURL,
  headers: getValocracyDefHeader(),
});
