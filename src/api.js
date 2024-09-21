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

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("file", {
    uri: file.uri,
    type: 'application/pdf',
    name: file.name,
  });

  try {
    const response = await api.post("/api/convert-pdf/", formData, {
      headers: {
        "Content-Type": "application/pdf",
      },
    });
    return response.data.text;  
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to upload resume"
    );
  }
};