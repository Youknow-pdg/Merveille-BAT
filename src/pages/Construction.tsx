import React from 'react';
import { motion } from 'motion/react';
import { Hammer, HardHat, Ruler, ShieldCheck, Clock, Layers, ArrowRight } from 'lucide-react';

const Construction = () => {
  const services = [
    { title: 'Gros Œuvre', desc: 'Fondations, maçonnerie, béton armé et charpente pour une structure solide.', icon: Layers },
    { title: 'Second Œuvre', desc: 'Plomberie, électricité, menuiserie et finitions esthétiques de haute qualité.', icon: Hammer },
    { title: 'Rénovation', desc: 'Redonnez vie à vos anciens bâtiments avec nos techniques modernes.', icon: Ruler },
  ];

  const valueProps = [
    { title: 'Sécurité Maximale', desc: 'Normes de sécurité strictes sur tous nos chantiers.', icon: ShieldCheck },
    { title: 'Délais Respectés', desc: 'Gestion de projet rigoureuse pour livrer à temps.', icon: Clock },
    { title: 'Haut Standing', desc: 'Matériaux choisis parmi les meilleurs fournisseurs.', icon: HardHat },
  ];

  const currentProjects = [
    { name: 'Résidence Horizon', location: 'M\'Bour', progress: 75, img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800' },
    { name: 'Villa Sahel', location: 'Saly', progress: 30, img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="bg-merveille-dark py-20 md:py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-20" alt="Construction Background" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl text-center md:text-left"
          >
            <h1 className="text-4xl md:text-7xl font-black mb-6 md:mb-8 leading-tight">Expertise en <span className="text-merveille-orange">Bâtiment</span></h1>
            <p className="text-lg md:text-xl text-white/70 mb-8 md:mb-10 leading-relaxed font-light">
              De l'étude de sol à la remise des clés, MerveilleBAT coordonne l'intégralité de vos projets de construction avec une précision d'ingénierie.
            </p>
            <button className="btn-primary w-full md:w-auto">Parlons de votre Chantier</button>
          </motion.div>
        </div>
      </section>

      {/* Process/Services */}
      <section className="py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-merveille-orange font-black uppercase tracking-widest text-sm mb-4 block">Notre Expertise</span>
            <h2 className="text-3xl md:text-4xl font-black mb-6 md:mb-8">Un Savoir-faire Complet.</h2>
            <p className="text-gray-600 mb-8 md:mb-12 text-lg leading-relaxed font-light">
              Nous maîtrisons chaque étape de la construction pour garantir la durabilité et l'esthétique de vos édifices. Notre équipe d'ingénieurs et d'artisans qualifiés travaille en synergie.
            </p>
            <div className="space-y-6 md:space-y-8">
              {services.map((s, i) => (
                <div key={i} className="flex gap-6">
                  <div className="bg-merveille-dark/5 p-4 rounded-2xl h-fit">
                    <s.icon className="h-8 w-8 text-merveille-dark" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{s.title}</h4>
                    <p className="text-gray-500 font-light">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?auto=format&fit=crop&q=80&w=1000" className="rounded-3xl shadow-2xl" alt="Construction detail" />
            <div className="absolute -bottom-10 -left-10 bg-merveille-orange p-10 rounded-3xl text-white hidden md:block shadow-2xl">
              <span className="text-5xl font-black block mb-2">15+</span>
              <span className="uppercase tracking-widest text-xs font-bold">Années d'Expérience</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-merveille-gray/30 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueProps.map((v, i) => (
              <div key={i} className="bg-white p-10 rounded-2xl text-center shadow-sm border border-gray-100">
                <v.icon className="h-12 w-12 text-merveille-orange mx-auto mb-6" />
                <h4 className="text-xl font-bold mb-4">{v.title}</h4>
                <p className="text-gray-500 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects in Progress */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black mb-16 text-center">Chantiers en Cours</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {currentProjects.map((p, i) => (
            <div key={i} className="group bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
              <div className="h-64 overflow-hidden">
                <img src={p.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h4 className="text-2xl font-bold mb-1">{p.name}</h4>
                    <span className="text-gray-400 text-sm font-medium">{p.location}</span>
                  </div>
                  <span className="text-merveille-orange font-black text-2xl">{p.progress}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${p.progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-merveille-orange"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Construction;
