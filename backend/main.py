from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, engine
from models import Base, Message
from schemas import MessageCreate

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

    db_message = Message(
        parent_id=message.parent_id,
        role=message.role,
        content=message.content
    )

    db.add(db_message)
    db.commit()
    db.refresh(db_message)

    return {
        "id": db_message.id,
        "content": db_message.content
    }


@app.get("/messages")
def get_messages():

    db = SessionLocal()

    messages = db.query(Message).all()

    return messages