import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const createJobDescription = async (jobData) => {
  try {
    const response = await api.post("/api/job_information/create/", jobData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to create job description"
    );
  }
};

export const uploadResume = async (fileUri, userId, onUploadProgress) => {
  const formData = new FormData();

  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const contentType = blob.type || "application/pdf";

    // Extract file name from URI and truncate if needed
    const fileName = fileUri.split("/").pop();
    const truncatedFileName =
      fileName.length > 50 ? fileName.slice(0, 50) : fileName;

    formData.append("file", blob, truncatedFileName);
    formData.append("user_id", userId);

    console.log("Form data:", formData); // Debug: Check what is sent

    const result = await api.post("/api/resumes/upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });

    return result.data;
  } catch (error) {
    if (error.response?.status === 422) {
      throw new Error("Validation Error: Please check your file and user ID.");
    }
    throw new Error(error.response?.data?.detail || "Upload failed.");
  }
};
