#!/bin/bash
# Installation script for Active8

echo "🚀 Active8 - Installation Script"
echo "================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+."
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check npm
echo -e "${BLUE}Checking npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

# Check MongoDB
echo -e "${BLUE}Checking MongoDB...${NC}"
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✓ MongoDB installed${NC}"
else
    echo "⚠️  MongoDB not found. Make sure it's running on localhost:27017"
fi

# Install Backend
echo -e "\n${BLUE}Installing Backend Dependencies...${NC}"
cd backend
if [ -d "node_modules" ]; then
    echo "Backend node_modules already exists, skipping..."
else
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Backend dependencies installed${NC}"
    else
        echo "❌ Backend installation failed"
        exit 1
    fi
fi
cd ..

# Install Frontend
echo -e "\n${BLUE}Installing Frontend Dependencies...${NC}"
cd frontend
if [ -d "node_modules" ]; then
    echo "Frontend node_modules already exists, skipping..."
else
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
    else
        echo "❌ Frontend installation failed"
        exit 1
    fi
fi
cd ..

echo -e "\n${GREEN}=================================${NC}"
echo -e "${GREEN}✓ Installation Complete!${NC}"
echo -e "${GREEN}=================================${NC}"

echo -e "\n${BLUE}Next Steps:${NC}"
echo "1. Start MongoDB: brew services start mongodb-community"
echo "2. Backend: cd backend && npm run dev"
echo "3. Frontend: cd frontend && npm run dev"
echo -e "\n${BLUE}Open in browser:${NC}"
echo "http://localhost:5173"
