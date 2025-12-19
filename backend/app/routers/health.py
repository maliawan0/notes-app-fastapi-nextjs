"""
Health check endpoint
Verifies database connectivity
"""

from fastapi import APIRouter, HTTPException
from app.database import get_database

router = APIRouter()

@router.get("/healthz")
async def health_check():
    """
    Health check endpoint
    Returns the status of the API and database connection
    """
    try:
        db = get_database()
        # Ping the database to check connectivity
        await db.client.admin.command("ping")
        return {
            "status": "ok",
            "db_connection": "successful"
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Database connection failed: {str(e)}"
        )

