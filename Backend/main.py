from fastapi import FastAPI, HTTPException, Depends, WebSocket, status, Body
from sqlalchemy.orm import Session
from pydantic import BaseModel
from uuid import uuid4
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
from utils import generate_random_username
from routers import ws
import db
from routers import database_operations
import os

from db import Room, SessionLocal, engine

# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify certain domains instead of "*" to restrict access
    allow_credentials=True,
    allow_methods=["*"],  # ["GET", "POST"] if you want to restrict
    allow_headers=["*"],  # ["Authorization", "Content-Type"] if you want to restrict
)
app.include_router(ws.router)
app.include_router(database_operations.router, prefix="/database")

# Create a database session
get_db = db.get_db
@app.on_event("startup")
async def startup_event():
    app.state.ws_manager = ws.ConnectionManager()
# Password encryption context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Models
class CreateRoom(BaseModel):
    password: str

class JoinRoom(BaseModel):
    roomId: str
    password: str

# 1. Room Creation with SQLite storage
@app.post("/create-room/")
async def create_room(room: CreateRoom, db: Session = Depends(get_db)):
    room_id = str(uuid4())  # Generate a unique room ID
    hashed_password = pwd_context.hash(room.password)  # Hash the password

    # Create a new room entry
    db_room = Room(roomId=room_id, password_hash=hashed_password)
    db.add(db_room)
    db.commit()
    db.refresh(db_room)

    return {"roomId": db_room.roomId}

# 2. Join Room by checking the password from SQLite
@app.post("/join-room/")
async def join_room(join: JoinRoom, db: Session = Depends(get_db)):
    db_room = db.query(Room).filter(Room.roomId == join.roomId).first()
    if db_room is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"success": False, "error": "Room not found"}
        )

    if not pwd_context.verify(join.password, db_room.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "error": "Invalid password"}
        )

    return {"success": True, "roomId": db_room.roomId}

@app.post("/change-username/{room_id}")
async def change_username(room_id: str, new_username: str = Body(..., embed=True)):
    try:
        conn = get_temp_db_connection(room_id)
        cursor = conn.cursor()
        cursor.execute("UPDATE messages SET username = ? WHERE room_id = ?", (new_username, room_id))
        conn.commit()
        conn.close()

        return {"success": True, "message": "Username changed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to change username: {str(e)}")

@app.delete("/delete-room/{room_id}")
async def delete_room(room_id: str, db: Session = Depends(get_db)):
    try:
        # Delete the temporary room database
        db_file = f"chat_rooms/{room_id}.db"
        if os.path.exists(db_file):
            os.remove(db_file)
        
        # Delete the room entry from the main database
        db_room = db.query(Room).filter(Room.roomId == room_id).first()
        if db_room:
            db.delete(db_room)
            db.commit()
        
        return {"success": True, "message": "Room deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete room: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print(f"Starting server on http://0.0.0.0:8000")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
