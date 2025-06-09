#!/bin/bash

# This script sets up and starts both the frontend and backend for the Cosmic Signature Website

# Start the backend server
echo "Starting Python backend server..."
cd /home/ubuntu/cosmic-github/backend
pip install -r requirements.txt
python app.py &
BACKEND_PID=$!

# Wait for backend to initialize
sleep 3
echo "Backend server started with PID: $BACKEND_PID"

# Start the frontend development server
echo "Starting frontend development server..."
cd /home/ubuntu/cosmic-github
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID; echo 'Servers stopped'" EXIT
