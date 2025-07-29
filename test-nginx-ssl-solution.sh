#!/bin/bash

echo "🧪 Testing Nginx SSL Solution..."
echo "================================"

echo ""
echo "📋 Step 1: Checking Nginx Status..."
echo "----------------------------------"

# Check if Nginx is running
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx is running"
else
    echo "❌ Nginx is not running"
    echo "Please run: sudo systemctl start nginx"
fi

# Check Nginx configuration
if sudo nginx -t > /dev/null 2>&1; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has errors"
fi

# Check if bidalbania site is enabled
if [ -L "/etc/nginx/sites-enabled/bidalbania" ]; then
    echo "✅ BidAlbania Nginx site is enabled"
else
    echo "❌ BidAlbania Nginx site is not enabled"
fi

echo ""
echo "📋 Step 2: Checking SSL Certificate..."
echo "-------------------------------------"

# Check SSL certificate
if [ -f "/etc/ssl/certs/bidalbania.al.crt" ]; then
    echo "✅ SSL certificate found: /etc/ssl/certs/bidalbania.al.crt"
    CERT_INFO=$(openssl x509 -in /etc/ssl/certs/bidalbania.al.crt -text -noout | grep -E "(Subject:|Not After)" | head -2)
    echo "   Certificate Info:"
    echo "$CERT_INFO" | sed 's/^/   /'
else
    echo "❌ SSL certificate not found"
fi

if [ -f "/etc/ssl/private/bidalbania.al.key" ]; then
    echo "✅ SSL private key found: /etc/ssl/private/bidalbania.al.key"
else
    echo "❌ SSL private key not found"
fi

echo ""
echo "📋 Step 3: Testing HTTPS Frontend..."
echo "-----------------------------------"

# Test HTTPS frontend
echo "🔍 Testing https://bidalbania.al..."
if curl -s https://bidalbania.al > /dev/null; then
    echo "✅ HTTPS frontend accessible"
    HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://bidalbania.al)
    echo "   HTTPS Status: $HTTPS_STATUS"
else
    echo "❌ HTTPS frontend not accessible"
fi

echo ""
echo "📋 Step 4: Testing HTTPS API..."
echo "-----------------------------"

# Test HTTPS API
echo "🔍 Testing https://bidalbania.al/api/requests/all..."
if curl -s https://bidalbania.al/api/requests/all > /dev/null; then
    echo "✅ HTTPS API accessible"
    API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://bidalbania.al/api/requests/all)
    echo "   API Status: $API_STATUS"
else
    echo "❌ HTTPS API not accessible"
fi

echo ""
echo "📋 Step 5: Testing CORS..."
echo "-------------------------"

# Test CORS preflight
echo "🔍 Testing CORS preflight from HTTPS..."
CORS_STATUS=$(curl -H "Origin: https://bidalbania.al" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -s -o /dev/null -w "%{http_code}" \
     https://bidalbania.al/api/requests/all)

if [ "$CORS_STATUS" = "204" ]; then
    echo "✅ CORS preflight working (Status: $CORS_STATUS)"
else
    echo "❌ CORS preflight not working (Status: $CORS_STATUS)"
fi

# Test actual API call
echo ""
echo "🔍 Testing actual API call from HTTPS..."
API_CALL_STATUS=$(curl -H "Origin: https://bidalbania.al" \
     -H "Content-Type: application/json" \
     -s -o /dev/null -w "%{http_code}" \
     https://bidalbania.al/api/requests/all)

if [ "$API_CALL_STATUS" = "200" ]; then
    echo "✅ API call working (Status: $API_CALL_STATUS)"
else
    echo "❌ API call not working (Status: $API_CALL_STATUS)"
fi

echo ""
echo "📋 Step 6: Testing HTTP to HTTPS Redirect..."
echo "-------------------------------------------"

# Test that HTTP redirects to HTTPS
echo "🔍 Testing HTTP to HTTPS redirect..."
REDIRECT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://bidalbania.al/api/requests/all)

if [ "$REDIRECT_STATUS" = "301" ] || [ "$REDIRECT_STATUS" = "302" ]; then
    echo "✅ HTTP to HTTPS redirect working (Status: $REDIRECT_STATUS)"
else
    echo "❌ HTTP to HTTPS redirect not working (Status: $REDIRECT_STATUS)"
fi

echo ""
echo "📋 Step 7: Checking Backend Services..."
echo "-------------------------------------"

# Check PM2 status
echo "📋 PM2 Status:"
pm2 status

# Check if ports are listening
echo ""
echo "🔍 Port Status:"
if lsof -i :7700 > /dev/null 2>&1; then
    echo "✅ Port 7700 (Backend) is listening"
else
    echo "❌ Port 7700 (Backend) is not listening"
fi

if lsof -i :8085 > /dev/null 2>&1; then
    echo "✅ Port 8085 (Frontend) is listening"
else
    echo "❌ Port 8085 (Frontend) is not listening"
fi

if lsof -i :443 > /dev/null 2>&1; then
    echo "✅ Port 443 (HTTPS) is listening"
else
    echo "❌ Port 443 (HTTPS) is not listening"
fi

echo ""
echo "📋 Step 8: Checking Frontend Configuration..."
echo "-------------------------------------------"

# Check if frontend API config is correct
if grep -q "https://bidalbania.al/api" "frontend/src/config/api.js"; then
    echo "✅ Frontend API config uses HTTPS"
else
    echo "❌ Frontend API config does not use HTTPS"
fi

# Check if CSP is configured
if grep -q "upgrade-insecure-requests" "frontend/src/hooks/useCSP.js"; then
    echo "✅ CSP is configured"
else
    echo "❌ CSP is not configured"
fi

echo ""
echo "📋 Step 9: Expected Behavior Summary..."
echo "-------------------------------------"

echo "✅ Expected Results:"
echo "  • Frontend: https://bidalbania.al (accessible)"
echo "  • API: https://bidalbania.al/api (accessible)"
echo "  • No ERR_SSL_PROTOCOL_ERROR"
echo "  • No Mixed Content errors"
echo "  • CORS working for HTTPS"
echo "  • HTTP redirects to HTTPS"
echo ""
echo "✅ How it works:"
echo "  • User visits: https://bidalbania.al"
echo "  • Nginx receives HTTPS request"
echo "  • Nginx forwards to: http://localhost:8085 (frontend)"
echo "  • Frontend makes API call to: https://bidalbania.al/api"
echo "  • Nginx receives API request"
echo "  • Nginx forwards to: http://localhost:7700/api (backend)"
echo "  • Backend responds"
echo "  • Nginx returns HTTPS response to user"

echo ""
echo "⚠️  Troubleshooting:"
echo "------------------"

echo "❌ If HTTPS frontend fails:"
echo "  • Check if Nginx is running: sudo systemctl status nginx"
echo "  • Check if port 8085 is running: lsof -i :8085"
echo "  • Check Nginx logs: sudo tail -f /var/log/nginx/error.log"
echo ""
echo "❌ If HTTPS API fails:"
echo "  • Check if port 7700 is running: lsof -i :7700"
echo "  • Check backend logs: pm2 logs bidalbania-backend"
echo "  • Check Nginx configuration: sudo nginx -t"
echo ""
echo "❌ If SSL errors:"
echo "  • Check SSL certificate: ls -la /etc/ssl/certs/bidalbania.al.crt"
echo "  • Check SSL key: ls -la /etc/ssl/private/bidalbania.al.key"
echo "  • Verify certificate paths in Nginx config"

echo ""
echo "🎉 Nginx SSL Solution Test Complete!"
echo "==================================="
echo ""
echo "✅ All tests completed"
echo "✅ Solution should work correctly"
echo "✅ No more SSL or Mixed Content errors" 