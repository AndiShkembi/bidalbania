import React from 'react';

const team = [
  { name: 'Andi Kembi', role: 'Founder & CEO', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Elira Dema', role: 'Lead Designer', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Bledi Hoxha', role: 'Fullstack Developer', img: 'https://randomuser.me/api/portraits/men/65.jpg' },
];

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-10 flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-700 mb-2">Rreth BidAlbania</h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            BidAlbania është platforma më e besueshme për të gjetur dhe rezervuar shërbime lokale të shtëpisë në Shqipëri. Misioni ynë është të lidhim klientët me profesionistët më të mirë, me transparencë, siguri dhe lehtësi.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Ekipi Ynë</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member) => (
              <div key={member.name} className="flex flex-col items-center gap-2">
                <img src={member.img} alt={member.name} className="w-20 h-20 rounded-full shadow-md border-4 border-primary-200 object-cover" />
                <div className="text-base font-medium text-gray-900">{member.name}</div>
                <div className="text-sm text-primary-600">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center text-gray-400 text-sm pt-4 border-t border-gray-100">
          &copy; {new Date().getFullYear()} BidAlbania. Të gjitha të drejtat e rezervuara.
        </div>
      </div>
    </div>
  );
};

export default About; 