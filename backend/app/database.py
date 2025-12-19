"""
Database connection and utilities
Handles MongoDB Atlas connection using Motor async driver
"""

from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

# Global database client
client: Optional[AsyncIOMotorClient] = None
database = None

async def connect_to_mongo():
    """Connect to MongoDB Atlas"""
    global client, database
    mongodb_uri = os.getenv("MONGODB_URI")
    
    if not mongodb_uri:
        raise ValueError("MONGODB_URI environment variable is not set")
    
    client = AsyncIOMotorClient(mongodb_uri)
    # Extract database name from URI or use default
    # Format: mongodb+srv://.../database_name?options
    # If no database name in URI, use "quicknote" as default
    uri_parts = mongodb_uri.split("/")
    if len(uri_parts) > 3 and uri_parts[3]:
        # Check if there's a database name before the query string
        db_part = uri_parts[3].split("?")[0]
        database_name = db_part if db_part else "quicknote"
    else:
        database_name = "quicknote"
    database = client[database_name]
    
    # Test the connection
    try:
        await client.admin.command("ping")
        print(f"✅ Successfully connected to MongoDB Atlas (database: {database_name})")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close MongoDB connection"""
    global client
    if client:
        client.close()
        print("✅ MongoDB connection closed")

def get_database():
    """Get the database instance"""
    if database is None:
        raise RuntimeError("Database not initialized. Call connect_to_mongo() first.")
    return database

