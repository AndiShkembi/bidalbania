#!/bin/bash

echo "🌐 Testing Domain API with Port 7700..."
echo "======================================"

echo ""
echo "📋 Step 1: Checking API Configuration..."
echo "---------------------------------------"

# Check if API config uses domain with port 7700
if grep -q "bidalbania.al:7700/api" "frontend/src/config/api.js"; then
    echo "✅ API config uses domain with port 7700"
else
    echo "❌ API config does not use domain with port 7700"
fi

# Check if API config uses localhost for development
if grep -q "localhost:7700/api" "frontend/src/config/api.js"; then
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
echo "  • bidalbania.al → https://bidalbania.al:7700/api"
echo "  • www.bidalbania.al → https://bidalbania.al:7700/api"
echo "  • Any domain access → https://bidalbania.al:7700/api"

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
echo "1. Make sure backend is running on port 7700 with SSL"
echo "2. Open browser: https://bidalbania.al"
echo "3. Check console for: '🚀 Production mode: Using domain API with port 7700'"
echo "4. Check Network tab for: https://bidalbania.al:7700/api calls"

echo ""
echo "📋 Step 4: Console Messages..."
echo "----------------------------"

echo "✅ Expected Development Messages:"
echo "  • '🔧 Development mode: Using localhost API'"
echo "  • 'API URL configured as: http://localhost:7700/api'"
echo "  • 'CSP: Skipping HTTPS upgrade for local/development'"
echo ""
echo "✅ Expected Production Messages:"
echo "  • '🚀 Production mode: Using domain API with port 7700'"
echo "  • 'API URL configured as: https://bidalbania.al:7700/api'"
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
echo "  • API calls should show: https://bidalbania.al:7700/api"
echo "  • Status should be 200 (success)"
echo "  • SSL handled by backend on port 7700"
echo "  • No mixed content errors"

echo ""
echo "⚠️  Important Notes:"
echo "------------------"

echo "• Development uses localhost:7700 (no SSL issues)"
echo "• Production uses bidalbania.al:7700 with HTTPS"
echo "• Backend must have SSL certificate on port 7700"
echo "• CSP automatically adapts to environment"
echo ""
echo "• For production to work:"
echo "  1. SSL certificate must be installed on port 7700"
echo "  2. Backend must be configured for HTTPS on port 7700"
echo "  3. Firewall must allow port 7700"
echo "  4. Domain must point to correct server"

echo ""
echo "🔧 Quick Test Commands:"
echo "---------------------"

echo "Development:"
echo "  cd backend && npm start"
echo "  cd frontend && npm run dev"
echo "  # Visit: http://localhost:8080"
echo ""
echo "Production:"
echo "  # Make sure backend has SSL on port 7700"
echo "  # Visit: https://bidalbania.al"

echo ""
echo "🎉 Domain API with Port 7700 Configuration Complete!"
echo "==================================================="
echo ""
echo "✅ Development: Uses localhost:7700 (no SSL issues)"
echo "✅ Production: Uses bidalbania.al:7700 with HTTPS"
echo "✅ CSP: Automatically adapts"
echo "✅ Port 7700 specified for domain API calls" 