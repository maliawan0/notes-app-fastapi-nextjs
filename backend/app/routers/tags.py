"""
Tags endpoints
Handles tag retrieval and statistics
"""

from fastapi import APIRouter, Depends
from bson import ObjectId

from app.dependencies import get_current_user_id
from app.database import get_database
from app.models import TagResponse

router = APIRouter()

@router.get("", response_model=list[TagResponse])
async def get_tags(user_id: str = Depends(get_current_user_id)):
    """
    Get all unique tags and their usage counts for the logged-in user
    Only includes tags from non-archived notes
    """
    db = get_database()
    notes_collection = db["notes"]
    
    # Aggregation pipeline to get unique tags with counts
    pipeline = [
        # Match notes for this user that are not archived
        {
            "$match": {
                "userId": ObjectId(user_id),
                "isArchived": False
            }
        },
        # Unwind tags array to get individual tags
        {"$unwind": "$tags"},
        # Group by tag name and count
        {
            "$group": {
                "_id": "$tags",
                "count": {"$sum": 1}
            }
        },
        # Sort by count descending
        {"$sort": {"count": -1}},
        # Rename fields
        {
            "$project": {
                "_id": 0,
                "name": "$_id",
                "count": 1
            }
        }
    ]
    
    cursor = notes_collection.aggregate(pipeline)
    tags = await cursor.to_list(length=None)
    
    return [TagResponse(name=tag["name"], count=tag["count"]) for tag in tags]

