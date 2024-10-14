import axios from "axios";
import { InterviewData } from "./types/InterviewData";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
});

export const createInterview = async (interviewData: InterviewData) => {
  try {
    const response = await api.post("/api/interview/create/", interviewData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to create interview"
    );
  }
};

export const createJobInformation = async (jobInformationData: JobInformationData) => {
  try {
    const response = await api.post("/api/job_information/create/", jobInformationData);
    return response.data.id;
  } catch (error) {
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

export const generateQuestions = async (formData: FormData) => {
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

export const createQuestions = async (jobId: string | string[], questionData: QuestionData) => {
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

export const getQuestions = async (jobId: string | string[]) => {
  try {
    const response = await api.get(`/api/questions/${jobId}`);
    return response.data.questions;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to retrieve questions"
    );
  }
};

export const transcribeAudio = async (file: string | Blob) => {
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

export const generateAnswerFeedback = async (formData: FormData) => {
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

    return response.data.feedback;
  } catch (error) {
    console.error("Error response from server:", error.response);

    console.error("Full error object:", JSON.stringify(error, null, 2));

    throw new Error(
      error.response?.data?.detail || "Failed to generate answer feedback"
    );
  }
};

export const createAnswer = async (answerData: AnswerData ) => {
  try {
    const response = await api.post("/api/answers/create/", answerData);
    return response.data.id;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to create answer in the database"
    );
  }
};
