import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Pencil, Box, Ruler, CheckCircle, Download, FileText, ArrowRight } from 'lucide-react';

const Architecture = () => {
  const services = [
    { title: 'Conception 2D', desc: 'Plans d\'exécution détaillés pour permis de construire et chantiers.', icon: Ruler },
    { title: 'Visualisation 3D', desc: 'Immersions réalistes pour visualiser votre projet avant le premier coup de pioche.', icon: Box },
    { title: 'Étude Béton Armé', desc: 'Calculs de structure rigoureux assurant la stabilité de vos édifices.', icon: CheckCircle },
  ];

  const plans = [
    { title: 'Villa Contemporaine R+1', type: 'Villa', size: '200m²', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800' },
    { title: 'Immeuble de Rapport', type: 'Immeuble', size: '1000m²', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800' },
    { title: 'Résidence de Luxe', type: 'Villa', size: '450m²', img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <section className="bg-merveille-dark py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-20" alt="Architecture Background" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-7xl font-black mb-6 md:mb-8 leading-tight">Concevoir <span className="text-merveille-orange">L'Espace</span></h1>
            <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed">
              Nos architectes créent des espaces qui allient fonctionnalité, esthétique contemporaine et respect des contraintes structurelles.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {services.map((s, i) => (
            <div key={i} className="group p-8 md:p-10 bg-white border border-gray-100 rounded-3xl shadow-lg hover:bg-merveille-dark hover:text-white transition-all duration-500">
              <div className="bg-merveille-orange/10 p-5 rounded-2xl w-fit mb-8 group-hover:bg-white/20">
                <s.icon className="h-10 w-10 text-merveille-orange" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
              <p className="text-gray-500 font-light group-hover:text-white/70 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio of Plans */}
      <section className="py-24 bg-merveille-gray/30 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl text-left">
              <span className="text-merveille-orange font-black uppercase tracking-widest text-sm mb-4 block">Catalogue</span>
              <h2 className="text-4xl font-black mb-0">Nos Modèles de Plans</h2>
            </div>
            <button className="flex items-center text-merveille-dark font-black uppercase tracking-widest text-xs group">
              Voir tout le catalogue <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((p, i) => (
              <div key={i} className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-xl">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-merveille-dark to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-merveille-orange mb-2">{p.type} — {p.size}</div>
                  <h4 className="text-xl font-bold mb-6">{p.title}</h4>
                  <button className="flex items-center justify-center space-x-3 w-full bg-white/10 backdrop-blur-md border border-white/20 py-3 rounded-xl hover:bg-white hover:text-merveille-dark transition-all">
                    <Download className="h-4 w-4" />
                    <span className="text-sm font-bold uppercase tracking-widest">Aperçu PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Study Process */}
      <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-merveille-dark rounded-[40px] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-merveille-orange rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" />
          <div className="relative z-10 text-center">
            <FileText className="h-16 w-16 text-merveille-orange mx-auto mb-8" />
            <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">Besoin d'une étude technique ?</h2>
            <p className="text-white/60 mb-12 text-lg font-light">
              Obtenez un devis précis pour vos plans d'architecture ou vos notes de calcul béton armé en 48 heures.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="btn-primary px-12 py-4 text-sm">Faire une Demande</button>
              <button className="bg-white/5 border border-white/10 hover:bg-white/10 px-12 py-4 rounded-md text-sm font-bold transition-all">Télécharger Tarifs</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Architecture;
