import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-merveille-dark text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center bg-white p-1.5 rounded-xl shadow-sm inline-block">
              <img 
                src={`${import.meta.env.BASE_URL}images/logo.jpg`} 
                alt="MERVEILLEBAT" 
                className="h-16 w-auto relative z-10" 
                referrerPolicy="no-referrer" 
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              MerveilleBAT est votre partenaire de confiance au Sénégal pour tous vos projets immobiliers, de construction et d'architecture. Nous allions expertise technique et esthétique sahaléenne.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-merveille-orange transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-merveille-orange transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-merveille-orange transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-8 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-merveille-orange">Liens Rapides</h4>
            <ul className="space-y-4">
              {['Location', 'Construction', 'Architecture', 'Réalisations', 'Devis', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().normalize("NFD").replace(/[\u0300-\u031f]/g, "")}`} className="text-gray-400 hover:text-merveille-orange flex items-center group transition-colors">
                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-8 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-merveille-orange">Nos Services</h4>
            <ul className="space-y-4 text-gray-400">
              <li>Plans 2D & 3D</li>
              <li>Béton Armé</li>
              <li>Gestion Locative</li>
              <li>Promotion Immobilière</li>
              <li>Rénovation</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-8 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-merveille-orange">Nous Contacter</h4>
            <ul className="space-y-6">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-merveille-orange mr-4 shrink-0" />
                <span className="text-gray-400 text-sm">DIAMAGUENE 2, commune de M'Bour, Sénégal</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-merveille-orange mr-4 shrink-0" />
                <div className="text-gray-400 text-sm">
                  <p>+221 77 710 80 33</p>
                  <p>+221 75 001 10 00</p>
                </div>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-merveille-orange mr-4 shrink-0" />
                <span className="text-gray-400 text-sm">sambaddiop1@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} MERVEILLEBAT. Tous droits réservés. L'art de construire.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
