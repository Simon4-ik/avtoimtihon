from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func, cast
from sqlalchemy import Float
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/practice", tags=["practice"])

@router.get("/personalized", response_model=List[schemas.QuestionResponse])
def get_personalized_practice(user_id: str, limit: int = 10, db: Session = Depends(get_db)):
    # 1. Calculate Weakness Score
    # weakness_score = wrong_count / (correct_count + wrong_count)
    # 2. Pick top weakest topics
    weak_topics_query = db.query(
        models.TopicPerformance.topic_id,
        (cast(models.TopicPerformance.wrong_count, Float) / 
            (models.TopicPerformance.correct_count + models.TopicPerformance.wrong_count + 0.0001)
        ).label('weakness')
    ).filter(models.TopicPerformance.user_id == user_id).order_by('weakness').limit(3).all()

    weak_topic_ids = [t.topic_id for t in weak_topics_query]
    
    questions = []
    
    if weak_topic_ids:
        # 3. Select questions mostly from those topics (70%)
        weak_limit = int(limit * 0.7)
        weak_questions = db.query(models.Question).filter(
            models.Question.topic_id.in_(weak_topic_ids)
        ).order_by(func.random()).limit(weak_limit).all()
        
        questions.extend(weak_questions)
        
        # 4. Add random questions (30%)
        random_limit = limit - len(questions)
        random_questions = db.query(models.Question).filter(
            ~models.Question.topic_id.in_(weak_topic_ids)
        ).order_by(func.random()).limit(random_limit).all()
        
        questions.extend(random_questions)
    else:
        # If no history, just return random
        questions = db.query(models.Question).order_by(func.random()).limit(limit).all()
        
    return questions
