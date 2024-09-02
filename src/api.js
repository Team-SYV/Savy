import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/users/create/", userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.post(`/users/edit/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
