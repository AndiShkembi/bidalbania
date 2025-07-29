#!/bin/bash

echo "🔧 Fixing Nginx API Proxy Configuration"
echo "======================================="

# Check if we're on the server
if [ "$(hostname)" != "bidalbania" ]; then
    echo "❌ This script should be run on the server (bidalbania)"
    echo "Please run this script on your server where nginx is installed"
    exit 1
fi

# Backup current nginx configuration
echo "📋 Backing up current nginx configuration..."
sudo cp /etc/nginx/sites-available/bidalbania.al /etc/nginx/sites-available/bidalbania.al.backup.$(date +%Y%m%d_%H%M%S)

# Create the correct nginx configuration
echo "📝 Creating correct nginx configuration..."

sudo tee /etc/nginx/sites-available/bidalbania.al > /dev/null << 'EOF'
# Nginx Reverse Proxy Configuration for Bidalbania
# This configuration handles SSL termination and routes traffic to backend and frontend

server {
    listen 80;
    server_name bidalbania.al www.bidalbania.al;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name bidalbania.al www.bidalbania.al;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/bidalbania.al/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bidalbania.al/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # CORS Headers for API
    add_header Access-Control-Allow-Origin "https://bidalbania.al" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With" always;
    add_header Access-Control-Allow-Credentials "true" always;
    
    # Handle preflight requests
    if ($request_method = 'OPTIONS') {
        add_header Access-Control-Allow-Origin "https://bidalbania.al" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With" always;
        add_header Access-Control-Allow-Credentials "true" always;
        add_header Content-Length 0;
        add_header Content-Type text/plain;
        return 204;
    }
    
    # API Routes - Proxy to Backend (port 7700)
    location /api/ {
        proxy_pass http://localhost:7700;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
        
        # CORS Headers for API
        add_header Access-Control-Allow-Origin "https://bidalbania.al" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With" always;
        add_header Access-Control-Allow-Credentials "true" always;
    }
    
    # Frontend Routes - Proxy to Frontend (port 8085)
    location / {
        proxy_pass http://localhost:8085/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Static files optimization
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:8085;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}

# HTTP to HTTPS redirect for www subdomain
server {
    listen 80;
    server_name www.bidalbania.al;
    return 301 https://www.bidalbania.al$request_uri;
}
EOF

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
if sudo nginx -t; then
    echo "✅ Nginx configuration is valid"
    
    # Reload nginx
    echo "🔄 Reloading nginx..."
    sudo systemctl reload nginx
    
    if [ $? -eq 0 ]; then
        echo "✅ Nginx reloaded successfully"
        
        # Test the API endpoint
        echo "🧪 Testing API endpoint..."
        sleep 2
        if curl -s -o /dev/null -w "Status: %{http_code}\n" "https://bidalbania.al/api/requests/all?category=Elektricist&page=1&pageSize=20" | grep -q "200"; then
            echo "✅ API endpoint is now working!"
            echo ""
            echo "🎉 Success! The API endpoint is now accessible without port 7700:"
            echo "   https://bidalbania.al/api/requests/all?category=Elektricist&page=1&pageSize=20"
        else
            echo "❌ API endpoint is still not working"
            echo "Let's check the nginx error logs..."
            sudo tail -10 /var/log/nginx/error.log
        fi
    else
        echo "❌ Failed to reload nginx"
        sudo systemctl status nginx
    fi
else
    echo "❌ Nginx configuration is invalid"
    echo "Restoring backup..."
    sudo cp /etc/nginx/sites-available/bidalbania.al.backup.* /etc/nginx/sites-available/bidalbania.al
    sudo nginx -t
fi

echo ""
echo "📋 Summary:"
echo "The key change was in the proxy_pass directive:"
echo "  - Before: proxy_pass http://localhost:7700/api/;"
echo "  - After:  proxy_pass http://localhost:7700;"
echo ""
echo "This ensures that when nginx receives /api/requests/all,"
echo "it forwards the request to http://localhost:7700/api/requests/all"
echo "instead of http://localhost:7700/api/api/requests/all" 