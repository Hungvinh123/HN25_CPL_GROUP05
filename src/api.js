import axios from "axios";

const API_URL = "https://node-express-conduit.appspot.com/api";

export const registerUser = async (userData) => {
  return axios.post(`${API_URL}/users`, { user: userData });
};

export const loginUser = async (userData) => {
  return axios.post(`${API_URL}/users/login`, { user: userData });
};

export const getCurrentUser = async (token) => {
  return axios.get(`${API_URL}/user`, {
    headers: { Authorization: `Token ${token}` },
  });
};

export const updateUser = async (token, userData) => {
  return axios.put(
    `${API_URL}/user`,
    { user: userData },
    {
      headers: { Authorization: `Token ${token}` },
    }
  );
};
