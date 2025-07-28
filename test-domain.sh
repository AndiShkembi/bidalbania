#!/bin/bash

echo "🔍 Testing BidAlbania Domain Connectivity..."
echo "==========================================="

echo ""
echo "🌐 Testing Domain CORS..."
echo "------------------------"

# Test CORS preflight from domain
echo "🔍 Testing CORS preflight from http://bidalbania.al..."
curl -H "Origin: http://bidalbania.al" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -v http://localhost:7700/api/requests/all 2>&1 | grep -E "(Access-Control|HTTP)"

echo ""
echo "🔍 Testing CORS preflight from http://www.bidalbania.al..."
curl -H "Origin: http://www.bidalbania.al" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -v http://localhost:7700/api/requests/all 2>&1 | grep -E "(Access-Control|HTTP)"

echo ""
echo "🔍 Testing CORS preflight from http://bidalbania.al:7700..."
curl -H "Origin: http://bidalbania.al:7700" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -v http://localhost:7700/api/requests/all 2>&1 | grep -E "(Access-Control|HTTP)"

echo ""
echo "🌐 Testing API Endpoints..."
echo "--------------------------"

# Test actual API calls
echo "🔍 Testing API endpoint with domain origin..."
curl -H "Origin: http://bidalbania.al" \
     -H "Content-Type: application/json" \
     -v http://localhost:7700/api/requests/all 2>&1 | head -20

echo ""
echo "🔍 Testing API endpoint with www subdomain origin..."
curl -H "Origin: http://www.bidalbania.al" \
     -H "Content-Type: application/json" \
     -v http://localhost:7700/api/requests/all 2>&1 | head -20

echo ""
echo "🌐 Testing Domain Resolution..."
echo "------------------------------"

# Test domain resolution
echo "🔍 Testing bidalbania.al resolution..."
nslookup bidalbania.al 2>/dev/null || echo "nslookup not available"

echo ""
echo "🔍 Testing www.bidalbania.al resolution..."
nslookup www.bidalbania.al 2>/dev/null || echo "nslookup not available"

echo ""
echo "🌐 Testing HTTPS Connectivity..."
echo "-------------------------------"

# Test HTTP connectivity
echo "🔍 Testing HTTP connection to bidalbania.al..."
curl -I http://bidalbania.al 2>/dev/null | head -5 || echo "HTTP connection failed"

echo ""
echo "🔍 Testing HTTP connection to www.bidalbania.al..."
curl -I http://www.bidalbania.al 2>/dev/null | head -5 || echo "HTTP connection failed"

echo ""
echo "📋 PM2 Status:"
echo "--------------"
pm2 status

echo ""
echo "🔧 Troubleshooting Tips:"
echo "------------------------"
echo "1. Make sure domain DNS points to your server IP"
echo "2. Check if port 7700 is open in firewall"
echo "3. Verify SSL certificate is valid"
echo "4. Check PM2 logs: pm2 logs bidalbania-backend"
echo "5. Test local API: curl http://localhost:7700"
echo ""
echo "🌐 Expected Configuration:"
echo "  - Frontend: http://bidalbania.al"
echo "  - Backend API: http://bidalbania.al:7700/api"
echo "  - CORS: Allowed from bidalbania.al domains" 