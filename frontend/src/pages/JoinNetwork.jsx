import { useState } from 'react';
import { UserPlus, Star, TrendingUp, Users, Shield, MessageSquare, DollarSign, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import './JoinNetwork.css';

const categories = [
  'Elektricist', 'Hidraulik', 'Pastrim', 'Pikturë', 'Mobilieri', 'Kopshtari',
  'Transport', 'Kondicionerë', 'Dysheme & Parket', 'IT & Teknologji', 'Çati', 'Dyer & Dritare', 'Gips & Suvatime', 'Shtrime pllaka', 'Izolim', 'Dekorim', 'Rinovim i plotë', 'Kuzhina', 'Banjo', 'Sisteme ngrohje & ftohje'
];
const cities = [
  'Tiranë', 'Durrës', 'Vlorë', 'Shkodër', 'Elbasan', 'Fier', 'Berat', 'Korçë'
];

const JoinNetwork = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    category: '',
    password: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Mund të shtosh logjikën për dërgimin e të dhënave në backend
  };

  return (
    <div className="join-network-page">
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Bashkohu me <span className="highlight">rrjetin tonë</span> të profesionistëve
            </h1>
            <p className="hero-subtitle">
              Bëhu pjesë e platformës më të madhe të shërbimeve në Shqipëri. 
              Lidhu me klientë të rinj dhe rrit biznesin tënd me BidAlbania.
            </p>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="container">
          <div className="content-grid">
            <div className="benefits-section">
              <h2 className="section-title">
                <Star className="section-icon" />
                Përfitimet e profesionistëve
              </h2>
              <div className="benefits-grid">
                <div className="benefit-card">
                  <TrendingUp className="benefit-icon" />
                  <h3>Rrit biznesin</h3>
                  <p>Lidhu me klientë të rinj dhe rrit të ardhurat e tua</p>
                </div>
                <div className="benefit-card">
                  <Users className="benefit-icon" />
                  <h3>Komunitet i madh</h3>
                  <p>Bëhu pjesë e një komuniteti të madh profesionistësh</p>
                </div>
                <div className="benefit-card">
                  <Shield className="benefit-icon" />
                  <h3>Profili i verifikuar</h3>
                  <p>Ndërto besimin me klientët përmes profilit të verifikuar</p>
                </div>
                <div className="benefit-card">
                  <MessageSquare className="benefit-icon" />
                  <h3>Komunikim i lehtë</h3>
                  <p>Komuniko direkt me klientët përmes platformës</p>
                </div>
                <div className="benefit-card">
                  <DollarSign className="benefit-icon" />
                  <h3>Çmime të drejta</h3>
                  <p>Vendos çmimet e tua dhe menaxho ofertat</p>
                </div>
                <div className="benefit-card">
                  <Clock className="benefit-icon" />
                  <h3>Fleksibilitet</h3>
                  <p>Prano projekte që përshtaten me orarin tënd</p>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">
                <UserPlus className="section-icon" />
                Regjistrohu si profesionist
              </h2>
              {submitted ? (
                <div className="success-message">
                  <CheckCircle className="success-icon" />
                  <h3>Regjistrimi u bë me sukses!</h3>
                  <p>Do të kontaktoheni së shpejti për verifikimin e profilit tuaj.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="registration-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Emri *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                        placeholder="Shkruaj emrin tënd"
                      />
                    </div>
                    <div className="form-group">
                      <label>Mbiemri *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                        placeholder="Shkruaj mbiemrin tënd"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="email@example.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Telefon *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="+355 6X XXX XXX"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Qyteti *</label>
                      <select
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Zgjidh qytetin</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Kategoria e shërbimit *</label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Zgjidh kategorinë</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Fjalëkalimi *</label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      placeholder="Minimum 6 karaktere"
                    />
                  </div>
                  
                  <button type="submit" className="submit-btn">
                    <UserPlus className="btn-icon" />
                    Bashkohu me rrjetin
                    <ArrowRight className="btn-icon" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinNetwork; 