#!/bin/bash

echo "🚀 Starting BidAlbania Development Environment..."
echo "==============================================="

echo ""
echo "📋 Step 1: Checking Ports..."
echo "---------------------------"

# Check if ports are available
if lsof -i :7700 > /dev/null 2>&1; then
    echo "❌ Port 7700 is already in use"
    echo "   Please stop the backend service first"
    exit 1
else
    echo "✅ Port 7700 is available"
fi

if lsof -i :8080 > /dev/null 2>&1; then
    echo "❌ Port 8080 is already in use"
    echo "   Please stop the frontend service first"
    exit 1
else
    echo "✅ Port 8080 is available"
fi

echo ""
echo "📋 Step 2: Starting Backend..."
echo "-----------------------------"

# Start backend
echo "🔧 Starting backend on port 7700..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Check if backend started successfully
if lsof -i :7700 > /dev/null 2>&1; then
    echo "✅ Backend started successfully on port 7700"
else
    echo "❌ Backend failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "📋 Step 3: Starting Frontend..."
echo "------------------------------"

# Start frontend
echo "🔧 Starting frontend on port 8080..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait a moment for frontend to start
sleep 5

# Check if frontend started successfully
if lsof -i :8080 > /dev/null 2>&1; then
    echo "✅ Frontend started successfully on port 8080"
else
    echo "❌ Frontend failed to start"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "📋 Step 4: Testing Services..."
echo "----------------------------"

# Test backend API
echo "🔍 Testing backend API..."
if curl -s http://localhost:7700/api > /dev/null; then
    echo "✅ Backend API is responding"
else
    echo "❌ Backend API is not responding"
fi

# Test frontend
echo "🔍 Testing frontend..."
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Frontend is responding"
else
    echo "❌ Frontend is not responding"
fi

echo ""
echo "🎉 Development Environment Started!"
echo "=================================="
echo ""
echo "🌐 Your application is now available at:"
echo "  - Frontend: http://localhost:8080"
echo "  - Backend:  http://localhost:7700"
echo "  - API:      http://localhost:7700/api"
echo ""
echo "✅ Expected Behavior:"
echo "  • No SSL errors"
echo "  • No mixed content errors"
echo "  • API calls work correctly"
echo "  • CSP skips localhost"
echo ""
echo "🔧 Console Messages to Look For:"
echo "  • '🔧 Development mode: Using localhost API'"
echo "  • 'CSP: Skipping HTTPS upgrade for local/development'"
echo "  • 'API URL configured as: http://localhost:7700/api'"
echo ""
echo "📋 Useful Commands:"
echo "  - Stop services: Ctrl+C"
echo "  - View backend logs: cd backend && npm start"
echo "  - View frontend logs: cd frontend && npm run dev"
echo "  - Test API: curl http://localhost:7700/api"
echo ""
echo "⚠️  To Stop Services:"
echo "  Press Ctrl+C in this terminal"
echo "  Or run: kill $BACKEND_PID $FRONTEND_PID"

# Wait for user to stop
echo ""
echo "🔄 Services are running. Press Ctrl+C to stop..."
wait 