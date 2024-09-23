import os
import logging
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

# Set up logging configuration
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

def generate_interview_questions(industry, experience_level, interview_type, job_description, company_name, job_role, resume_text):
    # Log the inputs
    logger.info("Generating interview questions with inputs: ")
    logger.info("Industry: %s", industry)
    logger.info("Experience Level: %s", experience_level)
    logger.info("Interview Type: %s", interview_type)
    logger.info("Job Description: %s", job_description)
    logger.info("Company Name: %s", company_name)
    logger.info("Job Role: %s", job_role)
    logger.info("Resume Text: %s", resume_text)

    prompt = f"""
    You are a hiring manager conducting an interview for a {job_role} at {company_name}.
    The industry is {industry} and the interview type is {interview_type}.
    The job description is as follows: {job_description}.
    The candidate's experience level is {experience_level}, and their resume contains the following information: {resume_text}.
    
     Please generate 5 interview questions in simple, clear language that a beginner could easily understand. 
    Focus on basic skills, job role expectations, and how the candidate's background relates to the role.
    Please number the questions.
    """

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an expert interview question generator."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=250
    )

    response_text = completion.choices[0].message.content

    questions = response_text.split('\n') 

    questions = [q.strip() for q in questions if q.strip() and q.strip()[0].isdigit()]

    return questions

