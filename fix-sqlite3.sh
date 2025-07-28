#!/bin/bash

echo "🔧 Fixing SQLite3 Architecture Issue..."
echo "======================================"

# Stop PM2 processes
echo "🛑 Stopping PM2 processes..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# Go to backend directory
cd backend

echo "🧹 Removing existing SQLite3 installation..."
rm -rf node_modules package-lock.json

echo "📦 Installing dependencies without SQLite3..."
npm install --ignore-scripts

echo "🔨 Installing SQLite3 with proper build tools..."
# Install build tools
npm install -g node-gyp

# Force rebuild SQLite3 for current platform
echo "🔨 Rebuilding SQLite3 for Linux..."
npm install sqlite3 --build-from-source

# Alternative: Try with specific version
if [ $? -ne 0 ]; then
    echo "🔄 Trying alternative SQLite3 installation..."
    npm uninstall sqlite3
    npm install sqlite3@5.1.6 --build-from-source
fi

# Verify installation
echo "✅ Verifying SQLite3 installation..."
node -e "const sqlite3 = require('sqlite3'); console.log('SQLite3 version:', sqlite3.VERSION); console.log('SQLite3 source:', sqlite3.SOURCE);"

cd ..

echo "🚀 Starting applications..."
pm2 start ecosystem.config.js --env production

echo "📊 PM2 Status:"
pm2 status

echo "✅ SQLite3 fix completed!" 