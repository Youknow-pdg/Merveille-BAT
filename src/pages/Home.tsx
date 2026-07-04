import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Home as HomeIcon, Building2, PencilRuler, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const expertises = [
    {
      title: 'Location & Gestion',
      desc: 'Trouvez le bien idéal ou confiez-nous la gestion de votre patrimoine immobilier avec sérénité.',
      icon: HomeIcon,
      path: '/location',
      img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Construction',
      desc: 'De la fondation aux finitions, nous bâtissons vos rêves avec une rigueur technique absolue.',
      icon: Building2,
      path: '/construction',
      img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Architecture & Design',
      desc: 'Conception de plans 2D/3D et études techniques pour des structures innovantes et durables.',
      icon: PencilRuler,
      path: '/architecture',
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const stats = [
    { label: 'Projets Réalisés', value: '150+', icon: CheckCircle2 },
    { label: 'Biens en Gestion', value: '300+', icon: TrendingUp },
    { label: 'Clients Satisfaits', value: '500+', icon: Users },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=2000" 
            alt="Modern Architecture" 
            className="w-full h-full object-cover brightness-[0.3]"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="text-merveille-orange font-bold tracking-[0.3em] uppercase text-sm mb-4 block">MerveilleBAT · Sénégal</span>
            <h1 className="text-5xl md:text-7xl text-white font-black leading-[1.1] mb-6">
              L'Art de <span className="text-merveille-orange">Construire</span> l'Avenir.
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-10 font-light leading-relaxed">
              Spécialisé dans l'immobilier, la construction et l'architecture à M'Bour et partout au Sénégal. Nous transformons vos visions en structures pérennes.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/devis" className="btn-primary flex items-center justify-center">
                Commencer un Projet <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/realisations" className="btn-secondary flex items-center justify-center">
                Voir nos Réalisations
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center py-2"
          >
            <div className="w-1 h-2 bg-white rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-merveille-dark py-12 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex items-center justify-center space-x-4 md:border-r last:border-r-0 border-white/10 md:pr-8 last:pr-0">
                <stat.icon className="h-10 w-10 text-merveille-orange shrink-0" />
                <div>
                  <div className="text-3xl font-display font-black text-white">{stat.value}</div>
                  <div className="text-white/50 text-[10px] uppercase tracking-widest font-bold">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-24 bg-merveille-gray/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4">Nos Pôles d'Expertise</h2>
            <div className="w-20 h-1.5 bg-merveille-orange mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {expertises.map((exp, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 flex flex-col h-full"
              >
                <div className="h-48 relative overflow-hidden">
                  <img src={exp.img} alt={exp.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-white p-3 rounded-xl shadow-lg">
                    <exp.icon className="h-6 w-6 text-merveille-orange" />
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-4">{exp.title}</h3>
                  <p className="text-gray-600 font-light mb-8 flex-grow leading-relaxed">
                    {exp.desc}
                  </p>
                  <Link to={exp.path} className="flex items-center text-merveille-blue font-bold group">
                    En savoir plus <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-merveille-gradient relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
            <div>
              <h2 className="text-3xl md:text-5xl text-white font-black mb-4">Prêt à lancer votre projet ?</h2>
              <p className="text-white/70 text-lg">Demandez une étude personnalisée et gratuite dès aujourd'hui.</p>
            </div>
            <Link to="/devis" className="btn-primary text-xl px-10 py-5">
              Demander mon Devis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
