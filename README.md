# Nexus: Autonomous Insight Engine 🧠

> A Next-Gen AI Search Engine capable of deep web research, autonomous reasoning, and **Generative UI** rendering.

## 💡 What is Nexus?

**Nexus** is not just a chatbot. It is an **Autonomous Research Agent** that bridges the gap between static LLM knowledge and real-time web data. 

Unlike standard search engines that give you links, Nexus:
1.  **Reads** the live web using the **Tavily API**.
2.  **Reasons** using **Google Gemini Pro** to filter noise.
3.  **Visualizes** complex data by dynamically generating **React Components** (Charts, Tables) instead of just text.

It is built on a **Microservices Architecture**, containerized with **Docker**, and deployed on **Google Cloud Run** for auto-scaling performance.

---

# Browser Interface

<img width="1512" height="854" alt="image" src="https://github.com/user-attachments/assets/9533d28e-7310-4ef4-a518-7996cc29259d" />

# Generative UI (Comparison Table)

<img width="1512" height="861" alt="image" src="https://github.com/user-attachments/assets/922917f6-2eb3-48ba-b5df-9fa16c7fc015" />

# Graph Visualisation

<img width="1512" height="860" alt="image" src="https://github.com/user-attachments/assets/2ccf3ec2-8fdd-42fc-a13a-e2bf8687b23a" />

---

## ✨ Key Features

### 1. 🧠 Core Architecture
Unlike standard RAG pipelines, Nexus Browser implements an **Agentic Workflow** using **LangGraph**:
1.  **Planner Node:** Deconstructs complex user queries into sub-tasks.
2.  **Retrieval Node:** Fetches data using **Tavily API** (Web) and **Gemini 1.5** (Reasoning).
3.  **Cyclic Refinement:** If the retrieved data is insufficient, the agent "loops back" to rewrite the search query autonomously.
4.  **Generative UI Engine:** Transforms the LLM's raw JSON output into React components (Recharts, Tables) on the fly.

### 2. 🎨 Generative UI (The "Wow" Factor)
Nexus doesn't just output text. It understands when a user asks for a comparison (e.g., *"Compare Apple vs Microsoft stock"*) and autonomously:
* Generates a structured JSON payload.
* Renders an interactive **Bar Chart** or **Comparison Table** on the client side.
* Powered by **Recharts** and tailored System Prompts.

### 3. ⚡ Cloud-Native Performance
* **Backend:** High-performance **FastAPI** (Python) server handling async LLM streams.
* **Frontend:** **Next.js 14** (React) for Server-Side Rendering (SSR) and streaming UI updates.
* **Infrastructure:** Fully containerized (**Docker**) and deployed on **Google Cloud Run** (Serverless).

### 4. 🚀 Key Features
* **🕵️‍♂️ Autonomous Reasoning:** Uses MCP-style agent-to-agent communication to handle multi-step research tasks.
* **🎨 Generative UI:** Dynamic rendering of interactive charts and comparison tables from text responses.
* **⚡ Production Scalability:** Microservices architecture deployed on **Google Cloud Run** with Docker.
* **🔄 Self-Correcting Search:** Automatically detects hallucinations or poor results and triggers a re-search.

---

## 🛠️ Tech Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14, Tailwind CSS, Lucide Icons | Responsive Chat UI & Streaming |
| **Visualization** | Recharts | Rendering dynamic charts |
| **Backend** | FastAPI (Python) | API & Agent Orchestration |
| **AI Model** | Google Gemini Pro (via LangChain) | Reasoning & Content Generation |
| **Search Tool** | Tavily API | Real-time web scraping & indexing |
| **DevOps** | Docker, Google Cloud Run | Containerization & Deployment |

---

## 🔮 Future Roadmap: The MCP Evolution

The next architectural evolution for Nexus is the integration of the **Model Context Protocol (MCP)**.
* **Goal:** Transform Nexus from a "Search Bot" into a "Universal Assistant."
* **Implementation:** Refactor the backend to act as an **MCP Host**.
* **Impact:** This will allow Nexus to plug into external tools (GitHub, Slack, Local Files) via standardized **MCP Servers** without modifying the core codebase.

---
