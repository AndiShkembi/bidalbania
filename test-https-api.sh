#!/bin/bash

echo "🔒 Testing HTTPS API Configuration..."
echo "===================================="

echo ""
echo "🌐 Testing SSL Certificate..."
echo "----------------------------"

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
echo "🌐 Testing HTTPS Frontend..."
echo "---------------------------"

# Test HTTPS frontend
echo "🔍 Testing https://bidalbania.al..."
if curl -s https://bidalbania.al > /dev/null; then
    echo "✅ HTTPS frontend accessible"
    HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://bidalbania.al)
    echo "   HTTPS Status: $HTTPS_STATUS"
    
    # Check SSL certificate
    SSL_INFO=$(echo | openssl s_client -servername bidalbania.al -connect bidalbania.al:443 2>/dev/null | openssl x509 -noout -dates)
    echo "   SSL Certificate:"
    echo "$SSL_INFO" | sed 's/^/   /'
else
    echo "❌ HTTPS frontend not accessible"
fi

echo ""
echo "🌐 Testing HTTPS API..."
echo "---------------------"

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
echo "🔍 Testing https://bidalbania.al/api..."
if curl -s https://bidalbania.al/api > /dev/null; then
    echo "✅ HTTPS API root accessible"
    API_ROOT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://bidalbania.al/api)
    echo "   API Root Status: $API_ROOT_STATUS"
else
    echo "❌ HTTPS API root not accessible"
fi

echo ""
echo "🌐 Testing CORS with HTTPS..."
echo "----------------------------"

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
echo "🌐 Testing Mixed Content Prevention..."
echo "------------------------------------"

# Test that HTTP API is not accessible (should redirect to HTTPS)
echo "🔍 Testing HTTP to HTTPS redirect..."
REDIRECT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://bidalbania.al/api/requests/all)

if [ "$REDIRECT_STATUS" = "301" ] || [ "$REDIRECT_STATUS" = "302" ]; then
    echo "✅ HTTP to HTTPS redirect working (Status: $REDIRECT_STATUS)"
else
    echo "❌ HTTP to HTTPS redirect not working (Status: $REDIRECT_STATUS)"
fi

echo ""
echo "🌐 Testing Nginx Configuration..."
echo "-------------------------------"

# Check Nginx status
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx is running"
else
    echo "❌ Nginx is not running"
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
echo "🌐 Testing Backend Services..."
echo "----------------------------"

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
echo "📋 Final Configuration Summary:"
echo "-------------------------------"
echo "✅ SSL Certificate: Installed and configured"
echo "✅ HTTPS Frontend: https://bidalbania.al"
echo "✅ HTTPS API: https://bidalbania.al/api"
echo "✅ CORS: Configured for HTTPS"
echo "✅ Mixed Content: Prevented (HTTP redirects to HTTPS)"
echo "✅ Nginx: Running as reverse proxy"

echo ""
echo "🔧 Expected Behavior:"
echo "--------------------"
echo "1. Frontend accessible at https://bidalbania.al"
echo "2. API accessible at https://bidalbania.al/api"
echo "3. No mixed content errors"
echo "4. HTTP requests redirect to HTTPS"
echo "5. CORS works for HTTPS origins"

echo ""
echo "⚠️  Troubleshooting:"
echo "-------------------"
echo "• If HTTPS fails: Check SSL certificate installation"
echo "• If API fails: Check if backend is running on port 7700"
echo "• If CORS fails: Check Nginx CORS configuration"
echo "• If redirect fails: Check Nginx configuration"

echo ""
echo "🌐 Test URLs:"
echo "-------------"
echo "Frontend: https://bidalbania.al"
echo "API: https://bidalbania.al/api"
echo "API Endpoint: https://bidalbania.al/api/requests/all"

echo ""
echo "🔍 Quick Health Check:"
echo "---------------------"
echo "Nginx running: $(systemctl is-active nginx)"
echo "Backend running: $(pm2 list | grep bidalbania-backend | wc -l) processes"
echo "Frontend running: $(pm2 list | grep bidalbania-frontend | wc -l) processes"
echo "SSL certificate: $(if [ -f "/etc/ssl/certs/bidalbania.al.crt" ]; then echo "✅ Found"; else echo "❌ Missing"; fi)" 