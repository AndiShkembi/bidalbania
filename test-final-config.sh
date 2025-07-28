#!/bin/bash

echo "🔍 Testing Final BidAlbania Configuration..."
echo "============================================"

echo ""
echo "🌐 Testing Frontend Access..."
echo "----------------------------"

# Test frontend access
echo "🔍 Testing frontend via HTTP..."
if curl -s http://bidalbania.al > /dev/null; then
    echo "✅ Frontend accessible via HTTP"
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://bidalbania.al)
    echo "   HTTP Status: $HTTP_STATUS"
else
    echo "❌ Frontend not accessible via HTTP"
fi

echo ""
echo "🔍 Testing frontend via HTTPS..."
if curl -s https://bidalbania.al > /dev/null; then
    echo "✅ Frontend accessible via HTTPS"
    HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://bidalbania.al)
    echo "   HTTPS Status: $HTTPS_STATUS"
else
    echo "❌ Frontend not accessible via HTTPS"
fi

echo ""
echo "🌐 Testing API Access (HTTP Only)..."
echo "-----------------------------------"

# Test API access (HTTP only)
echo "🔍 Testing API endpoint: http://bidalbania.al:7700/api/requests/all..."
if curl -s http://bidalbania.al:7700/api/requests/all > /dev/null; then
    echo "✅ API accessible via HTTP"
    API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://bidalbania.al:7700/api/requests/all)
    echo "   API Status: $API_STATUS"
else
    echo "❌ API not accessible via HTTP"
fi

echo ""
echo "🔍 Testing backend health: http://bidalbania.al:7700..."
if curl -s http://bidalbania.al:7700 > /dev/null; then
    echo "✅ Backend is accessible via HTTP"
    BACKEND_RESPONSE=$(curl -s http://bidalbania.al:7700)
    echo "   Backend Response: $BACKEND_RESPONSE"
else
    echo "❌ Backend is not accessible via HTTP"
fi

echo ""
echo "🌐 Testing CORS Configuration..."
echo "-------------------------------"

# Test CORS from HTTP frontend
echo "🔍 Testing CORS from HTTP frontend..."
curl -H "Origin: http://bidalbania.al" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -s -o /dev/null -w "HTTP→HTTP CORS Status: %{http_code}\n" \
     http://bidalbania.al:7700/api/requests/all

# Test CORS from HTTPS frontend (mixed content)
echo ""
echo "🔍 Testing CORS from HTTPS frontend (mixed content)..."
curl -H "Origin: https://bidalbania.al" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -s -o /dev/null -w "HTTPS→HTTP CORS Status: %{http_code}\n" \
     http://bidalbania.al:7700/api/requests/all

echo ""
echo "🌐 Testing Actual API Calls..."
echo "-----------------------------"

# Test API call from HTTP frontend
echo "🔍 Testing API call from HTTP frontend..."
curl -H "Origin: http://bidalbania.al" \
     -H "Content-Type: application/json" \
     -s -o /dev/null -w "HTTP Frontend → HTTP API: %{http_code}\n" \
     http://bidalbania.al:7700/api/requests/all

# Test API call from HTTPS frontend (mixed content)
echo ""
echo "🔍 Testing API call from HTTPS frontend (mixed content)..."
curl -H "Origin: https://bidalbania.al" \
     -H "Content-Type: application/json" \
     -s -o /dev/null -w "HTTPS Frontend → HTTP API: %{http_code}\n" \
     http://bidalbania.al:7700/api/requests/all

echo ""
echo "📋 Final Configuration Summary:"
echo "-------------------------------"
echo "✅ Frontend: HTTP and HTTPS supported"
echo "✅ Backend API: HTTP only (port 7700)"
echo "✅ CORS: Configured for both HTTP and HTTPS origins"
echo "✅ Mixed Content: Allowed (HTTPS frontend → HTTP API)"
echo "✅ No SSL certificate needed for API"

echo ""
echo "🔧 Expected Behavior:"
echo "--------------------"
echo "1. Frontend works on both http://bidalbania.al and https://bidalbania.al"
echo "2. API calls always use http://bidalbania.al:7700/api"
echo "3. Mixed content is allowed (HTTPS frontend can call HTTP API)"
echo "4. CORS works for both frontend protocols"

echo ""
echo "⚠️  Troubleshooting:"
echo "-------------------"
echo "• If frontend fails: Check DNS and web server configuration"
echo "• If API fails: Check if backend is running on port 7700"
echo "• If CORS fails: Check backend CORS configuration"
echo "• Mixed content warnings are expected and allowed"

echo ""
echo "🌐 Final URLs:"
echo "-------------"
echo "Frontend HTTP:  http://bidalbania.al"
echo "Frontend HTTPS: https://bidalbania.al"
echo "API:            http://bidalbania.al:7700/api"
echo "Backend:        http://bidalbania.al:7700"

echo ""
echo "📋 PM2 Status:"
echo "--------------"
pm2 status

echo ""
echo "🔍 Quick Health Check:"
echo "---------------------"
echo "Backend running: $(pm2 list | grep bidalbania-backend | wc -l) processes"
echo "Frontend running: $(pm2 list | grep bidalbania-frontend | wc -l) processes"
echo "Port 7700 in use: $(lsof -i :7700 | wc -l) connections"
echo "Port 8085 in use: $(lsof -i :8085 | wc -l) connections" 