import axios from "axios";

const api = axios.create({
  baseURL: "https://stingray-beloved-terribly.ngrok-free.app",
});

export const createJobInformation = async (jobData) => {
  try {
    const response = await api.post("/api/job_information/create/", jobData);
    return response.data.id;
  } catch (error) {
    console.error('Error creating job information:', error); 
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || "Failed to create job information");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const createResume = async (resumeData) => {
  try {
    const response = await api.put("/api/resumes/create/", resumeData);
    return response.data;
  } catch (error) {
    console.error('Error creating resume:', error); 
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || "Failed to create resume");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const createInterview = async (interviewData) => {
  try {
    const response = await api.post("/api/interview/create", interviewData);
    return response.data.id;
  } catch (error) {
    console.error('Error creating interview:', error); 
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || "Failed to create interview");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
