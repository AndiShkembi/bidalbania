import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Search, User, LogOut } from 'lucide-react';
import logo from '../../../logo.png';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="custom-header">
      <div className="header-inner">
        {/* Logo */}
        <Link to="/" className="header-logo-link">
          <div className="header-logo-bubble">
            <span className="header-logo-text">BidAlbania</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="header-nav">
          <Link to="/" className="header-nav-link">Filloni një Projekt</Link>
          <Link to="#" className="header-nav-link">Bashkohuni me rrjetin tonë</Link>
        </nav>

        {/* User Actions */}
        <div className="header-actions">
          {!loading && (
            <>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="header-action-link">
                    <User className="header-action-icon" />
                    Profili
                  </Link>
                  <button onClick={handleLogout} className="header-action-link header-action-logout">
                    <LogOut className="header-action-icon" />
                    Dil
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="header-action-link">Identifikohu</Link>
                  <Link to="/signup" className="header-action-link header-action-signup">Regjistrohu</Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
