from typing import Annotated, List, TypedDict
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

# This is the "Memory" of our Agent
class AgentState(TypedDict):
    # 'add_messages' ensures we append to history, not overwrite it
    messages: Annotated[List[BaseMessage], add_messages]
    # This checks if we need to render a UI component (Chart/Table)
    ui_component: dict | None