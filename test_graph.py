from app.core.graph import app_graph
from langchain_core.messages import HumanMessage

def run_test():
    print("Connecting to Nexus Brain (Gemini Edition)...")
    
    # Test Query: Forces a search
    user_input = "Compare the battery life of iPhone 16 vs Pixel 9"
    print(f"User Question: {user_input}\n")

    inputs = {"messages": [HumanMessage(content=user_input)]}

    # Run the graph
    # If the API keys are wrong, this is where it will crash
    try:
        for event in app_graph.stream(inputs):
            for key, value in event.items():
                print(f"--- Step: {key} ---")
                if "messages" in value:
                    last_msg = value["messages"][-1]
                    if hasattr(last_msg, "content") and last_msg.content:
                        # Print the first 300 characters of the answer
                        print(f"AI: {last_msg.content[:300]}...\n")
    except Exception as e:
        print(f"Error: {e}")
        print("Hint: Check your .env file and API keys!")

if __name__ == "__main__":
    run_test()