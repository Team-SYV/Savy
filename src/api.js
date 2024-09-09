import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const createJobDescription = async (jobData) => {
  try {
    const response = await api.post("/api/job_information/create/", jobData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to create job description");
  }
};