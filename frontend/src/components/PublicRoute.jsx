import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, isInitialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && !loading && isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, loading, isInitialized, navigate]);

  // Shfaq loading gjatë kontrollit të autentifikimit
  if (loading || !isInitialized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0a0e3f 0%, #1a1f5f 100%)',
        color: 'white',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255,255,255,0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p>Duke ngarkuar...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Nëse është i loguar, nuk shfaq asgjë (do të ridrejtohet)
  if (isAuthenticated) {
    return null;
  }

  // Nëse nuk është i loguar, shfaq komponentin
  return children;
};

export default PublicRoute; 