import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Gabim në identifikim. Ju lutem provoni përsëri.');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-circle">
              <span className="logo-text">BA</span>
            </div>
          </div>
          <h1 className="login-title">Mirësevini në BidAlbania</h1>
          <p className="login-subtitle">
            Nuk keni llogari?{' '}
            <Link to="/signup" className="signup-link">Regjistrohuni</Link>
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email" className="input-label">Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="shkruani email-in tuaj"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">Fjalëkalimi</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="shkruani fjalëkalimin tuaj"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-label">Më mbaj të identifikuar</span>
            </label>
            <Link to="#" className="forgot-password">Harruat fjalëkalimin?</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            <span className="button-text">
              {loading ? 'Duke u identifikuar...' : 'Identifikohu'}
            </span>
            {loading && <div className="loading-spinner"></div>}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;
