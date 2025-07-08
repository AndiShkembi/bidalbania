import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, DollarSign, Clock, Filter, Eye, User } from 'lucide-react';
import './Requests.css';

const API_URL = 'http://localhost:7700/api';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    'Elektricist', 'Hidraulik', 'Pastrim', 'Pikturë', 'Mobilieri', 'Kopshtari'
  ];

  const cities = [
    'Tiranë', 'Durrës', 'Vlorë', 'Shkodër', 'Elbasan', 'Fier', 'Berat', 'Korçë'
  ];

  // Load requests
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/requests/all`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Gabim në ngarkimin e kërkesave.');
          setRequests([]);
        } else {
          setRequests(data);
        }
      } catch (err) {
        setError('Gabim në rrjet.');
        setRequests([]);
      }
      setLoading(false);
    };
    fetchRequests();
  }, []);

  // Filter and sort requests
  const filteredRequests = requests
    .filter(request => {
      const matchesSearch = !searchQuery || 
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || request.category === selectedCategory;
      const matchesCity = !selectedCity || request.city === selectedCity;
      
      return matchesSearch && matchesCategory && matchesCity;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'budget-high':
          return parseInt(b.budget) - parseInt(a.budget);
        case 'budget-low':
          return parseInt(a.budget) - parseInt(b.budget);
        case 'urgent':
          return a.urgency === 'urgent' ? -1 : 1;
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCity('');
    setSortBy('newest');
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Kërko kërkesa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Të gjitha kategoritë</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Të gjitha qytetet</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Fshi filtrat
              </button>
              <span className="text-sm text-gray-500">
                {filteredRequests.length} kërkesa u gjetën
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
        {filteredRequests.length === 0 ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {request.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <User className="h-4 w-4 mr-1" />
                        {request.firstName} {request.lastName}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                      {getUrgencyText(request.urgency)}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {request.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {request.city}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(request.createdAt)}
                    </div>
                    {request.budget && (
                      <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="h-4 w-4 mr-2" />
                        {request.budget}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye className="h-4 w-4 mr-1" />
                      {request.views || 0} shikime
                    </div>
                    <Link
                      to={`/request/${request.id}`}
                      className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                    >
                      Shiko detajet →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests; 