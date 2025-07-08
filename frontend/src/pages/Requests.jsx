import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, DollarSign, Clock, Filter, Eye, User } from 'lucide-react';
import './Requests.css';

const API_URL = 'http://localhost:7700/api';

const PAGE_SIZE = 20;

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const categories = [
    'Elektricist', 'Hidraulik', 'Pastrim', 'Pikturë', 'Mobilieri', 'Kopshtari',
    'Transport', 'Kondicionerë', 'Dysheme & Parket', 'IT & Teknologji', 'Çati', 'Dyer & Dritare', 'Gips & Suvatime', 'Shtrime pllaka', 'Izolim', 'Dekorim', 'Rinovim i plotë', 'Kuzhina', 'Banjo', 'Sisteme ngrohje & ftohje'
  ];

  const cities = [
    'Tiranë', 'Durrës', 'Vlorë', 'Shkodër', 'Elbasan', 'Fier', 'Berat', 'Korçë'
  ];

  // Load requests with pagination and filters
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('pageSize', PAGE_SIZE);
        if (searchQuery) params.append('search', searchQuery);
        if (selectedCategory) params.append('category', selectedCategory);
        if (selectedCity) params.append('city', selectedCity);
        if (sortBy) params.append('sort', sortBy);
        const res = await fetch(`${API_URL}/requests/all?${params.toString()}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Gabim në ngarkimin e kërkesave.');
          setRequests([]);
          setTotal(0);
        } else {
          setRequests(data.requests || []);
          setTotal(data.total || 0);
          console.log('API DATA:', data, 'REQUESTS:', data.requests);
        }
      } catch (err) {
        setError('Gabim në rrjet.');
        setRequests([]);
        setTotal(0);
      }
      setLoading(false);
    };
    fetchRequests();
  }, [page, searchQuery, selectedCategory, selectedCity, sortBy]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCity('');
    setSortBy('newest');
    setPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('sq-AL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyText = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'I Urgjent';
      case 'high': return 'I Lartë';
      case 'normal': return 'Normal';
      case 'low': return 'I Ulët';
      default: return 'Normal';
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Duke ngarkuar kërkesat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kërkesat e Publikuara
          </h1>
          <p className="text-gray-600">
            Gjeni dhe aplikoni për kërkesat që ju interesojnë
          </p>
        </div>

        {/* Search and Filters */}
        <div className="filters-card">
          <div className="filters-grid">
            {/* Search */}
            <div className="relative">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Kërko kërkesa..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="search-input"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className="filters-select"
            >
              <option value="">Të gjitha kategoritë</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => { setSelectedCity(e.target.value); setPage(1); }}
              className="filters-select"
            >
              <option value="">Të gjitha qytetet</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="filters-select"
            >
              <option value="newest">Më të rejat</option>
              <option value="oldest">Më të vjetrat</option>
              <option value="budget-high">Buxhet i lartë</option>
              <option value="budget-low">Buxhet i ulët</option>
              <option value="urgent">Urgjente</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(searchQuery || selectedCategory || selectedCity || sortBy !== 'newest') && (
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={clearFilters}
                className="clear-filters-btn"
              >
                Fshi filtrat
              </button>
              <span className="filters-summary">
                {total} kërkesa u gjetën
              </span>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Requests Grid */}
        {loading ? (
          <div className="min-h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="ml-4 text-gray-600">Duke ngarkuar kërkesat...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nuk u gjetën kërkesa
            </h3>
            <p className="text-gray-600">
              Provoni të ndryshoni filtrat ose kërkoni për diçka tjetër
            </p>
          </div>
        ) : (
          <>
            <div className="requests-grid">
              {requests.map((request) => (
                <div key={request.id} className="request-card">
                  <div className="request-header">
                    <h3 className="request-title">{request.title}</h3>
                    <span className={`urgency-badge ${request.urgency}`}>{getUrgencyText(request.urgency)}</span>
                  </div>
                  <div className="request-meta">
                    <span className="meta-item">
                      <MapPin className="meta-icon" />
                      {request.city}
                    </span>
                    <span className="meta-item">
                      <Calendar className="meta-icon" />
                      {formatDate(request.createdAt)}
                    </span>
                    {request.budget && (
                      <span className="meta-item">
                        <DollarSign className="meta-icon" />
                        {request.budget}
                      </span>
                    )}
                  </div>
                  <p className="request-description">
                    {request.description.length > 150
                      ? `${request.description.substring(0, 150)}...`
                      : request.description}
                  </p>
                  <div className="request-details">
                    {request.propertyType && (
                      <span className="detail-tag">{request.propertyType}</span>
                    )}
                    {request.propertySize && (
                      <span className="detail-tag">{request.propertySize}</span>
                    )}
                    {request.contactPreference && (
                      <span className="detail-tag">{request.contactPreference}</span>
                    )}
                  </div>
                  <div className="request-footer">
                    <div className="request-stats">
                      <span>👁️ {request.views || 0} pamje</span>
                      <span>💬 {request.responses || 0} përgjigje</span>
                    </div>
                    <button className="contact-btn">
                      Kontakto
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="pagination-btn"
                >
                  &larr;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`pagination-btn${p === page ? ' active' : ''}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="pagination-btn"
                >
                  &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Requests;