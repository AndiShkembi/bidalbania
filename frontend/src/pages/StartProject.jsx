import { Link } from 'react-router-dom';
import { UserPlus, LogIn, CheckCircle, Shield, MessageSquare, DollarSign, Clock, Users } from 'lucide-react';
import './StartProject.css';

const StartProject = () => {
  return (
    <div className="start-project-page">
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Si të fillosh një projekt në <span className="highlight">BidAlbania</span>?
            </h1>
            <p className="hero-subtitle">
              Platforma jonë ju lejon të publikoni projekte për çdo nevojë të shtëpisë ose biznesit 
              dhe të merrni oferta nga profesionistë të verifikuar. Për të publikuar një projekt të ri, 
              duhet të keni një llogari të regjistruar.
            </p>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="container">
          <div className="content-grid">
            <div className="steps-section">
              <h2 className="section-title">
                <CheckCircle className="section-icon" />
                Hapat kryesorë
              </h2>
              <div className="steps-list">
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Krijo një llogari</h3>
                    <p>Regjistrohu në platformë ose identifikohu nëse ke llogari</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Plotëso profilin</h3>
                    <p>Shto të dhënat bazë për të përmirësuar eksperiencën</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>Publiko projektin</h3>
                    <p>Shko te profili dhe kliko "Publiko projekt të ri"</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h3>Plotëso detajet</h3>
                    <p>Përshkruaj projektin, buxhetin dhe preferencat</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <h3>Merr oferta</h3>
                    <p>Zgjidh më të mirin nga profesionistët e verifikuar</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="benefits-section">
              <h2 className="section-title">
                <Shield className="section-icon" />
                Pse të publikosh projekt në BidAlbania?
              </h2>
              <div className="benefits-grid">
                <div className="benefit-card">
                  <Shield className="benefit-icon" />
                  <h3>Profesionistë të verifikuar</h3>
                  <p>Të gjithë ofertuesit janë të vlerësuar nga klientët e mëparshëm</p>
                </div>
                <div className="benefit-card">
                  <MessageSquare className="benefit-icon" />
                  <h3>Komunikim i lehtë</h3>
                  <p>Komunikim i sigurt dhe i drejtpërdrejtë me ofertuesit</p>
                </div>
                <div className="benefit-card">
                  <DollarSign className="benefit-icon" />
                  <h3>Transparencë në çmime</h3>
                  <p>Shohësh çmimet dhe shërbimet qartë dhe pa fshehurazi</p>
                </div>
                <div className="benefit-card">
                  <Clock className="benefit-icon" />
                  <h3>Menaxhim i thjeshtë</h3>
                  <p>Menaxho të gjitha projektet nga profili yt personal</p>
                </div>
              </div>
            </div>
          </div>

          <div className="cta-section">
            <h2>Gati për të filluar?</h2>
            <p>Krijo llogarinë tënde dhe fillo të publikosh projekte</p>
            <div className="cta-buttons">
              <Link to="/signup" className="cta-btn primary">
                <UserPlus className="btn-icon" />
                Krijo llogari
              </Link>
              <Link to="/login" className="cta-btn secondary">
                <LogIn className="btn-icon" />
                Identifikohu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartProject; 