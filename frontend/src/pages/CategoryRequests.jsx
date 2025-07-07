import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, ArrowLeft, MapPin, Calendar, DollarSign, Clock, AlertCircle } from 'lucide-react';
import './CategoryRequests.css';

const API_URL = 'http://localhost:7700/api';

const CategoryRequests = () => {
  const { category } = useParams();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRequests, setFilteredRequests] = useState([]);

  // Category icons mapping
  const categoryIcons = {
    'Elektricist': '⚡',
    'Hidraulik': '🔧',
    'Pastrim': '🧹',
    'Pikturë': '🎨',
    'Mobilieri': '🪑',
    'Kopshtari': '🌱',
    'Transport': '🚚',
    'Riparim': '🔨',
    'Siguri': '🔒',
    'Teknologji': '💻',
    'Tjetër': '📋'
  };

  // Load requests for the category
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/requests/category/${encodeURIComponent(category)}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Gabim në ngarkimin e kërkesave.');
          setRequests([]);
        } else {
          setRequests(data);
          setFilteredRequests(data);
        }
      } catch (err) {
        setError('Gabim në rrjet.');
        setRequests([]);
      }
      setLoading(false);
    };
    fetchRequests();
  }, [category]);

  // Filter requests based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRequests(requests);
    } else {
      const filtered = requests.filter(req => 
        req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRequests(filtered);
    }
  }, [searchQuery, requests]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('sq-AL');
  };

  // Get urgency badge
  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'urgent':
        return <span className="urgency-badge urgent">🚨 Urgjente</span>;
      case 'high':
        return <span className="urgency-badge high">⚡ E lartë</span>;
      case 'normal':
        return <span className="urgency-badge normal">📅 Normale</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="category-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Duke ngarkuar kërkesat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-container">
      <div className="category-header">
        <Link to="/" className="back-btn">
          <ArrowLeft className="back-icon" />
          Kthehu në shtëpi
        </Link>
        
        <div className="category-title">
          <span className="category-icon">{categoryIcons[category] || '📋'}</span>
          <h1>Kërkesat për {category}</h1>
          <p>{requests.length} kërkesa të gjetura</p>
        </div>

        <div className="search-container">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Kërko në kërkesat e kësaj kategorie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle className="error-icon" />
          {error}
        </div>
      )}

      {!error && (
        <div className="requests-content">
          {filteredRequests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>Nuk u gjetën kërkesa</h3>
              <p>
                {searchQuery 
                  ? `Nuk u gjetën kërkesa për "${searchQuery}" në kategorinë ${category}`
                  : `Nuk ka kërkesa të publikuara për kategorinë ${category}`
                }
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="clear-search-btn"
                >
                  Pastro kërkimin
                </button>
              )}
            </div>
          ) : (
            <div className="requests-grid">
              {filteredRequests.map((req) => (
                <div key={req.id} className="request-card">
                  <div className="request-header">
                    <h3 className="request-title">{req.title}</h3>
                    {getUrgencyBadge(req.urgency)}
                  </div>
                  
                  <div className="request-meta">
                    <span className="meta-item">
                      <MapPin className="meta-icon" />
                      {req.city}
                    </span>
                    <span className="meta-item">
                      <Calendar className="meta-icon" />
                      {formatDate(req.createdAt)}
                    </span>
                    {req.budget && (
                      <span className="meta-item">
                        <DollarSign className="meta-icon" />
                        {req.budget}
                      </span>
                    )}
                  </div>
                  
                  <p className="request-description">
                    {req.description.length > 150 
                      ? `${req.description.substring(0, 150)}...` 
                      : req.description
                    }
                  </p>
                  
                  <div className="request-details">
                    {req.propertyType && (
                      <span className="detail-tag">{req.propertyType}</span>
                    )}
                    {req.propertySize && (
                      <span className="detail-tag">{req.propertySize}</span>
                    )}
                    {req.contactPreference && (
                      <span className="detail-tag">{req.contactPreference}</span>
                    )}
                  </div>
                  
                  <div className="request-footer">
                    <div className="request-stats">
                      <span>👁️ {req.views || 0} pamje</span>
                      <span>💬 {req.responses || 0} përgjigje</span>
                    </div>
                    <button className="contact-btn">
                      Kontakto
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryRequests; 