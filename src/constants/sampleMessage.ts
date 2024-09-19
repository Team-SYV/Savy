import { Message, Role } from "@/types/Chat";

export const sampleMessages: Message[] = [
  {
    role: Role.Bot,
    content: "Hello! Welcome to the interview. Can you please tell me about yourself?",
  },
  {
    role: Role.User,
    content: "Sure! My name is John, and I have over five years of experience in software development.",
  },
  {
    role: Role.Bot,
    content: "Great! What motivated you to apply for this position?",
  },
  {
    role: Role.User,
    content: "I am excited about the opportunity to work with your team and contribute to innovative projects.",
  },
  {
    role: Role.Bot,
    content: "Can you describe a challenging project you've worked on and how you handled it?",
  },
  {
    role: Role.User,
    content: "In my last role, I faced a tight deadline for a major release. I prioritized tasks and collaborated closely with my team to meet the deadline successfully.",
  },
  {
    role: Role.Bot,
    content: "That sounds impressive! How do you handle feedback and criticism?",
  },
  {
    role: Role.User,
    content: "I view feedback as an opportunity for growth and always strive to learn from it to improve my skills.",
  },
  {
    role: Role.Bot,
    content: "Thank you for sharing! Do you have any questions for me about the role or the company?",
  },
  {
    role: Role.User,
    content: "Yes, could you tell me more about the team I'll be working with?",
  },
];
