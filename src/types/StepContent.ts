import { JobInfoData } from "./JobInfo";

export interface StepContentProps {
  activeStep: number;
  formData: JobInfoData;
  updateFormData: (key: string, value: string, callback?: () => void) => void;
  handleNextStep: () => void;
  handleSubmit: () => void;
  jobInformationId: string | null;
}