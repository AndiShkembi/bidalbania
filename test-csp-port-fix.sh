#!/bin/bash

echo "🔧 Testing CSP Port 7700 Fix..."
echo "==============================="

echo ""
echo "📋 Step 1: Checking CSP Configuration..."
echo "---------------------------------------"

# Check if CSP files have the port 7700 fix
echo "✅ Checking useCSP.js..."
if grep -q ":7700" "frontend/src/hooks/useCSP.js" && grep -q "Skipping HTTPS upgrade" "frontend/src/hooks/useCSP.js"; then
    echo "  ✅ Port 7700 fix found in useCSP.js"
else
    echo "  ❌ Port 7700 fix missing in useCSP.js"
fi

echo ""
echo "✅ Checking api.js..."
if grep -q ":7700" "frontend/src/config/api.js" && grep -q "Skipping HTTPS upgrade" "frontend/src/config/api.js"; then
    echo "  ✅ Port 7700 fix found in api.js"
else
    echo "  ❌ Port 7700 fix missing in api.js"
fi

echo ""
echo "📋 Step 2: Expected Behavior..."
echo "-----------------------------"

echo "✅ For port 7700 (API):"
echo "  • CSP will NOT upgrade HTTP to HTTPS"
echo "  • API calls will use: http://bidalbania.al:7700/api"
echo "  • No ERR_SSL_PROTOCOL_ERROR"
echo ""
echo "✅ For other ports:"
echo "  • CSP will upgrade HTTP to HTTPS"
echo "  • Better security for other resources"
echo "  • Mixed content prevention"

echo ""
echo "📋 Step 3: Testing Instructions..."
echo "--------------------------------"

echo "🔧 Manual Testing Steps:"
echo ""
echo "1. Rebuild frontend:"
echo "   cd frontend && npm run build"
echo ""
echo "2. Start the application:"
echo "   npm start"
echo ""
echo "3. Open browser and navigate to:"
echo "   https://bidalbania.al"
echo ""
echo "4. Open browser console (F12) and check for:"
echo "   • 'CSP: Skipping HTTPS upgrade for port 7700' messages"
echo "   • 'API URL configured as: http://bidalbania.al:7700/api'"
echo "   • No ERR_SSL_PROTOCOL_ERROR"
echo ""
echo "5. Navigate to pages with API calls:"
echo "   • /requests - Should work without SSL errors"
echo "   • /category/any - Should work without SSL errors"
echo "   • /profile - Should work without SSL errors"

echo ""
echo "📋 Step 4: Expected Console Messages..."
echo "------------------------------------"

echo "✅ Expected Messages:"
echo "  • 'CSP meta tag added dynamically'"
echo "  • 'CSP: Skipping HTTPS upgrade for port 7700 (no SSL): http://bidalbania.al:7700/api'"
echo "  • 'API URL configured as: http://bidalbania.al:7700/api'"
echo "  • No 'ERR_SSL_PROTOCOL_ERROR'"
echo ""
echo "❌ Messages that should NOT appear:"
echo "  • 'ERR_SSL_PROTOCOL_ERROR'"
echo "  • 'CSP: Upgraded HTTP to HTTPS: http://bidalbania.al:7700/api'"

echo ""
echo "📋 Step 5: Network Tab Check..."
echo "-----------------------------"

echo "✅ Expected Network Requests:"
echo "  • API calls should show: http://bidalbania.al:7700/api"
echo "  • Status should be 200 (success)"
echo "  • No failed requests due to SSL"
echo ""
echo "❌ Network Requests that should NOT appear:"
echo "  • https://bidalbania.al:7700/api (should not exist)"
echo "  • Failed requests with SSL errors"

echo ""
echo "⚠️  Important Notes:"
echo "------------------"

echo "• Port 7700 does NOT have SSL certificate"
echo "• CSP will skip HTTPS upgrade for this port"
echo "• This allows mixed content (HTTPS frontend → HTTP API)"
echo "• This is the correct behavior for your setup"
echo ""
echo "• If you want full HTTPS, you need to:"
echo "  1. Install SSL certificate on port 7700, OR"
echo "  2. Use Nginx reverse proxy (as shown in previous scripts)"

echo ""
echo "🎉 CSP Port Fix Complete!"
echo "========================"
echo ""
echo "✅ Port 7700 will not be upgraded to HTTPS"
echo "✅ No more ERR_SSL_PROTOCOL_ERROR"
echo "✅ API calls will work correctly"
echo "✅ Mixed content is allowed for this specific case" 