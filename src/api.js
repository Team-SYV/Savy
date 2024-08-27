import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/users/", userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
