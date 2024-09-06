export interface FormData {
  selectedIndustry: string | null;
  selectedJobRole: string | null;
  selectedInterviewType: string | null;
  selectedExperienceLevel: string | null;
  companyName: string;
  jobDescription: string;
}

export const validateStep = (step: number, formData: any) => {
  switch (step) {
    case 0:
      return formData.selectedIndustry !== null;
    case 1:
      return formData.selectedJobRole !== null;
    case 2:
      return formData.selectedInterviewType !== null;
    case 3:
      return formData.selectedExperienceLevel !== null;
    case 4:
      return formData.companyName.trim() !== "";
    case 5:
      return formData.jobDescription.trim() !== "";
    case 6:
      return true;
    default:
      return false;
  }
};

export const getErrorMessage = (step: number) => {
  switch (step) {
    case 0:
      return "Please select an industry.";
    case 1:
      return "Please select a job role.";
    case 2:
      return "Please select an interview type.";
    case 3:
      return "Please select an experience level.";
    case 4:
      return "Company name cannot be empty.";
    case 5:
      return "Job description cannot be empty.";
    case 6:
      return "";
    default:
      return "";
  }
};
