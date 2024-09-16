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
    default:
      return true;
  }
};

export const getErrorMessage = (step: number) => {
  switch (step) {
    case 0:
      return "Please select an industry.";
    case 1:
      return "Please select a job role.";
    case 3:
      return "Please select an experience level.";
    default:
      return "";
  }
};
