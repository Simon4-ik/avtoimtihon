from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/exam", tags=["exam"])

@router.post("/start", response_model=schemas.ExamSessionResponse)
def start_exam(exam_start: schemas.ExamStart, db: Session = Depends(get_db)):
    # Verify user exists
    user = db.query(models.User).filter(models.User.id == exam_start.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    session = models.ExamSession(user_id=user.id)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@router.post("/submit", response_model=schemas.ExamResultResponse)
def submit_exam(exam_submit: schemas.ExamSubmit, db: Session = Depends(get_db)):
    session = db.query(models.ExamSession).filter(models.ExamSession.id == exam_submit.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if session.finished_at:
        raise HTTPException(status_code=400, detail="Exam already submitted")

    score = 0
    valid_answers = 0
    # Evaluate answers
    for answer_data in exam_submit.answers:
        answer = db.query(models.Answer).filter(models.Answer.id == answer_data.selected_answer_id).first()
        question = db.query(models.Question).filter(models.Question.id == answer_data.question_id).first()
        
        is_correct = answer.is_correct if answer else False
        if is_correct:
            score += 1
            
        user_answer = models.UserAnswer(
            session_id=session.id,
            question_id=answer_data.question_id,
            selected_answer_id=answer_data.selected_answer_id,
            is_correct=is_correct
        )
        db.add(user_answer)
        
        # Update topic performance for AI (if user had performance record)
        if question:
            perf = db.query(models.TopicPerformance).filter(
                models.TopicPerformance.user_id == session.user_id,
                models.TopicPerformance.topic_id == question.topic_id
            ).first()
            if not perf:
                perf = models.TopicPerformance(user_id=session.user_id, topic_id=question.topic_id)
                db.add(perf)
            if is_correct:
                perf.correct_count += 1
            else:
                perf.wrong_count += 1

    session.finished_at = datetime.utcnow()
    session.score = score
    session.passed = score >= 16 # Magic number for MVP logic from design plan
    
    db.commit()
    db.refresh(session)
    
    return session

@router.get("/result/{session_id}", response_model=schemas.ExamResultResponse)
def get_exam_result(session_id: str, db: Session = Depends(get_db)):
    session = db.query(models.ExamSession).filter(models.ExamSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session
