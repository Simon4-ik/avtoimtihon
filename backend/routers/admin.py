from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/topics", response_model=schemas.TopicResponse)
def create_topic(topic: schemas.TopicBase, db: Session = Depends(get_db)):
    db_topic = models.Topic(name=topic.name, description=topic.description)
    db.add(db_topic)
    db.commit()
    db.refresh(db_topic)
    return db_topic

@router.post("/questions", response_model=schemas.QuestionResponse)
def create_question(question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    # Check topic
    db_topic = db.query(models.Topic).filter(models.Topic.id == question.topic_id).first()
    if not db_topic:
        raise HTTPException(status_code=404, detail="Topic not found")
        
    db_question = models.Question(
        topic_id=question.topic_id,
        question_text=question.question_text,
        image_url=question.image_url
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)

    for ans in question.answers:
        db_answer = models.Answer(
            question_id=db_question.id,
            answer_text=ans.answer_text,
            is_correct=ans.is_correct
        )
        db.add(db_answer)
        
    db.commit()
    db.refresh(db_question)
    return db_question
