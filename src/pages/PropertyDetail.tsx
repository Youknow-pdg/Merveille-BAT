import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Maximize2, Bed, Bath, Mail, Phone, Calendar, CheckCircle2, ArrowLeft, Share2, Heart } from 'lucide-react';

const PropertyDetail = () => {
  const { id } = useParams();
  
  // Mock data for detail
  const property = {
    id: id,
    title: 'Villa Moderne Saly Oasis',
    location: 'Saly, M\'Bour, Sénégal',
    price: 450000,
    surface: 250,
    bedrooms: 4,
    bathrooms: 3,
    description: 'Une somptueuse villa moderne située dans le quartier résidentiel de Saly. Cette propriété offre des finitions haut de gamme, une piscine privée et un jardin luxuriant. Idéal pour une famille cherchant confort et sécurité dans la zone balnéaire la plus prisée du Sénégal.',
    features: ['Piscine Privée', 'Garage 2 Voitures', 'Climatisation Centrale', 'Cuisine Équipée', 'Sécurité 24h/24', 'Terrasse de Toit'],
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1582408921715-18e7806367bb?auto=format&fit=crop&q=80&w=800'
    ],
    agent: {
      name: 'MerveilleBAT Gestion',
      phone: '+221 77 710 80 33',
      email: 'gestion@merveillebat.sn'
    }
  };

  return (
    <div className="pt-24 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs / Actions */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/location" className="flex items-center text-gray-500 hover:text-merveille-dark transition-colors font-bold text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux annonces
          </Link>
          <div className="flex space-x-4">
            <button className="bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-gray-400 hover:text-red-500">
              <Heart className="h-5 w-5" />
            </button>
            <button className="bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-gray-400 hover:text-merveille-blue">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[300px] sm:h-[400px] md:h-[500px] mb-8 md:mb-12">
          <div className="md:col-span-2 md:row-span-2 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl">
            <img src={property.images[0]} alt="Main" className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:block md:col-span-1 rounded-3xl overflow-hidden shadow-xl">
            <img src={property.images[1]} alt="Interior" className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:block md:col-span-1 rounded-3xl overflow-hidden shadow-xl">
            <img src={property.images[2]} alt="Kitchen" className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:block md:col-span-2 bg-merveille-dark rounded-3xl relative overflow-hidden group cursor-pointer">
            <img src={property.images[0]} alt="All" className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-black uppercase tracking-widest text-sm underline underline-offset-8">Voir toutes les photos (12)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Mobile Pricing (visible only on md and below, relative to original sidebar) */}
          <div className="lg:hidden">
            <div className="bg-white rounded-[32px] shadow-xl p-6 border border-gray-100 mb-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-black text-merveille-dark mb-1">{property.price.toLocaleString()} FCFA</div>
                <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest">LOYER MENSUEL</div>
              </div>
              <div className="flex flex-col gap-4">
                <button className="btn-primary py-4 text-sm">RÉSERVER UNE VISITE</button>
              </div>
            </div>
          </div>
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="flex items-center text-merveille-orange text-xs font-black uppercase tracking-widest mb-4">
                <MapPin className="h-4 w-4 mr-2" /> {property.location}
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-6">{property.title}</h1>
              <div className="flex flex-wrap gap-6 text-gray-500 border-y border-gray-200 py-6">
                <div className="flex items-center"><Maximize2 className="mr-2 h-5 w-5 text-merveille-orange" /><span className="font-bold text-merveille-dark">{property.surface} m²</span></div>
                <div className="flex items-center"><Bed className="mr-2 h-5 w-5 text-merveille-orange" /><span className="font-bold text-merveille-dark">{property.bedrooms} Chambres</span></div>
                <div className="flex items-center"><Bath className="mr-2 h-5 w-5 text-merveille-orange" /><span className="font-bold text-merveille-dark">{property.bathrooms} Salles de bain</span></div>
                <div className="flex items-center"><Calendar className="mr-2 h-5 w-5 text-merveille-orange" /><span className="font-bold text-merveille-dark">Libre Immédiatement</span></div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-black">Description</h2>
              <p className="text-gray-600 leading-relaxed font-light text-lg">
                {property.description}
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-black">Équipements et Caractéristiques</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.features.map(f => (
                  <div key={f} className="flex items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-sm font-medium text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact / Sidebar (Desktop only) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Payment Card */}
              <div className="bg-white rounded-[40px] shadow-2xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                  <div className="text-4xl font-black text-merveille-dark mb-1">{property.price.toLocaleString()} FCFA</div>
                  <div className="text-xs text-gray-400 uppercase font-black tracking-widest">LOYER MENSUEL</div>
                </div>
                <div className="space-y-4">
                  <button className="w-full btn-primary py-4">PROGRAMMER UNE VISITE</button>
                  <button className="w-full bg-white border-2 border-merveille-dark text-merveille-dark py-4 rounded-md font-bold hover:bg-gray-50 transition-all flex items-center justify-center">
                    <Mail className="mr-2 h-5 w-5" /> ENVOYER UN MESSAGE
                  </button>
                </div>
              </div>

              {/* Agent Card */}
              <div className="bg-merveille-dark rounded-[40px] p-8 text-white">
                <h4 className="text-xs font-black uppercase tracking-widest text-merveille-orange mb-6 text-center">Contact Agence</h4>
                <div className="flex items-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center font-black text-2xl mr-4">
                    MB
                  </div>
                  <div>
                    <div className="font-bold">{property.agent.name}</div>
                    <div className="text-xs text-white/40">Gestionnaire Immobilier</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <a href={`tel:${property.agent.phone}`} className="flex items-center text-sm hover:text-merveille-orange transition-colors">
                    <Phone className="h-5 w-5 mr-4 text-merveille-orange" /> {property.agent.phone}
                  </a>
                  <a href={`mailto:${property.agent.email}`} className="flex items-center text-sm hover:text-merveille-orange transition-colors">
                    <Mail className="h-5 w-5 mr-4 text-merveille-orange" /> {property.agent.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
