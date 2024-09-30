import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from a .env file
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

def generate_interview_questions(type, industry, experience_level, interview_type, job_description, company_name, job_role, resume_text=None):
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
        prompt = f"""
            You are a hiring manager in the {industry} conducting an interview for a {job_role} position{'' if company_name is None else ' at ' + company_name}.

            The details of the interview are as follows:
            Interview type is {interview_type}, and the candidate's experience level is {experience_level}.
            Job description: {'' if job_description is None else job_description}.
            Resume details: {'' if resume_text is None else resume_text}.

            Please generate **10 clear and concise interview question**.
            Ensure the first question is an introductory one, such as 'Tell me about yourself and a brief background,' 
            Please number the questions and ensure they are simple, short, straightforward, and easy to understand.
            """
              
    # Generate the completion using OpenAI's chat completion model
    completion = client.chat.completions.create(
        model="gpt-4o",
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

def generate_answer_feedback(previous_question, previous_answer):
    prompt = f"""
    Previous question: {previous_question}
    Previous answer: {previous_answer}
    
    Please provide one short sentence starting with "You" that either gives positive praise or indicates if the answer is unclear.
    Speak as if you are talking to me directly.
    """

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an experienced hiring manager giving concise praise."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=50
    )

    response_text = completion.choices[0].message.content.strip()

    return response_text
