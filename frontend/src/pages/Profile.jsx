import { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, X, LogOut, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import './Profile.css';

const API_URL = 'http://localhost:7700/api';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState('');
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [requestForm, setRequestForm] = useState({
    title: '',
    description: '',
    category: '',
    city: '',
    address: '',
    desiredDate: '',
    budget: ''
  });
  const [requestMsg, setRequestMsg] = useState({ type: '', text: '' });

  // Helper: get token
  const getToken = () => localStorage.getItem('token');

  // Load profile
  useEffect(() => {
    const fetchProfile = async () => {
      setProfileError('');
      const token = getToken();
      if (!token) {
        window.location.href = '/login';
        return;
      }
      try {
        const res = await fetch(`${API_URL}/auth/profile`, {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        if (!res.ok) {
          setProfileError(data.message || 'Nuk mund të ngarkohet profili.');
          setProfile(null);
          if (res.status === 401 || res.status === 403) setTimeout(() => logout(), 1500);
        } else {
          setProfile(data);
          setFormData({
            name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || ''
          });
        }
      } catch (err) {
        setProfileError('Gabim në rrjet.');
        setProfile(null);
      }
    };
    fetchProfile();
  }, []);

  // Load user requests
  const loadUserRequests = async () => {
    setRequestsLoading(true);
    setRequestsError('');
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/requests`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      if (!res.ok) {
        setRequestsError('Nuk mund të ngarkohen kërkesat.');
        setRequests([]);
      } else {
        setRequests(data);
      }
    } catch (err) {
      setRequestsError('Gabim në rrjet.');
      setRequests([]);
    }
    setRequestsLoading(false);
  };
  useEffect(() => {
    if (activeTab === 'my-requests') loadUserRequests();
  }, [activeTab]);

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Profile edit logic
  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleProfileSave = async () => {
    // TODO: Implement profile update API
    setIsEditing(false);
  };
  const handleProfileCancel = () => {
    if (profile)
      setFormData({
        name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || ''
      });
    setIsEditing(false);
  };

  // Request form logic
  const handleRequestChange = (e) => {
    setRequestForm({ ...requestForm, [e.target.name]: e.target.value });
  };
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setRequestMsg({ type: '', text: '' });
    const token = getToken();
    // Basic validation
    if (!requestForm.title || !requestForm.description || !requestForm.category || !requestForm.city) {
      setRequestMsg({ type: 'error', text: 'Ju lutem plotësoni të gjitha fushat e detyrueshme.' });
      return;
    }
    try {
      const res = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(requestForm)
      });
      const data = await res.json();
      if (!res.ok) {
        setRequestMsg({ type: 'error', text: data.message || 'Gabim në postimin e kërkesës.' });
      } else {
        setRequestMsg({ type: 'success', text: data.message || 'Kërkesa u postua me sukses!' });
        setRequestForm({ title: '', description: '', category: '', city: '', address: '', desiredDate: '', budget: '' });
        loadUserRequests();
      }
    } catch (err) {
      setRequestMsg({ type: 'error', text: 'Gabim në rrjet.' });
    }
  };

  // Tabs UI
  const renderTabs = () => (
    <div className="profile-tabs-bar">
      <button className={`profile-tab-btn${activeTab === 'profile' ? ' active' : ''}`} onClick={() => setActiveTab('profile')}>Profili im</button>
      <button className={`profile-tab-btn${activeTab === 'post-request' ? ' active' : ''}`} onClick={() => setActiveTab('post-request')}>Posto Kërkesë</button>
      <button className={`profile-tab-btn${activeTab === 'my-requests' ? ' active' : ''}`} onClick={() => setActiveTab('my-requests')}>Kërkesat e mia</button>
      <button className="logout-btn-top" onClick={logout}><LogOut className="profile-btn-icon" /> Dil</button>
    </div>
  );

  // Profile tab
  const renderProfileTab = () => (
    <div className="profile-card">
      <div className="profile-logo-circle">
        <span className="profile-logo-text">BA</span>
      </div>
      <h1 className="profile-title">Profili Im</h1>
      {profileError && (
        <div className="error-message">
          <AlertCircle className="profile-btn-icon" />
          {profileError}
        </div>
      )}
      <form className="profile-form" onSubmit={e => e.preventDefault()}>
        <div className="profile-input-group">
          <User className="profile-input-icon" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleProfileChange}
            disabled={!isEditing}
            className="profile-input"
            placeholder="Emri i Plotë"
          />
        </div>
        <div className="profile-input-group">
          <Mail className="profile-input-icon" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleProfileChange}
            disabled={!isEditing}
            className="profile-input"
            placeholder="Email"
          />
        </div>
        <div className="profile-input-group">
          <Phone className="profile-input-icon" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleProfileChange}
            disabled={!isEditing}
            className="profile-input"
            placeholder="Numri i Telefonit"
          />
        </div>
        <div className="profile-input-group">
          <MapPin className="profile-input-icon" />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleProfileChange}
            disabled={!isEditing}
            className="profile-input"
            placeholder="Adresa"
          />
        </div>
        <div className="profile-btn-group">
          {!isEditing ? (
            <button type="button" className="profile-btn profile-btn-edit" onClick={() => setIsEditing(true)}>
              <Edit className="profile-btn-icon" /> Edito
            </button>
          ) : (
            <>
              <button type="button" className="profile-btn profile-btn-save" onClick={handleProfileSave}>
                <Save className="profile-btn-icon" /> Ruaj
              </button>
              <button type="button" className="profile-btn profile-btn-cancel" onClick={handleProfileCancel}>
                <X className="profile-btn-icon" /> Anulo
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );

  // Post request tab
  const renderPostRequestTab = () => (
    <div className="profile-card">
      <h1 className="profile-title">Posto një kërkesë të re</h1>
      {requestMsg.text && (
        <div className={requestMsg.type === 'success' ? 'success-message' : 'error-message'}>
          {requestMsg.type === 'success' ? <CheckCircle className="profile-btn-icon" /> : <AlertCircle className="profile-btn-icon" />}
          {requestMsg.text}
        </div>
      )}
      <form className="profile-form" onSubmit={handleRequestSubmit}>
        <div className="profile-input-group">
          <input
            type="text"
            name="title"
            value={requestForm.title}
            onChange={handleRequestChange}
            className="profile-input"
            placeholder="P.sh. Riparim dritareje"
            required
          />
        </div>
        <div className="profile-input-group">
          <textarea
            name="description"
            value={requestForm.description}
            onChange={handleRequestChange}
            className="profile-input"
            placeholder="Përshkruani problemin ose shërbimin që kërkoni..."
            rows={3}
            required
          />
        </div>
        <div className="profile-input-group">
          <select
            name="category"
            value={requestForm.category}
            onChange={handleRequestChange}
            className="profile-input"
            required
          >
            <option value="">Zgjidhni kategorinë</option>
            <option value="Elektricist">Elektricist</option>
            <option value="Hidraulik">Hidraulik</option>
            <option value="Pastrim">Pastrim</option>
            <option value="Pikturë">Pikturë & Lyerje</option>
            <option value="Mobilieri">Mobilieri</option>
            <option value="Kopshtari">Kopshtari</option>
            <option value="Transport">Transport</option>
            <option value="Tjetër">Tjetër</option>
          </select>
        </div>
        <div className="profile-input-group">
          <select
            name="city"
            value={requestForm.city}
            onChange={handleRequestChange}
            className="profile-input"
            required
          >
            <option value="">Zgjidhni qytetin</option>
            <option value="Tiranë">Tiranë</option>
            <option value="Durrës">Durrës</option>
            <option value="Vlorë">Vlorë</option>
            <option value="Shkodër">Shkodër</option>
            <option value="Elbasan">Elbasan</option>
            <option value="Fier">Fier</option>
            <option value="Berat">Berat</option>
            <option value="Lushnjë">Lushnjë</option>
            <option value="Kavajë">Kavajë</option>
            <option value="Gjirokastër">Gjirokastër</option>
            <option value="Lezhë">Lezhë</option>
            <option value="Krujë">Krujë</option>
            <option value="Kukës">Kukës</option>
            <option value="Pogradec">Pogradec</option>
            <option value="Sarandë">Sarandë</option>
            <option value="Tjetër">Tjetër</option>
          </select>
        </div>
        <div className="profile-input-group">
          <input
            type="text"
            name="address"
            value={requestForm.address}
            onChange={handleRequestChange}
            className="profile-input"
            placeholder="Adresa e plotë (opsionale)"
          />
        </div>
        <div className="profile-input-group">
          <input
            type="date"
            name="desiredDate"
            value={requestForm.desiredDate}
            onChange={handleRequestChange}
            className="profile-input"
          />
        </div>
        <div className="profile-input-group">
          <input
            type="text"
            name="budget"
            value={requestForm.budget}
            onChange={handleRequestChange}
            className="profile-input"
            placeholder="P.sh. 5000 Lekë"
          />
        </div>
        <div className="profile-btn-group">
          <button type="submit" className="profile-btn profile-btn-edit">Posto Kërkesën</button>
        </div>
      </form>
    </div>
  );

  // My requests tab
  const renderMyRequestsTab = () => (
    <div className="profile-card">
      <h1 className="profile-title">Kërkesat e mia</h1>
      {requestsLoading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Duke ngarkuar kërkesat...</p>
        </div>
      ) : requestsError ? (
        <div className="error-message">
          <AlertCircle className="profile-btn-icon" />
          {requestsError}
        </div>
      ) : !requests.length ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <p>Ende nuk keni postuar asnjë kërkesë.</p>
        </div>
      ) : (
        <div className="user-requests-list">
          {requests.map((req) => (
            <div key={req.id} className="user-request-card">
              <div className="user-request-title">
                {req.title}
                <span className="user-request-status">({req.status})</span>
              </div>
              <div className="user-request-meta">
                <span>{req.category}</span>
                <span>•</span>
                <span>{req.city}</span>
                <span>•</span>
                <span>{req.createdAt ? new Date(req.createdAt).toLocaleString() : ''}</span>
              </div>
              <div className="user-request-description">{req.description}</div>
              <div className="user-request-details">
                {req.budget && (
                  <div className="user-request-detail">
                    <strong>Bugeti:</strong> {req.budget}
                  </div>
                )}
                {req.desiredDate && (
                  <div className="user-request-detail">
                    <strong>Data e dëshiruar:</strong> {req.desiredDate}
                  </div>
                )}
                {req.address && (
                  <div className="user-request-detail">
                    <strong>Adresa:</strong> {req.address}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-tabs-container">
          {renderTabs()}
          <div className="profile-tabs-content">
            <div className={`profile-tab-content${activeTab === 'profile' ? ' active' : ''}`}>
              {renderProfileTab()}
            </div>
            <div className={`profile-tab-content${activeTab === 'post-request' ? ' active' : ''}`}>
              {renderPostRequestTab()}
            </div>
            <div className={`profile-tab-content${activeTab === 'my-requests' ? ' active' : ''}`}>
              {renderMyRequestsTab()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
