# 🚀 BidAlbania - Development Setup

## Quick Start

### 1. Instalimi i Dependencies
```bash
npm run install:all
```

### 2. Konfigurimi i Environment Variables

**Backend** (`backend/.env`):
```env
PORT=7700
JWT_SECRET=your_super_secret_jwt_key_here
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:7700/api
```

### 3. Startimi i Aplikacionit
```bash
npm run dev
```

## 🌐 URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:7700
- **API Health Check**: http://localhost:7700

## 📋 Komandat e Dobishme

```bash
# Start të dyja (development)
npm run dev

# Start vetëm backend
npm run dev:backend

# Start vetëm frontend
npm run dev:frontend

# Build frontend për production
npm run build

# Start backend për production
npm start

# Instalimi i dependencies
npm run install:all
```

## 🔧 Troubleshooting

### Problemi: Porta 7700 është e zënë
```bash
# Gjej procesin që përdor portën
lsof -i :7700

# Fshi procesin
kill -9 <PID>
```

### Problemi: Porta 5173 është e zënë
```bash
# Gjej procesin që përdor portën
lsof -i :5173

# Fshi procesin
kill -9 <PID>
```

### Problemi: npm cache
```bash
# Rregullo permissions
sudo chown -R 501:20 "/Users/andishkembi/.npm"

# Ose fshi cache
npm cache clean --force
```

## 📱 Testimi

1. **Frontend**: Hap http://localhost:5173
2. **Backend**: Testo http://localhost:7700
3. **API**: Testo http://localhost:7700/api

## 🎯 Features të Gatshme

- ✅ Authentication (Login/Signup)
- ✅ Protected Routes
- ✅ Responsive Design
- ✅ Modern UI/UX
- ✅ API Integration
- ✅ Form Validation
- ✅ Error Handling

## 🚧 TODO

- [ ] Dashboard për profesionistët
- [ ] Sistem i vlerësimeve
- [ ] Chat functionality
- [ ] Payment integration
- [ ] Email notifications
- [ ] Search dhe filtering
- [ ] File upload
- [ ] Real-time updates

---

**Happy Coding! 🎉** 