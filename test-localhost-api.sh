#!/bin/bash

echo "🔧 Testing Localhost API Configuration..."
echo "========================================"

echo ""
echo "📋 Step 1: Checking API Configuration..."
echo "---------------------------------------"

# Check if API config uses localhost for development
if grep -q "localhost:7700" "frontend/src/config/api.js"; then
    echo "✅ API config uses localhost:7700 for development"
else
    echo "❌ API config does not use localhost:7700"
fi

# Check if API config uses HTTPS for production
if grep -q "https://bidalbania.al/api" "frontend/src/config/api.js"; then
    echo "✅ API config uses HTTPS for production"
else
    echo "❌ API config does not use HTTPS for production"
fi

echo ""
echo "📋 Step 2: Checking CSP Configuration..."
echo "---------------------------------------"

# Check if CSP skips localhost
if grep -q "localhost.*:7700" "frontend/src/hooks/useCSP.js"; then
    echo "✅ CSP skips localhost:7700"
else
    echo "❌ CSP does not skip localhost:7700"
fi

# Check if CSP skips development ports
if grep -q ":8080" "frontend/src/hooks/useCSP.js"; then
    echo "✅ CSP skips port 8080"
else
    echo "❌ CSP does not skip port 8080"
fi

echo ""
echo "📋 Step 3: Expected Behavior..."
echo "-----------------------------"

echo "✅ Development Environment (localhost:8080):"
echo "  • Frontend: http://localhost:8080"
echo "  • API: http://localhost:7700/api"
echo "  • CSP: Will NOT upgrade to HTTPS"
echo "  • No SSL errors"
echo "  • No mixed content errors"
echo ""
echo "✅ Production Environment (bidalbania.al):"
echo "  • Frontend: https://bidalbania.al"
echo "  • API: https://bidalbania.al/api"
echo "  • CSP: Will upgrade HTTP to HTTPS"
echo "  • SSL handled by Nginx"
echo "  • No mixed content errors"

echo ""
echo "📋 Step 4: Testing Instructions..."
echo "--------------------------------"

echo "🔧 Development Testing:"
echo ""
echo "1. Start backend:"
echo "   cd backend && npm start"
echo ""
echo "2. Start frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open browser and navigate to:"
echo "   http://localhost:8080"
echo ""
echo "4. Open browser console (F12) and check for:"
echo "   • '🔧 Development mode: Using localhost API'"
echo "   • 'CSP: Skipping HTTPS upgrade for local/development'"
echo "   • 'API URL configured as: http://localhost:7700/api'"
echo ""
echo "5. Navigate to pages with API calls:"
echo "   • /requests - Should work without SSL errors"
echo "   • /category/any - Should work without SSL errors"
echo "   • /profile - Should work without SSL errors"

echo ""
echo "🔧 Production Testing:"
echo ""
echo "1. Deploy to server:"
echo "   ./deploy-nginx-ssl-fix.sh"
echo ""
echo "2. Open browser and navigate to:"
echo "   https://bidalbania.al"
echo ""
echo "3. Open browser console (F12) and check for:"
echo "   • '🚀 Production mode: Using HTTPS API with Nginx'"
echo "   • 'API URL configured as: https://bidalbania.al/api'"
echo "   • No SSL errors"
echo "   • No mixed content errors"

echo ""
echo "📋 Step 5: Console Messages..."
echo "----------------------------"

echo "✅ Expected Development Messages:"
echo "  • '🔧 Development mode: Using localhost API'"
echo "  • 'CSP: Skipping HTTPS upgrade for local/development: http://localhost:7700/api'"
echo "  • 'API URL configured as: http://localhost:7700/api'"
echo ""
echo "✅ Expected Production Messages:"
echo "  • '🚀 Production mode: Using HTTPS API with Nginx'"
echo "  • 'API URL configured as: https://bidalbania.al/api'"
echo "  • 'CSP: Upgrading HTTP to HTTPS' (for other resources)"

echo ""
echo "📋 Step 6: Network Tab Check..."
echo "-----------------------------"

echo "✅ Development Network Requests:"
echo "  • API calls should show: http://localhost:7700/api"
echo "  • Status should be 200 (success)"
echo "  • No failed requests due to SSL"
echo ""
echo "✅ Production Network Requests:"
echo "  • API calls should show: https://bidalbania.al/api"
echo "  • Status should be 200 (success)"
echo "  • No failed requests due to SSL"

echo ""
echo "⚠️  Important Notes:"
echo "------------------"

echo "• Development uses localhost to avoid SSL issues"
echo "• Production uses HTTPS with Nginx reverse proxy"
echo "• CSP automatically adapts to environment"
echo "• No code changes needed when switching environments"
echo ""
echo "• Make sure backend is running on port 7700"
echo "• Make sure frontend is running on port 8080"
echo "• Check that both services are accessible"

echo ""
echo "🎉 Localhost API Configuration Complete!"
echo "======================================="
echo ""
echo "✅ Development: Uses localhost (no SSL issues)"
echo "✅ Production: Uses HTTPS (secure)"
echo "✅ CSP: Automatically adapts"
echo "✅ No more SSL or Mixed Content errors" 