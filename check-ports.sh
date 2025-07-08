#!/bin/bash

echo "🔍 Checking BidAlbania Application Ports..."
echo "=========================================="

echo ""
echo "📊 Checking if ports 8080 and 5000 are in use:"
echo "----------------------------------------------"

# Check port 8080 (Frontend)
echo "🔍 Checking port 8080 (Frontend):"
if lsof -i :8080 > /dev/null 2>&1; then
    echo "✅ Port 8080 is in use by:"
    lsof -i :8080
else
    echo "❌ Port 8080 is NOT in use"
fi

echo ""

# Check port 5000 (Backend)
echo "🔍 Checking port 5000 (Backend):"
if lsof -i :5000 > /dev/null 2>&1; then
    echo "✅ Port 5000 is in use by:"
    lsof -i :5000
else
    echo "❌ Port 5000 is NOT in use"
fi

echo ""
echo "📊 PM2 Status:"
echo "--------------"
pm2 status

echo ""
echo "📋 PM2 Logs (last 20 lines):"
echo "----------------------------"
pm2 logs --lines 20

echo ""
echo "🌐 Network Interface Information:"
echo "--------------------------------"
echo "Server IP addresses:"
ip addr show | grep "inet " | grep -v 127.0.0.1

echo ""
echo "🔧 Troubleshooting Steps:"
echo "------------------------"
echo "1. Make sure PM2 is running: pm2 status"
echo "2. Check if frontend is built: ls -la frontend/dist/"
echo "3. Restart applications: pm2 restart all"
echo "4. Check firewall: sudo ufw status"
echo "5. Test local access: curl http://localhost:8080"
echo "6. Check server logs: pm2 logs bidalbania-frontend" 