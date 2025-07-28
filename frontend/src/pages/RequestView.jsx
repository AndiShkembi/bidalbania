import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, User, Home, Phone, MessageSquare, Eye, ArrowLeft } from 'lucide-react';
import { API_URL } from '../config/api.js';
import './Requests.css';
import './RequestView.css';
import ContactModal from './ContactModal';

const urgencyLabels = {
  urgent: 'URGJENTE',
  high: 'I LARTË',
  normal: 'NORMALE',
  low: 'E ULËT',
};

const RequestView = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/requests/${id}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Nuk u gjet kërkesa.');
        } else {
          setRequest(data);
        }
      } catch (err) {
        setError('Gabim në rrjet.');
      }
      setLoading(false);
    };
    fetchRequest();
  }, [id]);

  if (loading) return <div className="loading-state">Duke ngarkuar...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!request) return null;

  return (
    <div className="request-view-bg">
      <div className="request-view-container">
        <Link to="/request" className="back-link"><ArrowLeft /> Të gjitha kërkesat</Link>
        <div className="request-view-card">
          <div className="request-view-header">
            <h1 className="request-view-title">{request.title}</h1>
            <span className={`urgency-badge ${request.urgency}`}>{urgencyLabels[request.urgency] || request.urgency}</span>
          </div>
          <div className="request-view-meta">
            <span><MapPin /> {request.city}</span>
            <span><Calendar /> {request.desiredDate || (request.createdAt ? new Date(request.createdAt).toLocaleDateString('sq-AL') : '')}</span>
            <span><DollarSign /> {request.budget} Lekë</span>
            <span><Home /> {request.propertyType}</span>
            <span><User /> {request.category}</span>
          </div>
          <div className="request-view-description">
            <h3>Përshkrimi</h3>
            <p>{request.description}</p>
          </div>
          <div className="request-view-details">
            {request.address && <div><b>Adresa:</b> {request.address}</div>}
            {request.propertySize && <div><b>Madhësia:</b> {request.propertySize}</div>}
            {request.contactPreference && <div><b>Preferenca kontakti:</b> {request.contactPreference}</div>}
            {request.additionalRequirements && <div><b>Kërkesa shtesë:</b> {request.additionalRequirements}</div>}
          </div>
          <div className="request-view-stats">
            <span><Eye /> {request.views || 0} pamje</span>
            <span><MessageSquare /> {request.responses || 0} përgjigje</span>
          </div>
          <div className="request-view-actions">
            <button className="contact-btn" onClick={() => setOpenModal(true)}>Kontakto</button>
          </div>
        </div>
      </div>
      <ContactModal open={openModal} onClose={() => { setOpenModal(false); setSent(false); setFormError(''); }}>
        {!sent ? (
          <form className="contact-form" onSubmit={async e => {
            e.preventDefault();
            setFormError('');
            if (!form.name || !form.email || !form.message) {
              setFormError('Ju lutem plotësoni të gjitha fushat.');
              return;
            }
            setSending(true);
            // Simulo dërgimin (zëvendëso me API nëse duhet)
            setTimeout(() => {
              setSent(true);
              setSending(false);
            }, 1200);
          }}>
            <h2 className="contact-form-title">Kontakto publikuesin</h2>
            <input
              type="text"
              placeholder="Emri juaj"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="contact-input"
              required
            />
            <input
              type="email"
              placeholder="Email juaj"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="contact-input"
              required
            />
            <textarea
              placeholder="Mesazhi juaj..."
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              className="contact-textarea"
              rows={4}
              required
            />
            {formError && <div className="contact-form-error">{formError}</div>}
            <button className="contact-btn" type="submit" disabled={sending}>{sending ? 'Duke dërguar...' : 'Dërgo'}</button>
          </form>
        ) : (
          <div className="contact-form-success">
            <h2>Mesazhi u dërgua me sukses!</h2>
            <p>Publikuesi do të njoftohet për kërkesën tuaj.</p>
            <button className="contact-btn" onClick={() => setOpenModal(false)}>Mbyll</button>
          </div>
        )}
      </ContactModal>
    </div>
  );
};

export default RequestView; 