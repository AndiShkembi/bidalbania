#!/bin/bash

echo "🔍 Testing CORS and API Connectivity..."
echo "======================================"

# Get server IP
SERVER_IP=$(hostname -I | awk '{print $1}')
echo "Server IP: $SERVER_IP"

echo ""
echo "🌐 Testing Backend API..."
echo "------------------------"

# Test backend directly
echo "🔍 Testing backend on localhost:7700..."
if curl -s http://localhost:7700 > /dev/null; then
    echo "✅ Backend is running on localhost:7700"
    curl -s http://localhost:7700
else
    echo "❌ Backend is not responding on localhost:7700"
fi

echo ""
echo "🔍 Testing backend on $SERVER_IP:7700..."
if curl -s http://$SERVER_IP:7700 > /dev/null; then
    echo "✅ Backend is running on $SERVER_IP:7700"
    curl -s http://$SERVER_IP:7700
else
    echo "❌ Backend is not responding on $SERVER_IP:7700"
fi

echo ""
echo "🌐 Testing Frontend..."
echo "---------------------"

# Test frontend
echo "🔍 Testing frontend on localhost:8085..."
if curl -s http://localhost:8085 > /dev/null; then
    echo "✅ Frontend is running on localhost:8085"
else
    echo "❌ Frontend is not responding on localhost:8085"
fi

echo ""
echo "🔍 Testing frontend on $SERVER_IP:8085..."
if curl -s http://$SERVER_IP:8085 > /dev/null; then
    echo "✅ Frontend is running on $SERVER_IP:8085"
else
    echo "❌ Frontend is not responding on $SERVER_IP:8085"
fi

echo ""
echo "🔍 Testing CORS with preflight request..."
echo "----------------------------------------"

# Test CORS preflight
echo "Testing CORS preflight to localhost:7700..."
curl -H "Origin: http://192.168.1.237:8080" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -v http://localhost:7700/api/requests/all 2>&1 | grep -E "(Access-Control|HTTP)"

echo ""
echo "Testing CORS preflight to $SERVER_IP:7700..."
curl -H "Origin: http://192.168.1.237:8080" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -v http://$SERVER_IP:7700/api/requests/all 2>&1 | grep -E "(Access-Control|HTTP)"

echo ""
echo "Testing CORS preflight from 161.35.211.94..."
curl -H "Origin: http://161.35.211.94:8080" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -v http://localhost:7700/api/requests/all 2>&1 | grep -E "(Access-Control|HTTP)"

echo ""
echo "Testing CORS preflight from bidalbania.al..."
curl -H "Origin: https://bidalbania.al" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -v http://localhost:7700/api/requests/all 2>&1 | grep -E "(Access-Control|HTTP)"

echo ""
echo "🔍 Testing API endpoint..."
echo "-------------------------"

# Test actual API endpoint
echo "Testing API endpoint: /api/requests/all..."
curl -H "Origin: http://192.168.1.237:8080" \
     -H "Content-Type: application/json" \
     -v http://localhost:7700/api/requests/all 2>&1 | head -20

echo ""
echo "📋 PM2 Status:"
echo "--------------"
pm2 status

echo ""
echo "🔧 Troubleshooting Tips:"
echo "------------------------"
echo "1. If CORS fails, check backend CORS configuration"
echo "2. If API doesn't respond, check if backend is running"
echo "3. If frontend doesn't load, check if it's built and running"
echo "4. Check firewall settings: sudo ufw status"
echo "5. Check PM2 logs: pm2 logs" 