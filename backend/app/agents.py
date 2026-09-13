from langchain_openai import ChatOpenAI
from .config import OPENAI_API_KEY
def create_llm():
    return ChatOpenAI(
        model="gpt-5.6-luna",
        temperature=0,
        api_key=OPENAI_API_KEY,
    )
def reviewer_prompt(code: str, tool_result: str) -> str:

    return f"""
You are a Python Code Reviewer Agent.

Review the student's Python code.

Python code:
{code}

MCP analysis:
{tool_result}

Identify:
1. Syntax problems
2. Code quality problems
3. Possible improvements

Keep the explanation short and student friendly.
"""

def teacher_prompt(code: str, review: str) -> str:
    return f"""
You are a Python Teacher Agent.

Explain the following code review to a student.

Python code:
{code}

Code review:
{review}

Explain:
1. What is wrong
2. Why it is wrong
3. How to improve it
4. Show improved code if useful

Use simple language.
"""