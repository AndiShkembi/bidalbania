# 🏠 BidAlbania

Platforma më e besueshme për të gjetur dhe rezervuar shërbime lokale të riparimit dhe përmirësimit të shtëpive në Shqipëri.

## 🚀 Karakteristikat

- **🔍 Kërkim i Shpejtë**: Gjeni profesionistët më të mirë në zonën tuaj
- **💰 Oferta të Transparenta**: Merrni oferta të qarta dhe të krahasueshme
- **⭐ Vlerësime të Besueshme**: Lexoni komente nga klientët e tjerë
- **📱 Responsive Design**: Përdorni në çdo pajisje
- **🔐 Siguri e Plotë**: Autentikim i sigurt dhe të dhëna të mbrojtura

## 🛠️ Teknologjitë

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Query** - State management
- **Lucide React** - Icons

## 📁 Struktura e Projektit

```
bidalbania/
├── backend/                 # Backend API
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── config/           # Configuration files
│   └── app.js           # Main server file
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   ├── services/     # API services
│   │   └── hooks/        # Custom hooks
│   └── public/           # Static assets
└── package.json          # Root package.json
```

## 🚀 Instalimi dhe Ekzekutimi

### 1. Klonimi i Projektit
```bash
git clone https://github.com/AndiShkembi/bidalbania.git
cd bidalbania
```

### 2. Instalimi i Dependencies
```bash
# Instalimi i të gjitha dependencies (backend + frontend)
npm run install:all
```

### 3. Konfigurimi i Environment Variables

Krijo një file `.env` në direktorinë `backend/`:
```env
PORT=7700
JWT_SECRET=your_jwt_secret_here
```

Krijo një file `.env` në direktorinë `frontend/`:
```env
VITE_API_URL=http://localhost:7700/api
```

### 4. Ekzekutimi i Aplikacionit

#### Development (të dyja njëkohësisht)
```bash
npm run dev
```

#### Ose veçmas:
```bash
# Backend vetëm
npm run dev:backend

# Frontend vetëm  
npm run dev:frontend
```

#### Production
```bash
# Build frontend
npm run build

# Start backend
npm start
```

## 🌐 Portat

- **Backend API**: `http://localhost:7700`
- **Frontend**: `http://localhost:5173`

## 📋 API Endpoints

### Autentikim
- `POST /api/auth/signup` - Regjistrim i përdoruesit
- `POST /api/auth/login` - Identifikim
- `GET /api/auth/profile` - Marrja e profilit

### Kërkesat
- `POST /api/requests` - Krijo kërkesë të re
- `GET /api/requests` - Merr të gjitha kërkesat
- `GET /api/requests/:id` - Merr kërkesë specifike
- `PUT /api/requests/:id` - Përditëso kërkesë
- `DELETE /api/requests/:id` - Fshi kërkesë

## 🎨 Komponentët e Frontend

### Faqet Kryesore
- **Home** - Faqja kryesore me hero section dhe shërbime
- **Login** - Identifikim i përdoruesit
- **Signup** - Regjistrim i përdoruesit të ri
- **Profile** - Menaxhim i profilit dhe aktivitetet
- **Request Form** - Krijimi i kërkesave të reja

### Komponentët
- **Header** - Navigation dhe search
- **Footer** - Links dhe informacione
- **ProtectedRoute** - Mbrojtja e faqeve
- **AuthContext** - Menaxhim i autentikimit

## 🔧 Komandat e Dobishme

```bash
# Instalimi i dependencies
npm run install:all

# Development
npm run dev

# Build për production
npm run build

# Start vetëm backend
npm run dev:backend

# Start vetëm frontend
npm run dev:frontend

# Start production backend
npm start
```

## 🧪 Testimi

1. **Backend**: Sigurohuni që serveri të jetë duke punuar në portën 7700
2. **Frontend**: Hapni `http://localhost:5173` në browser
3. **API**: Testoni endpoints në `http://localhost:7700/api`

## 📱 Responsive Design

Aplikacioni është plotësisht responsive dhe funksionon në:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1280px+)

## 🔐 Siguria

- **JWT Tokens** për autentikim
- **Password Hashing** me bcryptjs
- **CORS** konfiguruar
- **Input Validation** në të dyja anët
- **Protected Routes** në frontend

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Upload dist/ folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Deploy me environment variables
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Ky projekt është i licencuar nën MIT License - shiko file-in [LICENSE](LICENSE) për më shumë detaje.

## 📞 Kontakti

- **Email**: info@bidalbania.al
- **Website**: https://bidalbania.al
- **GitHub**: https://github.com/AndiShkembi/bidalbania

---

**BidAlbania** - Lidhni me profesionistët më të mirë për shtëpinë tuaj! 🏠✨ 