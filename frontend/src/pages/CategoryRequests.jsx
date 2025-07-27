import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, ArrowLeft, MapPin, Calendar, DollarSign, Clock, AlertCircle, Eye, MessageSquare } from 'lucide-react';
import './CategoryRequests.css';

const API_URL = 'http://localhost:7700/api';
const PAGE_SIZE = 20;

const CategoryRequests = () => {
  const { category } = useParams();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

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

  // Load requests for the category with pagination and search
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        params.append('category', category);
        params.append('page', page);
        params.append('pageSize', PAGE_SIZE);
        if (searchQuery) params.append('search', searchQuery);
        const res = await fetch(`${API_URL}/requests/all?${params.toString()}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Gabim në ngarkimin e kërkesave.');
          setRequests([]);
          setTotal(0);
        } else {
          setRequests(data.requests || []);
          setTotal(data.total || 0);
        }
      } catch (err) {
        setError('Gabim në rrjet.');
        setRequests([]);
        setTotal(0);
      }
      setLoading(false);
    };
    fetchRequests();
  }, [category, page, searchQuery]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Filter requests based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      // setFilteredRequests(requests); // This state is no longer used
    } else {
      // const filtered = requests.filter(req => 
      //   req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      //   req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      //   req.city.toLowerCase().includes(searchQuery.toLowerCase())
      // );
      // setFilteredRequests(filtered); // This state is no longer used
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
          Kthehu
        </Link>
        
        <div className="category-title">
          <span className="category-icon">{categoryIcons[category] || '📋'}</span>
          <h1>Kërkesat për {category}</h1>
          <p>{total} kërkesa të gjetura</p>
        </div>

        <div className="search-container">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Kërko në kërkesat e kësaj kategorie..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
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
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Duke ngarkuar kërkesat...</p>
            </div>
          ) : requests.length === 0 ? (
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
            <>
              <div className="requests-grid">
                {requests.map((request) => (
                  <Link to={`/request/${request.id}`} key={request.id} className="request-card-link">
                    <div className="request-card">
                      <div className="request-header">
                        <h3 className="request-title">{request.title}</h3>
                        <span className={`urgency-badge ${request.urgency}`}>{getUrgencyBadge(request.urgency)}</span>
                      </div>
                      <div className="request-meta">
                        <span className="meta-item">
                          <MapPin className="meta-icon" />
                          {request.city}
                        </span>
                        <span className="meta-item">
                          <Calendar className="meta-icon" />
                          {formatDate(request.desiredDate || request.createdAt)}
                        </span>
                        <span className="meta-item">
                          <DollarSign className="meta-icon" />
                          {request.budget} Lekë
                        </span>
                      </div>
                      <div className="request-description">
                        {request.description.length > 120 ? request.description.slice(0, 120) + '...' : request.description}
                      </div>
                      <div className="request-tags">
                        {request.propertyType && <span className="request-tag">{request.propertyType}</span>}
                        {request.propertySize && <span className="request-tag">{request.propertySize}</span>}
                        {request.contactPreference && <span className="request-tag">{request.contactPreference}</span>}
                      </div>
                      <div className="request-footer">
                        <span className="request-stats"><Eye className="footer-icon" /> {request.views || 0} pamje</span>
                        <span className="request-stats"><MessageSquare className="footer-icon" /> {request.responses || 0} përgjigje</span>
                        <button className="contact-btn" onClick={e => { e.preventDefault(); }}>Kontakto</button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <button
                    onClick={() => { if (page > 1) setPage(page - 1); }}
                    disabled={page === 1}
                    className={`px-3 py-1 rounded border ${page === 1 ? 'bg-gray-200 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                  >
                    &larr;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1 rounded border ${p === page ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => { if (page < totalPages) setPage(page + 1); }}
                    disabled={page === totalPages}
                    className={`px-3 py-1 rounded border ${page === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                  >
                    &rarr;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryRequests; 