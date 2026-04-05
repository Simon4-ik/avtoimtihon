import uuid
from sqlalchemy import Boolean, Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    subscriptions = relationship("Subscription", back_populates="user")
    exam_sessions = relationship("ExamSession", back_populates="user")
    topic_performances = relationship("TopicPerformance", back_populates="user")


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    plan_type = Column(String) # '2week', '1month', '1year'
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    is_active = Column(Boolean, default=False)

    user = relationship("User", back_populates="subscriptions")


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)

    questions = relationship("Question", back_populates="topic")
    topic_performances = relationship("TopicPerformance", back_populates="topic")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"))
    question_text = Column(String)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    topic = relationship("Topic", back_populates="questions")
    answers = relationship("Answer", back_populates="question")


class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    answer_text = Column(String)
    is_correct = Column(Boolean, default=False)

    question = relationship("Question", back_populates="answers")


class ExamSession(Base):
    __tablename__ = "exam_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    started_at = Column(DateTime, default=datetime.utcnow)
    finished_at = Column(DateTime, nullable=True)
    score = Column(Integer, default=0)
    passed = Column(Boolean, default=False)

    user = relationship("User", back_populates="exam_sessions")
    user_answers = relationship("UserAnswer", back_populates="session")


class UserAnswer(Base):
    __tablename__ = "user_answers"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(UUID(as_uuid=True), ForeignKey("exam_sessions.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    selected_answer_id = Column(Integer, ForeignKey("answers.id"))
    is_correct = Column(Boolean)

    session = relationship("ExamSession", back_populates="user_answers")


class TopicPerformance(Base):
    __tablename__ = "topic_performance"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), primary_key=True)
    correct_count = Column(Integer, default=0)
    wrong_count = Column(Integer, default=0)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="topic_performances")
    topic = relationship("Topic", back_populates="topic_performances")
