import { useState } from 'react';
import homeSearchImage from '../assets/home-search.jpg';

const categoryTabs = [
  'Shërbimet e përditshme',
  'Ambjentet e jashtme',
  'Punë të jashtme',
  'Punë të brëndshme',
  'Rinovim',
];

const categories = [
  { name: 'Shërbime të vogla elektrike', image: '/3.webp', tab: 0 },
  { name: 'Demtime', image: '/2.webp', tab: 0 },
  { name: 'Sherbim Pastrimi', image: '/1.webp', tab: 0 },
  { name: 'Mjeshter', image: '/4.webp', tab: 0 },
  { name: 'Instalimi i pajisjes së vogël', image: '/5.webp', tab: 0 },
  { name: 'Arkitekt Peizazhi', image: '/7.webp', tab: 1 },
  { name: 'Punime Druri', image: '/8.webp', tab: 1 },
  { name: 'Gardhe', image: '/9.webp', tab: 1 },
  { name: 'Kujdesi për oborrin', image: '/10.webp', tab: 1 },
  { name: 'Perkujdesje ndaj pemeve', image: '/11.webp', tab: 1 },
  { name: 'Pishina', image: '/12.webp', tab: 1 },
  { name: 'Ndërrimi dhe riparimi i çatisë', image: '/13.webp', tab: 2 },
  { name: 'Ndërrimi i dritares', image: '/14.webp', tab: 2 },
  { name: 'Mur rrethues', image: '/15.webp', tab: 2 },
  { name: 'Ulluqe', image: '/16.webp', tab: 2 },
  { name: 'Dyer', image: '/17.webp', tab: 2 },
  { name: 'Panele Diellore', image: '/18.webp', tab: 2 },
  { name: 'Lyerje', image: '/19.webp', tab: 3 },
  { name: 'Ngrohje dhe ftohje', image: '/20.webp', tab: 3 },
  { name: 'Hidraulik', image: '/21.webp', tab: 3 },
  { name: 'Elektricistë', image: '/22.webp', tab: 3 },
  { name: 'Dyshemeja dhe drurë', image: '/23.webp', tab: 3 },
  { name: 'Dollapë dhe banakë', image: '/24.webp', tab: 3 },
  { name: 'Rinovimi i kuzhinës', image: '/25.webp', tab: 4 },
  { name: 'Rinovimi i banjës', image: '/26.webp', tab: 4 },
  { name: 'Heqja e mbeturinave', image: '/27.webp', tab: 4 },
  { name: 'Oborret dhe hyrjet', image: '/28.webp', tab: 4 },
  { name: 'Inspektimi i shtëpisë', image: '/29.webp', tab: 4 },
  { name: 'Testimi për mykun', image: '/30.webp', tab: 4 },
];

const mostSearched = [
  { name: 'Paisje', icon: '💡' },
  { name: 'Arkitekt & Inxhinier', icon: '📐' },
  { name: 'Dollapë dhe banakë', icon: '🗄️' },
  { name: 'Zdrukthtar', icon: '🪚' },
  { name: 'Tapeta', icon: '🪟' },
  { name: 'Beton, Gur & Tulla', icon: '🧱' },
  { name: 'Transport', icon: '🚚' },
  { name: 'Izolim', icon: '🧤' },
  { name: 'Gardhe', icon: '🪵' },
  { name: 'Parkete Druri', icon: '🪵' },
  { name: 'Garazhe, Dyer Hapsire', icon: '🚪' },
  { name: 'Mjeshtër riparimesh', icon: '🛠️' },
];

const fixedPrice = {
  image: '/19.webp',
  title: 'Shërbime me çmim fiks',
  features: [
    'Shihni çmimin tuaj',
    'Rezervo në orar',
    'Paguaj online',
  ],
  cta: 'Shërbimet tona',
  desc: 'Po kërkoni të rezervoni një shërbim me çmim fiks?',
};

const springPrep = [
  { name: 'Shërbime Pastrimi', icon: '🧹' },
  { name: 'Kujdesje për Oborrin', icon: '🌳' },
  { name: 'Shërbimi i Pemëve', icon: '🌲' },
  { name: 'Shtesa dhe Rinovime', icon: '🏡' },
  { name: 'Veranda', icon: '🏖️' },
  { name: 'Gardhe', icon: '🪵' },
];

const projects = [
  { name: 'Hidraulikë', icon: '🚿' },
  { name: 'Rinovim Kuzhine', icon: '🍳' },
  { name: 'Rinovim Tualeti', icon: '🚽' },
  { name: 'Dyer & Dritare', icon: '🚪' },
  { name: 'Çati & Ulluqe', icon: '🏠' },
  { name: 'Elektricistë & Kompjuterë', icon: '💡' },
];

const navLinks = [
  { name: 'Fillo një Projekt', href: '#' },
  { name: 'Bashkohuni me rrjetin tonë', href: '#' },
  { name: 'Identifikohu', href: '#' },
  { name: 'Regjistrohu', href: '#' },
];

const Home = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="w-full bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#" className="text-2xl font-bold text-[#18194a] tracking-tight">BidAlbania</a>
          <nav className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-[#18194a] hover:text-[#ff5532] font-medium transition-colors">
                {link.name}
              </a>
            ))}
          </nav>
          <button className="md:hidden p-2 rounded focus:outline-none">
            <svg className="w-7 h-7 text-[#18194a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </header>

      {/* HERO CARD */}
      <section className="w-full flex justify-center py-10 px-2">
        <div className="max-w-5xl w-full bg-gradient-to-br from-[#18194a] to-[#23244d] rounded-3xl shadow-lg flex flex-col md:flex-row overflow-hidden">
          <div className="flex-1 flex flex-col justify-center p-8 gap-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-2">
              Gjeni profesionistët e duhur për çdo projekt.
            </h1>
            <form className="flex w-full max-w-md bg-white rounded-full shadow-md px-4 py-2 items-center">
              <svg className="w-6 h-6 text-[#9ca3af]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
              <input
                type="text"
                placeholder="Çfarë shërbimi ju nevojitet?"
                className="flex-1 px-4 py-3 text-[#111827] placeholder-[#6b7280] bg-transparent focus:outline-none"
              />
              <button type="submit" className="ml-2 bg-[#ff5532] hover:bg-[#e64c2e] text-white px-6 py-2 rounded-full transition-colors font-semibold">
                Kerko
              </button>
            </form>
          </div>
          <div className="flex-1 flex items-center justify-center bg-white">
            <img src={homeSearchImage} alt="Hero" className="object-cover w-full h-80 md:h-full" />
          </div>
        </div>
      </section>

      {/* CATEGORY TABS */}
      <section className="w-full max-w-6xl mx-auto px-4 mt-12">
        <div className="flex flex-wrap gap-3 mb-6">
          {categoryTabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(idx)}
              className={`px-5 py-2 rounded-full font-semibold transition-colors text-sm ${activeTab === idx ? 'bg-[#1dc186] text-white' : 'bg-[#f3f4f6] text-[#18194a] hover:bg-[#e5e7eb]'}`}
            >
              {tab}
            </button>
          ))}
          <a href="#" className="ml-auto text-[#18194a] hover:text-[#ff5532] font-medium text-sm">Shiko te gjitha</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {categories.filter(cat => cat.tab === activeTab).map((cat, idx) => (
            <div key={idx} className="group relative rounded-xl overflow-hidden shadow hover:shadow-lg transition-all bg-white cursor-pointer">
              <img src={cat.image} alt={cat.name} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                <span className="text-white text-sm font-medium drop-shadow">{cat.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MOST SEARCHED */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-[#18194a] mb-8">Më të kërkuarat</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {mostSearched.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-xl shadow hover:bg-[#f3f4f6] transition-colors">
              <span className="text-3xl md:text-4xl lg:text-5xl">{item.icon}</span>
              <span className="text-[#18194a] text-base md:text-lg font-medium text-center">{item.name}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <a href="#" className="bg-[#2563eb] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#1d4ed8] transition-colors">Shfletoni të gjitha shërbimet</a>
        </div>
      </section>

      {/* FIXED PRICE SERVICE */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-10 bg-[#f4f6fa] rounded-3xl mb-12">
        <div className="flex-1 flex justify-center">
          <img src={fixedPrice.image} alt="Shërbim fiks" className="rounded-2xl shadow-lg w-64 h-64 object-cover" />
        </div>
        <div className="flex-1 flex flex-col gap-4 items-start">
          <h3 className="text-lg font-semibold text-[#18194a]">{fixedPrice.title}</h3>
          <ul className="flex gap-4 flex-wrap mb-2">
            {fixedPrice.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-[#18194a] text-sm"><span className="text-[#2563eb]">✔</span> {f}</li>
            ))}
          </ul>
          <h2 className="text-2xl md:text-3xl font-bold text-[#18194a] mb-2">{fixedPrice.desc}</h2>
          <a href="#" className="bg-[#2563eb] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1d4ed8] transition-colors">{fixedPrice.cta}</a>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section className="w-full max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-xl md:text-2xl font-bold text-[#18194a] mb-6">Projektet më të kërkuara</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {projects.map((p, i) => (
            <div key={i} className="flex flex-col items-center gap-2 bg-white rounded-full shadow p-4 w-28 h-28 justify-center">
              <span className="text-3xl">{p.icon}</span>
              <span className="text-xs text-[#18194a] text-center font-medium">{p.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SPRING PREP SECTION */}
      <section className="w-full max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-xl md:text-2xl font-bold text-[#18194a] mb-6">Përgatituni që tani për pranverën</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {springPrep.map((p, i) => (
            <div key={i} className="flex flex-col items-center gap-2 bg-white rounded-full shadow p-4 w-28 h-28 justify-center">
              <span className="text-3xl">{p.icon}</span>
              <span className="text-xs text-[#18194a] text-center font-medium">{p.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-white text-[#18194a] mt-auto border-t border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-2">BidAlbania</h3>
            <p className="text-sm opacity-80 mb-4">Platforma më e besueshme për të gjetur dhe rezervuar shërbime lokale të shtëpisë në Shqipëri.</p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-[#2563eb]">Facebook</a>
              <a href="#" className="hover:text-[#2563eb]">Instagram</a>
              <a href="#" className="hover:text-[#2563eb]">LinkedIn</a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Lidhje të Shpejta</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:text-[#2563eb]">Home</a></li>
              <li><a href="#categories" className="hover:text-[#2563eb]">Shërbime</a></li>
              <li><a href="#" className="hover:text-[#2563eb]">Më të kërkuarat</a></li>
              <li><a href="#" className="hover:text-[#2563eb]">Kontakt</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Shërbimet</h4>
            <ul className="space-y-1 text-sm">
              <li>Elektricistë</li>
              <li>Hidraulikë</li>
              <li>Piktorë</li>
              <li>Ndërtues</li>
              <li>Pastrimi</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Kontakt</h4>
            <ul className="space-y-1 text-sm">
              <li>Email: info@bidalbania.al</li>
              <li>Tel: +355 69 123 4567</li>
              <li>Tiranë, Shqipëri</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 py-4 border-t border-[#e5e7eb]">© 2024 BidAlbania. Të gjitha të drejtat e rezervuara.</div>
      </footer>
    </div>
  );
};

export default Home;
