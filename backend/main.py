from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, engine
from models import Base, Message
from schemas import MessageCreate

import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

def fake_ai_response(user_message: str):

    return (
        "Fake AI says: "
        + user_message
    )

def generate_ai_response(
    conversation_path
):

    messages = []

    for message in conversation_path:

        role = message.role.lower()

    if role not in [
        "user",
        "assistant",
        "system"
    ]:
        role = "user"

    messages.append({
            "role": role,
            "content": message.content
        })

    response = (
        client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=messages
        )
    )

    return (
        response
        .choices[0]
        .message
        .content
    )

def build_conversation_path(
    db,
    message_id: int
):

    path = []

    current = (
        db.query(Message)
        .filter(Message.id == message_id)
        .first()
    )

    while current is not None:

        path.append(current)

        if current.parent_id is None:
            break

        current = (
            db.query(Message)
            .filter(
                Message.id ==
                current.parent_id
            )
            .first()
        )

    path.reverse()

    return path

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.get("/test-ai")
def test_ai():

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "user",
                "content": "Say hello in one sentence."
            }
        ]
    )

    return {
        "response":
        response.choices[0].message.content
    }

@app.post("/messages")
def create_message(message: MessageCreate):

    db = SessionLocal()

    try:

        user_message = Message(
            parent_id=message.parent_id,
            role=message.role,
            content=message.content
        )

        db.add(user_message)
        db.commit()
        db.refresh(user_message)

        

        conversation_path = (
            build_conversation_path(
                db,
                user_message.id
            )
        )

        print("PATH SENT TO GPT:")

        for msg in conversation_path:
            print(msg.role, ":", msg.content)

        ai_text = (
            generate_ai_response(
                conversation_path
            )
        )

        ai_message = Message(
            parent_id=user_message.id,
            role="assistant",
            content=ai_text
        )

        db.add(ai_message)
        db.commit()
        db.refresh(ai_message)

        return {
            "user_id": user_message.id,
            "assistant_id": ai_message.id
        }

    finally:
        db.close()


@app.get("/messages")
def get_messages():

    db = SessionLocal()

    try:
        messages = db.query(Message).all()

        return messages
    finally:
        db.close()

@app.get("/messages/{message_id}")
def get_message(message_id: int):

    db = SessionLocal()

    try:
        message = (
            db.query(Message)
            .filter(Message.id == message_id)
            .first()
        )

        if message is None:
            raise HTTPException(
                status_code=404,
                detail="Message not found"
            )

        return message

    finally:
        db.close()

@app.get("/messages/{message_id}/children")
def get_children(message_id: int):

    db = SessionLocal()

    try:
        children = (
            db.query(Message)
            .filter(Message.parent_id == message_id)
            .all()
        )
        return children
    
    finally:
        db.close()


@app.get("/messages/{message_id}/path")
def get_path(message_id: int):

    db = SessionLocal()

    path = []

    try:

        current_message = (
            db.query(Message)
            .filter(Message.id == message_id)
            .first()
        )

        if current_message is None:
            raise HTTPException(
                status_code=404,
                detail="Message not found"
            )

        while current_message is not None:

            path.append(current_message)

            if current_message.parent_id is None:
                break

            current_message = (
                db.query(Message)
                .filter(
                    Message.id ==
                    current_message.parent_id
                )
                .first()
            )

        path.reverse()

        return path
    
    finally:
        db.close()

        