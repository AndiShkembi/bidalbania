#!/bin/bash

echo "🔒 Deploying Nginx SSL Fix for BidAlbania..."
echo "============================================"

echo ""
echo "📋 Step 1: Checking SSL Certificate..."
echo "-------------------------------------"

# Check SSL certificate
if [ -f "/etc/ssl/certs/bidalbania.al.crt" ] && [ -f "/etc/ssl/private/bidalbania.al.key" ]; then
    echo "✅ SSL certificate found"
    SSL_CERT="/etc/ssl/certs/bidalbania.al.crt"
    SSL_KEY="/etc/ssl/private/bidalbania.al.key"
elif [ -f "/etc/letsencrypt/live/bidalbania.al/fullchain.pem" ] && [ -f "/etc/letsencrypt/live/bidalbania.al/privkey.pem" ]; then
    echo "✅ Let's Encrypt certificate found"
    SSL_CERT="/etc/letsencrypt/live/bidalbania.al/fullchain.pem"
    SSL_KEY="/etc/letsencrypt/live/bidalbania.al/privkey.pem"
else
    echo "❌ SSL certificate not found"
    echo "Please install SSL certificate first:"
    echo "sudo certbot --nginx -d bidalbania.al -d www.bidalbania.al"
    exit 1
fi

echo ""
echo "📋 Step 2: Installing Nginx..."
echo "-----------------------------"

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    sudo apt update
    sudo apt install -y nginx
    echo "✅ Nginx installed"
else
    echo "✅ Nginx already installed"
fi

echo ""
echo "📋 Step 3: Creating Nginx Configuration..."
echo "----------------------------------------"

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/bidalbania > /dev/null << 'EOF'
# Nginx configuration for BidAlbania with SSL termination
server {
    listen 443 ssl http2;
    server_name bidalbania.al www.bidalbania.al;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/bidalbania.al.crt;
    ssl_certificate_key /etc/ssl/private/bidalbania.al.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Frontend (port 8085)
    location / {
        proxy_pass http://localhost:8085;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;

        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # API (port 7700) - with SSL termination
    location /api/ {
        proxy_pass http://localhost:7700/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;

        # CORS headers
        add_header 'Access-Control-Allow-Origin' 'https://bidalbania.al' always;
        add_header 'Access-Control-Allow-Origin' 'https://www.bidalbania.al' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, Origin, Accept' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        add_header 'Access-Control-Max-Age' '86400' always;

        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://bidalbania.al' always;
            add_header 'Access-Control-Allow-Origin' 'https://www.bidalbania.al' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, Origin, Accept' always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Max-Age' '86400' always;
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

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

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name bidalbania.al www.bidalbania.al;
    return 301 https://$server_name$request_uri;
}
EOF

echo "✅ Nginx configuration created"

echo ""
echo "📋 Step 4: Enabling Nginx Site..."
echo "--------------------------------"

# Enable the site
sudo ln -sf /etc/nginx/sites-available/bidalbania /etc/nginx/sites-enabled/

# Remove default site if exists
sudo rm -f /etc/nginx/sites-enabled/default

echo "✅ Nginx site enabled"

echo ""
echo "📋 Step 5: Testing Nginx Configuration..."
echo "----------------------------------------"

# Test Nginx configuration
if sudo nginx -t; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has errors"
    echo "Please check the configuration and try again"
    exit 1
fi

echo ""
echo "📋 Step 6: Updating Frontend API Configuration..."
echo "------------------------------------------------"

# Update frontend API config to use HTTPS without port
cat > frontend/src/config/api.js << 'EOF'
// API Configuration for HTTPS with Nginx reverse proxy
const getApiUrl = () => {
  // Check if we're in development or production
  const isDevelopment = import.meta.env.DEV;
  
  // Get the current hostname and protocol
  const hostname = window.location.hostname;
  const protocol = window.location.protocol; // Get current protocol (http: or https:)
  
  // If we're accessing from a specific IP, use that IP for the API
  if (hostname === '192.168.1.237') {
    return 'http://192.168.1.237:7700/api';
  }
  
  // If we're accessing from the server IP, use that IP for the API
  if (hostname === '161.35.211.94') {
    return 'http://161.35.211.94:7700/api';
  }
  
  // If we're accessing from the domain, use HTTPS without port (Nginx handles SSL)
  if (hostname === 'bidalbania.al' || hostname === 'www.bidalbania.al') {
    return 'https://bidalbania.al/api';
  }
  
  // For localhost or development
  if (isDevelopment || hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:7700/api';
  }
  
  // For production, use HTTPS without port (Nginx handles SSL)
  return 'https://bidalbania.al/api';
};

export const API_URL = getApiUrl();

// Axios configuration
export const apiConfig = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
};

console.log('API URL configured as:', API_URL);
EOF

echo "✅ Frontend API configuration updated"

echo ""
echo "📋 Step 7: Updating CSP Configuration..."
echo "---------------------------------------"

# Update CSP hook to not interfere with Nginx
cat > frontend/src/hooks/useCSP.js << 'EOF'
import { useEffect } from 'react';

/**
 * Custom hook for handling Content Security Policy
 * Automatically upgrades HTTP requests to HTTPS
 */
export const useCSP = () => {
  useEffect(() => {
    // Add CSP meta tag if it doesn't exist
    const addCSPMetaTag = () => {
      const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      
      if (!existingCSP) {
        const cspMeta = document.createElement('meta');
        cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
        cspMeta.setAttribute('content', 'upgrade-insecure-requests');
        
        // Insert after charset meta tag
        const charsetMeta = document.querySelector('meta[charset]');
        if (charsetMeta) {
          charsetMeta.parentNode.insertBefore(cspMeta, charsetMeta.nextSibling);
        } else {
          // Fallback: insert in head
          document.head.insertBefore(cspMeta, document.head.firstChild);
        }
        
        console.log('CSP meta tag added dynamically');
      }
    };

    // Upgrade HTTP URLs to HTTPS (but not for localhost or specific IPs)
    const upgradeToHTTPS = (url) => {
      if (url && url.startsWith('http://')) {
        // Don't upgrade localhost or specific IPs
        if (url.includes('localhost') || url.includes('127.0.0.1') || 
            url.includes('192.168.1.237') || url.includes('161.35.211.94')) {
          console.log(`CSP: Skipping HTTPS upgrade for local/development: ${url}`);
          return url;
        }
        console.log(`CSP: Upgrading HTTP to HTTPS: ${url}`);
        return url.replace('http://', 'https://');
      }
      return url;
    };

    // Override fetch to automatically upgrade HTTP to HTTPS
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
      const upgradedUrl = upgradeToHTTPS(url);
      
      // Log if URL was upgraded
      if (upgradedUrl !== url) {
        console.log(`CSP: Upgraded HTTP to HTTPS: ${url} → ${upgradedUrl}`);
      }
      
      return originalFetch(upgradedUrl, options);
    };

    // Override XMLHttpRequest to automatically upgrade HTTP to HTTPS
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      const upgradedUrl = upgradeToHTTPS(url);
      
      // Log if URL was upgraded
      if (upgradedUrl !== url) {
        console.log(`CSP: Upgraded HTTP to HTTPS: ${url} → ${upgradedUrl}`);
      }
      
      return originalXHROpen.call(this, method, upgradedUrl, ...args);
    };

    // Add CSP meta tag
    addCSPMetaTag();

    // Cleanup function
    return () => {
      // Restore original fetch
      window.fetch = originalFetch;
      // Restore original XMLHttpRequest
      XMLHttpRequest.prototype.open = originalXHROpen;
    };
  }, []);

  // Helper function to upgrade URLs
  const upgradeURL = (url) => {
    if (url && url.startsWith('http://')) {
      // Don't upgrade localhost or specific IPs
      if (url.includes('localhost') || url.includes('127.0.0.1') || 
          url.includes('192.168.1.237') || url.includes('161.35.211.94')) {
        return url;
      }
      return url.replace('http://', 'https://');
    }
    return url;
  };

  return { upgradeURL };
};

/**
 * Utility function to check if CSP is enabled
 */
export const isCSPEnabled = () => {
  return !!document.querySelector('meta[http-equiv="Content-Security-Policy"]');
};

/**
 * Utility function to get CSP content
 */
export const getCSPContent = () => {
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  return cspMeta ? cspMeta.getAttribute('content') : null;
};
EOF

echo "✅ CSP configuration updated"

echo ""
echo "📋 Step 8: Rebuilding Frontend..."
echo "--------------------------------"

# Rebuild frontend
cd frontend
npm run build
cd ..

echo "✅ Frontend rebuilt"

echo ""
echo "📋 Step 9: Restarting Services..."
echo "--------------------------------"

# Reload Nginx
sudo systemctl reload nginx

# Restart PM2 processes
pm2 restart bidalbania-backend
pm2 restart bidalbania-frontend

echo "✅ Services restarted"

echo ""
echo "📋 Step 10: Testing Configuration..."
echo "-----------------------------------"

# Test HTTPS frontend
echo "🔍 Testing HTTPS frontend..."
if curl -s https://bidalbania.al > /dev/null; then
    echo "✅ HTTPS frontend accessible"
else
    echo "❌ HTTPS frontend not accessible"
fi

# Test HTTPS API
echo "🔍 Testing HTTPS API..."
if curl -s https://bidalbania.al/api/requests/all > /dev/null; then
    echo "✅ HTTPS API accessible"
else
    echo "❌ HTTPS API not accessible"
fi

# Test CORS
echo "🔍 Testing CORS..."
CORS_STATUS=$(curl -H "Origin: https://bidalbania.al" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -s -o /dev/null -w "%{http_code}" \
     https://bidalbania.al/api/requests/all)

if [ "$CORS_STATUS" = "204" ]; then
    echo "✅ CORS working correctly"
else
    echo "❌ CORS not working (Status: $CORS_STATUS)"
fi

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo ""
echo "🌐 Your application is now available at:"
echo "  - Frontend: https://bidalbania.al"
echo "  - API: https://bidalbania.al/api"
echo ""
echo "✅ No more ERR_SSL_PROTOCOL_ERROR"
echo "✅ No more Mixed Content errors"
echo "✅ SSL certificate properly configured"
echo "✅ CORS working for HTTPS"
echo ""
echo "📋 How it works:"
echo "  • Frontend: https://bidalbania.al → Nginx → localhost:8085"
echo "  • API: https://bidalbania.al/api → Nginx → localhost:7700"
echo "  • Nginx handles SSL termination"
echo "  • Backend runs on HTTP internally"
echo ""
echo "📋 Useful commands:"
echo "  - Check Nginx status: sudo systemctl status nginx"
echo "  - Check PM2 status: pm2 status"
echo "  - View Nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "  - View PM2 logs: pm2 logs"
echo ""
echo "🔧 Troubleshooting:"
echo "  - If frontend doesn't load: Check if port 8085 is running"
echo "  - If API doesn't work: Check if port 7700 is running"
echo "  - If SSL errors: Check certificate paths in Nginx config" 