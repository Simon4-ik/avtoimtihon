from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Avtoimtihon API (MVP)")

from .routers import questions, exam, practice, admin, auth, subscription, progress

app.include_router(questions.router)
app.include_router(exam.router)
app.include_router(practice.router)
app.include_router(admin.router)
app.include_router(auth.router)
app.include_router(subscription.router)
app.include_router(progress.router)

# Allow all origins for the MVP
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Avtoimtihon API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
