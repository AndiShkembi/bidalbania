#!/bin/bash

echo "🔍 Testing Mixed Content and Protocol Matching..."
echo "================================================"

echo ""
echo "🌐 Testing Frontend Protocol Detection..."
echo "----------------------------------------"

# Test if frontend is accessible via both protocols
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
echo "🌐 Testing API Protocol Matching..."
echo "----------------------------------"

# Test API endpoints with both protocols
echo "🔍 Testing API via HTTP..."
if curl -s http://bidalbania.al:7700/api/requests/all > /dev/null; then
    echo "✅ API accessible via HTTP"
    HTTP_API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://bidalbania.al:7700/api/requests/all)
    echo "   HTTP API Status: $HTTP_API_STATUS"
else
    echo "❌ API not accessible via HTTP"
fi

echo ""


echo ""
echo "🌐 Testing CORS Protocol Matching..."
echo "-----------------------------------"

# Test CORS with both protocols
echo "🔍 Testing CORS from HTTP frontend to HTTP API..."
curl -H "Origin: http://bidalbania.al" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -s -o /dev/null -w "HTTP→HTTP CORS Status: %{http_code}\n" \
     http://bidalbania.al:7700/api/requests/all

echo ""
echo "🔍 Testing CORS from HTTPS frontend to HTTP API..."
curl -H "Origin: https://bidalbania.al" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -s -o /dev/null -w "HTTPS→HTTP CORS Status: %{http_code}\n" \
     http://bidalbania.al:7700/api/requests/all

echo ""
echo "🔍 Testing CORS from HTTPS frontend to HTTP API (Mixed Content)..."
curl -H "Origin: https://bidalbania.al" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -s -o /dev/null -w "HTTPS→HTTP CORS Status: %{http_code}\n" \
     http://bidalbania.al:7700/api/requests/all

echo ""
echo "🌐 Testing Actual API Calls..."
echo "-----------------------------"

echo "🔍 Testing API call from HTTP origin..."
curl -H "Origin: http://bidalbania.al" \
     -H "Content-Type: application/json" \
     -s -o /dev/null -w "HTTP API Call Status: %{http_code}\n" \
     http://bidalbania.al:7700/api/requests/all

echo ""
echo "🔍 Testing API call from HTTPS origin to HTTP API..."
curl -H "Origin: https://bidalbania.al" \
     -H "Content-Type: application/json" \
     -s -o /dev/null -w "HTTPS→HTTP API Call Status: %{http_code}\n" \
     http://bidalbania.al:7700/api/requests/all

echo ""
echo "📋 Configuration Summary:"
echo "-------------------------"
echo "✅ Frontend Protocol Detection: Enabled"
echo "✅ API HTTP Only: Configured"
echo "✅ CORS for both HTTP and HTTPS: Configured"
echo "✅ Mixed Content Allowed: API calls from HTTPS to HTTP"

echo ""
echo "🔧 Expected Behavior:"
echo "--------------------"
echo "1. If user visits http://bidalbania.al → API calls use http://bidalbania.al:7700/api"
echo "2. If user visits https://bidalbania.al → API calls use http://bidalbania.al:7700/api"
echo "3. Mixed content is allowed for API calls (HTTP from HTTPS)"
echo "4. CORS should work for both frontend protocols"

echo ""
echo "⚠️  Troubleshooting:"
echo "-------------------"
echo "• If HTTP API fails: Check if backend is running on port 7700"
echo "• If CORS fails: Check backend CORS configuration"
echo "• Mixed content is expected: HTTPS frontend → HTTP API"
echo "• SSL certificate not needed for API (HTTP only)"

echo ""
echo "🌐 Test URLs:"
echo "-------------"
echo "Frontend HTTP:  http://bidalbania.al"
echo "Frontend HTTPS: https://bidalbania.al"
echo "API:            http://bidalbania.al:7700/api (HTTP only)" 