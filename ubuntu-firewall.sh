#!/bin/bash

echo "🔥 Ubuntu Firewall Setup for BidAlbania"
echo "======================================="

echo ""
echo "🔧 Installing UFW if not present..."
sudo apt update
sudo apt install ufw -y

echo ""
echo "🛡️  Configuring firewall rules..."

# Allow SSH (very important!)
sudo ufw allow 22/tcp

# Allow BidAlbania ports
sudo ufw allow 8000/tcp
sudo ufw allow 5000/tcp

# Optional: Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

echo ""
echo "🚀 Enabling firewall..."
sudo ufw --force enable

echo ""
echo "📊 Firewall Status:"
sudo ufw status numbered

echo ""
echo "✅ Firewall configured!"
echo "🌐 Your apps should be accessible on:"
echo "   Frontend: http://your-server-ip:8000"
echo "   Backend:  http://your-server-ip:5000" 