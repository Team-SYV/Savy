import { JobInfoData } from "./JobInfo";

export interface StepContentProps {
  activeStep: number;
  formData: JobInfoData;
  updateFormData: (key: string, value: string, callback?: () => void) => void;
  handleNextStep: () => void;
  handleSubmit: () => void;
  handleSubmitRoute: string;
  handleSkip: () => void;
  jobInformationId: string | null;
}
