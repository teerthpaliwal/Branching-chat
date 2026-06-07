from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import declarative_base

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey
)

parent_id = Column(
    Integer,
    ForeignKey("messages.id"),
    nullable=True
)

Base = declarative_base()

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, nullable=True)
    role = Column(String)
    content = Column(Text)