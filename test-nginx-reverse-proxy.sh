#!/bin/bash

echo "🌐 Testing Nginx Reverse Proxy Configuration..."
echo "=============================================="

echo ""
echo "📋 Step 1: Checking Nginx Status..."
echo "----------------------------------"

# Check if Nginx is running
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx is running"
else
    echo "❌ Nginx is not running"
    echo "Start with: sudo systemctl start nginx"
    exit 1
fi

# Check Nginx configuration
if nginx -t; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has errors"
    exit 1
fi

echo ""
echo "📋 Step 2: Checking Port Availability..."
echo "--------------------------------------"

# Check if ports are open
if netstat -tlnp | grep -q ":80 "; then
    echo "✅ Port 80 is open"
else
    echo "❌ Port 80 is not open"
fi

if netstat -tlnp | grep -q ":443 "; then
    echo "✅ Port 443 is open"
else
    echo "❌ Port 443 is not open"
fi

if netstat -tlnp | grep -q ":7700 "; then
    echo "✅ Port 7700 (backend) is open"
else
    echo "❌ Port 7700 (backend) is not open"
fi

if netstat -tlnp | grep -q ":8085 "; then
    echo "✅ Port 8085 (frontend) is open"
else
    echo "❌ Port 8085 (frontend) is not open"
fi

echo ""
echo "📋 Step 3: Testing HTTP to HTTPS Redirect..."
echo "-------------------------------------------"

# Test HTTP to HTTPS redirect
echo "Testing HTTP to HTTPS redirect..."
if curl -s -I http://bidalbania.al | grep -q "301\|302"; then
    echo "✅ HTTP to HTTPS redirect is working"
else
    echo "❌ HTTP to HTTPS redirect is not working"
fi

echo ""
echo "📋 Step 4: Testing Frontend Proxy..."
echo "-----------------------------------"

# Test frontend proxy
echo "Testing frontend proxy..."
if curl -s -I https://bidalbania.al | grep -q "200"; then
    echo "✅ Frontend proxy is working"
else
    echo "❌ Frontend proxy is not working"
fi

echo ""
echo "📋 Step 5: Testing API Proxy..."
echo "-------------------------------"

# Test API proxy
echo "Testing API proxy..."
if curl -s -I https://bidalbania.al/api/requests/all | grep -q "200\|404"; then
    echo "✅ API proxy is working (got response from backend)"
else
    echo "❌ API proxy is not working"
fi

echo ""
echo "📋 Step 6: Testing CORS Headers..."
echo "--------------------------------"

# Test CORS headers
echo "Testing CORS headers..."
if curl -s -I -H "Origin: https://bidalbania.al" https://bidalbania.al/api/requests/all | grep -q "Access-Control-Allow-Origin"; then
    echo "✅ CORS headers are present"
else
    echo "❌ CORS headers are missing"
fi

echo ""
echo "📋 Step 7: Testing SSL Configuration..."
echo "-------------------------------------"

# Test SSL
echo "Testing SSL configuration..."
if curl -s -I https://bidalbania.al | grep -q "HTTP/2\|HTTP/1.1"; then
    echo "✅ SSL is working"
else
    echo "❌ SSL is not working"
fi

echo ""
echo "📋 Step 8: Browser Testing Instructions..."
echo "----------------------------------------"

echo "🔧 Manual Testing Steps:"
echo ""
echo "1. Open browser: https://bidalbania.al"
echo "2. Check console for: '🚀 Production mode: Using relative URLs with Nginx proxy'"
echo "3. Check Network tab for: '/api/requests/all' calls (relative URLs)"
echo "4. Verify no mixed content errors"
echo "5. Verify no CORS errors"
echo "6. Verify SSL padlock in browser"

echo ""
echo "📋 Step 9: Expected Network Requests..."
echo "-------------------------------------"

echo "✅ Expected Network Tab:"
echo "  • Frontend: https://bidalbania.al/"
echo "  • API calls: https://bidalbania.al/api/requests/all"
echo "  • No port numbers in URLs"
echo "  • All requests over HTTPS"
echo "  • Status 200 for successful requests"

echo ""
echo "📋 Step 10: Troubleshooting..."
echo "-----------------------------"

echo "🔧 If issues occur:"
echo ""
echo "1. Check Nginx logs:"
echo "   tail -f /var/log/nginx/error.log"
echo "   tail -f /var/log/nginx/access.log"
echo ""
echo "2. Check backend logs:"
echo "   pm2 logs bidalbania-backend"
echo ""
echo "3. Check frontend logs:"
echo "   pm2 logs bidalbania-frontend"
echo ""
echo "4. Test backend directly:"
echo "   curl http://localhost:7700/api/requests/all"
echo ""
echo "5. Test frontend directly:"
echo "   curl http://localhost:8085"

echo ""
echo "🎉 Nginx Reverse Proxy Test Complete!"
echo "===================================="
echo ""
echo "✅ Configuration Summary:"
echo "  • Frontend: https://bidalbania.al → localhost:8085"
echo "  • API: https://bidalbania.al/api → localhost:7700/api"
echo "  • SSL: Handled by Nginx"
echo "  • CORS: Configured for domain"
echo "  • Relative URLs: /api instead of full URLs"
echo ""
echo "✅ Benefits:"
echo "  • No more mixed content errors"
echo "  • No more SSL protocol errors"
echo "  • Clean relative URLs"
echo "  • Centralized SSL management"
echo "  • Better security and performance" 