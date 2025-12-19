"""
Notes endpoints
Handles CRUD operations for notes
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from bson import ObjectId
from datetime import datetime
from typing import Optional

from app.dependencies import get_current_user_id
from app.database import get_database
from app.models import NoteResponse, NoteUpdateRequest, NoteCreateResponse
from app.utils import extract_tags, extract_title

router = APIRouter()

@router.get("", response_model=list[NoteResponse])
async def get_notes(
    user_id: str = Depends(get_current_user_id),
    search: Optional[str] = Query(None, description="Search query for note content"),
    tag: Optional[str] = Query(None, description="Filter by tag name"),
    isArchived: Optional[bool] = Query(False, description="Filter by archive status")
):
    """
    Get all notes for the logged-in user
    Supports search and tag filtering
    """
    db = get_database()
    notes_collection = db["notes"]
    
    # Build query filter
    query: dict = {"userId": ObjectId(user_id)}
    
    # Filter by archive status (default to non-archived)
    query["isArchived"] = isArchived
    
    # If tag filter is provided, include notes that have this tag
    if tag:
        query["tags"] = tag.lower()
    
    # Fetch notes
    cursor = notes_collection.find(query).sort("updatedAt", -1)
    notes = await cursor.to_list(length=None)
    
    # If search query is provided, filter by content
    if search:
        search_lower = search.lower()
        notes = [
            note for note in notes
            if search_lower in note.get("content", "").lower() or 
               search_lower in note.get("title", "").lower() or
               any(search_lower in tag.lower() for tag in note.get("tags", []))
        ]
    
    # Convert to response format
    return [
        NoteResponse(
            id=str(note["_id"]),
            title=note.get("title", "Untitled Note"),
            content=note.get("content", ""),
            tags=note.get("tags", []),
            isArchived=note.get("isArchived", False),
            createdAt=note.get("createdAt", datetime.utcnow()),
            updatedAt=note.get("updatedAt", datetime.utcnow())
        )
        for note in notes
    ]

@router.post("", response_model=NoteCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_note(user_id: str = Depends(get_current_user_id)):
    """
    Create a new, empty note
    """
    db = get_database()
    notes_collection = db["notes"]
    
    now = datetime.utcnow()
    note_doc = {
        "userId": ObjectId(user_id),
        "title": "",
        "content": "",
        "tags": [],
        "isArchived": False,
        "createdAt": now,
        "updatedAt": now
    }
    
    result = await notes_collection.insert_one(note_doc)
    note_id = str(result.inserted_id)
    
    return NoteCreateResponse(
        id=note_id,
        title="",
        content="",
        tags=[],
        isArchived=False,
        createdAt=now,
        updatedAt=now
    )

@router.put("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: str,
    note_data: NoteUpdateRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Update a note's content (auto-save)
    Automatically extracts title and tags from content
    """
    db = get_database()
    notes_collection = db["notes"]
    
    # Verify note exists and belongs to user
    note = await notes_collection.find_one({
        "_id": ObjectId(note_id),
        "userId": ObjectId(user_id)
    })
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    # Extract title and tags from content
    title = extract_title(note_data.content)
    tags = extract_tags(note_data.content)
    
    # Update note
    update_doc = {
        "$set": {
            "content": note_data.content,
            "title": title,
            "tags": tags,
            "updatedAt": datetime.utcnow()
        }
    }
    
    await notes_collection.update_one(
        {"_id": ObjectId(note_id)},
        update_doc
    )
    
    # Fetch updated note
    updated_note = await notes_collection.find_one({"_id": ObjectId(note_id)})
    
    return NoteResponse(
        id=str(updated_note["_id"]),
        title=updated_note.get("title", "Untitled Note"),
        content=updated_note.get("content", ""),
        tags=updated_note.get("tags", []),
        isArchived=updated_note.get("isArchived", False),
        createdAt=updated_note.get("createdAt", datetime.utcnow()),
        updatedAt=updated_note.get("updatedAt", datetime.utcnow())
    )

@router.put("/{note_id}/archive")
async def archive_note(
    note_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """
    Archive a note
    """
    db = get_database()
    notes_collection = db["notes"]
    
    # Verify note exists and belongs to user
    note = await notes_collection.find_one({
        "_id": ObjectId(note_id),
        "userId": ObjectId(user_id)
    })
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    # Update note to archived
    await notes_collection.update_one(
        {"_id": ObjectId(note_id)},
        {"$set": {"isArchived": True, "updatedAt": datetime.utcnow()}}
    )
    
    return {"message": "Note archived"}

@router.put("/{note_id}/restore")
async def restore_note(
    note_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """
    Restore a note from the archive
    """
    db = get_database()
    notes_collection = db["notes"]
    
    # Verify note exists and belongs to user
    note = await notes_collection.find_one({
        "_id": ObjectId(note_id),
        "userId": ObjectId(user_id)
    })
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    # Update note to not archived
    await notes_collection.update_one(
        {"_id": ObjectId(note_id)},
        {"$set": {"isArchived": False, "updatedAt": datetime.utcnow()}}
    )
    
    return {"message": "Note restored"}

@router.delete("/{note_id}")
async def delete_note(
    note_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """
    Permanently delete a note (must be archived first)
    """
    db = get_database()
    notes_collection = db["notes"]
    
    # Verify note exists and belongs to user
    note = await notes_collection.find_one({
        "_id": ObjectId(note_id),
        "userId": ObjectId(user_id)
    })
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    # Check if note is archived (optional requirement from plan)
    if not note.get("isArchived", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Note must be archived before deletion"
        )
    
    # Delete note
    await notes_collection.delete_one({"_id": ObjectId(note_id)})
    
    return {"message": "Note permanently deleted"}

