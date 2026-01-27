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

## ✨ Key Features

### 1. 🎨 Generative UI (The "Wow" Factor)
Nexus doesn't just output text. It understands when a user asks for a comparison (e.g., *"Compare Apple vs Microsoft stock"*) and autonomously:
* Generates a structured JSON payload.
* Renders an interactive **Bar Chart** or **Comparison Table** on the client side.
* Powered by **Recharts** and tailored System Prompts.

### 2. 🧠 Autonomous Agent (LangGraph)
Powered by **LangGraph**, Nexus uses a cyclic state machine:
* **Plan:** Analyzes the user query.
* **Act:** Searches the web.
* **Reflect:** Checks if the data is sufficient. If not, it **loops back** to search again with a better query.
* **Answer:** Synthesizes the final report with citations.

### 3. ⚡ Cloud-Native Performance
* **Backend:** High-performance **FastAPI** (Python) server handling async LLM streams.
* **Frontend:** **Next.js 14** (React) for Server-Side Rendering (SSR) and streaming UI updates.
* **Infrastructure:** Fully containerized (**Docker**) and deployed on **Google Cloud Run** (Serverless).

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
