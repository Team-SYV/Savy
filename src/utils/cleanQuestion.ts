export const cleanQuestion = (question: string) => {
  return question.replace(/\*/g, "").trim();
};