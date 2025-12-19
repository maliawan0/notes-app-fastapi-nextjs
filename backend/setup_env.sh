#!/bin/bash
# Setup script for Linux/Mac to create .env file from .env.example
if [ ! -f .env ]; then
    cp .env.example .env
    echo ".env file created from .env.example"
    echo "Please edit .env with your actual configuration values"
else
    echo ".env file already exists"
fi

