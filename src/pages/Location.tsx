import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Maximize2, Bed, Bath, ArrowRight, Mail } from 'lucide-react';

const mockProperties = [
  {
    id: '1',
    title: 'Villa Moderne Saly',
    type: 'Villa',
    price: 450000,
    surface: 250,
    bedrooms: 4,
    bathrooms: 3,
    location: 'Saly, M\'Bour',
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
    tags: ['Nouveauté', 'Piscine']
  },
  {
    id: '2',
    title: 'Appartement Haut Standing',
    type: 'Appartement',
    price: 300000,
    surface: 120,
    bedrooms: 2,
    bathrooms: 2,
    location: 'Diamond Island, Dakar',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    tags: ['Meublé']
  },
  {
    id: '3',
    title: 'Studio Lumineux Plateau',
    type: 'Studio',
    price: 150000,
    surface: 45,
    bedrooms: 1,
    bathrooms: 1,
    location: 'Dakar Plateau',
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
    tags: ['Centre-ville']
  },
  {
    id: '4',
    title: 'Local Commercial Zone Franche',
    type: 'Commercial',
    price: 800000,
    surface: 400,
    bedrooms: 0,
    bathrooms: 2,
    location: 'M\'Bour Route Nationale',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    tags: ['Business']
  },
];

const Location = () => {
  const [filterType, setFilterType] = useState('Tous');

  const filtered = filterType === 'Tous' 
    ? mockProperties 
    : mockProperties.filter(p => p.type === filterType);

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <section className="bg-merveille-dark py-12 md:py-20 text-white mb-12 md:mb-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-20" alt="Location Background" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl md:text-6xl font-black mb-4 md:mb-6 leading-tight">Trouvez votre futur <span className="text-merveille-orange">Chez-vous</span></h1>
          <p className="text-white/70 max-w-2xl mx-auto text-base md:text-lg mb-8 md:mb-12 px-4">Découvrez une sélection rigoureuse de biens immobiliers à louer au Sénégal.</p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl md:rounded-3xl shadow-2xl p-3 md:p-4 flex flex-col md:flex-row gap-3 md:gap-4 items-center">
            <div className="flex-grow w-full flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 md:py-3">
              <Search className="text-gray-400 mr-3 h-5 w-5" />
              <input type="text" placeholder="Ville, quartier..." className="bg-transparent border-none focus:outline-none w-full text-gray-800 text-sm md:text-base outline-none ring-0 focus:ring-0" />
            </div>
            <div className="w-full md:w-auto flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 md:py-3">
              <Filter className="text-gray-400 mr-3 h-5 w-5" />
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent border-none focus:outline-none w-full text-gray-800 text-sm md:text-base cursor-pointer appearance-none outline-none ring-0 focus:ring-0"
              >
                <option value="Tous">Type de bien</option>
                <option value="Villa">Villa</option>
                <option value="Appartement">Appartement</option>
                <option value="Studio">Studio</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            <button className="btn-primary w-full md:w-auto py-3 md:py-4 px-8 rounded-xl font-bold uppercase tracking-widest text-xs">RECHERCHER</button>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{filtered.length} biens disponibles</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Trier par :</span>
            <select className="text-sm font-bold bg-transparent border-none focus:outline-none cursor-pointer">
              <option>Plus récents</option>
              <option>Prix croissant</option>
              <option>Prix décroissant</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-gray-100">
              <div className="relative h-64 overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 flex gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="bg-merveille-orange text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-merveille-dark font-black shadow-lg">
                  {item.price.toLocaleString()} FCFA <span className="text-xs font-light">/ mois</span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-merveille-orange text-xs font-bold uppercase tracking-widest mb-2">
                  <MapPin className="h-3 w-3 mr-1" /> {item.location}
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-merveille-orange transition-colors">{item.title}</h3>
                
                <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-4 mb-6">
                  <div className="flex flex-col items-center">
                    <Maximize2 className="h-4 w-4 text-gray-400 mb-1" />
                    <span className="text-xs font-bold">{item.surface} m²</span>
                  </div>
                  <div className="flex flex-col items-center border-x border-gray-100">
                    <Bed className="h-4 w-4 text-gray-400 mb-1" />
                    <span className="text-xs font-bold">{item.bedrooms} ch.</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Bath className="h-4 w-4 text-gray-400 mb-1" />
                    <span className="text-xs font-bold">{item.bathrooms} sdb.</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <Link to={`/bien/${item.id}`} className="text-sm font-black uppercase tracking-wider text-merveille-dark hover:text-merveille-orange flex items-center">
                    Voir détails <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <button className="bg-merveille-dark text-white p-3 rounded-xl hover:bg-merveille-orange transition-colors">
                    <Mail className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Location;
