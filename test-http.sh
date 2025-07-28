#!/bin/bash

echo "🔍 Testing HTTP Connectivity for BidAlbania..."
echo "============================================="

echo ""
echo "🌐 Testing Domain HTTP Access..."
echo "-------------------------------"

# Test domain HTTP access
echo "🔍 Testing http://bidalbania.al..."
if curl -s http://bidalbania.al > /dev/null; then
    echo "✅ Domain is accessible via HTTP"
    curl -I http://bidalbania.al 2>/dev/null | head -3
else
    echo "❌ Domain is not accessible via HTTP"
fi

echo ""
echo "🔍 Testing http://www.bidalbania.al..."
if curl -s http://www.bidalbania.al > /dev/null; then
    echo "✅ WWW subdomain is accessible via HTTP"
    curl -I http://www.bidalbania.al 2>/dev/null | head -3
else
    echo "❌ WWW subdomain is not accessible via HTTP"
fi

echo ""
echo "🌐 Testing API Endpoints..."
echo "--------------------------"

# Test API endpoints
echo "🔍 Testing API endpoint: http://bidalbania.al:7700/api/requests/all..."
if curl -s http://bidalbania.al:7700/api/requests/all > /dev/null; then
    echo "✅ API endpoint is accessible"
    curl -I http://bidalbania.al:7700/api/requests/all 2>/dev/null | head -3
else
    echo "❌ API endpoint is not accessible"
fi

echo ""
echo "🔍 Testing backend health: http://bidalbania.al:7700..."
if curl -s http://bidalbania.al:7700 > /dev/null; then
    echo "✅ Backend is accessible"
    curl -s http://bidalbania.al:7700
else
    echo "❌ Backend is not accessible"
fi

echo ""
echo "🌐 Testing CORS with HTTP..."
echo "----------------------------"

# Test CORS with HTTP
echo "🔍 Testing CORS preflight from http://bidalbania.al..."
curl -H "Origin: http://bidalbania.al" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -v http://bidalbania.al:7700/api/requests/all 2>&1 | grep -E "(Access-Control|HTTP)" || echo "CORS test failed"

echo ""
echo "🔍 Testing actual API call from domain..."
curl -H "Origin: http://bidalbania.al" \
     -H "Content-Type: application/json" \
     -v http://bidalbania.al:7700/api/requests/all 2>&1 | head -10

echo ""
echo "📋 PM2 Status:"
echo "--------------"
pm2 status

echo ""
echo "🔧 Troubleshooting Tips:"
echo "------------------------"
echo "1. Make sure DNS points to your server IP"
echo "2. Check if port 7700 is open in firewall"
echo "3. Verify PM2 is running: pm2 status"
echo "4. Check PM2 logs: pm2 logs bidalbania-backend"
echo "5. Test local API: curl http://localhost:7700"
echo ""
echo "🌐 Expected URLs:"
echo "  - Frontend: http://bidalbania.al"
echo "  - Backend: http://bidalbania.al:7700"
echo "  - API: http://bidalbania.al:7700/api" 