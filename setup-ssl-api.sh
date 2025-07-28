#!/bin/bash

echo "🔒 Setting up SSL for BidAlbania API..."
echo "======================================="

echo ""
echo "📋 Checking current SSL configuration..."
echo "---------------------------------------"

# Check if SSL certificate exists
if [ -f "/etc/ssl/certs/bidalbania.al.crt" ]; then
    echo "✅ SSL certificate found: /etc/ssl/certs/bidalbania.al.crt"
    SSL_CERT="/etc/ssl/certs/bidalbania.al.crt"
elif [ -f "/etc/letsencrypt/live/bidalbania.al/fullchain.pem" ]; then
    echo "✅ Let's Encrypt certificate found"
    SSL_CERT="/etc/letsencrypt/live/bidalbania.al/fullchain.pem"
    SSL_KEY="/etc/letsencrypt/live/bidalbania.al/privkey.pem"
else
    echo "❌ No SSL certificate found"
    echo "Please install SSL certificate first"
    exit 1
fi

# Check if SSL key exists
if [ -f "/etc/ssl/private/bidalbania.al.key" ]; then
    echo "✅ SSL key found: /etc/ssl/private/bidalbania.al.key"
    SSL_KEY="/etc/ssl/private/bidalbania.al.key"
elif [ -z "$SSL_KEY" ]; then
    echo "❌ SSL key not found"
    echo "Please check SSL certificate installation"
    exit 1
fi

echo ""
echo "🌐 Option 1: Configure Backend with SSL..."
echo "------------------------------------------"

# Create SSL configuration for backend
echo "📝 Creating SSL configuration for backend..."

# Create SSL config file
cat > backend/ssl-config.js << 'EOF'
const fs = require('fs');
const https = require('https');

const sslOptions = {
  key: fs.readFileSync('/etc/ssl/private/bidalbania.al.key'),
  cert: fs.readFileSync('/etc/ssl/certs/bidalbania.al.crt')
};

module.exports = sslOptions;
EOF

echo "✅ SSL configuration created: backend/ssl-config.js"

echo ""
echo "🌐 Option 2: Configure Nginx Reverse Proxy..."
echo "--------------------------------------------"

# Create Nginx configuration for API
cat > nginx-api-config.conf << 'EOF'
# Nginx configuration for BidAlbania API with SSL
server {
    listen 443 ssl;
    server_name bidalbania.al www.bidalbania.al;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/bidalbania.al.crt;
    ssl_certificate_key /etc/ssl/private/bidalbania.al.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Frontend (port 8085)
    location / {
        proxy_pass http://localhost:8085;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # API (port 7700) - with SSL termination
    location /api/ {
        proxy_pass http://localhost:7700/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' 'https://bidalbania.al' always;
        add_header 'Access-Control-Allow-Origin' 'https://www.bidalbania.al' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, Origin, Accept' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://bidalbania.al' always;
            add_header 'Access-Control-Allow-Origin' 'https://www.bidalbania.al' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, Origin, Accept' always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name bidalbania.al www.bidalbania.al;
    return 301 https://$server_name$request_uri;
}
EOF

echo "✅ Nginx API configuration created: nginx-api-config.conf"

echo ""
echo "🌐 Option 3: Update Frontend API Configuration..."
echo "------------------------------------------------"

# Update frontend API config to use HTTPS
cat > frontend/src/config/api-https.js << 'EOF'
// API Configuration for HTTPS
const getApiUrl = () => {
  const isDevelopment = import.meta.env.DEV;
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  if (hostname === '192.168.1.237') {
    return 'http://192.168.1.237:7700/api';
  }
  if (hostname === '161.35.211.94') {
    return 'http://161.35.211.94:7700/api';
  }
  if (hostname === 'bidalbania.al' || hostname === 'www.bidalbania.al') {
    // Use HTTPS for domain (with Nginx reverse proxy)
    return 'https://bidalbania.al/api';
  }
  if (isDevelopment || hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:7700/api';
  }
  return 'https://bidalbania.al/api';
};

export const API_URL = getApiUrl();

export const apiConfig = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
};

console.log('API URL configured as:', API_URL);
EOF

echo "✅ HTTPS API configuration created: frontend/src/config/api-https.js"

echo ""
echo "📋 Installation Instructions:"
echo "----------------------------"
echo ""
echo "🔧 Option 1: Backend with SSL (Recommended)"
echo "1. Install SSL dependencies: npm install https"
echo "2. Update backend/app.js to use SSL"
echo "3. Restart backend: pm2 restart bidalbania-backend"
echo ""
echo "🔧 Option 2: Nginx Reverse Proxy (Easiest)"
echo "1. Copy nginx-api-config.conf to /etc/nginx/sites-available/bidalbania"
echo "2. Enable site: ln -s /etc/nginx/sites-available/bidalbania /etc/nginx/sites-enabled/"
echo "3. Test config: nginx -t"
echo "4. Reload nginx: systemctl reload nginx"
echo "5. Update frontend to use https://bidalbania.al/api"
echo ""
echo "🔧 Option 3: Frontend HTTPS API"
echo "1. Replace frontend/src/config/api.js with api-https.js"
echo "2. Rebuild frontend: npm run build"
echo "3. Restart frontend: pm2 restart bidalbania-frontend"

echo ""
echo "💡 Recommended: Use Option 2 (Nginx Reverse Proxy)"
echo "   - No changes needed in backend"
echo "   - SSL termination handled by Nginx"
echo "   - Better performance and security"
echo ""
echo "🌐 Expected URLs after setup:"
echo "  - Frontend: https://bidalbania.al"
echo "  - API: https://bidalbania.al/api"
echo "  - No mixed content errors" 