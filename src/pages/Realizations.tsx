import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Search, Filter, X, Calendar, MapPin, Tag, CheckCircle2 } from 'lucide-react';

const mockProjects = [
  { 
    id: 1, 
    title: 'Résidence Saly Oasis', 
    category: 'Construction', 
    year: '2023', 
    location: 'Saly, Mbour',
    description: 'Une résidence de luxe comprenant 12 villas avec piscine individuelle, conçue pour offrir un confort moderne tout en respectant l\'esthétique locale. Utilisation de matériaux durables et systèmes d\'économie d\'énergie.',
    features: ['Piscines privées', 'Panneaux solaires', 'Sécurité 24/7', 'Jardins paysagers'],
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200' 
  },
  { 
    id: 2, 
    title: 'Bureaux Zone Franche', 
    category: 'Architecture', 
    year: '2024', 
    location: 'Dakar, Sénégal',
    description: 'Conception architecturale d\'un complexe de bureaux moderne au cœur de la Zone Franche. L\'accent a été mis sur la luminosité naturelle et la fluidité des espaces de travail.',
    features: ['Open-space modulables', 'Terrasse panoramique', 'Isolation thermique', 'Parking sous-sol'],
    img: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200' 
  },
  { 
    id: 3, 
    title: 'Villa Malika', 
    category: 'Rénovation', 
    year: '2022', 
    location: 'Saint-Louis',
    description: 'Restauration complète d\'une villa des années 80. Nous avons modernisé l\'intérieur tout en préservant le charme colonial extérieur, créant un mélange unique d\'ancien et de nouveau.',
    features: ['Restaurations façades', 'Cuisine sur mesure', 'Domotique', 'Climatisation'],
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200' 
  },
  { 
    id: 4, 
    title: 'Appartements Diamaguène', 
    category: 'Construction', 
    year: '2023', 
    location: 'Thiès, Sénégal',
    description: 'Projet d\'habitat social de haute qualité. Ce complexe de 24 appartements offre des espaces de vie optimisés et des aires de jeux sécurisées pour les enfants.',
    features: ['Aire de jeux', 'Réservoirs d\'eau', 'Gestion des déchets', 'Parkings vélos'],
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200' 
  },
  { 
    id: 5, 
    title: 'Plan Villa Sahel', 
    category: 'Architecture', 
    year: '2024', 
    location: 'Zone Sahélienne',
    description: 'Une étude architecturale pour une villa bioclimatique adaptée au climat chaud et sec. Utilisation de la ventilation naturelle et de l\'inertie thermique de la terre cuite.',
    features: ['Ventilation naturelle', 'Double toiture', 'Patio central', 'Matériaux terre'],
    img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=1200' 
  },
  { 
    id: 6, 
    title: 'Piscine Olympique', 
    category: 'Spécialisé', 
    year: '2022', 
    location: 'Dakar, Complexe Sportif',
    description: 'Réalisation d\'une infrastructure sportive de niveau international. Bassin olympique avec systèmes de filtration et de chauffage de pointe.',
    features: ['Audit énergétique', 'Traitement ozone', 'Tribunes 500 places', 'Locaux techniques'],
    img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=1200' 
  },
];

const Realizations = () => {
  const [filter, setFilter] = useState('Tous');
  const [likedProjects, setLikedProjects] = useState<number[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  const categories = ['Tous', 'Construction', 'Architecture', 'Rénovation', 'Spécialisé'];

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedProjects(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const filtered = filter === 'Tous' 
    ? mockProjects 
    : mockProjects.filter(p => p.category === filter);

  return (
    <div className="pt-24 pb-20">
      {/* Intro */}
      <section className="bg-merveille-dark py-20 md:py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-20" alt="Realizations Background" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-7xl font-black mb-6 md:mb-8">Nos <span className="text-merveille-orange">Réalisations</span></h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed">
            Découvrez une sélection de projets menés avec passion et rigueur à travers tout le Sénégal. Chaque édifice raconte une histoire de collaboration et d'excellence.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-16 md:top-[74px] bg-white z-40 border-b border-gray-100 py-4 md:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6 font-display">
          <div className="flex flex-row overflow-x-auto pb-4 md:pb-0 gap-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${filter === cat ? 'bg-merveille-orange text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher un projet..." 
              className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-merveille-orange/20 w-64"
            />
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode='popLayout'>
            {filtered.map((p) => (
              <motion.div
                layout
                key={p.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group cursor-pointer"
                onClick={() => setSelectedProject(p)}
              >
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl mb-6">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-merveille-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white text-merveille-dark px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Détails du Projet
                    </button>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button 
                      onClick={(e) => toggleLike(p.id, e)}
                      className={`backdrop-blur-md p-3 rounded-full transition-all border ${likedProjects.includes(p.id) ? 'bg-red-500 border-red-500 text-white' : 'bg-white/20 border-white/40 text-white hover:bg-white/40'}`}
                    >
                      <Heart className={`h-5 w-5 ${likedProjects.includes(p.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
                <div>
                  <div className="flex items-center text-merveille-orange text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                    {p.category} — {p.year}
                  </div>
                  <h3 className="text-xl font-bold line-clamp-1">{p.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-merveille-dark/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] rounded-[32px] sm:rounded-[40px] overflow-hidden relative shadow-2xl overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 bg-white/20 backdrop-blur-md hover:bg-white/40 text-merveille-dark p-2 rounded-full transition-colors"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                <div className="h-56 sm:h-80 md:h-full relative shrink-0">
                  <img src={selectedProject.img} alt={selectedProject.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                    <span className="bg-merveille-orange text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {selectedProject.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 md:p-12">
                  <h2 className="text-3xl font-black mb-6 text-merveille-dark">{selectedProject.title}</h2>
                  
                  <div className="grid grid-cols-2 gap-6 mb-8 py-6 border-y border-gray-100">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-3 text-merveille-orange" />
                      <div className="text-xs uppercase font-bold tracking-widest">Gagné en {selectedProject.year}</div>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-4 w-4 mr-3 text-merveille-orange" />
                      <div className="text-xs uppercase font-bold tracking-widest">{selectedProject.location}</div>
                    </div>
                  </div>

                  <div className="space-y-6 mb-8">
                    <h4 className="text-sm font-black uppercase tracking-widest text-merveille-dark">Description du Projet</h4>
                    <p className="text-gray-600 leading-relaxed font-light">
                      {selectedProject.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-black uppercase tracking-widest text-merveille-dark">Points Forts</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedProject.features.map((feature: string) => (
                        <div key={feature} className="flex items-center text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-12 flex gap-4">
                    <button className="flex-1 btn-primary py-4">Demander un Devis</button>
                    <button 
                      onClick={(e) => toggleLike(selectedProject.id, e)}
                      className={`p-4 rounded-xl transition-all border ${likedProjects.includes(selectedProject.id) ? 'bg-red-50 text-red-500 border-red-200' : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'}`}
                    >
                      <Heart className={`h-6 w-6 ${likedProjects.includes(selectedProject.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stats Counter */}
      <section className="bg-merveille-gray/30 py-24 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black mb-16">Plus de <span className="text-merveille-orange">10 Ans</span> de confiance.</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { val: '150+', label: 'PROJETS FINIS' },
              { val: '24', label: 'VILLES' },
              { val: '98%', label: 'SATISFACTION' },
              { val: '1M+', label: 'M² BÂTIS' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-4xl md:text-6xl font-black text-merveille-dark mb-2">{s.val}</div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Realizations;
