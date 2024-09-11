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

export const uploadResume = async (file, userId) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId);
    
    const response = await api.post("/api/resumes/upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to upload resume");
  }
};