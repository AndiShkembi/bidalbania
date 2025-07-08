#!/bin/bash

echo "🔥 Configuring Ubuntu Firewall (UFW) for BidAlbania..."
echo "======================================================"

# Check if UFW is installed
if ! command -v ufw &> /dev/null; then
    echo "❌ UFW is not installed. Installing UFW..."
    sudo apt update
    sudo apt install ufw -y
else
    echo "✅ UFW is already installed"
fi

# Check UFW status
echo ""
echo "📊 Current UFW Status:"
sudo ufw status

echo ""
echo "🔧 Configuring firewall rules..."

# Allow SSH (important to keep this!)
echo "🔑 Allowing SSH (port 22)..."
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS (optional, for web traffic)
echo "🌐 Allowing HTTP (port 80)..."
sudo ufw allow 80/tcp

echo "🔒 Allowing HTTPS (port 443)..."
sudo ufw allow 443/tcp

# Allow BidAlbania application ports
echo "🚀 Allowing BidAlbania Frontend (port 3000)..."
sudo ufw allow 3000/tcp

echo "⚙️  Allowing BidAlbania Backend (port 5000)..."
sudo ufw allow 5000/tcp

# Enable UFW
echo ""
echo "🛡️  Enabling UFW firewall..."
sudo ufw --force enable

echo ""
echo "📊 Final UFW Status:"
sudo ufw status numbered

echo ""
echo "✅ Firewall configuration completed!"
echo ""
echo "🌐 Your applications should now be accessible on:"
echo "   Frontend: http://your-server-ip:3000"
echo "   Backend:  http://your-server-ip:5000"
echo ""
echo "📋 Useful UFW commands:"
echo "   sudo ufw status                    - Check firewall status"
echo "   sudo ufw status numbered           - Show rules with numbers"
echo "   sudo ufw delete [number]           - Delete a specific rule"
echo "   sudo ufw disable                   - Disable firewall (not recommended)"
echo "   sudo ufw reset                     - Reset firewall to defaults" 