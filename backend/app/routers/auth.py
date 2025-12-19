"""
Authentication endpoints
Handles user signup, login, logout, and profile retrieval
"""

from fastapi import APIRouter, HTTPException, Depends, status
from bson import ObjectId
from datetime import datetime

from app.models import UserSignupRequest, UserLoginRequest, UserResponse, AuthResponse
from app.database import get_database
from app.auth import get_password_hash, verify_password, create_access_token
from app.dependencies import get_current_user_id

router = APIRouter()

@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserSignupRequest):
    """
    Register a new user
    """
    db = get_database()
    users_collection = db["users"]
    
    # Check if user with this email already exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user document
    user_doc = {
        "name": user_data.name,
        "email": user_data.email,
        "password": hashed_password,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    # Insert user
    result = await users_collection.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # Generate JWT token
    token = create_access_token(data={"sub": user_id})
    
    # Return response
    return AuthResponse(
        token=token,
        user=UserResponse(
            id=user_id,
            name=user_data.name,
            email=user_data.email
        )
    )

@router.post("/login", response_model=AuthResponse)
async def login(credentials: UserLoginRequest):
    """
    Log in an existing user
    """
    db = get_database()
    users_collection = db["users"]
    
    # Find user by email
    user = await users_collection.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Generate JWT token
    user_id = str(user["_id"])
    token = create_access_token(data={"sub": user_id})
    
    # Return response
    return AuthResponse(
        token=token,
        user=UserResponse(
            id=user_id,
            name=user["name"],
            email=user["email"]
        )
    )

@router.post("/logout")
async def logout():
    """
    Log out a user (client-side token removal)
    """
    return {"message": "Logout successful"}

@router.get("/me", response_model=UserResponse)
async def get_current_user(user_id: str = Depends(get_current_user_id)):
    """
    Get the current logged-in user's profile
    """
    db = get_database()
    users_collection = db["users"]
    
    # Find user by ID
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"]
    )

