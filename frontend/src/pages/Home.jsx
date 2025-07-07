import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Users, Award, Shield, Clock, MapPin, ArrowRight, X } from 'lucide-react';
import homeSearchImage from '../assets/home-search.jpg';
import img1 from '../assets/1.webp';
import img2 from '../assets/2.webp';
import img3 from '../assets/3.webp';
import img4 from '../assets/4.webp';
import img5 from '../assets/5.webp';
import img7 from '../assets/7.webp';
import img8 from '../assets/8.webp';
import img9 from '../assets/9.webp';
import img13 from '../assets/13.webp';
import img14 from '../assets/14.webp';
import img20 from '../assets/20.webp';
import img25 from '../assets/25.webp';
import img26 from '../assets/26.webp';
import img29 from '../assets/29.webp';
import './Home.css';

const categoryTabs = [
  'Shërbimet e përditshme',
  'Ambjentet e jashtme',
  'Punë të jashtme',
  'Punë të brëndshme',
  'Rinovim',
];

const categories = [
  { 
    name: 'Elektricist', 
    image: img3, 
    tab: 0,
    description: 'Shërbime profesionale elektrike për shtëpinë dhe biznesin',
    rating: 4.8,
    professionals: 45
  },
  { 
    name: 'Hidraulik', 
    image: img2, 
    tab: 0,
    description: 'Riparime dhe instalime hidraulike të cilësisë së lartë',
    rating: 4.7,
    professionals: 38
  },
  { 
    name: 'Pastrim', 
    image: img1, 
    tab: 0,
    description: 'Shërbime pastrimi profesionale për shtëpi dhe zyra',
    rating: 4.9,
    professionals: 52
  },
  { 
    name: 'Pikturë & Lyerje', 
    image: img4, 
    tab: 0,
    description: 'Pikturë dhe lyerje profesionale për çdo sipërfaqe',
    rating: 4.6,
    professionals: 29
  },
  { 
    name: 'Mobilieri', 
    image: img5, 
    tab: 0,
    description: 'Instalim dhe riparim mobilieri për çdo nevojë',
    rating: 4.5,
    professionals: 23
  },
  { 
    name: 'Kopshtari', 
    image: img7, 
    tab: 1,
    description: 'Kujdesje profesionale për oborrin dhe pemët',
    rating: 4.8,
    professionals: 31
  },
  { 
    name: 'Punime Druri', 
    image: img8, 
    tab: 1,
    description: 'Punime druri të cilësisë së lartë për shtëpinë',
    rating: 4.7,
    professionals: 19
  },
  { 
    name: 'Gardhe', 
    image: img9, 
    tab: 1,
    description: 'Instalim dhe riparim gardhe profesionale',
    rating: 4.6,
    professionals: 27
  },
  { 
    name: 'Çati & Ulluqe', 
    image: img13, 
    tab: 2,
    description: 'Riparime çati dhe ulluqesh të specializuara',
    rating: 4.8,
    professionals: 15
  },
  { 
    name: 'Dyer & Dritare', 
    image: img14, 
    tab: 2,
    description: 'Instalim dhe riparim dyer dhe dritaresh',
    rating: 4.7,
    professionals: 22
  },
  { 
    name: 'Ngrohje & Ftohje', 
    image: img20, 
    tab: 3,
    description: 'Sisteme ngrohje dhe ftohje profesionale',
    rating: 4.9,
    professionals: 18
  },
  { 
    name: 'Rinovim Kuzhine', 
    image: img25, 
    tab: 4,
    description: 'Rinovim i plotë kuzhine me dizajn modern',
    rating: 4.8,
    professionals: 25
  },
  { 
    name: 'Rinovim Banjo', 
    image: img26, 
    tab: 4,
    description: 'Rinovim banjo me materiale të cilësisë së lartë',
    rating: 4.7,
    professionals: 21
  },
  { 
    name: 'Transport', 
    image: img5, 
    tab: 4,
    description: 'Shërbime transporti për çdo lloj ngarkese',
    rating: 4.6,
    professionals: 33
  },
  { 
    name: 'Inspektim Shtëpie', 
    image: img29, 
    tab: 4,
    description: 'Inspektim profesional i shtëpisë para blerjes',
    rating: 4.9,
    professionals: 12
  },
];

const popularServices = [
  { name: 'Elektricist', icon: '💡', count: '150+ profesionistë' },
  { name: 'Hidraulik', icon: '🚿', count: '120+ profesionistë' },
  { name: 'Pastrim', icon: '🧹', count: '200+ profesionistë' },
  { name: 'Pikturë', icon: '🎨', count: '85+ profesionistë' },
  { name: 'Mobilieri', icon: '🪑', count: '65+ profesionistë' },
  { name: 'Kopshtari', icon: '🌳', count: '95+ profesionistë' },
  { name: 'Çati', icon: '🏠', count: '45+ profesionistë' },
  { name: 'Transport', icon: '🚚', count: '110+ profesionistë' },
];

const stats = [
  { number: '2,500+', label: 'Profesionistë të verifikuar' },
  { number: '15,000+', label: 'Projekte të përfunduara' },
  { number: '4.8', label: 'Vlerësim mesatar' },
  { number: '98%', label: 'Klientë të kënaqur' },
];

const Home = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const API_URL = 'http://localhost:7700/api';

  // Search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowSuggestions(false);
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(`${API_URL}/requests/search?query=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (res.ok) {
          setSearchResults(data.slice(0, 5)); // Limit to 5 suggestions
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      }
      setIsSearching(false);
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or category page
      console.log('Searching for:', searchQuery);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title);
    setShowSuggestions(false);
    // Navigate to the specific request or category
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.hero-search')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredCategories = categories.filter(cat => cat.tab === activeTab);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Gjeni profesionistët e duhur për çdo projekt
            </h1>
            <p className="hero-subtitle">
              Lidhuni me profesionistë të verifikuar dhe të besueshëm për të gjitha nevojat e shtëpisë dhe biznesit tuaj
            </p>
            <form onSubmit={handleSearch} className="hero-search">
              <div className="search-input-container">
                <Search className="w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Çfarë shërbimi ju nevojitet?"
                  className="hero-search-input"
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    onClick={clearSearch}
                    className="clear-search-btn"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button type="submit" className="hero-search-btn">
                Kërko
              </button>
              
              {/* Search Suggestions */}
              {showSuggestions && (searchResults.length > 0 || isSearching) && (
                <div className="search-suggestions">
                  {isSearching ? (
                    <div className="suggestion-item loading">
                      <div className="loading-spinner"></div>
                      <span>Duke kërkuar...</span>
                    </div>
                  ) : (
                    searchResults.map((result, index) => (
                      <div 
                        key={index} 
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(result)}
                      >
                        <div className="suggestion-content">
                          <h4>{result.title}</h4>
                          <p>{result.category} • {result.city}</p>
                        </div>
                        <span className="suggestion-budget">{result.budget}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </form>
          </div>
          <div className="hero-image">
            <img src={homeSearchImage} alt="Profesionistë në punë" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="categories-container">
          <div className="section-header">
            <h2 className="section-title">Shërbimet tona</h2>
            <p className="section-subtitle">
              Zgjidhni nga një gamë e gjerë shërbimesh profesionale të ofruara nga ekspertë të verifikuar
            </p>
          </div>

          <div className="category-tabs">
            {categoryTabs.map((tab, index) => (
              <button
                key={tab}
                onClick={() => setActiveTab(index)}
                className={`category-tab ${activeTab === index ? 'active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="categories-grid">
            {filteredCategories.map((category, index) => (
              <Link 
                key={index} 
                to={`/category/${encodeURIComponent(category.name)}`}
                className="category-card"
              >
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="category-image"
                />
                <div className="category-content">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-description">{category.description}</p>
                  <div className="category-meta">
                    <div className="category-rating">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{category.rating}</span>
                    </div>
                    <span>{category.professionals} profesionistë</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/request" className="cta-btn-primary">
              Shiko të gjitha shërbimet
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="popular-services">
        <div className="popular-container">
          <div className="section-header">
            <h2 className="section-title">Shërbimet më të kërkuara</h2>
            <p className="section-subtitle">
              Këto janë shërbimet më popullore që klientët tanë kërkojnë më shpesh
            </p>
          </div>

          <div className="services-grid">
            {popularServices.map((service, index) => (
              <div key={index} className="service-card">
                <span className="service-icon">{service.icon}</span>
                <h3 className="service-name">{service.name}</h3>
                <p className="service-count">{service.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="categories-section">
        <div className="categories-container">
          <div className="section-header">
            <h2 className="section-title">Pse të zgjidhni BidAlbania?</h2>
            <p className="section-subtitle">
              Platforma jonë ofron siguri, cilësi dhe besueshmëri për çdo projekt
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <Shield className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="stat-label" style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Profesionistë të Verifikuar</h3>
              <p className="category-description">Të gjithë profesionistët tanë janë verifikuar dhe të sigurt</p>
            </div>
            <div className="stat-card">
              <Award className="w-12 h-12 text-green-600 mb-4 mx-auto" />
              <h3 className="stat-label" style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Cilësi e Garantuar</h3>
              <p className="category-description">Punë me cilësi të lartë dhe garanci për çdo shërbim</p>
            </div>
            <div className="stat-card">
              <Clock className="w-12 h-12 text-orange-600 mb-4 mx-auto" />
              <h3 className="stat-label" style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Shpejtësi</h3>
              <p className="category-description">Përgjigje e shpejtë dhe përfundim i projekteve në kohë</p>
            </div>
            <div className="stat-card">
              <MapPin className="w-12 h-12 text-red-600 mb-4 mx-auto" />
              <h3 className="stat-label" style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Gjithë Shqipëria</h3>
              <p className="category-description">Shërbime në të gjitha qytetet e Shqipërisë</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Gati për të filluar projektin tuaj?</h2>
          <p className="cta-description">
            Lidhuni me profesionistët më të mirë dhe merrni ofertat më të mira për projektin tuaj
          </p>
          <div className="cta-buttons">
            <Link to="/request" className="cta-btn-primary">
              Fillo një projekt
            </Link>
            <Link to="/signup" className="cta-btn-secondary">
              Regjistrohu si profesionist
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
