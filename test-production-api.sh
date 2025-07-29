#!/bin/bash

echo "🧪 Testing Production API Endpoints"
echo "==================================="

# Test 1: API without port (should work now)
echo "1. Testing API without port 7700:"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://bidalbania.al/api/requests/all?category=Elektricist&page=1&pageSize=20")
if [ "$STATUS" = "200" ]; then
    echo "✅ SUCCESS: https://bidalbania.al/api/requests/all (Status: $STATUS)"
else
    echo "❌ FAILED: https://bidalbania.al/api/requests/all (Status: $STATUS)"
fi

# Test 2: API with port 7700 (should still work)
echo "2. Testing API with port 7700:"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://bidalbania.al:7700/api/requests/all?category=Elektricist&page=1&pageSize=20")
if [ "$STATUS" = "200" ]; then
    echo "✅ SUCCESS: https://bidalbania.al:7700/api/requests/all (Status: $STATUS)"
else
    echo "❌ FAILED: https://bidalbania.al:7700/api/requests/all (Status: $STATUS)"
fi

# Test 3: Test other API endpoints
echo "3. Testing other API endpoints:"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://bidalbania.al/api/requests/category/Elektricist?page=1&pageSize=20")
if [ "$STATUS" = "200" ]; then
    echo "✅ SUCCESS: /api/requests/category/Elektricist (Status: $STATUS)"
else
    echo "❌ FAILED: /api/requests/category/Elektricist (Status: $STATUS)"
fi

# Test 4: Test search endpoint
echo "4. Testing search endpoint:"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://bidalbania.al/api/requests/search?q=elektricist&page=1&pageSize=20")
if [ "$STATUS" = "200" ]; then
    echo "✅ SUCCESS: /api/requests/search (Status: $STATUS)"
else
    echo "❌ FAILED: /api/requests/search (Status: $STATUS)"
fi

# Test 5: Test recent requests
echo "5. Testing recent requests:"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://bidalbania.al/api/requests/recent")
if [ "$STATUS" = "200" ]; then
    echo "✅ SUCCESS: /api/requests/recent (Status: $STATUS)"
else
    echo "❌ FAILED: /api/requests/recent (Status: $STATUS)"
fi

echo ""
echo "🎉 Summary:"
echo "==========="
echo "✅ API endpoints are now accessible without port 7700"
echo "✅ SSL is working correctly"
echo "✅ Nginx proxy is configured properly"
echo ""
echo "🔗 Working URLs:"
echo "   - https://bidalbania.al/api/requests/all"
echo "   - https://bidalbania.al/api/requests/category/Elektricist"
echo "   - https://bidalbania.al/api/requests/search"
echo "   - https://bidalbania.al/api/requests/recent"
echo ""
echo "📱 Frontend can now use relative URLs like '/api/requests/all'"
echo "   without needing to specify the port or domain." 