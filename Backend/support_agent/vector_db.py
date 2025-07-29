from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.docstore.document import Document
import json



def setup_vector_db(path="data.json"):
# def setup_vector_db(path=question_answer_pairs):
    with open(path, "r", encoding="utf-8") as f:
        qa_data = json.load(f)
    
    qa_data = path

    # embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    embedding_model = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")

    docs = [Document(page_content=item["question"], metadata={"answer": item["answer"]}) for item in qa_data]

    vector_db = FAISS.from_documents(docs, embedding_model)
    return vector_db



######--------------------  Below is the example of Chroma DB VEctor data base and above is FAISS cpu --------------------------------#################

# question_answer_pairs = [
#     {
#       "question": "I have not received Rakuten Points for items that I have bought at Rakuten.",
#       "answer": "In case of problems with orders or points on Rakuten, please contact Rakuten Customer Support here: https://www.rakuten.co.jp/help/. *Support is only in Japanese."
#     },
#     {
#       "question": "I forgot my log-in ID and password. What should I do?",
#       "answer": "You can reset your password from the Account Information Page of Rakuten Ichiba."
#     },
#     {
#       "question": "Even though I already paid GST/VAT to Rakuten Global Express, I was asked to pay it again during import. What should I do?",
#       "answer": "If you already paid GST to Rakuten Global Express but were re-invoiced, you can get a refund via your payment method, Japanese bank transfer, or Rakuten points. Submit your receipt and select 'duplicate GST/VAT payment'."
#     }
#   ]
  



# import os
# from langchain.vectorstores import Chroma
# from langchain.embeddings import HuggingFaceEmbeddings
# from langchain.schema import Document

# # Path to save vectorstore files
# VECTOR_DB_DIR = "chroma_store"

# def setup_vector_db(path=question_answer_pairs):
#     # Load embedding model
#     embedding_model = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")

#     # Check if vectorstore already exists (load it instead of recreating)
#     if os.path.exists(os.path.join(VECTOR_DB_DIR, "index")):
#         print("Loading existing Chroma vectorstore from disk...")
#         vector_db = Chroma(
#             persist_directory=VECTOR_DB_DIR,
#             embedding_function=embedding_model
#         )
#     else:
#         print("Creating new Chroma vectorstore...")
#         qa_data = path
#         docs = [Document(page_content=item["question"], metadata={"answer": item["answer"]}) for item in qa_data]

#         vector_db = Chroma.from_documents(
#             docs,
#             embedding_model,
#             persist_directory=VECTOR_DB_DIR
#         )
#         vector_db.persist()  # Save to disk

#     return vector_db
