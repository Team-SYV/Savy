import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from a .env file
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

def generate_interview_questions(type, previous, industry, experience_level, interview_type, job_description, company_name, job_role, resume_text=None):
    prompt = ""
    if (type == "RECORD"):

        # Prompt for generating questions for a recording interview
        prompt = f"""
        You are a hiring manager in the {industry} conducting an interview for a {job_role} position{'' if company_name is None else ' at ' + company_name}.

        The details of the interview are as follows:
        Interview type is {interview_type}, and the candidate's experience level is {experience_level}.
        Job description: {'' if job_description is None else job_description}.
        Resume details: {'' if resume_text is None else resume_text}.

        Please generate **5 clear and concise interview questions**.
        Ensure the first question is an introductory one, such as 'Tell me about yourself and a brief background,' 
        Please number the questions and ensure they are simple, short, straightforward, and easy to understand.
        """

    elif(type == "VIRTUAL"):

        # Prompt for generating questions for a virtual interview
        if(previous is None):
            prompt = f"""
            You are a hiring manager in the {industry} conducting an interview for a {job_role} position{'' if company_name is None else ' at ' + company_name}.

            The details of the interview are as follows:
            Interview type is {interview_type}, and the candidate's experience level is {experience_level}.
            Job description: {'' if job_description is None else job_description}.
            Resume details: {'' if resume_text is None else resume_text}.

            Please generate **1 clear and concise interview question**.
            Ensure the first question is an introductory one, such as 'Tell me about yourself and a brief background,' 
            Please number the questions and ensure they are simple, short, straightforward, and easy to understand.
            """
        else:
            prompt = f"""
            You are a hiring manager in the {industry} conducting an interview for a {job_role} position{'' if company_name is None else ' at ' + company_name}.

            The details of the interview are as follows:
            Interview type is {interview_type}, and the candidate's experience level is {experience_level}.
            Job description: {'' if job_description is None else job_description}.
            Resume details: {'' if resume_text is None else resume_text}.

            Please generate **1 clear and concise interview question**.
            Ensure the first question is an introductory one, such as 'Tell me about yourself and a brief background,' 
            Please number the questions and ensure they are simple, short, straightforward, and easy to understand.
            You can also make a follow-up question based on this previous answer: {previous}.
            """
              
    # Generate the completion using OpenAI's chat completion model
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an expert interview question generator."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=500
    )

    # Extract the response text from the completion
    response_text = completion.choices[0].message.content

    # Split the response into individual questions
    questions = response_text.split('\n') 

    # Filter and clean the questions, retaining only those that are numbered
    questions = [q.strip() for q in questions if q.strip() and q.strip()[0].isdigit()]

    return questions
