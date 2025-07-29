#!/bin/bash

echo "🌐 Setting up Nginx Reverse Proxy for Bidalbania..."
echo "=================================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

echo ""
echo "📋 Step 1: Installing Nginx..."
echo "-----------------------------"

# Update package list
apt update

# Install Nginx
apt install -y nginx

# Check if Nginx is installed
if command -v nginx &> /dev/null; then
    echo "✅ Nginx installed successfully"
else
    echo "❌ Failed to install Nginx"
    exit 1
fi

echo ""
echo "📋 Step 2: Configuring Nginx..."
echo "------------------------------"

# Backup existing config
if [ -f /etc/nginx/sites-available/default ]; then
    cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup
    echo "✅ Backed up existing Nginx config"
fi

# Copy our configuration
cp nginx-reverse-proxy.conf /etc/nginx/sites-available/bidalbania.al

# Create symlink to enable the site
ln -sf /etc/nginx/sites-available/bidalbania.al /etc/nginx/sites-enabled/

# Remove default site
rm -f /etc/nginx/sites-enabled/default

echo "✅ Nginx configuration copied"

echo ""
echo "📋 Step 3: Testing Nginx Configuration..."
echo "----------------------------------------"

# Test Nginx configuration
if nginx -t; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has errors"
    echo "Please check the configuration file"
    exit 1
fi

echo ""
echo "📋 Step 4: Starting Nginx..."
echo "---------------------------"

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx

# Check Nginx status
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx is running"
else
    echo "❌ Failed to start Nginx"
    exit 1
fi

echo ""
echo "📋 Step 5: Configuring Firewall..."
echo "--------------------------------"

# Allow HTTP and HTTPS
ufw allow 80
ufw allow 443

echo "✅ Firewall configured for ports 80 and 443"

echo ""
echo "📋 Step 6: SSL Certificate Setup..."
echo "----------------------------------"

echo "⚠️  Important: You need to set up SSL certificates"
echo ""
echo "Option 1: Let's Encrypt (Recommended)"
echo "  certbot --nginx -d bidalbania.al -d www.bidalbania.al"
echo ""
echo "Option 2: Manual SSL Certificate"
echo "  Update the SSL certificate paths in nginx configuration:"
echo "  - ssl_certificate: /etc/letsencrypt/live/bidalbania.al/fullchain.pem"
echo "  - ssl_certificate_key: /etc/letsencrypt/live/bidalbania.al/privkey.pem"

echo ""
echo "📋 Step 7: Final Configuration..."
echo "-------------------------------"

# Reload Nginx to apply changes
systemctl reload nginx

echo "✅ Nginx reloaded with new configuration"

echo ""
echo "🎉 Nginx Reverse Proxy Setup Complete!"
echo "====================================="
echo ""
echo "✅ Configuration:"
echo "  • Frontend: https://bidalbania.al → localhost:8085"
echo "  • API: https://bidalbania.al/api → localhost:7700/api"
echo "  • SSL: Handled by Nginx"
echo "  • CORS: Configured for domain"
echo ""
echo "✅ Next Steps:"
echo "  1. Set up SSL certificates (Let's Encrypt recommended)"
echo "  2. Make sure backend is running on port 7700"
echo "  3. Make sure frontend is running on port 8085"
echo "  4. Test the application"
echo ""
echo "✅ Test Commands:"
echo "  curl -I https://bidalbania.al"
echo "  curl -I https://bidalbania.al/api/requests/all"
echo ""
echo "✅ Monitor Logs:"
echo "  tail -f /var/log/nginx/access.log"
echo "  tail -f /var/log/nginx/error.log" 