# BidAlbania Frontend

Frontend modern i ndërtuar me React për platformën BidAlbania - një platformë për të lidhur klientët me profesionistët e riparimit dhe përmirësimit të shtëpive.

## Teknologjitë e Përdorura

- **React 18** - Framework-i kryesor
- **Vite** - Build tool i shpejtë
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling dhe design system
- **Lucide React** - Icons
- **Axios** - HTTP client
- **React Query** - State management për server state
- **@tailwindcss/forms** - Styling për formët

## Struktura e Projektit

```
src/
├── components/          # Komponentët e ripërdorshëm
│   ├── Header.jsx      # Header-i kryesor
│   ├── Footer.jsx      # Footer-i
│   └── ProtectedRoute.jsx # Route protection
├── pages/              # Faqet kryesore
│   ├── Home.jsx        # Faqja kryesore
│   ├── Login.jsx       # Faqja e login
│   ├── Signup.jsx      # Faqja e regjistrimit
│   ├── Profile.jsx     # Faqja e profilit
│   └── RequestForm.jsx # Forma e kërkesës
├── contexts/           # React contexts
│   └── AuthContext.jsx # Context për autentikim
├── services/           # API services
│   └── authService.js  # Shërbimet e autentikimit
├── hooks/              # Custom hooks
└── assets/             # Imazhe dhe resources
```

## Karakteristikat

### 🎨 Design Modern
- UI/UX i modern dhe responsive
- Design system i konsistent me Tailwind CSS
- Ikonat e bukura me Lucide React
- Animacione të buta dhe transitions

### 🔐 Autentikim i Sigurt
- Login dhe signup me validim
- JWT token management
- Protected routes
- Context-based state management

### 📱 Responsive Design
- Mobile-first approach
- Përshtatje e përsosur për të gjitha madhësitë e ekranit
- Navigation e përmirësuar për mobile

### ⚡ Performance
- Vite për build të shpejtë
- Code splitting automatik
- Lazy loading për komponentët
- Optimizim i imazheve

## Instalimi dhe Ekzekutimi

1. **Instalimi i dependencies:**
   ```bash
   npm install
   ```

2. **Ekzekutimi në development:**
   ```bash
   npm run dev
   ```

3. **Build për production:**
   ```bash
   npm run build
   ```

4. **Preview i build:**
   ```bash
   npm run preview
   ```

## Konfigurimi

### Environment Variables
Krijo një file `.env` në root të frontend:

```env
VITE_API_URL=http://localhost:7700/api
```

### Tailwind CSS
Tailwind është konfiguruar me custom colors dhe fonts:

- **Primary colors**: Ngjyra kryesore e brand-it
- **Custom fonts**: Inter për text, Montserrat për headings
- **Custom components**: Buttons, inputs, cards

## API Integration

Frontend-i komunikon me backend-in përmes:

- **Auth endpoints**: `/api/auth/*`
- **Request endpoints**: `/api/requests/*`
- **Axios interceptors** për token management
- **Error handling** automatik

## Komponentët Kryesorë

### Header
- Navigation responsive
- Search functionality
- User menu me dropdown
- Mobile menu

### Home Page
- Hero section me search
- Services showcase
- How it works section
- Testimonials
- Call-to-action

### Request Form
- Multi-step form
- Category selection
- Project details
- Preferences and budget
- Progress indicator

### Profile Page
- User information editing
- Statistics dashboard
- Recent activity
- Quick actions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - shiko LICENSE file për më shumë detaje.
