import os
import sys
from typing import Literal
from dotenv import load_dotenv

from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.messages import SystemMessage, HumanMessage
from langgraph.prebuilt import ToolNode

from app.core.state import AgentState

# --- 1. SECURE CONFIGURATION ---
# Load environment variables from the .env file
load_dotenv()

# Validate API Keys (Fail fast if they are missing)
if not os.getenv("GOOGLE_API_KEY"):
    sys.exit("ERROR: GOOGLE_API_KEY is missing in .env file")
if not os.getenv("TAVILY_API_KEY"):
    sys.exit("ERROR: TAVILY_API_KEY is missing in .env file")

# Setup Gemini (using 1.5 Flash for speed)
# We set temperature=0 to make it factual and consistent
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
    convert_system_message_to_human=True 
)

# Setup Search Tool
tool_search = TavilySearchResults(max_results=3)
tools = [tool_search]

# Bind tools to Gemini
llm_with_tools = llm.bind_tools(tools)

# --- 2. SYSTEM PROMPT ---
SYSTEM_PROMPT = """You are Nexus, an advanced AI search engine.
Your goal is to provide accurate, well-cited answers.

CRITICAL INSTRUCTION FOR GENERATIVE UI:
If the user asks for a comparison involves NUMERIC data (like specs, prices, scores), 
you MUST use a 'bar_chart' instead of a table.

<UI_COMPONENT>
{
  "type": "bar_chart",
  "title": "Comparison Title",
  "data": [
    {"label": "Item A", "value": 100},
    {"label": "Item B", "value": 200}
  ]
}
</UI_COMPONENT>

Format for Tables:
<UI_COMPONENT>
{
  "type": "table",
  "title": "Table Title",
  "data": {
    "headers": ["Column 1", "Column 2"],
    "rows": [ ["Row 1 Col 1", "Row 1 Col 2"] ]
  }
}
</UI_COMPONENT>
"""

# --- 3. NODE LOGIC ---

def chatbot_node(state: AgentState):
    """The Brain: Decides to answer or search."""
    messages = state["messages"]
    
    # Ensure System Prompt is always the first message
    if not messages or not isinstance(messages[0], SystemMessage):
        messages = [SystemMessage(content=SYSTEM_PROMPT)] + messages
    
    # Invoke Gemini
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}

def should_continue(state: AgentState) -> Literal["tools", "__end__"]:
    """The Router: Checks if Gemini wants to use a tool."""
    last_message = state["messages"][-1]
    
    if last_message.tool_calls:
        return "tools"
    return END

# --- 4. BUILD THE GRAPH ---
workflow = StateGraph(AgentState)

workflow.add_node("chatbot", chatbot_node)
workflow.add_node("tools", ToolNode(tools=tools))

workflow.set_entry_point("chatbot")

workflow.add_conditional_edges(
    "chatbot",
    should_continue,
)
workflow.add_edge("tools", "chatbot")

app_graph = workflow.compile()