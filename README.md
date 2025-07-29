# AI Support Service 🧠💬

A fully functional **AI-powered customer support system** that simulates how modern companies handle user queries using **RAG (Retrieval-Augmented Generation)**, **LLMs**, and **Memory**. This project showcases advanced backend and frontend integration using **React**, **Groq API**, **Django REST Framework**, **LangChain**, and **Embeddings models**.

---

## 📺 Demo

🌐 **Live Demo Frontend**: [https://ai-support-demo.netlify.app](https://ai-support-demo.netlify.app)  
⚙️ **Backend API**: [https://ai-support-backend.onrender.com](https://ai-support-backend.onrender.com)

---

## 🖼️ Screenshots

### 🔍 User asks a query
![Query Screenshot](assets/query.png)

### 📄 AI-generated response with context
![Response Screenshot](assets/response.png)

> _Place your actual screenshots in a folder named `assets/` in your GitHub repo_

---

## 🚀 Features

- ✅ Ask any question — real-time AI answers
- 🔍 RAG pipeline to find most relevant FAQ using vector search
- 🧾 OpenAI Embedding-based semantic similarity
- 💬 Memory support using LangChain conversation buffer
- ⚙️ REST API backend with Django + DRF
- 🖥️ Modern React frontend (Netlify hosted)
- 📦 Easily extendable with admin panel or database

---

## 🧠 Tech Stack

| Layer      | Stack / Service                |
|------------|-------------------------------|
| LLM        | Groq (LLaMA 3)                 |
| Embedding  | Hugging Face (`BAAI/bge-small-en-v1.5`) locally, OpenAI Embedding for demo |
| RAG        | LangChain + FAISS              |
| Backend    | Django, Django REST Framework  |
| Frontend   | React                          |
| Deployment | Render (Backend), Netlify (Frontend) |

---

## 📦 Project Structure

