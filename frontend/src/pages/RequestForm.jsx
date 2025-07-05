import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, FileText, Send } from 'lucide-react';

const RequestForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    location: '',
    budget: '',
    timeline: '',
    urgency: 'normal',
    contactPreference: 'phone'
  });

  const categories = [
    { id: 'electrical', name: 'Elektricistë', icon: '⚡', description: 'Instalime elektrike dhe riparime' },
    { id: 'plumbing', name: 'Hidraulikë', icon: '🚿', description: 'Instalime uji dhe kanalizimi' },
    { id: 'painting', name: 'Piktorë', icon: '🎨', description: 'Piktura dhe dekorim' },
    { id: 'construction', name: 'Ndërtues', icon: '🏗️', description: 'Ndërtim dhe rinovim' },
    { id: 'roofing', name: 'Çatitë', icon: '🏠', description: 'Riparim dhe instalim çatish' },
    { id: 'cleaning', name: 'Pastrimi', icon: '🧹', description: 'Shërbime pastrimi' },
    { id: 'carpentry', name: 'Zdrukthëtarë', icon: '🔨', description: 'Punime druri dhe mobilje' },
    { id: 'landscaping', name: 'Kopshtari', icon: '🌱', description: 'Kopshtari dhe peizazh' }
  ];

  const urgencyOptions = [
    { value: 'urgent', label: 'I Urgjent', description: 'Në ditët e ardhshme' },
    { value: 'normal', label: 'Normal', description: 'Në javën e ardhshme' },
    { value: 'flexible', label: 'I Fleksueshëm', description: 'Kur të jetë e mundur' }
  ];

  const timelineOptions = [
    { value: '1-2-days', label: '1-2 ditë' },
    { value: '1-week', label: '1 javë' },
    { value: '2-weeks', label: '2 javë' },
    { value: '1-month', label: '1 muaj' },
    { value: 'flexible', label: 'I fleksueshëm' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCategorySelect = (categoryId) => {
    setFormData({
      ...formData,
      category: categoryId
    });
    setCurrentStep(2);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement request submission
    console.log('Submitting request:', formData);
    navigate('/profile');
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Zgjidhni Kategorinë e Shërbimit</h3>
        <p className="text-gray-600 mb-6">Çfarë lloj shërbimi kërkoni?</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all text-left"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{category.icon}</span>
              <div>
                <h4 className="font-semibold text-gray-900">{category.name}</h4>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detajet e Projektit</h3>
        <p className="text-gray-600 mb-6">Na tregoni më shumë për projektin tuaj</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titulli i Projektit
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-field"
            placeholder="p.sh. Instalim elektrik në kuzhinë"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Përshkrimi i Detajuar
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="input-field"
            placeholder="Përshkruani detajisht se çfarë kërkoni, madhësinë e projektit, materialet e preferuara, etj."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vendndodhja
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="Adresa e saktë ose zona"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferencat dhe Buxheti</h3>
        <p className="text-gray-600 mb-6">Na tregoni buxhetin dhe preferencat tuaja</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buxheti (opsional)
          </label>
          <input
            type="text"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="input-field"
            placeholder="p.sh. 500-1000 EUR"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Urgjenca
          </label>
          <div className="space-y-2">
            {urgencyOptions.map((option) => (
              <label key={option.value} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="urgency"
                  value={option.value}
                  checked={formData.urgency === option.value}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">{option.label}</span>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Afati i Dëshiruar
          </label>
          <select
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Zgjidhni afatin</option>
            {timelineOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferenca e Kontaktit
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="contactPreference"
                value="phone"
                checked={formData.contactPreference === 'phone'}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="text-sm text-gray-900">Telefon</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="contactPreference"
                value="email"
                checked={formData.contactPreference === 'email'}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="text-sm text-gray-900">Email</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-display">Kërko Shërbim</h1>
          <p className="text-gray-600 mt-2">Përshkruani projektin tuaj dhe merrni oferta nga profesionistët</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-primary-600' : 'text-gray-500'}`}>
                Kategoria
              </span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-4">
              <div className={`h-1 bg-primary-600 transition-all duration-300 ${
                currentStep >= 2 ? 'w-full' : currentStep >= 1 ? 'w-1/2' : 'w-0'
              }`}></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-primary-600' : 'text-gray-500'}`}>
                Detajet
              </span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-4">
              <div className={`h-1 bg-primary-600 transition-all duration-300 ${
                currentStep >= 3 ? 'w-full' : currentStep >= 2 ? 'w-1/2' : 'w-0'
              }`}></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <span className={`text-sm font-medium ${currentStep >= 3 ? 'text-primary-600' : 'text-gray-500'}`}>
                Preferencat
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn-secondary"
                >
                  Kthehu
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary"
                >
                  Vazhdo
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Dërgo Kërkesën</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;
