import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .graph import build_graph
app = FastAPI(title="Multi Agent Code Reviewer")
# Frontend URL
# For now, "*" allows the frontend to communicate with the backend.
# We will make this more secure when we configure the production domain.
FRONTEND_URL = os.getenv("FRONTEND_URL", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL] if FRONTEND_URL != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class CodeRequest(BaseModel):
    code: str
@app.get("/")
def root():
    return {
        "message": "Multi Agent Code Reviewer is running"
    }
@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
@app.post("/review")
async def review_code(request: CodeRequest):
    graph = await build_graph()
    result = await graph.ainvoke(
        {
            "code": request.code,
            "tool_result": "",
            "review": "",
            "answer": "",
        }
    )
    return {
        "review": result["review"],
        "answer": result["answer"],
    }