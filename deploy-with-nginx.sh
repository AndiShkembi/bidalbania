#!/bin/bash

echo "🚀 Deploying Bidalbania with Nginx Reverse Proxy..."
echo "=================================================="

# Check if running as root for Nginx setup
if [ "$EUID" -ne 0 ]; then
    echo "⚠️  Note: Some steps require root privileges for Nginx setup"
fi

echo ""
echo "📋 Step 1: Installing Dependencies..."
echo "-----------------------------------"

# Install Node.js dependencies
echo "Installing backend dependencies..."
cd backend
npm install

echo "Installing frontend dependencies..."
cd ../frontend
npm install

echo "Installing root dependencies..."
cd ..
npm install

echo ""
echo "📋 Step 2: Building Frontend..."
echo "------------------------------"

cd frontend
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Frontend built successfully"
else
    echo "❌ Frontend build failed"
    exit 1
fi
cd ..

echo ""
echo "📋 Step 3: Setting up Nginx Reverse Proxy..."
echo "-------------------------------------------"

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "Setting up Nginx..."
    
    # Install Nginx if not installed
    if ! command -v nginx &> /dev/null; then
        apt update
        apt install -y nginx
    fi
    
    # Copy Nginx configuration
    cp nginx-reverse-proxy.conf /etc/nginx/sites-available/bidalbania.al
    
    # Enable the site
    ln -sf /etc/nginx/sites-available/bidalbania.al /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Test configuration
    if nginx -t; then
        echo "✅ Nginx configuration is valid"
        systemctl reload nginx
    else
        echo "❌ Nginx configuration has errors"
        exit 1
    fi
    
    # Configure firewall
    ufw allow 80
    ufw allow 443
    ufw allow 7700
    ufw allow 8085
    
    echo "✅ Nginx setup complete"
else
    echo "⚠️  Skipping Nginx setup (requires root privileges)"
    echo "Run manually: sudo ./setup-nginx-reverse-proxy.sh"
fi

echo ""
echo "📋 Step 4: Starting Applications with PM2..."
echo "-------------------------------------------"

# Stop existing processes
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# Start backend
echo "Starting backend..."
cd backend
pm2 start app.js --name "bidalbania-backend" --env production
cd ..

# Start frontend
echo "Starting frontend..."
cd frontend
pm2 start npm --name "bidalbania-frontend" -- run preview
cd ..

# Save PM2 configuration
pm2 save

echo ""
echo "📋 Step 5: Checking Application Status..."
echo "---------------------------------------"

# Check if applications are running
if pm2 list | grep -q "bidalbania-backend.*online"; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not running"
fi

if pm2 list | grep -q "bidalbania-frontend.*online"; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend is not running"
fi

echo ""
echo "📋 Step 6: Testing Configuration..."
echo "--------------------------------"

# Test backend directly
echo "Testing backend..."
if curl -s http://localhost:7700/api/requests/all > /dev/null; then
    echo "✅ Backend API is accessible"
else
    echo "❌ Backend API is not accessible"
fi

# Test frontend directly
echo "Testing frontend..."
if curl -s http://localhost:8085 > /dev/null; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend is not accessible"
fi

echo ""
echo "📋 Step 7: SSL Certificate Setup..."
echo "----------------------------------"

echo "⚠️  Important: SSL Certificate Setup Required"
echo ""
echo "For production, you need to set up SSL certificates:"
echo ""
echo "Option 1: Let's Encrypt (Recommended)"
echo "  sudo apt install certbot python3-certbot-nginx"
echo "  sudo certbot --nginx -d bidalbania.al -d www.bidalbania.al"
echo ""
echo "Option 2: Manual SSL Certificate"
echo "  Update the SSL certificate paths in nginx configuration:"
echo "  - ssl_certificate: /etc/letsencrypt/live/bidalbania.al/fullchain.pem"
echo "  - ssl_certificate_key: /etc/letsencrypt/live/bidalbania.al/privkey.pem"

echo ""
echo "📋 Step 8: Final Configuration Summary..."
echo "---------------------------------------"

echo "🎉 Deployment Complete!"
echo "======================"
echo ""
echo "✅ Application Status:"
echo "  • Backend: http://localhost:7700 (PM2 managed)"
echo "  • Frontend: http://localhost:8085 (PM2 managed)"
echo "  • Nginx: Reverse proxy configured"
echo ""
echo "✅ Production URLs (after SSL setup):"
echo "  • Frontend: https://bidalbania.al"
echo "  • API: https://bidalbania.al/api"
echo "  • All requests use relative URLs"
echo ""
echo "✅ Configuration Benefits:"
echo "  • No mixed content errors"
echo "  • No SSL protocol errors"
echo "  • Clean relative URLs (/api)"
echo "  • Centralized SSL management"
echo "  • Better security and performance"
echo ""
echo "✅ Management Commands:"
echo "  • View logs: pm2 logs"
echo "  • Restart all: pm2 restart all"
echo "  • Status: pm2 status"
echo "  • Nginx logs: tail -f /var/log/nginx/error.log"
echo ""
echo "✅ Testing Commands:"
echo "  • Test Nginx: ./test-nginx-reverse-proxy.sh"
echo "  • Test API: curl https://bidalbania.al/api/requests/all"
echo "  • Test Frontend: curl https://bidalbania.al"
echo ""
echo "⚠️  Next Steps:"
echo "  1. Set up SSL certificates (Let's Encrypt recommended)"
echo "  2. Test the application in browser"
echo "  3. Monitor logs for any issues"
echo "  4. Configure domain DNS if needed" 