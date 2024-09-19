import axios from "axios";

const api = axios.create({
  baseURL: "https://stingray-beloved-terribly.ngrok-free.app/",
});

export const createJobInformation = async (jobData) => {
  try {
    const response = await api.post("/api/job_information/create/", jobData);
    return response.data.id;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to create job information"
    );
  }
};

export const createResume = async (resumeData) => {
  try {
    const response = await api.put("/api/resumes/create", resumeData);
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data || error.message); 
    throw new Error(error.response?.data?.detail || "Failed to create resume");
  }
};

export const createInterview = async (interviewData) => {
  try {
    const response = await api.post("/api/interview/create", interviewData);
    return response.data.id;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to create interview"
    );
  }
};
