import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
});

export const createJobInformation = async (jobData) => {
  try {
    const response = await api.post("/api/job_information/create/", jobData);
    return response.data.id;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(
      error.response?.data?.detail || "Failed to create job information"
    );
  }
};

export const getJobInformation = async (jobId) => {
  try {
    const response = await api.get(`/api/job_information/${jobId}/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to retrieve job information"
    );
  }
};

export const generateQuestions = async (formData) => {
  try {
    const response = await api.post("/api/generate-questions/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.questions;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to generate interview questions"
    );
  }
};

export const createQuestions = async (jobId, questionData) => {
  try {
    const response = await api.post(
      `/api/questions/create/${jobId}`,
      questionData
    );
    return response.data.message;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to create questions"
    );
  }
};

export const getQuestions = async (jobId) => {
  try {
    const response = await api.get(`/api/questions/${jobId}`);
    return response.data.questions;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to retrieve questions"
    );
  }
};

export const transcribeAudio = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/api/transcribe-audio/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.transcription;
  } catch (error) {
    console.error("Error response from server:", error.response);
    throw new Error(
      error.response?.data?.detail || "Failed to transcribe audio"
    );
  }
};

export const generateAnswerFeedback = async (formData) => {
  try {
    const response = await api.post(
      "/api/generate-answer-feedback/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

<<<<<<< HEAD
    return response.data.feedback;
=======
    return response.data.feedback; 
>>>>>>> ad66cd2 (avatar)
  } catch (error) {
    console.error("Error response from server:", error.response);

    console.error("Full error object:", JSON.stringify(error, null, 2));

    throw new Error(
      error.response?.data?.detail || "Failed to generate answer feedback"
    );
  }
};

export const generateViseme = async (text) => {
  try {
    const formData = new FormData();
    formData.append("text", text);

    const response = await api.post("/api/viseme/generate", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error response from server:", error.response);
    throw new Error(
      error.response?.data?.detail || "Failed to generate speech"
    );
  }
};
