from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/questions", tags=["questions"])

@router.get("/topics", response_model=List[schemas.TopicResponse])
def get_topics(db: Session = Depends(get_db)):
    topics = db.query(models.Topic).all()
    return topics

@router.get("/", response_model=List[schemas.QuestionResponse])
def get_questions(topic_id: int = None, db: Session = Depends(get_db)):
    query = db.query(models.Question)
    if topic_id:
        query = query.filter(models.Question.topic_id == topic_id)
    return query.all()

@router.get("/random", response_model=List[schemas.QuestionResponse])
def get_random_questions(limit: int = 20, db: Session = Depends(get_db)):
    questions = db.query(models.Question).order_by(func.random()).limit(limit).all()
    return questions
