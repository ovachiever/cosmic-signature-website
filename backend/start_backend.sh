#!/bin/bash

# Install required packages
pip install -r requirements.txt

# Start the Flask backend
echo "Starting Flask backend on port 5000..."
python app.py
