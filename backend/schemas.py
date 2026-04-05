from pydantic import BaseModel, UUID4, EmailStr
from typing import List, Optional
from datetime import datetime

class TopicBase(BaseModel):
    name: str
    description: Optional[str] = None

class TopicResponse(TopicBase):
    id: int
    class Config:
        from_attributes = True

class AnswerCreate(BaseModel):
    answer_text: str
    is_correct: bool

class QuestionCreate(BaseModel):
    topic_id: int
    question_text: str
    image_url: Optional[str] = None
    answers: List[AnswerCreate]

class AnswerBase(BaseModel):
    id: int
    answer_text: str

class QuestionResponse(BaseModel):
    id: int
    topic_id: int
    question_text: str
    image_url: Optional[str] = None
    answers: List[AnswerBase]

    class Config:
        from_attributes = True

class ExamStart(BaseModel):
    user_id: UUID4

class ExamSessionResponse(BaseModel):
    id: UUID4
    started_at: datetime
    class Config:
        from_attributes = True

class SubmitAnswer(BaseModel):
    question_id: int
    selected_answer_id: int

class ExamSubmit(BaseModel):
    session_id: UUID4
    answers: List[SubmitAnswer]

class ExamResultResponse(BaseModel):
    id: UUID4
    score: int
    passed: bool
    finished_at: datetime
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: UUID4
    email: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
