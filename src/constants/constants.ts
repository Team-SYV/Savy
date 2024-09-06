export const steps = [
  { title: "Select an Industry" },
  { title: "Select a Job Role" },
  { title: "Interview Type" },
  { title: "Experience Level" },
  { title: "Company Name" },
  { title: "Job Description" },
  { title: "Customize" },
];

export const industry = [
  { key: "IT", value: "Information Technology" },
  { key: "BPO", value: "Business Process Outsourcing" },
];

export const jobRole = {
  "Information Technology": [
    { key: "software_developer", value: "Software Developer/Engineer" },
    { key: "qa_engineer", value: "QA Tester/Engineer" },
    { key: "business_analyst", value: "Business Analyst" },
    { key: "devops_engineer", value: "DevOps Engineer" },
    { key: "project_manager", value: "Project Manager" },
    { key: "network_admin", value: "Network Administrator" },
    { key: "database_admin", value: "Database Administrator" },
    { key: "cloud_engineer", value: "Cloud Engineer" },
  ],
  "Business Process Outsourcing": [
    { key: "customer_service", value: "Customer Service Representatives" },
    { key: "tech_support", value: "Technical Support Specialists" },
    { key: "sales_telemarketing", value: "Sales and Telemarketing" },
    { key: "back_office", value: "Back-Office Operations" },
    { key: "hr_outsourcing", value: "Human Resources (HR) Outsourcing" },
  ],
};

export const experienceLevel = [
  { key: "entry_level", value: "Entry-Level (0-2 Years)" },
  { key: "mid_level", value: "Mid-Level (3-7 Years)" },
  { key: "senior_level", value: "Senior-Level (8+ Years)" },
];
