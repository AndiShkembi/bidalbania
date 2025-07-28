#!/bin/bash

echo "🔍 Testing HTTP Connectivity for BidAlbania..."
echo "============================================="

echo ""
echo "🌐 Testing Domain HTTP Access..."
echo "-------------------------------"

# Test domain access (both HTTP and HTTPS)
echo "🔍 Testing http://bidalbania.al..."
if curl -s http://bidalbania.al > /dev/null; then
    echo "✅ Domain is accessible via HTTP"
    curl -I http://bidalbania.al 2>/dev/null | head -3
else
    echo "❌ Domain is not accessible via HTTP"
fi

echo ""
echo "🔍 Testing https://bidalbania.al..."
if curl -s https://bidalbania.al > /dev/null; then
    echo "✅ Domain is accessible via HTTPS"
    curl -I https://bidalbania.al 2>/dev/null | head -3
else
    echo "❌ Domain is not accessible via HTTPS"
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
echo "🔍 Testing https://www.bidalbania.al..."
if curl -s https://www.bidalbania.al > /dev/null; then
    echo "✅ WWW subdomain is accessible via HTTPS"
    curl -I https://www.bidalbania.al 2>/dev/null | head -3
else
    echo "❌ WWW subdomain is not accessible via HTTPS"
fi

echo ""
echo "🌐 Testing API Endpoints..."
echo "--------------------------"

# Test API endpoints (both HTTP and HTTPS)
echo "🔍 Testing API endpoint: http://bidalbania.al:7700/api/requests/all..."
if curl -s http://bidalbania.al:7700/api/requests/all > /dev/null; then
    echo "✅ API endpoint is accessible via HTTP"
    curl -I http://bidalbania.al:7700/api/requests/all 2>/dev/null | head -3
else
    echo "❌ API endpoint is not accessible via HTTP"
fi

echo ""
echo "🔍 Testing API endpoint: https://bidalbania.al:7700/api/requests/all..."
if curl -s https://bidalbania.al:7700/api/requests/all > /dev/null; then
    echo "✅ API endpoint is accessible via HTTPS"
    curl -I https://bidalbania.al:7700/api/requests/all 2>/dev/null | head -3
else
    echo "❌ API endpoint is not accessible via HTTPS"
fi

echo ""
echo "🔍 Testing backend health: http://bidalbania.al:7700..."
if curl -s http://bidalbania.al:7700 > /dev/null; then
    echo "✅ Backend is accessible via HTTP"
    curl -s http://bidalbania.al:7700
else
    echo "❌ Backend is not accessible via HTTP"
fi

echo ""
echo "🔍 Testing backend health: https://bidalbania.al:7700..."
if curl -s https://bidalbania.al:7700 > /dev/null; then
    echo "✅ Backend is accessible via HTTPS"
    curl -s https://bidalbania.al:7700
else
    echo "❌ Backend is not accessible via HTTPS"
fi

echo ""
echo "🌐 Testing CORS with HTTP..."
echo "----------------------------"

# Test CORS with both HTTP and HTTPS
echo "🔍 Testing CORS preflight from http://bidalbania.al..."
curl -H "Origin: http://bidalbania.al" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -v http://bidalbania.al:7700/api/requests/all 2>&1 | grep -E "(Access-Control|HTTP)" || echo "CORS test failed"

echo ""
echo "🔍 Testing CORS preflight from https://bidalbania.al..."
curl -H "Origin: https://bidalbania.al" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -v https://bidalbania.al:7700/api/requests/all 2>&1 | grep -E "(Access-Control|HTTP)" || echo "CORS test failed"

echo ""
echo "🔍 Testing actual API call from HTTP domain..."
curl -H "Origin: http://bidalbania.al" \
     -H "Content-Type: application/json" \
     -v http://bidalbania.al:7700/api/requests/all 2>&1 | head -10

echo ""
echo "🔍 Testing actual API call from HTTPS domain..."
curl -H "Origin: https://bidalbania.al" \
     -H "Content-Type: application/json" \
     -v https://bidalbania.al:7700/api/requests/all 2>&1 | head -10

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
echo "  - Frontend: https://bidalbania.al (or http://bidalbania.al)"
echo "  - Backend: https://bidalbania.al:7700 (or http://bidalbania.al:7700)"
echo "  - API: https://bidalbania.al:7700/api (or http://bidalbania.al:7700/api)"
echo "  - Protocol will match the frontend protocol automatically" 