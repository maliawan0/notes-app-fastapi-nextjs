@echo off
REM Setup script for Windows to create .env file from .env.example
if not exist .env (
    copy .env.example .env
    echo .env file created from .env.example
    echo Please edit .env with your actual configuration values
) else (
    echo .env file already exists
)

