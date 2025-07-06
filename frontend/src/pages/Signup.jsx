import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import './Login.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Fjalëkalimet nuk përputhen');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Fjalëkalimi duhet të ketë të paktën 6 karaktere');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setError('');
    // Split name into firstName and lastName
    const [firstName, ...lastNameParts] = formData.name.trim().split(' ');
    const lastName = lastNameParts.join(' ') || '-';
    const userData = {
      firstName,
      lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    };
    const result = await signup(userData);
    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.error || 'Gabim në regjistrim. Ju lutem provoni përsëri.');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card minimalist-card">
        <div className="login-header minimalist-header">
          <div className="logo-container minimalist-logo">
            <div className="logo-circle minimalist-logo-circle">
              <span className="logo-text minimalist-logo-text">BA</span>
            </div>
          </div>
          <h2 className="login-title minimalist-title">Krijo Llogari</h2>
          <p className="login-subtitle minimalist-subtitle">
            <Link to="/login" className="signup-link">Identifikohu</Link>
          </p>
        </div>
        <form className="login-form minimalist-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message minimalist-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          <div className="input-group minimalist-input-group">
            <div className="input-wrapper minimalist-input-wrapper">
              <User className="input-icon minimalist-input-icon" />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="form-input minimalist-input"
                placeholder="Emri i Plotë"
              />
            </div>
          </div>
          <div className="input-group minimalist-input-group">
            <div className="input-wrapper minimalist-input-wrapper">
              <Mail className="input-icon minimalist-input-icon" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-input minimalist-input"
                placeholder="Email"
              />
            </div>
          </div>
          <div className="input-group minimalist-input-group">
            <div className="input-wrapper minimalist-input-wrapper">
              <Phone className="input-icon minimalist-input-icon" />
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="form-input minimalist-input"
                placeholder="Numri i Telefonit"
              />
            </div>
          </div>
          <div className="input-group minimalist-input-group">
            <div className="input-wrapper minimalist-input-wrapper">
              <Lock className="input-icon minimalist-input-icon" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="form-input minimalist-input"
                placeholder="Fjalëkalimi"
              />
              <button
                type="button"
                className="password-toggle minimalist-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="toggle-icon minimalist-toggle-icon" /> : <Eye className="toggle-icon minimalist-toggle-icon" />}
              </button>
            </div>
          </div>
          <div className="input-group minimalist-input-group">
            <div className="input-wrapper minimalist-input-wrapper">
              <Lock className="input-icon minimalist-input-icon" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input minimalist-input"
                placeholder="Konfirmoni Fjalëkalimin"
              />
              <button
                type="button"
                className="password-toggle minimalist-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="toggle-icon minimalist-toggle-icon" /> : <Eye className="toggle-icon minimalist-toggle-icon" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="login-button minimalist-btn"
          >
            <span className="button-text minimalist-btn-text">
              {loading ? 'Duke u regjistruar...' : 'Regjistrohu'}
            </span>
            {loading && <div className="loading-spinner minimalist-spinner"></div>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
