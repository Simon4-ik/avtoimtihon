from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/progress", tags=["progress"])

@router.get("/")
def get_overall_progress(user_id: str, db: Session = Depends(get_db)):
    """Returns overall accuracy and history of exams for the given user"""
    # 1. Get Exam History
    exams = db.query(models.ExamSession).filter(
        models.ExamSession.user_id == user_id,
        models.ExamSession.finished_at != None
    ).order_by(models.ExamSession.finished_at.desc()).limit(10).all()
    
    # 2. Calculate overall accuracy from topic_performances
    performances = db.query(models.TopicPerformance).filter(models.TopicPerformance.user_id == user_id).all()
    
    total_correct = sum(p.correct_count for p in performances)
    total_wrong = sum(p.wrong_count for p in performances)
    total = total_correct + total_wrong
    
    accuracy = (total_correct / total * 100) if total > 0 else 0
    
    history = [
        {
            "id": str(exam.id),
            "date": exam.finished_at.isoformat(),
            "score": exam.score,
            "passed": exam.passed
        } for exam in exams
    ]
    
    return {
        "overall_accuracy_percent": round(accuracy, 1),
        "total_questions_answered": total,
        "recent_exams": history
    }

@router.get("/topics")
def get_topic_progress(user_id: str, db: Session = Depends(get_db)):
    """Returns accuracy per topic for the progress breakdown view"""
    performances = db.query(models.TopicPerformance).filter(models.TopicPerformance.user_id == user_id).all()
    
    results = []
    for perf in performances:
        topic = db.query(models.Topic).filter(models.Topic.id == perf.topic_id).first()
        total = perf.correct_count + perf.wrong_count
        acc = (perf.correct_count / total * 100) if total > 0 else 0
        
        results.append({
            "topic_id": perf.topic_id,
            "topic_name": topic.name if topic else "Unknown Topic",
            "accuracy_percent": round(acc, 1),
            "questions_answered": total
        })
        
    # Sort by lowest accuracy first to match what they should study
    results.sort(key=lambda x: x["accuracy_percent"])
    return results
