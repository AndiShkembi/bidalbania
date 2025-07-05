import { Link } from 'react-router-dom';
import { Search, Star, Users, Award, Shield, Clock } from 'lucide-react';
import '../assets/fonts.css';
import '../assets/header.css';
import '../assets/homepage.css';
import '../assets/footer.css';

const Home = () => {
  const services = [
    {
      id: 1,
      name: 'Elektricistë',
      description: 'Instalime elektrike dhe riparime',
      icon: '⚡',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 2,
      name: 'Hidraulikë',
      description: 'Instalime uji dhe kanalizimi',
      icon: '🚿',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 3,
      name: 'Piktorë',
      description: 'Piktura dhe dekorim',
      icon: '🎨',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 4,
      name: 'Ndërtues',
      description: 'Ndërtim dhe rinovim',
      icon: '🏗️',
      color: 'bg-orange-100 text-orange-800'
    },
    {
      id: 5,
      name: 'Çatitë',
      description: 'Riparim dhe instalim çatish',
      icon: '🏠',
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 6,
      name: 'Pastrimi',
      description: 'Shërbime pastrimi',
      icon: '🧹',
      color: 'bg-pink-100 text-pink-800'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Ana Gjoni',
      location: 'Tiranë',
      rating: 5,
      text: 'Gjeta një elektricist të shkëlqyer përmes BidAlbania. Punimi ishte i shpejtë dhe cilësor!',
      service: 'Elektricist'
    },
    {
      id: 2,
      name: 'Marko Kola',
      location: 'Durrës',
      rating: 5,
      text: 'Shërbimi i hidraulikut që rezervova ishte i përsosur. Rekomandoj BidAlbania!',
      service: 'Hidraulik'
    },
    {
      id: 3,
      name: 'Elena Dushi',
      location: 'Vlorë',
      rating: 5,
      text: 'Piktori që gjeta këtu bëri një punë të mrekullueshme. Do të përdor përsëri!',
      service: 'Piktor'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Përdorues të Kënaqur', icon: Users },
    { number: '500+', label: 'Profesionistë të Verifikuar', icon: Shield },
    { number: '4.8', label: 'Vlerësim Mesatar', icon: Star },
    { number: '24h', label: 'Përgjigje e Shpejtë', icon: Clock }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">
              Gjeni Shërbimet Më të Mira
              <span className="block text-primary-200">Për Shtëpinë Tuaj</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Lidhuni me profesionistët më të besueshëm të riparimit dhe përmirësimit 
              të shtëpive në Shqipëri
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-2 flex items-center shadow-lg">
                <Search className="h-6 w-6 text-gray-400 ml-3" />
                <input
                  type="text"
                  placeholder="Çfarë shërbimi kërkoni?"
                  className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
                />
                <Link
                  to="/request"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-md font-semibold transition-colors"
                >
                  Kërko
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display mb-4">
              Shërbimet Tona
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Zgjidhni nga një gamë e gjerë shërbimesh të riparimit dhe përmirësimit të shtëpive
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="card hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${service.color} text-2xl mb-4`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link
                    to="/request"
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Kërko Shërbim →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display mb-4">
              Si Funksionon
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Vetëm 3 hapa të thjeshtë për të gjetur shërbimin e duhur
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Përshkruani Projektin</h3>
              <p className="text-gray-600">
                Na tregoni se çfarë shërbimi kërkoni dhe ku ndodheni
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Merrni Oferta</h3>
              <p className="text-gray-600">
                Profesionistët e verifikuar do t'ju dërgojnë oferta të personalizuara
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Zgjidhni dhe Rezervoni</h3>
              <p className="text-gray-600">
                Zgjidhni ofertën më të mirë dhe rezervoni shërbimin
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display mb-4">
              Çfarë Thonë Klientët Tonë
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Lexoni përvojat e klientëve tanë të kënaqur
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                  <div className="text-sm text-primary-600 font-semibold">
                    {testimonial.service}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Gati për të Filluar Projektin Tuaj?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Lidhuni me profesionistët më të mirë dhe merrni ofertat më të mira për projektin tuaj
          </p>
          <Link
            to="/request"
            className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            Filloni Tani
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
