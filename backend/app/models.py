"""
Pydantic models for request/response validation
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# User Models
class UserSignupRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str

class AuthResponse(BaseModel):
    token: str
    user: UserResponse

# Note Models
class NoteCreateResponse(BaseModel):
    id: str
    title: str
    content: str
    tags: list[str]
    isArchived: bool
    createdAt: datetime
    updatedAt: datetime

class NoteUpdateRequest(BaseModel):
    content: str

class NoteResponse(BaseModel):
    id: str
    title: str
    content: str
    tags: list[str]
    isArchived: bool
    createdAt: datetime
    updatedAt: datetime

# Tag Models
class TagResponse(BaseModel):
    name: str
    count: int

