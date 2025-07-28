#!/bin/bash

echo "🔍 BidAlbania Application Status Check"
echo "======================================"

echo ""
echo "📊 PM2 Status:"
echo "--------------"
pm2 status

echo ""
echo "🌐 Port Status:"
echo "--------------"

# Check backend port
echo "🔍 Backend (Port 7700):"
if curl -s http://localhost:7700 > /dev/null; then
    echo "✅ Backend is running"
    curl -s http://localhost:7700
else
    echo "❌ Backend is not responding"
fi

echo ""
echo "🔍 Frontend (Port 8085):"
if curl -s http://localhost:8085 > /dev/null; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend is not responding"
fi

echo ""
echo "📋 Recent PM2 Logs:"
echo "-------------------"
pm2 logs --lines 10

echo ""
echo "🔧 Database Status:"
echo "------------------"
if [ -f "backend/db.sqlite" ]; then
    echo "✅ Database file exists"
    ls -la backend/db.sqlite
else
    echo "❌ Database file not found"
fi

echo ""
echo "📁 Build Status:"
echo "---------------"
if [ -d "frontend/dist" ]; then
    echo "✅ Frontend build exists"
    ls -la frontend/dist/
else
    echo "❌ Frontend build not found"
fi 