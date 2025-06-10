#!/bin/bash

# This script sets up and starts both the frontend and backend for the Cosmic Signature Website

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Start the backend server
echo -e "${BLUE}Starting Python backend server...${NC}"
cd "$SCRIPT_DIR/backend"

# Check if virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo -e "${BLUE}Creating Python virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment and install requirements
source venv/bin/activate
pip install -r requirements.txt
python app.py &
BACKEND_PID=$!

# Wait for backend to initialize
sleep 3
echo -e "${GREEN}Backend server started with PID: $BACKEND_PID${NC}"
echo -e "${GREEN}Backend running at: http://localhost:5000${NC}"

# Start the frontend development server
echo -e "${BLUE}Starting frontend development server...${NC}"
cd "$SCRIPT_DIR"

# Install npm dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing npm dependencies...${NC}"
    npm install
fi

# Start the frontend
npm run dev &
FRONTEND_PID=$!

echo -e "${GREEN}Frontend server starting...${NC}"
echo -e "${GREEN}Frontend will be available at: http://localhost:5173${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${RED}Stopping servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}Servers stopped${NC}"
}

# Set trap to cleanup on exit
trap cleanup EXIT

# Keep script running
echo -e "\n${GREEN}Both servers are running. Press Ctrl+C to stop.${NC}"
wait
