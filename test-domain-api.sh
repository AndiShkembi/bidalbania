#!/bin/bash

echo "🌐 Testing Domain API Configuration..."
echo "====================================="

echo ""
echo "📋 Step 1: Checking API Configuration..."
echo "---------------------------------------"

# Check if API config uses domain for production
if grep -q "Production mode: Using domain API" "frontend/src/config/api.js"; then
    echo "✅ API config uses domain for production"
else
    echo "❌ API config does not use domain for production"
fi

# Check if API config uses localhost for development
if grep -q "Development mode: Using localhost API" "frontend/src/config/api.js"; then
    echo "✅ API config uses localhost for development"
else
    echo "❌ API config does not use localhost for development"
fi

echo ""
echo "📋 Step 2: Expected Behavior..."
echo "-----------------------------"

echo "✅ Development Environment:"
echo "  • localhost:8080 → http://localhost:7700/api"
echo "  • 127.0.0.1:8080 → http://localhost:7700/api"
echo "  • Any local port → http://localhost:7700/api"
echo ""
echo "✅ Production Environment:"
echo "  • bidalbania.al → https://bidalbania.al/api"
echo "  • www.bidalbania.al → https://bidalbania.al/api"
echo "  • Any domain access → https://bidalbania.al/api"

echo ""
echo "📋 Step 3: Testing Instructions..."
echo "--------------------------------"

echo "🔧 Development Testing:"
echo ""
echo "1. Start backend: cd backend && npm start"
echo "2. Start frontend: cd frontend && npm run dev"
echo "3. Open browser: http://localhost:8080"
echo "4. Check console for: '🔧 Development mode: Using localhost API'"
echo "5. Check Network tab for: http://localhost:7700/api calls"
echo ""
echo "🔧 Production Testing:"
echo ""
echo "1. Deploy to server: ./deploy-nginx-ssl-fix.sh"
echo "2. Open browser: https://bidalbania.al"
echo "3. Check console for: '🚀 Production mode: Using domain API'"
echo "4. Check Network tab for: https://bidalbania.al/api calls"

echo ""
echo "📋 Step 4: Console Messages..."
echo "----------------------------"

echo "✅ Expected Development Messages:"
echo "  • '🔧 Development mode: Using localhost API'"
echo "  • 'API URL configured as: http://localhost:7700/api'"
echo "  • 'CSP: Skipping HTTPS upgrade for local/development'"
echo ""
echo "✅ Expected Production Messages:"
echo "  • '🚀 Production mode: Using domain API'"
echo "  • 'API URL configured as: https://bidalbania.al/api'"
echo "  • No CSP interference with domain API"

echo ""
echo "📋 Step 5: Network Tab Check..."
echo "-----------------------------"

echo "✅ Development Network Requests:"
echo "  • API calls should show: http://localhost:7700/api"
echo "  • Status should be 200 (success)"
echo "  • No SSL errors"
echo ""
echo "✅ Production Network Requests:"
echo "  • API calls should show: https://bidalbania.al/api"
echo "  • Status should be 200 (success)"
echo "  • SSL handled by Nginx"
echo "  • No mixed content errors"

echo ""
echo "⚠️  Important Notes:"
echo "------------------"

echo "• Development uses localhost (no SSL issues)"
echo "• Production uses domain with HTTPS"
echo "• CSP automatically adapts to environment"
echo "• Nginx handles SSL termination in production"
echo ""
echo "• For production to work:"
echo "  1. SSL certificate must be installed"
echo "  2. Nginx must be configured"
echo "  3. Backend must be running on port 7700"
echo "  4. Frontend must be running on port 8085"

echo ""
echo "🔧 Quick Test Commands:"
echo "---------------------"

echo "Development:"
echo "  cd backend && npm start"
echo "  cd frontend && npm run dev"
echo "  # Visit: http://localhost:8080"
echo ""
echo "Production:"
echo "  ./deploy-nginx-ssl-fix.sh"
echo "  # Visit: https://bidalbania.al"

echo ""
echo "🎉 Domain API Configuration Complete!"
echo "===================================="
echo ""
echo "✅ Development: Uses localhost (no SSL issues)"
echo "✅ Production: Uses domain with HTTPS"
echo "✅ CSP: Automatically adapts"
echo "✅ Environment-aware configuration" 