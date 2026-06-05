from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, engine
from models import Base, Message
from schemas import MessageCreate

def fake_ai_response(user_message: str):

    return (
        "Fake AI says: "
        + user_message
    )

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

        ai_message = Message(
            parent_id=user_message.id,
            role="assistant",
            content=fake_ai_response(
                user_message.content
            )
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

        