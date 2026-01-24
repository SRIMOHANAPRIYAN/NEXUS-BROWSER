from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from langchain_core.messages import HumanMessage
import json

# Import our Brain
from app.core.graph import app_graph

app = FastAPI(title="Nexus Engine API")

# Allow Frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://nexus-frontend-193226167127.us-central1.run.app"  
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

async def stream_graph_updates(user_message: str):
    inputs = {"messages": [HumanMessage(content=user_message)]}
    try:
        for event in app_graph.stream(inputs):
            for key, value in event.items():
                if key == "chatbot":
                    last_msg = value["messages"][-1]
                    content = last_msg.content
                    
                    # --- FIX: Handle Gemini's "Content Blocks" ---
                    # Sometimes Gemini returns a list like [{'type': 'text', 'text': '...'}]
                    # We need to extract just the text part.
                    if isinstance(content, list):
                        text_parts = []
                        for block in content:
                            if isinstance(block, dict) and "text" in block:
                                text_parts.append(block["text"])
                            elif isinstance(block, str):
                                text_parts.append(block)
                        content = "".join(text_parts)
                    
                    # Send cleaned text as a stream
                    yield json.dumps({"type": "message", "content": content}) + "\n"
                    
    except Exception as e:
        # Send error message safely
        yield json.dumps({"type": "error", "content": f"Server Error: {str(e)}"}) + "\n"

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    return StreamingResponse(
        stream_graph_updates(request.message),
        media_type="application/x-ndjson"
    )

@app.get("/health")
def health_check():
    return {"status": "ok", "engine": "nexus-v1"}