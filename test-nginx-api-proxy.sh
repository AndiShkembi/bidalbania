#!/bin/bash

echo "🔍 Testing Nginx API Proxy Configuration"
echo "========================================"

# Test 1: Direct backend access (should work)
echo "1. Testing direct backend access on port 7700:"
curl -s -o /dev/null -w "Status: %{http_code}\n" "http://localhost:7700/api/requests/all?category=Elektricist&page=1&pageSize=20"

# Test 2: Nginx proxy access (should work but currently doesn't)
echo "2. Testing nginx proxy access (https://bidalbania.al/api):"
curl -s -o /dev/null -w "Status: %{http_code}\n" "https://bidalbania.al/api/requests/all?category=Elektricist&page=1&pageSize=20"

# Test 3: Test with port 7700 (should work)
echo "3. Testing with port 7700 (https://bidalbania.al:7700/api):"
curl -s -o /dev/null -w "Status: %{http_code}\n" "https://bidalbania.al:7700/api/requests/all?category=Elektricist&page=1&pageSize=20"

# Test 4: Check if nginx is running
echo "4. Checking if nginx is running:"
if pgrep nginx > /dev/null; then
    echo "✅ Nginx is running"
else
    echo "❌ Nginx is not running"
fi

# Test 5: Check if backend is running
echo "5. Checking if backend is running on port 7700:"
if curl -s "http://localhost:7700/" > /dev/null; then
    echo "✅ Backend is running on port 7700"
else
    echo "❌ Backend is not running on port 7700"
fi

# Test 6: Check nginx configuration
echo "6. Checking nginx configuration:"
if sudo nginx -t 2>&1 | grep -q "test is successful"; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has errors:"
    sudo nginx -t
fi

echo ""
echo "🔧 Debugging Information:"
echo "========================="

# Show current nginx configuration for API routes
echo "Current nginx API proxy configuration:"
grep -A 10 "location /api/" nginx-reverse-proxy.conf

echo ""
echo "Expected behavior:"
echo "- Direct backend (port 7700): Should return 200"
echo "- Nginx proxy (no port): Should return 200 (currently returns 404)"
echo "- Nginx proxy (port 7700): Should return 200" 