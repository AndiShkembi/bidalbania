#!/bin/bash

echo "🚀 Starting BidAlbania Server Deployment..."
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

# Clean backend dependencies and rebuild for Linux
echo "🧹 Cleaning backend dependencies..."
cd backend
rm -rf node_modules package-lock.json
echo "📦 Installing backend dependencies for Linux..."
npm install
# Force rebuild SQLite3 for current platform
echo "🔨 Rebuilding SQLite3 for Linux..."
npm rebuild sqlite3
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

# Update ecosystem.config.js for server deployment
echo "⚙️ Updating PM2 configuration for server..."
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

echo "✅ Server deployment completed!"
echo ""
echo "📊 PM2 Status:"
pm2 status
echo ""
echo "📋 Useful commands:"
echo "  pm2 status          - Check application status"
echo "  pm2 logs            - View logs"
echo "  pm2 restart all     - Restart all applications"
echo "  pm2 stop all        - Stop all applications"
echo "  pm2 delete all      - Delete all applications"
echo ""
echo "🌐 Applications should be running on:"
echo "  Frontend: http://localhost:8085"
echo "  Backend:  http://localhost:7700"
echo ""
echo "🔍 To check if everything is working:"
echo "  curl http://localhost:7700"
echo "  curl http://localhost:8085" 