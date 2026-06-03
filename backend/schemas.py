from pydantic import BaseModel

class MessageCreate(BaseModel):
    parent_id: int | None = None
    role: str
    content: str