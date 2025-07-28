#!/bin/bash

echo "🚀 Starting BidAlbania Domain Deployment..."
echo "=========================================="

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs

# Install PM2 globally if not installed
echo "📦 Checking PM2 installation..."
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2 globally..."
    npm install -g pm2
else
    echo "PM2 is already installed"
fi

# Stop existing PM2 processes
echo "🛑 Stopping existing PM2 processes..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# Clean and rebuild backend with better-sqlite3
echo "🧹 Cleaning backend dependencies..."
cd backend
rm -rf node_modules package-lock.json
echo "📦 Installing backend dependencies with better-sqlite3..."
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
rm -rf node_modules package-lock.json
npm install

# Build frontend for production
echo "🔨 Building frontend for production..."
npm run build
cd ..

# Update ecosystem.config.js for domain deployment
echo "⚙️ Updating PM2 configuration for domain deployment..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'bidalbania-backend',
      script: './backend/app.js',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 7700
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 7700
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true
    },
    {
      name: 'bidalbania-frontend',
      script: 'npx',
      args: 'vite preview --host 0.0.0.0 --port 8085',
      cwd: './frontend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8085
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8085
      },
      error_file: '../logs/frontend-error.log',
      out_file: '../logs/frontend-out.log',
      log_file: '../logs/frontend-combined.log',
      time: true
    }
  ]
};
EOF

# Start applications with PM2
echo "🚀 Starting applications with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Setup PM2 to start on system boot
echo "🔧 Setting up PM2 startup script..."
pm2 startup

echo "✅ Domain deployment completed!"
echo ""
echo "📊 PM2 Status:"
pm2 status
echo ""
echo "🌐 Applications should be running on:"
echo "  Frontend: http://localhost:8085"
echo "  Backend:  http://localhost:7700"
echo ""
echo "🔍 CORS Configuration includes:"
echo "  - localhost:8080, localhost:8085, localhost:7700"
echo "  - 192.168.1.237:8080, 192.168.1.237:8085, 192.168.1.237:7700"
echo "  - 161.35.211.94:8080, 161.35.211.94:8085, 161.35.211.94:7700"
echo "  - https://bidalbania.al, https://www.bidalbania.al"
echo "  - http://bidalbania.al, http://www.bidalbania.al"
echo ""
echo "🌐 Domain Configuration:"
echo "  - Frontend: https://bidalbania.al (or http://bidalbania.al)"
echo "  - Backend API: https://bidalbania.al:7700/api (or http://bidalbania.al:7700/api)"
echo "  - API calls will automatically match the frontend protocol"
echo ""
echo "📋 Useful commands:"
echo "  pm2 status          - Check application status"
echo "  pm2 logs            - View logs"
echo "  pm2 restart all     - Restart all applications"
echo "  ./test-cors.sh      - Test CORS configuration"
echo "  ./check-status.sh   - Check application status"
echo ""
echo "🔍 To test domain connectivity:"
echo "  curl -H 'Origin: https://bidalbania.al' http://localhost:7700/api/requests/all"
echo ""
echo "💡 Domain advantages:"
echo "  - Professional domain name"
echo "  - Better SEO"
echo "  - Trusted by browsers"
echo "  - Automatic protocol matching (HTTP/HTTPS)" 