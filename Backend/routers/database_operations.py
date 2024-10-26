from fastapi import APIRouter, HTTPException, File, UploadFile
from fastapi.responses import FileResponse, Response
from uuid import uuid4
import os
import shutil
import sqlite3
import json

router = APIRouter()

@router.post("/import-database")
async def import_database(file: UploadFile):
    room_id = str(uuid4())
    db_file = f"chat_rooms/{room_id}.db"
    os.makedirs(os.path.dirname(db_file), exist_ok=True)
    with open(db_file, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"roomId": room_id}

@router.get("/get-database/{room_id}")
async def get_database(room_id: str):
    db_file = f"chat_rooms/{room_id}.db"
    if not os.path.exists(db_file):
        raise HTTPException(status_code=404, detail="Room not found")
    return FileResponse(db_file, filename=f"chat_room_{room_id}.db")

@router.get("/download-chat/{room_id}")
async def download_chat(room_id: str, format: str = 'txt'):
    db_file = f"chat_rooms/{room_id}.db"
    if not os.path.exists(db_file):
        raise HTTPException(status_code=404, detail="Room not found")
    
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    cursor.execute("SELECT username, content, timestamp FROM messages ORDER BY timestamp")
    messages = cursor.fetchall()
    conn.close()
    
    if format == 'txt':
        content = "\n".join([f"{m[2]} - {m[0]}: {m[1]}" for m in messages])
        media_type = "text/plain"
        filename = f"chat_{room_id}.txt"
    elif format == 'json':
        content = json.dumps([{"username": m[0], "content": m[1], "timestamp": m[2]} for m in messages])
        media_type = "application/json"
        filename = f"chat_{room_id}.json"
    else:
        raise HTTPException(status_code=400, detail="Invalid format")
    
    return Response(content=content, media_type=media_type, headers={"Content-Disposition": f"attachment; filename={filename}"})

@router.post("/import-chat/{room_id}")
async def import_chat(room_id: str, file: UploadFile = File(...)):
    db_file = f"chat_rooms/{room_id}.db"
    
    if not os.path.exists(db_file):
        raise HTTPException(status_code=404, detail="Room not found")
    
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    
    try:
        content = await file.read()
        messages = json.loads(content)
        
        for msg in messages:
            cursor.execute(
                "INSERT INTO messages (username, content, timestamp) VALUES (?, ?, ?)",
                (msg['username'], msg['content'], msg['timestamp'])
            )
        
        conn.commit()
        
        cursor.execute("SELECT username, content, timestamp FROM messages ORDER BY timestamp")
        imported_messages = cursor.fetchall()
        
        return {"success": True, "message": "Chat imported successfully", "messages": imported_messages}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to import chat: {str(e)}")
    finally:
        conn.close()
