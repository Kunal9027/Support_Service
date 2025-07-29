# AI Support Service 🧠💬

A fully functional **AI-powered customer support system** that simulates how modern companies handle user queries using **RAG (Retrieval-Augmented Generation)**, **LLMs**, and **Memory**. This project showcases advanced backend and frontend integration using **React**, **Groq API**, **Django REST Framework**, **LangChain**, and **Embeddings models**.

---
## 🛠️ Setup Guide

### 🔧 Backend (Django)

```bash
cd backend
pip install -r requirements.txt
python manage.py runserver
```

### Set up .env file with:
```
OPENAI_API_KEY=your_key
GROQ_API_KEY=your_key
```
### Frontend (React)
```
cd frontend
npm install
npm run dev
```


---

## 📜 How It Works

1. **FAQ Upload & Embedding**
   - FAQs are embedded using OpenAI and stored in FAISS vector DB.

2. **User Query**
   - User enters a question on the frontend.
   - Query is embedded and compared to stored vectors.

3. **RAG + Memory**
   - Relevant context is passed to Groq LLM using LangChain.
   - Memory stores previous chat for continuity.

4. **Response**
   - LLM returns answer based on context + history.

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

## 🙋‍♂️ Why I Built This

This project is part of my personal journey to become a **Full-Stack AI Developer**.

I built this to:

- Demonstrate my **end-to-end skills** — from backend API development to frontend UI design
- Apply **AI/ML tools** like LangChain, Groq API, and OpenAI embeddings in a real-world use case
- Learn how to deploy and host a live service using **Render** and **Netlify**
- Explore production concerns like **uptime, caching, security, and scalability**

Although I’m still learning, but  I can already build and ship real applications that could serve actual businesses. I continue to improve the system by adding better **security**, **performance**, and **error handling** features.
