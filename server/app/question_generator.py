import os
import logging
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

def generate_interview_questions(industry, experience_level, interview_type, job_description, company_name, job_role, resume_text):
    prompt = f"""
    You are a hiring manager conducting an interview for a {job_role} position at {company_name}.
    The industry is {industry}. 
    The type of interview you are going to ask is {interview_type} interview.
    The job description is as follows: {job_description}.
    The candidate's experience level is {experience_level}.
    The resume includes the following details: {resume_text}.

    Please generate **5 interview questions** that are clear, concise, and beginner-friendly. 
    Ensure the first question is an introductory one, such as 'Tell me about yourself and a brief background,' 
    Please number the questions and ensure they are simple, short, straightforward and easy to understand.
    """

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an expert interview question generator."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=500
    )

    response_text = completion.choices[0].message.content

    questions = response_text.split('\n') 

    questions = [q.strip() for q in questions if q.strip() and q.strip()[0].isdigit()]

    return questions

